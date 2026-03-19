import { defaultLocale, isLocale, localeToOgLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Users, Skull, Zap, AlertTriangle, Sparkles } from 'lucide-react';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { buildCanonical, buildLanguageAlternates } from '@/data/seo';

const canonicalPath = '/simulacoes/mumm-ra';
const whatsappUrl = 'https://wa.me/551152868689';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.mummRa;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    authors: [{ name: upkfMeta.publicDisplayName || upkfMeta.displayName, url: `${upkfMeta.primaryWebsite}/identidade` }],
    alternates: { canonical: buildCanonical(locale, canonicalPath), languages: buildLanguageAlternates(canonicalPath) },
    openGraph: {
      type: 'website',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
    },
  };
}

const traitIcons = [Skull, AlertTriangle, Zap, Sparkles] as const;

export default async function MummRaPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.mummRa;

  const origin = upkfMeta.primaryWebsite;
  const traitColors = ['text-violet-400', 'text-amber-400', 'text-emerald-400', 'text-cyan-400'];

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}${canonicalPath}#app`,
        name: 'Mumm-Ra',
        description: t.hero.lead,
        applicationCategory: 'EntertainmentApplication',
        operatingSystem: 'WhatsApp',
        url: `${origin}${canonicalPath}`,
        author: { '@id': `${origin}/#person` },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: t.hero.h1,
        inLanguage: locale,
        isPartOf: { '@id': `${origin}/#website` },
        mainEntity: { '@id': `${origin}${canonicalPath}#app` },
      },
    ],
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#7c3aed10,transparent)] pointer-events-none' />

      <main className='relative max-w-4xl mx-auto px-6 py-20 z-10'>
        <Link href={localePath('/simulacoes', locale)} className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          {t.backLink}
        </Link>

        {/* Hero Section */}
        <header className='mt-8 mb-12'>
          <div className='flex items-center gap-3 mb-3'>
            <p className='text-xs uppercase tracking-[0.2em] text-violet-400'>{t.hero.badge}</p>
            <span className='text-[10px] uppercase tracking-widest text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 font-bold'>BETA</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>{t.hero.h1}</h1>
          <p className='text-xl text-neutral-300 leading-relaxed max-w-2xl'>{t.hero.lead}</p>
          <p className='text-sm text-neutral-500 mt-3 max-w-2xl leading-relaxed'>{t.hero.description}</p>

          {/* EEAT authority block */}
          <div className='mt-6 rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 max-w-2xl'>
            <p className='text-xs uppercase tracking-widest text-violet-400 mb-2'>{t.hero.createdBy}</p>
            <p className='text-sm text-neutral-300 leading-relaxed'>{t.hero.authorDesc}</p>
          </div>
          <div className='mt-4 max-w-xl'>
            <AuthorHubCard label={t.hero.authorLabel} compact description={t.hero.authorHubDesc} />
          </div>
        </header>

        {/* CTA Principal */}
        <section className='rounded-2xl border border-violet-500/30 bg-violet-900/10 p-8 mb-10 text-center'>
          <Skull size={40} className='text-violet-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-white mb-3'>{t.cta.title}</h2>
          <p className='text-neutral-300 mb-6 max-w-lg mx-auto'>{t.cta.description}</p>
          <a
            href={whatsappUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(124,58,237,0.25)] hover:shadow-[0_0_40px_rgba(124,58,237,0.4)]'
          >
            <MessageCircle size={24} />
            {t.cta.button}
          </a>
          <p className='text-xs text-neutral-500 mt-3'>+55 11 5286-8689</p>
        </section>

        {/* Personalidade */}
        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <h2 className='text-2xl font-semibold text-white mb-4'>{t.personality.title}</h2>
          <p className='text-neutral-300 leading-relaxed mb-6'>{t.personality.description}</p>
          <div className='grid gap-4 md:grid-cols-2'>
            {[...t.personality.traits].map((trait, index) => {
              const Icon = traitIcons[index] || Skull;
              return (
                <div key={trait.title} className='rounded-xl border border-neutral-800 bg-neutral-950/60 p-5'>
                  <Icon size={20} className={`${traitColors[index]} mb-3`} />
                  <h3 className='text-sm font-semibold text-white mb-2'>{trait.title}</h3>
                  <p className='text-xs text-neutral-400 leading-relaxed'>{trait.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Como funciona */}
        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <h2 className='text-2xl font-semibold text-white mb-4'>{t.howItWorks.title}</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {[...t.howItWorks.steps].map((item) => (
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
              <h2 className='text-xl font-semibold text-white mb-2'>{t.groups.title}</h2>
              <p className='text-neutral-300 leading-relaxed mb-3'>{t.groups.description}</p>
              <p className='text-xs text-neutral-500'>{t.groups.note}</p>
            </div>
          </div>
        </section>

        {/* Exemplos de interação */}
        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 mb-10'>
          <h2 className='text-2xl font-semibold text-white mb-4'>{t.examples.title}</h2>
          <p className='text-xs text-neutral-500 mb-4'>{t.examples.subtitle}</p>
          <div className='space-y-4'>
            {[...t.examples.items].map((example) => (
              <div key={example.user} className='rounded-xl border border-neutral-800 bg-neutral-950/60 p-5'>
                <div className='flex items-start gap-3 mb-3'>
                  <span className='text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded'>
                    {t.examples.youLabel}
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
              <h2 className='text-lg font-semibold text-white mb-2'>{t.beta.title}</h2>
              <p className='text-sm text-neutral-300 leading-relaxed'>{t.beta.description}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqSection items={[...dict.faq.mummRa]} sectionTitle={t.faq.sectionTitle} />
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
