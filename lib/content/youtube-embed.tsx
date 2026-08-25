/**
 * ══════════════════════════════════════════════════════════════════════
 * YouTube — vídeo embutido em modo privacy-enhanced (youtube-nocookie)
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/youtube-embed.tsx` + registro em
 * `lib/content/mdx-components.tsx`.
 *
 * `youtube-nocookie.com` e não `youtube.com`: o domínio padrão grava
 * cookie de rastreamento antes mesmo do play. O CSP em `next.config.ts`
 * já libera os dois em `frame-src` (herança das páginas de sermão), então
 * o embed não pede header novo.
 *
 * `title` é OBRIGATÓRIO: iframe sem nome acessível é violação `frame-title`
 * (serious) no axe — o mesmo gate que pegou a tabela rolável em 2026-07-30.
 *
 * Props são STRING por contrato do `compileMDX`, que só entrega atributo
 * string vindo do .mdx: expressão no corpo chega `undefined`. Por isso
 * nada de número aqui — nem `width`, nem `start`.
 *
 * 16:9 por `aspect-video` do Tailwind, sem o truque do padding-bottom.
 */

interface YouTubeProps {
  /** ID do vídeo — o que vem depois de `v=`, nunca a URL inteira. */
  id: string;
  /** Nome acessível do iframe. Obrigatório. */
  title: string;
  /** Legenda visível abaixo do vídeo. */
  caption?: string;
}

export function YouTube({ id, title, caption }: YouTubeProps) {
  return (
    <figure className='my-10 not-prose'>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading='lazy'
        referrerPolicy='strict-origin-when-cross-origin'
        allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        className='aspect-video w-full rounded-lg border border-white/10 bg-neutral-900/60'
      />
      {caption ? (
        <figcaption className='mt-3 text-sm leading-relaxed text-neutral-400'>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
