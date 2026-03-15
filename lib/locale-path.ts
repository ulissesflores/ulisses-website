import { defaultLocale, type Locale } from '@/data/i18n';

/**
 * Prefix an internal path with the locale segment.
 * Default locale (pt-br) keeps the bare path so the middleware rewrite covers it.
 * Non-default locales get `/${locale}${path}`.
 *
 * Anchors and hash links (`/#section`) are passed through unchanged for the
 * default locale, and prefixed for foreign locales so the user stays in context.
 *
 * @example
 * localePath('/simulacoes', 'en')   // → '/en/simulacoes'
 * localePath('/simulacoes', 'pt-br') // → '/simulacoes'
 * localePath('/#contact', 'he')     // → '/he/#contact'
 */
export function localePath(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href;
  if (locale === defaultLocale) return href;

  // Handle hash anchors like /#contact → /en/#contact → /en#contact (invalid)
  // Instead keep them as /en/#contact (middleware will handle)
  if (href.startsWith('/#')) {
    return `/${locale}${href}`;
  }

  return `/${locale}${href}`;
}
