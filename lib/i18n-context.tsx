'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from '@/data/i18n';
import type { Dictionary } from '@/data/i18n/types';

// ─── Context Shape ──────────────────────────────────────────────────────────────

type I18nContextValue = {
  /** Current locale string, e.g. 'pt-br' */
  locale: Locale;
  /** Common namespace — always available in the client bundle */
  common: Dictionary['common'];
  /** Optional page-specific namespaces — only shipped when needed by the page */
  ia2027: Dictionary['ia2027'];
  mummRa: Dictionary['mummRa'];
};

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────────

type I18nProviderProps = {
  locale: Locale;
  common: Dictionary['common'];
  ia2027?: Dictionary['ia2027'];
  mummRa?: Dictionary['mummRa'];
  children: ReactNode;
};

// Default empty stubs to avoid runtime errors when namespace isn't provided
const EMPTY_IA2027 = {} as Dictionary['ia2027'];
const EMPTY_MUMMRA = {} as Dictionary['mummRa'];

/**
 * Wraps the app tree and provides i18n data to client components.
 *
 * Performance: `dict.common` is always sent; page-specific namespaces
 * like `ia2027` or `mummRa` are sent ONLY by pages that need them.
 * Server components continue to import getDictionary() directly.
 */
export function I18nProvider({ locale, common, ia2027, mummRa, children }: I18nProviderProps) {
  return (
    <I18nContext.Provider value={{ locale, common, ia2027: ia2027 ?? EMPTY_IA2027, mummRa: mummRa ?? EMPTY_MUMMRA }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Access i18n context in client components.
 * Returns `{ locale, common, ia2027, mummRa }`.
 *
 * @example
 * const { common, locale } = useDict();
 * return <nav>{common.cta}</nav>;
 */
export function useDict(): I18nContextValue {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error(
      'useDict() must be used within an <I18nProvider>. ' +
        'Make sure the root layout wraps children with <I18nProvider locale={...} common={...}>.'
    );
  }

  return ctx;
}
