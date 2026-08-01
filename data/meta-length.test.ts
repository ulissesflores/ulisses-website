import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { toMetaDescription } from './seo';
import { supportedLocales } from './i18n';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  📏 Comprimento de `<title>` e `<meta description>` — gate
 * ───────────────────────────────────────────────────────────────────────────────
 *  A auditoria de 2026-07-30 mediu 17 de 20 títulos truncando na SERP, e a
 *  remedição de 2026-08-01 (já com os 6 artigos reindexados) achou 23 de 26.
 *  Nada no gate pegava isso: as strings vivem nos dicionários e nenhum teste
 *  olhava o tamanho delas.
 *
 *  O orçamento do TÍTULO não é 60: `app/[locale]/layout.tsx` aplica o template
 *  `%s | Ulisses Flores`, que soma 17 caracteres a toda rota que não usa
 *  `title.absolute`. A string do dicionário tem, portanto, 43.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const TITLE_SUFFIX = ' | Ulisses Flores'.length;
const TITLE_MAX = 60;
const DESC_MAX = 155;

type MetaEntry = { locale: string; path: string; title: string; description?: string };

/**
 * Nem toda meta mora em `<namespace>.meta`: as rotas de cenário e as duas
 * páginas do PSI usam `raceMeta`, `slowdownMeta`, `whitepaperMeta` e
 * `simulacaoMeta`. Uma varredura que só olhasse o topo daria o gate por
 * cumprido com 20 strings fora do limite — foi o que aconteceu na primeira
 * passada de 2026-08-01.
 */
function* collectMeta(node: unknown, path: string[]): Generator<{ path: string; title: string; description?: string }> {
  if (!node || typeof node !== 'object') return;
  const record = node as Record<string, unknown>;
  const key = path[path.length - 1] ?? '';
  const looksLikeMeta = key === 'meta' || key.endsWith('Meta') || typeof record.ogTitle === 'string';
  if (looksLikeMeta && typeof record.title === 'string') {
    yield {
      path: path.join('.'),
      title: record.title,
      description: typeof record.description === 'string' ? record.description : undefined,
    };
  }
  // Os stories de coleção não têm `title` nem `ogTitle` — o que chega ao
  // `<title>` é `metaTitle`, e o `h1` ao lado dele é o cabeçalho visível.
  if (typeof record.metaTitle === 'string') {
    yield {
      path: path.join('.'),
      title: record.metaTitle,
      description: typeof record.metaDescription === 'string' ? record.metaDescription : undefined,
    };
  }
  for (const [childKey, childValue] of Object.entries(record)) yield* collectMeta(childValue, [...path, childKey]);
}

async function loadMeta(): Promise<MetaEntry[]> {
  const entries: MetaEntry[] = [];
  for (const locale of supportedLocales) {
    for (const file of readdirSync(new URL(`./i18n/${locale}`, import.meta.url))) {
      if (!file.endsWith('.ts') || file === 'index.ts') continue;
      const namespace = file.replace('.ts', '');
      // Extensão na parte estática: sem ela o `vite:dynamic-import-vars` avisa.
      const mod = await import(`./i18n/${locale}/${namespace}.ts`);
      for (const value of Object.values(mod)) {
        for (const hit of collectMeta(value, [namespace])) entries.push({ locale, ...hit });
      }
    }
  }
  return entries;
}

describe('Comprimento dos metadados de rota', () => {
  it('nenhum <title> passa de 60 caracteres com o sufixo do template', async () => {
    const tooLong = (await loadMeta())
      .filter((e) => e.title.length + TITLE_SUFFIX > TITLE_MAX)
      .map((e) => `${e.locale} ${e.path}: ${e.title.length + TITLE_SUFFIX} chars`);
    expect(tooLong).toEqual([]);
  });

  it('nenhuma description passa de 155 caracteres', async () => {
    const tooLong = (await loadMeta())
      .filter((e) => (e.description?.length ?? 0) > DESC_MAX)
      .map((e) => `${e.locale} ${e.path}: ${e.description!.length} chars`);
    expect(tooLong).toEqual([]);
  });

  it('cobre os 5 locales', async () => {
    const locales = new Set((await loadMeta()).map((e) => e.locale));
    expect(locales.size).toBe(supportedLocales.length);
  });
});

describe('toMetaDescription', () => {
  it('devolve o texto intacto quando já cabe', () => {
    expect(toMetaDescription('Curto o bastante.')).toBe('Curto o bastante.');
  });

  it('corta no fim da última frase inteira que cabe', () => {
    const summary =
      'Deteccao de fraude em cartoes com redes neurais MLP e engenharia de atributos para dados desbalanceados. ' +
      'A combinacao de MLP com ajuste de limiar melhora captura de fraudes. ' +
      'A pagina publica apresenta sintese cientifica e o PDF consolidado contem a versao completa.';
    const result = toMetaDescription(summary);
    expect(result.length).toBeLessThanOrEqual(DESC_MAX);
    expect(result.endsWith('.')).toBe(true);
    expect(result).not.toContain('sintese cientifica');
  });

  it('cai para fronteira de palavra quando não há frase inteira que caiba', () => {
    const result = toMetaDescription(`${'palavra '.repeat(30)}fim`);
    expect(result.length).toBeLessThanOrEqual(DESC_MAX);
    expect(result.endsWith(' ')).toBe(false);
  });
});
