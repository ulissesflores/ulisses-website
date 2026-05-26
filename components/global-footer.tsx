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
      <div className='max-w-6xl mx-auto px-6 py-6 text-xs text-neutral-400 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <p>{common.footer.tagline}</p>
        <nav className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          {common.footer.links.map((l) => (
            <Link key={l.href} href={localePath(l.href)} className='hover:text-emerald-200 transition-colors'>
              {l.label}
            </Link>
          ))}
          <Link href={localePath('/identidade')} rel='author' className='text-emerald-300 hover:text-emerald-200 transition-colors'>
            {common.footer.identityLink}
          </Link>
          <a href='https://orcid.org/0000-0002-6034-7765' rel='me noopener' target='_blank' className='hover:text-emerald-200 transition-colors'>
            {common.footer.orcid}
          </a>
        </nav>
      </div>
    </footer>
  );
}
