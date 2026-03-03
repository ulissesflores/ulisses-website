import { describe, it, expect } from 'vitest';
import { escapeXml, toRfc2822 } from './route';

describe('escapeXml', () => {
  it('escapes ampersand', () => {
    expect(escapeXml('AT&T')).toBe('AT&amp;T');
  });

  it('escapes angle brackets', () => {
    expect(escapeXml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes double quotes', () => {
    expect(escapeXml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeXml("it's")).toBe("it&apos;s");
  });

  it('escapes all 5 entities in a single string', () => {
    expect(escapeXml(`<AT&T "says" 'hi'>`)).toBe(
      '&lt;AT&amp;T &quot;says&quot; &apos;hi&apos;&gt;',
    );
  });

  it('returns empty string for empty input', () => {
    expect(escapeXml('')).toBe('');
  });

  it('passes through strings with no special characters', () => {
    expect(escapeXml('hello world')).toBe('hello world');
  });
});

describe('toRfc2822', () => {
  it('formats a valid ISO date', () => {
    const result = toRfc2822('2026-01-15T00:00:00Z');
    expect(result).toContain('15 Jan 2026');
    expect(result).toContain('GMT');
  });

  it('formats a date-only string', () => {
    const result = toRfc2822('2026-01-15');
    expect(result).toContain('2026');
    expect(result).toContain('GMT');
  });

  it('returns a valid date string for invalid input', () => {
    const result = toRfc2822('not-a-date');
    expect(result).toContain('GMT');
    // Should be a parseable date (falls back to current date)
    expect(Number.isNaN(Date.parse(result))).toBe(false);
  });
});
