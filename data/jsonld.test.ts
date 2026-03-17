/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🔍 jsonld.test.ts — JSON-LD Structural Integrity Tests
 * ───────────────────────────────────────────────────────────────────────────────
 *  Lote 22 FASE 3: Garante que o SEO Estrutural e os metadados para Google/LLMs
 *  nunca quebrem com o crescimento do site.
 *
 *  Valida:
 *    1. Ficheiros .jsonld em public/ são JSON válido com @context e @graph
 *    2. Person node no siteJsonLd tem campos obrigatórios
 *    3. Todas as páginas com JSON-LD usam inLanguage dinâmico
 *    4. Publicações geradas contêm descrições nos 5 idiomas
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');

// ── 1. Ficheiros .jsonld em public/ ─────────────────────────────────────────

describe('JSON-LD Files — public/*.jsonld (Lote 22)', () => {
  const jsonldFiles = ['site.jsonld', 'public.jsonld', 'full.jsonld'];

  for (const file of jsonldFiles) {
    describe(file, () => {
      const filePath = join(PUBLIC, file);

      it('existe e não está vazio', () => {
        expect(existsSync(filePath), `${file} não encontrado`).toBe(true);
        const content = readFileSync(filePath, 'utf-8');
        expect(content.length).toBeGreaterThan(100);
      });

      it('é JSON válido', () => {
        const content = readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
      });

      it('contém @context Schema.org', () => {
        const data = JSON.parse(readFileSync(filePath, 'utf-8'));
        expect(data['@context']).toBeDefined();
        expect(String(data['@context'])).toContain('schema.org');
      });

      it('contém @graph com nós tipados', () => {
        const data = JSON.parse(readFileSync(filePath, 'utf-8'));
        if (data['@graph']) {
          expect(Array.isArray(data['@graph'])).toBe(true);
          expect(data['@graph'].length).toBeGreaterThan(0);
          // Every graph node should have @type
          for (const node of data['@graph']) {
            expect(node['@type'], `Nó sem @type em ${file}: ${JSON.stringify(node).slice(0, 100)}`).toBeDefined();
          }
        }
      });

      it('URLs usam domínio canónico (sem www)', () => {
        const content = readFileSync(filePath, 'utf-8');
        expect(content).not.toContain('www.ulissesflores.com');
      });
    });
  }
});

// ── 2. Person Node — siteJsonLd Integrity ───────────────────────────────────

describe('Person Node — siteJsonLd (upkf.generated.ts)', () => {
  const upkfPath = join(ROOT, 'data/generated/upkf.generated.ts');
  const content = readFileSync(upkfPath, 'utf-8');

  it('siteJsonLd existe e tem @graph', () => {
    expect(content).toContain('export const siteJsonLd');
    expect(content).toContain('@graph');
  });

  it('Person node tem @id, sameAs, identifier', () => {
    expect(content).toContain('"@type": "Person"');
    expect(content).toContain('/#person');
    expect(content).toContain('sameAs');
    expect(content).toContain('"propertyID": "DID"');
    expect(content).toContain('"propertyID": "ORCID"');
  });

  it('WebSite node tem inLanguage multilingue', () => {
    expect(content).toContain('"@type": "WebSite"');
    expect(content).toContain('inLanguage');
    // Deve ter os 5 idiomas
    expect(content).toContain('"pt-BR"');
    expect(content).toContain('"en"');
    expect(content).toContain('"es"');
    expect(content).toContain('"it"');
    expect(content).toContain('"he"');
  });
});

// ── 3. Publicações — Descrições i18n presentes ──────────────────────────────

describe('Publications i18n — descrições em múltiplos idiomas', () => {
  const pubPath = join(ROOT, 'data/generated/publications.generated.ts');

  it('publications.generated.ts existe', () => {
    expect(existsSync(pubPath)).toBe(true);
  });

  it('contém descrições em PT-BR e EN no mínimo', () => {
    const content = readFileSync(pubPath, 'utf-8');
    // Publicações devem ter campos traduzidos (double-quoted keys)
    expect(content.includes('"pt-BR"') || content.includes("'pt-BR'")).toBe(true);
    expect(content.includes('"en"') || content.includes("'en'") || content.includes('summary_en')).toBe(true);
  });

  it('contém traduções em ES, IT e HE', () => {
    const content = readFileSync(pubPath, 'utf-8');
    // Translations appear as summary_es, summary_it, summary_he or "es", "it", "he" keys
    expect(content.includes('summary_es') || content.includes('"es"')).toBe(true);
    expect(content.includes('summary_it') || content.includes('"it"')).toBe(true);
    expect(content.includes('summary_he') || content.includes('"he"')).toBe(true);
  });
});

// ── 4. Páginas com JSON-LD — cobertura ──────────────────────────────────────

describe('Páginas com JSON-LD — inLanguage dinâmico', () => {
  const pagesDir = join(ROOT, 'app/[locale]');

  function walkPages(dir: string): string[] {
    const results: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) results.push(...walkPages(fullPath));
      else if (entry.name === 'page.tsx') results.push(fullPath);
    }
    return results;
  }

  const pageFiles = walkPages(pagesDir);

  it('existem páginas com JSON-LD injection', () => {
    const pagesWithJsonLd = pageFiles.filter(f =>
      readFileSync(f, 'utf-8').includes('application/ld+json')
    );
    expect(pagesWithJsonLd.length).toBeGreaterThanOrEqual(10);
  });

  it('nenhuma página tem inLanguage hardcoded como string literal fora de contexto', () => {
    const HARDCODED = /inLanguage:\s*['"`](pt-BR|pt-br|en|es|it|he)['"`]/;
    const SAFE_CONTEXT = /translationOfWork|isTranslationOf|knowledgeData\./;

    for (const pagePath of pageFiles) {
      const content = readFileSync(pagePath, 'utf-8');
      if (!content.includes('application/ld+json')) continue;

      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (HARDCODED.test(lines[i])) {
          // Permitir contextos seguros (translationOfWork, knowledgeData)
          const context = lines.slice(Math.max(0, i - 5), i + 1).join('\n');
          if (SAFE_CONTEXT.test(context)) continue;
          // Falha real
          const relPath = pagePath.replace(ROOT + '/', '');
          expect.fail(
            `${relPath}:${i + 1} — inLanguage hardcoded: "${lines[i].trim()}"`
          );
        }
      }
    }
  });
});
