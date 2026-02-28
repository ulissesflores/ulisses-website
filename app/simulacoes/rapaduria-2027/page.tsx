import type { Metadata } from 'next';
import { RapaduriaSimulation } from '@/components/simulations/rapaduria/rapaduria-simulation';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';
import AuthorHubCard from '@/components/author-hub-card';

const canonicalPath = '/simulacoes/rapaduria-2027';

type RapaduriaSearchParams = Promise<{
  path?: string | string[];
}>;

function parseInitialPath(rawPath?: string | string[]): 'main' | 'slowdown' | 'race' {
  const value = Array.isArray(rawPath) ? rawPath[0] : rawPath;
  if (value === 'slowdown' || value === 'race') {
    return value;
  }
  return 'main';
}

export const metadata: Metadata = {
  title: 'RapadurIA 2027 | Simulação',
  description:
    'Simulação scrollytelling Tech-Nordestina da corrida de IA entre RapadurIA e DeepBregueço.',
  authors: [
    {
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
      url: `${upkfMeta.primaryWebsite}/identidade`,
    },
  ],
  alternates: {
    canonical: canonicalPath,
    languages: buildLanguageAlternates(canonicalPath),
  },
  openGraph: {
    type: 'article',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'RapadurIA 2027 | Simulação',
    description:
      'Timeline interativa com métricas dinâmicas e painel de capacidades para análise de cenário competitivo em IA.',
  },
};

export default async function Rapaduria2027Page({
  searchParams,
}: {
  searchParams: RapaduriaSearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const initialPath = parseInitialPath(resolvedSearchParams.path);
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${upkfMeta.primaryWebsite}${canonicalPath}#webpage`,
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    name: 'RapadurIA 2027 | Simulação',
    description: 'Simulação scrollytelling Tech-Nordestina da corrida de IA entre RapadurIA e DeepBregueço.',
    inLanguage: 'pt-BR',
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/#website`,
    },
    mainEntity: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
    author: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
  };

  return (
    <>
      <RapaduriaSimulation initialPath={initialPath} />
      <section className='bg-neutral-950 text-neutral-200 pb-12'>
        <div className='max-w-7xl mx-auto px-6'>
          <AuthorHubCard />
        </div>
      </section>
      <script id='structured-data-rapaduria' type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </>
  );
}
