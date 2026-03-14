import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { simulacoesFaq } from '@/data/faq';

const canonicalPath = '/simulacoes';

export const metadata: Metadata = {
  title: 'Simulações Estratégicas de IA | IA 2027, AGI e Cenários Futuros | Ulisses Flores',
  description:
    'Explore simulações interativas sobre o futuro da Inteligência Artificial e AGI, criadas por Ulisses Flores — Consultor Estratégico de IA, Professor, Palestrante e Mestrando em IA pela AGTU (EUA). A principal plataforma de modelagem de cenários futuros em português.',
  keywords: [
    'simulações estratégicas IA',
    'cenários futuros inteligência artificial',
    'IA 2027',
    'AGI futuro',
    'modelagem de cenários',
    'soberania tecnológica',
    'Ulisses Flores consultor IA',
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
    title: 'Simulações Estratégicas de IA | IA 2027, AGI e Cenários Futuros | Ulisses Flores',
    description:
      'Explore simulações interativas sobre o futuro da Inteligência Artificial e AGI, criadas por Ulisses Flores — Consultor Estratégico de IA, Professor, Palestrante e Mestrando em IA pela AGTU (EUA).',
    locale: 'pt_BR',
  },
};

export default function SimulacoesPage() {
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${origin}${canonicalPath}#collection`,
        url: `${origin}${canonicalPath}`,
        name: 'Simulações Estratégicas de IA | Ulisses Flores',
        description:
          'Hub de simulações interativas sobre o futuro da Inteligência Artificial, AGI e cenários geopolíticos, criadas por Ulisses Flores.',
        inLanguage: 'pt-BR',
        isPartOf: {
          '@id': `${origin}/#website`,
        },
        author: {
          '@id': `${origin}/#person`,
        },
        hasPart: [
          {
            '@type': ['WebPage', 'SoftwareApplication'],
            url: `${origin}/simulacoes/ia-2027`,
            name: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial',
          },
          {
            '@type': ['WebPage', 'SoftwareApplication'],
            url: `${origin}/simulacoes/goldenleaf`,
            name: 'GoldenLeaf: Micologia Inteligente com IoT e IA',
          },
          {
            '@type': ['WebPage', 'SoftwareApplication'],
            url: `${origin}/simulacoes/mumm-ra`,
            name: 'Mumm-Ra: Chatbot Experimental via WhatsApp',
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Hero Section — white, SEO/GEO/LLM optimized */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb / Kicker */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              Simulações Estratégicas
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            Simulações Estratégicas de IA
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            Modelagem interativa de cenários sobre o futuro da Inteligência Artificial Geral (AGI),
            soberania tecnológica e impacto econômico. Criadas e curadas por Ulisses Flores —
            Cientista Econômico, Consultor Estratégico de IA, Professor, Palestrante e Mestrando
            em Inteligência Artificial pela AGTU (EUA).
          </p>

          {/* Authority block */}
          <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              Por que estas simulações importam
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              Cada simulação aqui é construída com rigor científico: combinando dados reais de
              evolução tecnológica, modelos econômicos e análise estratégica. O objetivo é
              oferecer a líderes, pesquisadores e profissionais as ferramentas para antecipar,
              compreender e agir diante das transformações que a AGI imporá à economia e à
              geopolítica global.
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-8'>
            {[
              'Consultor Estratégico de IA',
              'Palestrante',
              'Professor Convidado',
              'Mestrando AGTU (EUA)',
              'Economista & Cientista de Sistemas',
            ].map((credential) => (
              <span
                key={credential}
                className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'
              >
                {credential}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Simulations Grid */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-2xl font-bold text-white mb-8'>Simulações Disponíveis</h2>

          <div className='grid gap-8'>
            {/* IA 2027 — featured */}
            <article className='rounded-2xl border border-emerald-800/30 bg-neutral-900/60 p-8'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-[10px] uppercase tracking-[0.2em] text-emerald-300 border border-emerald-700/40 rounded-full px-3 py-1'>
                  Destaque Principal
                </span>
                <span className='text-[10px] uppercase tracking-[0.2em] text-cyan-300'>
                  Projeto Ativo
                </span>
              </div>
              <h2 className='text-2xl font-bold text-white mb-3'>
                <Link href='/simulacoes/ia-2027' className='hover:text-emerald-400 transition-colors'>
                  IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial
                </Link>
              </h2>
              <p className='text-neutral-300 leading-relaxed mb-4'>
                A única simulação interativa em português sobre a chegada da AGI. Linha do tempo
                2025–2027 com métricas dinâmicas, notas técnicas expansíveis e dois finais
                alternativos: <strong className='text-emerald-300'>Desaceleração Coordenada</strong>{' '}
                ou <strong className='text-red-400'>Corrida Estratégica</strong>.
              </p>
              <div className='flex flex-wrap gap-3 mb-6'>
                {['AGI', 'Soberania Tecnológica', 'Impacto Econômico', 'Segurança de IA'].map((tag) => (
                  <span key={tag} className='text-xs border border-neutral-700 text-neutral-400 px-3 py-1 rounded-full'>
                    {tag}
                  </span>
                ))}
              </div>
              <div className='flex flex-wrap gap-3'>
                <Link
                  href='/simulacoes/ia-2027'
                  className='inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm'
                >
                  Explorar Simulação →
                </Link>
              </div>
            </article>

            {/* GoldenLeaf */}
            <article className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-[10px] uppercase tracking-[0.2em] text-green-300 border border-green-700/40 rounded-full px-3 py-1'>
                  IoT & Agricultura
                </span>
                <span className='text-[10px] uppercase tracking-widest text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 font-bold'>
                  R&D
                </span>
              </div>
              <h2 className='text-2xl font-bold text-white mb-3'>
                <Link href='/simulacoes/goldenleaf' className='hover:text-emerald-400 transition-colors'>
                  GoldenLeaf · Micologia Inteligente com IoT e IA
                </Link>
              </h2>
              <p className='text-neutral-300 leading-relaxed mb-4'>
                Sistema de cultivo autônomo de cogumelos gourmet com sensores IoT de precisão, IA
                preditiva on-edge e arquitetura cloudless — soberania total dos dados sem nuvem.
              </p>
              <div className='flex flex-wrap gap-3 mb-6'>
                {['IoT', 'IA Preditiva', 'Cloudless', 'Agricultura'].map((tag) => (
                  <span key={tag} className='text-xs border border-neutral-700 text-neutral-400 px-3 py-1 rounded-full'>
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Mumm-Ra */}
            <article className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-[10px] uppercase tracking-[0.2em] text-violet-300 border border-violet-700/40 rounded-full px-3 py-1'>
                  Ferramenta Experimental
                </span>
                <span className='text-[10px] uppercase tracking-widest text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 font-bold'>
                  BETA
                </span>
              </div>
              <h2 className='text-2xl font-bold text-white mb-3'>
                <Link href='/simulacoes/mumm-ra' className='hover:text-emerald-400 transition-colors'>
                  Mumm-Ra · Chatbot de Humor Negro via WhatsApp
                </Link>
              </h2>
              <p className='text-neutral-300 leading-relaxed mb-4'>
                Chatbot experimental alimentado por LLMs, inspirado no vilão imortal dos
                ThunderCats (anos 90). Te xinga, reclama de ter sido invocado, te chama de verme —
                mas sempre entrega a resposta. Laboratório de engenharia de prompt e personagens de IA.
              </p>
              <div className='flex flex-wrap gap-3 mb-6'>
                {['WhatsApp', 'LLMs', 'Engenharia de Prompt', 'Humor Negro'].map((tag) => (
                  <span key={tag} className='text-xs border border-neutral-700 text-neutral-400 px-3 py-1 rounded-full'>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Author block */}
      <section className='bg-neutral-950 text-neutral-200 pb-4'>
        <div className='max-w-5xl mx-auto px-6'>
          <AuthorHubCard
            label='Curadoria & Pesquisa'
            description='Simulações criadas, curadas e analisadas por Ulisses Flores — Consultor Estratégico de IA, Professor, Palestrante e Mestrando em IA pela AGTU (EUA).'
          />
        </div>
      </section>

      {/* CTA consulting */}
      <section className='bg-neutral-950 text-neutral-200 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>
            Quer usar estas simulações na sua empresa ou evento?
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            Ulisses Flores aplica estas simulações em workshops corporativos, aulas universitárias e
            palestras. Entre em contato para consultoria personalizada ou para apresentação ao seu time.
          </p>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            Falar com Ulisses →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={simulacoesFaq}
            sectionTitle='Perguntas sobre Simulações Estratégicas de IA'
          />
        </div>
      </section>

      <script
        id='structured-data-simulacoes'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
