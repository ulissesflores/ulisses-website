import type { Metadata } from 'next';
import Script from 'next/script';
import { siteJsonLd, upkfMeta } from '@/data/generated/upkf.generated';
import './globals.css';

const siteUrl = upkfMeta.primaryWebsite;
const defaultDescription =
  upkfMeta.description['pt-BR'] ||
  'Cientista economico, analista de sistemas e pesquisador em IA, economia e sistemas complexos.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${upkfMeta.preferredName} Flores | CTO, Pesquisa e Engenharia`,
    template: `%s | ${upkfMeta.preferredName} Flores`,
  },
  description: defaultDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: `${upkfMeta.preferredName} Flores | CTO, Pesquisa e Engenharia`,
    description: defaultDescription,
    siteName: 'ulissesflores.com',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${upkfMeta.preferredName} Flores | CTO, Pesquisa e Engenharia`,
    description: defaultDescription,
  },
  icons: {
    icon: '/carlos-ulisses-flores-cto.jpg',
    apple: '/carlos-ulisses-flores-cto.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body className='antialiased'>
        <Script
          id='structured-data-upkf'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
