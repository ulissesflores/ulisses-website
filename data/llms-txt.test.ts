/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  📄 llms-txt.test.ts — LLM SEO Integrity Tests
 * ───────────────────────────────────────────────────────────────────────────────
 *  Lote 22 FASE 3: Garante que public/llms.txt está sempre presente, correto
 *  e com cobertura de conteúdo suficiente para LLMs (OpenAI/Anthropic/Google).
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { artigos } from './artigos';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

describe('llms.txt — LLM SEO Integrity (Lote 22)', () => {
  const llmsPath = resolve(ROOT, 'public/llms.txt');

  it('public/llms.txt existe', () => {
    expect(existsSync(llmsPath), 'llms.txt não existe em public/').toBe(true);
  });

  it('não está vazio (mínimo 100 chars)', () => {
    const content = readFileSync(llmsPath, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('contém referência à identidade do autor', () => {
    const content = readFileSync(llmsPath, 'utf-8');
    expect(content).toContain('Ulisses');
  });

  it('contém o domínio canónico', () => {
    const content = readFileSync(llmsPath, 'utf-8');
    expect(content).toContain('ulissesflores.com');
  });

  it('não contém domínio www (canónico)', () => {
    const content = readFileSync(llmsPath, 'utf-8');
    expect(content).not.toContain('www.ulissesflores.com');
  });

  it('contém pelo menos 5 URLs de conteúdo', () => {
    const content = readFileSync(llmsPath, 'utf-8');
    const urls = content.match(/https?:\/\/[^\s]+/g) || [];
    expect(
      urls.length,
      `llms.txt contém apenas ${urls.length} URLs — esperado ≥5`
    ).toBeGreaterThanOrEqual(5);
  });

  it('contém secções estruturadas (linhas não-vazias)', () => {
    const content = readFileSync(llmsPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    expect(lines.length).toBeGreaterThan(10);
  });

  /*
   * O gate que faltava. O `llms.txt` é montado por REGEX sobre `data/artigos.ts`
   * (o gerador é .mjs e não compila TypeScript), e regex que não casa não falha —
   * some. `marca-dagua-claude` ficou fora do arquivo desde a publicação porque o
   * título dele usa aspas duplas (tem apóstrofo em "marca d'água") e o padrão só
   * aceitava aspas simples: 17 de 18 artigos, sem nada acusando.
   *
   * Este teste compara a LISTA, não a contagem: contagem certa com slug trocado
   * passaria batido.
   */
  it('lista todos os artigos de data/artigos.ts — nenhum some por regex', () => {
    const content = readFileSync(llmsPath, 'utf-8');
    const ausentes = artigos
      .map((a) => `https://ulissesflores.com/artigos/${a.slug}`)
      .filter((url) => !content.includes(`: ${url}`));
    expect(ausentes).toEqual([]);
  });
});
