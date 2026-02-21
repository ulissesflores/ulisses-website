import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreAndVerify, writeDeepResearchArtifacts } from './pipeline.mjs';

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
  return parsePublicationsFromTs(path.join(repoRoot, 'data', 'generated', 'publications.generated.ts'));
}

function loadEntries(publications) {
  return publications.map((publication) => ({
    slug: publication.id,
    title: publication.title,
    abstract: publication.sections.abstract,
    abstractEn:
      publication.articleSections?.abstractEn ||
      `This scientific article refines ${publication.title} with a reproducible and citation-dense deep research workflow.`,
    citation: `Carlos Ulisses Flores (2026) ${publication.title}. Codex Hash Research Lab.`,
    doi: publication.doi,
    files: {
      md: `/deep-research/${publication.id}/deep-research.md`,
      pdf: `/deep-research/${publication.id}/deep-research.pdf`,
      docx: `/deep-research/${publication.id}/deep-research.docx`,
    },
    quality: publication.quality,
  }));
}

function main() {
  const publications = loadPublications();
  const entries = loadEntries(publications);

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

  process.stdout.write(`${JSON.stringify({ projectScore: report.projectScore, approved: report.approved }, null, 2)}\n`);

  if (!report.approved) {
    process.exit(1);
  }
}

main();
