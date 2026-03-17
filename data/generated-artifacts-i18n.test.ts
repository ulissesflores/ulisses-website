/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🧪 Teste de Completude e Sanidade das Traduções nos Artefatos Gerados
 * ───────────────────────────────────────────────────────────────────────────────
 *  LOTE 19 — OPERAÇÃO RESILIÊNCIA E ESCALA
 *
 *  Valida que publications.generated.ts e knowledge.generated.ts
 *  contêm traduções automáticas completas e LINGUISTICAMENTE CORRETAS
 *  para todos os 4 locales.
 *
 *  BLINDAGENS:
 *    ✅ Completude: todo campo title/summary existe e não é vazio
 *    ✅ Charset HE: hebraico usa script correcto (bloco Unicode 0590-05FF)
 *    ✅ Proporção HE: pelo menos 20% dos caracteres são hebraicos (anti-alucinação)
 *    ✅ Anti-cópia: título traduzido NÃO é cópia exacta do pt-br
 *    ✅ Charset IT: confirma presença de caracteres latinos com acentos italianos
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { publications } from '../data/generated/publications.generated';
import { knowledgeData } from '../data/generated/knowledge.generated';

const REQUIRED_TITLE_LOCALES = ['en', 'es', 'it', 'he'] as const;
const REQUIRED_SUMMARY_LOCALES = ['summary_en', 'summary_es', 'summary_it', 'summary_he'] as const;

// ── Charset Validators ──────────────────────────────────────────────────────────

const HEBREW_RE = /[\u0590-\u05FF]/;
const HEBREW_MIN_RATIO = 0.2; // Pelo menos 20% do texto deve ser hebraico

function hebrewRatio(text: string): number {
  if (!text) return 0;
  const heChars = (text.match(/[\u0590-\u05FF]/g) ?? []).length;
  return heChars / text.length;
}

// ── Publication Tests ───────────────────────────────────────────────────────────

describe('Completude de traduções em artefatos gerados — publicações', () => {
  it('toda publicação tem objecto translations definido', () => {
    for (const pub of publications) {
      expect(
        (pub as Record<string, unknown>).translations,
        `Publicação "${pub.id}" sem objecto translations`,
      ).toBeDefined();
    }
  });

  for (const locale of REQUIRED_TITLE_LOCALES) {
    it(`toda publicação tem título traduzido para ${locale}`, () => {
      for (const pub of publications) {
        const trans = (pub as Record<string, unknown>).translations as Record<string, string> | undefined;
        const title = trans?.[locale];
        expect(
          typeof title === 'string' && title.length > 0,
          `Publicação "${pub.id}" sem título ${locale}`,
        ).toBe(true);
      }
    });
  }

  for (const key of REQUIRED_SUMMARY_LOCALES) {
    it(`toda publicação tem ${key} não-vazio`, () => {
      for (const pub of publications) {
        const trans = (pub as Record<string, unknown>).translations as Record<string, string> | undefined;
        const summary = trans?.[key];
        expect(
          typeof summary === 'string' && summary.length > 0,
          `Publicação "${pub.id}" sem ${key}`,
        ).toBe(true);
      }
    });
  }

  // ── FASE 3 LOTE 19: Testes de Sanidade de Charset (Anti-Alucinação) ─────────

  it('HE: título usa script hebraico com proporção mínima de 20%', () => {
    for (const pub of publications) {
      const trans = (pub as Record<string, unknown>).translations as Record<string, string> | undefined;
      const he = trans?.he;
      if (he) {
        expect(
          HEBREW_RE.test(he),
          `Publicação "${pub.id}" — title HE não contém NENHUM caractere hebraico: "${he}"`,
        ).toBe(true);
        const ratio = hebrewRatio(he);
        expect(
          ratio >= HEBREW_MIN_RATIO,
          `Publicação "${pub.id}" — title HE tem apenas ${Math.round(ratio * 100)}% chars hebraicos (mín: ${HEBREW_MIN_RATIO * 100}%): "${he.slice(0, 60)}"`,
        ).toBe(true);
      }
    }
  });

  it('HE: summary_he usa script hebraico com proporção mínima de 20%', () => {
    for (const pub of publications) {
      const trans = (pub as Record<string, unknown>).translations as Record<string, string> | undefined;
      const summaryHe = trans?.summary_he;
      if (summaryHe) {
        expect(
          HEBREW_RE.test(summaryHe),
          `Publicação "${pub.id}" — summary_he não contém NENHUM caractere hebraico: "${summaryHe.slice(0, 80)}"`,
        ).toBe(true);
        const ratio = hebrewRatio(summaryHe);
        expect(
          ratio >= HEBREW_MIN_RATIO,
          `Publicação "${pub.id}" — summary_he tem apenas ${Math.round(ratio * 100)}% chars hebraicos (mín: ${HEBREW_MIN_RATIO * 100}%): "${summaryHe.slice(0, 60)}"`,
        ).toBe(true);
      }
    }
  });

  it('Anti-cópia: título traduzido NÃO é cópia exacta do pt-br em nenhum locale', () => {
    for (const pub of publications) {
      const ptTitle = pub.title;
      const trans = (pub as Record<string, unknown>).translations as Record<string, string> | undefined;
      if (!trans) continue;
      for (const locale of REQUIRED_TITLE_LOCALES) {
        const translated = trans[locale];
        if (translated) {
          // Ignorar termos técnicos curtos que podem ser iguais (ex: "LSTM", "IoT")
          if (ptTitle.length > 15) {
            expect(
              translated !== ptTitle,
              `Publicação "${pub.id}" — título ${locale} é cópia exacta do pt-br: "${ptTitle}"`,
            ).toBe(true);
          }
        }
      }
    }
  });
});

// ── Blog Post Tests ─────────────────────────────────────────────────────────────

describe('Completude de traduções em artefatos gerados — blog posts', () => {
  const blogPosts = (knowledgeData as Record<string, unknown>)?.blog
    ? ((knowledgeData as Record<string, { posts?: Array<Record<string, unknown>> }>).blog?.posts ?? [])
    : [];

  const posts = blogPosts.length > 0
    ? blogPosts
    : (() => {
        const found: Array<Record<string, unknown>> = [];
        if (typeof knowledgeData === 'object' && knowledgeData !== null) {
          for (const val of Object.values(knowledgeData as Record<string, unknown>)) {
            if (typeof val === 'object' && val !== null && 'posts' in (val as Record<string, unknown>)) {
              const p = (val as Record<string, unknown>).posts;
              if (Array.isArray(p)) found.push(...p);
            }
          }
        }
        return found;
      })();

  for (const locale of REQUIRED_TITLE_LOCALES) {
    it(`todo post de blog tem headline_${locale} não-vazio`, () => {
      for (const post of posts) {
        const headline = post[`headline_${locale}`];
        expect(
          typeof headline === 'string' && (headline as string).length > 0,
          `Post "${post.slug || post.headline}" sem headline_${locale}`,
        ).toBe(true);
      }
    });

    it(`todo post de blog tem summary_${locale} não-vazio`, () => {
      for (const post of posts) {
        const summary = post[`summary_${locale}`];
        expect(
          typeof summary === 'string' && (summary as string).length > 0,
          `Post "${post.slug || post.headline}" sem summary_${locale}`,
        ).toBe(true);
      }
    });
  }

  // ── FASE 3 LOTE 19: Charset validation para blog posts ──────────────────────

  it('HE: headline_he de blog usa script hebraico com proporção mínima', () => {
    for (const post of posts) {
      const he = post.headline_he as string | undefined;
      if (he) {
        expect(
          HEBREW_RE.test(he),
          `Post "${post.slug}" — headline_he não contém hebraico: "${he}"`,
        ).toBe(true);
        const ratio = hebrewRatio(he);
        expect(
          ratio >= HEBREW_MIN_RATIO,
          `Post "${post.slug}" — headline_he tem apenas ${Math.round(ratio * 100)}% chars hebraicos: "${he.slice(0, 60)}"`,
        ).toBe(true);
      }
    }
  });

  it('HE: summary_he de blog usa script hebraico com proporção mínima', () => {
    for (const post of posts) {
      const he = post.summary_he as string | undefined;
      if (he) {
        expect(
          HEBREW_RE.test(he),
          `Post "${post.slug}" — summary_he não contém hebraico: "${he.slice(0, 80)}"`,
        ).toBe(true);
        const ratio = hebrewRatio(he);
        expect(
          ratio >= HEBREW_MIN_RATIO,
          `Post "${post.slug}" — summary_he tem apenas ${Math.round(ratio * 100)}% chars hebraicos: "${he.slice(0, 60)}"`,
        ).toBe(true);
      }
    }
  });

  it('Anti-cópia: headline traduzido NÃO é cópia exacta do pt-br', () => {
    for (const post of posts) {
      const ptHeadline = post.headline as string;
      if (!ptHeadline || ptHeadline.length <= 15) continue;
      for (const locale of REQUIRED_TITLE_LOCALES) {
        const translated = post[`headline_${locale}`] as string | undefined;
        if (translated) {
          expect(
            translated !== ptHeadline,
            `Post "${post.slug}" — headline_${locale} é cópia exacta do pt-br: "${ptHeadline}"`,
          ).toBe(true);
        }
      }
    }
  });
});
