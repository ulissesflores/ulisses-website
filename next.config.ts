import type { NextConfig } from "next";
import { legacySermonRedirects } from "./data/sermons-migration";

const nextConfig: NextConfig = {
  // Locale rewrites removed — converted to 301 redirects below to fix GSC "Alternate page with canonical" errors
  async headers() {
    return [
      {
        source: "/.well-known/did.json",
        headers: [
          { key: "Content-Type", value: "application/did+ld+json; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
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

    // Fix GSC 404s: double-locale prefix pattern (e.g. /he/he/path, /it/en/path)
    const doubleLocaleRedirect = {
      source: "/:locale1(pt-br|en|es|he|it)/:locale2(pt-br|en|es|he|it)/:path*",
      destination: "/:path*",
      permanent: true,
    };

    // Fix GSC 404s: single-locale prefix pattern (e.g. /pt-br/path, /he/path)
    // Converted from beforeFiles rewrites to 301 redirects to fix "Alternate page with canonical" errors
    const singleLocaleRedirect = {
      source: "/:locale(pt-br|en|es|he|it)/:path*",
      destination: "/:path*",
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
      doubleLocaleRedirect,
      singleLocaleRedirect,
      psiRedirect,
      ...rapaduriaRedirects,
      ...legacyRedirects,
      ...legacySermonRedirects,
      ...subdomainRedirects,
    ];
  },
};

export default nextConfig;
