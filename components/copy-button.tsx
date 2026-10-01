'use client';

import { useState } from 'react';

/**
 * Copia um texto para a área de transferência e confirma em `aria-live`.
 * Sem clipboard (contexto inseguro, permissão negada) o botão diz que não copiou
 * em vez de fingir; o texto continua visível ao lado para seleção manual.
 */
export function CopyButton({ text, label, doneLabel, failLabel }: { text: string; label: string; doneLabel: string; failLabel: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'fail'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('done');
    } catch {
      setState('fail');
    }
    setTimeout(() => setState('idle'), 2500);
  }

  return (
    <span className='inline-flex items-center gap-3'>
      <button
        type='button'
        onClick={copy}
        className='rounded-md border border-brand-gold/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold-light transition-colors hover:bg-brand-gold/10'
      >
        {label}
      </button>
      <span className='text-xs text-neutral-400' aria-live='polite'>
        {state === 'done' ? doneLabel : state === 'fail' ? failLabel : ''}
      </span>
    </span>
  );
}
