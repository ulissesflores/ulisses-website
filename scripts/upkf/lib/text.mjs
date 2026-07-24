import fs from 'node:fs';

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function normalizeLineBreaks(text) {
  return text.replace(/\r\n/g, '\n');
}

export function normalizeForSearch(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function parseInlineArray(rawValue) {
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

export function parseFrontmatter(text) {
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

export function extractScalar(text, key) {
  const pattern = new RegExp(`^- ${key.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}:\\s*(.+)$`, 'm');
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

export function extractBlock(text, startMarker, endMarker) {
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

export function parseMultilingualMap(block) {
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

export function parseMarkdownTableRows(block) {
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !line.includes(':---') && !line.includes(':--'))
    .map((line) =>
      line
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean),
    )
    .filter((row) => row.length > 1);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function splitByThirdLevelHeadings(section) {
  const headingRegex = /^###\s+(.+)$/gm;
  const headings = Array.from(section.matchAll(headingRegex)).map((match) => ({
    heading: match[1].trim(),
    index: match.index ?? 0,
  }));

  return headings.map((entry, index) => {
    const next = headings[index + 1];
    const block = section.slice(entry.index, next ? next.index : section.length);
    return {
      heading: entry.heading,
      block,
    };
  });
}

export function splitBySecondAndThirdLevelHeadings(section) {
  const headingRegex = /^(##|###)\s+(.+)$/gm;
  const headings = Array.from(section.matchAll(headingRegex)).map((match) => ({
    heading: match[2].trim(),
    index: match.index ?? 0,
  }));

  return headings.map((entry, index) => {
    const next = headings[index + 1];
    const block = section.slice(entry.index, next ? next.index : section.length);
    return {
      heading: entry.heading,
      block,
    };
  });
}

export function normalizeHeadingTitle(value) {
  return String(value).replace(/^\d+\.\s*/, '').trim();
}

export function parseIndentedMap(block, key) {
  const pattern = new RegExp(`- ${escapeRegExp(key)}:\\n([\\s\\S]*?)(?=\\n- [a-zA-Z0-9_]+:|$)`);
  const match = block.match(pattern);
  if (!match) {
    return {};
  }

  const lines = match[1].split('\n');
  const map = {};

  let activeKey = '';
  let activeValue = [];
  let multiline = false;

  const flush = () => {
    if (!activeKey) {
      return;
    }
    const joined = activeValue
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ')
      .trim();
    if (joined) {
      map[activeKey] = joined;
    }
    activeKey = '';
    activeValue = [];
    multiline = false;
  };

  for (const line of lines) {
    const langMatch = line.match(/^\s{4}([a-zA-Z0-9-]+):\s*(.*)$/);
    if (langMatch) {
      flush();
      const lang = langMatch[1].trim();
      const raw = langMatch[2].trim();
      if (!lang) {
        continue;
      }
      if (!raw || raw === '>') {
        activeKey = lang;
        multiline = true;
        continue;
      }
      map[lang] = raw.replace(/^"|"$/g, '').replace(/^'|'$/g, '').trim();
      continue;
    }

    if (!multiline || !activeKey) {
      continue;
    }

    const valueMatch = line.match(/^\s{6}(.+)$/);
    if (valueMatch) {
      activeValue.push(valueMatch[1]);
    }
  }

  flush();
  return map;
}

export function parseIndentedList(block, key) {
  const pattern = new RegExp(`- ${escapeRegExp(key)}:\\n([\\s\\S]*?)(?=\\n- [a-zA-Z0-9_]+:|$)`);
  const match = block.match(pattern);
  if (!match) {
    return [];
  }

  return match[1]
    .split('\n')
    .map((line) => {
      const entryMatch = line.match(/^\s{4}-\s+(.+)$/);
      return entryMatch ? entryMatch[1].trim() : '';
    })
    .filter(Boolean);
}

export function parseBlockParagraph(block, key) {
  const pattern = new RegExp(`- ${escapeRegExp(key)}:\\s*>\\n([\\s\\S]*?)(?=\\n- [a-zA-Z0-9_]+:|\\n###\\s|$)`, 'm');
  const match = block.match(pattern);
  if (!match) {
    return '';
  }

  return match[1]
    .split('\n')
    .map((line) => line.replace(/^\s{4}/, '').trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function formatDateWithTimezone(dateString, timezone = '-03:00') {
  if (!dateString || dateString === 'UNDATED') return undefined;
  if (dateString.includes('T')) {
    return dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString) ? dateString : dateString + timezone;
  }
  return `${dateString}T00:00:00${timezone}`;
}

export function slugify(value) {
  return normalizeForSearch(value || '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function toDateOnly(value) {
  const normalized = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(normalized)) {
    return normalized.slice(0, 10);
  }
  try {
    return new Date(normalized || Date.now()).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function toCanonicalUrl(siteUrl, pathname) {
  const safePath = String(pathname || '').startsWith('/') ? String(pathname) : `/${String(pathname || '')}`;
  return `${siteUrl.replace(/\/$/, '')}${safePath}`;
}

export function markdownPageHeader({ title, canonicalUrl, updatedAt }) {
  return [`# ${title}`, `Canonical-URL: ${canonicalUrl}`, `Last-Updated: ${toDateOnly(updatedAt)}`, ''].join('\n');
}

export function htmlEscape(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildDoiTarget(publication) {
  return `10.5281/zenodo.${publication.date}${publication.ordinal.toString().padStart(2, '0')}`;
}
