import { describe, it, expect } from 'vitest';
import {
  stripLocalePrefix,
  isRewritablePublicRoute,
  toMarkdownPath,
  collapseDuplicatedPrefix,
  mapPtAliases,
  extractLocale,
} from './middleware';

describe('stripLocalePrefix', () => {
  it('returns / for root', () => {
    expect(stripLocalePrefix('/')).toBe('/');
  });

  it('strips pt-br prefix', () => {
    expect(stripLocalePrefix('/pt-br/research/foo')).toBe('/research/foo');
  });

  it('strips en prefix', () => {
    expect(stripLocalePrefix('/en/identidade')).toBe('/identidade');
  });

  it('returns / when locale is the only segment', () => {
    expect(stripLocalePrefix('/pt-br')).toBe('/');
    expect(stripLocalePrefix('/en')).toBe('/');
  });

  it('is case-insensitive', () => {
    expect(stripLocalePrefix('/PT-BR/identidade')).toBe('/identidade');
    expect(stripLocalePrefix('/En/research')).toBe('/research');
  });

  it('does not strip non-locale segments', () => {
    expect(stripLocalePrefix('/research/foo')).toBe('/research/foo');
    expect(stripLocalePrefix('/fr/something')).toBe('/fr/something');
  });

  it('handles all supported locales', () => {
    expect(stripLocalePrefix('/es/page')).toBe('/page');
    expect(stripLocalePrefix('/it/page')).toBe('/page');
    expect(stripLocalePrefix('/he/page')).toBe('/page');
  });
});

describe('isRewritablePublicRoute', () => {
  it('returns true for root', () => {
    expect(isRewritablePublicRoute('/')).toBe(true);
  });

  it('returns true for rewritable prefixes', () => {
    expect(isRewritablePublicRoute('/identidade')).toBe(true);
    expect(isRewritablePublicRoute('/research')).toBe(true);
    expect(isRewritablePublicRoute('/whitepapers')).toBe(true);
    expect(isRewritablePublicRoute('/essays')).toBe(true);
    expect(isRewritablePublicRoute('/acervo-teologico')).toBe(true);
    expect(isRewritablePublicRoute('/mundo-politico')).toBe(true);
    expect(isRewritablePublicRoute('/certifications')).toBe(true);
    expect(isRewritablePublicRoute('/simulacoes')).toBe(true);
    expect(isRewritablePublicRoute('/clube-santo')).toBe(true);
    expect(isRewritablePublicRoute('/projeto-psi')).toBe(true);
  });

  it('returns true for nested paths under rewritable prefixes', () => {
    expect(isRewritablePublicRoute('/research/my-paper')).toBe(true);
    expect(isRewritablePublicRoute('/certifications/aws-cert')).toBe(true);
  });

  it('returns false for unknown paths', () => {
    expect(isRewritablePublicRoute('/unknown')).toBe(false);
    expect(isRewritablePublicRoute('/api/something')).toBe(false);
  });
});

describe('toMarkdownPath', () => {
  it('converts root to /index.md', () => {
    expect(toMarkdownPath('/')).toBe('/index.md');
  });

  it('appends .md to regular paths', () => {
    expect(toMarkdownPath('/identidade')).toBe('/identidade.md');
    expect(toMarkdownPath('/research/foo')).toBe('/research/foo.md');
  });
});

describe('collapseDuplicatedPrefix', () => {
  it('collapses doubled prefix', () => {
    expect(collapseDuplicatedPrefix('/research/research/slug')).toBe('/research/slug');
  });

  it('collapses exact doubled prefix without trailing content', () => {
    expect(collapseDuplicatedPrefix('/research/research')).toBe('/research');
  });

  it('collapses triple duplication via the while loop', () => {
    expect(collapseDuplicatedPrefix('/essays/essays/essays/deep')).toBe('/essays/deep');
  });

  it('leaves non-duplicated paths unchanged', () => {
    expect(collapseDuplicatedPrefix('/research/foo')).toBe('/research/foo');
    expect(collapseDuplicatedPrefix('/')).toBe('/');
  });

  it('collapses Portuguese alias segments', () => {
    expect(collapseDuplicatedPrefix('/pesquisa/pesquisa/slug')).toBe('/pesquisa/slug');
    expect(collapseDuplicatedPrefix('/ensaios/ensaios/slug')).toBe('/ensaios/slug');
    expect(collapseDuplicatedPrefix('/certificacoes/certificacoes/foo')).toBe('/certificacoes/foo');
  });

  it('handles all collection segments', () => {
    expect(collapseDuplicatedPrefix('/whitepapers/whitepapers/x')).toBe('/whitepapers/x');
    expect(collapseDuplicatedPrefix('/acervo-teologico/acervo-teologico/x')).toBe(
      '/acervo-teologico/x',
    );
    expect(collapseDuplicatedPrefix('/mundo-politico/mundo-politico/x')).toBe('/mundo-politico/x');
    expect(collapseDuplicatedPrefix('/simulacoes/simulacoes/x')).toBe('/simulacoes/x');
  });
});

describe('mapPtAliases', () => {
  it('maps /pesquisa to /research', () => {
    expect(mapPtAliases('/pesquisa')).toBe('/research');
  });

  it('maps /pesquisa/deep to /research/deep', () => {
    expect(mapPtAliases('/pesquisa/deep')).toBe('/research/deep');
  });

  it('maps /ensaios to /essays', () => {
    expect(mapPtAliases('/ensaios')).toBe('/essays');
  });

  it('maps /certificacoes to /certifications', () => {
    expect(mapPtAliases('/certificacoes')).toBe('/certifications');
    expect(mapPtAliases('/certificacoes/foo')).toBe('/certifications/foo');
  });

  it('leaves non-alias paths unchanged', () => {
    expect(mapPtAliases('/research')).toBe('/research');
    expect(mapPtAliases('/identidade')).toBe('/identidade');
    expect(mapPtAliases('/')).toBe('/');
  });
});

describe('extractLocale', () => {
  it('returns locale from path', () => {
    expect(extractLocale('/en/clube-santo')).toBe('en');
    expect(extractLocale('/pt-br/identidade')).toBe('pt-br');
    expect(extractLocale('/he/mundo-politico')).toBe('he');
  });

  it('returns null for non-locale paths', () => {
    expect(extractLocale('/clube-santo')).toBeNull();
    expect(extractLocale('/')).toBeNull();
    expect(extractLocale('/fr/page')).toBeNull();
  });

  it('is case-insensitive', () => {
    expect(extractLocale('/EN/page')).toBe('en');
    expect(extractLocale('/PT-BR/page')).toBe('pt-br');
  });
});
