'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🛡️  Global Error Boundary — Root Layout Crash Recovery (Lote 23)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Catches errors that occur in the root layout itself (Server Component crash).
 *  Must render its own <html>/<body> since the layout failed.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='pt-BR'>
      <body style={{ margin: 0, backgroundColor: '#0a0a0a', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <main style={{ maxWidth: '28rem', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
            <div style={{
              margin: '0 auto 1.5rem',
              display: 'flex',
              height: '4rem',
              width: '4rem',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              <AlertTriangle size={32} color='#f87171' />
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
              Erro Crítico
            </h1>
            <p style={{ color: '#a3a3a3', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              O layout principal falhou. Isto não deveria acontecer.
            </p>
            {error.digest && (
              <p style={{ color: '#525252', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '2rem' }}>
                Digest: {error.digest}
              </p>
            )}

            <button
              onClick={reset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #404040',
                backgroundColor: 'rgba(23, 23, 23, 0.6)',
                padding: '0.75rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#e5e5e5',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} />
              Recarregar
            </button>
          </main>
        </div>
      </body>
    </html>
  );
}
