import { describe, it, expect } from 'vitest';
import { normalizeOriginalPath } from './sermons-migration';

describe('normalizeOriginalPath', () => {
  it('extracts pathname from full URL', () => {
    expect(normalizeOriginalPath('https://example.com/sermons/foo')).toBe('/sermons/foo');
  });

  it('adds leading slash to relative path', () => {
    expect(normalizeOriginalPath('sermons/foo')).toBe('/sermons/foo');
  });

  it('keeps already-normalized path unchanged', () => {
    expect(normalizeOriginalPath('/sermons/foo')).toBe('/sermons/foo');
  });

  it('returns / for empty string', () => {
    expect(normalizeOriginalPath('')).toBe('/');
  });
});
