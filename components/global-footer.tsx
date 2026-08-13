'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDict } from '@/lib/i18n-context';
import { defaultLocale } from '@/data/i18n';

/* `brandName` por prop do layout — ver a nota em components/global-header.tsx. */
export function GlobalFooter({ brandName }: { brandName: string }) {
  const { common, locale } = useDict();

  const localePath = (href: string) => {
    if (!href.startsWith('/') || href.startsWith('/#')) return href;
    if (locale === defaultLocale) return href;
    return `/${locale}${href}`;
  };

  return (
    <footer className='border-t border-brand-gold/20 bg-brand-navy-deep'>
      <div className='max-w-6xl mx-auto px-6 py-7 text-xs text-brand-offwhite/70 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3'>
          {/* Símbolo decorativo: o nome ao lado já é o texto. */}
          <Image src='/brand/symbol-gold.png' alt='' width={184} height={168} className='h-7 w-auto' />
          <span className='font-display uppercase tracking-[0.16em] text-brand-offwhite/85'>
            {brandName}
          </span>
        </div>
        <p>{common.footer.tagline}</p>
        <nav className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          {common.footer.links.map((l) => (
            <Link key={l.href} href={localePath(l.href)} className='hover:text-brand-gold-light transition-colors'>
              {l.label}
            </Link>
          ))}
          <Link href={localePath('/identidade')} rel='author' className='text-brand-gold hover:text-brand-gold-light transition-colors'>
            {common.footer.identityLink}
          </Link>
          <a href='https://orcid.org/0000-0002-6034-7765' rel='me noopener' target='_blank' className='hover:text-brand-gold-light transition-colors'>
            {common.footer.orcid}
          </a>
        </nav>
      </div>
    </footer>
  );
}
