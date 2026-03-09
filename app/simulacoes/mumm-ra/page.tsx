import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { mumMraFaq } from '@/data/faq';

const canonicalPath = '/simulacoes/mumm-ra';
const whatsappUrl = 'https://wa.me/551152868689';

export const metadata: Metadata = {
  title: 'Mumm-Ra | Chatbot Teológico via WhatsApp',
  description:
    'Mumm-Ra é um chatbot teológico gratuito via WhatsApp que utiliza IA para auxiliar em análise bíblica, exegese e estudos teológicos.',
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'Mumm-Ra | Chatbot Teológico via WhatsApp',
    description:
      'Chatbot teológico gratuito que combina inteligência artificial com análise bíblica rigorosa. Disponível 24h via WhatsApp.',
  },
};

export default function MummRaPage() {
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}${canonicalPath}#app`,
        name: 'Mumm-Ra',
        description:
          'Chatbot teológico via WhatsApp que utiliza inteligência artificial para auxiliar em análise bíblica, exegese e estudos teológicos.',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'WhatsApp',
        url: `${origin}${canonicalPath}`,
        author: {
          '@id': `${origin}/#person`,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: 'Mumm-Ra | Chatbot Teológico via WhatsApp',
        isPartOf: {
          '@id': `${origin}/#website`,
        },
        mainEntity: {
          '@id': `${origin}${canonicalPath}#app`,
        },
      },
    ],
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#10b98108,transparent)] pointer-events-none' />

      <main className='relative max-w-4xl mx-auto px-6 py-20 z-10'>
        <Link href='/simulacoes' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Simulações
        </Link>

        <header className='mt-8 mb-12'>
          <p className='text-xs uppercase tracking-[0.2em] text-emerald-300 mb-3'>Ferramenta Experimental</p>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>Mumm-Ra</h1>
          <p className='text-xl text-neutral-300 leading-relaxed max-w-2xl'>
            Chatbot teológico via WhatsApp que combina inteligência artificial com análise bíblica rigorosa.
          </p>
          <div className='mt-5 max-w-xl'>
            <AuthorHubCard
              label='Projeto experimental'
              compact
              description='Ferramenta conectada ao laboratório de simulações e ao hub canônico de identidade.'
            />
          </div>
        </header>

        <section className='rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-8 mb-10 text-center'>
          <h2 className='text-2xl font-bold text-white mb-3'>Converse com o Mumm-Ra</h2>
          <p className='text-neutral-300 mb-6 max-w-lg mx-auto'>
            Envie uma pergunta teológica pelo WhatsApp e receba uma análise contextualizada em segundos. Gratuito e disponível 24 horas.
          </p>
          <a
            href={whatsappUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]'
          >
            <MessageCircle size={24} />
            Abrir no WhatsApp
          </a>
          <p className='text-xs text-neutral-500 mt-3'>+55 11 5286-8689</p>
        </section>

        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <h2 className='text-2xl font-semibold text-white mb-4'>Como funciona</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {[
              {
                step: '01',
                title: 'Envie sua pergunta',
                description: 'Mande uma mensagem pelo WhatsApp com sua dúvida teológica, passagem bíblica ou conceito que deseja explorar.',
              },
              {
                step: '02',
                title: 'IA analisa o contexto',
                description: 'O Mumm-Ra processa sua pergunta usando modelos de linguagem treinados com contexto teológico especializado.',
              },
              {
                step: '03',
                title: 'Receba a análise',
                description: 'Em segundos, receba uma resposta contextualizada com referências bíblicas e perspectiva exegética.',
              },
            ].map((item) => (
              <div key={item.step} className='rounded-xl border border-neutral-800 bg-neutral-950/60 p-5'>
                <span className='text-xs font-mono text-emerald-400 mb-2 block'>{item.step}</span>
                <h3 className='text-sm font-semibold text-white mb-2'>{item.title}</h3>
                <p className='text-xs text-neutral-400 leading-relaxed'>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <h2 className='text-2xl font-semibold text-white mb-4'>Exemplos de perguntas</h2>
          <div className='grid gap-3 md:grid-cols-2'>
            {[
              'Qual o contexto histórico de Romanos 8:28?',
              'Compare as visões amilenista e pré-milenista',
              'O que Paulo quis dizer com "espinho na carne"?',
              'Explique a doutrina da justificação por fé',
              'Qual a estrutura literária do livro de Apocalipse?',
              'Como interpretar as parábolas do Reino em Mateus 13?',
            ].map((example) => (
              <div key={example} className='rounded-lg border border-neutral-800 bg-neutral-950/60 px-4 py-3 text-sm text-neutral-300'>
                &ldquo;{example}&rdquo;
              </div>
            ))}
          </div>
        </section>

        <FaqSection items={mumMraFaq} sectionTitle='Perguntas sobre o Mumm-Ra' />
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
