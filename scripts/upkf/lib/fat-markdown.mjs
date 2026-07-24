import fs from 'node:fs';
import path from 'node:path';
import { ARTICLE_LONGFORM_DIR, CATEGORY_METADATA, CERTIFICATIONS_SOTA_PATH, GENERATED_DIR, IA_2027_SOURCE_PATH, PUBLIC_DIR, REQUIRED_GEO_MARKDOWN_PATHS } from './constants.mjs';
import { ensureDir, markdownPageHeader, normalizeLineBreaks, toCanonicalUrl, toDateOnly } from './text.mjs';
import { normalizeSermonSlug } from './knowledge.mjs';

function stripDuplicatedCollectionPrefix(pathname) {
  const candidates = [
    'research',
    'whitepapers',
    'essays',
    'acervo-teologico',
    'mundo-politico',
    'certifications',
    'simulacoes',
    'pesquisa',
    'ensaios',
    'certificacoes',
  ];
  let normalized = String(pathname || '');
  candidates.forEach((prefix) => {
    const duplicated = `/${prefix}/${prefix}/`;
    while (normalized.includes(duplicated)) {
      normalized = normalized.replace(duplicated, `/${prefix}/`);
    }
    if (normalized === `/${prefix}/${prefix}`) {
      normalized = `/${prefix}`;
    }
  });
  return normalized;
}

function extractJsonLiteralAfterMarker(sourceCode, marker, filePath) {
  const markerIndex = sourceCode.indexOf(marker);
  if (markerIndex < 0) {
    throw new Error(`Nao foi possivel localizar marcador "${marker}" em ${filePath}`);
  }

  let start = markerIndex + marker.length;
  while (start < sourceCode.length && /\s/.test(sourceCode[start])) {
    start += 1;
  }

  const firstChar = sourceCode[start];
  if (firstChar !== '{' && firstChar !== '[') {
    throw new Error(`Literal JSON invalido em ${filePath} apos marcador "${marker}"`);
  }

  const stack = [firstChar];
  let inString = false;
  let escaping = false;

  for (let index = start + 1; index < sourceCode.length; index += 1) {
    const char = sourceCode[index];

    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }
      if (char === '\\') {
        escaping = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{' || char === '[') {
      stack.push(char);
      continue;
    }

    if (char === '}' || char === ']') {
      const opener = stack[stack.length - 1];
      const expected = opener === '{' ? '}' : ']';
      if (char !== expected) {
        throw new Error(`Balanceamento invalido de JSON em ${filePath}`);
      }
      stack.pop();
      if (stack.length === 0) {
        return sourceCode.slice(start, index + 1);
      }
    }
  }

  throw new Error(`Nao foi possivel extrair literal JSON completo de ${filePath}`);
}

function parseGeneratedConst(filePath, marker) {
  const sourceCode = fs.readFileSync(filePath, 'utf8');
  const literal = extractJsonLiteralAfterMarker(sourceCode, marker, filePath);
  return JSON.parse(literal);
}

function loadGeneratedSsotData() {
  const upkfMetaPath = path.join(GENERATED_DIR, 'upkf.generated.ts');
  const knowledgePath = path.join(GENERATED_DIR, 'knowledge.generated.ts');
  const publicationsPath = path.join(GENERATED_DIR, 'publications.generated.ts');

  return {
    upkfMeta: parseGeneratedConst(upkfMetaPath, 'export const upkfMeta ='),
    knowledgeData: parseGeneratedConst(knowledgePath, 'export const knowledgeData ='),
    publicationCollections: parseGeneratedConst(
      publicationsPath,
      'export const publicationCollections: Record<PublicationCategory, PublicationCollection> =',
    ),
    publications: parseGeneratedConst(publicationsPath, 'export const publications: Publication[] ='),
  };
}

function toMarkdownPathFromCanonical(canonicalUrl, siteUrl) {
  const parsed = new URL(canonicalUrl, siteUrl);
  const pathname = stripDuplicatedCollectionPrefix(parsed.pathname.replace(/\/$/, ''));
  if (!pathname || pathname === '/') {
    return 'index.md';
  }
  return `${pathname.replace(/^\//, '')}.md`;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function toText(value) {
  return String(value || '').trim();
}

function loadJsonArray(filePath, label) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    process.stderr.write(`Aviso: falha ao carregar ${label} (${error.message}).\n`);
    return [];
  }
}

function loadCertificationNarrativesMap() {
  const rows = loadJsonArray(CERTIFICATIONS_SOTA_PATH, 'certifications.sota.json');
  return new Map(
    rows
      .map((row) => ({
        id: toText(row.id),
        title: toText(row.title),
        about: toText(row.about),
        skills: asArray(row.skills).map((skill) => toText(skill)).filter(Boolean),
        problemsSolved: toText(row.problems_solved),
      }))
      .filter((row) => row.id)
      .map((row) => [row.id, row]),
  );
}

function loadIa2027Stats() {
  if (!fs.existsSync(IA_2027_SOURCE_PATH)) {
    return {
      mainSections: 0,
      raceSections: 0,
      slowdownSections: 0,
      footnotes: 0,
      highlightedTitles: [],
    };
  }

  const source = fs.readFileSync(IA_2027_SOURCE_PATH, 'utf8');
  const mainSections = (source.match(/id:\s*"main-/g) || []).length;
  const raceSections = (source.match(/id:\s*"race-/g) || []).length;
  const slowdownSections = (source.match(/id:\s*"slowdown-/g) || []).length;
  const footnotes = (source.match(/context:\s*"main"|context:\s*"race"|context:\s*"slowdown"/g) || []).length;
  const highlightedTitles = Array.from(
    new Set(
      Array.from(source.matchAll(/title:\s*"([^"]+)"/g))
        .map((match) => toText(match[1]))
        .filter(Boolean),
    ),
  ).slice(0, 8);

  return {
    mainSections,
    raceSections,
    slowdownSections,
    footnotes,
    highlightedTitles,
  };
}

function buildIdentityFatMarkdown({ upkfMeta, siteUrl, generatedAt, publications }) {
  const canonicalUrl = toCanonicalUrl(siteUrl, '/identidade');
  const displayName = toText(
    upkfMeta.publicDisplayName || upkfMeta.displayName || upkfMeta.canonicalLegalName || 'Ulisses Flores',
  );
  const description = toText(upkfMeta?.description?.['pt-BR'] || upkfMeta?.description?.en || '');
  const firewall = toText(upkfMeta?.disambiguation?.['pt-BR'] || upkfMeta?.disambiguation?.en || '');
  const knowsAbout = asArray(upkfMeta.knowsAbout)
    .map((item) => toText(item))
    .filter(Boolean);

  const identifiers = asArray(upkfMeta.identifier).length > 0 ? asArray(upkfMeta.identifier) : asArray(upkfMeta.publicIdentifiers);
  const identifierSection =
    identifiers.length > 0
      ? identifiers
          .map((identifier) => {
            const label = toText(identifier.label || identifier.propertyID || 'identifier');
            const value = toText(identifier.value || identifier.identifier || '');
            const url = toText(identifier.url || '');
            const notes = toText(identifier.notes || identifier.description || '');
            const suffix = [url ? `URL: ${url}` : '', notes ? `Notas: ${notes}` : '']
              .filter(Boolean)
              .join(' | ');
            return `- ${label}: ${value}${suffix ? ` (${suffix})` : ''}`;
          })
          .join('\n')
      : '- none';

  const webCredentials = asArray(upkfMeta.hasCredential);
  const academicCredentials = asArray(upkfMeta.academicCredentials);
  const credentialSection =
    webCredentials.length + academicCredentials.length > 0
      ? [
          ...webCredentials.map((credential) => {
            const name = toText(credential.name || credential['@id'] || 'Credential');
            const identifier = toText(credential.identifier || '');
            const category = toText(credential.credentialCategory || credential['@type'] || '');
            const url = toText(credential.url || '');
            const details = [identifier ? `ID: ${identifier}` : '', category ? `Categoria: ${category}` : '', url ? `URL: ${url}` : '']
              .filter(Boolean)
              .join(' | ');
            return `- ${name}${details ? ` (${details})` : ''}`;
          }),
          ...academicCredentials.map((credential) => {
            const title = toText(credential.title || credential.name || credential.schemaId || 'Academic Credential');
            const institution = toText(credential.institution || '');
            const period = toText(credential.period || '');
            const category = toText(credential.credentialCategory || '');
            const status = toText(credential.credentialStatus || '');
            const thesis = toText(
              credential?.thesisTitle?.['pt-BR'] ||
                credential?.thesisTitle?.en ||
                credential?.thesisTitle?.es ||
                '',
            );
            const details = [
              institution ? `Instituição: ${institution}` : '',
              period ? `Período: ${period}` : '',
              category ? `Categoria: ${category}` : '',
              status ? `Status: ${status}` : '',
              thesis ? `Tese: ${thesis}` : '',
            ]
              .filter(Boolean)
              .join(' | ');
            return `- ${title}${details ? ` (${details})` : ''}`;
          }),
        ].join('\n')
      : '- none';

  const occupations = asArray(upkfMeta.hasOccupation).length > 0 ? asArray(upkfMeta.hasOccupation) : asArray(upkfMeta.occupations);
  const occupationSection =
    occupations.length > 0
      ? occupations
          .map((occupation) => {
            const title = toText(occupation.title || occupation.name || occupation.schemaId || 'Occupation');
            const organizationRef = toText(occupation.organizationRef || '');
            const location = toText(occupation.location || '');
            const skills = asArray(occupation.appliedSkills)
              .map((skill) => toText(skill))
              .filter(Boolean)
              .join(', ');
            const details = [organizationRef ? `OrgRef: ${organizationRef}` : '', location ? `Local: ${location}` : '', skills ? `Skills: ${skills}` : '']
              .filter(Boolean)
              .join(' | ');
            return `- ${title}${details ? ` (${details})` : ''}`;
          })
          .join('\n')
      : '- none';

  const heritage = upkfMeta.heritage || {};
  const heritageClusters = asArray(heritage.clusters);
  const heritageClusterSection =
    heritageClusters.length > 0
      ? heritageClusters
          .map((cluster) => {
            const clusterTitle = toText(cluster.title || cluster.cluster || 'Cluster');
            const clusterLabel = toText(cluster.cluster || '');
            const region = toText(cluster.region || '');
            const probability = toText(cluster.probabilityScore || '');
            const surnames = asArray(cluster.keySurnames)
              .map((surname) => toText(surname))
              .filter(Boolean)
              .join(', ');
            const thesis = toText(cluster.thesis || '');
            const nextStep = toText(cluster.nextStep || '');
            const details = [
              clusterLabel ? `Linha: ${clusterLabel}` : '',
              region ? `Região: ${region}` : '',
              probability ? `Probabilidade: ${probability}` : '',
              surnames ? `Sobrenomes: ${surnames}` : '',
              thesis ? `Síntese: ${thesis}` : '',
              nextStep ? `Próximo passo: ${nextStep}` : '',
            ]
              .filter(Boolean)
              .join(' | ');
            return `- ${clusterTitle}${details ? ` (${details})` : ''}`;
          })
          .join('\n')
      : '- none';

  const heritageSynthesis = heritage?.synthesis || {};
  const heritageSynthesisSection = [
    toText(heritageSynthesis.sephardicIdentity || ''),
    toText(heritageSynthesis.italianIdentity || ''),
  ]
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join('\n');

  const affiliations = asArray(upkfMeta.affiliations);
  const memberOfSection =
    affiliations.length > 0
      ? affiliations
          .map((affiliation) => {
            const name = toText(affiliation.name || affiliation.legalName || affiliation.schemaId || 'Organization');
            const relation = toText(affiliation.relation || '');
            const url = toText(affiliation.url || '');
            const descriptionPt = toText(affiliation?.description?.['pt-BR'] || affiliation?.description?.en || '');
            const details = [relation ? `Relação: ${relation}` : '', url ? `URL: ${url}` : '', descriptionPt ? `Descrição: ${descriptionPt}` : '']
              .filter(Boolean)
              .join(' | ');
            return `- ${name}${details ? ` (${details})` : ''}`;
          })
          .join('\n')
      : '- none';

  const academicInstitutions = Array.from(
    new Set(
      academicCredentials
        .map((credential) => toText(credential.institution))
        .filter(Boolean),
    ),
  );
  const alumniOfSection =
    academicInstitutions.length > 0
      ? academicInstitutions.map((institution) => `- ${institution}`).join('\n')
      : '- none';

  const sameAsSection =
    asArray(upkfMeta.sameAs).length > 0
      ? asArray(upkfMeta.sameAs)
          .map((url) => toText(url))
          .filter(Boolean)
          .map((url) => `- ${url}`)
          .join('\n')
      : '- none';

  const domainInventorySection =
    asArray(upkfMeta.domainInventory).length > 0
      ? asArray(upkfMeta.domainInventory)
          .map((domain) => {
            const host = toText(domain.domain || '');
            const url = toText(domain.url || '');
            const category = toText(domain.category || '');
            const purpose = toText(domain.purpose || '');
            const details = [category ? `Categoria: ${category}` : '', purpose ? `Função: ${purpose}` : '']
              .filter(Boolean)
              .join(' | ');
            return `- ${host}${url ? ` (${url})` : ''}${details ? ` — ${details}` : ''}`;
          })
          .join('\n')
      : '- none';

  const notSameAsSection =
    asArray(upkfMeta.notSameAs).length > 0
      ? asArray(upkfMeta.notSameAs)
          .map((entry) => toText(entry))
          .filter(Boolean)
          .map((entry) => `- ${entry}`)
          .join('\n')
      : '- none';

  const lines = [
    markdownPageHeader({
      title: `${displayName} · Identidade Soberana`,
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Bio Semântica',
    description || 'Perfil semântico canônico indisponível no momento.',
    '',
    '## Pilares de Expertise',
    ...(knowsAbout.length > 0 ? knowsAbout.map((topic) => `- ${topic}`) : ['- none']),
    '',
    '## Identificadores e Verificações',
    identifierSection,
    '',
    '## Formação e Ocupações',
    credentialSection,
    '',
    occupationSection,
    '',
    '## Herança e Linhagem',
    heritageClusterSection,
    '',
    heritageSynthesisSection || '- none',
    '',
    '## Organizações e Afiliações',
    '### memberOf',
    memberOfSection,
    '',
    '### alumniOf',
    alumniOfSection,
    '',
    '## Presença Pública (sameAs)',
    sameAsSection,
    '',
    '## Domínios',
    domainInventorySection,
    '',
    '## Publicações Científicas e Ensaios',
    '',
    ...(Array.isArray(publications) && publications.length > 0
      ? publications
          .slice()
          .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
          .map((pub) => {
            const cat = pub.category || 'essays';
            const url = `${siteUrl}/${cat}/${pub.id}`;
            const date = pub.publishedAt ? ` (${pub.publishedAt})` : '';
            const tags = Array.isArray(pub.tags) && pub.tags.length > 0 ? ` — ${pub.tags.join(', ')}` : '';
            return `- [${pub.title}](${url})${date}${tags}`;
          })
      : ['- Nenhuma publicação indexada.']),
    '',
    '## Firewall Semântico',
    firewall ? `> ${firewall}` : '> Firewall semântico indisponível.',
    '',
    notSameAsSection,
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function getAcervoClusters(knowledgeData) {
  if (knowledgeData?.acervo?.clusters && Array.isArray(knowledgeData.acervo.clusters)) {
    return knowledgeData.acervo.clusters;
  }

  const fallbackCollections = asArray(knowledgeData?.sermons?.collections);
  return fallbackCollections.map((collection, index) => {
    const clusterId = normalizeSermonSlug(collection.slug || collection.name || `cluster-${index + 1}`);
    const canonicalPath = `/acervo-teologico/${clusterId}`;
    const sermons = asArray(collection.items).map((item) => {
      const sermonSlug = normalizeSermonSlug(item.slug || item.name || `sermao-${item.position}`);
      const llmContext = item.summary || '';
      return {
        clusterId,
        clusterCanonicalPath: canonicalPath,
        clusterSeoTitle: collection.name,
        clusterMetaDescription: `Sermões e estudos da coleção ${collection.name}.`,
        position: item.position,
        slug: sermonSlug,
        title: item.name,
        canonicalPath: `${canonicalPath}/${sermonSlug}`,
        seoTitle: item.name,
        metaDescription: llmContext || `Sermões e estudos da coleção ${collection.name}.`,
        llmContext,
        originalPath: item.canonicalPath || '',
        originalUrl: '',
        publishedAt: item.publishedAt || '',
        youtubeUrl: item.youtubeUrl || '',
        legacyName: item.name,
        legacySummary: llmContext,
        legacyCollectionName: collection.name,
        legacyCollectionSlug: collection.slug || clusterId,
        summary: llmContext,
      };
    });

    return {
      id: clusterId,
      canonicalPath,
      seoTitle: collection.name,
      metaDescription: `Sermões e estudos da coleção ${collection.name}.`,
      prose: sermons
        .map((item) => toText(item.summary))
        .filter(Boolean)
        .slice(0, 3)
        .join('\n\n'),
      sermons,
    };
  });
}

function buildAcervoFatMarkdown({ knowledgeData, siteUrl, generatedAt }) {
  const acervo = knowledgeData.acervo || {};
  const canonicalPath = toText(acervo.canonicalPath || '/acervo-teologico');
  const canonicalUrl = toCanonicalUrl(siteUrl, canonicalPath);
  const pageTitle = toText(acervo.pageTitle || 'Acervo Teológico');
  const pageDescription = toText(acervo.pageDescription || 'Coleção canônica de sermões e estudos teológicos.');
  const clusters = getAcervoClusters(knowledgeData);

  const lines = [
    markdownPageHeader({
      title: pageTitle,
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Descrição Canônica',
    pageDescription,
    '',
    '## Clusters',
  ];

  if (clusters.length === 0) {
    lines.push('- Nenhum cluster disponível no momento.');
    lines.push('');
    return `${lines.join('\n')}\n`;
  }

  clusters.forEach((cluster, index) => {
    const clusterTitle = toText(cluster.seoTitle || cluster.id || `Cluster ${index + 1}`);
    const clusterPath = toText(cluster.canonicalPath || `/acervo-teologico/${cluster.id || index + 1}`);
    const clusterUrl = toCanonicalUrl(siteUrl, clusterPath);
    const metaDescription = toText(cluster.metaDescription || '');
    const prose = toText(cluster.prose || '');
    const sermons = asArray(cluster.sermons);

    lines.push(`### ${index + 1}. ${clusterTitle}`);
    lines.push(`Canonical-URL: ${clusterUrl}`);
    if (metaDescription) {
      lines.push('');
      lines.push(metaDescription);
    }
    if (prose) {
      lines.push('');
      lines.push(prose);
    }
    lines.push('');
    lines.push('#### Sermões');
    if (sermons.length === 0) {
      lines.push('- Nenhum sermão mapeado.');
    } else {
      sermons.forEach((sermon) => {
        const sermonTitle = toText(sermon.seoTitle || sermon.title || sermon.name || sermon.slug || 'Sermão');
        const sermonPath = toText(sermon.canonicalPath || `${clusterPath}/${sermon.slug || ''}`);
        const sermonUrl = toCanonicalUrl(siteUrl, sermonPath);
        const summary = toText(sermon.llmContext || sermon.summary || sermon.metaDescription || '');
        const publishedAt = toText(sermon.publishedAt || '');
        const youtubeUrl = toText(sermon.youtubeUrl || '');
        const detail = [publishedAt ? `Publicado: ${toDateOnly(publishedAt)}` : '', youtubeUrl ? `YouTube: ${youtubeUrl}` : '', summary]
          .filter(Boolean)
          .join(' | ');
        lines.push(`- [${sermonTitle}](${sermonUrl})${detail ? ` — ${detail}` : ''}`);
      });
    }
    lines.push('');
  });

  return `${lines.join('\n')}\n`;
}

function buildPublicationCollectionMarkdown({
  category,
  publications,
  publicationCollections,
  siteUrl,
  generatedAt,
}) {
  const meta = publicationCollections?.[category] || CATEGORY_METADATA[category] || {
    title: category,
    heading: category,
    description: '',
  };
  const canonicalPath = `/${category}`;
  const canonicalUrl = toCanonicalUrl(siteUrl, canonicalPath);
  const byCategory = asArray(publications).filter((item) => item.category === category);

  const lines = [
    markdownPageHeader({
      title: meta.heading || meta.title || category,
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Descrição',
    toText(meta.description || ''),
    '',
    '## Publicações',
  ];

  if (byCategory.length === 0) {
    lines.push('- Nenhuma publicação indexada.');
    lines.push('');
    return `${lines.join('\n')}\n`;
  }

  byCategory
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
    .forEach((publication, index) => {
      lines.push(`### ${index + 1}. ${publication.title}`);
      lines.push(`- URL: ${publication.canonicalUrl}`);
      lines.push(`- Data: ${toDateOnly(publication.publishedAt || publication.updatedAt || generatedAt)}`);
      lines.push(`- Tipo: ${publication.kind === 'R' ? 'Report' : 'ScholarlyArticle'}`);
      lines.push(`- Resumo: ${toText(publication.summary)}`);
      lines.push('');
    });

  return `${lines.join('\n')}\n`;
}

function buildPublicationCollectionAliasMarkdown({
  aliasTitle,
  aliasPath,
  targetPath,
  category,
  publications,
  siteUrl,
  generatedAt,
}) {
  const canonicalUrl = toCanonicalUrl(siteUrl, aliasPath);
  const targetUrl = toCanonicalUrl(siteUrl, targetPath);
  const byCategory = asArray(publications)
    .filter((item) => item.category === category)
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')));

  const lines = [
    markdownPageHeader({
      title: aliasTitle,
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Contexto',
    `Rota em português para indexação GEO/LLM, apontando para a coleção canônica ${targetUrl}.`,
    '',
    '## Conteúdo',
    `- Coleção canônica: ${targetUrl}`,
    `- Total de itens indexados: ${byCategory.length}`,
    '',
    '## Itens',
  ];

  if (byCategory.length === 0) {
    lines.push('- Nenhum item disponível.');
    lines.push('');
    return `${lines.join('\n')}\n`;
  }

  byCategory.forEach((publication, index) => {
    lines.push(`### ${index + 1}. ${publication.title}`);
    lines.push(`- URL canônica: ${publication.canonicalUrl}`);
    lines.push(`- Data: ${toDateOnly(publication.publishedAt || generatedAt)}`);
    lines.push(`- Resumo: ${toText(publication.summary)}`);
    lines.push('');
  });

  return `${lines.join('\n')}\n`;
}

function readLongformArticleMarkdown(publicationId) {
  const articlePath = path.join(ARTICLE_LONGFORM_DIR, publicationId, 'article.md');
  if (!fs.existsSync(articlePath)) {
    throw new Error(
      `Arquivo obrigatório ausente para GEO markdown: ${articlePath} (publication: ${publicationId})`,
    );
  }
  const content = normalizeLineBreaks(fs.readFileSync(articlePath, 'utf8')).trim();
  if (!content) {
    throw new Error(`Arquivo obrigatório vazio para GEO markdown: ${articlePath} (publication: ${publicationId})`);
  }
  return content;
}

function buildPublicationDetailMarkdown({ publication, articleBody, generatedAt }) {
  const lines = [
    markdownPageHeader({
      title: publication.title,
      canonicalUrl: publication.canonicalUrl,
      updatedAt: publication.updatedAt || publication.publishedAt || generatedAt,
    }),
    '## Metadados',
    `- Categoria: ${publication.category}`,
    `- Tipo: ${publication.kind === 'R' ? 'Report' : 'ScholarlyArticle'}`,
    `- Publicado em: ${toDateOnly(publication.publishedAt || generatedAt)}`,
    `- Idioma: ${publication.inLanguage || 'pt-BR'}`,
    `- DOI Target: ${publication.doi?.target || 'n/a'}`,
    '',
    '## Resumo',
    toText(publication.summary),
    '',
    '## Conteúdo Integral',
    articleBody,
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function buildMundoPoliticoMarkdown({ knowledgeData, siteUrl, generatedAt }) {
  const canonicalUrl = toCanonicalUrl(siteUrl, '/mundo-politico');
  const posts = asArray(knowledgeData?.blog?.posts);

  const lines = [
    markdownPageHeader({
      title: 'Mundo Político',
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Descrição',
    'Coleção canônica de análises políticas publicada no hub de conhecimento.',
    '',
    '## Artigos',
  ];

  if (posts.length === 0) {
    lines.push('- Nenhum artigo indexado.');
    lines.push('');
    return `${lines.join('\n')}\n`;
  }

  posts
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
    .forEach((post, index) => {
      const canonicalPath = toText(post.canonicalPath || `/mundo-politico/${post.slug || index + 1}`);
      const canonicalPostUrl = toCanonicalUrl(siteUrl, canonicalPath);
      lines.push(`### ${index + 1}. ${toText(post.headline || post.slug || 'Post')}`);
      lines.push(`- URL: ${canonicalPostUrl}`);
      lines.push(`- Data: ${toDateOnly(post.publishedAt || generatedAt)}`);
      lines.push(`- Resumo: ${toText(post.summary)}`);
      lines.push('');
    });

  return `${lines.join('\n')}\n`;
}

function buildMundoPoliticoDetailMarkdown({ post, siteUrl, generatedAt }) {
  const canonicalPath = toText(post.canonicalPath || `/mundo-politico/${post.slug}`);
  const canonicalUrl = toCanonicalUrl(siteUrl, canonicalPath);

  const lines = [
    markdownPageHeader({
      title: toText(post.headline || post.slug || 'Mundo Político'),
      canonicalUrl,
      updatedAt: post.publishedAt || generatedAt,
    }),
    '## Resumo',
    toText(post.summary),
    '',
    '## Fonte',
    toText(post.url || ''),
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function buildAcervoDetailMarkdown({ cluster, sermon, siteUrl, generatedAt }) {
  const canonicalPath = toText(sermon.canonicalPath || `${cluster.canonicalPath}/${sermon.slug}`);
  const canonicalUrl = toCanonicalUrl(siteUrl, canonicalPath);
  const clusterTitle = toText(cluster.seoTitle || cluster.id || 'Cluster');

  const lines = [
    markdownPageHeader({
      title: toText(sermon.seoTitle || sermon.title || sermon.slug || 'Sermão'),
      canonicalUrl,
      updatedAt: sermon.publishedAt || generatedAt,
    }),
    '## Cluster',
    clusterTitle,
    '',
    '## Contexto',
    toText(sermon.llmContext || sermon.summary || sermon.metaDescription || cluster.metaDescription || ''),
    '',
    '## Fonte',
    toText(sermon.youtubeUrl || sermon.originalUrl || sermon.originalPath || ''),
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function buildCertificationsCollectionMarkdown({ knowledgeData, siteUrl, generatedAt, narrativesById }) {
  const canonicalUrl = toCanonicalUrl(siteUrl, '/certifications');
  const certifications = asArray(knowledgeData?.certifications)
    .slice()
    .sort((a, b) => {
      if (toText(a.provider) === toText(b.provider)) {
        return Number(a.position || 9999) - Number(b.position || 9999);
      }
      return toText(a.provider).localeCompare(toText(b.provider));
    });

  const lines = [
    markdownPageHeader({
      title: 'Certifications and Credentials',
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Descrição',
    'Coleção canônica de certificações com contexto semântico, verificação pública e vínculo de autoria com o hub soberano.',
    '',
    '## Credenciais',
  ];

  if (certifications.length === 0) {
    lines.push('- Nenhuma certificação indexada.');
    lines.push('');
    return `${lines.join('\n')}\n`;
  }

  certifications.forEach((certification, index) => {
    const narrative = narrativesById.get(toText(certification.slug));
    const title = toText(narrative?.title || certification.name || certification.slug || 'Credential');
    const canonicalPath = toText(certification.canonicalPath || `/certifications/${certification.slug}`);
    const detailUrl = toCanonicalUrl(siteUrl, canonicalPath);
    const summary = toText(narrative?.about || certification.summary || '');
    const skills = asArray(narrative?.skills).map((skill) => toText(skill)).filter(Boolean);

    lines.push(`### ${index + 1}. ${title}`);
    lines.push(`- URL: ${detailUrl}`);
    lines.push(`- Provider: ${toText(certification.provider || 'n/a')}`);
    lines.push(`- Data: ${toDateOnly(certification.publishedAt || generatedAt)}`);
    if (toText(certification.certId)) {
      lines.push(`- Certificate ID: ${toText(certification.certId)}`);
    }
    if (toText(certification.verifyUrl)) {
      lines.push(`- Verificação: ${toText(certification.verifyUrl)}`);
    }
    if (summary) {
      lines.push(`- Contexto: ${summary}`);
    }
    if (skills.length > 0) {
      lines.push(`- Skills: ${skills.join(', ')}`);
    }
    lines.push('');
  });

  return `${lines.join('\n')}\n`;
}

function buildCertificationDetailMarkdown({ certification, siteUrl, generatedAt, narrative }) {
  const canonicalPath = toText(certification.canonicalPath || `/certifications/${certification.slug}`);
  const canonicalUrl = toCanonicalUrl(siteUrl, canonicalPath);
  const title = toText(narrative?.title || certification.name || certification.slug || 'Credential');
  const summary = toText(narrative?.about || certification.summary || '');
  const skills = asArray(narrative?.skills).map((skill) => toText(skill)).filter(Boolean);
  const problemsSolved = toText(narrative?.problemsSolved || '');

  const lines = [
    markdownPageHeader({
      title,
      canonicalUrl,
      updatedAt: certification.publishedAt || generatedAt,
    }),
    '## Metadados',
    `- Provider: ${toText(certification.provider || 'n/a')}`,
    `- Data: ${toDateOnly(certification.publishedAt || generatedAt)}`,
    `- Coleção: Certifications`,
    `- URL de verificação: ${toText(certification.verifyUrl || 'n/a')}`,
    `- Certificate ID: ${toText(certification.certId || 'n/a')}`,
    '',
    '## Resumo',
    summary || 'Credencial profissional registrada no índice canônico.',
    '',
    '## Habilidades',
    ...(skills.length > 0 ? skills.map((skill) => `- ${skill}`) : ['- Skill map indisponível.']),
    '',
    '## Problemas resolvidos',
    problemsSolved || 'Consolidação prática de competência técnica para execução de projetos com rastreabilidade pública.',
    '',
    '## Sobre o Autor',
    'Carlos Ulisses Flores — Cientista econômico, CTO da Codex Hash Ltda.',
    `ORCID: 0000-0002-6034-7765 | ${toCanonicalUrl(siteUrl, '/identidade')}`,
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function buildCertificationsAliasMarkdown({ knowledgeData, siteUrl, generatedAt }) {
  const canonicalUrl = toCanonicalUrl(siteUrl, '/certificacoes');
  const targetUrl = toCanonicalUrl(siteUrl, '/certifications');
  const certifications = asArray(knowledgeData?.certifications)
    .slice()
    .sort((a, b) => {
      if (toText(a.provider) === toText(b.provider)) {
        return Number(a.position || 9999) - Number(b.position || 9999);
      }
      return toText(a.provider).localeCompare(toText(b.provider));
    });

  const lines = [
    markdownPageHeader({
      title: 'Certificações | Índice Canônico',
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Contexto',
    `Rota em português para indexação GEO/LLM, apontando para a coleção canônica ${targetUrl}.`,
    '',
    '## Estatísticas',
    `- Coleção canônica: ${targetUrl}`,
    `- Total de certificações: ${certifications.length}`,
    '',
    '## Itens',
  ];

  if (certifications.length === 0) {
    lines.push('- Nenhuma certificação indexada.');
    lines.push('');
    return `${lines.join('\n')}\n`;
  }

  certifications.forEach((certification, index) => {
    lines.push(`### ${index + 1}. ${toText(certification.name || certification.slug || 'Certificação')}`);
    lines.push(`- URL canônica: ${toCanonicalUrl(siteUrl, toText(certification.canonicalPath || ''))}`);
    lines.push(`- Provedor: ${toText(certification.provider)}`);
    lines.push(`- Data: ${toDateOnly(certification.publishedAt || generatedAt)}`);
    lines.push('');
  });

  return `${lines.join('\n')}\n`;
}

function buildSimulacoesCollectionMarkdown({ siteUrl, generatedAt, ia2027Stats }) {
  const canonicalUrl = toCanonicalUrl(siteUrl, '/simulacoes');
  const totalNarrativeBlocks = ia2027Stats.mainSections + ia2027Stats.raceSections + ia2027Stats.slowdownSections;
  const highlighted = ia2027Stats.highlightedTitles.slice(0, 4);

  const lines = [
    markdownPageHeader({
      title: 'Simulações | Laboratório de Cenários',
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Descrição',
    'Hub de simulações e soluções experimentais com foco em cenários de IA, economia e sistemas complexos.',
    '',
    '## Projetos',
    `- [IA 2027 em Português](${toCanonicalUrl(siteUrl, '/simulacoes/ia-2027')}) — simulação prospectiva com timeline interativa e finais ramificados.`,
    `  - [Cenário: Desaceleração Coordenada](${toCanonicalUrl(siteUrl, '/simulacoes/ia-2027/desaceleracao-coordenada')}) — pausa global e alinhamento técnico da AGI.`,
    `  - [Cenário: Corrida Estratégica](${toCanonicalUrl(siteUrl, '/simulacoes/ia-2027/corrida-estrategica')}) — disputa geopolítica acelerada por supremacia em IA.`,
    '',
    '## Estatísticas da Simulação IA 2027',
    `- Seções principais: ${ia2027Stats.mainSections}`,
    `- Seções finais (race): ${ia2027Stats.raceSections}`,
    `- Seções finais (slowdown): ${ia2027Stats.slowdownSections}`,
    `- Blocos narrativos totais: ${totalNarrativeBlocks}`,
    `- Notas de rodapé indexadas: ${ia2027Stats.footnotes}`,
    '',
    '## Tópicos em Destaque',
    ...(highlighted.length > 0 ? highlighted.map((topic) => `- ${topic}`) : ['- Timeline e tópicos carregados a partir da base canônica.']),
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function buildIa2027DetailMarkdown({ siteUrl, generatedAt, ia2027Stats }) {
  const canonicalUrl = toCanonicalUrl(siteUrl, '/simulacoes/ia-2027');
  const highlighted = ia2027Stats.highlightedTitles.slice(0, 8);

  const lines = [
    markdownPageHeader({
      title: 'IA 2027 em Português | Simulação Prospectiva',
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Resumo',
    'Simulação prospectiva em português do cenário AI 2027 com linha do tempo interativa, métricas dinâmicas e finais ramificados.',
    '',
    '## Estrutura Narrativa',
    `- Trilha principal: ${ia2027Stats.mainSections} seções`,
    `- Final \"Race\": ${ia2027Stats.raceSections} seções`,
    `- Final \"Slowdown\": ${ia2027Stats.slowdownSections} seções`,
    `- Notas de rodapé estruturadas: ${ia2027Stats.footnotes}`,
    '',
    '## Tópicos-Chave',
    ...(highlighted.length > 0 ? highlighted.map((topic) => `- ${topic}`) : ['- Sem tópicos extras extraídos.']),
    '',
    '## Rotas Relacionadas',
    `- Hub de Simulações: ${toCanonicalUrl(siteUrl, '/simulacoes')}`,
    `- Cenário Desaceleração Coordenada: ${toCanonicalUrl(siteUrl, '/simulacoes/ia-2027/desaceleracao-coordenada')}`,
    `- Cenário Corrida Estratégica: ${toCanonicalUrl(siteUrl, '/simulacoes/ia-2027/corrida-estrategica')}`,
    '',
    '## Sobre o Autor',
    'Carlos Ulisses Flores — Cientista Econômico, Consultor Estratégico de IA, Palestrante e Mestrando em IA pela AGTU.',
    `ORCID: 0000-0002-6034-7765 | ${toCanonicalUrl(siteUrl, '/identidade')}`,
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function buildLegacySimulationAliasMarkdown({ title, canonicalPath, redirectedTo, mode, siteUrl, generatedAt }) {
  const canonicalUrl = toCanonicalUrl(siteUrl, canonicalPath);
  const targetUrl = toCanonicalUrl(siteUrl, redirectedTo);
  const redirectTarget = mode ? `${targetUrl}?path=${mode}` : targetUrl;

  const lines = [
    markdownPageHeader({
      title,
      canonicalUrl,
      updatedAt: generatedAt,
    }),
    '## Contexto',
    'Esta rota é legada e mantida por compatibilidade de links históricos.',
    '',
    '## Canonical Redirect',
    `- Destino canônico: ${targetUrl}`,
    `- Destino efetivo para navegação: ${redirectTarget}`,
    '',
    '## GEO Routing',
    'Para crawlers de IA, este arquivo markdown existe para preservar continuidade semântica e evitar resposta 404 em rotas de legado.',
    '',
    '## Hub de Referência',
    `- Simulações: ${toCanonicalUrl(siteUrl, '/simulacoes')}`,
    `- Identidade canônica: ${toCanonicalUrl(siteUrl, '/identidade')}`,
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function buildMarkdownGenerationReport(generatedFiles) {
  const sorted = generatedFiles
    .slice()
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  const missingMandatory = REQUIRED_GEO_MARKDOWN_PATHS.filter(
    (relativePath) => !sorted.some((file) => file.relativePath === relativePath),
  );

  if (missingMandatory.length > 0) {
    throw new Error(
      `Falha GEO: arquivos markdown obrigatórios ausentes: ${missingMandatory.join(', ')}`,
    );
  }

  const lines = ['[geo-md] Generated markdown files'];
  lines.push(`[geo-md] Total: ${sorted.length}`);

  sorted.forEach((file) => {
    lines.push(`[geo-md] ${file.relativePath} (${file.size} bytes)`);
    if (file.size < 300) {
      lines.push(`[geo-md][WARN] ${file.relativePath} abaixo de 300 bytes`);
    }
  });

  return `${lines.join('\n')}\n`;
}

function buildFatMarkdownPagesFromSsot({ upkfMeta, knowledgeData, publicationCollections, publications }, generatedAt) {
  const siteUrl = toText(upkfMeta.primaryWebsite || 'https://ulissesflores.com').replace(/\/$/, '');
  const certificationNarrativesById = loadCertificationNarrativesMap();
  const ia2027Stats = loadIa2027Stats();
  const pages = [];

  pages.push({
    relativePath: 'identidade.md',
    content: buildIdentityFatMarkdown({ upkfMeta, siteUrl, generatedAt, publications }),
  });

  pages.push({
    relativePath: 'acervo-teologico.md',
    content: buildAcervoFatMarkdown({ knowledgeData, siteUrl, generatedAt }),
  });

  pages.push({
    relativePath: 'certifications.md',
    content: buildCertificationsCollectionMarkdown({
      knowledgeData,
      siteUrl,
      generatedAt,
      narrativesById: certificationNarrativesById,
    }),
  });

  asArray(knowledgeData?.certifications).forEach((certification) => {
    const canonicalPath = toText(certification.canonicalPath || `/certifications/${certification.slug || ''}`);
    const detailPath = toMarkdownPathFromCanonical(canonicalPath, siteUrl);
    pages.push({
      relativePath: detailPath,
      content: buildCertificationDetailMarkdown({
        certification,
        siteUrl,
        generatedAt,
        narrative: certificationNarrativesById.get(toText(certification.slug)),
      }),
    });
  });

  pages.push({
    relativePath: 'simulacoes.md',
    content: buildSimulacoesCollectionMarkdown({
      siteUrl,
      generatedAt,
      ia2027Stats,
    }),
  });

  pages.push({
    relativePath: 'simulacoes/ia-2027.md',
    content: buildIa2027DetailMarkdown({
      siteUrl,
      generatedAt,
      ia2027Stats,
    }),
  });

  pages.push({
    relativePath: 'simulacoes/rapaduria-2027.md',
    content: buildLegacySimulationAliasMarkdown({
      title: 'Rapaduria 2027 (Alias Legado)',
      canonicalPath: '/simulacoes/rapaduria-2027',
      redirectedTo: '/simulacoes/ia-2027',
      siteUrl,
      generatedAt,
    }),
  });

  pages.push({
    relativePath: 'simulacoes/rapaduria-2027/carroca.md',
    content: buildLegacySimulationAliasMarkdown({
      title: 'Rapaduria 2027 / Carroca (Alias Legado)',
      canonicalPath: '/simulacoes/rapaduria-2027/carroca',
      redirectedTo: '/simulacoes/ia-2027',
      mode: 'race',
      siteUrl,
      generatedAt,
    }),
  });

  pages.push({
    relativePath: 'simulacoes/rapaduria-2027/freio.md',
    content: buildLegacySimulationAliasMarkdown({
      title: 'Rapaduria 2027 / Freio (Alias Legado)',
      canonicalPath: '/simulacoes/rapaduria-2027/freio',
      redirectedTo: '/simulacoes/ia-2027',
      mode: 'slowdown',
      siteUrl,
      generatedAt,
    }),
  });

  ['research', 'whitepapers', 'essays'].forEach((category) => {
    pages.push({
      relativePath: `${category}.md`,
      content: buildPublicationCollectionMarkdown({
        category,
        publications,
        publicationCollections,
        siteUrl,
        generatedAt,
      }),
    });
  });

  pages.push({
    relativePath: 'pesquisa.md',
    content: buildPublicationCollectionAliasMarkdown({
      aliasTitle: 'Pesquisa | Índice Canônico',
      aliasPath: '/pesquisa',
      targetPath: '/research',
      category: 'research',
      publications,
      siteUrl,
      generatedAt,
    }),
  });

  pages.push({
    relativePath: 'ensaios.md',
    content: buildPublicationCollectionAliasMarkdown({
      aliasTitle: 'Ensaios | Índice Canônico',
      aliasPath: '/ensaios',
      targetPath: '/essays',
      category: 'essays',
      publications,
      siteUrl,
      generatedAt,
    }),
  });

  pages.push({
    relativePath: 'certificacoes.md',
    content: buildCertificationsAliasMarkdown({
      knowledgeData,
      siteUrl,
      generatedAt,
    }),
  });

  publications.forEach((publication) => {
    const detailPath = toMarkdownPathFromCanonical(publication.canonicalUrl, siteUrl);
    const articleBody = readLongformArticleMarkdown(publication.id);
    pages.push({
      relativePath: detailPath,
      content: buildPublicationDetailMarkdown({ publication, articleBody, generatedAt }),
    });
  });

  pages.push({
    relativePath: 'mundo-politico.md',
    content: buildMundoPoliticoMarkdown({ knowledgeData, siteUrl, generatedAt }),
  });

  asArray(knowledgeData?.blog?.posts).forEach((post) => {
    const postPath = toMarkdownPathFromCanonical(post.canonicalPath || `/mundo-politico/${post.slug}`, siteUrl);
    pages.push({
      relativePath: postPath,
      content: buildMundoPoliticoDetailMarkdown({ post, siteUrl, generatedAt }),
    });
  });

  const clusters = getAcervoClusters(knowledgeData);
  clusters.forEach((cluster) => {
    const clusterCanonical = toCanonicalUrl(siteUrl, cluster.canonicalPath || `/acervo-teologico/${cluster.id}`);
    const clusterPath = toMarkdownPathFromCanonical(clusterCanonical, siteUrl);
    const clusterLines = [
      markdownPageHeader({
        title: toText(cluster.seoTitle || cluster.id || 'Cluster Teológico'),
        canonicalUrl: clusterCanonical,
        updatedAt: generatedAt,
      }),
      '## Meta Description',
      toText(cluster.metaDescription || ''),
      '',
      '## Prosa Canônica',
      toText(cluster.prose || ''),
      '',
      '## Sermões',
      ...asArray(cluster.sermons).map((sermon) => {
        const sermonCanonical = toCanonicalUrl(siteUrl, sermon.canonicalPath || `${cluster.canonicalPath}/${sermon.slug}`);
        return `- [${toText(sermon.seoTitle || sermon.title || sermon.slug || 'Sermão')}](${sermonCanonical})`;
      }),
      '',
    ];

    pages.push({
      relativePath: clusterPath,
      content: `${clusterLines.join('\n')}\n`,
    });

    asArray(cluster.sermons).forEach((sermon) => {
      const sermonCanonical = toCanonicalUrl(
        siteUrl,
        sermon.canonicalPath || `${cluster.canonicalPath || `/acervo-teologico/${cluster.id}`}/${sermon.slug}`,
      );
      pages.push({
        relativePath: toMarkdownPathFromCanonical(sermonCanonical, siteUrl),
        content: buildAcervoDetailMarkdown({ cluster, sermon, siteUrl, generatedAt }),
      });
    });
  });

  return pages;
}

export function writeFatMarkdownPagesFromSsot(generatedAt) {
  const ssotData = loadGeneratedSsotData();
  const pages = buildFatMarkdownPagesFromSsot(ssotData, generatedAt);
  const seen = new Set();
  const generatedFiles = [];

  pages.forEach((page) => {
    if (seen.has(page.relativePath)) {
      throw new Error(`Falha GEO: caminho markdown duplicado detectado: ${page.relativePath}`);
    }
    seen.add(page.relativePath);
    const targetPath = path.join(PUBLIC_DIR, page.relativePath);
    ensureDir(path.dirname(targetPath));
    fs.writeFileSync(targetPath, page.content);
    const size = Buffer.byteLength(page.content, 'utf8');
    generatedFiles.push({
      relativePath: page.relativePath,
      size,
    });
  });

  process.stdout.write(buildMarkdownGenerationReport(generatedFiles));
  return generatedFiles;
}
