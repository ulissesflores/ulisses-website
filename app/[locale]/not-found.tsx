import Link from 'next/link';
import { Home, Search, BookOpen, Shield, FlaskConical } from 'lucide-react';
import { common as commonDict } from '@/data/i18n/pt-br/common';

const iconMap = { Home, BookOpen, Shield, FlaskConical } as const;

export default function NotFound() {
  const t = commonDict.notFound;

  const quickLinks = [
    { ...t.links.home, href: '/', icon: 'Home' as const },
    { ...t.links.publications, href: '/research', icon: 'BookOpen' as const },
    { ...t.links.identity, href: '/identidade', icon: 'Shield' as const },
    { ...t.links.simulations, href: '/simulacoes', icon: 'FlaskConical' as const },
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
            const Icon = iconMap[link.icon];
            return (
              <Link
                key={link.href}
                href={link.href}
                className='flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 px-5 py-4 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors text-left'
              >
                <Icon size={20} className='text-emerald-500 shrink-0' />
                <div>
                  <p className='text-sm font-medium text-neutral-200'>{link.label}</p>
                  <p className='text-xs text-neutral-500'>{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className='flex items-center gap-2 justify-center text-sm text-neutral-500'>
          <Search size={14} />
          <span>{t.searchHint}</span>
        </div>
      </main>
    </div>
  );
}
