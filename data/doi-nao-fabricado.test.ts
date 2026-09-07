/**
 * Trava o conserto de 2026-09-06: o site LINKA um DOI cunhado em depósito, nunca monta um.
 *
 * O defeito que este arquivo existe para impedir de voltar: o gerador montava o identificador
 * por padrão, `10.5281/zenodo.<ano><ordinal de 2 dígitos>`, e publicava isso como DOI das 18
 * obras. Essa faixa do Zenodo está ocupada desde 2011 — 17 dos 18 resolviam para trabalho de
 * TERCEIROS, nenhum era do autor. HTTP 200 não prova posse; a verificação válida é resolver com
 * `Accept: application/vnd.citationstyles.csl+json` e comparar `author.family`.
 *
 * Auditoria completa: /Users/ulissesflores/Developer/publicacoes-recuperacao/docs/01-INVENTARIO-R1.md
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { publications } from '@/data/publications';

const ROOT = resolve(import.meta.dirname, '..');

// O padrao FABRICADO tem exatamente 6 digitos (ano + ordinal). Os DOIs REAIS do autor tem 7 a 8
// (zenodo.20276631, zenodo.20108648). Sem a borda de digito, este teste reprovaria justamente os
// DOIs legitimos no dia em que eles entrarem no site.
const DOI_FABRICADO = /zenodo\.\d{6}(?!\d)/;

const DIRS = ['app', 'content', 'data', 'docs', 'lib', 'scripts'];
const IGNORAR = new Set(['node_modules', '.next', '__pycache__', 'coverage']);
const ESTE_ARQUIVO = relative(ROOT, import.meta.filename);

function arquivosDeTexto(dir: string): string[] {
  const saida: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORAR.has(entrada.name)) continue;
    const caminho = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      saida.push(...arquivosDeTexto(caminho));
    } else if (/\.(ts|tsx|mjs|js|json|md|mdx|cff|jsonld)$/.test(entrada.name)) {
      if (statSync(caminho).size < 8_000_000) saida.push(caminho);
    }
  }
  return saida;
}

describe('DOI — nenhum identificador fabricado pelo gerador', () => {
  it('nenhum arquivo do repositorio carrega o padrao zenodo de 6 digitos', () => {
    const culpados: string[] = [];
    for (const dir of DIRS) {
      for (const caminho of arquivosDeTexto(resolve(ROOT, dir))) {
        const rel = relative(ROOT, caminho);
        if (rel === ESTE_ARQUIVO) continue;
        if (DOI_FABRICADO.test(readFileSync(caminho, 'utf8'))) culpados.push(rel);
      }
    }
    expect(culpados, `padrao de DOI fabricado reapareceu em:\n${culpados.join('\n')}`).toEqual([]);
  });

  it('o gerador nao tem mais funcao que monte DOI a partir de ano e ordinal', () => {
    // Comentario que NOMEIA a funcao removida nao pode reprovar o teste — o que importa e o
    // codigo executavel. Por isso os comentarios saem antes da comparacao.
    const semComentarios = (codigo: string) =>
      codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

    const fontes = [
      'scripts/upkf/lib/text.mjs',
      'scripts/upkf/lib/publication.mjs',
      'scripts/upkf/lib/doi-quality.mjs',
      'scripts/research/pipeline.mjs',
    ];
    for (const fonte of fontes) {
      const codigo = semComentarios(readFileSync(resolve(ROOT, fonte), 'utf8'));
      // Um template literal que concatene o prefixo do Zenodo com qualquer interpolacao e,
      // por construcao, a fabricacao que foi removida.
      expect(codigo, `${fonte} voltou a montar DOI`).not.toMatch(/`[^`]*zenodo\.\$\{/);
      expect(codigo, `${fonte} voltou a chamar buildDoiTarget`).not.toMatch(/buildDoiTarget\s*\(/);
    }
  });

  it('o tipo emitido nao aceita mais o estado "target"', () => {
    const emissor = readFileSync(resolve(ROOT, 'scripts/upkf/generate-artifacts-v2.mjs'), 'utf8');
    expect(emissor).toContain("export interface PublicationDoi {\\n  status: 'minted';");
    expect(emissor).not.toContain("status: 'target' | 'minted';");

    const gerado = readFileSync(resolve(ROOT, 'data/generated/publications.generated.ts'), 'utf8');
    expect(gerado).toContain("status: 'minted';");
    expect(gerado).not.toContain("'target'");
  });

  it('nenhuma publicacao publicada carrega DOI que nao tenha sido cunhado', () => {
    for (const publicacao of publications) {
      const doi = (publicacao as { doi?: { status?: string; minted?: string } }).doi;
      if (doi === undefined) continue;
      expect(doi.status, `${publicacao.id} tem doi com status diferente de minted`).toBe('minted');
      expect(doi.minted, `${publicacao.id} tem doi sem valor cunhado`).toMatch(/^10\.\d{4,}\/\S+$/);
    }
  });

  it('as 4 obras sem original nao voltaram ao registro', () => {
    const removidas = [
      '2024-ring-signatures-privacy',
      '2023-digital-legacy',
      '2022-theology-of-hope',
      '2020-robotics-education',
    ];
    const presentes = publications.map((p) => p.id);
    for (const slug of removidas) {
      expect(presentes, `${slug} voltou ao registro sem original recuperado`).not.toContain(slug);
    }
    expect(publications.length).toBe(14);
  });
});
