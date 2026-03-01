import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

const publicDir = path.join(repoRoot, 'public');
const docsDir = path.join(repoRoot, 'docs');
const generatedDir = path.join(repoRoot, 'data', 'generated');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getGraph(jsonld) {
  if (!jsonld || !Array.isArray(jsonld['@graph'])) {
    return [];
  }
  return jsonld['@graph'];
}

function asTypeArray(node) {
  const type = node?.['@type'];
  if (Array.isArray(type)) {
    return type.filter((item) => typeof item === 'string');
  }
  return typeof type === 'string' ? [type] : [];
}

function hasType(node, typeName) {
  return asTypeArray(node).includes(typeName);
}

function hasImage(node) {
  if (!node) {
    return false;
  }
  if (Array.isArray(node.image)) {
    return node.image.length > 0;
  }
  if (typeof node.image === 'string') {
    return node.image.length > 0;
  }
  return Boolean(node.image && typeof node.image === 'object');
}

function normalizeInlineText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectDateFieldViolations(value, violations, pointer = '$') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectDateFieldViolations(item, violations, `${pointer}[${index}]`));
    return;
  }

  if (!value || typeof value !== 'object') {
    return;
  }

  for (const [key, entry] of Object.entries(value)) {
    const childPointer = `${pointer}.${key}`;
    if ((key === 'datePublished' || key === 'dateModified') && typeof entry === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.trim())) {
      violations.push(`${childPointer}=${entry}`);
    } else {
      collectDateFieldViolations(entry, violations, childPointer);
    }
  }
}

function assert(checks, condition, label, details = '') {
  checks.push({
    ok: Boolean(condition),
    label,
    details,
  });
}

function writeReport(checks, context) {
  fs.mkdirSync(docsDir, { recursive: true });

  const lines = [];
  lines.push('# JSON-LD Audit (Generated)');
  lines.push('');
  lines.push(`- Generated at: ${new Date().toISOString()}`);
  lines.push(`- Site graph nodes: ${context.siteGraphNodes}`);
  lines.push(`- Public graph nodes: ${context.publicGraphNodes}`);
  lines.push(`- Full graph nodes: ${context.fullGraphNodes}`);
  lines.push(`- Alura credentials: ${context.aluraCount}`);
  lines.push(`- Sermons: ${context.sermonCount}`);
  lines.push(`- Blog posts: ${context.blogCount}`);
  lines.push('');
  lines.push('## Checks');
  for (const check of checks) {
    lines.push(`- [${check.ok ? 'x' : ' '}] ${check.label}${check.details ? ` — ${check.details}` : ''}`);
  }
  lines.push('');

  fs.writeFileSync(path.join(docsDir, 'jsonld-audit.generated.md'), `${lines.join('\n')}\n`);
}

function main() {
  const files = {
    site: path.join(publicDir, 'site.jsonld'),
    pub: path.join(publicDir, 'public.jsonld'),
    full: path.join(publicDir, 'full.jsonld'),
    sourceMd: path.join(publicDir, 'upkf-source.md'),
    llms: path.join(publicDir, 'llms.txt'),
    llmsFull: path.join(publicDir, 'llms-full.txt'),
    identidadeMd: path.join(publicDir, 'identidade.md'),
    acervoMd: path.join(publicDir, 'acervo-teologico.md'),
    researchMd: path.join(publicDir, 'research.md'),
    whitepapersMd: path.join(publicDir, 'whitepapers.md'),
    essaysMd: path.join(publicDir, 'essays.md'),
    mundoPoliticoMd: path.join(publicDir, 'mundo-politico.md'),
    did: path.join(publicDir, '.well-known', 'did.json'),
    articleQualityJson: path.join(docsDir, 'article-quality.generated.json'),
    articleQualityMd: path.join(docsDir, 'article-quality.generated.md'),
    doiReadyJson: path.join(docsDir, 'doi-ready.generated.json'),
    doiReadyMd: path.join(docsDir, 'doi-ready.generated.md'),
    deepQualityJson: path.join(docsDir, 'deep-research-quality.generated.json'),
    deepQualityMd: path.join(docsDir, 'deep-research-quality.generated.md'),
    doiManifest: path.join(publicDir, 'doi', 'manifest.json'),
    deepResearchGeneratedTs: path.join(generatedDir, 'deep-research.generated.ts'),
    publicationsJson: path.join(docsDir, 'publications.generated.json'),
    robotsSource: path.join(repoRoot, 'app', 'robots.ts'),
    seoSource: path.join(repoRoot, 'data', 'seo.ts'),
    identidadePage: path.join(repoRoot, 'app', 'identidade', 'page.tsx'),
  };

  const checks = [];

  for (const [name, filePath] of Object.entries(files)) {
    assert(checks, fs.existsSync(filePath), `Arquivo presente: ${name}`, filePath);
  }

  if (!checks.every((check) => check.ok)) {
    writeReport(checks, {
      siteGraphNodes: 0,
      publicGraphNodes: 0,
      fullGraphNodes: 0,
      aluraCount: 0,
      sermonCount: 0,
      blogCount: 0,
    });
    process.stderr.write('Falha: artefatos obrigatorios ausentes. Veja docs/jsonld-audit.generated.md\n');
    process.exit(1);
  }

  const siteJson = readJson(files.site);
  const publicJson = readJson(files.pub);
  const fullJson = readJson(files.full);
  const didJson = readJson(files.did);
  const articleQuality = readJson(files.articleQualityJson);
  const doiReady = readJson(files.doiReadyJson);
  const deepQuality = readJson(files.deepQualityJson);
  const publicationsIndex = readJson(files.publicationsJson);
  const llmsContent = fs.readFileSync(files.llms, 'utf8');
  const identidadeMdContent = fs.readFileSync(files.identidadeMd, 'utf8');
  const acervoMdContent = fs.readFileSync(files.acervoMd, 'utf8');

  const siteGraph = getGraph(siteJson);
  const publicGraph = getGraph(publicJson);
  const fullGraph = getGraph(fullJson);

  const allCreds = publicGraph.filter((node) => hasType(node, 'EducationalOccupationalCredential'));
  const aluraCreds = allCreds.filter(
    (node) =>
      typeof node['@id'] === 'string' &&
      node['@id'].includes('#cred-alura-') &&
      typeof node.url === 'string' &&
      node.url.startsWith('https://cursos.alura.com.br/certificate/'),
  );
  const sermonNodes = publicGraph.filter((node) => hasType(node, 'VideoObject') && (node.genre === 'Sermon' || node.additionalType === 'https://schema.org/Sermon'));
  const blogNodes = publicGraph.filter((node) => hasType(node, 'BlogPosting'));
  const articleNodes = publicGraph.filter((node) => hasType(node, 'ScholarlyArticle') || hasType(node, 'Report') || hasType(node, 'BlogPosting'));
  const robotsSource = fs.readFileSync(files.robotsSource, 'utf8');
  const seoSource = fs.readFileSync(files.seoSource, 'utf8');
  const identidadePageSource = fs.readFileSync(files.identidadePage, 'utf8');

  const fullRoot = fullGraph.find((node) => node['@id'] === 'https://ulissesflores.com/#upkf');
  const publicRoot = publicGraph.find((node) => node['@id'] === 'https://ulissesflores.com/#upkf-public');
  const codexHash = publicGraph.find(
    (node) => node['@id'] === 'https://ulissesflores.com/#codexhash' && hasType(node, 'Organization'),
  );
  const datasetDistribution = Array.isArray(publicRoot?.distribution) ? publicRoot.distribution : [];
  const distributionUrls = new Set(datasetDistribution.map((item) => item.contentUrl).filter(Boolean));
  const dateViolations = [];
  collectDateFieldViolations(publicJson, dateViolations);
  const sampleResearchPublication = Array.isArray(publicationsIndex)
    ? publicationsIndex.find((item) => item?.category === 'research' && typeof item?.id === 'string')
    : null;
  const sampleArticlePath = sampleResearchPublication
    ? path.join(repoRoot, 'data', 'research', 'articles', sampleResearchPublication.id, 'article.md')
    : '';
  const sampleResearchMdPath = sampleResearchPublication
    ? path.join(publicDir, 'research', `${sampleResearchPublication.id}.md`)
    : '';
  const sampleArticleContent = sampleArticlePath && fs.existsSync(sampleArticlePath) ? fs.readFileSync(sampleArticlePath, 'utf8') : '';
  const sampleResearchMdContent = sampleResearchMdPath && fs.existsSync(sampleResearchMdPath) ? fs.readFileSync(sampleResearchMdPath, 'utf8') : '';
  const sampleArticleSnippet = normalizeInlineText(sampleArticleContent).slice(0, 220);
  const sampleMdNormalized = normalizeInlineText(sampleResearchMdContent);

  assert(checks, siteGraph.length >= 4, 'site.jsonld tem grafo minimo');
  assert(checks, publicGraph.length > siteGraph.length, 'public.jsonld maior que site.jsonld');
  assert(checks, fullGraph.length > publicGraph.length, 'full.jsonld maior que public.jsonld');
  assert(checks, allCreds.length >= 34, 'Credenciais publicas >= 34');
  assert(checks, aluraCreds.length === 32, '32 certificacoes Alura com verify_url');
  assert(checks, sermonNodes.length === 56, '56 sermoes estruturados');
  assert(checks, blogNodes.length === 19, '19 posts do Mundo Politico estruturados');
  assert(checks, fullRoot && !Object.prototype.hasOwnProperty.call(fullRoot, 'text'), 'full root sem campo text gigante');
  assert(
    checks,
    publicRoot && publicRoot.license === 'https://creativecommons.org/licenses/by/4.0/',
    'public dataset com license CC-BY-4.0',
  );
  assert(
    checks,
    !publicRoot || !Object.prototype.hasOwnProperty.call(publicRoot, 'hasPart'),
    'public dataset sem hasPart',
  );
  assert(
    checks,
    !publicRoot || !Object.prototype.hasOwnProperty.call(publicRoot, 'includesObject'),
    'public dataset sem includesObject invalido',
  );
  assert(
    checks,
    publicRoot && publicRoot.includedInDataCatalog && publicRoot.includedInDataCatalog['@id'] === 'https://ulissesflores.com/#knowledge-catalog',
    'public dataset referenciado em DataCatalog',
  );
  assert(checks, datasetDistribution.length >= 4, 'public dataset com distribution minima');
  assert(checks, distributionUrls.has('https://ulissesflores.com/public.jsonld'), 'distribution inclui public.jsonld');
  assert(checks, distributionUrls.has('https://ulissesflores.com/full.jsonld'), 'distribution inclui full.jsonld');
  assert(checks, distributionUrls.has('https://ulissesflores.com/site.jsonld'), 'distribution inclui site.jsonld');
  assert(checks, distributionUrls.has('https://ulissesflores.com/upkf-source.md'), 'distribution inclui upkf-source.md');
  assert(
    checks,
    articleNodes.every((node) => hasImage(node)),
    'Article/Report/BlogPosting com image',
  );
  assert(
    checks,
    articleNodes.every((node) => node.publisher?.logo?.url),
    'Article/Report/BlogPosting com publisher.logo',
  );
  assert(
    checks,
    articleNodes.every((node) => Boolean(node.dateModified)),
    'Article/Report/BlogPosting com dateModified',
  );
  assert(
    checks,
    articleNodes.filter((node) => hasType(node, 'ScholarlyArticle') || hasType(node, 'Report')).every((node) => Boolean(node.mainEntityOfPage)),
    'ScholarlyArticle/Report com mainEntityOfPage',
  );
  assert(
    checks,
    sermonNodes.every((node) => Boolean(node.uploadDate) && Boolean(node.thumbnailUrl) && Boolean(node.embedUrl) && Boolean(node.description)),
    'VideoObject com uploadDate/thumbnail/embed/description',
  );
  assert(
    checks,
    allCreds.every((node) => hasImage(node)),
    'EducationalOccupationalCredential com image',
  );
  assert(
    checks,
    identidadePageSource.includes("'@type': 'ProfilePage'") || identidadePageSource.includes('"@type": "ProfilePage"'),
    '/identidade usa ProfilePage',
  );
  assert(checks, robotsSource.includes('OAI-SearchBot'), 'robots inclui OAI-SearchBot');
  assert(checks, seoSource.includes("'x-default'"), 'alternates inclui x-default');
  assert(
    checks,
    fs.readFileSync(files.sourceMd, 'utf8').includes('Ulisses Flores — Sovereign UPKF'),
    'upkf-source.md publicado corretamente',
  );
  assert(
    checks,
    llmsContent.includes('/public.jsonld'),
    'llms.txt referencia recursos semanticos',
  );
  assert(checks, Buffer.byteLength(identidadeMdContent, 'utf8') > 2048, 'identidade.md com densidade > 2KB');
  assert(checks, Buffer.byteLength(acervoMdContent, 'utf8') > 2048, 'acervo-teologico.md com densidade > 2KB');
  assert(checks, identidadeMdContent.includes('## Bio Semântica'), 'identidade.md inclui secao Bio Semântica');
  assert(checks, identidadeMdContent.includes('## Firewall Semântico'), 'identidade.md inclui secao Firewall Semântico');
  assert(checks, acervoMdContent.includes('## Clusters'), 'acervo-teologico.md inclui secao de clusters');
  assert(
    checks,
    sampleResearchPublication !== null,
    'Existe publicacao de research para validacao de markdown denso',
  );
  assert(
    checks,
    sampleArticleSnippet.length > 0 && sampleMdNormalized.includes(sampleArticleSnippet),
    'public/research/<slug>.md contem trecho do article.md original',
    sampleResearchPublication ? sampleResearchPublication.id : '',
  );
  assert(
    checks,
    llmsContent.includes('Ground Truth Node: https://ulissesflores.com/identidade.md'),
    'llms.txt inclui Ground Truth Node em /identidade.md',
  );
  assert(
    checks,
    llmsContent.includes('## LLM & GEO Routing (Token Optimization)'),
    'llms.txt inclui secao LLM & GEO Routing',
  );
  assert(
    checks,
    llmsContent.includes('## Localization (i18n)'),
    'llms.txt inclui secao Localization (i18n)',
  );
  assert(
    checks,
    dateViolations.length === 0,
    'public.jsonld sem datePublished/dateModified no formato YYYY-MM-DD',
    dateViolations.length > 0 ? dateViolations.slice(0, 8).join('; ') : '',
  );
  assert(
    checks,
    codexHash?.address?.['@type'] === 'PostalAddress',
    'Codex Hash usa address com @type PostalAddress',
  );
  assert(
    checks,
    codexHash?.address?.streetAddress === 'Avenida Itacira, 2689, Planalto Paulista' &&
      codexHash?.address?.addressLocality === 'São Paulo' &&
      codexHash?.address?.addressRegion === 'SP' &&
      codexHash?.address?.postalCode === '04061-003' &&
      codexHash?.address?.addressCountry === 'BR',
    'Codex Hash address contem campos completos canônicos',
  );
  assert(
    checks,
    fs.readFileSync(files.llmsFull, 'utf8').includes('## Publications'),
    'llms-full.txt contem indice expandido',
  );
  assert(checks, didJson.id === 'did:web:ulissesflores.com', 'did:web configurado');
  assert(
    checks,
    Array.isArray(didJson.verificationMethod) && didJson.verificationMethod.length >= 1,
    'did.json com verificationMethod',
  );
  assert(
    checks,
    Array.isArray(didJson.service) && didJson.service.some((item) => item.serviceEndpoint === 'https://ulissesflores.com/public.jsonld'),
    'did.json referencia public.jsonld em service',
  );
  assert(checks, articleQuality.threshold === 950, 'Relatorio de qualidade usa limiar SOTA = 950');
  assert(checks, articleQuality.projectScore >= 950, 'Score geral de artigos >= 950');
  assert(
    checks,
    Array.isArray(articleQuality.articles) && articleQuality.articles.every((item) => item.finalScore >= 950),
    'Todos os artigos com score final >= 950',
  );
  assert(checks, doiReady.threshold === 950, 'DOI-ready usa limiar minimo 950');
  assert(checks, doiReady.taskScore >= 950, 'Score DOI-ready >= 950');
  assert(
    checks,
    Array.isArray(doiReady.items) && doiReady.items.every((item) => item.score?.finalScore >= 950),
    'Todos os pacotes DOI por artigo com score >= 950',
  );
  assert(
    checks,
    Array.isArray(doiReady.items) &&
      doiReady.items.every((item) => item.doi?.status === 'target' && Boolean(item.doi?.target)),
    'DOI-ready usa politica doi_target para todos os artigos',
  );
  assert(
    checks,
    Array.isArray(doiReady.items) &&
      doiReady.items.every((item) => typeof item.citationCff === 'string' && !item.citationCff.includes('\ndoi:')),
    'CITATION.cff sem campo doi oficial quando status=target',
  );
  assert(
    checks,
    Array.isArray(doiReady.items) &&
      doiReady.items.every((item) => item.crossrefMetadata && !Object.prototype.hasOwnProperty.call(item.crossrefMetadata, 'DOI')),
    'crossref.json sem campo DOI oficial para pre-registro',
  );
  assert(checks, deepQuality.threshold === 950, 'Deep research usa limiar minimo 950');
  assert(checks, deepQuality.projectScore >= 950, 'Score deep research >= 950');
  assert(
    checks,
    Array.isArray(deepQuality.articles) &&
      deepQuality.articles.every((item) => item.quality?.phase1 >= 950 && item.quality?.phase2 >= 950 && item.quality?.phase3 >= 950 && item.quality?.macro >= 950),
    'Todos os artigos deep research com fases e macro >= 950',
  );
  assert(checks, fs.existsSync(files.doiManifest), 'Manifesto DOI publico presente');

  const deepResearchMissing = [];
  for (const item of doiReady.items) {
    const mdPath = path.join(publicDir, 'deep-research', item.slug, 'deep-research.md');
    const pdfPath = path.join(publicDir, 'deep-research', item.slug, 'deep-research.pdf');
    const docxPath = path.join(publicDir, 'deep-research', item.slug, 'deep-research.docx');
    if (!fs.existsSync(mdPath) || !fs.existsSync(pdfPath) || !fs.existsSync(docxPath)) {
      deepResearchMissing.push(item.slug);
    }
  }
  assert(
    checks,
    deepResearchMissing.length === 0,
    '18/18 artigos com artefatos deep-research (.md/.pdf/.docx)',
    deepResearchMissing.length > 0 ? `faltando: ${deepResearchMissing.join(', ')}` : '',
  );

  const publicFilesToScan = [
    files.site,
    files.pub,
    files.full,
    files.llms,
    files.llmsFull,
    files.doiReadyJson,
    files.doiManifest,
  ];
  const leakedLegalName = publicFilesToScan.filter((filePath) =>
    fs.readFileSync(filePath, 'utf8').includes('Carlos Ulisses Flores Ribeiro'),
  );
  assert(
    checks,
    leakedLegalName.length === 0,
    'Nome publico sem vazamento do nome juridico em artefatos publicos',
    leakedLegalName.length > 0 ? leakedLegalName.join(', ') : '',
  );

  const ok = checks.every((check) => check.ok);
  writeReport(checks, {
    siteGraphNodes: siteGraph.length,
    publicGraphNodes: publicGraph.length,
    fullGraphNodes: fullGraph.length,
    aluraCount: aluraCreds.length,
    sermonCount: sermonNodes.length,
    blogCount: blogNodes.length,
  });

  if (!ok) {
    process.stderr.write('Falha na auditoria JSON-LD. Veja docs/jsonld-audit.generated.md\n');
    process.exit(1);
  }

  const summary = {
    siteGraphNodes: siteGraph.length,
    publicGraphNodes: publicGraph.length,
    fullGraphNodes: fullGraph.length,
    aluraCertifications: aluraCreds.length,
    sermons: sermonNodes.length,
    blogPosts: blogNodes.length,
    doiReadyScore: doiReady.taskScore,
    deepResearchScore: deepQuality.projectScore,
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
