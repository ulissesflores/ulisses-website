import { upkfMeta } from '@/data/generated/upkf.generated';
import { defaultLocale, localeToHreflang, localizePath, supportedLocales, type Locale } from '@/data/i18n';

export function buildLanguageAlternates(path: string, publishedLocales: readonly Locale[] = supportedLocales): Record<string, string> {
  const origin = upkfMeta.primaryWebsite;
  const alternates: Record<string, string> = {};

  for (const locale of publishedLocales) {
    const hrefLang = localeToHreflang[locale];
    const localizedPath = localizePath(path, locale);
    alternates[hrefLang] = `${origin}${localizedPath === '/' ? '' : localizedPath}`;
  }

  const defaultPath = localizePath(path, defaultLocale);
  alternates['x-default'] = `${origin}${defaultPath === '/' ? '' : defaultPath}`;

  return alternates;
}
