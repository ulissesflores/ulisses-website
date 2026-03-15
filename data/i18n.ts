export const supportedLocales = ['pt-br', 'en', 'es', 'it', 'he'] as const;

export type Locale = (typeof supportedLocales)[number];

export type LocalizedStringMap = Record<Locale, string>;

export const defaultLocale: Locale = 'pt-br';

export const localeToHreflang: Record<Locale, string> = {
  'pt-br': 'pt-BR',
  en: 'en',
  es: 'es',
  it: 'it',
  he: 'he',
};

/** Human-readable labels for language switcher UI */
export const localeLabels: Record<Locale, string> = {
  'pt-br': 'Português',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  he: 'עברית',
};

/** OpenGraph locale codes (used in metadata) */
export const localeToOgLocale: Record<Locale, string> = {
  'pt-br': 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
  it: 'it_IT',
  he: 'he_IL',
};

/** RTL locales */
const rtlLocales: ReadonlySet<Locale> = new Set(['he']);

/** Returns text direction for a locale: 'rtl' for Hebrew, 'ltr' for all others */
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return rtlLocales.has(locale) ? 'rtl' : 'ltr';
}

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function normalizeLocale(value?: string | null): Locale {
  if (!value) {
    return defaultLocale;
  }
  const normalized = value.trim().toLowerCase();
  return isLocale(normalized) ? normalized : defaultLocale;
}

export function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

export function localizePath(path: string, locale: Locale): string {
  const normalizedPath = normalizePath(path);
  if (locale === defaultLocale) {
    return normalizedPath;
  }
  if (normalizedPath === '/') {
    return `/${locale}`;
  }
  return `/${locale}${normalizedPath}`;
}
