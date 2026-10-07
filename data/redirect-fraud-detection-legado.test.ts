/**
 * Trava a remoção de 2026-09-22: a página legada `2025-fraud-detection-mlp` saiu do ar e a sua URL
 * (nos 5 locales) e o PDF que o Google tinha indexado redirecionam, em caráter permanente, para a
 * obra real derivada do mesmo material, `operating-point-dominance` (registro em data/research.ts).
 *
 * Por que redirect e não 404: o ORCID do autor (obra 202629307) e o índice do Google apontavam para
 * a URL legada. `permanent: true` no Next responde 308 — o Google o trata como o 301.
 * Auditoria: /Users/ulissesflores/Developer/publicacoes-recuperacao/PUBLICACOES-STATE.md (2026-09-22).
 */

import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import nextConfig from '../next.config';
import { findResearchPaper } from '@/data/research';

const ROOT = resolve(import.meta.dirname, '..');
const LEGADO = '2025-fraud-detection-mlp';
const DESTINO_PAGINA = '/research/operating-point-dominance';
const DESTINO_PDF = '/research/operating-point-dominance/operating-point-dominance.pdf';

type Redirect = { source: string; destination: string; permanent: boolean };

async function redirects(): Promise<Redirect[]> {
  const lista = await nextConfig.redirects!();
  return lista as Redirect[];
}

describe(`remoção da página legada ${LEGADO}`, () => {
  it('o destino do redirect existe: paper registrado e PDF em public/', () => {
    expect(findResearchPaper('operating-point-dominance')).toBeDefined();
    expect(existsSync(resolve(ROOT, 'public', DESTINO_PDF.slice(1)))).toBe(true);
  });

  it('nenhum corpo legado continua em disco', () => {
    expect(existsSync(resolve(ROOT, 'content/publications', LEGADO))).toBe(false);
    expect(existsSync(resolve(ROOT, 'data/research/articles', LEGADO))).toBe(false);
  });

  it('a URL da página (sem locale e com locale) redireciona em caráter permanente para o paper', async () => {
    const lista = await redirects();
    const semLocale = lista.find((r) => r.source === `/research/${LEGADO}`);
    const comLocale = lista.find((r) => r.source === `/:locale(en|es|it|he)/research/${LEGADO}`);
    expect(semLocale, 'falta o redirect da rota sem locale').toBeDefined();
    expect(comLocale, 'falta o redirect da rota com locale').toBeDefined();
    expect(semLocale!.destination).toBe(DESTINO_PAGINA);
    expect(comLocale!.destination).toBe(`/:locale${DESTINO_PAGINA}`);
    expect(semLocale!.permanent).toBe(true);
    expect(comLocale!.permanent).toBe(true);
  });

  it('o PDF que o Google tinha indexado (e o caminho legado do PDF) redirecionam para o PDF do paper', async () => {
    const lista = await redirects();
    for (const source of [`/deep-research/${LEGADO}/deep-research.pdf`, `/research/${LEGADO}.pdf`]) {
      const r = lista.find((x) => x.source === source);
      expect(r, `falta o redirect de ${source}`).toBeDefined();
      expect(r!.destination).toBe(DESTINO_PDF);
      expect(r!.permanent).toBe(true);
    }
  });
});
