/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🧪 Teste de Completude das Traduções nos Artefatos Gerados
 * ───────────────────────────────────────────────────────────────────────────────
 *  Valida que publications.generated.ts e knowledge.generated.ts
 *  contêm traduções automáticas completas para todos os 4 locales.
 *
 *  Este teste garante que:
 *  1. O gerador + API de tradução produziram dados completos
 *  2. Nenhuma publicação ficou sem tradução
 *  3. Nenhum blog post ficou sem headline traduzida
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { publications } from '../data/generated/publications.generated';
import { knowledgeData } from '../data/generated/knowledge.generated';

const REQUIRED_TITLE_LOCALES = ['en', 'es', 'it', 'he'] as const;
const REQUIRED_SUMMARY_LOCALES = ['summary_en', 'summary_es', 'summary_it', 'summary_he'] as const;

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

  it('HE usa script hebraico em todas as publicações', () => {
    const hebrewRe = /[\u0590-\u05FF]/;
    for (const pub of publications) {
      const trans = (pub as Record<string, unknown>).translations as Record<string, string> | undefined;
      const he = trans?.he;
      if (he) {
        expect(
          hebrewRe.test(he),
          `Publicação "${pub.id}" — HE não contém caracteres hebraicos: "${he}"`,
        ).toBe(true);
      }
    }
  });
});

describe('Completude de traduções em artefatos gerados — blog posts', () => {
  const blogPosts = (knowledgeData as Record<string, unknown>)?.blog
    ? ((knowledgeData as Record<string, { posts?: Array<Record<string, unknown>> }>).blog?.posts ?? [])
    : [];

  // Fallback: procurar posts em qualquer estrutura
  const posts = blogPosts.length > 0
    ? blogPosts
    : (() => {
        // Search for posts in knowledgeData's various categories
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

  it('HE usa script hebraico em headlines de blog', () => {
    const hebrewRe = /[\u0590-\u05FF]/;
    for (const post of posts) {
      const he = post.headline_he as string | undefined;
      if (he) {
        expect(
          hebrewRe.test(he),
          `Post "${post.slug}" — headline_he não contém hebraico`,
        ).toBe(true);
      }
    }
  });
});
