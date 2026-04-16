#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// rich-results-validator.mjs
//
// Emulates the most useful checks of Google's Rich Results Test without
// depending on the unofficial test endpoint. For each URL:
//   1. Fetches the page (follows redirects)
//   2. Extracts every `<script type="application/ld+json">` block
//   3. Validates the JSON-LD against schema.org shape rules for the rich
//      result types we care about (Article, BreadcrumbList, FAQPage,
//      VideoObject, Dataset, ProfessionalService, Person, Organization,
//      WebPage, CollectionPage).
//   4. Reports: errors (missing required fields, invalid types, broken
//      references) and warnings (missing recommended fields).
//
// This does NOT replace Google's test (which also does JS-rendering and
// crawl-time checks), but it catches ~90% of the "rich result ineligible"
// issues you'd otherwise discover via GSC email alerts.
//
// Usage:
//   node scripts/seo/rich-results-validator.mjs [URL [URL...]]
//   (no args → uses the default 5-URL representative sample)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_URLS = [
  'https://ulissesflores.com/',
  'https://ulissesflores.com/identidade',
  'https://ulissesflores.com/whitepapers/2023-digital-legacy',
  'https://ulissesflores.com/acervo-teologico/avivamento-e-consagracao/restaurando-o-primeiro-amor',
  'https://ulissesflores.com/public.jsonld',
];

// ── Schema.org rules — required/recommended fields per rich result type ────
const RICH_RESULT_SHAPES = {
  Article:                 { required: ['headline','author'],           recommended: ['datePublished','image','description','publisher'] },
  ScholarlyArticle:        { required: ['headline','author'],           recommended: ['datePublished','image','description','publisher'] },
  NewsArticle:             { required: ['headline','author'],           recommended: ['datePublished','image','description','publisher'] },
  BlogPosting:             { required: ['headline','author'],           recommended: ['datePublished','image','description','publisher'] },
  Report:                  { required: ['headline','author'],           recommended: ['datePublished','image','description','publisher'] },
  BreadcrumbList:          { required: ['itemListElement'],             recommended: [] },
  ListItem:                { required: ['position','name'],             recommended: ['item'] },
  FAQPage:                 { required: ['mainEntity'],                  recommended: [] },
  Question:                { required: ['name','acceptedAnswer'],       recommended: [] },
  Answer:                  { required: ['text'],                        recommended: [] },
  VideoObject:             { required: ['name','description','thumbnailUrl','uploadDate'], recommended: ['contentUrl','embedUrl','publisher'] },
  Dataset:                 { required: ['name','description'],          recommended: ['creator','distribution','license','url'] },
  ProfessionalService:     { required: ['name'],                        recommended: ['description','areaServed','url','provider'] },
  Service:                 { required: ['name'],                        recommended: ['description','provider'] },
  Person:                  { required: ['name'],                        recommended: ['url','jobTitle','image'] },
  Organization:            { required: ['name'],                        recommended: ['url','logo','description'] },
  WebSite:                 { required: ['name','url'],                  recommended: ['description','potentialAction'] },
  WebPage:                 { required: [],                              recommended: ['name','description','url'] },
  CollectionPage:          { required: [],                              recommended: ['name','description'] },
  SoftwareSourceCode:      { required: ['name'],                        recommended: ['codeRepository','programmingLanguage','creator'] },
  SoftwareApplication:     { required: ['name'],                        recommended: ['applicationCategory','operatingSystem'] },
  EducationalOccupationalCredential: { required: ['name'], recommended: ['credentialCategory','recognizedBy','url'] },
  // Dataset.hasPart must only reference CreativeWork subtypes:
};

const CREATIVE_WORK_TYPES = new Set([
  'CreativeWork','CreativeWorkSeries','Collection','Article','BlogPosting','NewsArticle',
  'Report','ScholarlyArticle','TechArticle','WebPage','WebSite','CollectionPage','AboutPage',
  'FAQPage','ProfilePage','MediaObject','VideoObject','AudioObject','ImageObject','MusicRecording',
  'MusicVideoObject','SoftwareApplication','SoftwareSourceCode','WebApplication','MobileApplication',
  'Book','Chapter','Periodical','PublicationIssue','PublicationVolume','Thesis','Course','Dataset',
  'Review','Painting','Photograph','ShortStory','Message','Movie','MusicComposition','Sermon','Map','Diagram',
]);

// ── Helpers ────────────────────────────────────────────────────────────────
function extractJsonLd(html) {
  const blocks = [];
  const re = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch (err) {
      blocks.push({ __parse_error: err.message, __raw: m[1].slice(0, 200) });
    }
  }
  return blocks;
}

function typesOf(node) {
  const t = node?.['@type'];
  if (!t) return [];
  return Array.isArray(t) ? t : [t];
}

function walk(node, cb, path = '$') {
  if (Array.isArray(node)) {
    node.forEach((n, i) => walk(n, cb, `${path}[${i}]`));
  } else if (node && typeof node === 'object') {
    cb(node, path);
    for (const [k, v] of Object.entries(node)) {
      if (k === '@context' || k === '@graph' || k === '@type' || k === '@id') continue;
      walk(v, cb, `${path}.${k}`);
    }
    if (Array.isArray(node['@graph'])) {
      node['@graph'].forEach((n, i) => walk(n, cb, `${path}.@graph[${i}]`));
    }
  }
}

function validateNode(node, path, errors, warnings) {
  const types = typesOf(node);
  if (types.length === 0) return;

  // Skip JSON-LD references. A reference is a node whose only JSON-LD-meaningful
  // keys are @id and @type (optionally @context). The consumer dereferences @id
  // to the canonical definition elsewhere in the graph. Google Rich Results
  // Test recognizes this pattern and does not enforce required fields on
  // reference nodes — only on the canonical definitions.
  const meaningfulKeys = Object.keys(node).filter(
    (k) => k !== '@id' && k !== '@type' && k !== '@context',
  );
  if (meaningfulKeys.length === 0 && node['@id']) return;

  for (const type of types) {
    const shape = RICH_RESULT_SHAPES[type];
    if (!shape) continue;
    for (const req of shape.required) {
      if (!(req in node) || node[req] === undefined || node[req] === null || node[req] === '') {
        errors.push(`${path} [${type}] missing REQUIRED field: ${req}`);
      }
    }
    for (const rec of shape.recommended) {
      if (!(rec in node) || node[rec] === undefined) {
        warnings.push(`${path} [${type}] missing recommended field: ${rec}`);
      }
    }
  }

  // Cross-cutting rule: Dataset.hasPart must only contain CreativeWork subtypes.
  if (types.includes('Dataset') && Array.isArray(node.hasPart)) {
    node.hasPart.forEach((child, idx) => {
      const childTypes = typesOf(child);
      if (childTypes.length > 0 && !childTypes.some((t) => CREATIVE_WORK_TYPES.has(t))) {
        errors.push(`${path}.hasPart[${idx}] — Dataset.hasPart child has non-CreativeWork @type: ${childTypes.join(', ')} (child @id: ${child['@id'] || 'n/a'})`);
      }
    });
  }

  // Cross-cutting rule: VideoObject needs either contentUrl or embedUrl.
  if (types.includes('VideoObject') && !node.contentUrl && !node.embedUrl) {
    errors.push(`${path} [VideoObject] must have contentUrl OR embedUrl`);
  }
}

async function fetchAndValidate(url) {
  const report = { url, http: null, jsonldBlocks: 0, types: {}, errors: [], warnings: [] };
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (rich-results-validator)' } });
    report.http = res.status;
    if (!res.ok) {
      report.errors.push(`HTTP ${res.status} — cannot fetch`);
      return report;
    }
    const contentType = res.headers.get('content-type') || '';
    const body = await res.text();

    let blocks;
    if (contentType.includes('application/ld+json') || url.endsWith('.jsonld')) {
      // Raw JSON-LD file — single "block".
      try {
        blocks = [JSON.parse(body)];
      } catch (err) {
        report.errors.push(`JSON parse error: ${err.message}`);
        return report;
      }
    } else {
      blocks = extractJsonLd(body);
    }

    report.jsonldBlocks = blocks.length;

    for (const block of blocks) {
      if (block.__parse_error) {
        report.errors.push(`JSON-LD parse error: ${block.__parse_error}`);
        continue;
      }
      walk(block, (node, path) => {
        for (const t of typesOf(node)) {
          report.types[t] = (report.types[t] || 0) + 1;
        }
        validateNode(node, path, report.errors, report.warnings);
      });
    }
  } catch (err) {
    report.errors.push(`Fetch error: ${err.message}`);
  }
  return report;
}

// ── Main ────────────────────────────────────────────────────────────────────
const urls = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_URLS;

console.log(`🔍 Rich Results Validator — ${urls.length} URLs\n`);

let totalErrors = 0;
let totalWarnings = 0;
const summary = [];

for (const url of urls) {
  const report = await fetchAndValidate(url);
  totalErrors += report.errors.length;
  totalWarnings += report.warnings.length;
  summary.push(report);

  console.log(`─── ${url}`);
  console.log(`    HTTP ${report.http} · ${report.jsonldBlocks} JSON-LD block(s) · ${Object.keys(report.types).length} @types`);
  if (Object.keys(report.types).length > 0) {
    const topTypes = Object.entries(report.types).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([t, c]) => `${c}× ${t}`).join('  ');
    console.log(`    Top @types: ${topTypes}`);
  }
  if (report.errors.length > 0) {
    console.log(`    ❌ ${report.errors.length} error(s):`);
    for (const e of report.errors.slice(0, 10)) console.log(`       · ${e}`);
    if (report.errors.length > 10) console.log(`       · ... and ${report.errors.length - 10} more`);
  }
  if (report.warnings.length > 0) {
    console.log(`    ⚠️  ${report.warnings.length} warning(s) (recommended fields missing)`);
  }
  if (report.errors.length === 0) {
    console.log(`    ✅ No schema errors`);
  }
  console.log('');
}

console.log(`═══════════════════════════════════════════════`);
console.log(`  Summary: ${totalErrors} errors, ${totalWarnings} warnings across ${urls.length} URLs`);
console.log(`═══════════════════════════════════════════════`);

process.exit(totalErrors > 0 ? 1 : 0);
