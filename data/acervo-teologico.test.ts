import { describe, it, expect } from 'vitest';
import { toMetaDescription } from './acervo-teologico';

describe('toMetaDescription', () => {
  it('returns short text as-is (trimmed)', () => {
    expect(toMetaDescription('  Short text  ')).toBe('Short text');
  });

  it('returns text at exactly 180 chars as-is', () => {
    const text = 'a'.repeat(180);
    expect(toMetaDescription(text)).toBe(text);
  });

  it('truncates text over 180 chars with ellipsis', () => {
    const text = 'a'.repeat(200);
    const result = toMetaDescription(text);
    expect(result).toHaveLength(180);
    expect(result).toMatch(/\.\.\.$/);
  });

  it('trims trailing whitespace before adding ellipsis', () => {
    const text = 'a'.repeat(175) + '     ' + 'b'.repeat(20);
    const result = toMetaDescription(text);
    expect(result.length).toBeLessThanOrEqual(180);
    expect(result).toMatch(/\.\.\.$/);
    expect(result).not.toMatch(/\s\.\.\.$/);
  });

  it('returns empty string for empty input', () => {
    expect(toMetaDescription('')).toBe('');
  });
});
