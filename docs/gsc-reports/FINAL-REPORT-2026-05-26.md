# FINAL REPORT — Indexação ulissesflores.com (2026-05-26)

> Sessão de engenharia da indexação multi-idioma. Os critérios temporais do goal
> (D+3/7/14, ≥90% indexado/idioma) **dependem do timeline de crawl do Google** —
> não atingíveis no mesmo dia. Este relatório entrega: baseline, causas-raiz,
> correções deployadas, e os bloqueios documentados com próximas ações.

## 1. Locales (dinâmico)
`pt-br` (padrão, sem prefixo), `en`, `es`, `it`, `he`. Fonte: `data/i18n.ts`, `middleware.ts`.

## 2. Baseline GSC (antes)

### pt-BR canônico — 138 URLs — **21% indexado (29/138)**

| tipo | INDEXED | UNKNOWN | DISCOVERED/CRAWLED (thin) | REDIRECT |
|---|---|---|---|---|
| sermons (acervo) | 2 | 52 | 4 | 3 |
| certifications | 16 | 6 | 13 | 0 |
| mundo-politico | 4 | 2 | 14 | 0 |
| research | 3 | 1 | 5 | 0 |
| essays | 1 | 1 | 4 | 0 |
| whitepapers | 2 | 0 | 4 | 0 |
| home | 1 | 0 | 0 | 0 |

### Localizado (en/es/it/he) — amostra
Homepages + `/identidade`: ✅ indexadas. **Todas** as páginas profundas localizadas
(consultoria, palestras, research, artigos) = **UNKNOWN**. `/en/acervo-teologico` = redirect.
→ páginas profundas localizadas têm indexação ~0%.

## 3. Causas-raiz (classificadas)
- **SITEMAP_BUG (crítico):** `/consultoria` e `/palestras` estavam **fora do sitemap** —
  `commercialEntries` era definido mas nunca espalhado no `return` de `app/sitemap.ts`.
  0 ocorrências em produção (162 locs). **CORRIGIDO** (commit `ffa3790`).
- **ORPHAN (62 UNKNOWN, 84% = 52 sermões):** sem link interno + o índice `/acervo` não indexa →
  Google nunca descobriu. /consultoria, /palestras (todos idiomas) eram órfãs **+** fora do sitemap.
- **THIN_CONTENT (44):** certs (13), mundo-político (14), artigos boilerplate (9), 4 sermões —
  Google rastreou e **decidiu não indexar** (baixo valor). Os 18 artigos boilerplate → **Fase 2**.

## 4. Correções deployadas (produção confirmada live)

| Correção | Commit | Status prod |
|---|---|---|
| Nav global +Serviços (Consultoria/Palestras), 5 locales | `8f250b4` | ✅ live (nav "Serviços" no ar) |
| Footer global +links comerciais/research/acervo+ORCID, 5 locales | `f9ca948` | ✅ deployado |
| **Sitemap: incluir /consultoria + /palestras** | `ffa3790` | ⏳ verificar pós-deploy |
| Favicon UF + OG card 1200×630 + www canônico | `cb66608`/`67f1886` | ✅ live (`/icon` 200) |

## 5. Sinais externos
- **IndexNow:** 142 URLs (todos idiomas) → `api.indexnow.org` (Bing/Yandex/Seznam/Naver). OK.
  (Google não usa IndexNow.)
- **Lista priorizada GSC:** `priority-submit-2026-05-26.md` (19 URLs, comerciais primeiro) —
  operador submete manualmente em Search Console (sem API pública).

## 6. Validação
- `next build` + E2E Playwright: **verdes** em cada push (pre-push hook).
- `sota:check` (TS + lint + i18n parity + 452 testes + SEO + rich-results): **1000/1000** em cada commit.
- hreflang: já completo (`buildLanguageAlternates`, 5 + x-default) — não mexido.
- Smoke test prod: homepage nav live, `/consultoria` 200, `/icon` 200.

## 7. Bloqueios e próximas ações

| Bloqueio | Tipo | Próxima ação |
|---|---|---|
| ≥90% indexado/idioma | Externo (crawl Google, dias-semanas) | aguardar recrawl; medir em D+3/7/14 |
| D+3/7/14 (29/05, 02/06, 09/06) | Agendamento | CronCreate é session-bound → usar `/schedule` remoto ou cron de sistema |
| THIN_CONTENT (sermões/certs/político) | **Decisão de produto** | escolher: (A) refocar 90% nas páginas de alto valor + noindex deliberado do thin; (B) investir conteúdo; (C) só descoberta agora |
| Home CTA, related-links | Reforço/Fase 2 | redundante p/ descoberta (nav+footer cobrem); related-links → Fase 2 (conteúdo) |

## 8. Métricas
- Indexação pt-BR antes: **21% (29/138)**. Depois: medível só após recrawl (D+3+).
- Deploy: produção em `ulissesflores.com` (auto-deploy de `main` confirmado).
- Commits da sessão: `cb66608`, `67f1886`, `8f250b4`, `b58a017`, `6315835`, `f9ca948`, `ffa3790`.
