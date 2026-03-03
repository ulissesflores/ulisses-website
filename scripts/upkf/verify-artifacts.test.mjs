import { describe, it, expect } from 'vitest';
import {
  getGraph,
  asTypeArray,
  hasType,
  hasImage,
  normalizeInlineText,
  collectDateFieldViolations,
} from './verify-artifacts.mjs';

describe('getGraph', () => {
  it('returns @graph array when present', () => {
    expect(getGraph({ '@graph': [1, 2] })).toEqual([1, 2]);
  });

  it('returns empty array for null', () => {
    expect(getGraph(null)).toEqual([]);
  });

  it('returns empty array for empty object', () => {
    expect(getGraph({})).toEqual([]);
  });

  it('returns empty array when @graph is not an array', () => {
    expect(getGraph({ '@graph': 'not array' })).toEqual([]);
  });
});

describe('asTypeArray', () => {
  it('wraps string @type in array', () => {
    expect(asTypeArray({ '@type': 'Person' })).toEqual(['Person']);
  });

  it('returns array @type as-is', () => {
    expect(asTypeArray({ '@type': ['Person', 'Thing'] })).toEqual(['Person', 'Thing']);
  });

  it('returns empty array for missing @type', () => {
    expect(asTypeArray({})).toEqual([]);
  });

  it('returns empty array for null/undefined', () => {
    expect(asTypeArray(null)).toEqual([]);
    expect(asTypeArray(undefined)).toEqual([]);
  });

  it('filters non-string items from array @type', () => {
    expect(asTypeArray({ '@type': [123, 'Valid'] })).toEqual(['Valid']);
  });
});

describe('hasType', () => {
  it('returns true when type matches string @type', () => {
    expect(hasType({ '@type': 'Person' }, 'Person')).toBe(true);
  });

  it('returns true when type matches array @type', () => {
    expect(hasType({ '@type': ['Person', 'Thing'] }, 'Thing')).toBe(true);
  });

  it('returns false when type does not match', () => {
    expect(hasType({ '@type': 'Other' }, 'Person')).toBe(false);
  });

  it('returns false for missing node', () => {
    expect(hasType(null, 'Person')).toBe(false);
  });
});

describe('hasImage', () => {
  it('returns true for string image', () => {
    expect(hasImage({ image: 'https://example.com/img.jpg' })).toBe(true);
  });

  it('returns false for empty string image', () => {
    expect(hasImage({ image: '' })).toBe(false);
  });

  it('returns true for non-empty array image', () => {
    expect(hasImage({ image: ['url1'] })).toBe(true);
  });

  it('returns false for empty array image', () => {
    expect(hasImage({ image: [] })).toBe(false);
  });

  it('returns true for object image', () => {
    expect(hasImage({ image: { url: 'https://example.com/img.jpg' } })).toBe(true);
  });

  it('returns false for missing image', () => {
    expect(hasImage({})).toBe(false);
  });

  it('returns false for null node', () => {
    expect(hasImage(null)).toBe(false);
  });
});

describe('normalizeInlineText', () => {
  it('collapses whitespace', () => {
    expect(normalizeInlineText('  foo  bar  ')).toBe('foo bar');
  });

  it('handles null/undefined', () => {
    expect(normalizeInlineText(null)).toBe('');
    expect(normalizeInlineText(undefined)).toBe('');
  });

  it('trims result', () => {
    expect(normalizeInlineText('  hello  ')).toBe('hello');
  });
});

describe('collectDateFieldViolations', () => {
  it('collects YYYY-MM-DD datePublished violations', () => {
    const violations = [];
    collectDateFieldViolations({ datePublished: '2026-01-15' }, violations);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('datePublished');
    expect(violations[0]).toContain('2026-01-15');
  });

  it('collects dateModified violations', () => {
    const violations = [];
    collectDateFieldViolations({ dateModified: '2026-03-01' }, violations);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('dateModified');
  });

  it('does NOT flag ISO datetime strings', () => {
    const violations = [];
    collectDateFieldViolations({ datePublished: '2026-01-15T00:00:00Z' }, violations);
    expect(violations).toHaveLength(0);
  });

  it('traverses nested objects', () => {
    const violations = [];
    collectDateFieldViolations({ nested: { datePublished: '2026-01-15' } }, violations);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('nested');
  });

  it('traverses arrays', () => {
    const violations = [];
    collectDateFieldViolations([{ datePublished: '2026-01-15' }], violations);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('[0]');
  });

  it('returns empty for clean data', () => {
    const violations = [];
    collectDateFieldViolations(
      { datePublished: '2026-01-15T00:00:00+00:00', name: 'test' },
      violations,
    );
    expect(violations).toHaveLength(0);
  });

  it('handles null/non-object', () => {
    const violations = [];
    collectDateFieldViolations(null, violations);
    expect(violations).toHaveLength(0);
  });
});
