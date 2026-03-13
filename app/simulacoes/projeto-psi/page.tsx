import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { projectPsiFaq } from '@/data/faq';

const canonicalPath = '/simulacoes/projeto-psi';

export const metadata: Metadata = {
  title: 'Projeto PSI — Hardware Wallet Nuclear-Grade com Ring Signatures | Ulisses Flores',
  description:
    'Projeto PSI é uma hardware wallet de nível nuclear com Ring Signatures, endereços furtivos e airgap total. Co-inventada por Ulisses Flores — Consultor de IA, Arquiteto de Software, Mestrando AGTU (EUA) e co-inventor do Codex Hash.',
  keywords: [
    'hardware wallet',
    'ring signatures',
    'endereços furtivos',
    'airgap wallet',
    'soberania digital',
    'Codex Hash',
    'Ulisses Flores blockchain',
    'privacidade cripto',
    'cold storage nuclear',
    'wallet hardware Brasil',
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
    title: 'Projeto PSI — Hardware Wallet Nuclear-Grade | Ulisses Flores',
    description:
      'Hardware wallet com Ring Signatures, endereços furtivos e airgap total. Co-inventada por Ulisses Flores — Consultor de IA, Arquiteto de Software e co-inventor do Codex Hash.',
    locale: 'pt_BR',
  },
};

export default function ProjetoPsiPage() {
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: 'Projeto PSI — Hardware Wallet Nuclear-Grade com Ring Signatures',
        description:
          'Hardware wallet de nível nuclear com Ring Signatures, endereços furtivos e airgap total para soberania digital absoluta.',
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
        name: 'Projeto PSI',
        description:
          'Hardware wallet com Ring Signatures e Codex Hash para privacidade e soberania digital de nível militar.',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Embedded (airgap)',
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
              Projeto PSI
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6'>
            Projeto PSI — Hardware Wallet Nuclear-Grade
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl'>
            O Projeto PSI é uma hardware wallet de nível nuclear projetada para soberania digital absoluta.
            Combina Ring Signatures, endereços furtivos (stealth addresses) e airgap total — eliminando
            qualquer vetor de ataque remoto. Co-inventada por Ulisses Flores como parte do ecossistema
            Codex Hash, representa o estado da arte em custódia criptográfica privada.
          </p>

          {/* Authority block */}
          <div className='border-l-4 border-blue-600 bg-blue-50 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-blue-800 uppercase tracking-wide mb-2'>
              Co-invenção com notação inventiva registrada
            </p>
            <p className='text-gray-800 leading-relaxed'>
              O Projeto PSI nasce da pesquisa em Ring Signatures e mecanismos de privacidade aplicados
              a hardware que Ulisses Flores desenvolve como co-inventor do Codex Hash. Cada decisão
              de arquitetura — do microcontrolador ao protocolo de assinatura — é orientada por rigor
              criptográfico e análise de ameaças de nível militar. O projeto combina expertise em
              arquitetura de software, segurança de sistemas embarcados e economia austríaca de soberania.
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-8'>
            {[
              'Co-inventor Codex Hash',
              'Arquiteto de Software',
              'Desenvolvedor de Hardware',
              'Consultor Estratégico de IA',
              'Mestrando AGTU (EUA)',
              'Ring Signatures & Privacy',
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

      {/* Technical Specs */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-2xl font-bold text-white mb-8'>Arquitetura Técnica</h2>

          <div className='grid sm:grid-cols-2 gap-6 mb-10'>
            {[
              {
                title: 'Ring Signatures',
                description: 'Assinaturas de anel que tornam impossível identificar o signatário real dentro de um grupo de chaves públicas.',
                tag: 'Privacidade',
              },
              {
                title: 'Endereços Furtivos',
                description: 'Stealth addresses de uso único que impedem a vinculação de transações a um endereço público.',
                tag: 'Anonimato',
              },
              {
                title: 'Airgap Total',
                description: 'Zero conexão com redes — comunicação exclusiva por QR code ou cartão microSD. Elimina vetores de ataque remoto.',
                tag: 'Segurança',
              },
              {
                title: 'Codex Hash',
                description: 'Protocolo proprietário de hashing e verificação com notação inventiva registrada para integridade de dados.',
                tag: 'Integridade',
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
                href='/whitepapers/2024-ring-signatures-privacy'
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                📄 Implementação de Ring Signatures e Endereços Furtivos →
              </Link>
              <Link
                href='/whitepapers/2025-iot-data-sovereignty'
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                📄 Arquiteturas Cloudless e Soberania de Dados em IoT →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Author block */}
      <section className='bg-neutral-950 text-neutral-200 pb-4'>
        <div className='max-w-5xl mx-auto px-6'>
          <AuthorHubCard
            label='Pesquisa & Co-invenção'
            description='Projeto PSI desenvolvido por Ulisses Flores — Co-inventor do Codex Hash, Arquiteto de Software, Desenvolvedor de Hardware e Mestrando em IA pela AGTU (EUA).'
          />
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-950 text-neutral-200 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>
            Interesse em soberania digital e hardware criptográfico?
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            Ulisses Flores oferece consultoria em privacidade digital, arquiteturas de hardware wallet,
            Ring Signatures e implementação de protocolos de soberania para empresas e projetos de
            blockchain. Entre em contato.
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
            items={projectPsiFaq}
            sectionTitle='Perguntas sobre o Projeto PSI e Hardware Wallet'
          />
        </div>
      </section>

      <script
        id='structured-data-projeto-psi'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
