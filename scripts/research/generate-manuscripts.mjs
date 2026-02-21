import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateManuscripts, scoreAndVerify, writeDeepResearchArtifacts } from './pipeline.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

function parsePublicationsFromTs(tsPath) {
  const text = fs.readFileSync(tsPath, 'utf8');
  const match = text.match(/export const publications: Publication\[\] = (\[.*\]);\n/s);
  if (!match) {
    throw new Error(`Nao foi possivel extrair publications de ${tsPath}`);
  }
  return JSON.parse(match[1]);
}

function loadPublications() {
  const jsonPath = path.join(repoRoot, 'docs', 'publications.generated.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }

  const tsPath = path.join(repoRoot, 'data', 'generated', 'publications.generated.ts');
  return parsePublicationsFromTs(tsPath);
}

function loadIdentity() {
  const upkfPath = path.join(repoRoot, 'data', 'generated', 'upkf.generated.ts');
  const text = fs.readFileSync(upkfPath, 'utf8');
  const match = text.match(/export const upkfMeta = (\{[\s\S]*?\}) as const;/);
  if (!match) {
    return {
      publicDisplayName: 'Carlos Ulisses Flores',
      canonicalName: 'Carlos Ulisses Flores',
    };
  }
  const meta = JSON.parse(match[1]);
  return {
    publicDisplayName: meta.publicDisplayName || meta.displayName || 'Carlos Ulisses Flores',
    canonicalName: meta.canonicalLegalName || meta.displayName || 'Carlos Ulisses Flores',
  };
}

async function main() {
  const publications = loadPublications();
  const identity = loadIdentity();
  const generatedAt = new Date().toISOString();

  const entries = await generateManuscripts({
    publications,
    identity,
    generatedAt,
    repoRoot,
  });

  const report = scoreAndVerify({
    publications,
    entries,
    threshold: 950,
  });

  writeDeepResearchArtifacts({
    entries,
    report,
    docsDir: path.join(repoRoot, 'docs'),
    generatedTsPath: path.join(repoRoot, 'data', 'generated', 'deep-research.generated.ts'),
  });

  process.stdout.write(
    `${JSON.stringify({ manuscripts: entries.length, projectScore: report.projectScore, approved: report.approved }, null, 2)}\n`,
  );

  if (!report.approved) {
    process.exit(1);
  }
}

await main();
