import type { Locale } from '@/data/i18n';
import type { Dictionary } from '@/data/i18n/types';

/**
 * Dynamically imports the dictionary for the given locale.
 * Falls back to pt-BR (ground truth) if the import fails.
 *
 * Usage (server component):
 *   const dict = await getDictionary(locale);
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loaders: Record<Locale, () => Promise<{ default: any }>> = {
  'pt-br': () => import('@/data/i18n/pt-br'),
  en: () => import('@/data/i18n/en'),
  es: () => import('@/data/i18n/es'),
  it: () => import('@/data/i18n/it'),
  he: () => import('@/data/i18n/he'),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = loaders[locale] ?? loaders['pt-br'];

  try {
    const mod = await load();
    return mod.default as Dictionary;
  } catch {
    // Fallback: se o import falhar, carrega pt-BR como safety net
    const fallback = await loaders['pt-br']();
    return fallback.default as Dictionary;
  }
}
