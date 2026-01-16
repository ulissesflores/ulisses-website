import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // Importante para injetar o JSON-LD

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carlos Ulisses Flores | CTO, Economista e Pesquisador em IA",
  description: "Cientista Econômico e Analista de Sistemas focado em IA, Blockchain e Finanças Quantitativas. Pesquisador Chefe na Codex Hash Ltda.",
  icons: {
    icon: "/carlos-ulisses-flores-cto.jpg",
    apple: "/carlos-ulisses-flores-cto.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://ulissesflores.com/#person",
        "name": "Carlos Ulisses Flores",
        "alternateName": ["Ulisses Flores", "Carlos Ulisses Flores Ribeiro"],
        "jobTitle": ["CTO", "Economista", "Analista de Sistemas"],
        "description": "Cientista Econômico e Pesquisador Polímata com mais de 28 anos de experiência na convergência entre Finanças e IA.",
        "url": "https://ulissesflores.com",
        "sameAs": [
          "http://lattes.cnpq.br/6905246706890561",
          "https://www.linkedin.com/in/ulisses-flores-75961921",
          "https://github.com/ulissesflores"
        ]
      },
      {
        "@type": "ProfessionalService",
        "name": "Codex Hash Ltda",
        "image": "https://ulissesflores.com/carlos-ulisses-flores-cto.jpg",
        "telephone": "+55-11-97272-7532",
        "url": "https://ulissesflores.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "R. Paschoal Poli, 95",
          "addressLocality": "Itupeva",
          "addressRegion": "SP",
          "postalCode": "13295-570",
          "addressCountry": "BR"
        }
      }
    ]
  };

  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Injeção do Schema do Google */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}