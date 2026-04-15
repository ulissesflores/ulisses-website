import { upkfMeta } from '@/data/generated/upkf.generated';
import { normalizePath } from './i18n';

/**
 * Hreflang prefix map. `pt-BR` is the default locale — its canonical URL is
 * the BARE path (no prefix). Only non-default locales carry a `/{prefix}/`.
 */
export const hreflangLocalePrefix = {
  'pt-BR': '',
  en: 'en',
  es: 'es',
  he: 'he',
  it: 'it',
} as const;

/**
 * Build the `alternates.languages` map for Next.js metadata.
 *
 * The `pt-BR` variant MUST emit the bare canonical URL (no `/pt-br/` prefix),
 * matching the `buildCanonical` behavior for the default locale. Otherwise the
 * hreflang cluster contains a self-referencing URL that 301-redirects back to
 * the canonical — Google rejects the cluster and may pick a foreign variant
 * (e.g. `/it/...`) as the canonical, producing "Alternate page with proper
 * canonical tag" errors in Search Console.
 *
 * Also emits `x-default` pointing to the bare canonical, so Google has an
 * explicit fallback when language detection is ambiguous.
 */
export function buildLanguageAlternates(path: string): Record<string, string> {
  const origin = upkfMeta.primaryWebsite;
  const normalizedPath = normalizePath(path);
  const suffix = normalizedPath === '/' ? '' : normalizedPath;
  const alternates: Record<string, string> = {};

  Object.entries(hreflangLocalePrefix).forEach(([lang, prefix]) => {
    // Default locale (pt-BR, prefix='') → bare URL; root becomes origin + '/'.
    const base = prefix === '' ? origin : `${origin}/${prefix}`;
    alternates[lang] = suffix === '' && prefix === '' ? `${origin}/` : `${base}${suffix}`;
  });

  // x-default → bare canonical, identical to pt-BR variant.
  alternates['x-default'] = alternates['pt-BR'];

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
