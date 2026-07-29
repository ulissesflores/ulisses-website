import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Noto_Sans_Hebrew } from 'next/font/google';
import { siteJsonLd, upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates, buildCanonical, defaultOgImages } from '@/data/seo';
import {
  supportedLocales,
  defaultLocale,
  localeToHreflang,
  localeToOgLocale,
  getDirection,
  isLocale,
  type Locale,
} from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { I18nProvider } from '@/lib/i18n-context';

import { GlobalHeader } from '@/components/global-header';
import { GlobalFooter } from '@/components/global-footer';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../globals.css';

// ─── Fonts ──────────────────────────────────────────────────────────────────────

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-hebrew',
});

// ─── Site-wide constants ────────────────────────────────────────────────────────

const siteUrl = upkfMeta.primaryWebsite;
const siteOrigin = new URL(siteUrl).origin;
const defaultDescription =
  upkfMeta.description['pt-BR'] ||
  'Cientista economico, analista de sistemas e pesquisador em IA, economia e sistemas complexos.';

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
  const dict = await getDictionary(locale);
  const ogLocale = localeToOgLocale[locale];
  const alternateOgLocales = supportedLocales
    .filter((l) => l !== locale)
    .map((l) => localeToOgLocale[l]);

  return {
    metadataBase: new URL(siteOrigin),
    title: {
      default: dict.home.meta.title,
      template: `%s | ${upkfMeta.preferredName} Flores`,
    },
    applicationName: 'ulissesflores.com',
    description: dict.home.meta.description,
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${siteOrigin}/identidade`,
      },
    ],
    creator: upkfMeta.publicDisplayName || upkfMeta.displayName,
    publisher: 'Codex Hash Research',
    keywords: [...dict.home.meta.keywords],
    category: 'Research',
    classification: 'Science and Technology',
    alternates: {
      canonical: buildCanonical(locale, '/'),
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
      images: defaultOgImages(locale),
      type: 'website',
      url: siteOrigin,
      title: dict.home.meta.ogTitle,
      description: dict.home.meta.ogDescription,
      siteName: 'ulissesflores.com',
      locale: ogLocale,
      alternateLocale: alternateOgLocales,
      // A imagem vem de defaultOgImages (aponta para a rota opengraph-image.tsx,
      // 1200x630). Declarada explicitamente porque a convenção de arquivo NÃO
      // sobrevive à substituição do openGraph nas rotas filhas — ver data/seo.ts.
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.home.meta.ogTitle,
      description: dict.home.meta.ogDescription,
      // twitter image inherits the opengraph-image route
    },
    // icons handled by file-convention routes: app/icon.tsx, app/apple-icon.tsx, app/manifest.ts
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
  const dict = await getDictionary(locale);

  const hebrewFontClass = locale === 'he' ? notoSansHebrew.variable : '';

  return (
    <html lang={hreflang} dir={dir} className={hebrewFontClass}>
      <body className='antialiased'>
        <I18nProvider locale={locale} common={dict.common} ia2027={dict.ia2027}>
          <GlobalHeader />
          <script
            id='structured-data-site'
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
          />
          {children}
          <GlobalFooter />
        </I18nProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
