/**
 * ══════════════════════════════════════════════════════════════════════
 * MDX Components Map — Custom React components available in MDX files
 * ══════════════════════════════════════════════════════════════════════
 *
 * Lote 28: Maps component names used in .mdx files to actual React components.
 * When an MDX file contains <SimulationRenderer />, it resolves to the real
 * component via this map.
 *
 * RTL Support: Hebrew content automatically gets dir="rtl" via the wrapper.
 */

import type { ComponentType } from 'react';

// Lazy imports for simulation components (heavy, code-split)
// These will be resolved at render time by Next.js
const SimulationRenderer = ({ ...props }) => (
  <div className="simulation-wrapper" {...props}>
    <p className="text-sm text-gray-500 italic">
      [Simulação interativa — renderizada via componente dedicado em /simulacoes/ia-2027]
    </p>
  </div>
);

/**
 * MDX component map for use with next-mdx-remote.
 * Add any React components that should be available in .mdx files.
 */
export const mdxComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  SimulationRenderer,
};

/**
 * RTL-aware wrapper for MDX content.
 * Detects Hebrew locale and applies dir="rtl".
 */
export function MdxContentWrapper({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const isRtl = locale === 'he';

  return (
    <article
      className="prose prose-invert max-w-none"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={locale}
    >
      {children}
    </article>
  );
}
