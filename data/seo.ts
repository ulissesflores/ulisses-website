import { upkfMeta } from '@/data/generated/upkf.generated';

export const hreflangLocalePrefix = {
  'pt-BR': 'pt-br',
  en: 'en',
  es: 'es',
  he: 'he',
  it: 'it',
} as const;

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const origin = upkfMeta.primaryWebsite;
  const normalizedPath = normalizePath(path);
  const alternates: Record<string, string> = {};

  Object.entries(hreflangLocalePrefix).forEach(([lang, prefix]) => {
    const suffix = normalizedPath === '/' ? '' : normalizedPath;
    alternates[lang] = `${origin}/${prefix}${suffix}`;
  });

  return alternates;
}

/**
 * Build a self-referencing canonical URL for the current locale.
 *
 * For pt-br (default locale): returns bare path (e.g., '/simulacoes')
 *   because middleware rewrites bare paths → /pt-br/... invisibly.
 *
 * For all other locales: returns '/{locale}{path}' (e.g., '/es/simulacoes')
 *   so Google sees each localized page as self-referencing canonical.
 *
 * Without this, all non-pt-br pages generate canonical pointing to the
 * pt-br version, causing GSC to exclude 1000+ pages as duplicates.
 */
export function buildCanonical(locale: string, path: string): string {
  const normalizedPath = normalizePath(path);
  // Default locale uses bare paths (no prefix) — middleware handles rewrite
  if (locale === 'pt-br') {
    return normalizedPath;
  }
  // Foreign locales MUST include their locale prefix for self-referencing canonical
  const suffix = normalizedPath === '/' ? '' : normalizedPath;
  return `/${locale}${suffix}`;
}
