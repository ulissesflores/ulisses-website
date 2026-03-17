'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  ⚠️  Error Boundary — Graceful Degradation (Lote 23)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Captura erros em páginas dentro do layout [locale].
 *  'use client' obrigatório — Error Boundaries são Client Components (React).
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Error Boundary]', error);
  }, [error]);

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#ef444408,transparent)] pointer-events-none' />

      <main className='relative max-w-lg mx-auto px-6 py-20 text-center z-10'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20'>
          <AlertTriangle size={32} className='text-red-400' />
        </div>

        <h1 className='text-2xl font-bold text-white mb-3'>
          Algo deu errado
        </h1>
        <p className='text-neutral-400 mb-2 text-sm'>
          Um erro inesperado ocorreu ao renderizar esta página.
        </p>
        {error.digest && (
          <p className='text-neutral-600 text-xs font-mono mb-8'>
            Digest: {error.digest}
          </p>
        )}

        <div className='flex gap-3 justify-center'>
          <button
            onClick={reset}
            className='flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/60 px-5 py-3 text-sm font-medium hover:border-emerald-500/40 hover:text-emerald-300 transition-colors'
          >
            <RotateCcw size={16} />
            Tentar novamente
          </button>
          <Link
            href='/'
            className='flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/60 px-5 py-3 text-sm font-medium hover:border-emerald-500/40 hover:text-emerald-300 transition-colors'
          >
            <Home size={16} />
            Início
          </Link>
        </div>
      </main>
    </div>
  );
}
