/**
 * Âncoras estáveis para os cabeçalhos do corpo de um paper.
 *
 * O sumário lateral precisa apontar para `#id` e o `<h2>` renderizado pelo MDX precisa
 * carregar o mesmo `id`. Sem plugin novo: uma única função de slug, usada nos dois lados
 * (no mapa de componentes, ao renderizar; em `extractHeadings`, ao ler o corpo cru).
 * Duplicatas ganham sufixo `-2`, `-3`… na mesma ordem nos dois lados.
 */
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

export function headingSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'secao';
}

export interface BodyHeading {
  id: string;
  label: string;
  level: 2 | 3;
}

function unique(): (slug: string) => string {
  const seen = new Map<string, number>();
  return (slug) => {
    const n = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, n);
    return n === 1 ? slug : `${slug}-${n}`;
  };
}

/** Lê `##`/`###` do markdown cru (fora de blocos de código) e devolve a lista para o sumário. */
export function extractHeadings(rawBody: string): BodyHeading[] {
  const dedupe = unique();
  const out: BodyHeading[] = [];
  let inFence = false;
  for (const line of rawBody.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(##|###)\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const label = m[2].replace(/[*_`]/g, '').trim();
    out.push({ id: dedupe(headingSlug(label)), label, level: m[1].length as 2 | 3 });
  }
  return out;
}

function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (typeof node === 'object' && 'props' in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

/**
 * Mapa de `h2`/`h3` com `id` derivado do texto. Um contador por chamada, porque cada
 * página compila o seu corpo uma vez; o mesmo contador está em `extractHeadings`.
 */
export function headingComponents(): MDXComponents {
  const dedupe = unique();
  const make = (Tag: 'h2' | 'h3') =>
    function Heading(props: { children?: ReactNode }) {
      const id = dedupe(headingSlug(textOf(props.children)));
      return (
        <Tag id={id} className='scroll-mt-28'>
          {props.children}
        </Tag>
      );
    };
  return { h2: make('h2'), h3: make('h3') };
}
