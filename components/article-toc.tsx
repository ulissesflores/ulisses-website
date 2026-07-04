'use client';

import { useEffect, useState } from 'react';

interface TocSection {
  id: string;
  label: string;
}

interface ArticleTocProps {
  sections: TocSection[];
  title: string;
}

/**
 * Índice de artigo (TOC) com scroll-spy via IntersectionObserver.
 * - Desktop: sidebar sticky (renderizada lateralmente pelo template).
 * - Mobile: <details> colapsável nativo (acessível por teclado, sem focus-trap custom).
 * - aria-current no link da seção ativa; foco no heading-alvo ao navegar.
 * - RTL-safe: classes lógicas (border-s, ps), eixo de scroll é vertical (block).
 */
export function ArticleToc({ sections, title }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const focusHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  };

  const list = (
    <ol className='space-y-1.5 text-sm'>
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={activeId === s.id ? 'location' : undefined}
            onClick={() => focusHeading(s.id)}
            className={`block border-s-2 ps-3 py-1 leading-snug transition-colors ${
              activeId === s.id
                ? 'border-emerald-500 text-emerald-400 font-medium'
                : 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600'
            }`}
          >
            {s.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Desktop: sidebar (o sticky vive no wrapper flex-item do template —
          aqui dentro ele não teria altura pra viajar, por causa do items-start) */}
      <nav aria-label={title} className='hidden lg:block'>
        <p className='text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold mb-3'>{title}</p>
        {list}
      </nav>

      {/* Mobile: colapsável nativo (teclado/Esc nativos) */}
      <details className='lg:hidden rounded-xl border border-neutral-800 bg-neutral-900/40'>
        <summary className='cursor-pointer px-4 py-3 text-sm font-semibold text-neutral-200 select-none'>
          {title}
        </summary>
        <nav aria-label={title} className='px-4 pb-4'>
          {list}
        </nav>
      </details>
    </>
  );
}
