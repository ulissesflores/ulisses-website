/**
 * Lightweight PDF generation utilities.
 * Extracted from scripts/research/pipeline.mjs for reuse in API routes.
 * Uses raw PDF 1.4 construction — no external dependencies.
 */

export function sanitizePdfText(value: string | null | undefined): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapePdfLiteral(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function toPdfDate(isoDate: string): string {
  const date = new Date(isoDate);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');
  return `D:${year}${month}${day}${hour}${minute}${second}Z`;
}

export function wrapText(text: string, lineLength = 88): string[] {
  const words = sanitizePdfText(text).split(' ').filter(Boolean);
  const lines: string[] = [];
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

export function chunkLines<T>(lines: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < lines.length; index += chunkSize) {
    chunks.push(lines.slice(index, index + chunkSize));
  }
  return chunks;
}

function splitMarkdownBlocks(markdown: string | null | undefined) {
  const blocks: string[] = [];
  let current: string[] = [];

  const rawLines = String(markdown || '')
    .split('\n')
    .map((line) => line.trimEnd());

  for (const line of rawLines) {
    if (line === '') {
      if (current.length > 0) {
        blocks.push(current.join(' '));
        current = [];
      }
    } else if (/^#{1,6}\s/.test(line)) {
      if (current.length > 0) {
        blocks.push(current.join(' '));
        current = [];
      }
      blocks.push(line);
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) {
    blocks.push(current.join(' '));
  }

  return blocks;
}

export function markdownToPdfLines(markdown: string): string[] {
  const blocks = splitMarkdownBlocks(markdown);
  const result: string[] = [];

  for (const block of blocks) {
    if (/^#{1,6}\s/.test(block)) {
      if (result.length > 0) result.push('');
      result.push(block.replace(/^#{1,6}\s+/, '').toUpperCase());
      result.push('');
    } else {
      result.push(...wrapText(block));
    }
  }

  return result;
}

function buildPdfPageStream(lines: string[]): string {
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

interface PdfOptions {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  lines: string[];
  timestamp: string;
}

export function buildPdfBuffer({ title, author, subject, keywords, lines, timestamp }: PdfOptions): Buffer {
  const safeLines = lines.map((line) => sanitizePdfText(line)).filter(Boolean);
  const pages = chunkLines(safeLines.length > 0 ? safeLines : ['Documento sem conteudo.'], 46);

  const objects: (string | null)[] = [null];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  const pageRefs: number[] = [];

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
    )}) /Creator (Codex Hash Research Pipeline) /Producer (Codex Hash Research Pipeline) /CreationDate (${toPdfDate(
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
