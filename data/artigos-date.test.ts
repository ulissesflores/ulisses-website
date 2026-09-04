import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';
import { artigos } from './artigos';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  📅 A data de um artigo vive em SEIS lugares — este gate obriga os seis a concordar
 * ───────────────────────────────────────────────────────────────────────────────
 *  `date` está em `data/artigos.ts` e no frontmatter dos até cinco
 *  `content/artigos/<slug>/index.<locale>.mdx`. Nada obrigava as cópias a bater:
 *  em 04/09/2026 um `sed` sem endereço trocou `date` em TODAS as ocorrências de
 *  `data/artigos.ts` e mudou, calada, a data de um artigo já publicado —
 *  `sota:full` passou 10/10 e o defeito só apareceu na revisão humana.
 *
 *  O frontmatter é a testemunha: o `sed` mexeu no registro e não nos `.mdx`, então
 *  divergência entre as cópias é exatamente a assinatura do acidente. Mudar a data
 *  de propósito continua possível — só que tem de tocar os seis lugares.
 *
 *  Ninguém mais compara as cópias: `i18n:parity` olha ESTRUTURA entre locales, não frontmatter.
 *  E a data só é exercitada no `next build` — `artigoDateToIso` (`data/artigos.ts:1133`) faz
 *  `new Date(...).toISOString()`, que em data impossível LANÇA `RangeError` no meio da geração
 *  estática. O segundo teste traz essa falha para os 3 s do `sota:check`, com o slug no nome.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const ARTIGOS_DIR = resolve(import.meta.dirname, '../content/artigos');

/** Uma linha por cópia da data: o registro em `data/artigos.ts` vs. cada `.mdx` do slug. */
const copias = artigos.flatMap((artigo) => {
  const dir = join(ARTIGOS_DIR, artigo.slug);
  if (!existsSync(dir)) {
    return [{ slug: artigo.slug, arquivo: '(pasta ausente)', registro: artigo.date, mdx: '(sem pasta)' }];
  }
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((arquivo) => ({
      slug: artigo.slug,
      arquivo,
      registro: artigo.date,
      mdx: String(matter(readFileSync(join(dir, arquivo), 'utf-8')).data.date ?? '(sem date)'),
    }));
});

describe('Data dos artigos', () => {
  it('todo frontmatter repete a data de `data/artigos.ts`', () => {
    const divergentes = copias
      .filter((c) => c.mdx !== c.registro)
      .map((c) => `${c.slug}/${c.arquivo}: artigos.ts='${c.registro}' mdx='${c.mdx}'`);
    expect(divergentes).toEqual([]);
  });

  it('toda data é ISO `YYYY-MM-DD` de calendário real', () => {
    const invalidas = artigos
      .filter(({ date }) => {
        // `toISOString()` de data inválida NÃO devolve — lança; daí o teste do NaN antes.
        const d = new Date(`${date}T00:00:00Z`);
        return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date;
      })
      .map(({ slug, date }) => `${slug}: '${date}'`);
    expect(invalidas).toEqual([]);
  });
});
