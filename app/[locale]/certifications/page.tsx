import type { Metadata } from 'next';
import Link from 'next/link';
import { certificationsSotaData } from '@/data/certifications-sota';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { isLocale, defaultLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildLanguageAlternates } from '@/data/seo';
import { localePath } from '@/lib/locale-path';

const providerOrder = ['Alura', 'Coursera', 'edX'] as const;
type CertificationItem = (typeof certificationsSotaData)[number];

function groupByProvider() {
  const groups = new Map<string, CertificationItem[]>();
  certificationsSotaData.forEach((certification) => {
    if (!groups.has(certification.provider)) groups.set(certification.provider, []);
    groups.get(certification.provider)?.push(certification);
  });
  groups.forEach((certifications) => {
    certifications.sort((a, b) => {
      const aPos = 'position' in a ? a.position || Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      const bPos = 'position' in b ? b.position || Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      if (aPos !== bPos) return aPos - bPos;
      return a.name.localeCompare(b.name);
    });
  });
  const providerRank = new Map<string, number>(providerOrder.map((p, i) => [p, i]));
  return Array.from(groups.entries())
    .map(([provider, certifications]) => ({ provider, certifications }))
    .sort((a, b) => {
      const rA = providerRank.get(a.provider) ?? Number.MAX_SAFE_INTEGER;
      const rB = providerRank.get(b.provider) ?? Number.MAX_SAFE_INTEGER;
      if (rA !== rB) return rA - rB;
      return a.provider.localeCompare(b.provider);
    });
}

const canonicalPath = '/certifications';
type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.certifications;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    alternates: { canonical: canonicalPath, languages: buildLanguageAlternates(canonicalPath) },
    openGraph: {
      type: 'website',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
    },
  };
}

export default async function CertificationsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.certifications;
  const tFaq = dict.faq.certificacoes;

  const providerGroups = groupByProvider();

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${upkfMeta.primaryWebsite}/certifications#collection`,
        url: `${upkfMeta.primaryWebsite}/certifications`,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: locale,
        about: { '@id': `${upkfMeta.primaryWebsite}/#person` },
        hasPart: certificationsSotaData.map((c) => ({
          '@type': 'EducationalOccupationalCredential',
          '@id': `${upkfMeta.primaryWebsite}${c.canonicalPath}`,
          name: c.title,
          url: `${upkfMeta.primaryWebsite}${c.canonicalPath}`,
        })),
      },
    ],
  };

  return (
    <>
      {/* Hero */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-5xl mx-auto px-6'>
          <div className='flex items-center gap-2 mb-6'>
            <Link href={localePath('/', locale)} className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              {dict.common.breadcrumb.home}
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>{t.breadcrumb}</span>
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>{t.hero.h1}</h1>
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>{t.hero.lead}</p>
          <div className='border-s-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-e-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>{t.hero.authority.kicker}</p>
            <p className='text-neutral-300 leading-relaxed'>{t.hero.authority.text}</p>
          </div>
          <div className='flex flex-wrap gap-2 mb-4'>
            {t.hero.credentials.map((c) => (
              <span key={c} className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className='bg-neutral-950 text-neutral-200'>
        <div className='max-w-5xl mx-auto px-6 py-16'>
          <div className='mb-6'>
            <AuthorHubCard label={t.grid.authorLabel} compact description={t.grid.authorDescription} />
          </div>
          <div className='space-y-10'>
            {providerGroups.map((group) => (
              <section key={group.provider} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
                <h2 className='text-2xl font-semibold text-white mb-4'>{group.provider}</h2>
                <div className='grid gap-4'>
                  {group.certifications.map((cert) => (
                    <article key={cert.slug} className='rounded-lg border border-neutral-800 bg-neutral-950/60 p-5'>
                      <h3 className='text-lg font-semibold text-white mb-2'>
                        <Link href={cert.canonicalPath} className='hover:text-emerald-400 transition-colors'>{cert.title}</Link>
                      </h3>
                      <p className='text-sm text-neutral-400 mb-3'>{cert.summary}</p>
                      <p className='text-sm text-neutral-300 mb-4'>{cert.about}</p>
                      <div className='mb-4'>
                        <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>{t.grid.skillsAcquired}</p>
                        <div className='flex flex-wrap gap-2'>
                          {cert.skills.map((s) => (
                            <span key={s} className='rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300'>{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className='mb-4'>
                        <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>{t.grid.problemsSolved}</p>
                        <p className='text-sm text-neutral-300'>{cert.problems_solved}</p>
                      </div>
                      <div className='flex flex-wrap gap-3 text-xs'>
                        {cert.certId && (
                          <span className='rounded-full border border-neutral-700 px-3 py-1 text-neutral-300'>{cert.certId}</span>
                        )}
                        <a href={cert.verifyUrl} target='_blank' rel='noopener noreferrer' className='rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300 hover:bg-emerald-900/40 transition-colors'>
                          {t.grid.verifyUrl}
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-950 text-neutral-200 py-12 border-t border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>{t.cta.title}</h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>{t.cta.description}</p>
          <Link href={localePath('/', locale)} className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'>
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection items={[...tFaq]} sectionTitle={t.faq.sectionTitle} />
        </div>
      </section>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </>
  );
}
