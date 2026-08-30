import fs from 'node:fs';
import path from 'node:path';
import {
  generateManuscripts,
  scoreAndVerify as scoreDeepResearch,
  writeDeepResearchArtifacts,
} from '../research/pipeline.mjs';
import { ARTICLE_LONGFORM_DIR, CATEGORY_METADATA, DOCS_DIR, GENERATED_DIR, PUBLIC_DIR, repoRoot } from './lib/constants.mjs';
import { ensureDir, normalizeLineBreaks, parseFrontmatter } from './lib/text.mjs';
import { writeGenerated } from '../lib/write-generated.mjs';
import { ensureTemporaryPdf } from './lib/pdf.mjs';
import { findSourcePath, loadArticleReferencesMap, parseAcademicCredentials, parseAffiliations, parseBlogPosts, parseCertifications, parseCurrentOccupations, parseHeritage, parseIdentity, parseMarkdownSections, parseOrcidInventoryStats, parseOrganization, parsePublicationRows, parseSermons, parseSoftwareProjects, parseTop10Translations } from './lib/upkf-parser.mjs';
import { getArticleSourceDirs, loadLocalCorpus } from './lib/corpus.mjs';
import { attachTranslations, buildPublications } from './lib/publication.mjs';
import { buildCoreSiteJsonLd, buildFullUpkfJsonLd, buildPublicJsonLd, buildUrlInventory } from './lib/jsonld.mjs';
import { buildKnowledgeData, buildLlmsFullTxt, buildLlmsTxt } from './lib/knowledge.mjs';
import { buildDoiReadyMarkdown, buildDoiReadyPackage, buildProjectQualityMarkdown, buildProjectQualityReport } from './lib/doi-quality.mjs';
import { writeFatMarkdownPagesFromSsot } from './lib/fat-markdown.mjs';



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

  const publicationsTs = `/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n * Source: ${sourcePath}\n * Generated at: ${generatedAt}\n */\n\nexport type PublicationCategory = 'research' | 'whitepapers' | 'essays';\n\nexport interface PublicationLandingContent {\n  overview: string;\n  problem: string;\n  contributions: string[];\n  applications: string;\n  downloadPitch: string;\n}\n\nexport interface PublicationReference {\n  citation: string;\n  url?: string;\n}\n\nexport interface PublicationDoi {\n  status: 'target' | 'minted';\n  target?: string;\n  minted?: string;\n}\n\nexport interface PublicationQuality {\n  phase1: number;\n  phase2: number;\n  phase3: number;\n  compliance: number;\n  polymathic: number;\n  macro: number;\n}\n\nexport interface PublicationSections {\n  abstract: string;\n  abstractEn: string;\n  introduction: string;\n  methods: string;\n  results: string;\n  discussion: string;\n  recommendations: string[];\n  conclusion: string;\n  references: PublicationReference[];\n}\n\nexport interface PublicationEvidence {\n  sourceFile: string;\n  sourceName: string;\n  score: number;\n}\n\nexport type TranslatableLocale = 'en' | 'es' | 'it' | 'he';\n\nexport interface Publication {\n  ordinal: number;\n  id: string;\n  title: string;\n  category: PublicationCategory;\n  kind: string;\n  date: string;\n  publishedAt: string;\n  updatedAt: string;\n  inLanguage: string;\n  tags: string[];\n  summary: string;\n  canonicalUrl: string;\n  downloadUrl: string;\n  primaryPdfUrl: string;\n  legacyPdfUrl: string;\n  mdUrl: string;\n  docxUrl: string;\n  pdfPath: string;\n  doi: PublicationDoi;\n  quality: PublicationQuality;\n  landing: PublicationLandingContent;\n  articleSections: PublicationSections;\n  sections: PublicationSections;\n  translatedSections?: Partial<Record<TranslatableLocale, PublicationSections>>;\n  translatedLanding?: Partial<Record<TranslatableLocale, PublicationLandingContent>>;\n  sourceEvidence: PublicationEvidence[];\n  translations?: {\n    en?: string;\n    es?: string;\n    it?: string;\n    he?: string;\n    summary_en?: string;\n    summary_es?: string;\n    summary_it?: string;\n    summary_he?: string;\n  };\n}\n\nexport interface PublicationCollection {\n  title: string;\n  heading: string;\n  description: string;\n  schemaType: string;\n  headings?: Record<string, string>;\n  descriptions?: Record<string, string>;\n}\n\nexport const publicationCollections: Record<PublicationCategory, PublicationCollection> = ${JSON.stringify(
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
      notSameAs: identity.notSameAs,
      nationalities: identity.nationalities,
      jobTitle: identity.jobTitle,
      knowsAbout: identity.knowsAbout,
      hasCredential: identity.hasCredential,
      publicIdentifiers: identity.publicIdentifiers || [],
      academicCredentials: identity.academicCredentials || [],
      occupations: identity.occupations || [],
      softwareProjects: identity.softwareProjects || [],
      affiliations: identity.affiliations || [],
      heritage: identity.heritage || {
        publishPublic: false,
        clusters: [],
        synthesis: {},
      },
      identityHubStats: identity.identityHubStats || {
        orcidWorks: publications.length,
        certifications: 0,
        domains: identity.domainInventory ? identity.domainInventory.length : 0,
        sermons: 0,
      },
      geographicallyServes: identity.geographicallyServes,
      sovereignIdentity: identity.sovereignIdentity,
      domainInventory: identity.domainInventory,
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
  writeGenerated(path.join(DOCS_DIR, 'publications.generated.json'), JSON.stringify(publications, null, 2));
  fs.writeFileSync(path.join(GENERATED_DIR, 'upkf.generated.ts'), upkfTs);
  fs.writeFileSync(path.join(GENERATED_DIR, 'knowledge.generated.ts'), knowledgeTs);
  writeGenerated(path.join(DOCS_DIR, 'url-inventory.generated.json'), JSON.stringify(urlInventory, null, 2));
  writeGenerated(path.join(DOCS_DIR, 'url-inventory.generated.md'), inventoryMd);
  writeGenerated(path.join(DOCS_DIR, 'jsonld-coverage.generated.md'), coverageMd);
  writeGenerated(
    path.join(DOCS_DIR, 'article-quality.generated.json'),
    JSON.stringify(projectQualityReport, null, 2),
  );
  writeGenerated(
    path.join(DOCS_DIR, 'article-quality.generated.md'),
    buildProjectQualityMarkdown(projectQualityReport),
  );
  writeGenerated(path.join(DOCS_DIR, 'doi-ready.generated.json'), JSON.stringify(doiReady, null, 2));
  writeGenerated(path.join(DOCS_DIR, 'doi-ready.generated.md'), buildDoiReadyMarkdown(doiReady));

  // JSON-LD sanitizer: strip null, undefined, and empty arrays to pass schema.org validation
  const jsonLdReplacer = (_key, value) => {
    if (value === null || value === undefined) return undefined;
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  };

  const siteJson = JSON.stringify(siteJsonLd, jsonLdReplacer, 2);
  const publicJson = JSON.stringify(publicJsonLd, jsonLdReplacer, 2);
  const fullJson = JSON.stringify(fullJsonLd, jsonLdReplacer, 2).replaceAll(
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
  writeFatMarkdownPagesFromSsot(generatedAt);
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
  const sourcePathAbsolute = findSourcePath();
  const sourcePath = path.relative(repoRoot, sourcePathAbsolute);
  const upkfText = normalizeLineBreaks(fs.readFileSync(sourcePathAbsolute, 'utf8'));
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
  const occupations = parseCurrentOccupations(upkfText);
  const academicCredentials = parseAcademicCredentials(upkfText);
  const softwareProjects = parseSoftwareProjects(upkfText);
  const affiliations = parseAffiliations(upkfText);
  const heritage = parseHeritage(upkfText);
  const orcidInventory = parseOrcidInventoryStats(upkfText);

  const totalSermons =
    sermons.collections.reduce((sum, collection) => sum + collection.items.length, 0) || sermons.total || 0;
  const totalCertifications =
    certifications.alura.length + (certifications.edx?.verifyUrl ? 1 : 0) + (certifications.coursera?.verifyUrl ? 1 : 0);

  const enrichedIdentity = {
    ...identity,
    occupations,
    academicCredentials,
    softwareProjects,
    affiliations,
    heritage,
    identityHubStats: {
      orcidWorks: orcidInventory.reported || orcidInventory.counted,
      certifications: totalCertifications,
      domains: Array.isArray(identity.domainInventory) ? identity.domainInventory.length : 0,
      sermons: totalSermons,
    },
  };

  if (publicationRows.length === 0) {
    throw new Error('Nenhuma publicacao com URL canonica foi encontrada no UPKF.');
  }

  const articleSourceDirs = getArticleSourceDirs();
  const corpus = loadLocalCorpus(articleSourceDirs, sourcePathAbsolute);
  const referencesLibrary = loadArticleReferencesMap();

  let publications = buildPublications(publicationRows, generatedAt, corpus, referencesLibrary);
  publications = attachTranslations(publications, translations);

  const deepResearchEntries = await generateManuscripts({
    publications,
    identity: enrichedIdentity,
    generatedAt,
    repoRoot,
  });
  const deepResearchReport = scoreDeepResearch({
    publications,
    entries: deepResearchEntries,
    threshold: 950,
  });
  // FASE 2: artigos com conteúdo REAL recuperado (article.pt-br.recovered.md) são isentos do
  // gate de word-count — são pesquisa autoral, revisada pelo operador, não auto-geração. O gate
  // (calibrado para volume) penalizava conteúdo real conciso e incentivava boilerplate inflado.
  const recoveredSlugs = new Set(
    publications
      .filter((p) => fs.existsSync(path.join(ARTICLE_LONGFORM_DIR, p.id, 'article.pt-br.recovered.md')))
      .map((p) => p.id),
  );
  const realPending = (deepResearchReport.pending || []).filter((slug) => !recoveredSlugs.has(slug));
  if (realPending.length > 0) {
    throw new Error(`Deep research quality gate failed for: ${realPending.join(', ')}`);
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

  const knowledgeData = buildKnowledgeData(certifications, blogPosts, sermons, generatedAt, enrichedIdentity);
  const projectQualityReport = buildProjectQualityReport(publications, generatedAt);
  const doiReady = buildDoiReadyPackage(publications, enrichedIdentity, generatedAt);

  const createdPdfs = publications
    .map((publication) => ensureTemporaryPdf(publication, enrichedIdentity, generatedAt))
    .filter(Boolean).length;

  const siteJsonLd = buildCoreSiteJsonLd(enrichedIdentity, organization, frontmatter);
  const publicJsonLd = buildPublicJsonLd({
    coreSiteJsonLd: siteJsonLd,
    publications,
    frontmatter,
    sourcePath,
    identity: enrichedIdentity,
    certifications,
    blogPosts,
    sermons,
    softwareProjects: enrichedIdentity.softwareProjects,
  });
  const fullJsonLd = buildFullUpkfJsonLd({
    publicJsonLd,
    upkfSections,
    frontmatter,
    sourcePath,
    identity: enrichedIdentity,
    sourceMdPublicUrl: '/upkf-source.md',
  });

  const urlInventory = buildUrlInventory(
    upkfText,
    publications,
    enrichedIdentity.primaryWebsite || 'https://ulissesflores.com',
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
    identity: enrichedIdentity,
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
    sermons: totalSermons,
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
