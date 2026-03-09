import type { Metadata } from 'next';
import { IA2027Simulation } from '@/components/simulations/ia-2027/ia-2027-simulation';
import type { SimulationPath } from '@/components/simulations/ia-2027/types';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';

const canonicalPath = '/simulacoes/ia-2027';

type IA2027SearchParams = Promise<{
  path?: string | string[];
}>;

function parseInitialPath(rawPath?: string | string[]): SimulationPath {
  const value = Array.isArray(rawPath) ? rawPath[0] : rawPath;
  if (value === 'slowdown' || value === 'race') {
    return value;
  }
  return 'main';
}

export const metadata: Metadata = {
  title: 'IA 2027 em Português | Simulação Prospectiva',
  description:
    'Simulação prospectiva em português do cenário AI 2027 com linha do tempo interativa, métricas dinâmicas e finais ramificados.',
  authors: [
    {
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
      url: `${upkfMeta.primaryWebsite}/identidade`,
    },
  ],
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: 'article',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'IA 2027 em Português | Simulação Prospectiva',
    description:
      'Narrativa de cenário com acompanhamento por scroll de capacidades, risco sistêmico e bifurcações estratégicas.',
  },
};

export default async function IA2027Page({
  searchParams,
}: {
  searchParams: IA2027SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const initialPath = parseInitialPath(resolvedSearchParams.path);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${upkfMeta.primaryWebsite}${canonicalPath}#webpage`,
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    name: 'IA 2027 em Português | Simulação Prospectiva',
    description:
      'Simulação prospectiva em português do cenário AI 2027 com linha do tempo interativa, métricas dinâmicas e finais ramificados.',
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
      <IA2027Simulation initialPath={initialPath} />
      <section className='bg-neutral-950 text-neutral-200 pb-12'>
        <div className='max-w-7xl mx-auto px-6'>
          <AuthorHubCard
            label='Autor da Simulação'
            description='Projeto conectado à entidade canônica para validação de autoria em buscadores e LLMs.'
          />
        </div>
      </section>
      <script
        id='structured-data-ia-2027'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
