import { defaultLocale, isLocale, localeToOgLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { PsiWhitepaperBodyLocalized } from '@/components/content/PsiWhitepaperBodyLocalized';
import { buildCanonical, buildLanguageAlternates, defaultOgImages } from '@/data/seo';

const canonicalPath = '/whitepapers/projeto-psi';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.projetoPsi.whitepaperMeta;

  return {
    title: t.title,
    description: t.description,
    keywords: [...t.keywords],
    authors: [{ name: upkfMeta.publicDisplayName || upkfMeta.displayName, url: `${upkfMeta.primaryWebsite}/identidade` }],
    alternates: { canonical: buildCanonical(locale, canonicalPath), languages: buildLanguageAlternates(canonicalPath) },
    openGraph: {
      images: defaultOgImages(locale),
      type: 'article',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.ogTitle,
      description: t.ogDescription,
      locale: localeToOgLocale[locale],
    },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProjetoPsiPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const origin = upkfMeta.primaryWebsite;
  const dict = await getDictionary(locale);
  const ui = dict.projetoPsi.whitepaperUI;
  const jld = dict.projetoPsi.jsonLd;

  const breadcrumbBase = locale === defaultLocale ? origin : `${origin}/${locale}`;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        // Rótulos literais, e não `dict.common.breadcrumb`: a trilha visual desta
        // página é hardcoded em PT (linha 112) e o dado estruturado tem de bater
        // com o que a página mostra.
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${breadcrumbBase}/` },
          { '@type': 'ListItem', position: 2, name: 'Whitepapers', item: `${breadcrumbBase}/whitepapers` },
          { '@type': 'ListItem', position: 3, name: 'Projeto PSI', item: `${breadcrumbBase}${canonicalPath}` },
        ],
      },
      {
        '@type': 'ScholarlyArticle',
        '@id': `${origin}${canonicalPath}#article`,
        url: `${origin}${canonicalPath}`,
        headline: jld.headline,
        description: jld.description,
        inLanguage: locale,
        wordCount: 8000,
        educationalLevel: 'Expert',
        author: {
          '@id': `${origin}/#person`,
        },
        publisher: {
          '@id': `${origin}/#person`,
        },
        isPartOf: {
          '@id': `${origin}/#website`,
        },
        about: [
          {
            '@type': 'Thing',
            name: 'Hardware Wallet',
            sameAs: 'https://en.wikipedia.org/wiki/Cryptocurrency_wallet#Hardware_wallets',
          },
          {
            '@type': 'Thing',
            name: 'Zero Trust Security',
            sameAs: 'https://en.wikipedia.org/wiki/Zero_trust_security_model',
          },
          {
            '@type': 'Thing',
            name: 'Post-quantum cryptography',
            sameAs: 'https://en.wikipedia.org/wiki/Post-quantum_cryptography',
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}${canonicalPath}#software`,
        name: jld.softwareName,
        description: jld.softwareDescription,
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Embedded (airgap)',
        author: {
          '@id': `${origin}/#person`,
        },
      },
    ],
  };

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════════════
          HERO — White section for SEO/GEO crawl visibility
          ═══════════════════════════════════════════════════════════════ */}
      <section className='bg-brand-navy text-neutral-200 pt-20 pb-16 border-b border-neutral-800 selection:bg-brand-gold/30 selection:text-brand-offwhite'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href={localePath('/', locale)} className='text-xs font-mono uppercase tracking-widest text-brand-gold-light hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-400'>→</span>
            <Link href={localePath('/whitepapers', locale)} className='text-xs font-mono uppercase tracking-widest text-brand-gold-light hover:underline'>
              Whitepapers
            </Link>
            <span className='text-xs text-neutral-400'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-400'>
              Projeto PSI
            </span>
          </div>

          {/* Kicker */}
          <div className='flex items-center gap-3 mb-4'>
            <span className='text-[10px] uppercase tracking-[0.2em] text-brand-gold-light border border-brand-gold/40 rounded-full px-3 py-1 font-bold'>
              {ui.kicker}
            </span>
            <span className='text-[10px] uppercase tracking-[0.2em] text-neutral-400'>
              {ui.kickerSub}
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6 text-brand-offwhite'>
            {ui.h1}
          </h1>

          {/* Author line */}
          <p className='text-sm text-neutral-400 mb-8'>
            <span className='font-semibold text-neutral-300'>{ui.authorLabel}</span>{' '}
            <Link href={localePath('/identidade', locale)} className='text-brand-gold-light underline'>Ulisses Flores</Link>
            {' — '}{ui.authorRole}
          </p>

          {/* Abstract */}
          <div className='border-l-4 border-brand-gold-dark bg-brand-gold/10 px-6 py-5 rounded-r-xl mb-8'>
            <p className='text-sm font-semibold text-brand-gold-light uppercase tracking-wide mb-2'>
              {ui.abstractTitle}
            </p>
            <p className='text-neutral-300 leading-relaxed text-[15px]'>
              {ui.abstractText}
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {[
              'SRAM PUF',
              'XMSS (NIST SP 800-208)',
              'Cu-W EMP Shielding',
              'TMR Aeroespacial',
              'FRAM Rad-Hard',
              'Deniable Encryption',
              'Zero Trust in Silicon',
            ].map((chip) => (
              <span
                key={chip}
                className='bg-neutral-800/80 text-brand-gold-light border border-brand-gold/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider'
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHITEPAPER BODY — Dark immersive long-read
          ═══════════════════════════════════════════════════════════════ */}
      <article className='bg-brand-navy text-neutral-200 py-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <PsiWhitepaperBodyLocalized locale={locale} includeFigures />
        </div>
      </article>

      {/* ═══════════════════════════════════════════════════════════════
          AUTHOR + CTA + FAQ
          ═══════════════════════════════════════════════════════════════ */}
      <section className='bg-brand-navy text-neutral-200 pb-4'>
        <div className='max-w-5xl mx-auto px-6'>
          <AuthorHubCard
            label={ui.authorCardLabel}
            description={ui.authorCardDescription}
          />
        </div>
      </section>

      <section className='bg-brand-navy text-neutral-200 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-brand-offwhite mb-3'>
            {ui.ctaTitle}
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            {ui.ctaDescription}
          </p>
          <Link
            href={localePath('/', locale)}
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            {ui.ctaButton}
          </Link>
        </div>
      </section>

      <section className='bg-brand-navy text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={[...dict.faq.projectPsi]}
            sectionTitle={ui.faqTitle}
          />
        </div>
      </section>

      <script
        id='structured-data-projeto-psi'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </main>
  );
}
