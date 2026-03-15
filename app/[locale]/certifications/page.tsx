import type { Metadata } from 'next';
import Link from 'next/link';
import { certificationsSotaData } from '@/data/certifications-sota';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { certificacoesFaq } from '@/data/faq';

const providerOrder = ['Alura', 'Coursera', 'edX'] as const;
type CertificationItem = (typeof certificationsSotaData)[number];

function groupByProvider() {
  const groups = new Map<string, CertificationItem[]>();

  certificationsSotaData.forEach((certification) => {
    if (!groups.has(certification.provider)) {
      groups.set(certification.provider, []);
    }
    groups.get(certification.provider)?.push(certification);
  });

  groups.forEach((certifications) => {
    certifications.sort((a, b) => {
      const aPos = 'position' in a ? a.position || Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      const bPos = 'position' in b ? b.position || Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      if (aPos !== bPos) {
        return aPos - bPos;
      }
      return a.name.localeCompare(b.name);
    });
  });

  const providerRank = new Map<string, number>(providerOrder.map((provider, index) => [provider, index]));

  return Array.from(groups.entries())
    .map(([provider, certifications]) => ({ provider, certifications }))
    .sort((a, b) => {
      const rankA = providerRank.get(a.provider) ?? Number.MAX_SAFE_INTEGER;
      const rankB = providerRank.get(b.provider) ?? Number.MAX_SAFE_INTEGER;
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      return a.provider.localeCompare(b.provider);
    });
}

export const metadata: Metadata = {
  title: 'Certificações Técnicas em IA, Blockchain e Engenharia de Software | Ulisses Flores',
  description:
    'Portfólio de certificações técnicas de Ulisses Flores — Consultor Estratégico de IA, Professor, Palestrante e Mestrando AGTU (EUA). Mais de 30 certificações em IA, Machine Learning, Blockchain, Cloud e Engenharia de Software com verificação pública.',
  keywords: [
    'certificações IA',
    'certificações machine learning',
    'certificações blockchain',
    'competências técnicas Ulisses Flores',
    'Alura Coursera edX certificações',
    'consultor certificado IA',
    'engenharia de software certificações',
  ],
  alternates: {
    canonical: '/certifications',
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}/certifications`,
    title: 'Certificações Técnicas em IA, Blockchain e Engenharia de Software | Ulisses Flores',
    description:
      'Portfólio de certificações técnicas de Ulisses Flores — Consultor Estratégico de IA, Professor, Palestrante e Mestrando AGTU (EUA). Mais de 30 certificações com verificação pública.',
    locale: 'pt_BR',
  },
};

export default function CertificationsPage() {
  const providerGroups = groupByProvider();

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${upkfMeta.primaryWebsite}/certifications#collection`,
        url: `${upkfMeta.primaryWebsite}/certifications`,
        name: 'Certificações Técnicas | Ulisses Flores',
        description:
          'Diretório canônico de certificações técnicas de Ulisses Flores, com verificação pública e contexto de aplicação em consultoria e pesquisa.',
        inLanguage: 'pt-BR',
        about: {
          '@id': `${upkfMeta.primaryWebsite}/#person`,
        },
        hasPart: certificationsSotaData.map((certification) => ({
          '@type': 'EducationalOccupationalCredential',
          '@id': `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
          name: certification.title,
          url: `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
        })),
      },
    ],
  };

  return (
    <>
      {/* Hero Section — white, SEO/GEO/LLM optimized */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-5xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              Certificações
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            Certificações Técnicas em IA, Blockchain e Engenharia de Software
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            Portfólio auditável de competências técnicas de Ulisses Flores — evidência concreta
            da fluência multidisciplinar que fundamenta sua atuação como Consultor Estratégico
            de IA, Professor Convidado, Palestrante e Desenvolvedor por demanda.
          </p>

          {/* Authority block */}
          <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              Credenciais como base para consultoria de alto ticket
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              Cada certificação representa domínio técnico verificável, aplicado diretamente em
              projetos reais de consultoria, arquitetura de sistemas e pesquisa acadêmica. Com mais
              de 30 certificações em plataformas como Alura, Coursera e edX — e Mestrando em IA pela
              AGTU (EUA) — Ulisses Flores combina profundidade teórica com execução prática.
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {[
              'Consultor Estratégico de IA',
              'Palestrante',
              'Professor Convidado',
              'Mestrando AGTU (EUA)',
              'Desenvolvedor por Demanda',
              '+30 Certificações Verificáveis',
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

      {/* Certifications Grid */}
      <section className='bg-neutral-950 text-neutral-200'>
        <div className='max-w-5xl mx-auto px-6 py-16'>
          <div className='mb-6'>
            <AuthorHubCard
              label='Curadoria canônica'
              compact
              description='Coleção conectada ao hub de identidade para reforço de autoria em SEO e LLMs.'
            />
          </div>

          <div className='space-y-10'>
            {providerGroups.map((group) => (
              <section key={group.provider} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
                <h2 className='text-2xl font-semibold text-white mb-4'>{group.provider}</h2>
                <div className='grid gap-4'>
                  {group.certifications.map((certification) => (
                    <article key={certification.slug} className='rounded-lg border border-neutral-800 bg-neutral-950/60 p-5'>
                      <h3 className='text-lg font-semibold text-white mb-2'>
                        <Link href={certification.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                          {certification.title}
                        </Link>
                      </h3>
                      <p className='text-sm text-neutral-400 mb-3'>{certification.summary}</p>
                      <p className='text-sm text-neutral-300 mb-4'>{certification.about}</p>

                      <div className='mb-4'>
                        <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>Habilidades adquiridas</p>
                        <div className='flex flex-wrap gap-2'>
                          {certification.skills.map((skill) => (
                            <span key={skill} className='rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300'>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className='mb-4'>
                        <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>Problemas enfrentados</p>
                        <p className='text-sm text-neutral-300'>{certification.problems_solved}</p>
                      </div>

                      <div className='flex flex-wrap gap-3 text-xs'>
                        {certification.certId ? (
                          <span className='rounded-full border border-neutral-700 px-3 py-1 text-neutral-300'>
                            {certification.certId}
                          </span>
                        ) : null}
                        <a
                          href={certification.verifyUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300 hover:bg-emerald-900/40 transition-colors'
                        >
                          Verify URL
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
          <h2 className='text-xl font-bold text-white mb-3'>
            Precisa de um Consultor ou Desenvolvedor com estas competências?
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            Ulisses Flores atende empresas, startups e instituições como Consultor Estratégico
            de IA, Professor Convidado e Desenvolvedor por demanda em C++, Java, Python,
            Blockchain e arquitetura de sistemas complexos.
          </p>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            Contratar Ulisses Flores →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={certificacoesFaq}
            sectionTitle='Perguntas sobre Certificações e Competências Técnicas'
          />
        </div>
      </section>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </>
  );
}
