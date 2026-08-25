/**
 * ══════════════════════════════════════════════════════════════════════
 * ArticleFigure — imagem de evidência com legenda e procedência
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/article-figure.tsx` + registro em
 * `lib/content/mdx-components.tsx`.
 *
 * Para o frame de vídeo, a captura de tela, o print do placar — a imagem
 * que PROVA alguma coisa no corpo do artigo, e por isso precisa carregar
 * legenda e procedência junto, não solta como `![]()`.
 *
 * ARQUIVO EM `public/`, NUNCA em `content/`: o `mdx-loader` lê o .mdx do
 * disco, mas `content/` não é servido pelo Next — imagem colocada ao lado
 * do .mdx dá 404 (o `hero.png` de `marca-dagua-claude` é justamente isso,
 * um asset morto). Convenção: `public/artigos/<slug>/<arquivo>`.
 *
 * `width`/`height` chegam como STRING do .mdx (o `compileMDX` só entrega
 * atributo string) e viram número aqui — o `next/image` precisa deles para
 * reservar o espaço e não empurrar o texto quando a imagem carrega. São as
 * dimensões REAIS do arquivo; `sips -g pixelWidth -g pixelHeight <arq>`.
 *
 * `alt` descreve o que a imagem prova, não "foto de ..." — e é o único
 * texto, junto de `caption`/`credit`, que muda por locale.
 */

import Image from 'next/image';

interface ArticleFigureProps {
  /** Caminho a partir de `public/` — ex.: `/artigos/<slug>/frame.jpg`. */
  src: string;
  /** O que a imagem prova, para quem não a vê. */
  alt: string;
  /** Largura real do arquivo em pixels (string vinda do .mdx). */
  width: string;
  /** Altura real do arquivo em pixels (string vinda do .mdx). */
  height: string;
  /** Legenda visível. */
  caption?: string;
  /** Procedência/crédito, em linha menor abaixo da legenda. */
  credit?: string;
}

export function ArticleFigure({ src, alt, width, height, caption, credit }: ArticleFigureProps) {
  return (
    <figure className='my-10 not-prose'>
      <Image
        src={src}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        className='h-auto w-full rounded-lg border border-white/10 bg-neutral-900/60'
      />
      {caption ? (
        <figcaption className='mt-3 text-sm leading-relaxed text-neutral-400'>
          {caption}
          {credit ? <span className='mt-1 block text-xs text-neutral-500'>{credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
