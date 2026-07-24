import fs from 'node:fs';
import path from 'node:path';
import { PUBLIC_DIR } from './constants.mjs';
import { ensureDir } from './text.mjs';

export function sanitizePdfText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapePdfLiteral(value) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function wrapText(text, lineLength = 88) {
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

export function toPdfDate(isoDate) {
  const date = new Date(isoDate);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');
  return `D:${year}${month}${day}${hour}${minute}${second}Z`;
}

export function buildPdfPageStream(lines) {
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

export function chunkLines(lines, chunkSize) {
  const chunks = [];
  for (let index = 0; index < lines.length; index += chunkSize) {
    chunks.push(lines.slice(index, index + chunkSize));
  }
  return chunks;
}

export function buildPdfBuffer({ title, author, subject, keywords, lines, timestamp }) {
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

export function appendSectionToPdfLines(lines, heading, content) {
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

export function ensureTemporaryPdf(publication, identity, generatedAt) {
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

  try {
    fs.writeFileSync(targetPath, pdf);
    return true;
  } catch (error) {
    process.stderr.write(
      `Aviso: falha ao escrever PDF temporario (${targetPath}): ${error instanceof Error ? error.message : String(error)}\n`,
    );
    return false;
  }
}
