import type { Metadata } from 'next';
import Image from 'next/image';
import { Download, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { defaultLocale, isLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildCanonical, buildLanguageAlternates, defaultOgImages } from '@/data/seo';
import { cardLinks, contactEmail, portrait, whatsappHref } from '@/data/contact-card';
import { CardSourceTracker } from '@/components/card-source-tracker';

const canonicalPath = '/c';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const t = (await getDictionary(locale)).cartao;

  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: buildCanonical(locale, canonicalPath),
      languages: buildLanguageAlternates(canonicalPath),
    },
    /*
     * `noindex, follow` de propósito. A `/c` é um hub de links curto: para a busca
     * "Ulisses Flores" ela competiria com a home em vez de somar, e a home é a página
     * que deve ganhar. `follow` mantém os perfis alcançáveis pelo rastreador.
     * Some do sitemap pelo mesmo motivo — URL noindex dentro do sitemap é sinal
     * conflitante, o mesmo erro que este repo já corrigiu em 2026-07.
     */
    robots: { index: false, follow: true },
    openGraph: {
      // Explícito porque o Next SUBSTITUI o openGraph do layout pai. Sem isto a `/c`
      // sairia com card cego — justamente no WhatsApp, que é por onde ela vai circular.
      images: defaultOgImages(locale),
      type: 'profile',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
    },
  };
}

export default async function CartaoPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const t = (await getDictionary(locale)).cartao;

  const name = upkfMeta.publicDisplayName || upkfMeta.displayName;
  const wa = whatsappHref();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${upkfMeta.primaryWebsite}${canonicalPath}#contact`,
    name: t.meta.ogTitle,
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    inLanguage: locale,
    isPartOf: { '@id': `${upkfMeta.primaryWebsite}/#website` },
    mainEntity: { '@id': `${upkfMeta.primaryWebsite}/#person` },
  };

  /* Alvos de toque com 56px de altura: este é o único ecrã do site desenhado para
     ser usado de pé, com uma mão, segundos depois de encostar o celular num cartão. */
  const row =
    'flex items-center gap-4 min-h-14 rounded-xl border border-neutral-800 bg-neutral-900/40 px-5 py-4 transition-colors hover:border-emerald-500/40 focus-visible:border-emerald-500/60';

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CardSourceTracker />

      {/* O fundo escuro é responsabilidade da página: o `body` do site é branco. */}
      <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='mx-auto flex w-full max-w-md flex-col gap-6 px-6 pb-16 pt-24'>
        <header className='flex flex-col items-center gap-4 text-center'>
          <Image
            src={portrait}
            alt={name}
            width={112}
            height={112}
            priority
            className='h-28 w-28 rounded-full border border-neutral-700 object-cover'
          />
          <div>
            <h1 className='text-2xl font-bold text-white'>{name}</h1>
            <p className='mt-1 text-sm text-emerald-400'>{t.role}</p>
          </div>
        </header>

        {/* Ação primária: é o gesto que o cartão físico existe para produzir. */}
        <a
          href='/c.vcf'
          download='ulisses-flores.vcf'
          className='flex min-h-14 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-4 text-base font-bold text-neutral-950 transition-colors hover:bg-emerald-400'
        >
          <Download size={20} aria-hidden='true' />
          {t.saveContact}
        </a>
        <p className='-mt-4 text-center text-xs text-neutral-400'>{t.saveContactHint}</p>

        {wa && (
          <a href={wa} className={row} target='_blank' rel='noopener noreferrer'>
            <MessageCircle size={20} className='shrink-0 text-emerald-500' aria-hidden='true' />
            <span>
              <span className='block text-sm font-medium text-neutral-100'>{t.whatsapp}</span>
              <span className='block text-xs text-neutral-400'>{t.whatsappHint}</span>
            </span>
          </a>
        )}

        <a href={`mailto:${contactEmail}`} className={row}>
          <Mail size={20} className='shrink-0 text-emerald-500' aria-hidden='true' />
          <span>
            <span className='block text-sm font-medium text-neutral-100'>{t.email}</span>
            <span className='block text-xs text-neutral-400'>{contactEmail}</span>
          </span>
        </a>

        <section className='flex flex-col gap-3'>
          <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-neutral-400'>
            {t.linksTitle}
          </h2>
          {cardLinks.map(({ id, href }) => (
            <a key={id} href={href} className={row} target='_blank' rel='noopener noreferrer'>
              <span className='flex-1'>
                <span className='block text-sm font-medium text-neutral-100'>
                  {t.links[id].label}
                </span>
                <span className='block text-xs text-neutral-400'>{t.links[id].description}</span>
              </span>
              <ArrowUpRight size={16} className='shrink-0 text-neutral-500' aria-hidden='true' />
            </a>
          ))}
        </section>

        <p className='pt-2 text-center text-xs text-neutral-400'>ulissesflores.com</p>
      </main>
      </div>
    </>
  );
}
