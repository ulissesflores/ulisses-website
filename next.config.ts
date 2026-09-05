import type { NextConfig } from "next";
import { legacySermonRedirects } from "./data/sermons-migration";

const nextConfig: NextConfig = {
  // Locale rewrites removed — converted to 301 redirects below to fix GSC "Alternate page with canonical" errors
  async headers() {
    // ── Security Headers (Lote 23 — Enterprise Grade) ─────────────────────────
    // O runtime de desenvolvimento do Next avalia string como JavaScript (HMR).
    // Sem 'unsafe-eval' o React não hidrata em `npm run dev` e NADA no site é
    // interativo localmente — menu, acordeões, seletor de idioma. Medido em
    // 2026-08-01: o clique no hambúrguer não tinha efeito e o console acusava
    // "Evaluating a string as JavaScript violates ... script-src". Produção
    // continua sem 'unsafe-eval'.
    const isDev = process.env.NODE_ENV !== 'production';
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https: blob:",
          "connect-src 'self' https://generativelanguage.googleapis.com https://vitals.vercel-insights.com",
          // Allow YouTube embeds (privacy-enhanced and standard) for sermon
          // watch pages — required to satisfy Google's "Video isn't on a watch
          // page" check (WNC-10031170). Without frame-src, embeds inherit
          // default-src 'self' and YouTube iframes are blocked.
          "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
    ];

    return [
      // Global security headers for all routes
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // ── Per-route headers ─────────────────────────────────────────────────
      {
        source: "/.well-known/did.json",
        headers: [
          { key: "Content-Type", value: "application/did+ld+json; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/.well-known/keybase.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
        ],
      },
      {
        source: "/llms.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        source: "/llms-full.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      // Canonical for PDFs (can't have HTML canonical tags — fixes GSC "Duplicate without canonical")
      {
        source: "/deep-research/:slug/deep-research.pdf",
        headers: [
          { key: "Link", value: "<https://ulissesflores.com/deep-research/:slug/deep-research.pdf>; rel=\"canonical\"" },
        ],
      },
      // Non-page metadata files should not be indexed
      {
        source: "/public.jsonld",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
  async redirects() {
    const legacyRedirects = [
      {
        source: "/keybase.txt",
        destination: "/.well-known/keybase.txt",
        permanent: true,
      },
      {
        source: "/sovereign-identity",
        destination: "/identidade",
        permanent: true,
      },
      {
        source: "/sovereign-identity-hub",
        destination: "/identidade",
        permanent: true,
      },
    ];

    // Projeto PSI → whitepapers route migration (301)
    const psiRedirect = {
      source: '/simulacoes/projeto-psi',
      destination: '/whitepapers/projeto-psi',
      permanent: true,
    };

    // Rapaduria-2027 → ia-2027 route migration (301s)
    const rapaduriaRedirects = [
      {
        source: "/simulacoes/rapaduria-2027",
        destination: "/simulacoes/ia-2027",
        permanent: true,
      },
      {
        source: "/simulacoes/rapaduria-2027/freio",
        destination: "/simulacoes/ia-2027/desaceleracao-coordenada",
        permanent: true,
      },
      {
        source: "/simulacoes/rapaduria-2027/carroca",
        destination: "/simulacoes/ia-2027/corrida-estrategica",
        permanent: true,
      },
    ];

    // Atalhos curtos impressos nos cards sociais (o leitor DIGITA de um print).
    // Um atalho por artigo e por idioma; o registro vive na pauta da redação.
    // `redirects()` roda ANTES do middleware, então `/llm` não colide com o
    // rewrite de locale nem com o segmento [locale] das rotas.
    const atalhosCards = [
      { source: '/openai',    destination: '/artigos/estatisticas-openai',    permanent: true },
      { source: '/openai-en', destination: '/en/artigos/estatisticas-openai', permanent: true },
      { source: '/openai-es', destination: '/es/artigos/estatisticas-openai', permanent: true },
      { source: '/openai-it', destination: '/it/artigos/estatisticas-openai', permanent: true },
      { source: '/openai-he', destination: '/he/artigos/estatisticas-openai', permanent: true },
      { source: '/modelos',    destination: '/artigos/estatisticas-llms',    permanent: true },
      { source: '/modelos-en', destination: '/en/artigos/estatisticas-llms', permanent: true },
      { source: '/modelos-es', destination: '/es/artigos/estatisticas-llms', permanent: true },
      { source: '/modelos-it', destination: '/it/artigos/estatisticas-llms', permanent: true },
      { source: '/modelos-he', destination: '/he/artigos/estatisticas-llms', permanent: true },
      { source: '/llm',    destination: '/artigos/memoria-llm-local',    permanent: true },
      { source: '/llm-en', destination: '/en/artigos/memoria-llm-local', permanent: true },
      { source: '/llm-es', destination: '/es/artigos/memoria-llm-local', permanent: true },
      { source: '/llm-it', destination: '/it/artigos/memoria-llm-local', permanent: true },
      { source: '/llm-he', destination: '/he/artigos/memoria-llm-local', permanent: true },
      { source: '/marca',    destination: '/artigos/marca-dagua-claude',    permanent: true },
      { source: '/marca-en', destination: '/en/artigos/marca-dagua-claude', permanent: true },
      { source: '/marca-es', destination: '/es/artigos/marca-dagua-claude', permanent: true },
      { source: '/marca-it', destination: '/it/artigos/marca-dagua-claude', permanent: true },
      { source: '/marca-he', destination: '/he/artigos/marca-dagua-claude', permanent: true },
      { source: '/tokens',    destination: '/artigos/tokens-por-dolar',    permanent: true },
      { source: '/tokens-en', destination: '/en/artigos/tokens-por-dolar', permanent: true },
      { source: '/tokens-es', destination: '/es/artigos/tokens-por-dolar', permanent: true },
      { source: '/tokens-it', destination: '/it/artigos/tokens-por-dolar', permanent: true },
      { source: '/tokens-he', destination: '/he/artigos/tokens-por-dolar', permanent: true },
      { source: '/restricao',    destination: '/artigos/teoria-das-restricoes', permanent: true },
      { source: '/restricao-en', destination: '/en/artigos/teoria-das-restricoes', permanent: true },
      { source: '/restricao-es', destination: '/es/artigos/teoria-das-restricoes', permanent: true },
      { source: '/restricao-it', destination: '/it/artigos/teoria-das-restricoes', permanent: true },
      { source: '/restricao-he', destination: '/he/artigos/teoria-das-restricoes', permanent: true },
      { source: '/agentes',    destination: '/artigos/estatisticas-agentes-de-ia',    permanent: true },
      { source: '/agentes-en', destination: '/en/artigos/estatisticas-agentes-de-ia', permanent: true },
      { source: '/agentes-es', destination: '/es/artigos/estatisticas-agentes-de-ia', permanent: true },
      { source: '/agentes-it', destination: '/it/artigos/estatisticas-agentes-de-ia', permanent: true },
      { source: '/agentes-he', destination: '/he/artigos/estatisticas-agentes-de-ia', permanent: true },
      { source: '/par',    destination: '/artigos/benchmark-harness-modelo',    permanent: true },
      { source: '/par-en', destination: '/en/artigos/benchmark-harness-modelo', permanent: true },
      { source: '/par-es', destination: '/es/artigos/benchmark-harness-modelo', permanent: true },
      { source: '/par-it', destination: '/it/artigos/benchmark-harness-modelo', permanent: true },
      { source: '/par-he', destination: '/he/artigos/benchmark-harness-modelo', permanent: true },
      { source: '/trabalho',    destination: '/artigos/ia-mercado-de-trabalho',    permanent: true },
      { source: '/trabalho-en', destination: '/en/artigos/ia-mercado-de-trabalho', permanent: true },
      { source: '/trabalho-es', destination: '/es/artigos/ia-mercado-de-trabalho', permanent: true },
      { source: '/trabalho-it', destination: '/it/artigos/ia-mercado-de-trabalho', permanent: true },
      { source: '/trabalho-he', destination: '/he/artigos/ia-mercado-de-trabalho', permanent: true },
      { source: '/flash',    destination: '/artigos/glm-5-3-flash',    permanent: true },
      { source: '/flash-en', destination: '/en/artigos/glm-5-3-flash', permanent: true },
      { source: '/flash-es', destination: '/es/artigos/glm-5-3-flash', permanent: true },
      { source: '/flash-it', destination: '/it/artigos/glm-5-3-flash', permanent: true },
      { source: '/flash-he', destination: '/he/artigos/glm-5-3-flash', permanent: true },
      { source: '/deepfake',    destination: '/artigos/estatisticas-deepfakes',    permanent: true },
      { source: '/deepfake-en', destination: '/en/artigos/estatisticas-deepfakes', permanent: true },
      { source: '/deepfake-es', destination: '/es/artigos/estatisticas-deepfakes', permanent: true },
      { source: '/deepfake-it', destination: '/it/artigos/estatisticas-deepfakes', permanent: true },
      { source: '/deepfake-he', destination: '/he/artigos/estatisticas-deepfakes', permanent: true },
    ];

    // Locale handling (double-locale 410 + single-locale 301 + i18n rewrite) moved to middleware.ts
    // to ensure correct evaluation order: 410 fires before 301 stripping before locale rewrite.

    // Canonical host: www → non-www (defense-in-depth; Vercel Dashboard is primary control)
    const canonicalHostRedirect = {
      source: "/:path*",
      has: [{ type: "host" as const, value: "www.ulissesflores.com" }],
      destination: "https://ulissesflores.com/:path*",
      permanent: true,
    };

    // Lista de subdomínios e seus destinos
    const subdomains: Record<string, string> = {
      facebook: "https://www.facebook.com/UlissesFls",
      github: "https://github.com/ulissesflores", // Assumi seu user baseado no contexto, ajuste se necessário
      gmb: "https://share.google/HZs8K6Fkzb5C7Ezxl",
      instagram: "https://www.instagram.com/ulissesflores",
      lattes: "https://lattes.cnpq.br/6905246706890561",
      linkedin: "https://www.linkedin.com/in/ulisses-flores-75961921",
      orcid: "https://orcid.org/0000-0002-6034-7765",
    };

    const subdomainRedirects = Object.entries(subdomains).map(([sub, destination]) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: `${sub}.ulissesflores.com` }],
      destination,
      permanent: true, // 301 Permanente (Melhor para SEO)
    }));

    return [
      canonicalHostRedirect,
      psiRedirect,
      ...rapaduriaRedirects,
      ...atalhosCards,
      ...legacyRedirects,
      ...legacySermonRedirects,
      ...subdomainRedirects,
    ];
  },
};

export default nextConfig;
