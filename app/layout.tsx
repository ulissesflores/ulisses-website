import type { Metadata } from 'next';
import { siteJsonLd, upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';
import { GlobalHeader } from '@/components/global-header';
import { GlobalFooter } from '@/components/global-footer';
import './globals.css';

const siteUrl = upkfMeta.primaryWebsite;
const siteOrigin = new URL(siteUrl).origin;
const defaultDescription =
  upkfMeta.description['pt-BR'] ||
  'Cientista economico, analista de sistemas e pesquisador em IA, economia e sistemas complexos.';
const defaultOgImage = `${siteOrigin}/carlos-ulisses-flores-cto.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: `${upkfMeta.preferredName} Flores | CTO, Pesquisa e Engenharia`,
    template: `%s | ${upkfMeta.preferredName} Flores`,
  },
  applicationName: 'ulissesflores.com',
  description: defaultDescription,
  authors: [{ name: upkfMeta.publicDisplayName || upkfMeta.displayName, url: `${siteOrigin}/identidade` }],
  creator: upkfMeta.publicDisplayName || upkfMeta.displayName,
  publisher: 'Codex Hash Research',
  keywords: [
    'Ulisses Flores',
    'Carlos Ulisses Flores',
    'Codex Hash',
    'research',
    'artificial intelligence',
    'economics',
    'systems engineering',
    'theology',
    'ORCID 0000-0002-6034-7765',
  ],
  category: 'Research',
  classification: 'Science and Technology',
  alternates: {
    canonical: '/',
    languages: buildLanguageAlternates('/'),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: siteOrigin,
    title: `${upkfMeta.preferredName} Flores | CTO, Pesquisa e Engenharia`,
    description: defaultDescription,
    siteName: 'ulissesflores.com',
    locale: 'pt_BR',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Ulisses Flores - profile and research hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${upkfMeta.preferredName} Flores | CTO, Pesquisa e Engenharia`,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  icons: {
    icon: '/carlos-ulisses-flores-cto.jpg',
    apple: '/carlos-ulisses-flores-cto.jpg',
  },
  other: {
    'geo.region': 'BR-SP',
    'geo.placename': 'Sao Paulo',
    'geo.position': '-23.5505;-46.6333',
    ICBM: '-23.5505, -46.6333',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body className='antialiased'>
        <GlobalHeader />
        <script
          id='structured-data-site'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
        <GlobalFooter />
      </body>
    </html>
  );
}
