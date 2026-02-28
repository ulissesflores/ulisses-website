import type { NextConfig } from "next";
import { legacySermonRedirects } from "./data/sermons-migration";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:locale(pt-br|en|es|he|it)/:path*",
          destination: "/:path*",
        },
      ],
    };
  },
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

    return [...legacyRedirects, ...legacySermonRedirects, ...subdomainRedirects];
  },
};

export default nextConfig;
