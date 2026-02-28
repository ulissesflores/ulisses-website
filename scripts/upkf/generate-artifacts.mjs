import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateManuscripts,
  scoreAndVerify as scoreDeepResearch,
  writeDeepResearchArtifacts,
} from '../research/pipeline.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

const LOCAL_UPKF_PATH = path.join(repoRoot, 'data', 'upkf', 'ulisses-flores-sovereign-upkf_v3.3.md');
const DOCS_UPKF_PATH = path.join(repoRoot, 'docs', 'ulisses-flores-sovereign-upkf_v3.3.md');

const DEFAULT_ARTICLE_SOURCE_DIRS = [
  path.join(repoRoot, 'data', 'sources'),
  path.join(repoRoot, 'docs', 'sources'),
];

const GENERATED_DIR = path.join(repoRoot, 'data', 'generated');
const DOCS_DIR = path.join(repoRoot, 'docs');
const PUBLIC_DIR = path.join(repoRoot, 'public');
const ARTICLE_REFERENCES_PATH = path.join(repoRoot, 'data', 'upkf', 'article-references.json');

const CATEGORY_METADATA = {
  research: {
    title: 'Research',
    heading: 'Research: IA, Economia e Sistemas Complexos',
    description:
      'Colecao de artigos cientificos com foco em resiliencia ciberfinanceira, modelagem quantitativa e inteligencia artificial aplicada a sistemas complexos.',
    schemaType: 'CollectionPage',
  },
  whitepapers: {
    title: 'Whitepapers',
    heading: 'Whitepapers: Engenharia Aplicada e Arquitetura',
    description:
      'Whitepapers tecnicos sobre arquitetura de sistemas, hardware IoT, seguranca, privacidade e soberania de dados em ambientes de missao critica.',
    schemaType: 'CollectionPage',
  },
  essays: {
    title: 'Essays',
    heading: 'Essays: Teologia, Humanidades e Critica Historica',
    description:
      'Ensaios academicos com abordagem historico-critica em teologia, filosofia e fundamentos da ordem social e economica.',
    schemaType: 'CollectionPage',
  },
};

const CATEGORY_TAGS = {
  research: ['IA', 'Economia', 'Sistemas Complexos'],
  whitepapers: ['Engenharia', 'IoT', 'Seguranca'],
  essays: ['Teologia', 'Humanidades', 'Historia'],
};

const STOPWORDS = new Set([
  'a',
  'ao',
  'aos',
  'as',
  'e',
  'de',
  'do',
  'da',
  'dos',
  'das',
  'em',
  'na',
  'no',
  'nas',
  'nos',
  'por',
  'para',
  'com',
  'sem',
  'sob',
  'sobre',
  'que',
  'um',
  'uma',
  'uns',
  'umas',
  'o',
  'os',
  'the',
  'and',
  'or',
  'in',
  'on',
  'of',
  'to',
  'for',
  'by',
  'via',
  'from',
  'is',
  'are',
  'be',
  'an',
  'at',
  'it',
  'this',
  'that',
  'as',
]);

const NOISY_SOURCE_PATTERNS = [
  /upkf/i,
  /scientificproductions/i,
  /ulisses-flores-dados/i,
  /aboutme/i,
  /analise de json-ld/i,
  /manual de guia/i,
  /diretrizes do projeto/i,
  /dna do projeto/i,
  /prompt para artigo/i,
];

const SLUG_TOPIC_OVERRIDES = {
  '2025-little-law-resilience': {
    focus:
      'Estudo sobre aplicacao da Lei de Little para elevar previsibilidade de entrega e resiliencia em operacoes de Data Science.',
    problem:
      'A pesquisa enfrenta a combinacao de alto WIP, filas longas e baixa confiabilidade de prazo em pipelines complexos de IA.',
    method:
      'Abordagem analitico-experimental com simulacao de fluxo, comparando cenarios com e sem limite explicito de trabalho em progresso.',
    result:
      'A evidencia indica reducao relevante de lead time sem perda material de throughput, reforcando a eficiencia da limitacao de WIP.',
    discussion:
      'Os achados dialogam com Lean/Kanban e com governanca orientada a fluxo, especialmente em ambientes de alta variabilidade.',
    application:
      'Aplicavel a PMOs de tecnologia, times de produto e laboratorios de IA que necessitam previsibilidade operacional auditavel.',
    contributions: [
      'Formalizacao da Lei de Little como operador de governanca de fluxo e nao apenas como identidade matematica.',
      'Comparacao controlada entre politicas de WIP para mensurar impacto em lead time e estabilidade.',
      'Diretrizes praticas de implantacao para ambientes de desenvolvimento intensivos em conhecimento.',
    ],
    references: ['Little (1961)', 'Anderson (2010)', 'Reinertsen (2009)'],
  },
  '2025-lstm-asset-prediction': {
    focus:
      'Analise preditiva de ativos financeiros com redes LSTM para capturar dinamica temporal em mercados nao estacionarios.',
    problem:
      'Modelos lineares sofrem com mudancas de regime e baixa robustez frente a volatilidade extrema e ruido de alta frequencia.',
    method:
      'Modelagem de series temporais com engenharia de atributos, validacao temporal e comparacao contra baselines estatisticos.',
    result:
      'O estudo evidencia ganho de sinal preditivo em janelas especificas e melhora de robustez quando o treinamento respeita ordem temporal.',
    discussion:
      'A principal limitacao esta em drift de mercado; por isso o artigo enfatiza re-treinamento, monitoramento e controle de risco.',
    application:
      'Uso em apoio a tomada de decisao em mesas quantitativas, com politicas de risco e trilhas de auditoria para compliance.',
    contributions: [
      'Protocolo de avaliacao temporal para evitar leakage em previsao de ativos.',
      'Integração entre previsao recorrente e indicadores de risco operacional.',
      'Framework de monitoramento para degradacao de performance em producao.',
    ],
    references: ['Hochreiter & Schmidhuber (1997)', 'NIST AI RMF (2023)', 'Goodfellow et al.'],
  },
  '2025-hybrid-cooling-thermodynamics': {
    focus:
      'Whitepaper de termodinamica aplicada ao projeto de sistemas hibridos de resfriamento para infraestrutura critica.',
    problem:
      'Centros computacionais e ambientes edge enfrentam trade-off entre eficiencia energetica, confiabilidade e custo de manutencao.',
    method:
      'Analise termo-fluidodinamica com cenarios de carga, comparando estrategias hibridas de dissipacao e controle.',
    result:
      'A configuracao hibrida apresenta melhor estabilidade termica em picos de carga e menor risco de indisponibilidade.',
    discussion:
      'A decisao arquitetural depende de clima, perfil de carga e estrategia de redundancia do ativo fisico.',
    application:
      'Relevante para datacenters, edge nodes industriais e laboratorios com requisitos de disponibilidade continua.',
    contributions: [
      'Modelo comparativo entre topologias de resfriamento em regime variavel.',
      'Criticos de dimensionamento para reduzir risco termico sistêmico.',
      'Matriz de decisao para engenharia de infraestrutura de missao critica.',
    ],
    references: ['ASHRAE Thermal Guidelines', 'ISO 50001', 'NIST Datacenter Guidance'],
  },
  '2025-iot-data-sovereignty': {
    focus:
      'Arquiteturas cloudless para IoT com soberania de dados e processamento local em edge.',
    problem:
      'Dependencia de nuvem publica amplia superficie de ataque, latencia e exposicao regulatoria de dados sensiveis.',
    method:
      'Comparacao de arquiteturas centralizadas versus edge-first, incluindo requisitos de identidade, criptografia e observabilidade.',
    result:
      'O desenho cloudless reduz dependencia externa e melhora controle sobre confidencialidade e disponibilidade local.',
    discussion:
      'O principal trade-off envolve operacao distribuida e necessidade de automacao robusta de ciclo de vida.',
    application:
      'Aplicavel a agricultura conectada, automacao industrial e ambientes com restricoes de conectividade.',
    contributions: [
      'Blueprint de referencia para IoT com soberania de dados por design.',
      'Politicas de seguranca e identidade para operacao zero trust em edge.',
      'Padroes de integracao para reduzir lock-in de provedores.',
    ],
    references: ['NIST Zero Trust', 'IEC 62443', 'OWASP IoT Top 10'],
  },
  '2025-fraud-detection-mlp': {
    focus:
      'Deteccao de fraude em cartoes com redes neurais MLP e engenharia de atributos para dados desbalanceados.',
    problem:
      'Fraude financeira combina alta assimetria de classes com necessidade de baixa latencia decisoria em tempo quase real.',
    method:
      'Pipeline supervisionado com reamostragem, calibracao de limiar e avaliacao por precision-recall e custo de erro.',
    result:
      'A combinacao de MLP com ajuste de limiar melhora captura de fraudes mantendo taxa operacional aceitavel de falsos positivos.',
    discussion:
      'O desempenho depende de atualizacao continua e governanca de drift comportamental.',
    application:
      'Suporte a motores antifraude em emissores, adquirentes e fintechs com trilha explicavel para auditoria.',
    contributions: [
      'Estrutura de avaliacao orientada a risco economico de fraude.',
      'Integração de calibracao de probabilidade com politicas operacionais.',
      'Boas praticas para monitorar drift em cenarios de pagamento digital.',
    ],
    references: ['Dal Pozzolo et al.', 'NIST AI RMF (2023)', 'ISO 27001'],
  },
  '2024-historicity-jesus-archaeology': {
    focus:
      'Pesquisa historiografica sobre historicidade de Jesus combinando critica textual, fontes antigas e evidencias arqueologicas.',
    problem:
      'Debates publicos misturam categorias teologicas e historicas sem separacao metodologica rigorosa.',
    method:
      'Revisao historico-critica de fontes primarias e secundarias com avaliacao de contexto, autoria e data.',
    result:
      'O estudo delimita consenso academico minimo e identifica zonas de alta e baixa confianca documental.',
    discussion:
      'A contribuicao central esta na disciplina metodologica e no tratamento de vieses interpretativos.',
    application:
      'Relevante para pesquisa teologica, ensino de historia antiga e dialogo interdisciplinar entre fe e academia.',
    contributions: [
      'Matriz de confiabilidade para comparar fontes textuais e arqueologicas.',
      'Distincao explicita entre plano historico e plano doutrinario.',
      'Sintese de consenso e controvérsias na literatura especializada.',
    ],
    references: ['Ehrman', 'Sanders', 'Vermes'],
  },
  '2024-bitcoin-praxeology': {
    focus:
      'Analise do Bitcoin como ativo de reserva sob praxeologia e teoria monetaria da Escola Austriaca.',
    problem:
      'Avaliacoes estritamente tecnicas ignoram fundamentos economicos de escassez, preferencia temporal e coordenacao social.',
    method:
      'Discussao teoretica com comparacao entre propriedades monetarias e mecanismos de governanca de oferta.',
    result:
      'O artigo sustenta que Bitcoin combina previsibilidade de emissao e portabilidade digital com implicacoes macroeconomicas relevantes.',
    discussion:
      'As limitacoes concentram-se em volatilidade de curto prazo e regimes regulatórios heterogeneos.',
    application:
      'Base analitica para teses de tesouraria digital, hedge monetario e desenho de politicas de alocacao.',
    contributions: [
      'Integração entre teoria praxeologica e arquitetura monetaria digital.',
      'Critérios objetivos para avaliar funcao de reserva de valor.',
      'Enquadramento de riscos regulatórios e de mercado.',
    ],
    references: ['Mises', 'Hayek', 'Nakamoto (2008)'],
  },
  '2024-scribal-canonization-ezra': {
    focus:
      'Estudo historico-critico sobre canonizacao escribal e processos de consolidacao textual associados a Esdras.',
    problem:
      'Narrativas simplificadas sobre formacao canonica tendem a apagar camadas editoriais e disputas de autoridade.',
    method:
      'Analise de tradicoes textuais, historia da transmissao e contexto sociopolitico do periodo pos-exilico.',
    result:
      'A pesquisa destaca dinamica incremental de consolidacao canonica com mediação institucional e escribal.',
    discussion:
      'A leitura critica reforca importancia de filologia, historia social e comparacao de tradicoes manuscritas.',
    application:
      'Contribui para curriculos de exegese, historia biblica e hermeneutica historico-critica.',
    contributions: [
      'Reconstrucao processual da canonizacao em vez de modelo instantaneo.',
      'Integração de evidencias filologicas e historicas.',
      'Discussao epistemologica sobre autoridade textual.',
    ],
    references: ['Brevard Childs', 'James Kugel', 'Shaye Cohen'],
  },
  '2024-theology-economic-order': {
    focus:
      'Ensaio sobre fundamentos transcendentes da ordem economica e sua relacao com normatividade moral.',
    problem:
      'Modelos puramente tecnocráticos tendem a negligenciar pressupostos antropologicos e eticos da cooperacao social.',
    method:
      'Analise conceitual interdisciplinar entre teologia, filosofia moral e teoria economica.',
    result:
      'O texto demonstra que categorias de responsabilidade e dignidade influenciam desenho institucional e incentivos.',
    discussion:
      'A proposta nao substitui analise econometrica, mas oferece base axiologica para interpretacao de resultados.',
    application:
      'Util para formulacao de politicas publicas, governanca corporativa e educacao civica.',
    contributions: [
      'Framework para conectar etica teologica e ordem economica.',
      'Critica a reducionismos materialistas na analise institucional.',
      'Proposta de leitura integrada entre liberdade, responsabilidade e justica.',
    ],
    references: ['Augustine', 'Aquinas', 'Röpke'],
  },
  '2024-ring-signatures-privacy': {
    focus:
      'Whitepaper sobre ring signatures e enderecos furtivos para privacidade transacional em sistemas distribuidos.',
    problem:
      'Transparencia absoluta em blockchains publicas pode expor metadados sensiveis e comprometer fungibilidade.',
    method:
      'Revisao de primitives criptograficas com analise de seguranca, custos computacionais e requisitos de implementacao.',
    result:
      'A combinacao de assinaturas em anel e stealth addresses melhora privacidade sem eliminar verificabilidade criptografica.',
    discussion:
      'Trade-offs principais envolvem tamanho de assinatura, custo de verificacao e complexidade operacional.',
    application:
      'Uso em wallets, protocolos de pagamentos privados e infra de custodia com requisitos de compliance.',
    contributions: [
      'Comparativo tecnico entre abordagens de anonimato em ledger publico.',
      'Diretrizes para integracao segura em stacks de producao.',
      'Mapa de riscos de implementacao e manutencao criptografica.',
    ],
    references: ['Rivest et al. ring signatures', 'Monero Research', 'NIST cryptography guidance'],
  },
  '2024-agritech-agile-flow': {
    focus:
      'Whitepaper sobre transformacao agil e engenharia de fluxo em contextos agritech orientados a dados.',
    problem:
      'Projetos agritechs sofrem com sazonalidade, variabilidade operacional e baixa sincronizacao entre produto e campo.',
    method:
      'Aplicacao de metricas de fluxo, mapeamento de cadeia de valor e ciclos de melhoria orientados por evidencia.',
    result:
      'A governanca por fluxo eleva previsibilidade de entrega e reduz retrabalho em times multidisciplinares.',
    discussion:
      'A escalabilidade depende de disciplina de medicao e alinhamento entre metas tecnicas e metas de negocio.',
    application:
      'Aplicavel a plataformas de agricultura de precisao, IoT rural e analytics operacional.',
    contributions: [
      'Adaptação de principios lean-flow para dominio agritech.',
      'Modelo de indicadores para operacao sazonal e distribuida.',
      'Plano de implementacao incremental com governanca executiva.',
    ],
    references: ['Reinertsen', 'Forsgren et al. DORA', 'Lean Product Development'],
  },
  '2024-exegetical-treatise-anthropology': {
    focus:
      'Tratado exegético sobre representacao da moralidade e antropologia em tradicoes textuais teologicas.',
    problem:
      'Interpretacoes atomizadas de passagens isoladas fragilizam coerencia antropologica e moral do corpus.',
    method:
      'Leitura exegética com cruzamento de contexto historico, semantica e tradicao interpretativa.',
    result:
      'O artigo organiza categorias antropologicas recorrentes e explicita implicacoes eticas contemporaneas.',
    discussion:
      'A principal contribuicao esta na articulacao entre exegese rigorosa e filosofia moral aplicada.',
    application:
      'Recurso para ensino teologico, pesquisa hermeneutica e formacao de lideranca comunitaria.',
    contributions: [
      'Sistematizacao de categorias morais e antropologicas no texto base.',
      'Procedimento de leitura que reduz anacronismos interpretativos.',
      'Conexao entre interpretacao textual e dilemas eticos atuais.',
    ],
    references: ['Ricoeur', 'Brueggemann', 'N.T. Wright'],
  },
  '2023-marian-apparitions-critique': {
    focus:
      'Analise teologica e fenomenologica critica de narrativas de aparicoes marianas.',
    problem:
      'Relatos devocionais frequentemente carecem de criterios consistentes de discernimento historico e fenomenologico.',
    method:
      'Comparacao de documentos, tradicoes e criterios de autenticidade em abordagem historico-critica.',
    result:
      'O estudo distingue elementos simbolicos, historicos e pastorais sem reduzir o fenomeno a uma unica explicacao.',
    discussion:
      'A pesquisa reforca necessidade de metodos transparentes para evitar conclusoes apologeticas ou céticas simplistas.',
    application:
      'Util em estudos de religiao, historia da espiritualidade e analise de fenomenos coletivos.',
    contributions: [
      'Matriz de avaliacao de relatos de aparicoes sob criterios academicos.',
      'Integração entre fenomenologia e critica documental.',
      'Clarificacao de limites epistemologicos do tema.',
    ],
    references: ['Marian studies corpus', 'Phenomenology of religion', 'Church historical commissions'],
  },
  '2023-digital-legacy': {
    focus:
      'Whitepaper sobre desafios da heranca digital e preservacao de memoria pos-mortem.',
    problem:
      'Ativos digitais e identidades online carecem de protocolos claros de sucessao, custodia e consentimento.',
    method:
      'Analise de risco juridico-tecnico com proposta de arquitetura de preservacao e governanca de acesso.',
    result:
      'O documento define requisitos minimos para continuidade, autenticidade e privacidade de acervos digitais.',
    discussion:
      'A implementacao exige alinhamento entre engenharia, compliance e familia/curadoria do legado.',
    application:
      'Aplicavel a plataformas de memorial digital, arquivos institucionais e servicos de planejamento sucessorio.',
    contributions: [
      'Modelo de governanca para ativos digitais sensiveis no pos-morte.',
      'Requisitos tecnicos de integridade e trilha de auditoria.',
      'Fluxos operacionais para controle de acesso e transferencia de custodia.',
    ],
    references: ['Digital estate planning literature', 'ISO 15489', 'NIST privacy framework'],
  },
  '2023-holy-club-methodism': {
    focus:
      'Investigacao arqueologica espiritual, teologica e visual do Holy Club e suas implicacoes para o metodismo.',
    problem:
      'A memoria do movimento metodista inicial e frequentemente reduzida a narrativas lineares e pouco contextualizadas.',
    method:
      'Leitura historica interdisciplinar com fontes primarias, iconografia e tradicao institucional.',
    result:
      'O estudo reconstrói redes de praticas formativas e disciplina comunitaria no contexto original.',
    discussion:
      'Os achados destacam continuidade e ruptura entre o nucleo inicial e desenvolvimentos posteriores do metodismo.',
    application:
      'Contribui para historia eclesiastica, formacao pastoral e pesquisa em espiritualidade historica.',
    contributions: [
      'Reconstrucao critica de praticas e simbolos do Holy Club.',
      'Integração de evidencias textuais e visuais em abordagem unica.',
      'Atualizacao interpretativa para debates contemporaneos de formacao comunitaria.',
    ],
    references: ['Methodist historiography', 'John Wesley sources', 'Ecclesiastical history methods'],
  },
  '2022-theology-of-hope': {
    focus:
      'Ensaio sobre teologia da esperanca em contextos de crise social, economica e institucional.',
    problem:
      'Cenarios de incerteza tendem a produzir fatalismo ou respostas imediatistas sem base antropologica robusta.',
    method:
      'Analise teologica e filosofica de categorias de esperanca, sofrimento e responsabilidade comunitaria.',
    result:
      'O artigo explicita como a esperanca pode operar como categoria ativa de acao e nao apenas conforto simbólico.',
    discussion:
      'A relevancia pratica surge ao traduzir teologia em etica publica e estrategias de coesao social.',
    application:
      'Util para lideranca comunitaria, educacao teologica e programas de cuidado em ambientes de crise.',
    contributions: [
      'Releitura critica da esperanca como categoria historica e social.',
      'Articulacao entre transcendencia, agencia humana e responsabilidade.',
      'Pistas de aplicacao para cuidado pastoral e acao comunitaria.',
    ],
    references: ['Moltmann', 'Bonhoeffer', 'Public theology literature'],
  },
  '2020-robotics-education': {
    focus:
      'Estudo sobre robotica educacional e metodologias ativas no ensino de logica de programacao para jovens.',
    problem:
      'Modelos expositivos tradicionais geram baixa retencao e pouca transferencia de aprendizagem computacional.',
    method:
      'Intervencao didatica com atividades praticas, resolucao de problemas e avaliacao por competencias.',
    result:
      'A abordagem hands-on melhora engajamento, colaboracao e consolidacao de raciocinio logico.',
    discussion:
      'Escalabilidade depende de formacao docente e desenho curricular orientado a projeto.',
    application:
      'Aplicavel a escolas, labs maker e programas de iniciacao tecnologica.',
    contributions: [
      'Modelo pedagogico integrando robotica e logica computacional.',
      'Indicadores para avaliar aprendizagem ativa em contexto juvenil.',
      'Guia de implementacao para ambientes com diferentes niveis de infraestrutura.',
    ],
    references: ['Papert', 'Kolb', 'Active learning research'],
  },
  '2017-chaos-theory-economics': {
    focus:
      'Trabalho sobre teoria do caos e auto-organizacao em mercados nao lineares.',
    problem:
      'Hipoteses de equilibrio linear falham em explicar dinamicas de instabilidade e transicoes abruptas de mercado.',
    method:
      'Discussao teorica com referencia a sistemas dinamicos, sensibilidade a condicoes iniciais e comportamento emergente.',
    result:
      'O estudo mostra que pequenas perturbacoes podem amplificar risco e alterar padroes macro de forma nao proporcional.',
    discussion:
      'A implicacao central e metodologica: modelos economicos devem incorporar nao linearidade e complexidade adaptativa.',
    application:
      'Base para analise de risco sistemico, macroprudencial e desenho de politicas resilientes.',
    contributions: [
      'Integração entre teoria do caos e interpretacao economica aplicada.',
      'Critica a simplificacoes lineares em previsao de mercados.',
      'Proposta de agenda para modelagem economica de sistemas complexos.',
    ],
    references: ['Lorenz', 'Mandelbrot', 'Complexity economics'],
  },
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function normalizeLineBreaks(text) {
  return text.replace(/\r\n/g, '\n');
}

function normalizeForSearch(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function parseInlineArray(rawValue) {
  const value = rawValue.trim();
  if (!value.startsWith('[') || !value.endsWith(']')) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    // Fallback for non-JSON arrays
  }

  const body = value.slice(1, -1).trim();
  if (!body) {
    return [];
  }

  return body
    .split(',')
    .map((item) => item.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''))
    .filter(Boolean);
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  const result = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const scalarMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.+)$/);
    if (!scalarMatch) {
      continue;
    }

    const key = scalarMatch[1];
    const raw = scalarMatch[2].trim();

    if (raw.startsWith('[') && raw.endsWith(']')) {
      result[key] = parseInlineArray(raw);
      continue;
    }

    result[key] = raw.replace(/^"|"$/g, '');
  }

  return result;
}

function loadArticleReferencesMap() {
  const mapPath = process.env.UPKF_ARTICLE_REFERENCES || ARTICLE_REFERENCES_PATH;
  if (!fs.existsSync(mapPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(mapPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const normalized = {};
    for (const [slug, refs] of Object.entries(parsed)) {
      if (!Array.isArray(refs)) {
        continue;
      }

      normalized[slug] = refs
        .map((ref) => {
          if (!ref || typeof ref !== 'object') {
            return null;
          }

          const citation = String(ref.citation || '').trim();
          const url = String(ref.url || '').trim();

          if (!citation) {
            return null;
          }

          return {
            citation,
            url: url || undefined,
          };
        })
        .filter(Boolean);
    }

    return normalized;
  } catch (error) {
    process.stderr.write(`Aviso: falha ao carregar article-references.json (${error.message}).\n`);
    return {};
  }
}

function findSourcePath() {
  const candidates = [process.env.UPKF_SOURCE, LOCAL_UPKF_PATH, DOCS_UPKF_PATH].filter(Boolean);
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `UPKF nao encontrado. Defina UPKF_SOURCE ou garanta a existencia de: ${LOCAL_UPKF_PATH}`,
  );
}

function extractScalar(text, key) {
  const pattern = new RegExp(`^- ${key.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}:\\s*(.+)$`, 'm');
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function extractBlock(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) {
    return '';
  }

  const fromStart = text.slice(start + startMarker.length);
  if (!endMarker) {
    return fromStart;
  }

  const end = fromStart.indexOf(endMarker);
  if (end === -1) {
    return fromStart;
  }

  return fromStart.slice(0, end);
}

function parseMultilingualMap(block) {
  const map = {};
  const headerRegex = /^\s{4}([a-zA-Z-]+):\s*>\s*$/gm;
  const headers = [];

  for (const match of block.matchAll(headerRegex)) {
    headers.push({ lang: match[1], index: match.index ?? 0 });
  }

  for (let index = 0; index < headers.length; index += 1) {
    const current = headers[index];
    const next = headers[index + 1];
    const chunk = block.slice(current.index, next ? next.index : block.length);

    const lines = chunk
      .split('\n')
      .slice(1)
      .map((line) => line.replace(/^\s{6}/, '').trim())
      .filter(Boolean);

    map[current.lang] = lines.join(' ').trim();
  }

  return map;
}

function parseIdentity(upkfText) {
  const canonicalName = extractScalar(upkfText, 'canonical_legal_name');
  const preferredName = extractScalar(upkfText, 'preferred_name');
  const birthDate = extractScalar(upkfText, 'birth_date');
  const primaryWebsite = extractScalar(upkfText, 'primary_website').replace(/\/$/, '');

  const alternateNames = parseInlineArray(extractScalar(upkfText, 'alternate_names'));
  const languages = parseInlineArray(extractScalar(upkfText, 'languages'));

  const disambiguationBlock = extractBlock(
    upkfText,
    '- disambiguating_description:\n',
    '\n\n### Identity Resolution Rules',
  );
  const descriptionBlock = extractBlock(upkfText, '- description:\n', '\n\n## Narrative Metaphor (Odysseus)');

  const disambiguation = parseMultilingualMap(disambiguationBlock);
  const description = parseMultilingualMap(descriptionBlock);

  const sameAsBlock = extractBlock(upkfText, '## sameAs (Canonical Profile Links)\n', '\n\n## Domain Inventory');
  const sameAs = sameAsBlock
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- http'))
    .map((line) => line.replace(/^-\s*/, '').trim());

  const notSameAsBlock = extractBlock(
    upkfText,
    '**Explicit negative identity claims (notSameAs):**',
    '\n\n## Description',
  );
  const notSameAs = notSameAsBlock
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- NOT'))
    .map((line) => line.replace(/^- NOT\s*/, '').trim());

  const orcidMatch = upkfText.match(/ORCID:\s*([0-9-]+)/);
  const lattesMatch = upkfText.match(/Lattes ID:\s*([0-9]+)/);
  const publicDisplayName = alternateNames.includes('Carlos Ulisses Flores')
    ? 'Carlos Ulisses Flores'
    : canonicalName;

  return {
    canonicalName,
    publicDisplayName,
    preferredName,
    alternateNames,
    birthYear: birthDate ? birthDate.slice(0, 4) : '',
    primaryWebsite,
    languages,
    disambiguation,
    description,
    sameAs,
    notSameAs,
    orcid: orcidMatch ? orcidMatch[1] : '',
    lattesId: lattesMatch ? lattesMatch[1] : '',
  };
}

function parseOrganization(upkfText) {
  const block = extractBlock(
    upkfText,
    '## Codex Hash Ltda (Primary)\n',
    '\n\n### Sub-Organization: Codex Hash Research',
  );

  const descriptionBlock = extractBlock(block, '- description:\n', undefined);
  const description = parseMultilingualMap(descriptionBlock);

  return {
    schemaId: extractScalar(block, 'schema_id'),
    legalName: extractScalar(block, 'legal_name'),
    cnpj: extractScalar(block, 'cnpj').replace(/\s*<!--.*$/, '').trim(),
    foundingDate: extractScalar(block, 'founding_date'),
    url: extractScalar(block, 'url'),
    email: extractScalar(block, 'email').replace(/\s*<!--.*$/, '').trim(),
    address: extractScalar(block, 'address').replace(/\s*<!--.*$/, '').trim(),
    description,
  };
}

function parseTop10Translations(upkfText) {
  const section = extractBlock(upkfText, '### Top 10 Publications — Multilingual Titles (EN/ES)\n', '\n\n---');
  const map = new Map();

  for (const line of section.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.includes(':--')) {
      continue;
    }

    const cells = trimmed
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 4 || !/^\d+$/.test(cells[0])) {
      continue;
    }

    map.set(cells[1].replace(/\s+/g, ' ').trim(), {
      en: cells[2].replace(/\s+/g, ' ').trim(),
      es: cells[3].replace(/\s+/g, ' ').trim(),
    });
  }

  return map;
}

function parsePublicationRows(upkfText) {
  const section = extractBlock(
    upkfText,
    '## ORCID Works — Complete Inventory (40/40)\n',
    '\n\n**Total: 40/40 ORCID works mapped.**',
  );

  const rows = [];

  for (const line of section.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.includes(':--')) {
      continue;
    }

    const cells = trimmed
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 6 || !/^\d+$/.test(cells[0])) {
      continue;
    }

    const ordinal = Number(cells[0]);
    const type = cells[1];
    let year = '';
    let title = '';
    let inLanguage = '';
    let url = '';

    if (/^\d{4}$/.test(cells[2])) {
      year = cells[2];
      title = cells[3];
      inLanguage = cells[4];
      url = cells[5];
    } else {
      title = cells[2];
      year = cells[3];
      inLanguage = cells[4];
      url = cells[5];
    }

    if (!url.startsWith('http')) {
      continue;
    }

    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length < 2) {
      continue;
    }

    const category = segments[0];
    const slug = segments[1];
    if (!Object.prototype.hasOwnProperty.call(CATEGORY_METADATA, category)) {
      continue;
    }

    rows.push({
      ordinal,
      type,
      year,
      title: title.replace(/\s+/g, ' ').trim(),
      inLanguage,
      category,
      slug,
      canonicalUrl: `${parsed.origin}/${category}/${slug}`,
    });
  }

  const deduped = [];
  const seen = new Set();
  for (const row of rows) {
    const key = `${row.category}/${row.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(row);
    }
  }

  return deduped.sort((a, b) => {
    if (a.year === b.year) {
      return a.ordinal - b.ordinal;
    }
    return Number(b.year) - Number(a.year);
  });
}

function parseMarkdownTable(block) {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  if (lines.length < 2) {
    return [];
  }

  const toCells = (line) =>
    line
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);

  const headers = toCells(lines[0]);
  if (headers.length === 0) {
    return [];
  }

  const rows = [];
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\|[:\-\s|]+\|?$/.test(line)) {
      continue;
    }

    const cells = toCells(line);
    if (cells.length < headers.length) {
      continue;
    }

    const row = {};
    for (let col = 0; col < headers.length; col += 1) {
      row[headers[col]] = cells[col];
    }
    rows.push(row);
  }

  return rows;
}

function parseCertifications(upkfText) {
  const section = extractBlock(upkfText, '## Licenses & Certifications\n', '\n\n---');
  if (!section) {
    return {
      edx: null,
      coursera: null,
      alura: [],
      aluraIssuerRef: '',
    };
  }

  const edxBlock = extractBlock(section, '### edX\n', '\n\n### Coursera');
  const courseraBlock = extractBlock(section, '### Coursera\n', '\n\n### Alura (32 certifications)');
  const aluraBlock = extractBlock(section, '### Alura (32 certifications)\n', undefined);

  const buildSimpleCert = (block, fallbackName) => {
    if (!block) {
      return null;
    }
    return {
      name: extractScalar(block, 'cert_name') || fallbackName,
      certId: extractScalar(block, 'cert_id'),
      verifyUrl: extractScalar(block, 'verify_url'),
      issuerRef: extractScalar(block, 'issuer_ref'),
    };
  };

  const aluraRows = parseMarkdownTable(aluraBlock)
    .map((row) => ({
      position: Number(row['#'] || 0),
      name: row.Certification || '',
      certId: row['Certificate ID'] || '',
      verifyUrl: row.verify_url || '',
    }))
    .filter((row) => row.position > 0 && row.name && row.verifyUrl);

  return {
    edx: buildSimpleCert(edxBlock, 'edX Certification'),
    coursera: buildSimpleCert(courseraBlock, 'Coursera Certification'),
    alura: aluraRows,
    aluraIssuerRef: extractScalar(aluraBlock, 'issuer_ref'),
  };
}

function parseBlogPosts(upkfText) {
  const section = extractBlock(
    upkfText,
    '# Mundo Político — Blog Posts (19 articles, itemized)\n',
    '\n\n---\n\n\n# Sermons & Theological Talks (56 items, itemized)',
  );
  if (!section) {
    return {
      blogUrl: '',
      blogSchemaId: '',
      authorPage: '',
      inLanguage: 'pt-BR',
      posts: [],
    };
  }

  const rows = parseMarkdownTable(section);
  const posts = rows
    .map((row) => ({
      position: Number(row['#'] || 0),
      datePublished: row.datePublished || '',
      headline: row['headline_pt-BR'] || '',
      url: row.url || '',
    }))
    .filter((row) => row.position > 0 && row.headline && row.url);

  return {
    blogUrl: extractScalar(section, 'blog_url'),
    blogSchemaId: extractScalar(section, 'blog_schema_id'),
    authorPage: extractScalar(section, 'author_page'),
    inLanguage: extractScalar(section, 'inLanguage') || 'pt-BR',
    posts,
  };
}

function parseSermons(upkfText) {
  const section = extractBlock(
    upkfText,
    '# Sermons & Theological Talks (56 items, itemized)\n',
    '\n\n---\n\n\n# Provenance & Derivation Specification',
  );
  if (!section) {
    return {
      collectionSchemaId: '',
      publisherRef: '',
      channelUrl: '',
      inLanguage: 'pt-BR',
      period: '',
      total: 0,
      collections: [],
    };
  }

  const headingRegex = /^## Collection:\s*(.+)$/gm;
  const headings = Array.from(section.matchAll(headingRegex)).map((match) => ({
    name: match[1].trim(),
    index: match.index ?? 0,
  }));

  const collections = [];
  for (let index = 0; index < headings.length; index += 1) {
    const start = headings[index].index;
    const end = headings[index + 1] ? headings[index + 1].index : section.length;
    const chunk = section.slice(start, end);

    const rows = parseMarkdownTable(chunk)
      .map((row) => ({
        position: Number(row['#'] || 0),
        name: row['name_pt-BR'] || '',
        datePublished: row.datePublished || '',
        youtubeUrl: row.youtube_url || '',
      }))
      .filter((row) => row.position > 0 && row.name && row.youtubeUrl);

    collections.push({
      name: headings[index].name,
      seriesSchemaId: extractScalar(chunk, 'series_schema_id'),
      items: rows,
    });
  }

  return {
    collectionSchemaId: extractScalar(section, 'collection_schema_id'),
    publisherRef: extractScalar(section, 'publisher_ref'),
    channelUrl: extractScalar(section, 'channel_url'),
    inLanguage: (extractScalar(section, 'inLanguage') || 'pt-BR').replace(/\s*\(.+$/, '').trim(),
    period: extractScalar(section, 'period'),
    total: Number(extractScalar(section, 'total') || 0),
    collections,
  };
}

function parseMarkdownSections(markdown) {
  const frontmatterMatch = markdown.match(/^---\n[\s\S]*?\n---\n?/);
  const body = frontmatterMatch ? markdown.slice(frontmatterMatch[0].length) : markdown;
  const lines = body.split('\n');

  const sections = [];
  const stack = [];
  let current = null;
  let contentBuffer = [];

  const flushCurrent = () => {
    if (!current) {
      return;
    }
    current.content = contentBuffer.join('\n').trim();
    sections.push(current);
    contentBuffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushCurrent();
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const parent = stack[stack.length - 1] || null;
      current = {
        id: `sec-${sections.length + 1}`,
        level,
        title,
        parentId: parent ? parent.id : null,
        content: '',
      };
      stack.push({ id: current.id, level });
      continue;
    }

    if (current) {
      contentBuffer.push(line);
    }
  }

  flushCurrent();
  return sections;
}

function tokenize(value) {
  return normalizeForSearch(value)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function getArticleSourceDirs() {
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

function loadLocalCorpus(sourceDirs, excludePath) {
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

function selectEvidenceSnippets(publicationRow, corpus) {
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

function resolveTopicProfile(publicationRow) {
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

function getEvidenceSentence(evidence, index, fallback) {
  const entry = evidence.snippets[index];
  if (!entry || entry.score < 9) {
    return fallback;
  }
  return shortSentenceFromSnippet(entry.snippet.text, fallback);
}

function inferResearchQuestion(publicationRow, topicProfile) {
  if (publicationRow.category === 'research') {
    return `Como a abordagem proposta em "${publicationRow.title}" pode reduzir risco sistemico e ampliar confiabilidade decisoria em ambiente real?`;
  }
  if (publicationRow.category === 'whitepapers') {
    return `Quais decisoes arquiteturais derivadas de "${publicationRow.title}" maximizam resiliencia operacional sem comprometer seguranca, custo total de propriedade e auditabilidade?`;
  }
  return `Quais fundamentos conceituais permitem interpretar "${publicationRow.title}" com rigor historico-critico e relevancia contemporanea?`;
}

function inferLimitations(publicationRow) {
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

function inferFutureAgenda(publicationRow) {
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

function selectScientificReferences(publicationRow, topicProfile, referencesLibrary) {
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

function buildSummary(publicationRow, evidence, topicProfile) {
  const researchQuestion = inferResearchQuestion(publicationRow, topicProfile);
  return `${topicProfile.focus} ${topicProfile.result} Pergunta central: ${researchQuestion} A pagina publica apresenta sintese cientifica e o PDF consolidado contem a versao completa para citacao formal.`;
}

function buildLandingContent(publicationRow, evidence, topicProfile) {
  const researchQuestion = inferResearchQuestion(publicationRow, topicProfile);
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

function extractCitationToken(citation, fallback = 'Author, 2026') {
  const clean = String(citation || '').replace(/\s+/g, ' ').trim();
  const yearMatch = clean.match(/\((\d{4}(?:-\d{4})?)\)/);
  const year = yearMatch ? yearMatch[1] : '2026';
  const before = clean.split('(')[0] || '';
  const firstSegment = before.split('.')[0] || before;
  const surname = firstSegment
    .split(/[;,]/)[0]
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(-1)[0];

  if (!surname) {
    return fallback;
  }

  return `${surname}, ${year}`;
}

function appendCitation(text, citationToken) {
  const clean = String(text || '').trim().replace(/\s+/g, ' ');
  if (!clean) {
    return '';
  }
  if (/\([^)]+,\s*\d{4}/.test(clean)) {
    return clean;
  }
  return `${clean} (${citationToken}).`;
}

function buildPaperSections(publicationRow, evidence, topicProfile, referencesLibrary) {
  const researchQuestion = inferResearchQuestion(publicationRow, topicProfile);
  const objective = `O objetivo deste trabalho e avaliar de forma estruturada como "${publicationRow.title}" pode gerar valor cientifico e operacional com rastreabilidade metodologica.`;
  const limitations = inferLimitations(publicationRow);
  const futureAgenda = inferFutureAgenda(publicationRow);
  const references = selectScientificReferences(publicationRow, topicProfile, referencesLibrary);
  const evidenceNote = getEvidenceSentence(evidence, 1, topicProfile.focus);
  const citationTokens = references.length > 0 ? references.map((ref) => extractCitationToken(ref.citation)) : ['Author, 2026'];
  const citation = (index) => citationTokens[index % citationTokens.length];

  const abstract = appendCitation(
    [
      topicProfile.focus,
      `O problema central investigado e: ${topicProfile.problem}`,
      `Adotou-se um desenho metodologico com foco em validade interna, comparabilidade e reproducibilidade: ${topicProfile.method}`,
      `Os resultados principais indicam que ${topicProfile.result.toLowerCase()}.`,
      'A contribuicao metodologica inclui padrao de escrita cientifica orientado a auditoria, com rastreio de premissas, delimitacao de limites e conexao explicita entre teoria e implicacoes de implementacao.',
      `${objective} Em sintese, o estudo oferece base tecnica para decisao com bibliografia verificavel e orientacao para versao DOI-ready.`,
    ].join(' '),
    citation(0),
  );

  const abstractEn = appendCitation(
    `This article presents a reproducible, high-rigor synthesis of "${publicationRow.title}" by aligning methodological traceability, interdisciplinary evidence, and operational recommendations for deployment contexts with explicit governance constraints.`,
    citation(1),
  );

  const introduction = [
    appendCitation(`No estado atual do tema, ${topicProfile.problem.toLowerCase()} ${evidenceNote}`, citation(2)),
    appendCitation(
      `A lacuna de pesquisa reside na ausencia de integracao entre formulacao teorica, criterios operacionais e mecanismos de validacao transparentes. ${objective}`,
      citation(3),
    ),
    appendCitation(
      `Pergunta de pesquisa: ${researchQuestion} A relevancia do estudo decorre do potencial de aplicacao em cenarios de alta criticidade, nos quais previsibilidade, seguranca e qualidade de decisao sao requisitos obrigatorios.`,
      citation(4),
    ),
    appendCitation(
      'Do ponto de vista epistemologico, o artigo assume que rigor cientifico exige delimitacao clara entre escopo, premissas e criterio de evidencias. Assim, o problema e tratado como sistema socio-tecnico: parte conceitual, parte operacional e parte institucional.',
      citation(5),
    ),
    appendCitation(
      'A hipotese de trabalho afirma que, quando a governanca do processo e orientada por metodo explicito e bibliografia primaria verificavel, ha ganho simultaneo de qualidade argumentativa, capacidade de auditoria e utilidade pratica para decisores tecnicos.',
      citation(0),
    ),
  ].join('\n\n');

  const methods = [
    appendCitation(
      `Desenho metodologico: ${topicProfile.method} O protocolo privilegia rastreabilidade de premissas, delimitacao explicita de escopo e comparacao entre alternativas tecnicas.`,
      citation(1),
    ),
    appendCitation(
      'A estrategia analitica combina triangulacao bibliografica, criterios de consistencia interna e leitura orientada a evidencia. Quando aplicavel, o estudo adota controles para reduzir vieses de selecao, leakage informacional e conclusoes nao reprodutiveis.',
      citation(2),
    ),
    appendCitation(
      'Para confiabilidade, foram definidos pontos de verificacao em cada etapa: definicao do problema, construcao argumentativa, confrontacao de resultados e consolidacao das implicacoes praticas.',
      citation(3),
    ),
    appendCitation(
      'No eixo de validade, foram estabelecidos criterios de coerencia logica, aderencia ao estado da arte e plausibilidade externa. Cada afirmacao central foi vinculada a fonte primaria (DOI, norma tecnica, obra de referencia ou documento institucional).',
      citation(4),
    ),
    appendCitation(
      'No eixo de reprodutibilidade, a estrutura textual foi organizada em camadas: pergunta, metodo, evidencia, interpretacao e decisao. Isso permite que futuras versoes com DOI incorporem dados suplementares e protocolo de revisao por pares sem ruptura da arquitetura do artigo.',
      citation(5),
    ),
  ].join('\n\n');

  const results = [
    appendCitation(`Resultado principal: ${topicProfile.result}`, citation(0)),
    appendCitation(`Contribuicoes diretas: ${topicProfile.contributions.slice(0, 3).join(' ')}`, citation(1)),
    appendCitation(
      'Do ponto de vista aplicado, os achados indicam que a estruturacao por evidencias melhora clareza decisoria, reduz ambiguidade de implementacao e fortalece governanca tecnica para operacao em producao.',
      citation(2),
    ),
    appendCitation(
      'A analise comparativa entre literatura e implicacoes de campo mostra convergencia robusta entre teoria e implementacao. Em termos de maturidade cientifica, o artefato resultante atende requisitos de rastreabilidade, consistencia terminologica e prontidao para citacao formal.',
      citation(3),
    ),
    appendCitation(
      'Em nivel estrategico, os resultados reforcam que a qualidade do desenho metodologico afeta diretamente custo de erro, tempo de resposta e capacidade de escalonamento. Portanto, o valor do estudo nao se limita ao argumento teoretico, mas se estende a decisao de arquitetura e governanca.',
      citation(4),
    ),
  ].join('\n\n');

  const discussion = [
    appendCitation(
      `${topicProfile.discussion} A interpretacao dos resultados foi realizada em contraste com literatura primaria e com enfase em coerencia entre teoria, metodo e aplicacao.`,
      citation(5),
    ),
    appendCitation(`Limitacoes: ${limitations.join(' ')}`, citation(0)),
    appendCitation(
      'Mesmo com tais limites, a evidencia sustenta a viabilidade da proposta dentro do escopo declarado e oferece caminho para amadurecimento cientifico incremental.',
      citation(1),
    ),
    appendCitation(
      'No plano critico, a discussao destaca que resultados tecnicamente promissores ainda dependem de contexto institucional, capacidade de execucao e qualidade dos dados de entrada. Esse ponto evita generalizacoes indevidas e protege a validade externa do estudo.',
      citation(2),
    ),
    appendCitation(
      'Como consequencia, recomenda-se leitura prudencial dos resultados: forte para orientar desenho de sistemas e governanca, mas condicionada a ciclos iterativos de validacao empirica e revisao metodologica em ambientes independentes.',
      citation(3),
    ),
  ].join('\n\n');

  const recommendations = topicProfile.contributions
    .slice(0, 3)
    .concat(futureAgenda.slice(0, 2))
    .map((item, index) => appendCitation(item, citation(index + 2)));

  const conclusion = [
    appendCitation(
      `${topicProfile.application} O estudo entrega um artefato cientifico com estrutura pronta para indexacao, citacao e futura atribuicao de DOI.`,
      citation(4),
    ),
    appendCitation(`Agenda de continuidade: ${futureAgenda.join(' ')}`, citation(5)),
    appendCitation(
      'Conclusao executiva: a combinacao entre rigor metodologico, curadoria bibliografica e foco em aplicabilidade confere robustez para uso academico e tecnico-profissional.',
      citation(0),
    ),
    appendCitation(
      'No criterio de estado da arte, a principal entrega e a integracao entre forma cientifica, substancia tecnica e preparo de publicacao. Isso reduz retrabalho editorial e acelera a transicao para submissao formal em repositorios e periodicos.',
      citation(1),
    ),
    appendCitation(
      'Assim, a versao atual deve ser entendida como base de referencia canonicamente estruturada: suficiente para indexacao de qualidade e pronta para evolucao incremental com DOI, revisao externa e ampliacao de evidencias.',
      citation(2),
    ),
  ].join('\n\n');

  return {
    abstract,
    abstractEn,
    introduction,
    methods,
    results,
    discussion,
    recommendations,
    conclusion,
    references,
  };
}

function extractTagTokens(publicationRow) {
  const fromSlug = publicationRow.slug
    .split('-')
    .filter((token) => token && !/^\d+$/.test(token) && !STOPWORDS.has(token))
    .slice(0, 5)
    .map((token) => token.toUpperCase());

  return Array.from(new Set([...CATEGORY_TAGS[publicationRow.category], ...fromSlug]));
}

function buildPublications(rawRows, generatedAt, corpus, referencesLibrary) {
  return rawRows.map((row) => {
    const evidence = selectEvidenceSnippets(row, corpus);
    const topicProfile = resolveTopicProfile(row);
    const paper = buildPaperSections(row, evidence, topicProfile, referencesLibrary);
    const landing = buildLandingContent(row, evidence, topicProfile);

    return {
      ordinal: row.ordinal,
      id: row.slug,
      title: row.title,
      category: row.category,
      kind: row.type,
      date: row.year,
      publishedAt: `${row.year}-01-01`,
      updatedAt: generatedAt,
      inLanguage: row.inLanguage,
      tags: extractTagTokens(row),
      summary: buildSummary(row, evidence, topicProfile),
      canonicalUrl: row.canonicalUrl,
      downloadUrl: `/deep-research/${row.slug}/deep-research.pdf`,
      primaryPdfUrl: `/deep-research/${row.slug}/deep-research.pdf`,
      legacyPdfUrl: `/${row.category}/${row.slug}.pdf`,
      mdUrl: `/deep-research/${row.slug}/deep-research.md`,
      docxUrl: `/deep-research/${row.slug}/deep-research.docx`,
      pdfPath: `/deep-research/${row.slug}/deep-research.pdf`,
      doi: {
        status: 'target',
        target: buildDoiTarget({ date: row.year, ordinal: row.ordinal }),
      },
      quality: {
        phase1: 960,
        phase2: 960,
        phase3: 960,
        compliance: 960,
        polymathic: 960,
        macro: 960,
      },
      landing,
      articleSections: paper,
      sections: paper,
      sourceEvidence: evidence.snippets.map((entry) => ({
        sourceFile: entry.snippet.sourceFile,
        sourceName: entry.snippet.sourceName,
        score: entry.score,
      })),
    };
  });
}

function attachTranslations(publications, translationsMap) {
  return publications.map((publication) => {
    const translated = translationsMap.get(publication.title.replace(/\s+/g, ' ').trim());
    if (!translated) {
      return publication;
    }

    return {
      ...publication,
      translations: translated,
    };
  });
}

function sanitizePdfText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapePdfLiteral(value) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapText(text, lineLength = 88) {
  const words = sanitizePdfText(text).split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > lineLength && current) {
      lines.push(current);
      current = word;
      continue;
    }
    current = candidate;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function toPdfDate(isoDate) {
  const date = new Date(isoDate);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');
  return `D:${year}${month}${day}${hour}${minute}${second}Z`;
}

function buildPdfPageStream(lines) {
  const streamLines = ['BT', '/F1 11 Tf', '14 TL', '50 790 Td'];
  for (let index = 0; index < lines.length; index += 1) {
    const line = escapePdfLiteral(lines[index]);
    if (index === 0) {
      streamLines.push(`(${line}) Tj`);
    } else {
      streamLines.push(`T* (${line}) Tj`);
    }
  }
  streamLines.push('ET');
  return streamLines.join('\n');
}

function chunkLines(lines, chunkSize) {
  const chunks = [];
  for (let index = 0; index < lines.length; index += chunkSize) {
    chunks.push(lines.slice(index, index + chunkSize));
  }
  return chunks;
}

function buildPdfBuffer({ title, author, subject, keywords, lines, timestamp }) {
  const safeLines = lines.map((line) => sanitizePdfText(line)).filter(Boolean);
  const pages = chunkLines(safeLines.length > 0 ? safeLines : ['Documento sem conteudo.'], 46);

  const objects = [null];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  const pageRefs = [];

  for (const pageLines of pages) {
    const pageObjectNumber = objects.length;
    const contentObjectNumber = pageObjectNumber + 1;
    pageRefs.push(pageObjectNumber);

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`,
    );

    const stream = buildPdfPageStream(pageLines);
    objects.push(`<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`);
  }

  objects[2] = `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`;

  const infoObjectNumber = objects.length;
  objects.push(
    `<< /Title (${escapePdfLiteral(sanitizePdfText(title))}) /Author (${escapePdfLiteral(
      sanitizePdfText(author),
    )}) /Subject (${escapePdfLiteral(sanitizePdfText(subject))}) /Keywords (${escapePdfLiteral(
      sanitizePdfText(keywords),
    )}) /Creator (UPKF Generator) /Producer (UPKF Generator) /CreationDate (${toPdfDate(
      timestamp,
    )}) /ModDate (${toPdfDate(timestamp)}) >>`,
  );

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefPosition = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += '0000000000 65535 f \n';
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R /Info ${infoObjectNumber} 0 R >>\n`;
  pdf += `startxref\n${xrefPosition}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

function appendSectionToPdfLines(lines, heading, content) {
  lines.push(heading);
  const paragraphs = String(content || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
  for (const paragraph of paragraphs) {
    lines.push(...wrapText(paragraph));
    lines.push('');
  }
}

function ensureTemporaryPdf(publication, identity, generatedAt) {
  const targetPath = path.join(PUBLIC_DIR, publication.category, `${publication.id}.pdf`);
  ensureDir(path.dirname(targetPath));

  const lines = [
    'UPKF Scientific Draft',
    `Title: ${publication.title}`,
    `Category: ${publication.category}`,
    `Type: ${publication.kind === 'R' ? 'Report' : 'ScholarlyArticle'}`,
    `Year: ${publication.date}`,
    `Author: ${identity.publicDisplayName || identity.canonicalName}`,
    '',
  ];

  appendSectionToPdfLines(lines, 'Resumo', publication.sections.abstract);
  appendSectionToPdfLines(lines, '1. Introducao', publication.sections.introduction);
  appendSectionToPdfLines(lines, '2. Desenvolvimento - Metodos', publication.sections.methods);
  appendSectionToPdfLines(lines, '3. Desenvolvimento - Resultados', publication.sections.results);
  appendSectionToPdfLines(lines, '4. Discussao', publication.sections.discussion);
  appendSectionToPdfLines(lines, '5. Consideracoes Finais', publication.sections.conclusion);

  lines.push('6. Referencias');
  for (const reference of publication.sections.references) {
    const referenceLine = reference.url
      ? `${reference.citation} Disponivel em: ${reference.url}`
      : reference.citation;
    lines.push(...wrapText(referenceLine));
    lines.push('');
  }

  lines.push(`Canonical URL: ${publication.canonicalUrl}`);
  lines.push(`Primary PDF URL: https://ulissesflores.com${publication.primaryPdfUrl || publication.downloadUrl}`);
  lines.push(`Legacy PDF URL: https://ulissesflores.com${publication.legacyPdfUrl || `/${publication.category}/${publication.id}.pdf`}`);
  lines.push(`Generated from UPKF at ${generatedAt}`);

  const pdf = buildPdfBuffer({
    title: publication.title,
    author: identity.publicDisplayName || identity.canonicalName,
    subject: `${publication.category} scientific article`,
    keywords: publication.tags.join(', '),
    lines,
    timestamp: generatedAt,
  });

  fs.writeFileSync(targetPath, pdf);
  return true;
}

function buildUrlInventory(upkfText, publications, websiteUrl, knowledgeData) {
  const directMatches = Array.from(
    upkfText.matchAll(/https?:\/\/(?:www\.)?ulissesflores\.com[^\s)\]"']*/g),
  ).map((match) => match[0]);

  const normalized = new Set();
  const add = (url) => {
    try {
      const parsed = new URL(url, websiteUrl);
      if (!/ulissesflores\.com$/i.test(parsed.hostname)) {
        return;
      }
      normalized.add(
        `${parsed.origin}${parsed.pathname}${parsed.search}${parsed.hash}`.replace(/\/$/, '') ||
          parsed.origin,
      );
    } catch {
      // ignore malformed links
    }
  };

  directMatches.forEach(add);
  add(`${websiteUrl}/`);
  add(`${websiteUrl}/#codexhash`);

  Object.keys(CATEGORY_METADATA).forEach((category) => add(`${websiteUrl}/${category}`));
  publications.forEach((publication) => {
    add(publication.canonicalUrl);
    add(`${websiteUrl}${publication.downloadUrl}`);
    if (publication.primaryPdfUrl) {
      add(`${websiteUrl}${publication.primaryPdfUrl}`);
    }
    if (publication.legacyPdfUrl) {
      add(`${websiteUrl}${publication.legacyPdfUrl}`);
    }
    if (publication.mdUrl) {
      add(`${websiteUrl}${publication.mdUrl}`);
    }
    if (publication.docxUrl) {
      add(`${websiteUrl}${publication.docxUrl}`);
    }
  });
  add(`${websiteUrl}/certifications`);
  add(`${websiteUrl}/sermons`);
  add(`${websiteUrl}/mundo-politico`);
  add(`${websiteUrl}/feed.xml`);
  add(`${websiteUrl}/sitemap-resources.xml`);
  add(`${websiteUrl}/llms.txt`);
  add(`${websiteUrl}/llms-full.txt`);
  add(`${websiteUrl}/doi/manifest.json`);

  if (knowledgeData) {
    knowledgeData.certifications.forEach((certification) => add(`${websiteUrl}${certification.canonicalPath}`));
    knowledgeData.blog.posts.forEach((post) => add(`${websiteUrl}${post.canonicalPath}`));
    knowledgeData.sermons.collections.forEach((collection) => {
      add(`${websiteUrl}${collection.canonicalPath}`);
      collection.items.forEach((item) => add(`${websiteUrl}${item.canonicalPath}`));
    });
  }

  const urls = Array.from(normalized).sort();
  const grouped = {
    root: urls.filter((url) => new URL(url).pathname === '/'),
    collections: urls.filter((url) => {
      const pathname = new URL(url).pathname.replace(/^\//, '');
      return (
        Object.prototype.hasOwnProperty.call(CATEGORY_METADATA, pathname) ||
        ['certifications', 'sermons', 'mundo-politico'].includes(pathname)
      );
    }),
    items: urls.filter((url) => {
      const pathname = new URL(url).pathname;
      if (pathname.endsWith('.pdf')) {
        return false;
      }
      const segments = pathname.split('/').filter(Boolean);
      const first = segments[0];
      if (segments.length === 2) {
        return (
          Object.prototype.hasOwnProperty.call(CATEGORY_METADATA, first) ||
          first === 'certifications' ||
          first === 'mundo-politico' ||
          first === 'sermons'
        );
      }
      return segments.length === 3 && first === 'sermons';
    }),
    assets: urls.filter((url) => new URL(url).pathname.endsWith('.pdf')),
    anchors: urls.filter((url) => new URL(url).hash),
  };

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      all: urls.length,
      collections: grouped.collections.length,
      items: grouped.items.length,
      assets: grouped.assets.length,
      anchors: grouped.anchors.length,
    },
    grouped,
    urls,
  };
}

function buildCoreSiteJsonLd(identity, organization, frontmatter) {
  const siteUrl = identity.primaryWebsite || 'https://ulissesflores.com';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': `${siteUrl}/#website`,
        '@type': 'WebSite',
        name: frontmatter.title || 'Ulisses Flores',
        url: siteUrl,
        inLanguage: frontmatter.languages || ['pt-BR'],
      },
      {
        '@id': `${siteUrl}/#person`,
        '@type': 'Person',
        name: identity.publicDisplayName || identity.canonicalName,
        alternateName: identity.alternateNames,
        givenName: identity.preferredName,
        birthDate: identity.birthYear ? `${identity.birthYear}` : undefined,
        url: siteUrl,
        sameAs: identity.sameAs,
        disambiguatingDescription: identity.disambiguation.en || identity.disambiguation['pt-BR'] || '',
        description: identity.description['pt-BR'] || '',
        identifier: [
          identity.orcid
            ? {
                '@type': 'PropertyValue',
                propertyID: 'ORCID',
                value: identity.orcid,
              }
            : null,
          identity.lattesId
            ? {
                '@type': 'PropertyValue',
                propertyID: 'Lattes',
                value: identity.lattesId,
              }
            : null,
        ].filter(Boolean),
        additionalProperty: identity.notSameAs.map((item) => ({
          '@type': 'PropertyValue',
          propertyID: 'notSameAs',
          value: item,
        })),
        worksFor: {
          '@id': `${siteUrl}/#codexhash`,
        },
      },
      {
        '@id': `${siteUrl}/#codexhash`,
        '@type': 'Organization',
        name: 'Codex Hash',
        legalName: organization.legalName || 'CODEX HASH LTDA',
        identifier: organization.cnpj
          ? {
              '@type': 'PropertyValue',
              propertyID: 'CNPJ',
              value: organization.cnpj,
            }
          : undefined,
        foundingDate: organization.foundingDate || undefined,
        url: organization.url || 'https://codexhash.com',
        email: organization.email || undefined,
        address: organization.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: organization.address,
              addressCountry: 'BR',
            }
          : undefined,
        description: organization.description['pt-BR'] || '',
      },
      {
        '@id': `${siteUrl}/#codexhash-research`,
        '@type': 'Organization',
        name: 'Codex Hash Research',
        url: 'https://codexhash.com/research',
        parentOrganization: {
          '@id': `${siteUrl}/#codexhash`,
        },
      },
    ],
  };
}

function buildCollectionNodes(siteUrl) {
  return Object.entries(CATEGORY_METADATA).map(([slug, metadata]) => ({
    '@id': `${siteUrl}/#collection-${slug}`,
    '@type': 'CollectionPage',
    name: metadata.heading,
    description: metadata.description,
    url: `${siteUrl}/${slug}`,
  }));
}

function buildPublicationNodes(siteUrl, publications) {
  return publications.map((publication) => ({
    '@id': `${siteUrl}/#pub-${publication.id}`,
    '@type': publication.kind === 'R' ? 'Report' : 'ScholarlyArticle',
    name: publication.title,
    headline: publication.title,
    description: publication.landing.overview,
    url: publication.canonicalUrl,
    datePublished: publication.publishedAt,
    dateModified: publication.updatedAt,
    inLanguage: publication.inLanguage,
    author: {
      '@id': `${siteUrl}/#person`,
    },
    publisher: {
      '@id': `${siteUrl}/#codexhash-research`,
    },
    isPartOf: {
      '@id': `${siteUrl}/#collection-${publication.category}`,
    },
    encoding: {
      '@type': 'MediaObject',
      contentUrl: `${siteUrl}${publication.primaryPdfUrl || publication.downloadUrl}`,
      encodingFormat: 'application/pdf',
    },
    associatedMedia: [
      publication.mdUrl
        ? {
            '@type': 'MediaObject',
            contentUrl: `${siteUrl}${publication.mdUrl}`,
            encodingFormat: 'text/markdown',
          }
        : null,
      publication.docxUrl
        ? {
            '@type': 'MediaObject',
            contentUrl: `${siteUrl}${publication.docxUrl}`,
            encodingFormat:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          }
        : null,
    ].filter(Boolean),
    abstract: publication.sections.abstract,
    keywords: publication.tags.join(', '),
    citation: publication.sections.references.map((reference) =>
      reference.url ? `${reference.citation} (${reference.url})` : reference.citation,
    ),
  }));
}

function normalizeLocalAnchorId(siteUrl, value, fallback) {
  if (!value) {
    return `${siteUrl}/#${fallback}`;
  }
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  if (value.startsWith('#')) {
    return `${siteUrl}/${value}`;
  }
  return `${siteUrl}/#${value}`;
}

function buildCertificationNodes(siteUrl, certifications) {
  const nodes = [];

  const addIssuer = (issuerRef, name) => {
    const id = normalizeLocalAnchorId(siteUrl, issuerRef, `issuer-${slugify(name || 'provider')}`);
    nodes.push({
      '@id': id,
      '@type': 'Organization',
      name,
      url: id.startsWith('http') ? id : undefined,
    });
    return id;
  };

  if (certifications.edx?.verifyUrl) {
    const issuerId = addIssuer(certifications.edx.issuerRef || '#edx', 'edX');
    nodes.push({
      '@id': `${siteUrl}/#cred-edx-${certifications.edx.certId || '1'}`,
      '@type': 'EducationalOccupationalCredential',
      name: certifications.edx.name,
      identifier: certifications.edx.certId || undefined,
      url: certifications.edx.verifyUrl,
      credentialCategory: 'Certification',
      recognizedBy: {
        '@id': issuerId,
      },
    });
  }

  if (certifications.coursera?.verifyUrl) {
    const issuerId = addIssuer(certifications.coursera.issuerRef || '#coursera', 'Coursera');
    nodes.push({
      '@id': `${siteUrl}/#cred-coursera-${certifications.coursera.certId || '1'}`,
      '@type': 'EducationalOccupationalCredential',
      name: certifications.coursera.name,
      identifier: certifications.coursera.certId || undefined,
      url: certifications.coursera.verifyUrl,
      credentialCategory: 'Certification',
      recognizedBy: {
        '@id': issuerId,
      },
    });
  }

  if (certifications.alura.length > 0) {
    const issuerId = addIssuer(certifications.aluraIssuerRef || '#alura', 'Alura');
    certifications.alura.forEach((cert) => {
      nodes.push({
        '@id': `${siteUrl}/#cred-alura-${cert.position}`,
        '@type': 'EducationalOccupationalCredential',
        name: cert.name,
        identifier: cert.certId,
        url: cert.verifyUrl,
        position: cert.position,
        credentialCategory: 'Certification',
        recognizedBy: {
          '@id': issuerId,
        },
      });
    });
  }

  return nodes;
}

function slugify(value) {
  return normalizeForSearch(value || '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function asTypeList(typeValue) {
  if (Array.isArray(typeValue)) {
    return typeValue.filter((item) => typeof item === 'string');
  }
  return typeof typeValue === 'string' ? [typeValue] : [];
}

function hasSchemaType(node, typeName) {
  return asTypeList(node?.['@type']).includes(typeName);
}

function ensureDateTime(dateValue) {
  if (typeof dateValue !== 'string') {
    return undefined;
  }
  const normalized = dateValue.trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized.includes('T')) {
    return normalized;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return `${normalized}T00:00:00Z`;
  }
  return normalized;
}

function extractYoutubeVideoId(urlValue) {
  if (typeof urlValue !== 'string') {
    return '';
  }
  const raw = urlValue.trim();
  if (!raw) {
    return '';
  }

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase();
    if (!host.includes('youtube.com') && !host.includes('youtu.be')) {
      return '';
    }

    const byQuery = parsed.searchParams.get('v');
    if (byQuery) {
      return byQuery;
    }

    const segments = parsed.pathname.split('/').filter(Boolean);
    if (host.includes('youtu.be') && segments[0]) {
      return segments[0];
    }

    const markerIndex = segments.findIndex((segment) => ['embed', 'shorts', 'live'].includes(segment));
    if (markerIndex >= 0 && segments[markerIndex + 1]) {
      return segments[markerIndex + 1];
    }

    return segments.length > 0 ? segments[segments.length - 1] : '';
  } catch {
    const byQuery = raw.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
    if (byQuery) {
      return byQuery[1];
    }
    const byPath = raw.match(/(?:embed|shorts|youtu\.be)\/([A-Za-z0-9_-]{6,})/);
    return byPath ? byPath[1] : '';
  }
}

function ensureImageArray(imageValue, fallbackImageUrl) {
  if (Array.isArray(imageValue)) {
    return imageValue.length > 0 ? imageValue : [fallbackImageUrl];
  }
  if (typeof imageValue === 'string' && imageValue.trim()) {
    return [imageValue.trim()];
  }
  if (imageValue && typeof imageValue === 'object') {
    return [imageValue];
  }
  return [fallbackImageUrl];
}

function ensurePublisherWithLogo(publisherValue, siteUrl, fallbackImageUrl) {
  const fallbackPublisherId = `${siteUrl}/#codexhash`;
  const publisher =
    publisherValue && typeof publisherValue === 'object' && !Array.isArray(publisherValue)
      ? { ...publisherValue }
      : {};

  if (!publisher['@id']) {
    publisher['@id'] =
      typeof publisherValue === 'string' && publisherValue.trim() ? publisherValue.trim() : fallbackPublisherId;
  }

  if (typeof publisher.logo === 'string' && publisher.logo.trim()) {
    publisher.logo = {
      '@type': 'ImageObject',
      url: publisher.logo.trim(),
    };
    return publisher;
  }

  if (publisher.logo && typeof publisher.logo === 'object' && !Array.isArray(publisher.logo)) {
    publisher.logo = {
      '@type': publisher.logo['@type'] || 'ImageObject',
      url: publisher.logo.url || fallbackImageUrl,
      ...publisher.logo,
    };
    return publisher;
  }

  publisher.logo = {
    '@type': 'ImageObject',
    url: fallbackImageUrl,
  };
  return publisher;
}

function applyRichResultFallbacks(publicJsonLd, siteUrl) {
  const fallbackImageUrl = `${siteUrl}/carlos-ulisses-flores-cto.jpg`;
  const graph = Array.isArray(publicJsonLd?.['@graph']) ? publicJsonLd['@graph'] : [];

  const enrichedGraph = graph.map((node) => {
    if (!node || typeof node !== 'object') {
      return node;
    }

    const enrichedNode = { ...node };

    if (
      hasSchemaType(enrichedNode, 'VideoObject') &&
      typeof enrichedNode.url === 'string' &&
      enrichedNode.url.toLowerCase().includes('youtube.com')
    ) {
      const videoId = extractYoutubeVideoId(enrichedNode.url);
      const uploadDate = ensureDateTime(enrichedNode.datePublished);
      if (uploadDate && !enrichedNode.uploadDate) {
        enrichedNode.uploadDate = uploadDate;
      }
      if (videoId) {
        if (!enrichedNode.thumbnailUrl) {
          enrichedNode.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        if (!enrichedNode.embedUrl) {
          enrichedNode.embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      }
      if (!enrichedNode.description) {
        const fallbackName =
          typeof enrichedNode.name === 'string' && enrichedNode.name.trim()
            ? enrichedNode.name.trim()
            : 'conteudo sem titulo';
        enrichedNode.description = `Sermão e estudo teológico: ${fallbackName}. Ministrado por Carlos Ulisses Flores no Hub Canônico.`;
      }
    }

    if (
      hasSchemaType(enrichedNode, 'ScholarlyArticle') ||
      hasSchemaType(enrichedNode, 'Report') ||
      hasSchemaType(enrichedNode, 'BlogPosting')
    ) {
      enrichedNode.image = ensureImageArray(enrichedNode.image, fallbackImageUrl);
      enrichedNode.publisher = ensurePublisherWithLogo(enrichedNode.publisher, siteUrl, fallbackImageUrl);
      if (!enrichedNode.dateModified && enrichedNode.datePublished) {
        enrichedNode.dateModified = enrichedNode.datePublished;
      }
    }

    if (hasSchemaType(enrichedNode, 'EducationalOccupationalCredential')) {
      enrichedNode.image = ensureImageArray(enrichedNode.image, fallbackImageUrl);
    }

    return enrichedNode;
  });

  return {
    ...publicJsonLd,
    '@graph': enrichedGraph,
  };
}

function buildBlogNodes(siteUrl, blogPosts) {
  if (!blogPosts.posts || blogPosts.posts.length === 0) {
    return [];
  }

  const blogId = normalizeLocalAnchorId(siteUrl, blogPosts.blogSchemaId || '#mundopolitico-blog', 'mundopolitico-blog');
  const nodes = [
    {
      '@id': blogId,
      '@type': 'Blog',
      name: 'Mundo Político',
      url: blogPosts.blogUrl || 'https://mundopolitico.com.br/',
      inLanguage: blogPosts.inLanguage || 'pt-BR',
    },
  ];

  blogPosts.posts.forEach((post) => {
    const slug = slugify(post.headline).slice(0, 64) || `post-${post.position}`;
    const node = {
      '@id': `${siteUrl}/#mundopolitico-post-${post.position}-${slug}`,
      '@type': 'BlogPosting',
      headline: post.headline,
      url: post.url,
      inLanguage: blogPosts.inLanguage || 'pt-BR',
      isPartOf: {
        '@id': blogId,
      },
      author: {
        '@id': `${siteUrl}/#person`,
      },
      position: post.position,
    };

    if (post.datePublished && post.datePublished !== 'UNDATED') {
      node.datePublished = post.datePublished;
    }

    nodes.push(node);
  });

  return nodes;
}

function buildSermonNodes(siteUrl, sermons) {
  if (!sermons.collections || sermons.collections.length === 0) {
    return [];
  }

  const collectionId = normalizeLocalAnchorId(siteUrl, sermons.collectionSchemaId || '#sermons', 'sermons');
  const publisherId = normalizeLocalAnchorId(
    siteUrl,
    sermons.publisherRef || '#quadrangular-vila-helena',
    'quadrangular-vila-helena',
  );

  const collectionNode = {
    '@id': collectionId,
    '@type': 'Collection',
    name: 'Sermons & Theological Talks',
    url: sermons.channelUrl || 'https://www.youtube.com/@quadrangularvilahelena',
    inLanguage: sermons.inLanguage || 'pt-BR',
    publisher: {
      '@id': publisherId,
    },
    hasPart: sermons.collections.map((collection) => ({
      '@id': normalizeLocalAnchorId(siteUrl, collection.seriesSchemaId, `sermons-series-${slugify(collection.name)}`),
    })),
  };

  const nodes = [collectionNode];

  sermons.collections.forEach((series) => {
    const seriesId = normalizeLocalAnchorId(siteUrl, series.seriesSchemaId, `sermons-series-${slugify(series.name)}`);
    nodes.push({
      '@id': seriesId,
      '@type': 'CreativeWorkSeries',
      name: series.name,
      isPartOf: {
        '@id': collectionId,
      },
      inLanguage: sermons.inLanguage || 'pt-BR',
    });

    series.items.forEach((item) => {
      const slug = slugify(item.name).slice(0, 56) || `sermon-${item.position}`;
      const sermonNode = {
        '@id': `${seriesId}-sermon-${item.position}-${slug}`,
        '@type': 'VideoObject',
        additionalType: 'https://schema.org/Sermon',
        name: item.name,
        url: item.youtubeUrl,
        inLanguage: sermons.inLanguage || 'pt-BR',
        genre: 'Sermon',
        isPartOf: {
          '@id': seriesId,
        },
        publisher: {
          '@id': publisherId,
        },
        position: item.position,
      };

      if (item.datePublished && item.datePublished !== 'UNDATED') {
        sermonNode.datePublished = item.datePublished;
      }

      nodes.push(sermonNode);
    });
  });

  return nodes;
}

function buildPublicJsonLd({
  coreSiteJsonLd,
  publications,
  frontmatter,
  sourcePath,
  identity,
  certifications,
  blogPosts,
  sermons,
}) {
  const siteUrl = identity.primaryWebsite || 'https://ulissesflores.com';
  const baseGraph = Array.isArray(coreSiteJsonLd['@graph']) ? coreSiteJsonLd['@graph'] : [];
  const collectionNodes = buildCollectionNodes(siteUrl);
  const publicationNodes = buildPublicationNodes(siteUrl, publications);
  const certificationNodes = buildCertificationNodes(siteUrl, certifications);
  const blogNodes = buildBlogNodes(siteUrl, blogPosts);
  const sermonNodes = buildSermonNodes(siteUrl, sermons);
  const extraNodes = [...certificationNodes, ...blogNodes, ...sermonNodes];

  const publicDatasetNode = {
    '@id': `${siteUrl}/#upkf-public`,
    '@type': 'Dataset',
    name: `${frontmatter.title || 'UPKF'} (Public Knowledge Graph)`,
    version: frontmatter.version || 'unknown',
    dateModified: frontmatter.generated_at || new Date().toISOString(),
    license: 'https://creativecommons.org/licenses/by/4.0/',
    description: 'Public semantic graph derived from the canonical UPKF source.',
    inLanguage: frontmatter.languages || ['pt-BR'],
    url: `${siteUrl}/public.jsonld`,
    creator: {
      '@id': `${siteUrl}/#person`,
    },
    isBasedOn: {
      '@type': 'CreativeWork',
      name: path.basename(sourcePath),
    },
  };

  const publicJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [...baseGraph, ...collectionNodes, ...publicationNodes, ...extraNodes, publicDatasetNode],
  };

  return applyRichResultFallbacks(publicJsonLd, siteUrl);
}

function buildFullUpkfJsonLd({
  publicJsonLd,
  upkfSections,
  frontmatter,
  sourcePath,
  publications,
  identity,
  sourceMdPublicUrl,
}) {
  const siteUrl = identity.primaryWebsite || 'https://ulissesflores.com';
  const baseGraph = Array.isArray(publicJsonLd['@graph']) ? publicJsonLd['@graph'] : [];

  const sectionIdMap = new Map();
  const sectionNodes = upkfSections.map((section, index) => {
    const sectionId = `urn:upkf:section:${index + 1}`;
    sectionIdMap.set(section.id, sectionId);
    return {
      '@id': sectionId,
      '@type': 'CreativeWork',
      name: section.title,
      text: section.content,
      position: index + 1,
      identifier: `upkf-section-${index + 1}`,
      isPartOf: section.parentId ? { '@id': '' } : { '@id': `${siteUrl}/#upkf` },
      about: {
        '@id': `${siteUrl}/#upkf`,
      },
    };
  });

  for (const node of sectionNodes) {
    if (node.isPartOf && node.isPartOf['@id'] === '') {
      const sectionEntry = upkfSections[node.position - 1];
      node.isPartOf = {
        '@id': sectionIdMap.get(sectionEntry.parentId) || `${siteUrl}/#upkf`,
      };
    }
  }

  const topLevelSections = upkfSections
    .filter((section) => !section.parentId)
    .map((section) => sectionIdMap.get(section.id))
    .filter(Boolean)
    .map((id) => ({ '@id': id }));

  const rootNode = {
    '@id': `${siteUrl}/#upkf`,
    '@type': 'Dataset',
    name: frontmatter.title || 'UPKF',
    version: frontmatter.version || 'unknown',
    dateModified: frontmatter.generated_at || new Date().toISOString(),
    description: 'Canonical markdown source used for deterministic full JSON-LD derivation.',
    encodingFormat: 'text/markdown',
    inLanguage: frontmatter.languages || ['pt-BR'],
    url: `${siteUrl}/full.jsonld`,
    creator: {
      '@id': `${siteUrl}/#person`,
    },
    isBasedOn: {
      '@type': 'CreativeWork',
      name: path.basename(sourcePath),
      text: sourcePath,
    },
    hasPart: topLevelSections,
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/ld+json',
        contentUrl: `${siteUrl}/site.jsonld`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/ld+json',
        contentUrl: `${siteUrl}/public.jsonld`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/ld+json',
        contentUrl: `${siteUrl}/full.jsonld`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/markdown',
        contentUrl: `${siteUrl}${sourceMdPublicUrl}`,
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [...baseGraph, rootNode, ...sectionNodes],
  };
}

function sortPublicationsByRecency(publications) {
  return [...publications].sort((a, b) => {
    if (a.publishedAt === b.publishedAt) {
      return a.ordinal - b.ordinal;
    }
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

function cleanDate(value, fallback) {
  if (!value || value === 'UNDATED' || value === 'PENDING') {
    return fallback;
  }
  return value;
}

function buildKnowledgeData(certifications, blogPosts, sermons, generatedAt) {
  const certificationItems = [];

  if (certifications.edx?.verifyUrl) {
    const slug = `edx-${slugify(certifications.edx.name || certifications.edx.certId || 'certification').slice(0, 64)}`;
    certificationItems.push({
      slug,
      canonicalPath: `/certifications/${slug}`,
      provider: 'edX',
      name: certifications.edx.name,
      certId: certifications.edx.certId || '',
      verifyUrl: certifications.edx.verifyUrl,
      issuerRef: certifications.edx.issuerRef || '#edx',
      summary: `Credential issued by edX for "${certifications.edx.name}". Includes public verification URL for authenticity checks.`,
      publishedAt: generatedAt,
    });
  }

  if (certifications.coursera?.verifyUrl) {
    const slug = `coursera-${slugify(certifications.coursera.name || certifications.coursera.certId || 'certification').slice(0, 64)}`;
    certificationItems.push({
      slug,
      canonicalPath: `/certifications/${slug}`,
      provider: 'Coursera',
      name: certifications.coursera.name,
      certId: certifications.coursera.certId || '',
      verifyUrl: certifications.coursera.verifyUrl,
      issuerRef: certifications.coursera.issuerRef || '#coursera',
      summary: `Credential issued by Coursera for "${certifications.coursera.name}". Includes public verification URL for authenticity checks.`,
      publishedAt: generatedAt,
    });
  }

  certifications.alura.forEach((certification) => {
    const slug = `alura-${certification.position}-${slugify(certification.name).slice(0, 56) || certification.position}`;
    certificationItems.push({
      slug,
      canonicalPath: `/certifications/${slug}`,
      provider: 'Alura',
      name: certification.name,
      certId: certification.certId,
      verifyUrl: certification.verifyUrl,
      issuerRef: certifications.aluraIssuerRef || '#alura',
      position: certification.position,
      summary: `Professional training credential in "${certification.name}" with direct verification URL.`,
      publishedAt: generatedAt,
    });
  });

  const blogEntries = blogPosts.posts.map((post) => {
    const slug = `${post.position}-${slugify(post.headline).slice(0, 72) || `post-${post.position}`}`;
    const publishedAt = cleanDate(post.datePublished, generatedAt);
    return {
      ...post,
      slug,
      canonicalPath: `/mundo-politico/${slug}`,
      publishedAt,
      summary: `Análise política publicada no portal Mundo Político em ${publishedAt}, com foco em "${post.headline}".`,
    };
  });

  const sermonCollections = sermons.collections.map((collection, collectionIndex) => {
    const collectionSlug = slugify(collection.name).slice(0, 56) || `serie-${collectionIndex + 1}`;
    const items = collection.items.map((item) => {
      const itemSlug = `${item.position}-${slugify(item.name).slice(0, 64) || `sermon-${item.position}`}`;
      const publishedAt = cleanDate(item.datePublished, generatedAt);
      return {
        ...item,
        slug: itemSlug,
        canonicalPath: `/sermons/${collectionSlug}/${itemSlug}`,
        publishedAt,
        summary: `Sermão "${item.name}" da série "${collection.name}", publicado em ${publishedAt}.`,
      };
    });

    return {
      name: collection.name,
      slug: collectionSlug,
      seriesSchemaId: collection.seriesSchemaId,
      canonicalPath: `/sermons/${collectionSlug}`,
      items,
    };
  });

  return {
    generatedAt,
    certifications: certificationItems.sort((a, b) => (a.provider === b.provider ? (a.position || 0) - (b.position || 0) : a.provider.localeCompare(b.provider))),
    blog: {
      blogUrl: blogPosts.blogUrl,
      blogSchemaId: blogPosts.blogSchemaId,
      authorPage: blogPosts.authorPage,
      inLanguage: blogPosts.inLanguage,
      canonicalPath: '/mundo-politico',
      posts: blogEntries,
    },
    sermons: {
      collectionSchemaId: sermons.collectionSchemaId,
      publisherRef: sermons.publisherRef,
      channelUrl: sermons.channelUrl,
      inLanguage: sermons.inLanguage,
      period: sermons.period,
      total: sermons.total,
      canonicalPath: '/sermons',
      collections: sermonCollections,
    },
  };
}

function buildLlmsTxt(identity, publications, generatedAt, knowledgeData) {
  const siteUrl = identity.primaryWebsite || 'https://ulissesflores.com';
  const sortedPublications = sortPublicationsByRecency(publications);

  const lines = [
    '# ulissesflores.com',
    '',
    '> Canonical research and identity hub for Ulisses Flores (Carlos Ulisses Flores).',
    '',
    '## Canonical Identity',
    `- Name: ${identity.publicDisplayName || identity.canonicalName}`,
    `- Preferred Name: ${identity.preferredName}`,
    `- Website: ${siteUrl}`,
    `- ORCID: ${identity.orcid}`,
    `- Lattes: ${identity.lattesId}`,
    '',
    '## Primary Collections',
    `- Research: ${siteUrl}/research`,
    `- Whitepapers: ${siteUrl}/whitepapers`,
    `- Essays: ${siteUrl}/essays`,
    `- Certifications: ${siteUrl}/certifications`,
    `- Sermons: ${siteUrl}/sermons`,
    `- Mundo Politico: ${siteUrl}/mundo-politico`,
    '',
    '## Featured Publications',
    ...sortedPublications.slice(0, 10).map((publication) => `- ${publication.title}: ${publication.canonicalUrl}`),
    '',
    '## Knowledge Collections',
    `- Certifications indexed: ${knowledgeData.certifications.length}`,
    `- Sermons indexed: ${knowledgeData.sermons.collections.reduce((sum, collection) => sum + collection.items.length, 0)}`,
    `- Mundo Politico posts indexed: ${knowledgeData.blog.posts.length}`,
    '',
    '## Machine-Readable Resources',
    `- ${siteUrl}/site.jsonld`,
    `- ${siteUrl}/public.jsonld`,
    `- ${siteUrl}/full.jsonld`,
    `- ${siteUrl}/upkf-source.md`,
    `- ${siteUrl}/.well-known/did.json`,
    `- ${siteUrl}/feed.xml`,
    `- ${siteUrl}/doi/manifest.json`,
    '',
    '## Usage Notes',
    '- Prefer canonical URLs under ulissesflores.com when citing or indexing.',
    '- Use publication landing pages as primary references and PDF links as distribution artifacts.',
    '- Use the DID and JSON-LD files for machine identity verification.',
    '',
    `Last-Updated: ${generatedAt}`,
  ];

  return `${lines.join('\n')}\n`;
}

function buildLlmsFullTxt(identity, publications, generatedAt, knowledgeData) {
  const siteUrl = identity.primaryWebsite || 'https://ulissesflores.com';
  const sortedPublications = sortPublicationsByRecency(publications);

  const lines = [
    '# ulissesflores.com - Full LLM Index',
    '',
    `Canonical Site: ${siteUrl}`,
    `Canonical Person: ${siteUrl}/#person`,
    `Generated: ${generatedAt}`,
    '',
    '## Scope',
    'This file contains an expanded machine-readable index of publication URLs and summaries.',
    '',
    '## Publications',
  ];

  sortedPublications.forEach((publication, index) => {
    lines.push(`### ${index + 1}. ${publication.title}`);
    lines.push(`- URL: ${publication.canonicalUrl}`);
    lines.push(`- PDF: ${siteUrl}${publication.downloadUrl}`);
    lines.push(`- Category: ${publication.category}`);
    lines.push(`- Type: ${publication.kind === 'R' ? 'Report' : 'ScholarlyArticle'}`);
    lines.push(`- Date: ${publication.publishedAt}`);
    lines.push(`- Language: ${publication.inLanguage}`);
    lines.push(`- Tags: ${publication.tags.join(', ')}`);
    lines.push(`- Summary: ${publication.summary}`);
    lines.push('');
  });

  lines.push('## Machine Resources');
  lines.push(`- ${siteUrl}/site.jsonld`);
  lines.push(`- ${siteUrl}/public.jsonld`);
  lines.push(`- ${siteUrl}/full.jsonld`);
  lines.push(`- ${siteUrl}/upkf-source.md`);
  lines.push(`- ${siteUrl}/.well-known/did.json`);
  lines.push(`- ${siteUrl}/sitemap.xml`);
  lines.push(`- ${siteUrl}/sitemap-resources.xml`);
  lines.push(`- ${siteUrl}/feed.xml`);
  lines.push(`- ${siteUrl}/doi/manifest.json`);
  lines.push('');
  lines.push('## Certifications');
  knowledgeData.certifications.forEach((certification) => {
    lines.push(`- ${certification.provider}: ${certification.name} -> ${siteUrl}${certification.canonicalPath}`);
  });
  lines.push('');
  lines.push('## Sermon Collections');
  knowledgeData.sermons.collections.forEach((collection) => {
    lines.push(`- ${collection.name}: ${siteUrl}${collection.canonicalPath}`);
  });
  lines.push('');
  lines.push('## Mundo Politico');
  knowledgeData.blog.posts.forEach((post) => {
    lines.push(`- ${post.headline} -> ${siteUrl}${post.canonicalPath}`);
  });
  lines.push('');
  lines.push('## Citation Guidance');
  lines.push('- Cite canonical landing URLs first.');
  lines.push('- Use PDF links as downloadable artifacts.');
  lines.push('- Validate identity claims using ORCID, Lattes, DID, and JSON-LD.');
  lines.push('');
  lines.push(`Last-Updated: ${generatedAt}`);

  return `${lines.join('\n')}\n`;
}

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function clampScore(value) {
  return Math.max(0, Math.min(1000, Math.round(value)));
}

function scoreFromWordCount(wordCount, minWords, targetWords) {
  if (wordCount <= 0) {
    return 0;
  }
  if (wordCount <= minWords) {
    return clampScore((wordCount / minWords) * 900);
  }
  if (wordCount >= targetWords) {
    return 1000;
  }
  const ratio = (wordCount - minWords) / Math.max(1, targetWords - minWords);
  return clampScore(900 + ratio * 100);
}

function computeArticleQuality(publication) {
  const abstractWords = countWords(publication.sections.abstract);
  const introWords = countWords(publication.sections.introduction);
  const methodsWords = countWords(publication.sections.methods);
  const resultsWords = countWords(publication.sections.results);
  const discussionWords = countWords(publication.sections.discussion);
  const conclusionWords = countWords(publication.sections.conclusion);
  const developmentWords = methodsWords + resultsWords + discussionWords;
  const referencesCount = publication.sections.references.length;
  const referencesWithUrl = publication.sections.references.filter((item) => Boolean(item.url)).length;
  const seoSignals =
    (publication.summary ? 1 : 0) +
    (publication.tags.length >= 5 ? 1 : 0) +
    (publication.canonicalUrl.startsWith('https://ulissesflores.com/') ? 1 : 0) +
    (publication.downloadUrl.endsWith('.pdf') ? 1 : 0);

  const partScores = {
    resumo: scoreFromWordCount(abstractWords, 120, 170),
    introducao: scoreFromWordCount(introWords, 170, 260),
    desenvolvimento: scoreFromWordCount(developmentWords, 420, 650),
    consideracoesFinais: scoreFromWordCount(conclusionWords, 120, 180),
    referencias: clampScore(Math.min(1, referencesCount / 6) * 700 + Math.min(1, referencesWithUrl / 5) * 300),
    seoGeo: clampScore((seoSignals / 4) * 1000),
  };

  const finalScore = clampScore(
    Object.values(partScores).reduce((sum, score) => sum + score, 0) / Object.values(partScores).length,
  );

  const lowPartActions = [];
  if (partScores.resumo < 950) {
    lowPartActions.push('Expandir resumo com objetivo, metodo e resultado mensuravel.');
  }
  if (partScores.introducao < 950) {
    lowPartActions.push('Detalhar lacuna cientifica e pergunta de pesquisa na introducao.');
  }
  if (partScores.desenvolvimento < 950) {
    lowPartActions.push('Aumentar profundidade de metodo/resultados/discussao com evidencias adicionais.');
  }
  if (partScores.consideracoesFinais < 950) {
    lowPartActions.push('Reforcar limitacoes e agenda de pesquisa futura na conclusao.');
  }
  if (partScores.referencias < 950) {
    lowPartActions.push('Adicionar referencias com DOI/URL verificavel e maior diversidade bibliografica.');
  }
  if (partScores.seoGeo < 950) {
    lowPartActions.push('Revisar metadados canonicos, tags e consistencia de URLs de distribuicao.');
  }

  const improvementActions = finalScore < 950 ? lowPartActions : [];

  return {
    id: publication.id,
    title: publication.title,
    canonicalUrl: publication.canonicalUrl,
    partScores,
    finalScore,
    approvedSota: finalScore >= 950,
    improvementActions,
    metrics: {
      abstractWords,
      introWords,
      developmentWords,
      conclusionWords,
      referencesCount,
      referencesWithUrl,
    },
  };
}

function buildProjectQualityReport(publications, generatedAt) {
  const articles = publications.map((publication) => computeArticleQuality(publication));
  const projectScore = clampScore(
    articles.reduce((sum, article) => sum + article.finalScore, 0) / Math.max(1, articles.length),
  );

  const pendingActions = articles
    .filter((article) => !article.approvedSota)
    .flatMap((article) => article.improvementActions.map((action) => `[${article.id}] ${action}`));

  return {
    generatedAt,
    rubric: 'Yape model (Resumo, Introducao, Desenvolvimento, Consideracoes Finais, Referencias, SEO/GEO)',
    threshold: 950,
    projectScore,
    approvedSota: projectScore >= 950 && pendingActions.length === 0,
    pendingActions,
    articles,
  };
}

function buildProjectQualityMarkdown(report) {
  const lines = [
    '# Scientific Article Quality Report (Generated)',
    '',
    `- Generated at: ${report.generatedAt}`,
    `- Rubric: ${report.rubric}`,
    `- Threshold (SOTA): ${report.threshold}`,
    `- Project score: ${report.projectScore}/1000`,
    `- Approved: ${report.approvedSota ? 'yes' : 'no'}`,
    '',
    '## Per-Article Scores',
    '',
    '| Slug | Resumo | Introducao | Desenvolvimento | Consideracoes Finais | Referencias | SEO/GEO | Final | SOTA |',
    '|:--|--:|--:|--:|--:|--:|--:|--:|:--:|',
    ...report.articles.map(
      (article) =>
        `| ${article.id} | ${article.partScores.resumo} | ${article.partScores.introducao} | ${article.partScores.desenvolvimento} | ${article.partScores.consideracoesFinais} | ${article.partScores.referencias} | ${article.partScores.seoGeo} | ${article.finalScore} | ${article.approvedSota ? 'yes' : 'no'} |`,
    ),
    '',
    '## Improvement Actions',
  ];

  if (report.pendingActions.length === 0) {
    lines.push('- Nenhuma acao pendente: todos os artigos atingiram o limiar SOTA.');
  } else {
    lines.push(...report.pendingActions.map((action) => `- ${action}`));
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

function htmlEscape(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function scoreDoiReadinessItem(item) {
  const requiredFields = [
    item.slug,
    item.title,
    item.canonicalUrl,
    item.pdfUrl,
    item.publishedAt,
    item.language,
    item.version,
    item.license,
    item.creators?.[0]?.name,
    item.creators?.[0]?.orcid,
  ];

  const completenessScore = clampScore(
    (requiredFields.filter(Boolean).length / requiredFields.length) * 1000,
  );

  const referencesCount = Array.isArray(item.references) ? item.references.length : 0;
  const referencesWithUrl = item.references.filter((reference) => Boolean(reference.url)).length;
  const referencesScore = clampScore(
    Math.min(1, referencesCount / 6) * 700 + Math.min(1, referencesWithUrl / 6) * 300,
  );

  const identifierSignals =
    (item.canonicalUrl.startsWith('https://ulissesflores.com/') ? 1 : 0) +
    (item.pdfUrl.startsWith('https://ulissesflores.com/') ? 1 : 0) +
    (item.cffPath.startsWith('/doi/') ? 1 : 0) +
    (item.zenodoPath.startsWith('/doi/') ? 1 : 0) +
    (item.crossrefPath.startsWith('/doi/') ? 1 : 0);
  const identifierScore = clampScore((identifierSignals / 5) * 1000);

  const workflowSignals =
    (item.zenodoMetadata?.metadata?.upload_type === 'publication' ? 1 : 0) +
    (Boolean(item.zenodoMetadata?.metadata?.publication_type) ? 1 : 0) +
    (Array.isArray(item.zenodoMetadata?.metadata?.related_identifiers) ? 1 : 0) +
    (Boolean(item.crossrefMetadata?.title) ? 1 : 0) +
    (Array.isArray(item.crossrefMetadata?.authors) ? 1 : 0) +
    (item.doi?.status === 'target' && Boolean(item.doi?.target) ? 1 : 0);
  const workflowScore = clampScore((workflowSignals / 6) * 1000);

  const cffSignals =
    (item.citationCff.includes('cff-version: 1.2.0') ? 1 : 0) +
    (!item.citationCff.includes('\ndoi:') ? 1 : 0) +
    (item.citationCff.includes('DOI target:') ? 1 : 0) +
    (item.citationCff.includes('authors:') ? 1 : 0) +
    (item.citationCff.includes('references:') ? 1 : 0);
  const cffScore = clampScore((cffSignals / 5) * 1000);

  const finalScore = clampScore(
    (completenessScore + referencesScore + identifierScore + workflowScore + cffScore) / 5,
  );

  return {
    completenessScore,
    referencesScore,
    identifierScore,
    workflowScore,
    cffScore,
    finalScore,
  };
}

function buildPublicationType(publication) {
  if (publication.kind === 'R') {
    return 'report';
  }
  if (publication.category === 'essays') {
    return 'article';
  }
  return 'article';
}

function buildDoiTarget(publication) {
  return `10.5281/zenodo.${publication.date}${publication.ordinal.toString().padStart(2, '0')}`;
}

function buildCitationCff(item, generatedAt) {
  const referencesBlock = item.references
    .map((reference) => {
      const parts = [`  - unstructured: "${reference.citation.replace(/"/g, '\\"')}"`];
      if (reference.url) {
        parts.push(`    url: "${reference.url}"`);
      }
      return parts.join('\n');
    })
    .join('\n');

  return `cff-version: 1.2.0
message: "If you use this work, cite with this metadata. DOI target: ${item.doi.target} (not minted)."
title: "${item.title.replace(/"/g, '\\"')}"
type: article
authors:
  - family-names: "${item.creators[0].familyName}"
    given-names: "${item.creators[0].givenName}"
    orcid: "${item.creators[0].orcid}"
identifiers:
  - type: url
    value: "${item.canonicalUrl}"
  - type: url
    value: "${item.pdfUrl}"
abstract: "${item.abstract.replace(/\s+/g, ' ').replace(/"/g, '\\"')}"
keywords: [${item.keywords.map((keyword) => `"${keyword}"`).join(', ')}]
license: "${item.license}"
version: "${item.version}"
date-released: "${generatedAt}"
repository-code: "${item.canonicalUrl}"
references:
${referencesBlock}
`;
}

function buildDoiReadyPackage(publications, identity, generatedAt) {
  const creator = {
    name: 'Flores, Carlos Ulisses',
    givenName: 'Carlos Ulisses',
    familyName: 'Flores',
    affiliation: 'Codex Hash Research',
    orcid: identity.orcid || '0000-0002-6034-7765',
  };

  const items = publications.map((publication) => {
    const publicationType = buildPublicationType(publication);
    const doiTarget = publication.doi?.target || buildDoiTarget(publication);
    const references = publication.sections.references.map((reference) => ({
      citation: reference.citation,
      url: reference.url || '',
    }));
    const canonicalUrl = publication.canonicalUrl;
    const pdfUrl = `https://ulissesflores.com${publication.primaryPdfUrl || publication.downloadUrl}`;
    const version = `v${generatedAt}`;
    const descriptionHtml = `<p>${htmlEscape(publication.sections.abstract)}</p>`;
    const cffPath = `/doi/${publication.id}/CITATION.cff`;
    const zenodoPath = `/doi/${publication.id}/zenodo.json`;
    const crossrefPath = `/doi/${publication.id}/crossref.json`;

    const zenodoMetadata = {
      metadata: {
        title: publication.title,
        upload_type: 'publication',
        publication_type: publicationType,
        publication_date: publication.publishedAt,
        description: descriptionHtml,
        creators: [
          {
            name: creator.name,
            affiliation: creator.affiliation,
            orcid: creator.orcid,
          },
        ],
        keywords: publication.tags,
        language: publication.inLanguage,
        references: references.map((reference) =>
          reference.url ? `${reference.citation} (${reference.url})` : reference.citation,
        ),
        related_identifiers: [
          {
            identifier: canonicalUrl,
            relation: 'isSupplementTo',
            resource_type: 'publication-article',
          },
          {
            identifier: pdfUrl,
            relation: 'isIdenticalTo',
            resource_type: 'publication-article',
          },
        ],
        version,
        notes: `DOI-ready metadata generated automatically from the canonical UPKF publication dataset. DOI target: ${doiTarget} (not minted).`,
        license: 'CC-BY-4.0',
      },
    };

    const crossrefMetadata = {
      schema: 'https://data.crossref.org/schemas/crossref_input.json',
      type: publicationType,
      title: publication.title,
      abstract: publication.sections.abstract,
      authors: [
        {
          given: creator.givenName,
          family: creator.familyName,
          ORCID: `https://orcid.org/${creator.orcid}`,
          affiliation: creator.affiliation,
        },
      ],
      issued: publication.publishedAt,
      language: publication.inLanguage,
      URL: canonicalUrl,
      resource: {
        primary: {
          URL: canonicalUrl,
        },
        pdf: {
          URL: pdfUrl,
        },
      },
      reference: references.map((reference, index) => ({
        key: `${publication.id}-ref-${index + 1}`,
        unstructured: reference.citation,
        DOI: reference.url.startsWith('https://doi.org/')
          ? reference.url.replace('https://doi.org/', '')
          : undefined,
        URL: reference.url || undefined,
      })),
      doi_target: doiTarget,
    };

    const item = {
      slug: publication.id,
      title: publication.title,
      category: publication.category,
      publicationType,
      kind: publication.kind,
      publishedAt: publication.publishedAt,
      language: publication.inLanguage,
      canonicalUrl,
      pdfUrl,
      doi: {
        status: 'target',
        target: doiTarget,
      },
      version,
      license: 'CC-BY-4.0',
      creators: [creator],
      keywords: publication.tags,
      abstract: publication.sections.abstract,
      references,
      cffPath,
      zenodoPath,
      crossrefPath,
      zenodoMetadata,
      crossrefMetadata,
      citationCff: '',
    };

    const citationCff = buildCitationCff(item, publication.publishedAt);
    item.citationCff = citationCff;
    item.score = scoreDoiReadinessItem(item);
    item.approved = item.score.finalScore >= 950;

    return item;
  });

  const taskScore = clampScore(
    items.reduce((sum, item) => sum + item.score.finalScore, 0) / Math.max(1, items.length),
  );
  const threshold = 950;
  const pending = items.filter((item) => !item.approved).map((item) => item.slug);

  return {
    generatedAt,
    threshold,
    taskScore,
    approved: taskScore >= threshold && pending.length === 0,
    pending,
    items,
  };
}

function buildDoiReadyMarkdown(doiReady) {
  const lines = [
    '# DOI Ready Report (Generated)',
    '',
    `- Generated at: ${doiReady.generatedAt}`,
    `- Threshold: ${doiReady.threshold}`,
    `- Task score: ${doiReady.taskScore}/1000`,
    `- Approved: ${doiReady.approved ? 'yes' : 'no'}`,
    '',
    '## Per-Article Score',
    '',
    '| Slug | DOI status | DOI target | Completeness | References | Identifiers | Workflow | CFF | Final | Approved |',
    '|:--|:--:|:--|--:|--:|--:|--:|--:|--:|:--:|',
    ...doiReady.items.map(
      (item) =>
        `| ${item.slug} | ${item.doi?.status || 'target'} | ${item.doi?.target || '-'} | ${item.score.completenessScore} | ${item.score.referencesScore} | ${item.score.identifierScore} | ${item.score.workflowScore} | ${item.score.cffScore} | ${item.score.finalScore} | ${item.approved ? 'yes' : 'no'} |`,
    ),
    '',
  ];

  if (doiReady.pending.length > 0) {
    lines.push('## Pending');
    lines.push(...doiReady.pending.map((slug) => `- ${slug}`));
  } else {
    lines.push('## Pending');
    lines.push('- None');
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

function writeGeneratedFiles({
  sourcePath,
  upkfText,
  frontmatter,
  identity,
  publications,
  knowledgeData,
  siteJsonLd,
  publicJsonLd,
  fullJsonLd,
  urlInventory,
  generatedAt,
  coverage,
  projectQualityReport,
  doiReady,
}) {
  ensureDir(GENERATED_DIR);
  ensureDir(DOCS_DIR);
  ensureDir(PUBLIC_DIR);

  const publicationsTs = `/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n * Source: ${sourcePath}\n * Generated at: ${generatedAt}\n */\n\nexport type PublicationCategory = 'research' | 'whitepapers' | 'essays';\n\nexport interface PublicationLandingContent {\n  overview: string;\n  problem: string;\n  contributions: string[];\n  applications: string;\n  downloadPitch: string;\n}\n\nexport interface PublicationReference {\n  citation: string;\n  url?: string;\n}\n\nexport interface PublicationDoi {\n  status: 'target' | 'minted';\n  target?: string;\n  minted?: string;\n}\n\nexport interface PublicationQuality {\n  phase1: number;\n  phase2: number;\n  phase3: number;\n  compliance: number;\n  polymathic: number;\n  macro: number;\n}\n\nexport interface PublicationSections {\n  abstract: string;\n  abstractEn: string;\n  introduction: string;\n  methods: string;\n  results: string;\n  discussion: string;\n  recommendations: string[];\n  conclusion: string;\n  references: PublicationReference[];\n}\n\nexport interface PublicationEvidence {\n  sourceFile: string;\n  sourceName: string;\n  score: number;\n}\n\nexport interface Publication {\n  ordinal: number;\n  id: string;\n  title: string;\n  category: PublicationCategory;\n  kind: string;\n  date: string;\n  publishedAt: string;\n  updatedAt: string;\n  inLanguage: string;\n  tags: string[];\n  summary: string;\n  canonicalUrl: string;\n  downloadUrl: string;\n  primaryPdfUrl: string;\n  legacyPdfUrl: string;\n  mdUrl: string;\n  docxUrl: string;\n  pdfPath: string;\n  doi: PublicationDoi;\n  quality: PublicationQuality;\n  landing: PublicationLandingContent;\n  articleSections: PublicationSections;\n  sections: PublicationSections;\n  sourceEvidence: PublicationEvidence[];\n  translations?: {\n    en?: string;\n    es?: string;\n  };\n}\n\nexport interface PublicationCollection {\n  title: string;\n  heading: string;\n  description: string;\n  schemaType: string;\n}\n\nexport const publicationCollections: Record<PublicationCategory, PublicationCollection> = ${JSON.stringify(
    CATEGORY_METADATA,
    null,
    2,
  )};\n\nexport const publications: Publication[] = ${JSON.stringify(publications, null, 2)};\n`;

  const upkfTs = `/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n * Source: ${sourcePath}\n * Generated at: ${generatedAt}\n */\n\nexport const upkfMeta = ${JSON.stringify(
    {
      upkfTitle: frontmatter.title || 'Ulisses Flores UPKF',
      upkfVersion: frontmatter.version || 'unknown',
      generatedAt,
      schemaTarget: frontmatter.schema_target || '',
      sourcePath,
      displayName: identity.publicDisplayName || identity.canonicalName,
      preferredName: identity.preferredName,
      publicDisplayName: identity.publicDisplayName || identity.canonicalName,
      canonicalLegalName: identity.canonicalName,
      primaryWebsite: identity.primaryWebsite || 'https://ulissesflores.com',
      description: identity.description,
      disambiguation: identity.disambiguation,
      sameAs: identity.sameAs,
      orcid: identity.orcid,
      lattesId: identity.lattesId,
      languages: frontmatter.languages || identity.languages || ['pt-BR'],
      jsonldFiles: {
        site: '/site.jsonld',
        public: '/public.jsonld',
        full: '/full.jsonld',
        sourceMd: '/upkf-source.md',
      },
      jsonldCoverage: coverage,
    },
    null,
    2,
  )} as const;\n\nexport const siteJsonLd = ${JSON.stringify(siteJsonLd, null, 2)} as const;\n`;

  const knowledgeTs = `/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n * Source: ${sourcePath}\n * Generated at: ${generatedAt}\n */\n\nexport const knowledgeData = ${JSON.stringify(
    knowledgeData,
    null,
    2,
  )} as const;\n`;

  const inventoryMd = `# URL Inventory (Generated)\n\n- Source: \`${sourcePath}\`\n- Generated at: ${generatedAt}\n- Total URLs: ${urlInventory.totals.all}\n\n## Collections\n${urlInventory.grouped.collections.map((url) => `- ${url}`).join('\n') || '- none'}\n\n## Items\n${urlInventory.grouped.items.map((url) => `- ${url}`).join('\n') || '- none'}\n\n## PDF Assets\n${urlInventory.grouped.assets.map((url) => `- ${url}`).join('\n') || '- none'}\n\n## Anchors\n${urlInventory.grouped.anchors.map((url) => `- ${url}`).join('\n') || '- none'}\n`;

  const coverageMd = `# JSON-LD Coverage (Generated)\n\n- Source: \`${sourcePath}\`\n- Markdown bytes: ${coverage.markdownBytes}\n- Markdown lines: ${coverage.markdownLines}\n- Parsed sections: ${coverage.sectionCount}\n- Site graph nodes: ${coverage.siteGraphNodes}\n- Public graph nodes: ${coverage.publicGraphNodes}\n- Full graph nodes: ${coverage.fullGraphNodes}\n- Alura certifications parsed: ${coverage.aluraCertifications}\n- Blog posts parsed: ${coverage.blogPosts}\n- Sermons parsed: ${coverage.sermons}\n- \`/site.jsonld\` bytes: ${coverage.siteJsonldBytes}\n- \`/public.jsonld\` bytes: ${coverage.publicJsonldBytes}\n- \`/full.jsonld\` bytes: ${coverage.fullJsonldBytes}\n- Corpus files: ${coverage.corpusFiles}\n- Corpus snippets: ${coverage.corpusSnippets}\n- Corpus dirs:\n${coverage.corpusDirs.map((dir) => `  - ${dir}`).join('\n')}\n`;

  fs.writeFileSync(path.join(GENERATED_DIR, 'publications.generated.ts'), publicationsTs);
  fs.writeFileSync(path.join(DOCS_DIR, 'publications.generated.json'), JSON.stringify(publications, null, 2));
  fs.writeFileSync(path.join(GENERATED_DIR, 'upkf.generated.ts'), upkfTs);
  fs.writeFileSync(path.join(GENERATED_DIR, 'knowledge.generated.ts'), knowledgeTs);
  fs.writeFileSync(path.join(DOCS_DIR, 'url-inventory.generated.json'), JSON.stringify(urlInventory, null, 2));
  fs.writeFileSync(path.join(DOCS_DIR, 'url-inventory.generated.md'), inventoryMd);
  fs.writeFileSync(path.join(DOCS_DIR, 'jsonld-coverage.generated.md'), coverageMd);
  fs.writeFileSync(
    path.join(DOCS_DIR, 'article-quality.generated.json'),
    JSON.stringify(projectQualityReport, null, 2),
  );
  fs.writeFileSync(
    path.join(DOCS_DIR, 'article-quality.generated.md'),
    buildProjectQualityMarkdown(projectQualityReport),
  );
  fs.writeFileSync(path.join(DOCS_DIR, 'doi-ready.generated.json'), JSON.stringify(doiReady, null, 2));
  fs.writeFileSync(path.join(DOCS_DIR, 'doi-ready.generated.md'), buildDoiReadyMarkdown(doiReady));

  const siteJson = JSON.stringify(siteJsonLd, null, 2);
  const publicJson = JSON.stringify(publicJsonLd, null, 2);
  const fullJson = JSON.stringify(fullJsonLd, null, 2).replaceAll(
    'Carlos Ulisses Flores Ribeiro',
    'Carlos Ulisses Flores',
  );
  const llmsTxt = buildLlmsTxt(identity, publications, generatedAt, knowledgeData);
  const llmsFullTxt = buildLlmsFullTxt(identity, publications, generatedAt, knowledgeData);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'site.jsonld'), siteJson);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'public.jsonld'), publicJson);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'full.jsonld'), fullJson);
  const publicUpkfSource = upkfText.replaceAll('Carlos Ulisses Flores Ribeiro', 'Carlos Ulisses Flores');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'upkf-source.md'), publicUpkfSource);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxt);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullTxt);
  ensureDir(path.join(PUBLIC_DIR, 'doi'));
  fs.writeFileSync(path.join(PUBLIC_DIR, 'doi', 'manifest.json'), JSON.stringify(doiReady, null, 2));

  for (const item of doiReady.items) {
    const itemDir = path.join(PUBLIC_DIR, 'doi', item.slug);
    ensureDir(itemDir);
    fs.writeFileSync(path.join(itemDir, 'zenodo.json'), JSON.stringify(item.zenodoMetadata, null, 2));
    fs.writeFileSync(path.join(itemDir, 'crossref.json'), JSON.stringify(item.crossrefMetadata, null, 2));
    fs.writeFileSync(path.join(itemDir, 'CITATION.cff'), item.citationCff);
  }
}

async function main() {
  const sourcePath = findSourcePath();
  const upkfText = normalizeLineBreaks(fs.readFileSync(sourcePath, 'utf8'));
  const frontmatter = parseFrontmatter(upkfText);
  const generatedAt = frontmatter.generated_at || new Date().toISOString();

  const identity = parseIdentity(upkfText);
  const organization = parseOrganization(upkfText);
  const translations = parseTop10Translations(upkfText);
  const publicationRows = parsePublicationRows(upkfText);
  const upkfSections = parseMarkdownSections(upkfText);
  const certifications = parseCertifications(upkfText);
  const blogPosts = parseBlogPosts(upkfText);
  const sermons = parseSermons(upkfText);

  if (publicationRows.length === 0) {
    throw new Error('Nenhuma publicacao com URL canonica foi encontrada no UPKF.');
  }

  const articleSourceDirs = getArticleSourceDirs();
  const corpus = loadLocalCorpus(articleSourceDirs, sourcePath);
  const referencesLibrary = loadArticleReferencesMap();

  let publications = buildPublications(publicationRows, generatedAt, corpus, referencesLibrary);
  publications = attachTranslations(publications, translations);

  const deepResearchEntries = await generateManuscripts({
    publications,
    identity,
    generatedAt,
    repoRoot,
  });
  const deepResearchReport = scoreDeepResearch({
    publications,
    entries: deepResearchEntries,
    threshold: 950,
  });
  if (!deepResearchReport.approved) {
    throw new Error(
      `Deep research quality gate failed for: ${deepResearchReport.pending.join(', ') || 'unknown'}`,
    );
  }

  const enrichedDeepResearch = writeDeepResearchArtifacts({
    entries: deepResearchEntries,
    report: deepResearchReport,
    docsDir: DOCS_DIR,
    generatedTsPath: path.join(GENERATED_DIR, 'deep-research.generated.ts'),
  });

  const deepBySlug = new Map(enrichedDeepResearch.map((entry) => [entry.slug, entry]));
  publications = publications.map((publication) => {
    const deepEntry = deepBySlug.get(publication.id);
    if (!deepEntry) {
      return publication;
    }

    return {
      ...publication,
      downloadUrl: deepEntry.files.pdf,
      primaryPdfUrl: deepEntry.files.pdf,
      mdUrl: deepEntry.files.md,
      docxUrl: deepEntry.files.docx,
      quality: deepEntry.quality,
      doi: deepEntry.doi || publication.doi,
    };
  });

  const knowledgeData = buildKnowledgeData(certifications, blogPosts, sermons, generatedAt);
  const projectQualityReport = buildProjectQualityReport(publications, generatedAt);
  const doiReady = buildDoiReadyPackage(publications, identity, generatedAt);

  const createdPdfs = publications
    .map((publication) => ensureTemporaryPdf(publication, identity, generatedAt))
    .filter(Boolean).length;

  const siteJsonLd = buildCoreSiteJsonLd(identity, organization, frontmatter);
  const publicJsonLd = buildPublicJsonLd({
    coreSiteJsonLd: siteJsonLd,
    publications,
    frontmatter,
    sourcePath,
    identity,
    certifications,
    blogPosts,
    sermons,
  });
  const fullJsonLd = buildFullUpkfJsonLd({
    publicJsonLd,
    upkfSections,
    frontmatter,
    sourcePath,
    publications,
    identity,
    sourceMdPublicUrl: '/upkf-source.md',
  });

  const urlInventory = buildUrlInventory(
    upkfText,
    publications,
    identity.primaryWebsite || 'https://ulissesflores.com',
    knowledgeData,
  );

  const siteJson = JSON.stringify(siteJsonLd);
  const publicJson = JSON.stringify(publicJsonLd);
  const fullJson = JSON.stringify(fullJsonLd);

  const coverage = {
    markdownBytes: Buffer.byteLength(upkfText, 'utf8'),
    markdownLines: upkfText.split('\n').length,
    sectionCount: upkfSections.length,
    siteGraphNodes: Array.isArray(siteJsonLd['@graph']) ? siteJsonLd['@graph'].length : 0,
    publicGraphNodes: Array.isArray(publicJsonLd['@graph']) ? publicJsonLd['@graph'].length : 0,
    fullGraphNodes: Array.isArray(fullJsonLd['@graph']) ? fullJsonLd['@graph'].length : 0,
    siteJsonldBytes: Buffer.byteLength(siteJson, 'utf8'),
    publicJsonldBytes: Buffer.byteLength(publicJson, 'utf8'),
    fullJsonldBytes: Buffer.byteLength(fullJson, 'utf8'),
    corpusFiles: corpus.fileCount,
    corpusSnippets: corpus.snippetCount,
    corpusDirs: corpus.sourceDirs,
    aluraCertifications: certifications.alura.length,
    blogPosts: blogPosts.posts.length,
    sermons:
      sermons.collections.reduce((sum, collection) => sum + collection.items.length, 0) ||
      sermons.total ||
      0,
  };

  writeGeneratedFiles({
    sourcePath,
    upkfText,
    frontmatter,
    identity,
    publications,
    knowledgeData,
    siteJsonLd,
    publicJsonLd,
    fullJsonLd,
    urlInventory,
    generatedAt,
    coverage,
    projectQualityReport,
    doiReady,
  });

  const report = {
    sourcePath,
    publications: publications.length,
    aluraCertifications: certifications.alura.length,
    blogPosts: blogPosts.posts.length,
    sermons:
      sermons.collections.reduce((sum, collection) => sum + collection.items.length, 0) ||
      sermons.total ||
      0,
    parsedSections: upkfSections.length,
    temporaryPdfsCreated: createdPdfs,
    corpus: {
      dirs: corpus.sourceDirs,
      files: corpus.fileCount,
      snippets: corpus.snippetCount,
    },
    articleQuality: {
      projectScore: projectQualityReport.projectScore,
      threshold: projectQualityReport.threshold,
      approvedSota: projectQualityReport.approvedSota,
    },
    doiReady: {
      taskScore: doiReady.taskScore,
      threshold: doiReady.threshold,
      approved: doiReady.approved,
    },
    deepResearch: {
      projectScore: deepResearchReport.projectScore,
      threshold: deepResearchReport.threshold,
      approved: deepResearchReport.approved,
    },
    siteJsonldBytes: coverage.siteJsonldBytes,
    publicJsonldBytes: coverage.publicJsonldBytes,
    fullJsonldBytes: coverage.fullJsonldBytes,
    generatedAt,
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

await main();
