'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

/**
 * Atribuição por SKU do cartão físico.
 *
 * Os encurtadores gravados no QR e no chip NFC (`u.sn/QP` `QE` `NP` `NE`) redirecionam
 * para `/c?src=QP`, e é este componente que transforma isso em dado. Sem ele, os quatro
 * SKUs são indistinguíveis e não há como saber se o cartão de papel ou o NFC produz
 * contato — o único funil físico mensurável que o site tem.
 *
 * Lê a query no CLIENTE de propósito: `searchParams` no servidor tornaria a `/c`
 * dinâmica, que é exatamente o defeito que o resto do site acabou de deixar para trás.
 */
export function CardSourceTracker() {
  useEffect(() => {
    const src = new URLSearchParams(window.location.search).get('src');
    if (!src) return;
    // Aceita só o vocabulário conhecido — evita virar sink de string arbitrária de URL.
    if (!/^[A-Z]{2}$/.test(src)) return;
    track('card_scan', { src });
  }, []);

  return null;
}
