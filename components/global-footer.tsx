'use client';

import Link from 'next/link';
import { useDict } from '@/lib/i18n-context';

export function GlobalFooter() {
  const { common } = useDict();

  return (
    <footer className='border-t border-white/10 bg-neutral-950/90'>
      <div className='max-w-6xl mx-auto px-6 py-5 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-3'>
        <p>{common.footer.tagline}</p>
        <Link href='/identidade' rel='author' className='text-emerald-300 hover:text-emerald-200 transition-colors'>
          {common.footer.identityLink}
        </Link>
      </div>
    </footer>
  );
}
