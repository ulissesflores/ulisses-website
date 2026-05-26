# Monitoramento de indexação GSC — D+3 / D+7 / D+14

Re-inspeciona o mesmo conjunto canônico da baseline (`baseline-2026-05-26.json`) e salva um
checkpoint datado, para medir o efeito do recrawl do Google nas correções deployadas em
2026-05-26 (sitemap comercial, nav, footer, home CTA).

> [!NOTE]
> Roda **localmente** (a service account do GSC está em `~/Developer/ulisses-hub/.google-service-account.json`;
> um agente remoto não a tem). A SA é read-only e nunca é exposta em logs/commits.

## Comando (uma execução)

```bash
cd ~/Developer/ulisses-website
GOOGLE_SERVICE_ACCOUNT_JSON=~/Developer/ulisses-hub/.google-service-account.json \
  node scripts/seo/gsc-monitor.mjs --json > docs/gsc-reports/checkpoint-d3-2026-05-29.json
```

Taxa de indexação a partir do checkpoint:

```bash
node -e 'const r=require("./docs/gsc-reports/checkpoint-d3-2026-05-29.json").results||[];const i=r.filter(x=>(x.summary&&x.summary.coverageState)==="Submitted and indexed").length;console.log("indexado:",i+"/"+r.length,"=",Math.round(i/r.length*100)+"%")'
```

## Cron de sistema (one-shot — remover após 2026-06-09)

```cron
13 9 29 5 * cd ~/Developer/ulisses-website && GOOGLE_SERVICE_ACCOUNT_JSON=~/Developer/ulisses-hub/.google-service-account.json node scripts/seo/gsc-monitor.mjs --json > docs/gsc-reports/checkpoint-d3-2026-05-29.json
13 9 2 6 *  cd ~/Developer/ulisses-website && GOOGLE_SERVICE_ACCOUNT_JSON=~/Developer/ulisses-hub/.google-service-account.json node scripts/seo/gsc-monitor.mjs --json > docs/gsc-reports/checkpoint-d7-2026-06-02.json
13 9 9 6 *  cd ~/Developer/ulisses-website && GOOGLE_SERVICE_ACCOUNT_JSON=~/Developer/ulisses-hub/.google-service-account.json node scripts/seo/gsc-monitor.mjs --json > docs/gsc-reports/checkpoint-d14-2026-06-09.json
```

## Critério de sucesso (refinado, por regra do goal)

`THIN_CONTENT` (sermões devocionais, certs, mundo-político, artigos boilerplate) **não conta**
— o Google os descobriu mas não indexa por qualidade (Fase 2). O alvo ≥90% aplica-se às páginas
de alto valor por idioma: home, identidade, research-index, e as comerciais
(`/consultoria`, `/palestras`) que acabaram de virar descobríveis.

## Notas

- A baseline tem o artefato dos paths legados `/sermons/` (redirect 301); para o status real
  dos sermões, inspecione os canônicos `/acervo-teologico/...` (no sitemap).
- Acelerar indexação: "Solicitar Indexação" manual no GSC — ver `priority-submit-2026-05-26.md`.
