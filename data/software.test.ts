import { describe, it, expect } from 'vitest';
import { researchPapers } from './research';
import { software, softwareCounts, softwareMeasuredAt } from './software';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🧰 Software com DOI — o registro que fica FORA das publicações
 * ───────────────────────────────────────────────────────────────────────────────
 *  Software nunca entra na lista de artigos (docs/07 do projeto publicacoes-recuperacao): tem
 *  versão e estado, não data e texto. O que este gate trava: DOI de conceito e de versão são
 *  DOIs reais do autor (7-8 dígitos) e distintos entre si; nenhum repositório aparece duas vezes,
 *  nem como paper e software ao mesmo tempo; o estado de manutenção é o que a regra dá para a
 *  data de medição, não uma opinião.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const DOI = /^10\.5281\/zenodo\.\d{7,8}$/;
const ACTIVE_WINDOW_DAYS = 183;

function daysBetween(a: string, b: string): number {
  return Math.floor((new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime()) / 86_400_000);
}

describe('data/software.ts — repositórios com DOI', () => {
  it('tem 11 itens, repositórios únicos, nenhum deles registrado como paper', () => {
    expect(software.length).toBe(11);
    expect(new Set(software.map((s) => s.repo)).size).toBe(11);
    const paperRepos = new Set(researchPapers.map((p) => p.repository));
    expect(software.filter((s) => paperRepos.has(s.url)).map((s) => s.repo)).toEqual([]);
  });

  it('DOI de conceito e de versão: formato real, distintos, únicos entre os itens', () => {
    for (const s of software) {
      expect(s.conceptDoi, s.repo).toMatch(DOI);
      expect(s.versionDoi, s.repo).toMatch(DOI);
      expect(s.conceptDoi, `${s.repo}: conceito igual à versão`).not.toBe(s.versionDoi);
    }
    const all = software.flatMap((s) => [s.conceptDoi, s.versionDoi]);
    expect(new Set(all).size).toBe(all.length);
  });

  it('a contagem impressa bate com o registro', () => {
    const c = softwareCounts();
    expect(c.total).toBe(11);
    expect(c.withDoi).toBe(11);
    expect(c.active).toBe(software.filter((s) => s.maintenance === 'active').length);
  });

  it('estado de manutenção segue a regra dos 183 dias na data da medição', () => {
    expect(softwareMeasuredAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const s of software) {
      expect(s.pushedAt, s.repo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.releasedAt, s.repo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const age = daysBetween(s.pushedAt, softwareMeasuredAt);
      expect(age, `${s.repo}: push depois da medição`).toBeGreaterThanOrEqual(0);
      if (s.maintenance !== 'archived') {
        expect(s.maintenance, `${s.repo}: ${age} dias`).toBe(age <= ACTIVE_WINDOW_DAYS ? 'active' : 'minimal');
      }
    }
  });

  it('versão, licença, linguagem e URL do GitHub preenchidos; companheiro aponta para o site ou DOI', () => {
    for (const s of software) {
      expect(s.version, s.repo).toMatch(/^\d+\.\d+\.\d+/);
      expect(s.license, s.repo).toBeTruthy();
      expect(s.language, s.repo).toBeTruthy();
      expect(s.url, s.repo).toBe(`https://github.com/ulissesflores/${s.repo}`);
      if (s.companion) {
        expect(s.companion.url).toMatch(/^https:\/\/(ulissesflores\.com|doi\.org)\//);
        expect(s.companion.label).toBeTruthy();
      }
    }
  });
});
