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
