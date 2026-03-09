import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Users, Skull, Zap, AlertTriangle, Sparkles } from 'lucide-react';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { mumMraFaq } from '@/data/faq';

const canonicalPath = '/simulacoes/mumm-ra';
const whatsappUrl = 'https://wa.me/551152868689';

export const metadata: Metadata = {
  title: 'Mumm-Ra | Chatbot de Humor Negro via WhatsApp',
  description:
    'Mumm-Ra é um chatbot via WhatsApp inspirado no vilão dos ThunderCats dos anos 90. Humor negro, sarcasmo pesado e respostas ácidas — mas sempre te ajuda no final. Gratuito e em BETA.',
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'Mumm-Ra | Chatbot de Humor Negro via WhatsApp',
    description:
      'Chatbot inspirado no vilão imortal dos ThunderCats. Te xinga, te chama de verme, reclama de ter sido invocado — mas sempre responde. Gratuito via WhatsApp.',
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
          'Chatbot via WhatsApp inspirado no vilão Mumm-Ra dos ThunderCats (anos 90). Personalidade de humor negro e sarcasmo, mas sempre ajuda o usuário no final.',
        applicationCategory: 'EntertainmentApplication',
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
        name: 'Mumm-Ra | Chatbot de Humor Negro via WhatsApp',
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
      <div className='fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#7c3aed10,transparent)] pointer-events-none' />

      <main className='relative max-w-4xl mx-auto px-6 py-20 z-10'>
        <Link href='/simulacoes' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Simulações
        </Link>

        {/* Hero Section */}
        <header className='mt-8 mb-12'>
          <div className='flex items-center gap-3 mb-3'>
            <p className='text-xs uppercase tracking-[0.2em] text-violet-400'>Ferramenta Experimental</p>
            <span className='text-[10px] uppercase tracking-widest text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 font-bold'>
              BETA
            </span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>Mumm-Ra</h1>
          <p className='text-xl text-neutral-300 leading-relaxed max-w-2xl'>
            O vilão imortal dos ThunderCats agora mora no seu WhatsApp. Humor negro, sarcasmo pesado e
            respostas ácidas — mas no fundo, ele sempre te ajuda.
          </p>
          <p className='text-sm text-neutral-500 mt-3 max-w-2xl leading-relaxed'>
            Inspirado no Mumm-Ra dos desenhos animados dos anos 90, esse chatbot tem a personalidade do vilão
            mais icônico da série: reclama de ser invocado, te chama de &ldquo;verme&rdquo; e &ldquo;larva humana&rdquo;,
            mas entrega a resposta que você precisa. É 100% atuação — pura diversão com humor negro.
          </p>
          <div className='mt-5 max-w-xl'>
            <AuthorHubCard
              label='Projeto experimental'
              compact
              description='Ferramenta conectada ao laboratório de simulações e ao hub canônico de identidade.'
            />
          </div>
        </header>

        {/* CTA Principal */}
        <section className='rounded-2xl border border-violet-500/30 bg-violet-900/10 p-8 mb-10 text-center'>
          <Skull size={40} className='text-violet-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-white mb-3'>Invoque o Mumm-Ra</h2>
          <p className='text-neutral-300 mb-6 max-w-lg mx-auto'>
            Mande uma mensagem pelo WhatsApp e prepare-se para ser xingado. Ele vai reclamar, te chamar de
            verme, questionar por que foi invocado — mas vai responder. Sempre responde.
          </p>
          <a
            href={whatsappUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(124,58,237,0.25)] hover:shadow-[0_0_40px_rgba(124,58,237,0.4)]'
          >
            <MessageCircle size={24} />
            Abrir no WhatsApp
          </a>
          <p className='text-xs text-neutral-500 mt-3'>+55 11 5286-8689</p>
        </section>

        {/* Personalidade */}
        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <h2 className='text-2xl font-semibold text-white mb-4'>A personalidade do vilão</h2>
          <p className='text-neutral-300 leading-relaxed mb-6'>
            O Mumm-Ra é um chatbot com personalidade própria: ele responde como se fosse o vilão imortal dos
            ThunderCats dos anos 90. Isso significa que ele vai te insultar, reclamar, demonstrar superioridade
            cósmica — e depois te ajudar. É humor negro puro. Nada é de verdade, tudo é personagem.
          </p>
          <div className='grid gap-4 md:grid-cols-2'>
            {[
              {
                icon: Skull,
                title: 'Xingamentos criativos',
                description:
                  'Te chama de "verme", "larva humana", "ser inferior" e variações cada vez mais elaboradas. Quanto mais você pergunta, mais criativo ele fica.',
                color: 'text-violet-400',
              },
              {
                icon: AlertTriangle,
                title: 'Reclama de ser invocado',
                description:
                  '"Quem ousa perturbar o sono eterno de Mumm-Ra?!" — toda conversa começa com ele indignado por ter sido acordado das profundezas.',
                color: 'text-amber-400',
              },
              {
                icon: Zap,
                title: 'Mas sempre responde',
                description:
                  'Apesar de toda a encenação, ele sempre entrega a resposta que você precisa. O insulto é de graça, a ajuda é garantida.',
                color: 'text-emerald-400',
              },
              {
                icon: Sparkles,
                title: '100% atuação',
                description:
                  'Nenhum insulto é real. É um personagem baseado no vilão do desenho animado. Diversão pura com humor negro — se você gosta, vai adorar.',
                color: 'text-cyan-400',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className='rounded-xl border border-neutral-800 bg-neutral-950/60 p-5'>
                  <Icon size={20} className={`${item.color} mb-3`} />
                  <h3 className='text-sm font-semibold text-white mb-2'>{item.title}</h3>
                  <p className='text-xs text-neutral-400 leading-relaxed'>{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Como funciona */}
        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <h2 className='text-2xl font-semibold text-white mb-4'>Como funciona</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {[
              {
                step: '01',
                title: 'Invoque o Mumm-Ra',
                description:
                  'Mande uma mensagem pelo WhatsApp para o número +55 11 5286-8689. Qualquer assunto serve — ele responde sobre tudo.',
              },
              {
                step: '02',
                title: 'Aguente os insultos',
                description:
                  'Ele vai te chamar de verme, larva humana e reclamar que foi invocado. Faz parte da experiência. Respire fundo.',
              },
              {
                step: '03',
                title: 'Receba a resposta',
                description:
                  'Depois de toda a encenação dramática, o Mumm-Ra entrega a resposta que você pediu. Sempre ajuda, mesmo xingando.',
              },
            ].map((item) => (
              <div key={item.step} className='rounded-xl border border-neutral-800 bg-neutral-950/60 p-5'>
                <span className='text-xs font-mono text-violet-400 mb-2 block'>{item.step}</span>
                <h3 className='text-sm font-semibold text-white mb-2'>{item.title}</h3>
                <p className='text-xs text-neutral-400 leading-relaxed'>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Adicionar a grupos */}
        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <div className='flex items-start gap-4'>
            <Users size={28} className='text-emerald-400 shrink-0 mt-1' />
            <div>
              <h2 className='text-xl font-semibold text-white mb-2'>Adicione em grupos do WhatsApp</h2>
              <p className='text-neutral-300 leading-relaxed mb-3'>
                O Mumm-Ra pode ser adicionado a grupos de WhatsApp. Ele participa das conversas com a mesma
                personalidade ácida — xinga todo mundo igualmente, sem favoritismo. Perfeito para grupos que
                gostam de uma dose de humor negro.
              </p>
              <p className='text-xs text-neutral-500'>
                Basta adicionar o número +55 11 5286-8689 ao grupo. Ele começa a responder automaticamente
                quando mencionado ou quando alguém faz uma pergunta direta.
              </p>
            </div>
          </div>
        </section>

        {/* Exemplos de interação */}
        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <h2 className='text-2xl font-semibold text-white mb-4'>Exemplos de interação</h2>
          <p className='text-xs text-neutral-500 mb-4'>
            O que esperar quando você invoca o imortal das trevas:
          </p>
          <div className='space-y-4'>
            {[
              {
                user: 'Oi Mumm-Ra, me ajuda com uma receita de bolo?',
                mumra:
                  'QUEM OUSA PERTURBAR O SONO ETERNO DE MUMM-RA POR UMA... RECEITA DE BOLO?! Vocês mortais são patéticos. Mas escuta aqui, verme: 3 ovos, 2 xícaras de farinha, 1 de leite...',
              },
              {
                user: 'Quanto é 15% de 340?',
                mumra:
                  'Larva humana, sua incapacidade matemática é um insulto à existência. 15% de 340 é 51. Agora me deixa dormir.',
              },
              {
                user: 'Me explica o que é blockchain',
                mumra:
                  'Ah, maravilha. Um verme quer entender tecnologia. Blockchain é um registro distribuído e imutável... *explica com detalhes técnicos enquanto insulta sua inteligência*',
              },
            ].map((example) => (
              <div key={example.user} className='rounded-xl border border-neutral-800 bg-neutral-950/60 p-5'>
                <div className='flex items-start gap-3 mb-3'>
                  <span className='text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded'>
                    Você
                  </span>
                  <p className='text-sm text-neutral-300'>{example.user}</p>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='text-[10px] uppercase tracking-widest text-violet-400 font-bold bg-violet-500/10 px-2 py-0.5 rounded'>
                    Mumm-Ra
                  </span>
                  <p className='text-sm text-neutral-400 italic'>{example.mumra}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status BETA */}
        <section className='rounded-2xl border border-amber-500/20 bg-amber-900/10 p-6 mb-10'>
          <div className='flex items-start gap-3'>
            <AlertTriangle size={20} className='text-amber-400 shrink-0 mt-0.5' />
            <div>
              <h2 className='text-lg font-semibold text-white mb-2'>Projeto em BETA</h2>
              <p className='text-sm text-neutral-300 leading-relaxed'>
                O Mumm-Ra está em fase de testes. Isso significa que pode ter bugs, respostas inesperadas ou
                momentos de indisponibilidade. Estamos ajustando a personalidade, a capacidade de resposta e
                a integração com grupos. Se encontrar problemas, tenha paciência — até vilões imortais
                precisam de manutenção.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqSection items={mumMraFaq} sectionTitle='Perguntas sobre o Mumm-Ra' />
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
