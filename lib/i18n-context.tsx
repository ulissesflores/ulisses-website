'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from '@/data/i18n';
import type { Dictionary } from '@/data/i18n/types';

// ─── Context Shape ──────────────────────────────────────────────────────────────

type I18nContextValue = {
  /** Current locale string, e.g. 'pt-br' */
  locale: Locale;
  /** Common namespace — the ONLY part of the dict shipped to the client bundle */
  common: Dictionary['common'];
};

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────────

type I18nProviderProps = {
  locale: Locale;
  common: Dictionary['common'];
  children: ReactNode;
};

/**
 * Wraps the app tree and provides i18n data to client components.
 *
 * Performance: only `dict.common` and `locale` are sent to the client.
 * Page-specific namespaces stay server-side and are passed as props
 * directly to server components.
 */
export function I18nProvider({ locale, common, children }: I18nProviderProps) {
  return (
    <I18nContext.Provider value={{ locale, common }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Access i18n context in client components.
 * Returns `{ locale, common }`.
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
