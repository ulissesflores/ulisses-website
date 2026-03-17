# Ulisses Flores — Sovereign Digital Hub

![SOTA Score](https://img.shields.io/badge/SOTA_Score-1000%2F1000-00c853?style=for-the-badge&logo=checkmarx&logoColor=white)
![E2E Tests](https://img.shields.io/badge/E2E-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-5_Locales-blue?style=for-the-badge&logo=googletranslate&logoColor=white)
![JSON-LD](https://img.shields.io/badge/JSON--LD-Schema.org-FF6D00?style=for-the-badge&logo=json&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Security](https://img.shields.io/badge/Security-CSP%20%7C%20HSTS%20%7C%20DENY-critical?style=for-the-badge&logo=letsencrypt&logoColor=white)

> Hub canónico de identidade soberana, publicações científicas, acervo teológico e simulações prospectivas — orquestrado por uma esteira de automação SOTA com tolerância zero a falhas.

---

## Índice

- [Filosofia SOTA](#️-filosofia-sota--o-código-é-a-lei)
- [Motor de Localização Contínua](#-motor-de-localização-contínua)
- [Arquitetura CI/CD](#️-arquitetura-cicd)
- [Security Hardening](#-security-hardening)
- [Estrutura do Projecto](#-estrutura-do-projecto)
- [Desenvolvimento](#-desenvolvimento)
- [Métricas Actuais](#-métricas-actuais)

---

## 🛡️ Filosofia SOTA — O Código é a Lei

Este repositório opera sob o princípio **"O Código é a Lei"** — nenhuma mudança entra no repositório sem prova matemática de conformidade.

### TDD Adversarial E2E First

Não confiamos apenas em testes unitários. A partir do Lote 23, todo comportamento crítico é testado em **Caixa Preta** com Playwright:

| Camada | Ferramenta | O Que Valida |
|---|---|---|
| **Unitário** | Vitest (298 testes) | Funções puras, paridade i18n, JSON-LD, anti-DRY |
| **Adversarial E2E** | Playwright (13 testes) | Security headers reais, RTL no DOM, 404 no browser |
| **Estrutural** | Scripts SOTA | Canonical URLs, Hreflang, Rich Results, DID |

### Regra Zero Warning

O console não emite nenhum warning de ESLint, MarkdownLint ou Paridade i18n. Qualquer warning é tratado como falha.

---

## 🌍 Motor de Localização Contínua

O site suporta **5 idiomas** com tradução automatizada e paridade estrutural:

| Flag | Locale | Direção | Tipo |
|---|---|---|---|
| 🇧🇷 | `pt-BR` | LTR | Fonte (autoral) |
| 🇺🇸 | `en` | LTR | Traduzido (Gemini API) |
| 🇪🇸 | `es` | LTR | Traduzido (Gemini API) |
| 🇮🇹 | `it` | LTR | Traduzido (Gemini API) |
| 🇮🇱 | `he` | **RTL** | Traduzido (Gemini API) |

### Esteira de Tradução

```text
 Markdown PT-BR (autoral)
        │
        ▼
 upkf:generate  ──►  .generated.ts (publicações, UPKF, knowledge)
        │
        ▼
 translate-generated-artifacts.mjs  ──►  Gemini API  ──►  i18n dicts
        │
        ▼
 validate-parity.mjs  ──►  4420 chaves × 4 locales  ──►  ✅ ou ❌
        │
        ▼
 next build (SSG)  ──►  JSON-LD / Hreflang / llms.txt  ──►  Deploy
```

### Anti-DRY Enforcement

A matriz de locales (`['en', 'es', 'it', 'he']`) é definida **uma única vez** em `scripts/config/i18n.config.mjs`. Testes automatizados (`anti-dry.test.ts`) falham se qualquer script hardcoda locales fora da pasta `config/`.

---

## ⚙️ Arquitetura CI/CD

### `npm run sota:check` — Validação Rápida (6 gates, ~2s)

Executa no pre-commit via Husky. Sem build, sem rede.

| Gate | Ferramenta | Validação |
|---|---|---|
| 1/6 | `tsc --noEmit` | Zero erros de tipagem |
| 2/6 | `markdownlint` | Qualidade do Markdown fonte |
| 3/6 | `validate-parity.mjs` | 4420 chaves × 4 locales |
| 4/6 | `vitest run` | 298 testes unitários |
| 5/6 | `validate-pre-deploy.mjs` | Canonical URLs, Hreflang, Meta |
| 6/6 | `validate-rich-results.mjs` | JSON-LD, DID, Rich Results |

### `npm run sota:full` — Validação Completa (8 gates)

Inclui as 6 gates acima + Playwright E2E + Build SSG.

| Gate | Ferramenta | Validação |
|---|---|---|
| 7/8 | `playwright test` | Security headers, RTL, 404 (browser real) |
| 8/8 | `next build` | Build SSG completo |

### ADRs (Architecture Decision Records)

- **ADR-0002** — Automated Translation Pipeline (Gemini API post-build)
- **ADR-0003** — Master Validation Pipeline (`sota:check`)

---

## 🔒 Security Hardening

Headers de segurança Enterprise injectados em **todas as rotas** via `next.config.ts`:

| Header | Valor | Propósito |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; frame-ancestors 'none'` | Previne XSS, clickjacking |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Força HTTPS (2 anos) |
| `X-Frame-Options` | `DENY` | Anti-clickjacking |
| `X-Content-Type-Options` | `nosniff` | Previne MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controla informação de referer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Nega APIs sensíveis |

### Error Boundaries

- `error.tsx` — Captura erros em páginas (graceful degradation)
- `global-error.tsx` — Captura falhas no root layout (crash recovery)

---

## 📂 Estrutura do Projecto

```text
ulisses-hub/
├── app/[locale]/           # Rotas Next.js (SSG) por locale
├── components/             # Componentes React (Server Components)
├── content/                # 📄 Conteúdo MDX (Zero Hardcoded — Lote 28)
│   ├── publications/       #   8 artigos de pesquisa (5 locales cada)
│   ├── essays/             #   5 ensaios teológicos/filosóficos
│   ├── whitepapers/        #   5 whitepapers técnicos
│   └── simulations/        #   Simulação interativa IA-2027
├── data/
│   ├── generated/          # Artefactos gerados (UPKF, publicações)
│   └── i18n/               # Dicionários i18n (pt-br, en, es, it, he)
├── lib/content/            # MDX loader + componentes (next-mdx-remote)
├── scripts/
│   ├── config/             # Single Source of Truth (i18n, cognatos)
│   ├── content/            # ContentOps publisher (publish.mjs)
│   ├── i18n/               # Tradução e validação de paridade
│   ├── seo/                # Validação SEO, Rich Results, llms.txt
│   └── sota-validate.mjs   # Orquestrador da esteira SOTA
├── tests/e2e/              # Playwright E2E (TDD Adversarial)
├── docs/decisions/         # ADRs (Architecture Decision Records)
├── public/                 # Assets estáticos, .jsonld, llms.txt
└── playwright.config.ts    # Configuração E2E
```

### ContentOps: Publicar Novo Conteúdo

```bash
# 1. Escreva um artigo em content/essays/meu-artigo/index.pt-br.mdx
# 2. Rode o comando mágico:
npm run content:publish

# Ou valide sem commit:
npm run content:publish:dry
```

O `content:publish` executa automaticamente: Quality Gate → Tradução Gemini → Regeneração SOTA → Git Commit.

---

## 🚀 Desenvolvimento

```bash
# Instalar dependências
npm install

# Dev server
npm run dev

# Validação rápida (pre-commit)
npm run sota:check

# Validação completa (com E2E + Build)
npm run sota:full

# Testes E2E isolados
npm run test:e2e

# Build de produção
npm run build
```

---

## 📊 Métricas Actuais

| Métrica | Valor |
|---|---|
| Testes Unitários | **298** (19 suites) |
| Testes E2E | **13** (3 specs) |
| Gates SOTA (check) | **6** |
| Gates SOTA (full) | **8** |
| Chaves i18n | **4420** |
| Locales | **5** (PT-BR, EN, ES, IT, HE) |
| JSON-LD Nodes | **22** páginas com `application/ld+json` |
| Security Headers | **7** (CSP, HSTS, X-Frame, XCTO, Referrer, Permissions, DNS) |
| Ficheiros MDX | **91** (19 pt-br + 72 traduções) |
| ADRs | **5** |
| Score SOTA | **1000/1000** |

---

*Mantido por [Carlos Ulisses Flores](https://ulissesflores.com) — CTO, Codex Hash Ltda.*
