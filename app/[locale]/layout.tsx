import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteJsonLd, upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';
import {
  supportedLocales,
  defaultLocale,
  localeToHreflang,
  localeToOgLocale,
  getDirection,
  isLocale,
  type Locale,
} from '@/data/i18n';

import { GlobalHeader } from '@/components/global-header';
import { GlobalFooter } from '@/components/global-footer';
import '../globals.css';

// ─── Site-wide constants ────────────────────────────────────────────────────────

const siteUrl = upkfMeta.primaryWebsite;
const siteOrigin = new URL(siteUrl).origin;
const defaultDescription =
  upkfMeta.description['pt-BR'] ||
  'Cientista economico, analista de sistemas e pesquisador em IA, economia e sistemas complexos.';
const defaultOgImage = `${siteOrigin}/carlos-ulisses-flores-cto.jpg`;

// ─── Static params generation ───────────────────────────────────────────────────

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

// ─── Dynamic metadata ───────────────────────────────────────────────────────────

type LayoutProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const ogLocale = localeToOgLocale[locale];
  const alternateOgLocales = supportedLocales
    .filter((l) => l !== locale)
    .map((l) => localeToOgLocale[l]);

  return {
    metadataBase: new URL(siteOrigin),
    title: {
      default: `${upkfMeta.preferredName} Flores | CTO, Pesquisa e Engenharia`,
      template: `%s | ${upkfMeta.preferredName} Flores`,
    },
    applicationName: 'ulissesflores.com',
    description: defaultDescription,
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${siteOrigin}/identidade`,
      },
    ],
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
      locale: ogLocale,
      alternateLocale: alternateOgLocales,
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
}

// ─── Root Layout ────────────────────────────────────────────────────────────────

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const hreflang = localeToHreflang[locale];
  const dir = getDirection(locale);

  return (
    <html lang={hreflang} dir={dir}>
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
