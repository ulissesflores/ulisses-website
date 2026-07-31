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

import type { MDXComponents } from 'mdx/types';
import { EffortCostChart } from './effort-cost-chart';

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
/**
 * `MDXComponents` (do próprio MDX) em vez de um `Record` próprio: os props vêm do
 * corpo do .mdx, não do TypeScript, então um mapa com props tipados exigiria cast
 * em todo componente que declara props obrigatórios.
 */
export const mdxComponents: MDXComponents = {
  SimulationRenderer,
  EffortCostChart,
  /**
   * Tabela larga rola em vez de espremer. O container é quem rola; a tabela
   * mantém a largura natural (`w-max`) e ocupa no mínimo a linha inteira.
   *
   * A tentativa anterior (`table { display: block; overflow-x: auto }` no
   * template do artigo) não funcionava: sem largura mínima, a tabela encolhia
   * para caber e a rolagem ficava em 4 px — a de benchmarks do Opus 5 espremia
   * 5 colunas em 342 px, com cabeçalho de 3 linhas e 1.011 px de altura
   * (medido no iPhone 13, auditoria 2026-07-28).
   *
   * Sem `!important`: o Tailwind Typography estiliza via `:where()`, que tem
   * especificidade zero, então a classe do wrapper vence.
   */
  /*
   * `tabIndex={0}` porque uma região rolável precisa ser alcançável por teclado.
   * Quando a correção acima passou a fazer a tabela rolar de verdade, o wrapper virou
   * uma região rolável sem foco — axe `scrollable-region-focusable` (serious), medido
   * em produção no iPhone 13 em 2026-07-30. Só aparece no mobile, porque só ali a
   * tabela ultrapassa a largura; por isso o gate de axe (desktop) não pegou.
   * Sem `role="region"`: sem nome acessível, um landmark anônimo é pior que nenhum.
   */
  table: (props) => (
    <div tabIndex={0} className='overflow-x-auto [&>table]:w-max [&>table]:min-w-full'>
      <table {...props} />
    </div>
  ),
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
