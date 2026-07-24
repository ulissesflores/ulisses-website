import fs from 'node:fs';
import path from 'node:path';
import { normalizeForSearch, normalizeLineBreaks } from './text.mjs';
import { CATEGORY_TAGS, DEFAULT_ARTICLE_SOURCE_DIRS, NOISY_SOURCE_PATTERNS, SLUG_TOPIC_OVERRIDES, STOPWORDS } from './constants.mjs';

function tokenize(value) {
  return normalizeForSearch(value)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

export function getArticleSourceDirs() {
  const fromEnv = process.env.UPKF_ARTICLE_SOURCE_DIRS
    ? process.env.UPKF_ARTICLE_SOURCE_DIRS.split(path.delimiter).map((item) => item.trim())
    : [];

  const dirs = fromEnv.length > 0 ? fromEnv : DEFAULT_ARTICLE_SOURCE_DIRS;
  return dirs.filter((dir) => fs.existsSync(dir));
}

function listMarkdownFiles(rootDir, maxDepth = 4) {
  const files = [];

  const visit = (dir, depth) => {
    if (depth > maxDepth) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath, depth + 1);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        files.push(fullPath);
      }
    }
  };

  visit(rootDir, 0);
  return files;
}

function shouldUseSourceFile(filePath) {
  const normalized = normalizeForSearch(filePath);
  return !NOISY_SOURCE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function stripDataImageReferences(text) {
  return text
    .replace(/^\[image\d+\]:\s*<data:image\/[^\n>]+>.*$/gim, '')
    .replace(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g, '');
}

function looksNoisySnippet(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return true;
  }

  if (trimmed.includes(':--') || trimmed.includes('http://') || trimmed.includes('https://')) {
    const urlCount = (trimmed.match(/https?:\/\//g) || []).length;
    if (urlCount >= 2) {
      return true;
    }
  }

  if (/^#?\s*T\s+Title\s+datePublished/i.test(trimmed)) {
    return true;
  }

  if ((trimmed.match(/\|/g) || []).length >= 6) {
    return true;
  }

  if ((trimmed.match(/[A-Za-z]/g) || []).length < 80) {
    return true;
  }

  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (digitCount / Math.max(trimmed.length, 1) > 0.15) {
    return true;
  }

  const punctuationCount = (trimmed.match(/[^A-Za-z0-9\s]/g) || []).length;
  if (punctuationCount / Math.max(trimmed.length, 1) > 0.2) {
    return true;
  }

  return false;
}

function cleanMarkdownChunk(chunk) {
  return chunk
    .replace(/^\[image\d+\]:.*$/gim, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/`{1,3}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const matches = normalized.match(/[^.!?]+[.!?]?/g);
  return matches ? matches.map((item) => item.trim()).filter(Boolean) : [normalized];
}

function sentenceHasUsefulSignal(sentence) {
  if (!sentence || sentence.length < 70 || sentence.length > 420) {
    return false;
  }

  if (looksNoisySnippet(sentence)) {
    return false;
  }

  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length < 10) {
    return false;
  }

  return true;
}

export function loadLocalCorpus(sourceDirs, excludePath) {
  const snippets = [];
  const files = [];
  const usedFiles = new Set();

  for (const dir of sourceDirs) {
    files.push(...listMarkdownFiles(dir));
  }

  const uniqueFiles = Array.from(new Set(files));
  const limitedFiles = uniqueFiles.slice(0, 400);

  for (const file of limitedFiles) {
    if (path.resolve(file) === path.resolve(excludePath)) {
      continue;
    }
    if (!shouldUseSourceFile(file)) {
      continue;
    }
    usedFiles.add(file);

    let text = '';
    try {
      text = normalizeLineBreaks(fs.readFileSync(file, 'utf8'));
    } catch {
      continue;
    }

    const sanitizedText = stripDataImageReferences(text);

    const chunks = sanitizedText.split(/\n{2,}/);
    for (const chunk of chunks) {
      const cleaned = cleanMarkdownChunk(chunk);
      if (cleaned.length < 180 || cleaned.length > 1900) {
        continue;
      }
      if (looksNoisySnippet(cleaned)) {
        continue;
      }

      const chunkTokens = new Set(tokenize(cleaned));
      snippets.push({
        sourceFile: file,
        sourceName: path.basename(file),
        text: cleaned,
        normalized: normalizeForSearch(cleaned),
        tokens: chunkTokens,
      });
    }
  }

  return {
    sourceDirs,
    snippetCount: snippets.length,
    fileCount: usedFiles.size,
    snippets,
  };
}

function extractPublicationKeywords(publicationRow) {
  const fromTitle = tokenize(publicationRow.title);
  const fromSlug = tokenize(publicationRow.slug.replace(/-/g, ' '));
  const fromCategory = CATEGORY_TAGS[publicationRow.category]
    .map((tag) => normalizeForSearch(tag))
    .flatMap((tag) => tokenize(tag))
    .slice(0, 3);

  const merged = Array.from(new Set([...fromTitle, ...fromSlug, ...fromCategory])).slice(0, 12);
  return merged;
}

function extractSlugAnchorTokens(publicationRow) {
  const raw = publicationRow.slug
    .split('-')
    .filter((token) => token && !/^\d+$/.test(token))
    .map((token) => normalizeForSearch(token))
    .filter((token) => token.length >= 5);

  return Array.from(new Set(raw)).slice(0, 4);
}

function scoreSnippetForPublication(snippet, keywords, primaryKeywords, anchorKeywords) {
  let overlap = 0;
  for (const keyword of keywords) {
    if (snippet.tokens.has(keyword)) {
      overlap += 1;
    }
  }

  let primaryOverlap = 0;
  for (const keyword of primaryKeywords) {
    if (snippet.tokens.has(keyword)) {
      primaryOverlap += 1;
    }
  }

  let score = overlap * 3 + primaryOverlap * 4;
  if (primaryOverlap === 0 && overlap <= 1) {
    score -= 8;
  }

  if (anchorKeywords.length > 0) {
    let anchorOverlap = 0;
    for (const anchor of anchorKeywords) {
      if (snippet.tokens.has(anchor)) {
        anchorOverlap += 1;
      }
    }
    if (anchorOverlap === 0) {
      score -= 12;
    } else {
      score += anchorOverlap * 4;
    }
  }

  const qualitySignals = ['resumo', 'abstract', 'metodologia', 'method', 'resultado', 'results', 'conclusao'];
  for (const signal of qualitySignals) {
    if (snippet.normalized.includes(signal)) {
      score += 1;
    }
  }

  const filename = normalizeForSearch(snippet.sourceName);
  for (const keyword of keywords) {
    if (filename.includes(keyword)) {
      score += 2;
    }
  }

  if (looksNoisySnippet(snippet.text)) {
    score -= 10;
  }

  return score;
}

export function selectEvidenceSnippets(publicationRow, corpus) {
  const keywords = extractPublicationKeywords(publicationRow);
  const primaryKeywords = tokenize(publicationRow.title).slice(0, 6);
  const anchorKeywords = extractSlugAnchorTokens(publicationRow);
  const scored = corpus.snippets
    .map((snippet) => ({
      snippet,
      score: scoreSnippetForPublication(snippet, keywords, primaryKeywords, anchorKeywords),
    }))
    .filter((entry) => entry.score >= 8)
    .sort((a, b) => b.score - a.score);

  const selected = [];
  const usedFiles = new Set();

  for (const entry of scored) {
    if (selected.length >= 5) {
      break;
    }

    if (usedFiles.has(entry.snippet.sourceFile) && entry.score < 8) {
      continue;
    }

    if (!sentenceHasUsefulSignal(entry.snippet.text)) {
      continue;
    }

    usedFiles.add(entry.snippet.sourceFile);
    selected.push(entry);
  }

  return {
    keywords,
    primaryKeywords,
    anchorKeywords,
    snippets: selected,
  };
}

function shortSentenceFromSnippet(snippetText, fallback) {
  const sentences = splitSentences(snippetText);
  if (!sentences || sentences.length === 0) {
    return fallback;
  }

  const preferred = sentences.find((sentence) => sentenceHasUsefulSignal(sentence));
  const sentence = (preferred || sentences[0] || '').trim();
  if (!sentence || sentence.length < 40) {
    return fallback;
  }

  const cleaned = sentence
    .replace(/[*_`#]/g, ' ')
    .replace(/\\=/g, '=')
    .replace(/\\+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!sentenceHasUsefulSignal(cleaned)) {
    return fallback;
  }

  return cleaned.slice(0, 420).trim();
}

function categoryBaseProfile(category) {
  if (category === 'whitepapers') {
    return {
      focus:
        'Documento tecnico orientado a arquitetura, risco de implementacao e criterios de engenharia para ambientes de missao critica.',
      problem:
        'O problema central envolve equilibrio entre desempenho, seguranca, custo operacional e governanca de infraestrutura.',
      method:
        'Analise comparativa de alternativas arquiteturais com criterios de confiabilidade, observabilidade e capacidade de escala.',
      result:
        'A proposta indica caminhos tecnicos para reduzir risco operacional e melhorar previsibilidade de adocao.',
      discussion:
        'Os trade-offs sao explicitados para suportar decisoes de engenharia e gestao com base em evidencias.',
      application:
        'A aplicacao pratica cobre roadmap de implementacao, requisitos de compliance e operacao em producao.',
      contributions: [
        'Definicao de arquitetura de referencia aderente a cenarios reais de operacao.',
        'Matriz de risco e mitigacao para etapas de implantacao.',
        'Guia de decisao para priorizacao tecnica com foco em resiliencia.',
      ],
      references: ['NIST', 'ISO/IEC standards', 'Architecture reference literature'],
    };
  }

  if (category === 'essays') {
    return {
      focus:
        'Ensaio academico de recorte historico-critico, com articulacao entre fundamentos conceituais e implicacoes contemporaneas.',
      problem:
        'O debate publico sobre o tema tende a simplificacoes, demandando tratamento metodologico e rigor de fontes.',
      method:
        'Revisao argumentativa e historica com confronto de interpretacoes e delimitacao de pressupostos epistemologicos.',
      result:
        'O texto organiza um quadro analitico coerente e identifica implicacoes teoricas e praticas do tema estudado.',
      discussion:
        'A discussao explicita convergencias e tensoes entre escolas interpretativas sem reduzir a complexidade do objeto.',
      application:
        'Aplicavel em ensino superior, pesquisa interdisciplinar e formacao intelectual orientada por metodo.',
      contributions: [
        'Sistematizacao de referencias e correntes interpretativas relevantes.',
        'Metodo de leitura critica para reduzir anacronismos e vieses.',
        'Tradução de conceitos para debates contemporaneos de alta relevancia social.',
      ],
      references: ['Hermeneutics literature', 'Historical-critical methodology', 'Interdisciplinary studies'],
    };
  }

  return {
    focus:
      'Pesquisa cientifica orientada por metodo, com foco em modelagem, avaliacao de desempenho e aplicabilidade operacional.',
    problem:
      'O desafio investigado envolve alta complexidade, variabilidade de dados e necessidade de decisoes tecnicas auditaveis.',
    method:
      'Metodologia estruturada com desenho experimental, criterios de comparacao e verificacao de reproducibilidade.',
    result:
      'Os resultados indicam ganhos mensuraveis em robustez analitica e suporte a tomada de decisao baseada em evidencia.',
    discussion:
      'A discussao confronta os achados com literatura correlata e define limites de validade para cenarios reais.',
    application:
      'O estudo apoia engenharia de produto, governanca de risco e estrategia de implementacao em ambiente produtivo.',
    contributions: [
      'Delimitacao formal do problema e hipoteses de trabalho.',
      'Estrategia metodologica replicavel para avaliacao tecnica.',
      'Diretrizes de adocao para contexto operacional de alta criticidade.',
    ],
    references: ['W3C JSON-LD 1.1', 'Schema.org', 'NIST AI RMF'],
  };
}

export function resolveTopicProfile(publicationRow) {
  const base = categoryBaseProfile(publicationRow.category);
  const override = SLUG_TOPIC_OVERRIDES[publicationRow.slug] || {};
  const contributions = Array.isArray(override.contributions) ? override.contributions : base.contributions;
  const references = Array.from(new Set([...(base.references || []), ...((override.references || []))]));

  return {
    ...base,
    ...override,
    contributions,
    references,
  };
}

export function getEvidenceSentence(evidence, index, fallback) {
  const entry = evidence.snippets[index];
  if (!entry || entry.score < 9) {
    return fallback;
  }
  return shortSentenceFromSnippet(entry.snippet.text, fallback);
}

export function inferResearchQuestion(publicationRow) {
  if (publicationRow.category === 'research') {
    return `Como a abordagem proposta em "${publicationRow.title}" pode reduzir risco sistemico e ampliar confiabilidade decisoria em ambiente real?`;
  }
  if (publicationRow.category === 'whitepapers') {
    return `Quais decisoes arquiteturais derivadas de "${publicationRow.title}" maximizam resiliencia operacional sem comprometer seguranca, custo total de propriedade e auditabilidade?`;
  }
  return `Quais fundamentos conceituais permitem interpretar "${publicationRow.title}" com rigor historico-critico e relevancia contemporanea?`;
}

export function inferLimitations(publicationRow) {
  if (publicationRow.category === 'research') {
    return [
      'A generalizacao dos achados depende de replicacao em amostras adicionais, com diferentes regimes de dados e horizontes temporais.',
      'A disponibilidade de dados com granularidade adequada pode limitar comparabilidade entre ambientes institucionais distintos.',
    ];
  }
  if (publicationRow.category === 'whitepapers') {
    return [
      'A transferencia integral do blueprint depende de maturidade operacional e da capacidade local de engenharia e governanca.',
      'Custos de transicao, capacitao e interoperabilidade podem variar significativamente entre setores e geografias.',
    ];
  }
  return [
    'A inferencia historico-critica esta condicionada ao estado das fontes e ao grau de disputa interpretativa entre escolas.',
    'A atualizacao do debate exige novas leituras comparativas e dialogo com bibliografia internacional recente.',
  ];
}

export function inferFutureAgenda(publicationRow) {
  if (publicationRow.category === 'research') {
    return [
      'Replicar o estudo em novos contextos operacionais com desenho quasi-experimental.',
      'Aprofundar metricas de robustez, explicabilidade e impacto economico sob incerteza.',
      'Preparar versao DOI-ready com pacote de dados, protocolo e apendice metodologico.',
    ];
  }
  if (publicationRow.category === 'whitepapers') {
    return [
      'Executar pilotos controlados com metricas de SLO, custo de ciclo de vida e risco residual.',
      'Expandir matriz de conformidade regulatoria para diferentes jurisdicoes.',
      'Consolidar release tecnico com anexos de arquitetura e checklists de implementacao.',
    ];
  }
  return [
    'Ampliar confronto com bibliografia de fronteira e revisoes sistematicas tematicas.',
    'Conectar o arcabouco teorico a estudos de caso historicos adicionais.',
    'Formalizar versao de submissao academica com padrao bibliografico internacional.',
  ];
}

export function selectScientificReferences(publicationRow, topicProfile, referencesLibrary) {
  const fromLibrary = Array.isArray(referencesLibrary[publicationRow.slug])
    ? referencesLibrary[publicationRow.slug]
    : [];
  if (fromLibrary.length > 0) {
    return fromLibrary.slice(0, 12);
  }

  return topicProfile.references.map((reference) => ({
    citation: reference,
    url: undefined,
  }));
}

export function buildSummary(publicationRow, evidence, topicProfile) {
  const researchQuestion = inferResearchQuestion(publicationRow);
  return `${topicProfile.focus} ${topicProfile.result} Pergunta central: ${researchQuestion} A pagina publica apresenta sintese cientifica e o PDF consolidado contem a versao completa para citacao formal.`;
}

export function buildLandingContent(publicationRow, evidence, topicProfile) {
  const researchQuestion = inferResearchQuestion(publicationRow);
  const overview = `Esta pagina apresenta uma sintese cientifica de "${publicationRow.title}", estruturada para leitura academica, auditoria metodologica e preparo DOI-ready.`;
  const problem = `${topicProfile.problem} Pergunta de pesquisa: ${researchQuestion}`;

  const contributions = [...topicProfile.contributions].slice(0, 3).map((line) =>
    line.replace(/\s+/g, ' ').trim(),
  );

  const applications = `${topicProfile.application} A versao completa inclui implicacoes para engenharia, governanca e reproducibilidade.`;

  const downloadPitch =
    'O PDF completo apresenta estrutura cientifica formal (Resumo, Introducao, Desenvolvimento, Consideracoes Finais e Referencias), com bibliografia verificavel por URL/DOI.';

  return {
    overview,
    problem,
    contributions,
    applications,
    downloadPitch,
  };
}
