import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen, Cpu, Github, Linkedin, Mail, Terminal, Download,
  Globe, MapPin, MessageCircle,
  Layers, Code, Briefcase, Award, TrendingUp,
  Database, CheckCircle, FileText, FlaskConical
} from 'lucide-react';
import { publications } from '@/data/publications';
import { FaqSection } from '@/components/faq-section';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { isLocale, defaultLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildLanguageAlternates } from '@/data/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.home;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    authors: [{ name: 'Ulisses Flores', url: 'https://ulissesflores.com/identidade' }],
    alternates: { canonical: '/', languages: buildLanguageAlternates('/') },
    openGraph: {
      type: 'profile',
      url: 'https://ulissesflores.com',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
      images: [
        {
          url: 'https://ulissesflores.com/carlos-ulisses-flores-cto.jpg',
          width: 800,
          height: 800,
          alt: t.meta.ogImageAlt,
        },
      ],
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.home;
  const tFaq = dict.faq.home;
  const origin = upkfMeta.primaryWebsite;

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${origin}/#profilepage`,
        url: origin,
        name: t.meta.ogTitle,
        mainEntity: {
          '@id': `${origin}/#person`,
        },
        isPartOf: {
          '@id': `${origin}/#website`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: 'Ulisses Flores',
        description: t.meta.ogDescription,
        inLanguage: locale,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${origin}/research?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Person',
        '@id': `${origin}/#person`,
        name: 'Carlos Ulisses Flores',
        alternateName: 'Ulisses Flores',
        url: origin,
        image: `${origin}/carlos-ulisses-flores-cto.jpg`,
        jobTitle: [t.hero.badges.cto, t.hero.badges.msc, t.hero.badges.polymath],
        description: t.meta.description,
        sameAs: [
          'https://orcid.org/0000-0002-6034-7765',
          'https://lattes.cnpq.br/6905246706890561',
          'https://keybase.io/ul1ss3sfl0r3s',
          'https://www.linkedin.com/in/ulisses-flores-75961921',
        ],
        knowsLanguage: ['pt-BR', 'en', 'es'],
        areaServed: ['Jundiaí', 'Itupeva', 'São Paulo', 'Brasil'], // Geo names stay canonical
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'American Global Tech University (AGTU)', location: 'EUA' },
          { '@type': 'CollegeOrUniversity', name: 'FIAP', location: 'São Paulo, Brasil' },
        ],
      },
    ],
  };
  const featuredPublications = [...publications]
    .sort((a, b) => {
      if (a.date === b.date) {
        return a.ordinal - b.ordinal;
      }
      return Number(b.date) - Number(a.date);
    })
    .slice(0, 4);

  const categoryLabels = t.publications.categoryLabels;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-emerald-500/30 scroll-smooth">
      {/* Background Matrix/Grid Sutil */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#10b98110,transparent)] pointer-events-none"></div>
      
      <main className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 z-10">
        
        {/* HERO SECTION */}
        <header id="about" className="mb-24 animate-fade-in-up scroll-mt-32">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative w-44 h-44 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden ring-2 ring-neutral-800 shadow-2xl">
                 <Image 
                   src="/carlos-ulisses-flores-cto.jpg" 
                   alt={t.hero.imageAlt}
                   width={176}
                   height={176}
                   className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
                   priority
                 />
              </div>
            </div>
            
            <div className="text-center md:text-start pt-2 flex-1">
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                Carlos Ulisses Flores
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-medium uppercase tracking-wider mb-6">
                <Badge icon={<Terminal size={14} />} text={t.hero.badges.cto} color="emerald" />
                <Badge icon={<Cpu size={14} />} text={t.hero.badges.msc} color="cyan" />
                <Badge icon={<Layers size={14} />} text={t.hero.badges.polymath} color="purple" />
              </div>
              
              <p className="text-xl text-neutral-400 leading-relaxed italic border-s-4 border-emerald-500/50 ps-6 mb-8 text-start">
                {t.hero.quote}
              </p>
              
              <div className="flex justify-center md:justify-start gap-6 text-xs font-mono text-neutral-500">
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t.hero.languages.pt}</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t.hero.languages.en}</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t.hero.languages.es}</span>
              </div>
            </div>
          </div>

          <div id="contact" className="grid md:grid-cols-2 gap-4 scroll-mt-24">
            <div className="bg-neutral-900/30 p-5 rounded-xl border border-white/5 flex flex-wrap gap-3 items-center backdrop-blur-sm">
               <span className="text-[10px] font-bold text-neutral-500 w-full uppercase mb-1 tracking-widest">{t.contact.academicLinks}</span>
               <SocialBtn href="https://lattes.ulissesflores.com" icon={<BookOpen size={16} />} label="Lattes CV" primary />
               <SocialBtn href="https://orcid.ulissesflores.com" icon={<Globe size={16} />} label="ORCID" />
               <SocialBtn href="https://linkedin.ulissesflores.com" icon={<Linkedin size={16} />} label="LinkedIn" />
               <SocialBtn href="https://github.ulissesflores.com" icon={<Github size={16} />} label="GitHub" />
            </div>
            <div className="bg-neutral-900/30 p-5 rounded-xl border border-white/5 flex flex-wrap gap-3 items-center backdrop-blur-sm">
               <span className="text-[10px] font-bold text-neutral-500 w-full uppercase mb-1 tracking-widest">{t.contact.directContact}</span>
               <SocialBtn href="https://wa.me/5511972727532" icon={<MessageCircle size={16} />} label="WhatsApp" color="emerald" />
               <SocialBtn href="mailto:c.ulisses@gmail.com" icon={<Mail size={16} />} label="Email" />
               <SocialBtn href="https://gmb.ulissesflores.com" icon={<MapPin size={16} />} label={t.contact.location} />
            </div>
          </div>
        </header>

        {/* BIO INTELIGENTE */}
        <section id="pillars" className="mb-24 scroll-mt-24">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">{t.pillars.title}</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
              <BioCard 
                icon={<TrendingUp className="text-emerald-400" />}
                title={t.pillars.cards.finance.title}
                items={[...t.pillars.cards.finance.items]}
              />
              <BioCard 
                icon={<Cpu className="text-amber-400" />}
                title={t.pillars.cards.hardware.title}
                items={[...t.pillars.cards.hardware.items]}
              />
              <BioCard 
                icon={<Code className="text-cyan-400" />}
                title={t.pillars.cards.ai.title}
                items={[...t.pillars.cards.ai.items]}
              />
           </div>
        </section>

        {/* TRAJETÓRIA (Timeline Completa) */}
        <section id="trajectory" className="grid md:grid-cols-12 gap-12 mb-24 scroll-mt-24">
          
          <div className="md:col-span-5 space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
               <Award className="text-cyan-500" /> {t.trajectory.formation.title}
            </h2>
            
            <FormationCard 
               year={t.trajectory.formation.items.msc.year} 
               title={t.trajectory.formation.items.msc.title} 
               inst={t.trajectory.formation.items.msc.inst}
               desc={t.trajectory.formation.items.msc.desc} 
               highlight
            />
            <FormationCard 
               year={t.trajectory.formation.items.mba.year} 
               title={t.trajectory.formation.items.mba.title} 
               inst={t.trajectory.formation.items.mba.inst}
               desc={t.trajectory.formation.items.mba.desc} 
            />
            <FormationCard 
               year={t.trajectory.formation.items.engSoftware.year} 
               title={t.trajectory.formation.items.engSoftware.title} 
               inst={t.trajectory.formation.items.engSoftware.inst}
               desc={t.trajectory.formation.items.engSoftware.desc} 
            />
            <FormationCard 
               year={t.trajectory.formation.items.economics.year} 
               title={t.trajectory.formation.items.economics.title} 
               inst={t.trajectory.formation.items.economics.inst}
               desc={t.trajectory.formation.items.economics.desc} 
            />
            
            <div className="bg-neutral-900/20 p-4 rounded-lg border border-white/5 mt-6">
               <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">{t.trajectory.formation.extension.title}</h3>
               <ul className="space-y-2 text-sm text-neutral-300">
                  {[...t.trajectory.formation.extension.items].map((item, i) => (
                     <li key={i} className="flex gap-2 items-center"><Globe size={12} className={i === 0 ? 'text-emerald-500' : 'text-cyan-500'}/> {item}</li>
                  ))}
               </ul>
            </div>
          </div>

          <div className="md:col-span-7 space-y-8">
             <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
               <Briefcase className="text-emerald-500" /> {t.trajectory.career.title}
             </h2>
             
             <div className="relative border-s border-neutral-800 ms-3 space-y-10 ps-8 py-2">
                <TimelineItem 
                   role={t.trajectory.career.items.codexHash.role} 
                   company={t.trajectory.career.items.codexHash.company} 
                   period={t.trajectory.career.items.codexHash.period}
                   desc={t.trajectory.career.items.codexHash.desc}
                   currentLabel={t.trajectory.career.currentBadge}
                   current
                />
                <TimelineItem 
                   role={t.trajectory.career.items.prefeitura.role} 
                   company={t.trajectory.career.items.prefeitura.company} 
                   period={t.trajectory.career.items.prefeitura.period}
                   desc={t.trajectory.career.items.prefeitura.desc}
                />
                <TimelineItem 
                   role={t.trajectory.career.items.mv9.role} 
                   company={t.trajectory.career.items.mv9.company} 
                   period={t.trajectory.career.items.mv9.period}
                   desc={t.trajectory.career.items.mv9.desc}
                />
                <TimelineItem 
                   role={t.trajectory.career.items.c3.role} 
                   company={t.trajectory.career.items.c3.company} 
                   period={t.trajectory.career.items.c3.period}
                   desc={t.trajectory.career.items.c3.desc}
                />
                 <TimelineItem 
                   role={t.trajectory.career.items.early.role} 
                   company={t.trajectory.career.items.early.company} 
                   period={t.trajectory.career.items.early.period}
                   desc={t.trajectory.career.items.early.desc}
                   isOld
                />
             </div>
          </div>
        </section>

        {/* ENGENHARIA & PRODUTOS */}
        <section id="engineering" className="mb-24 scroll-mt-24">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                 <Code className="text-purple-500" /> {t.engineering.title}
              </h2>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <ProductCard 
                 title={t.engineering.products.algoTrading.title} 
                 desc={t.engineering.products.algoTrading.desc}
                 tags={[...t.engineering.products.algoTrading.tags]}
              />
              <ProductCard 
                 title={t.engineering.products.goldenleaf.title} 
                 desc={t.engineering.products.goldenleaf.desc}
                 tags={[...t.engineering.products.goldenleaf.tags]}
              />
              <ProductCard 
                 title={t.engineering.products.bioBytes.title} 
                 desc={t.engineering.products.bioBytes.desc}
                 tags={[...t.engineering.products.bioBytes.tags]}
              />
              <ProductCard 
                 title={t.engineering.products.clubeSanto.title} 
                 desc={t.engineering.products.clubeSanto.desc}
                 tags={[...t.engineering.products.clubeSanto.tags]}
              />
           </div>
        </section>

        {/* SKILLS & CERTIFICAÇÕES */}
        <section className="mb-24 scroll-mt-24">
           <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Database size={16} className="text-emerald-500"/> {t.skills.title}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                 <SkillColumn 
                    title={t.skills.columns.core.title} 
                    items={[...t.skills.columns.core.items]}
                 />
                 <SkillColumn 
                    title={t.skills.columns.architecture.title} 
                    items={[...t.skills.columns.architecture.items]}
                 />
                 <SkillColumn 
                    title={t.skills.columns.management.title} 
                    items={[...t.skills.columns.management.items]}
                 />
                 <div>
                    <h4 className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-4 border-b border-emerald-500/20 pb-2">{t.skills.columns.certifications.title}</h4>
                    <div className="flex flex-wrap gap-2">
                       {[...t.skills.columns.certifications.items].map((s, i) => (
                          <span key={i} className="text-[10px] bg-neutral-950 text-neutral-400 px-2 py-1 rounded border border-neutral-800 cursor-default hover:text-white transition-colors">{s}</span>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* PUBLICAÇÕES */}
        <section id="research" className="mb-24 scroll-mt-24">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
             <BookOpen className="text-cyan-500" /> {t.publications.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPublications.map((publication) => (
              <LinkCard
                key={publication.id}
                category={categoryLabels[publication.category]}
                title={publication.title}
                desc={publication.summary}
                href={`/${publication.category}/${publication.id}`}
              />
            ))}
          </div>
        </section>

        <section id="simulacoes" className="mb-24 scroll-mt-24">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <FlaskConical className="text-emerald-500" /> {t.simulacoes.title}
          </h2>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-300 mb-3">{t.simulacoes.kicker}</p>
            <h3 className="text-3xl font-bold text-white mb-3">{t.simulacoes.heading}</h3>
            <p className="text-neutral-300 leading-relaxed mb-6 max-w-3xl">
              {t.simulacoes.description}
            </p>
            <Link
              href="/simulacoes/ia-2027"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 px-5 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-900/25 transition-colors"
            >
              {t.simulacoes.cta}
            </Link>
          </div>
        </section>

        <section id="codexhash" className="mb-24 scroll-mt-24 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">{t.codexHash.title}</h2>
          <p className="text-neutral-300 leading-relaxed mb-4">
            {t.codexHash.description}
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed">
            {t.codexHash.anchor}
          </p>
        </section>

        {/* SEÇÃO: FORMAL BIO / MANIFESTO (O Texto Lattes na íntegra) */}
        <section id="manifesto" className="mb-24 scroll-mt-24 border-t border-white/5 pt-12">
           <div className="flex items-center gap-3 mb-8 opacity-70">
              <FileText size={18} className="text-neutral-500" />
              <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">{t.manifesto.title}</h2>
           </div>
           
           <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-8 font-mono text-sm text-neutral-400 leading-relaxed text-justify space-y-6 shadow-inner">
              <p>
                <span className="text-emerald-500 font-bold">&gt;</span> {t.manifesto.intro}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div>
                   <strong className="block text-neutral-300 mb-2">{t.manifesto.formation.title}</strong>
                   <p>{t.manifesto.formation.text}</p>
                </div>
                <div>
                   <strong className="block text-neutral-300 mb-2">{t.manifesto.leadership.title}</strong>
                   <p>{t.manifesto.leadership.text}</p>
                </div>
              </div>

              <div className="pt-4">
                 <strong className="block text-neutral-300 mb-2">{t.manifesto.arsenal.title}</strong>
                 <p className="mb-4">
                   {t.manifesto.arsenal.engineering}
                   <br/>
                   {t.manifesto.arsenal.dataScience}
                 </p>
                 <p>
                   {t.manifesto.arsenal.humanities}
                 </p>
              </div>
           </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-12 scroll-mt-24">
          <FaqSection items={[...tFaq]} sectionTitle={t.faq.sectionTitle} />
        </section>

        <footer className="text-center text-neutral-600 text-sm py-12 border-t border-white/5">
          <p>{t.pageFooter.copyright}</p>
          <p className="text-xs mt-2 font-mono text-neutral-700">{t.pageFooter.version}</p>
        </footer>

      </main>

      <script
        id='structured-data-home'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
    </div>
  );
}

// ================= COMPONENTES VISUAIS =================

function BioCard({ icon, title, items }: any) {
  return (
    <div className="bg-neutral-900/20 border border-neutral-800 p-6 rounded-xl hover:bg-neutral-900 hover:border-emerald-500/20 transition-colors">
       <div className="mb-4">{icon}</div>
       <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
       <ul className="space-y-2">
         {items.map((item: string, i: number) => (
           <li key={i} className="text-sm text-neutral-400 border-b border-neutral-800/50 pb-2 last:border-0 flex gap-2">
             <span className="text-emerald-500/50">•</span> {item}
           </li>
         ))}
       </ul>
    </div>
  )
}

function SkillColumn({ title, items }: any) {
   return (
      <div>
         <h4 className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-4 border-b border-emerald-500/20 pb-2 flex items-center gap-2">
            <div className="w-1 h-3 bg-emerald-500 rounded-full"></div> {title}
         </h4>
         <ul className="space-y-2">
            {items.map((s: string, i: number) => (
               <li key={i} className="text-sm text-neutral-400 hover:text-white transition-colors cursor-default flex items-center gap-2">
                  <CheckCircle size={10} className="text-neutral-600"/> {s}
               </li>
            ))}
         </ul>
      </div>
   )
}

function FormationCard({ year, title, inst, desc, highlight }: any) {
  return (
    <div className={`border-s-2 ps-4 py-1 transition-colors group ${highlight ? 'border-emerald-500' : 'border-neutral-800 hover:border-cyan-500'} mb-6`}>
      <div className={`text-xs font-mono mb-1 ${highlight ? 'text-emerald-400' : 'text-cyan-600'}`}>{year}</div>
      <div className={`font-bold text-lg ${highlight ? 'text-white' : 'text-neutral-200 group-hover:text-white'}`}>{title}</div>
      <div className="text-sm text-neutral-400 mb-1">{inst}</div>
      <div className="text-xs text-neutral-500 italic leading-relaxed">{desc}</div>
    </div>
  )
}

function TimelineItem({ role, company, period, desc, current, currentLabel, isOld }: any) {
  return (
    <div className={`relative ${isOld ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
      <span className={`absolute -left-[41px] top-1.5 w-4 h-4 rounded-full border-2 border-neutral-950 ${current ? 'bg-emerald-500' : 'bg-neutral-700'}`}></span>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
        <h3 className={`text-lg font-bold ${current ? 'text-white' : 'text-neutral-300'}`}>{role}</h3>
        <span className="text-xs font-mono px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-500">{period}</span>
      </div>
      <div className={`font-medium text-sm mb-2 ${current ? 'text-emerald-400' : 'text-cyan-600'}`}>
        {company}
        {current && currentLabel && <span className="ml-2 text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">{currentLabel}</span>}
      </div>
      <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">{desc}</p>
    </div>
  )
}

function ProductCard({ title, tags, desc }: any) {
  return (
    <div className="group bg-neutral-900/30 border border-neutral-800 p-6 rounded-xl hover:bg-neutral-900 transition-all">
       <div className="flex justify-between items-start mb-4">
         <h3 className="font-bold text-lg text-neutral-200 group-hover:text-white transition-colors">{title}</h3>
         <div className="text-neutral-600 group-hover:text-emerald-500 transition-colors">
            <Code size={18} />
         </div>
       </div>
       <p className="text-sm text-neutral-400 mb-6 min-h-[48px] leading-relaxed">{desc}</p>
       <div className="flex flex-wrap gap-2">
         {tags.map((t: string, i: number) => (
           <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 bg-neutral-950 rounded text-neutral-500 border border-neutral-800 group-hover:border-neutral-700">{t}</span>
         ))}
       </div>
    </div>
  )
}

function LinkCard({ category, title, desc, href }: { category: string, title: string, desc: string, href: string }) {
  return (
    <a href={href} className="group block p-6 bg-neutral-900/30 border border-neutral-800 rounded-xl hover:bg-neutral-900 hover:border-emerald-500/30 transition-all duration-300 relative">
      <div className="absolute top-6 right-6 text-neutral-700 group-hover:text-emerald-500 transition-colors">
        <Download size={20} />
      </div>
      <div className="text-[10px] font-bold text-cyan-600 mb-2 tracking-widest uppercase">{category}</div>
      <h3 className="text-lg font-bold text-neutral-200 group-hover:text-white mb-2 pr-8">{title}</h3>
      <p className="text-sm text-neutral-400 group-hover:text-neutral-300 leading-relaxed pr-8">{desc}</p>
    </a>
  );
}

function Badge({ icon, text, color }: { icon: any, text: string, color: string }) {
  const colors: any = {
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };
  return (
    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${colors[color]} cursor-default`}>
      {icon} {text}
    </span>
  );
}

function SocialBtn({ href, icon, label, primary, color }: { href: string, icon: any, label: string, primary?: boolean, color?: string }) {
  const baseClass = "p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-bold transition-all duration-300";
  const styleClass = primary 
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-white"
    : color === "emerald" 
      ? "bg-neutral-900 border border-neutral-800 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600";

  return (
    <a href={href} target="_blank" className={`${baseClass} ${styleClass}`}>
      {icon} {label}
    </a>
  );
}
