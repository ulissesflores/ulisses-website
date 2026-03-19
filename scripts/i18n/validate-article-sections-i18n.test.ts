/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🔬 Teste de Paridade i18n — Article Sections (Conteúdo de Corpo)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Garante que TODAS as publicações possuem translatedSections e
 *  translatedLanding para os 4 locales-alvo (en, es, it, he).
 *  Previne regressão onde conteúdo PT-BR vaza em páginas de outros idiomas.
 *
 *  Integrado ao `npm test` via vitest.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { publications } from '@/data/generated/publications.generated';

const TARGET_LOCALES = ['en', 'es', 'it', 'he'] as const;

const REQUIRED_SECTION_KEYS = [
  'abstract',
  'introduction',
  'methods',
  'conclusion',
  'references',
] as const;

describe('Article Sections i18n — Zero PT-BR Leakage', () => {
  it('every publication has translatedSections for all 4 locales', () => {
    const missing: string[] = [];

    for (const pub of publications) {
      for (const locale of TARGET_LOCALES) {
        if (!pub.translatedSections?.[locale]) {
          missing.push(`${pub.id} missing translatedSections.${locale}`);
        }
      }
    }

    expect(missing, `Missing translatedSections:\n${missing.join('\n')}`).toHaveLength(0);
  });

  it('every publication has translatedLanding for all 4 locales', () => {
    const missing: string[] = [];

    for (const pub of publications) {
      for (const locale of TARGET_LOCALES) {
        if (!pub.translatedLanding?.[locale]) {
          missing.push(`${pub.id} missing translatedLanding.${locale}`);
        }
      }
    }

    expect(missing, `Missing translatedLanding:\n${missing.join('\n')}`).toHaveLength(0);
  });

  it('translated sections have non-empty required fields', () => {
    const empty: string[] = [];

    for (const pub of publications) {
      for (const locale of TARGET_LOCALES) {
        const sections = pub.translatedSections?.[locale];
        if (!sections) continue;

        for (const key of REQUIRED_SECTION_KEYS) {
          const value = sections[key];
          if (key === 'references') {
            if (!Array.isArray(value) || value.length === 0) {
              empty.push(`${pub.id}.${locale}.${key} is empty array`);
            }
          } else if (typeof value === 'string' && value.trim().length === 0) {
            empty.push(`${pub.id}.${locale}.${key} is empty string`);
          }
        }
      }
    }

    expect(empty, `Empty required sections:\n${empty.join('\n')}`).toHaveLength(0);
  });

  it('translatedLanding has non-empty overview and downloadPitch', () => {
    const empty: string[] = [];

    for (const pub of publications) {
      for (const locale of TARGET_LOCALES) {
        const landing = pub.translatedLanding?.[locale];
        if (!landing) continue;

        if (!landing.overview || landing.overview.trim().length === 0) {
          empty.push(`${pub.id}.${locale}.overview is empty`);
        }
        if (!landing.downloadPitch || landing.downloadPitch.trim().length === 0) {
          empty.push(`${pub.id}.${locale}.downloadPitch is empty`);
        }
      }
    }

    expect(empty, `Empty landing fields:\n${empty.join('\n')}`).toHaveLength(0);
  });

  it('translated article files exist on disk for all locales', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const ARTICLES_DIR = path.join(__dirname, '..', '..', 'data', 'research', 'articles');
    const missing: string[] = [];

    for (const pub of publications) {
      for (const locale of TARGET_LOCALES) {
        const articlePath = path.join(ARTICLES_DIR, pub.id, `article.${locale}.md`);
        if (!fs.existsSync(articlePath)) {
          missing.push(`${pub.id}/article.${locale}.md`);
        }
      }
    }

    expect(missing, `Missing article files:\n${missing.join('\n')}`).toHaveLength(0);
  });

  it('no Portuguese content leaked into EN/HE/IT translated sections (spot check)', () => {
    // Portuguese-only phrases that should NEVER appear in EN, HE, or IT
    // Note: ES is excluded from some patterns because PT-ES cognates are legitimate
    const ptOnlyPatterns: Array<{ pattern: RegExp; excludeLocales?: string[] }> = [
      { pattern: /Esta pagina apresenta uma sintese cientifica/i },
      { pattern: /O objetivo deste trabalho e avaliar/i },
      { pattern: /Desenho metodologico:/i },
      { pattern: /No estado atual do tema/i },
      { pattern: /A lacuna de pesquisa reside/i },
      // "Resultado principal:" is a PT-ES cognate — only flag for EN/HE/IT
      { pattern: /Resultado principal:/i, excludeLocales: ['es'] },
    ];

    const leaks: string[] = [];

    for (const pub of publications) {
      for (const locale of TARGET_LOCALES) {
        const sections = pub.translatedSections?.[locale];
        if (!sections) continue;

        const allText = [
          sections.abstract,
          sections.introduction,
          sections.methods,
          sections.results,
          sections.conclusion,
        ].join(' ');

        for (const { pattern, excludeLocales } of ptOnlyPatterns) {
          if (excludeLocales?.includes(locale)) continue;
          if (pattern.test(allText)) {
            leaks.push(`${pub.id}.${locale} contains PT-BR pattern: ${pattern.source}`);
          }
        }
      }
    }

    expect(leaks, `PT-BR content leaking into translations:\n${leaks.join('\n')}`).toHaveLength(0);
  });
});
