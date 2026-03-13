import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { goldenleafFaq } from '@/data/faq';

const canonicalPath = '/simulacoes/goldenleaf';

export const metadata: Metadata = {
  title: 'GoldenLeaf — Micologia Inteligente com IoT e IA | Ulisses Flores',
  description:
    'GoldenLeaf é um projeto de micologia inteligente que combina sensores IoT, IA preditiva e arquiteturas cloudless para cultivo autônomo de cogumelos gourmet. Desenvolvido por Ulisses Flores — Consultor de IA, Arquiteto de Software e Mestrando AGTU (EUA).',
  keywords: [
    'micologia inteligente',
    'IoT cogumelos',
    'cultivo autônomo',
    'IA agricultura',
    'cogumelos gourmet',
    'sensores IoT',
    'cloudless IoT',
    'soberania de dados',
    'Ulisses Flores IoT',
    'agricultura inteligente',
  ],
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
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'GoldenLeaf — Micologia Inteligente com IoT e IA | Ulisses Flores',
    description:
      'Projeto de micologia inteligente com IoT, IA preditiva e arquiteturas cloudless para cultivo autônomo. Por Ulisses Flores — Consultor de IA e Arquiteto de Software.',
    locale: 'pt_BR',
  },
};

export default function GoldenLeafPage() {
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: 'GoldenLeaf — Micologia Inteligente com IoT e IA',
        description:
          'Projeto de micologia inteligente que combina sensores IoT, IA preditiva e arquiteturas cloudless para cultivo autônomo de cogumelos gourmet.',
        inLanguage: 'pt-BR',
        isPartOf: {
          '@id': `${origin}/simulacoes#collection`,
        },
        author: {
          '@id': `${origin}/#person`,
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}${canonicalPath}#software`,
        name: 'GoldenLeaf',
        description:
          'Sistema de micologia inteligente com sensores IoT, IA preditiva e arquitetura cloudless para soberania de dados no cultivo de cogumelos.',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'IoT / Embedded',
        author: {
          '@id': `${origin}/#person`,
        },
      },
    ],
  };

  return (
    <>
      {/* Hero Section */}
      <section className='bg-white text-black pt-20 pb-16 border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-blue-700 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-gray-400'>→</span>
            <Link href='/simulacoes' className='text-xs font-mono uppercase tracking-widest text-blue-700 hover:underline'>
              Simulações
            </Link>
            <span className='text-xs text-gray-400'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-gray-500'>
              GoldenLeaf
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6'>
            GoldenLeaf — Micologia Inteligente com IoT e IA
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl'>
            O GoldenLeaf combina sensores IoT de precisão, IA preditiva e arquiteturas cloudless
            para criar um sistema de cultivo autônomo de cogumelos gourmet — com soberania total
            dos dados e sem dependência de servidores externos. Desenvolvido por Ulisses Flores como
            laboratório vivo de IoT aplicada à agricultura inteligente.
          </p>

          {/* Authority block */}
          <div className='border-l-4 border-blue-600 bg-blue-50 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-blue-800 uppercase tracking-wide mb-2'>
              IoT soberana aplicada à agricultura
            </p>
            <p className='text-gray-800 leading-relaxed'>
              O GoldenLeaf materializa a pesquisa de Ulisses Flores em arquiteturas cloudless e
              soberania de dados em IoT. Cada sensor opera localmente, os dados permanecem no
              dispositivo e os modelos de IA são executados on-edge — sem cloud, sem latência,
              sem dependência. O projeto é um caso de estudo concreto de como a soberania digital
              se aplica a sistemas físicos do mundo real.
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-8'>
            {[
              'Arquiteto de Software',
              'Desenvolvedor de Hardware',
              'Consultor Estratégico de IA',
              'Mestrando AGTU (EUA)',
              'IoT & Edge Computing',
              'Soberania de Dados',
            ].map((credential) => (
              <span
                key={credential}
                className='text-xs font-mono border border-gray-300 bg-gray-50 text-gray-700 px-3 py-1 rounded-full'
              >
                {credential}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-2xl font-bold text-white mb-8'>Arquitetura do Sistema</h2>

          <div className='grid sm:grid-cols-2 gap-6 mb-10'>
            {[
              {
                title: 'Sensores IoT de Precisão',
                description: 'Monitoramento contínuo de temperatura, umidade, CO₂ e luminosidade — com calibração automática e redundância.',
                tag: 'Hardware',
              },
              {
                title: 'IA Preditiva On-Edge',
                description: 'Modelos de machine learning executados localmente no microcontrolador para previsão de condições ideais de frutificação.',
                tag: 'Inteligência',
              },
              {
                title: 'Arquitetura Cloudless',
                description: 'Zero dependência de servidores externos. Dados processados, armazenados e analisados localmente — soberania total.',
                tag: 'Soberania',
              },
              {
                title: 'Cultivo Autônomo',
                description: 'Automação completa do ciclo de cultivo: inoculação, incubação, frutificação e colheita com intervenção humana mínima.',
                tag: 'Automação',
              },
            ].map((spec) => (
              <article key={spec.title} className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-6'>
                <span className='text-[10px] uppercase tracking-[0.2em] text-emerald-300 border border-emerald-700/40 rounded-full px-3 py-1'>
                  {spec.tag}
                </span>
                <h3 className='text-lg font-bold text-white mt-4 mb-2'>{spec.title}</h3>
                <p className='text-sm text-neutral-400 leading-relaxed'>{spec.description}</p>
              </article>
            ))}
          </div>

          {/* Related Publications */}
          <div className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>Publicações Relacionadas</h3>
            <div className='space-y-3'>
              <Link
                href='/whitepapers/2025-iot-data-sovereignty'
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                📄 Arquiteturas Cloudless e Soberania de Dados em IoT →
              </Link>
              <Link
                href='/whitepapers/2025-hybrid-cooling-thermodynamics'
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                📄 Análise Termodinâmica e Engenharia de Sistemas Híbridos de Resfriamento →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Author block */}
      <section className='bg-neutral-950 text-neutral-200 pb-4'>
        <div className='max-w-5xl mx-auto px-6'>
          <AuthorHubCard
            label='Pesquisa & Desenvolvimento'
            description='GoldenLeaf desenvolvido por Ulisses Flores — Consultor Estratégico de IA, Arquiteto de Software, Desenvolvedor de Hardware e Mestrando em IA pela AGTU (EUA).'
          />
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-950 text-neutral-200 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>
            Interesse em IoT soberana e IA aplicada à agricultura?
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            Ulisses Flores oferece consultoria em arquiteturas IoT cloudless, IA on-edge e
            sistemas de automação para agricultura e indústria. Entre em contato para uma
            proposta personalizada.
          </p>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            Falar com Ulisses Flores →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={goldenleafFaq}
            sectionTitle='Perguntas sobre o GoldenLeaf'
          />
        </div>
      </section>

      <script
        id='structured-data-goldenleaf'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
