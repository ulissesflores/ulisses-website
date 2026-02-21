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

