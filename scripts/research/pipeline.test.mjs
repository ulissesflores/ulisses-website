import { describe, it, expect } from 'vitest';
import {
  clampScore,
  xmlEscape,
  sanitizePdfText,
  escapePdfLiteral,
  toPdfDate,
  wrapText,
  chunkLines,
  splitMarkdownBlocks,
  markdownToPdfLines,
  markdownToDocxParagraphs,
} from './pipeline.mjs';

describe('clampScore', () => {
  it('clamps to max 1000', () => {
    expect(clampScore(1500)).toBe(1000);
  });

  it('clamps to min 0', () => {
    expect(clampScore(-50)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    expect(clampScore(955.7)).toBe(956);
    expect(clampScore(955.3)).toBe(955);
  });

  it('passes through values in range', () => {
    expect(clampScore(500)).toBe(500);
    expect(clampScore(0)).toBe(0);
    expect(clampScore(1000)).toBe(1000);
  });
});

describe('xmlEscape', () => {
  it('escapes all 5 XML entities', () => {
    expect(xmlEscape(`<AT&T "says" 'hi'>`)).toBe(
      '&lt;AT&amp;T &quot;says&quot; &apos;hi&apos;&gt;',
    );
  });

  it('handles null/undefined by returning empty string', () => {
    expect(xmlEscape(null)).toBe('');
    expect(xmlEscape(undefined)).toBe('');
  });

  it('converts non-string values to string', () => {
    expect(xmlEscape(42)).toBe('42');
  });

  it('passes through strings with no special characters', () => {
    expect(xmlEscape('hello world')).toBe('hello world');
  });
});

describe('sanitizePdfText', () => {
  it('strips accents via NFD normalization', () => {
    expect(sanitizePdfText('caf\u00e9')).toBe('cafe');
  });

  it('replaces non-ASCII with space and collapses whitespace', () => {
    expect(sanitizePdfText('hello\u2014world')).toBe('hello world');
  });

  it('trims result', () => {
    expect(sanitizePdfText('  hello  ')).toBe('hello');
  });

  it('handles null/undefined', () => {
    expect(sanitizePdfText(null)).toBe('');
    expect(sanitizePdfText(undefined)).toBe('');
  });

  it('collapses internal whitespace', () => {
    expect(sanitizePdfText('a   b   c')).toBe('a b c');
  });
});

describe('escapePdfLiteral', () => {
  it('escapes backslash', () => {
    expect(escapePdfLiteral('a\\b')).toBe('a\\\\b');
  });

  it('escapes parentheses', () => {
    expect(escapePdfLiteral('hello (world)')).toBe('hello \\(world\\)');
  });

  it('escapes all special chars in one string', () => {
    expect(escapePdfLiteral('a\\(b)')).toBe('a\\\\\\(b\\)');
  });

  it('passes through strings with no special characters', () => {
    expect(escapePdfLiteral('hello')).toBe('hello');
  });
});

describe('toPdfDate', () => {
  it('converts ISO date to PDF date format', () => {
    const result = toPdfDate('2026-02-21T00:00:00Z');
    expect(result).toBe('D:20260221000000Z');
  });

  it('matches PDF date regex', () => {
    const result = toPdfDate('2026-01-15T14:30:45Z');
    expect(result).toMatch(/^D:\d{14}Z$/);
    expect(result).toBe('D:20260115143045Z');
  });
});

describe('wrapText', () => {
  it('returns short text in single line', () => {
    const result = wrapText('hello world');
    expect(result).toEqual(['hello world']);
  });

  it('wraps long text at word boundaries', () => {
    const text = 'word '.repeat(20).trim();
    const result = wrapText(text, 20);
    for (const line of result) {
      expect(line.length).toBeLessThanOrEqual(20);
    }
    expect(result.length).toBeGreaterThan(1);
  });

  it('uses default line length of 88', () => {
    const longLine = 'x '.repeat(50).trim();
    const result = wrapText(longLine);
    for (const line of result) {
      expect(line.length).toBeLessThanOrEqual(88);
    }
  });

  it('returns empty array for empty string', () => {
    expect(wrapText('')).toEqual([]);
  });
});

describe('chunkLines', () => {
  it('splits array into chunks', () => {
    const result = chunkLines(['a', 'b', 'c', 'd', 'e'], 2);
    expect(result).toEqual([['a', 'b'], ['c', 'd'], ['e']]);
  });

  it('returns single chunk when array fits', () => {
    expect(chunkLines(['a', 'b'], 5)).toEqual([['a', 'b']]);
  });

  it('handles empty array', () => {
    expect(chunkLines([], 3)).toEqual([]);
  });
});

describe('splitMarkdownBlocks', () => {
  it('separates paragraphs by blank lines', () => {
    const result = splitMarkdownBlocks('para one\n\npara two');
    expect(result.blocks).toContain('para one');
    // trailing content stays in `current` (not flushed until caller handles it)
    expect(result.current).toEqual(['para two']);
  });

  it('treats headings as separate blocks', () => {
    const result = splitMarkdownBlocks('# Heading\n\nParagraph text');
    expect(result.blocks[0]).toBe('# Heading');
  });

  it('flushes current paragraph before heading', () => {
    const result = splitMarkdownBlocks('text before\n# Heading');
    expect(result.blocks).toContain('text before');
    expect(result.blocks).toContain('# Heading');
  });

  it('handles null/undefined', () => {
    const result = splitMarkdownBlocks(null);
    expect(result.blocks).toEqual([]);
  });
});

describe('markdownToPdfLines', () => {
  it('uppercases heading text', () => {
    const lines = markdownToPdfLines('# My Heading');
    expect(lines[0]).toBe('MY HEADING');
  });

  it('strips heading markers', () => {
    const lines = markdownToPdfLines('## Sub Heading');
    expect(lines[0]).toBe('SUB HEADING');
  });

  it('adds blank lines between blocks', () => {
    const lines = markdownToPdfLines('# H1\n\nSome text');
    expect(lines).toContain('');
  });
});

describe('markdownToDocxParagraphs', () => {
  it('parses headings with correct level', () => {
    const result = markdownToDocxParagraphs('# Title\n\n## Subtitle');
    expect(result[0]).toEqual({ type: 'h', level: 1, text: 'Title' });
    expect(result[1]).toEqual({ type: 'h', level: 2, text: 'Subtitle' });
  });

  it('parses list items', () => {
    const result = markdownToDocxParagraphs('- item one\n- item two');
    expect(result[0]).toEqual({ type: 'li', text: 'item one' });
    expect(result[1]).toEqual({ type: 'li', text: 'item two' });
  });

  it('parses regular paragraphs', () => {
    const result = markdownToDocxParagraphs('Just a paragraph.');
    expect(result[0]).toEqual({ type: 'p', text: 'Just a paragraph.' });
  });

  it('merges consecutive non-blank lines into one paragraph', () => {
    const result = markdownToDocxParagraphs('line one\nline two');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('line one line two');
  });

  it('handles asterisk list markers', () => {
    const result = markdownToDocxParagraphs('* item');
    expect(result[0]).toEqual({ type: 'li', text: 'item' });
  });

  it('handles null/undefined', () => {
    expect(markdownToDocxParagraphs(null)).toEqual([]);
    expect(markdownToDocxParagraphs(undefined)).toEqual([]);
  });
});
