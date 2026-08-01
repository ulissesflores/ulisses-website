import { upkfMeta } from '@/data/generated/upkf.generated';
import { normalizePath } from './i18n';

/**
 * Categorias em `noindex` desde o rebrand de 2026-06 (conteúdo em reconstrução).
 * Fonte única: o template de artigo emite o meta robots e o sitemap EXCLUI estas
 * publicações (página + PDF/artefatos) — URL noindex dentro do sitemap é sinal
 * conflitante para o Google.
 */
export const noindexPublicationCategories: readonly string[] = ['research', 'essays', 'whitepapers'];

/**
 * Publicações que já foram REFEITAS a partir de material real (Fase 2) e voltam a
 * ser indexáveis, mesmo estando numa categoria em `noindex`.
 *
 * O interruptor por categoria era grosso demais: escondia do Google os 6 artigos
 * reconstruídos junto com os 12 que nunca foram tocados — enquanto `llms.txt` e
 * `feed.xml` anunciavam os 18 em destaque (auditoria 2026-07-30). Esta lista é a
 * exceção explícita que desfaz isso; o critério de entrada é ter `.recovered.md`
 * em `data/research/articles/<slug>/`.
 */
export const reindexedPublicationSlugs: readonly string[] = [
  '2024-agritech-agile-flow',
  '2024-theology-economic-order',
  '2025-fraud-detection-mlp',
  '2025-hybrid-cooling-thermodynamics',
  '2025-little-law-resilience',
  '2025-lstm-asset-prediction',
];

/** Uma publicação é escondida do Google se a categoria for noindex E ela não tiver sido refeita. */
export function isPublicationNoindexed(category: string, slug: string): boolean {
  return noindexPublicationCategories.includes(category) && !reindexedPublicationSlugs.includes(slug);
}

/**
 * Hreflang prefix map. `pt-BR` is the default locale — its canonical URL is
 * the BARE path (no prefix). Only non-default locales carry a `/{prefix}/`.
 */
export const hreflangLocalePrefix = {
  'pt-BR': '',
  en: 'en',
  es: 'es',
  he: 'he',
  it: 'it',
} as const;

/**
 * Build the `alternates.languages` map for Next.js metadata.
 *
 * The `pt-BR` variant MUST emit the bare canonical URL (no `/pt-br/` prefix),
 * matching the `buildCanonical` behavior for the default locale. Otherwise the
 * hreflang cluster contains a self-referencing URL that 301-redirects back to
 * the canonical — Google rejects the cluster and may pick a foreign variant
 * (e.g. `/it/...`) as the canonical, producing "Alternate page with proper
 * canonical tag" errors in Search Console.
 *
 * Also emits `x-default` pointing to the bare canonical, so Google has an
 * explicit fallback when language detection is ambiguous.
 */
export function buildLanguageAlternates(path: string): Record<string, string> {
  const origin = upkfMeta.primaryWebsite;
  const normalizedPath = normalizePath(path);
  const suffix = normalizedPath === '/' ? '' : normalizedPath;
  const alternates: Record<string, string> = {};

  Object.entries(hreflangLocalePrefix).forEach(([lang, prefix]) => {
    // Default locale (pt-BR, prefix='') → bare URL; root becomes origin + '/'.
    const base = prefix === '' ? origin : `${origin}/${prefix}`;
    alternates[lang] = suffix === '' && prefix === '' ? `${origin}/` : `${base}${suffix}`;
  });

  // x-default → bare canonical, identical to pt-BR variant.
  alternates['x-default'] = alternates['pt-BR'];

  return alternates;
}

/**
 * Build a self-referencing canonical URL for the current locale.
 *
 * For pt-br (default locale): returns bare path (e.g., '/simulacoes')
 *   because middleware rewrites bare paths → /pt-br/... invisibly.
 *
 * For all other locales: returns '/{locale}{path}' (e.g., '/es/simulacoes')
 *   so Google sees each localized page as self-referencing canonical.
 *
 * Without this, all non-pt-br pages generate canonical pointing to the
 * pt-br version, causing GSC to exclude 1000+ pages as duplicates.
 */
export function buildCanonical(locale: string, path: string): string {
  const normalizedPath = normalizePath(path);
  // Default locale uses bare paths (no prefix) — middleware handles rewrite
  if (locale === 'pt-br') {
    return normalizedPath;
  }
  // Foreign locales MUST include their locale prefix for self-referencing canonical
  const suffix = normalizedPath === '/' ? '' : normalizedPath;
  return `/${locale}${suffix}`;
}

/**
 * Imagem de card padrão do locale, para o `openGraph.images` das rotas.
 *
 * Existe porque o Next.js SUBSTITUI o `openGraph` do layout pai pelo da rota
 * filha em vez de fundir os dois: toda rota que declarava `openGraph` sem
 * `images` perdia a imagem herdada da convenção e servia card cego em
 * LinkedIn/X — inclusive `/consultoria` e `/palestras` (auditoria 2026-07-28).
 * Por isso cada rota declara `images` explicitamente, e a POLÍTICA (qual
 * imagem) mora só aqui.
 *
 * Aponta para a rota de convenção `opengraph-image.tsx`, que já gera 1200x630
 * — nenhum asset novo. `buildCanonical` resolve o prefixo de locale (pt-br usa
 * URL nua; `/pt-br/opengraph-image` responde 301). Referenciada SEM o hash de
 * versão que o Next anexa: o hash muda a cada rebuild e quebraria a URL fixada.
 *
 * `twitter.images` não precisa de tratamento — o Next copia de
 * `openGraph.images` quando o bloco `twitter` não define o seu.
 */
export function defaultOgImages(locale: string) {
  return [
    {
      url: `${upkfMeta.primaryWebsite}${buildCanonical(locale, '/opengraph-image')}`,
      width: 1200,
      height: 630,
    },
  ];
}

/**
 * Encurta um texto longo para caber na `<meta name="description">`.
 *
 * O Google corta a description por volta de 155 caracteres. Os `summary` das
 * publicações vêm do gerador do UPKF (`scripts/upkf/lib/buildSummary`) com
 * 505–590 caracteres, dos quais o trecho final é boilerplate repetido em todas
 * elas ("Pergunta central: … A pagina publica apresenta sintese cientifica e o
 * PDF consolidado contem a versao completa para citacao formal"). Medido em
 * 2026-08-01: 6 das 6 publicações reindexadas serviam essa cauda.
 *
 * O corte acontece aqui, no consumo, e NÃO no `summary`: o mesmo campo alimenta
 * o corpo da página e o JSON-LD, onde o texto completo é legítimo.
 */
export function toMetaDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const lastSentence = [...head.matchAll(/[.!?](?=\s|$)/g)].map((m) => m.index + 1);
  if (lastSentence.length > 0) return text.slice(0, Math.max(...lastSentence)).trim();
  return head.slice(0, head.lastIndexOf(' ')).replace(/[\s,;:—|·-]+$/, '').trim();
}
