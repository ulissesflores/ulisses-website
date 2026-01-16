import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
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

    return Object.entries(subdomains).map(([sub, destination]) => ({
      source: "/:path*",
      has: [{ type: "host", value: `${sub}.ulissesflores.com` }],
      destination,
      permanent: true, // 301 Permanente (Melhor para SEO)
    }));
  },
};

export default nextConfig;
