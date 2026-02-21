import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

const publicDir = path.join(repoRoot, 'public');
const docsDir = path.join(repoRoot, 'docs');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getGraph(jsonld) {
  if (!jsonld || !Array.isArray(jsonld['@graph'])) {
    return [];
  }
  return jsonld['@graph'];
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
    did: path.join(publicDir, '.well-known', 'did.json'),
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

  const siteGraph = getGraph(siteJson);
  const publicGraph = getGraph(publicJson);
  const fullGraph = getGraph(fullJson);

  const allCreds = publicGraph.filter((node) => node['@type'] === 'EducationalOccupationalCredential');
  const aluraCreds = allCreds.filter(
    (node) =>
      typeof node['@id'] === 'string' &&
      node['@id'].includes('#cred-alura-') &&
      typeof node.url === 'string' &&
      node.url.startsWith('https://cursos.alura.com.br/certificate/'),
  );
  const sermonNodes = publicGraph.filter((node) => {
    const type = node['@type'];
    const asArray = Array.isArray(type) ? type : [type];
    const hasSermonType = asArray.includes('Sermon');
    const hasVideoSermon =
      asArray.includes('VideoObject') &&
      (node.genre === 'Sermon' || node.additionalType === 'https://schema.org/Sermon');
    return hasSermonType || hasVideoSermon;
  });
  const blogNodes = publicGraph.filter((node) => node['@type'] === 'BlogPosting');

  const fullRoot = fullGraph.find((node) => node['@id'] === 'https://ulissesflores.com/#upkf');
  const publicRoot = publicGraph.find((node) => node['@id'] === 'https://ulissesflores.com/#upkf-public');

  assert(checks, siteGraph.length >= 4, 'site.jsonld tem grafo minimo');
  assert(checks, publicGraph.length > siteGraph.length, 'public.jsonld maior que site.jsonld');
  assert(checks, fullGraph.length > publicGraph.length, 'full.jsonld maior que public.jsonld');
  assert(checks, allCreds.length >= 34, 'Credenciais publicas >= 34');
  assert(checks, aluraCreds.length === 32, '32 certificacoes Alura com verify_url');
  assert(checks, sermonNodes.length === 56, '56 sermoes estruturados');
  assert(checks, blogNodes.length === 19, '19 posts do Mundo Politico estruturados');
  assert(checks, fullRoot && !Object.prototype.hasOwnProperty.call(fullRoot, 'text'), 'full root sem campo text gigante');
  assert(checks, publicRoot && Array.isArray(publicRoot.hasPart), 'public dataset com hasPart');
  assert(
    checks,
    !publicRoot || !Object.prototype.hasOwnProperty.call(publicRoot, 'includesObject'),
    'public dataset sem includesObject invalido',
  );
  assert(
    checks,
    fs.readFileSync(files.sourceMd, 'utf8').includes('Ulisses Flores — Sovereign UPKF'),
    'upkf-source.md publicado corretamente',
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
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
