import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { ReactElement } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import { remarkCallouts } from './remark-callouts';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🔔 O marcador `[!NOTE]` não pode chegar ao leitor
 * ───────────────────────────────────────────────────────────────────────────────
 *  Callout do GitHub está fora da spec do GFM: o `remark-gfm` sozinho entrega o
 *  marcador como texto dentro do blockquote, e foi assim que `[!NOTE]` e
 *  `[!IMPORTANT]` foram parar em produção (medido 2026-08-28, 35 callouts em
 *  3 artigos × 5 locales).
 *
 *  Cada caso roda o MESMO pipeline do site (`compileMDX` + os plugins do
 *  lib/content/mdx-loader.ts), e o primeiro é o CONTROLE POSITIVO: sem o plugin o
 *  marcador TEM de vazar. Teste que passa nos dois braços não estaria medindo nada.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

async function renderizar(fonte: string, comPlugin: boolean): Promise<string> {
  const { content } = await compileMDX({
    source: fonte,
    components: {},
    options: {
      parseFrontmatter: false,
      mdxOptions: { remarkPlugins: comPlugin ? [remarkGfm, remarkCallouts] : [remarkGfm] },
    },
  });
  return renderToStaticMarkup(content as ReactElement);
}

const NOTA = '> [!NOTE]\n> Corpo do aviso, primeira linha.\n';
const IMPORTANTE = '> [!IMPORTANT]\n> **Por que isso importa.** O argumento central.\n';

describe('callouts do GitHub no corpo MDX', () => {
  it('CONTROLE POSITIVO: sem o plugin, o marcador vaza para o leitor', async () => {
    expect(await renderizar(NOTA, false)).toContain('[!NOTE]');
  });

  it('com o plugin, o marcador some e o blockquote ganha a classe do tipo', async () => {
    const html = await renderizar(NOTA, true);
    expect(html).not.toContain('[!');
    expect(html).toContain('class="callout callout-note"');
    expect(html).toContain('Corpo do aviso, primeira linha.');
  });

  it('corpo que começa em negrito sobrevive inteiro', async () => {
    // A quebra depois do marcador é suave: o `\n` mora no mesmo nó de texto. Cortar
    // filhos em vez do valor apagaria a primeira linha — este caso é o que denuncia.
    const html = await renderizar(IMPORTANTE, true);
    expect(html).not.toContain('[!');
    expect(html).toContain('class="callout callout-important"');
    expect(html).toContain('<strong>Por que isso importa.</strong>');
    expect(html).toContain('O argumento central.');
  });

  it('marcador seguido de linha `>` vazia não deixa parágrafo órfão', async () => {
    // Forma válida no GitHub e diferente da quebra suave: aqui são DOIS parágrafos, e o
    // primeiro fica vazio depois do corte. `<p></p>` com margem do prose = buraco visível.
    const html = await renderizar('> [!NOTE]\n>\n> Corpo depois da linha vazia.\n', true);
    expect(html).not.toContain('[!');
    expect(html).not.toContain('<p></p>');
    expect(html).toContain('class="callout callout-note"');
    expect(html).toContain('Corpo depois da linha vazia.');
  });

  it('marcador na mesma linha do corpo NÃO é callout — a regra é a do GitHub', async () => {
    const html = await renderizar('> [!NOTE] Isto é uma linha só.\n', true);
    expect(html).toContain('[!NOTE]');
    expect(html).not.toContain('callout');
  });
});

/**
 * O gate acima prova o mecanismo; este prova o ACERVO. Marcador escrito fora da
 * forma estrita (caixa trocada, texto na mesma linha, tipo inexistente) não vira
 * callout e volta a vazar — aqui, e não na página publicada.
 */
describe('acervo publicado', () => {
  const DIR = resolve(import.meta.dirname, '../../content/artigos');
  const ESTRITO = /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]$/;

  const suspeitas = readdirSync(DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      readdirSync(join(DIR, d.name))
        .filter((f) => f.endsWith('.mdx'))
        .flatMap((f) => {
          const caminho = join(DIR, d.name, f);
          return readFileSync(caminho, 'utf8')
            .split('\n')
            .map((linha, i) => ({ arquivo: `${d.name}/${f}`, n: i + 1, linha }))
            .filter(({ linha }) => linha.includes('[!') && !ESTRITO.test(linha));
        }),
    );

  it('todo `[!` do acervo está na forma estrita do callout', () => {
    expect(suspeitas.map((s) => `${s.arquivo}:${s.n} ${s.linha}`)).toEqual([]);
  });
});
