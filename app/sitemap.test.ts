import { describe, it, expect } from 'vitest';
import { isIndexableSitemapPath } from './sitemap';

describe('isIndexableSitemapPath', () => {
  it('returns true for plain paths with no extension', () => {
    expect(isIndexableSitemapPath('/research/foo')).toBe(true);
    expect(isIndexableSitemapPath('/identidade')).toBe(true);
    expect(isIndexableSitemapPath('/')).toBe(true);
  });

  it('returns false for .md files', () => {
    expect(isIndexableSitemapPath('/research/foo.md')).toBe(false);
  });

  it('returns false for .docx files', () => {
    expect(isIndexableSitemapPath('/research/foo.docx')).toBe(false);
  });

  it('returns false for .json files', () => {
    expect(isIndexableSitemapPath('/research/foo.json')).toBe(false);
  });

  it('returns false for .jsonld files', () => {
    expect(isIndexableSitemapPath('/research/foo.jsonld')).toBe(false);
  });

  it('returns true for .pdf files', () => {
    expect(isIndexableSitemapPath('/research/foo.pdf')).toBe(true);
    expect(isIndexableSitemapPath('/deep-research/slug/deep-research.pdf')).toBe(true);
  });

  it('handles query strings after excluded extensions', () => {
    expect(isIndexableSitemapPath('/foo.md?v=1')).toBe(false);
    expect(isIndexableSitemapPath('/foo.json?v=1')).toBe(false);
  });

  it('handles hash fragments after excluded extensions', () => {
    expect(isIndexableSitemapPath('/foo.json#frag')).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(isIndexableSitemapPath('/FOO.MD')).toBe(false);
    expect(isIndexableSitemapPath('/FOO.PDF')).toBe(true);
  });
});
