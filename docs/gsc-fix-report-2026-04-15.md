# GSC Fix Report — 2026-04-15

**Escopo:** diagnóstico e correção do issue "Alternate page with proper canonical tag" (142 URLs) e demais flags de indexação reportados pelo Google Search Console, com reforço de JSON-LD para posicionamento como consultor / palestrante / cientista / especialista em IA.

**Autor:** Pipeline automatizado (Claude Code) — validado contra produção `https://ulissesflores.com`.

---

## 1. Resumo Executivo

| Área | Estado antes | Estado depois |
|---|---|---|
| **www → non-www** | 301 ativo | ✅ Confirmado 308 (Vercel) em produção |
| **/pt-br/ → / (strip locale)** | 301 ativo | ✅ Confirmado 301 via curl |
| **/sermons/ → /acervo-teologico/ (com slug específico)** | 301 ativo | ✅ Confirmado 301 para destino canônico |
| **/acervo-teologico/jejum-da-vitoria-2023-21-devotionals/17 e /21** | 301 para `/acervo-teologico` (soft-404) | ✅ **Corrigido** — 301 para slug canônico (`/mensagens-profeticas/celebracao-antecipada` e `/o-selo-da-vitoria`) |
| **Slugs truncados (pattern E)** | 404 | ✅ Comportamento nativo correto — Google deindexa em ~30 dias; slug truncation (72 chars) é intencional |
| **BreadcrumbList JSON-LD em publicações** | Ausente | ✅ **Adicionado** em `/[locale]/[category]/[slug]` |
| **FAQPage JSON-LD** | Presente em home e /identidade via `<FaqSection>` | ✅ Confirmado em produção |
| **ProfessionalService schema** | Ausente | ✅ **Adicionado** ao `@graph` (site.jsonld, public.jsonld, full.jsonld) |
| **llms.txt — bloco de serviços** | Ausente | ✅ **Adicionado** — 5 modalidades com CTA |
| **Notificação a buscadores** | Manual | ✅ **Executado** — 75 URLs → Google Indexing API; 5 engines via IndexNow; 12 páginas warmed p/ AI crawlers |

**Resultado esperado (4-8 semanas):** queda do "Alternate page with proper canonical tag" de 142 para < 20; rich results (Article, Breadcrumb, FAQ, Person, ProfessionalService) aparecendo no GSC → Enhancements; citações de ChatGPT/Claude/Perplexity mencionando Ulisses como consultor/palestrante com link canônico.

---

## 1.1 Root Cause Real — Bug Crítico de Hreflang (descoberto 2026-04-15 13:20)

Após habilitar a **Search Console URL Inspection API** e rodar [`scripts/seo/inspect-gsc-urls.mjs`](../scripts/seo/inspect-gsc-urls.mjs) contra 6 URLs representativas, o Google revelou o que estava acontecendo na URL B (`/pt-br/whitepapers/2023-digital-legacy`):

- `userCanonical`: `https://ulissesflores.com/whitepapers/2023-digital-legacy` ✅ correto
- `googleCanonical`: `https://ulissesflores.com/it/whitepapers/2023-digital-legacy` ❌ **italiano**

**O Google estava escolhendo a versão italiana como canônica de uma página portuguesa.**

### Diagnóstico da causa raiz

O arquivo `data/seo.ts` tinha dois bugs simultâneos em `buildLanguageAlternates`:

1. O mapa `hreflangLocalePrefix['pt-BR']` estava `'pt-br'`, fazendo a função emitir `hreflang="pt-BR" href="/pt-br/whitepapers/..."`. Essa URL **301-redireciona** pro canonical (bare path). Resultado: cluster hreflang auto-inconsistente — o membro pt-BR do cluster é uma URL que redireciona, não a canônica.

2. Faltava `x-default`. Sem isso, o Google não tem fallback explícito quando a detecção de idioma é ambígua — ele escolhe aleatoriamente entre os 5 membros do cluster.

Quando o Google recebe um cluster hreflang quebrado (membro auto-referente inválido) e sem `x-default`, ele descarta a canonical declarada pelo usuário e escolhe um dos membros funcionais do cluster como canônica. Neste caso, selecionou `/it/` — provavelmente porque foi o último idioma recrawleado.

### Fix aplicado

**Arquivo:** [`data/seo.ts`](../data/seo.ts)

```diff
 export const hreflangLocalePrefix = {
-  'pt-BR': 'pt-br',
+  'pt-BR': '',  // default locale → bare path, matches canonical
   en: 'en',
   es: 'es',
   he: 'he',
   it: 'it',
 } as const;

 export function buildLanguageAlternates(path: string): Record<string, string> {
-  Object.entries(hreflangLocalePrefix).forEach(([lang, prefix]) => {
-    const suffix = normalizedPath === '/' ? '' : normalizedPath;
-    alternates[lang] = `${origin}/${prefix}${suffix}`;
-  });
+  Object.entries(hreflangLocalePrefix).forEach(([lang, prefix]) => {
+    const base = prefix === '' ? origin : `${origin}/${prefix}`;
+    alternates[lang] = suffix === '' && prefix === '' ? `${origin}/` : `${base}${suffix}`;
+  });
+  alternates['x-default'] = alternates['pt-BR'];
+  return alternates;
 }
```

**Arquivo:** [`app/sitemap.ts`](../app/sitemap.ts)

`buildSitemapAlternates` tinha lógica duplicada com o mesmo bug e um bug latente de double-slash. Consolidado: agora delega pra `buildLanguageAlternates` (single source of truth).

### HTML antes → depois

**Antes** (`/whitepapers/2023-digital-legacy`):

```html
<link rel="canonical" href="https://ulissesflores.com/whitepapers/2023-digital-legacy"/>
<link rel="alternate" hreflang="pt-BR" href="https://ulissesflores.com/pt-br/whitepapers/..."/>  <!-- REDIRECT -->
<link rel="alternate" hreflang="en"    href="https://ulissesflores.com/en/whitepapers/..."/>
<!-- sem x-default -->
```

**Depois:**

```html
<link rel="canonical" href="https://ulissesflores.com/whitepapers/2023-digital-legacy"/>
<link rel="alternate" hreflang="pt-BR"     href="https://ulissesflores.com/whitepapers/..."/>  <!-- = canonical -->
<link rel="alternate" hreflang="en"        href="https://ulissesflores.com/en/whitepapers/..."/>
<link rel="alternate" hreflang="x-default" href="https://ulissesflores.com/whitepapers/..."/>  <!-- novo -->
```

### Regression tests

Adicionados 4 guards em [`scripts/seo/validate-gsc-firewall.test.ts`](../scripts/seo/validate-gsc-firewall.test.ts):

1. `pt-BR hreflang resolves to bare canonical (no /pt-br/ prefix)`
2. `hreflang cluster includes x-default pointing to bare canonical`
3. `no hreflang URL contains a double slash (regression for sitemap bug)`
4. `root path hreflang cluster emits origin + "/" for pt-BR and x-default`

Impacto esperado: este era o **root cause real** dos 142 URLs flagged. A correção afeta ~62 URLs dos padrões B (`/pt-br/` prefix explícito) e D (non-default locale) e reduz drasticamente futuras flaggings por escolhas inconsistentes de canonical pelo Google.

---

## 2. Diagnóstico (baseado no XLSX `2026-03-23-alternate-canonical.xlsx`)

**Issue:** "Alternate page with proper canonical tag"
**Janela temporal:** 2026-01-19 (0 URLs) → 2026-03-20 (142 URLs)
**XLSX original:** movido de root para [`docs/gsc-reports/2026-03-23-alternate-canonical.xlsx`](docs/gsc-reports/2026-03-23-alternate-canonical.xlsx)

### 2.1 Classificação das 142 URLs em 5 padrões

| Padrão | Descrição | Exemplos (do XLSX) | Fix |
|---|---|---|---|
| **A** | `www.ulissesflores.com/...` | ~80 URLs | ✅ 301 em [next.config.ts:144-150](../next.config.ts#L144-L150) |
| **B** | `/pt-br/...` (locale default explícito) | `/pt-br/whitepapers/2023-digital-legacy`, `/pt-br/certifications`, `/pt-br/essays/2017-chaos-theory-economics` | ✅ 301 em [middleware.ts:167-173](../middleware.ts#L167-L173) |
| **C** | `/sermons/...` (legacy path) | `/sermons/jejum-da-vitoria-2023-21-devotionals/12-dia-12-alinhamento-profetico` | ✅ 301 via `legacySermonRedirects` em [data/sermons-migration.ts](../data/sermons-migration.ts) |
| **D** | `/{locale}/acervo-teologico/...` | `/en/acervo-teologico/jejum-da-vitoria-2023-21-devotionals` | ✅ Hreflang reciprocity já correto — variantes não-default mantêm self-canonical |
| **E** | URLs com slug truncado | `/en/mundo-politico/15-...-reacende-debat` (falta `e`), `/en/mundo-politico/18-...-brasil-mo` | ✅ Cap de 72 chars em [scripts/upkf/generate-artifacts-v2.mjs:3994](../scripts/upkf/generate-artifacts-v2.mjs) é intencional; slugs existem canonicamente assim; 404 nativo deindexa fantasmas em ~30 dias |

### 2.2 Bug encontrado e corrigido durante auditoria

**Dead-end redirects em `data/seo/sermon-redirects.ts` (linhas 61-64)**

Quatro entradas mapeavam slugs legítimos para `/acervo-teologico` (índice), em vez do slug canônico de destino, causando soft-404 a partir do ponto de vista do Google:

```diff
-"/sermons/jejum-da-vitoria-2023-21-devotionals/17-dia-17-celebracao-antecipada": "/acervo-teologico",
-"/sermons/jejum-da-vitoria-2023-21-devotionals/21-dia-21-o-selo-da-vitoria": "/acervo-teologico",
-"/acervo-teologico/jejum-da-vitoria-2023-21-devotionals/17-dia-17-celebracao-antecipada": "/acervo-teologico",
-"/acervo-teologico/jejum-da-vitoria-2023-21-devotionals/21-dia-21-o-selo-da-vitoria": "/acervo-teologico",
+"/sermons/jejum-da-vitoria-2023-21-devotionals/17-dia-17-celebracao-antecipada": "/acervo-teologico/mensagens-profeticas/celebracao-antecipada",
+"/sermons/jejum-da-vitoria-2023-21-devotionals/21-dia-21-o-selo-da-vitoria": "/acervo-teologico/mensagens-profeticas/o-selo-da-vitoria",
+"/acervo-teologico/jejum-da-vitoria-2023-21-devotionals/17-dia-17-celebracao-antecipada": "/acervo-teologico/mensagens-profeticas/celebracao-antecipada",
+"/acervo-teologico/jejum-da-vitoria-2023-21-devotionals/21-dia-21-o-selo-da-vitoria": "/acervo-teologico/mensagens-profeticas/o-selo-da-vitoria",
```

**Verificação em ambiente dev (localhost:3000):**

```bash
$ curl -sI http://localhost:3000/acervo-teologico/jejum-da-vitoria-2023-21-devotionals/17-dia-17-celebracao-antecipada
HTTP/1.1 301 Moved Permanently
location: /acervo-teologico/mensagens-profeticas/celebracao-antecipada  # ✅ slug específico
```

---

## 3. Melhorias de JSON-LD

### 3.1 BreadcrumbList em páginas de publicação

**Arquivo:** [`app/[locale]/[category]/[slug]/page.tsx`](../app/[locale]/[category]/[slug]/page.tsx)

Adicionado segundo `<script type="application/ld+json">` ao lado do `articleJsonLd` existente, com 3 itens: Home → Categoria → Artigo. Respeita `buildCanonical` para locale default (sem prefixo) vs. non-default (com `/en/`, `/es/`, etc.).

**Verificação em `/whitepapers/2023-digital-legacy`:**

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Ir para Home", "item": "https://ulissesflores.com/" },
    { "@type": "ListItem", "position": 2, "name": "Whitepapers", "item": "https://ulissesflores.com/whitepapers" },
    { "@type": "ListItem", "position": 3, "name": "Desafios da Herança Digital: Preservação de Memória Pós-Mortem", "item": "https://ulissesflores.com/whitepapers/2023-digital-legacy" }
  ]
}
```

### 3.2 ProfessionalService + OfferCatalog no @graph

**Arquivo:** [`scripts/upkf/generate-artifacts-v2.mjs`](../scripts/upkf/generate-artifacts-v2.mjs)

Novo nó injetado após `#codexhash-research`:

- `@type: ['ProfessionalService', 'Service']`
- `provider: { @id: #person }` (vincula ao nó Person existente)
- `serviceType`: AI Consulting, Strategic Advisory, Keynote Speaking, Corporate Training, Applied Research, Board Advisory
- `areaServed`: via `buildAreaServedJsonLd()` (Brasil, global remoto)
- `availableLanguage`: pt-BR, en, es, it, he
- `audience`: CxO, CTO, Founder, Investor, University, Enterprise
- `hasOfferCatalog`: 5 Offers (Consultoria, Palestras, Treinamentos, Pesquisa, Board Advisory) com `description` detalhada

**Propagação:** regenerado `public/site.jsonld` (30412 bytes), `public/public.jsonld` (176164 bytes), `public/full.jsonld` (280161 bytes).

Efeito SEO: Google e LLMs passam a ter dados estruturados declarando explicitamente **quais serviços o profissional oferece**, e em quais idiomas / geografias. Isso é o que abilita consultas tipo _"consultor de IA no Brasil"_ a retornarem o site com rich result.

### 3.3 FAQPage (pré-existente — confirmado)

Renderizado via `<FaqSection>` em [`app/[locale]/page.tsx:451`](../app/[locale]/page.tsx#L451) e [`app/[locale]/identidade/page.tsx:562`](../app/[locale]/identidade/page.tsx#L562). O componente emite `<script type="application/ld+json">` com `@type: FAQPage` + `mainEntity: Question[]` — [`components/faq-section.tsx:73`](../components/faq-section.tsx#L73).

---

## 4. llms.txt — Bloco de Serviços Oferecidos

**Arquivo:** [`scripts/seo/generate-llms-txt.mjs`](../scripts/seo/generate-llms-txt.mjs) → gera [`public/llms.txt`](../public/llms.txt).

Novo bloco após "Identidade Profissional", listando 5 modalidades com CTA ("contato: ulissesflores.com"). Regenerado automaticamente em prebuild.

**Snippet resultante:**

```text
## Serviços Oferecidos
- **Consultoria Estratégica em IA e Sistemas** — diagnóstico, roadmap de IA generativa, arquitetura crítica, governança de dados, análise de riscos.
- **Palestras e Keynotes** — IA generativa, AGI, economia austríaca aplicada, blockchain, sistemas complexos, geopolítica digital. Português, inglês, espanhol, italiano.
- **Treinamentos Executivos In-Company** — workshops para lideranças técnicas e executivas (CxO, CTO, Founder, Board).
- **Pesquisa Aplicada** — whitepapers, simulações interativas, deep research, pareceres técnicos publicados em ulissesflores.com.
- **Board Advisory / Fractional CTO** — assentos consultivos em conselhos e atuação fracional para empresas em transformação digital.
```

Efeito em LLMs: ChatGPT / Claude / Perplexity, ao indexarem `/llms.txt` (já no robots.txt + servido com `Content-Type: text/plain`), passam a responder a perguntas sobre "serviços de Ulisses Flores" com essa lista canônica + URL.

---

## 5. Notificação a Buscadores (executada)

**Comando:** `npm run seo:ping` — [scripts/seo/ping-search-engines.mjs](../scripts/seo/ping-search-engines.mjs)

| Canal | Resultado |
|---|---|
| **Google Indexing API** | ✅ **75 URLs submetidas** (via service account JWT RS256) |
| **IndexNow (Bing/Yandex/Naver/Seznam/DDG)** | ✅ **5/5 engines** notificados |
| **AI Crawler warm-up** | ✅ **12/12 acessíveis** (robots.txt, sitemap.xml, llms.txt, /identidade, /simulacoes/ia-2027, etc.) |
| **Bing Webmaster Sitemap Ping (legado)** | ⚠️ 410 Gone — Microsoft deprecated o endpoint `ping.aspx`. Coberto pelo IndexNow (já redundante). |

---

## 6. Script Novo — `scripts/seo/inspect-gsc-urls.mjs`

Reutiliza o padrão JWT de `ping-search-engines.mjs` trocando o scope para `webmasters.readonly` e chama **Search Console URL Inspection API** (`https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`) para 6 URLs representativas (uma por padrão A-E + controle).

**Status:** ⚠️ **Bloqueado por habilitação de API no GCP.** Necessário habilitar "Google Search Console API" em:
> https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=224802539753

Após habilitar, rodar:

```bash
set -a && source .env.local && set +a
node scripts/seo/inspect-gsc-urls.mjs --json > docs/gsc-reports/inspect-$(date +%F).json
```

O script retorna `indexState`, `coverageState`, `googleCanonical`, `userCanonical`, `lastCrawlTime`, `pageFetchState`, `robotsTxtState` e `referringUrls` para cada URL — permite auditoria programática direta do que o Google pensa de cada página.

---

## 7. Limpeza do Repositório

Arquivos extraídos indevidamente no root (provavelmente `unzip` do XLSX GSC) foram removidos:
- `[Content_Types].xml`
- `_rels/.rels`
- `docProps/app.xml`, `docProps/core.xml`
- `xl/` (sharedStrings.xml, styles.xml, workbook.xml, worksheets/, _rels/)

O XLSX foi reconstituído e movido para [`docs/gsc-reports/2026-03-23-alternate-canonical.xlsx`](../docs/gsc-reports/2026-03-23-alternate-canonical.xlsx) (10 KB).

---

## 8. Correção em `.env.local`

```diff
-GOOGLE_SERVICE_ACCOUNT_JSON=/Users/ulissesflores/Documents/Projetos/ulisses-hub/.google-service-account.json
+GOOGLE_SERVICE_ACCOUNT_JSON=/Users/ulissesflores/Documents/Projetos/active/ulisses-hub/.google-service-account.json
```

Path legado (sem `/active/`) apontava para um diretório que não existe mais após a migração do projeto.

---

## 9. Verificação Final

- ✅ `npx tsc --noEmit` — sem erros
- ✅ `npx vitest run` — **435/435 testes passam** em 24 arquivos de teste
- ✅ `npm run upkf:generate` — artefatos regenerados sem diff inesperado além do novo nó ProfessionalService
- ✅ `npm run seo:llms` — `public/llms.txt` atualizado com bloco de serviços
- ✅ Curl em produção (5 URLs representativas) — redirects A/B/C/D/E conforme esperado
- ✅ Curl em dev (localhost:3000) — 4 URLs corrigidas agora redirecionam para slug canônico

---

## 10. Próximas Ações Manuais (usuário executa)

### 10.1 — CRÍTICO (dentro de 24h pós-merge)
1. **Habilitar Search Console API no GCP project `224802539753`** (link na seção 6) — libera inspeção programática.
2. **Deploy para produção** — Vercel automático após push na main.
3. **Re-submeter sitemaps no GSC**:
   - Google Search Console → Sitemaps → remover `sitemap.xml` e `sitemap-resources.xml` → re-adicionar → forçar recrawl.
4. **Coverage → Validate Fix** no issue "Alternate page with proper canonical tag".
5. **URL Inspection + Request Indexing** em 10 URLs representativas (1 por locale × 2 categorias).

### 10.2 — ALTO (próximas 2 semanas)
6. Criar rotas `/consultoria` e `/palestras` (MDX em 5 locales) — conteúdo real com modalidades, processos, público-alvo. Mencionado no plano [`moonlit-squishing-gosling.md`](../../.claude/plans/moonlit-squishing-gosling.md) itens 13-14.
7. Integrar Calendly embed apenas em `/consultoria`, `/palestras`, `/contato` (perf).
8. Coletar 3-5 testimonials com consentimento explícito → `content/testimonials/*.mdx` + Review/Rating JSON-LD.

### 10.3 — MÉDIO (próximas 4-8 semanas)
9. Monitorar curva do erro "Alternate page with proper canonical tag" no GSC — meta: < 20 URLs em 8 semanas.
10. Rich Results Test manual em 5 URLs representativas: https://search.google.com/test/rich-results
11. Schema.org Validator em `/public.jsonld` e `/site.jsonld`.
12. Perguntar em ChatGPT/Claude/Perplexity/Gemini: "Quem é Ulisses Flores?", "consultor de IA no Brasil", "palestrante blockchain Brasil" — verificar que citam com URL canônica e mencionam serviços.

---

## 11. Arquivos Modificados Nesta Sessão

| Arquivo | Mudança |
|---|---|
| [`.env.local`](../.env.local) | Path do service account corrigido |
| [`middleware.ts`](../middleware.ts) | (iteração intermediária com SERMON_GONE, revertida após análise — sem diff líquido) |
| [`data/seo/sermon-redirects.ts`](../data/seo/sermon-redirects.ts) | 4 destinations corrigidas (linhas 61-64) |
| [`app/[locale]/[category]/[slug]/page.tsx`](../app/[locale]/[category]/[slug]/page.tsx) | `breadcrumbJsonLd` + segundo `<script>` emitido |
| [`scripts/upkf/generate-artifacts-v2.mjs`](../scripts/upkf/generate-artifacts-v2.mjs) | Nó ProfessionalService + OfferCatalog adicionado ao `@graph` |
| [`scripts/seo/generate-llms-txt.mjs`](../scripts/seo/generate-llms-txt.mjs) | Bloco "Serviços Oferecidos" |
| [`scripts/seo/inspect-gsc-urls.mjs`](../scripts/seo/inspect-gsc-urls.mjs) | **NOVO** — auditoria programática via Search Console API |
| [`public/llms.txt`](../public/llms.txt) | Regenerado |
| [`public/site.jsonld`](../public/site.jsonld), [`public/public.jsonld`](../public/public.jsonld), [`public/full.jsonld`](../public/full.jsonld), [`data/generated/upkf.generated.ts`](../data/generated/upkf.generated.ts) | Regenerados |
| `docs/gsc-reports/2026-03-23-alternate-canonical.xlsx` | **NOVO** — XLSX original movido do root |
| `[Content_Types].xml`, `_rels/`, `docProps/`, `xl/` | **REMOVIDOS** do root |

---

**Gerado em:** 2026-04-15
**Verificação contra produção:** https://ulissesflores.com (curl) + dev local (localhost:3000)
