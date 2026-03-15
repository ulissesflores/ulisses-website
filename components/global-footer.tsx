'use client';

import Link from 'next/link';
import { useDict } from '@/lib/i18n-context';
import { defaultLocale } from '@/data/i18n';

export function GlobalFooter() {
  const { common, locale } = useDict();

  const localePath = (href: string) => {
    if (!href.startsWith('/') || href.startsWith('/#')) return href;
    if (locale === defaultLocale) return href;
    return `/${locale}${href}`;
  };

  return (
    <footer className='border-t border-white/10 bg-neutral-950/90'>
      <div className='max-w-6xl mx-auto px-6 py-5 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-3'>
        <p>{common.footer.tagline}</p>
        <Link href={localePath('/identidade')} rel='author' className='text-emerald-300 hover:text-emerald-200 transition-colors'>
          {common.footer.identityLink}
        </Link>
      </div>
    </footer>
  );
}
