import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  formatCitation,
  paperLanguageAlternates,
  plainAbstract,
  researchPapers,
  scholarDate,
} from './research';
import { localeToHreflang, supportedLocales } from './i18n';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  📄 Papers com corpo na página — o gate que impede o metadado de afirmar o que a página não mostra
 * ───────────────────────────────────────────────────────────────────────────────
 *  Este site já publicou 18 obras com DOI montado por padrão (17 eram de terceiros) e PDFs que não
 *  eram os artigos. O registro `data/research.ts` nasceu para o oposto: cada campo aponta para um
 *  arquivo que existe. Estas asserções travam isso — corpo por locale, PDF no mesmo subdiretório e
 *  abaixo do teto do Scholar, DOI no formato dos DOIs reais do autor (7-8 dígitos, nunca os 6 do
 *  padrão fabricado), `hreflang` só nos locales com corpo.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const ROOT = join(import.meta.dirname, '..');
const PDF_MAX_BYTES = 5 * 1024 * 1024;

describe('data/research.ts — registro dos papers', () => {
  it('tem 4 papers com slugs únicos', () => {
    expect(researchPapers.length).toBe(4);
    expect(new Set(researchPapers.map((p) => p.slug)).size).toBe(4);
  });

  it('todo locale em `bodies` tem corpo em content/research/<slug>/, e o original está entre eles', () => {
    const faltando = researchPapers.flatMap((p) =>
      p.bodies
        .filter((locale) => !existsSync(join(ROOT, 'content/research', p.slug, `index.${locale}.mdx`)))
        .map((locale) => `${p.slug}: ${locale}`),
    );
    expect(faltando).toEqual([]);
    for (const p of researchPapers) {
      expect(p.bodies, p.slug).toContain(p.language);
      expect(new Set(p.bodies).size).toBe(p.bodies.length);
    }
  });

  it('nenhum corpo existe em disco sem estar declarado em `bodies` (metadado só do que mostra)', () => {
    const sobrando = researchPapers.flatMap((p) =>
      supportedLocales
        .filter((locale) => !p.bodies.includes(locale))
        .filter((locale) => existsSync(join(ROOT, 'content/research', p.slug, `index.${locale}.mdx`)))
        .map((locale) => `${p.slug}: ${locale}`),
    );
    expect(sobrando).toEqual([]);
  });

  it('o frontmatter de cada corpo concorda com o registro (slug, título por locale, data)', () => {
    for (const p of researchPapers) {
      for (const locale of p.bodies) {
        const raw = readFileSync(join(ROOT, 'content/research', p.slug, `index.${locale}.mdx`), 'utf8');
        expect(raw, `${p.slug} ${locale}`).toMatch(new RegExp(`^slug: ${p.slug}$`, 'm'));
        expect(raw, `${p.slug} ${locale}`).toMatch(new RegExp(`^date: '${p.publishedAt}'$`, 'm'));
        expect(raw, `${p.slug} ${locale}`).toMatch(/^category: research$/m);
        if (locale === p.language) {
          expect(raw, `${p.slug} título`).toContain(p.title.replaceAll("'", "''").slice(0, 40));
        }
      }
    }
  });

  it('resumo e palavras-chave só nos locales com corpo', () => {
    for (const p of researchPapers) {
      expect(p.abstracts[p.language], `${p.slug} sem resumo no original`).toBeTruthy();
      for (const locale of Object.keys(p.abstracts)) {
        expect(p.bodies, `${p.slug} resumo em ${locale} sem corpo`).toContain(locale);
      }
      for (const locale of Object.keys(p.keywords)) {
        expect(p.bodies, `${p.slug} palavras-chave em ${locale} sem corpo`).toContain(locale);
        expect(p.keywords[locale as keyof typeof p.keywords]?.length).toBeGreaterThan(0);
      }
    }
  });

  it('PDF espelho: existe, no mesmo subdiretório da página, até 5 MB, com tamanho igual ao declarado', () => {
    for (const p of researchPapers) {
      for (const [locale, pdf] of Object.entries(p.pdf ?? {})) {
        const file = join(ROOT, 'public', pdf.path);
        expect(existsSync(file), `${p.slug} ${locale}: ${pdf.path}`).toBe(true);
        expect(pdf.path.startsWith(`/research/${p.slug}/`), `${p.slug} ${locale}: PDF fora do subdiretório`).toBe(true);
        const bytes = statSync(file).size;
        expect(bytes, `${p.slug} ${locale}: bytes`).toBe(pdf.bytes);
        expect(bytes).toBeLessThanOrEqual(PDF_MAX_BYTES);
        expect(pdf.pages).toBeGreaterThan(0);
        expect(p.bodies, `${p.slug}: PDF em ${locale} sem corpo`).toContain(locale);
      }
    }
  });

  it('figuras referenciadas nos corpos existem em public/', () => {
    const faltando: string[] = [];
    for (const p of researchPapers) {
      for (const locale of p.bodies) {
        const raw = readFileSync(join(ROOT, 'content/research', p.slug, `index.${locale}.mdx`), 'utf8');
        for (const m of raw.matchAll(/<ArticleFigure[^>]*\ssrc="([^"]+)"/g)) {
          if (!existsSync(join(ROOT, 'public', m[1]))) faltando.push(`${p.slug} ${locale}: ${m[1]}`);
        }
      }
    }
    expect(faltando).toEqual([]);
  });

  it('DOI, quando existe, tem o formato dos DOIs reais do autor e diz qual objeto identifica', () => {
    for (const p of researchPapers) {
      if (!p.doi) continue;
      // 7-8 dígitos: os DOIs cunhados do autor. O padrão fabricado tinha exatamente 6 (ano + ordinal).
      expect(p.doi.value, p.slug).toMatch(/^10\.5281\/zenodo\.\d{7,8}$/);
      expect(['publication', 'replication-package']).toContain(p.doi.object);
      expect(p.bibtex, `${p.slug}: BibTeX sem o DOI`).toContain(p.doi.value);
    }
    const dois = researchPapers.filter((p) => p.doi).map((p) => p.doi!.value);
    expect(new Set(dois).size).toBe(dois.length);
  });

  it('datas ISO, updatedAt >= publishedAt, versão semver, licença do texto com URL', () => {
    for (const p of researchPapers) {
      expect(p.publishedAt, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.updatedAt, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.updatedAt >= p.publishedAt, `${p.slug}: updatedAt antes de publishedAt`).toBe(true);
      expect(p.version, p.slug).toMatch(/^\d+\.\d+\.\d+$/);
      expect(p.textLicense.url, p.slug).toMatch(/^https:\/\//);
      for (const u of p.updates) {
        expect(u.date >= p.publishedAt, `${p.slug}: correção anterior à publicação`).toBe(true);
        expect(u.date <= p.updatedAt, `${p.slug}: correção depois do updatedAt`).toBe(true);
      }
    }
  });

  it('hreflang só entre os locales com corpo, x-default no original', () => {
    for (const p of researchPapers) {
      const alt = paperLanguageAlternates(p);
      const langs = Object.keys(alt).filter((k) => k !== 'x-default');
      expect(langs.sort()).toEqual(p.bodies.map((l) => localeToHreflang[l]).sort());
      expect(alt['x-default']).toBe(alt[localeToHreflang[p.language]]);
    }
  });

  it('data do Scholar sem zero à esquerda; citação em texto carrega DOI ou URL canônica', () => {
    expect(scholarDate('2026-08-02')).toBe('2026/8/2');
    for (const p of researchPapers) {
      const c = formatCitation(p);
      expect(c).toContain(p.title);
      expect(c).toContain(p.doi ? `https://doi.org/${p.doi.value}` : `/research/${p.slug}`);
    }
  });

  it('plainAbstract tira a marcação do resumo estruturado sem tocar no texto', () => {
    expect(plainAbstract('**Background.** The registry\nis primary.\n\n**Methods.** Five routes.')).toBe(
      'Background. The registry is primary.\nMethods. Five routes.',
    );
    for (const p of researchPapers) {
      for (const text of Object.values(p.abstracts)) {
        expect(plainAbstract(text)).not.toContain('**');
      }
    }
  });
});
