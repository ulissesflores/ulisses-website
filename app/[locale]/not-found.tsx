'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, BookOpen, Shield, FlaskConical } from 'lucide-react';
import { common as ptBrCommon } from '@/data/i18n/pt-br/common';
import { common as enCommon } from '@/data/i18n/en/common';
import { common as esCommon } from '@/data/i18n/es/common';
import { common as itCommon } from '@/data/i18n/it/common';
import { common as heCommon } from '@/data/i18n/he/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictMap: Record<string, any> = {
  'pt-br': ptBrCommon,
  en: enCommon,
  es: esCommon,
  it: itCommon,
  he: heCommon,
};

const iconMap = { Home, BookOpen, Shield, FlaskConical } as const;

/**
 * Client component on purpose. Detecting the locale on the server would need
 * `headers()`, and a dynamic API inside `not-found.tsx` opts the WHOLE `[locale]`
 * subtree — every page of the site — out of static rendering (measured 2026-07-30:
 * 0 of 23 pages prerendered, `x-vercel-cache: MISS` on every request). `usePathname()`
 * costs one small chunk on the 404 route alone and reads the locale from the URL that
 * was actually requested, which is strictly more reliable than the `referer` it
 * replaces — that one returned pt-BR for `/en/...` whenever there was no referer.
 */
export default function NotFound() {
  const pathname = usePathname() || '/';
  const match = pathname.match(/^\/(en|es|it|he)(\/|$)/);
  const locale = match?.[1] || 'pt-br';
  const common = dictMap[locale] || ptBrCommon;
  const t = common.notFound;

  const prefix = locale !== 'pt-br' ? `/${locale}` : '';

  const quickLinks = [
    { ...t.links.home, href: `${prefix}/`, icon: 'Home' as const },
    { ...t.links.publications, href: `${prefix}/research`, icon: 'BookOpen' as const },
    { ...t.links.identity, href: `${prefix}/identidade`, icon: 'Shield' as const },
    { ...t.links.simulations, href: `${prefix}/simulacoes`, icon: 'FlaskConical' as const },
  ];

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#10b98108,transparent)] pointer-events-none' />

      <main className='relative max-w-2xl mx-auto px-6 py-20 text-center z-10'>
        <p className='text-7xl font-bold text-emerald-500 mb-4'>404</p>
        <h1 className='text-3xl font-bold text-white mb-3'>{t.title}</h1>
        <p className='text-neutral-400 mb-10 max-w-md mx-auto'>
          {t.description}
        </p>

        <div className='grid gap-3 sm:grid-cols-2 mb-10'>
          {quickLinks.map((link) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            return (
              <Link
                key={link.href}
                href={link.href}
                className='flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 px-5 py-4 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors text-start'
              >
                <Icon size={20} className='text-emerald-500 shrink-0' />
                <div>
                  <p className='text-sm font-medium text-neutral-200'>{link.label}</p>
                  <p className='text-xs text-neutral-400'>{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className='flex items-center gap-2 justify-center text-sm text-neutral-400'>
          <Search size={14} />
          <span>{t.searchHint}</span>
        </div>
      </main>
    </div>
  );
}
