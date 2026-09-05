/**
 * ══════════════════════════════════════════════════════════════════════
 * Callouts do GitHub (`> [!NOTE]`) — o remark-gfm não os implementa
 * ══════════════════════════════════════════════════════════════════════
 *
 * O GitHub renderiza `> [!NOTE]` como caixa de destaque, mas isso está FORA
 * da spec do GFM. O `remark-gfm` traz tabela, footnote, strikethrough,
 * autolink e task-list — e não toca no marcador, que por isso chegava ao
 * leitor como texto literal dentro do blockquote (35 callouts em 3 artigos ×
 * 5 locales, dois deles já publicados; medido em 2026-08-28).
 *
 * A escada de reuso parou aqui: nenhum plugin instalado resolve, e a
 * transformação cabe numa varredura dos blockquotes. O marcador sai do texto
 * e vira `className`, que o `remark-rehype` de dentro do MDX repassa como
 * prop do `<blockquote>`; a aparência mora em `app/globals.css`.
 *
 * Regra do marcador = a do GitHub: `[!TIPO]` SOZINHO na primeira linha.
 * `> [!NOTE] texto` não é callout lá e não é aqui — callout escrito errado
 * continua visível como erro, em vez de engolir a primeira linha do corpo.
 */

import type { Blockquote, Root, RootContent } from 'mdast';

/** Os cinco do GitHub — os mesmos do vocabulário da casa em `~/.claude/AGENTS.md`. */
const TIPOS = ['note', 'tip', 'important', 'warning', 'caution'] as const;

/**
 * A quebra de linha depois do marcador é SUAVE: o remark não gera nó `break`,
 * deixa o `\n` dentro do mesmo nó de texto (`"[!NOTE]\nCorpo…"`). Por isso o
 * corte é por regex no valor, e não descarte de filhos — descartar apagaria a
 * primeira linha do corpo.
 */
const MARCADOR = new RegExp(`^\\[!(${TIPOS.join('|')})\\](?:\\n|$)`, 'i');

export function remarkCallouts() {
  return (tree: Root): void => {
    varrerBlockquotes(tree.children, (bq) => {
      const primeiro = bq.children[0];
      if (primeiro?.type !== 'paragraph') return;

      const texto = primeiro.children[0];
      if (texto?.type !== 'text') return;

      const achado = MARCADOR.exec(texto.value);
      if (!achado) return;

      texto.value = texto.value.slice(achado[0].length);
      // `> [!IMPORTANT]` seguido de `**negrito**` deixa o nó de texto vazio; sem
      // isso sobra um nó sem conteúdo antes do negrito.
      if (texto.value === '') primeiro.children.shift();
      // Marcador seguido de linha `>` VAZIA — forma válida no GitHub — não é quebra
      // suave: são DOIS parágrafos. Sem isto o primeiro fica sem filho nenhum e vira
      // um `<p></p>` com a margem do prose, ou seja, um buraco no topo do callout.
      if (primeiro.children.length === 0) bq.children.shift();

      bq.data = {
        ...bq.data,
        hProperties: { className: `callout callout-${achado[1].toLowerCase()}` },
      };
    });
  };
}

/** Recursão própria: `unist-util-visit` só existe aqui como dependência transitiva. */
function varrerBlockquotes(nos: RootContent[], fn: (bq: Blockquote) => void): void {
  for (const no of nos) {
    if (no.type === 'blockquote') fn(no);
    if ('children' in no) varrerBlockquotes(no.children as RootContent[], fn);
  }
}
