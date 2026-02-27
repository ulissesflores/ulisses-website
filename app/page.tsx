import Image from 'next/image';
import { 
  BookOpen, Cpu, Github, Linkedin, Mail, Terminal, Download, 
  Globe, MapPin, MessageCircle, 
  Layers, Code, Briefcase, Award, TrendingUp, 
  Database, CheckCircle, FileText
} from 'lucide-react';
import { publications } from '@/data/publications';

export default function Home() {
  const featuredPublications = [...publications]
    .sort((a, b) => {
      if (a.date === b.date) {
        return a.ordinal - b.ordinal;
      }
      return Number(b.date) - Number(a.date);
    })
    .slice(0, 4);

  const categoryLabels = {
    research: 'RESEARCH • IA & ECONOMIA',
    whitepapers: 'WHITEPAPER • ENGENHARIA',
    essays: 'ENSAIO • HUMANIDADES',
  } as const;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-emerald-500/30 scroll-smooth">
      {/* Background Matrix/Grid Sutil */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#10b98110,transparent)] pointer-events-none"></div>
      
      {/* MENU FLUTUANTE */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-emerald-500 font-bold text-lg tracking-wider flex items-center gap-2">
            <Terminal size={18} /> UF<span className="text-neutral-500 font-light">.SCIENTIST</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-400">
            <a href="#about" className="hover:text-white transition-colors">Bio</a>
            <a href="#pillars" className="hover:text-white transition-colors">Expertise</a>
            <a href="#trajectory" className="hover:text-white transition-colors">Trajetória</a>
            <a href="#research" className="hover:text-white transition-colors">Publicações</a>
            <a href="/certifications" className="hover:text-white transition-colors">Certificações</a>
            <a href="/acervo-teologico" className="hover:text-white transition-colors">Sermões</a>
            <a href="/mundo-politico" className="hover:text-white transition-colors">Mundo Político</a>
          </div>
          <a href="#contact" className="px-4 py-2 bg-neutral-100 text-neutral-900 text-xs font-bold rounded-full hover:bg-emerald-400 transition-colors">
            FALE COMIGO
          </a>
        </div>
      </nav>

      <main className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 z-10">
        
        {/* HERO SECTION */}
        <header id="about" className="mb-24 animate-fade-in-up scroll-mt-32">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative w-44 h-44 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden ring-2 ring-neutral-800 shadow-2xl">
                 <Image 
                   src="/carlos-ulisses-flores-cto.jpg" 
                   alt="Carlos Ulisses Flores - CTO e Pesquisador Chefe da Codex Hash Ltda em Itupeva"
                   width={176}
                   height={176}
                   className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
                   priority
                 />
              </div>
            </div>
            
            <div className="text-center md:text-left pt-2 flex-1">
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                Carlos Ulisses Flores
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-medium uppercase tracking-wider mb-6">
                <Badge icon={<Terminal size={14} />} text="CTO & Pesquisador Chefe" color="emerald" />
                <Badge icon={<Cpu size={14} />} text="MSc Candidate AI @ AGTU" color="cyan" />
                <Badge icon={<Layers size={14} />} text="Polímata" color="purple" />
              </div>
              
              <p className="text-xl text-neutral-400 leading-relaxed italic border-l-4 border-emerald-500/50 pl-6 mb-8 text-left">
                "Atuando na fronteira do desenvolvimento tecnológico, integrando rigor acadêmico e pragmatismo executivo para solucionar problemas em sistemas complexos adaptativos."
              </p>
              
              <div className="flex justify-center md:justify-start gap-6 text-xs font-mono text-neutral-500">
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> PORTUGUÊS (NATIVO)</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> INGLÊS (FLUENTE)</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> ESPANHOL (FLUENTE)</span>
              </div>
            </div>
          </div>

          <div id="contact" className="grid md:grid-cols-2 gap-4 scroll-mt-24">
            <div className="bg-neutral-900/30 p-5 rounded-xl border border-white/5 flex flex-wrap gap-3 items-center backdrop-blur-sm">
               <span className="text-[10px] font-bold text-neutral-500 w-full uppercase mb-1 tracking-widest">Links Acadêmicos</span>
               <SocialBtn href="https://lattes.ulissesflores.com" icon={<BookOpen size={16} />} label="Lattes CV" primary />
               <SocialBtn href="https://orcid.ulissesflores.com" icon={<Globe size={16} />} label="ORCID" />
               <SocialBtn href="https://linkedin.ulissesflores.com" icon={<Linkedin size={16} />} label="LinkedIn" />
               <SocialBtn href="https://github.ulissesflores.com" icon={<Github size={16} />} label="GitHub" />
            </div>
            <div className="bg-neutral-900/30 p-5 rounded-xl border border-white/5 flex flex-wrap gap-3 items-center backdrop-blur-sm">
               <span className="text-[10px] font-bold text-neutral-500 w-full uppercase mb-1 tracking-widest">Contato Direto</span>
               <SocialBtn href="https://wa.me/5511972727532" icon={<MessageCircle size={16} />} label="WhatsApp" color="emerald" />
               <SocialBtn href="mailto:c.ulisses@gmail.com" icon={<Mail size={16} />} label="Email" />
               <SocialBtn href="https://gmb.ulissesflores.com" icon={<MapPin size={16} />} label="Localização" />
            </div>
          </div>
        </header>

        {/* BIO INTELIGENTE */}
        <section id="pillars" className="mb-24 scroll-mt-24">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Pilares de Atuação</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
              <BioCard 
                icon={<TrendingUp className="text-emerald-400" />}
                title="Finanças Quant & Web3"
                items={[
                  "Algoritmos HFT e Arbitragem (Cash & Carry)",
                  "Custódia Institucional (MPC) e Privacidade (Monero)",
                  "Smart Contracts Auditáveis (Solidity)"
                ]}
              />
              <BioCard 
                icon={<Cpu className="text-amber-400" />}
                title="Hardware & IoT"
                items={[
                  "Edge Computing e Automação Agrícola (GoldenLeaf)",
                  "Arquiteturas 'Cloudless' e Zero Trust",
                  "Criptografia Embarcada (ESP32/ECC)"
                ]}
              />
              <BioCard 
                icon={<Code className="text-cyan-400" />}
                title="AI & Ciência de Dados"
                items={[
                  "Resiliência Cibernética (LSTM + Lei de Little)",
                  "Detecção de Anomalias em Séries Temporais",
                  "Pipelines de Data Science Financeiro"
                ]}
              />
           </div>
        </section>

        {/* TRAJETÓRIA (Timeline Completa) */}
        <section id="trajectory" className="grid md:grid-cols-12 gap-12 mb-24 scroll-mt-24">
          
          <div className="md:col-span-5 space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
               <Award className="text-cyan-500" /> Formação Acadêmica
            </h2>
            
            <FormationCard 
               year="2025" 
               title="Mestrado em IA (MSc)" 
               inst="American Global Tech University (USA)"
               desc="Pesquisa: Resiliência em Sistemas Complexos." 
               highlight
            />
            <FormationCard 
               year="2018 - 2020" 
               title="MBA em Blockchain Dev" 
               inst="FIAP (1ª Turma do Brasil)"
               desc="Criptoeconomia e Governança." 
            />
            <FormationCard 
               year="2018 - 2020" 
               title="Engenharia de Software" 
               inst="UNIP (Universidade Paulista)"
               desc="Arquitetura de Microsserviços." 
            />
            <FormationCard 
               year="2002 - 2017" 
               title="Bacharelado em Economia" 
               inst="Centro Universitário Padre Anchieta"
               desc="Monografia: Teoria do Caos." 
            />
            
            <div className="bg-neutral-900/20 p-4 rounded-lg border border-white/5 mt-6">
               <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Extensão Internacional</h3>
               <ul className="space-y-2 text-sm text-neutral-300">
                  <li className="flex gap-2 items-center"><Globe size={12} className="text-emerald-500"/> Univ. of Edinburgh (Filosofia da Ciência)</li>
                  <li className="flex gap-2 items-center"><Globe size={12} className="text-cyan-500"/> UC San Diego (Learning Sciences)</li>
               </ul>
            </div>
          </div>

          <div className="md:col-span-7 space-y-8">
             <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
               <Briefcase className="text-emerald-500" /> Trajetória Profissional
             </h2>
             
             <div className="relative border-l border-neutral-800 ml-3 space-y-10 pl-8 py-2">
                <TimelineItem 
                   role="CTO & Pesquisador Chefe" 
                   company="Codex Hash Ltda" 
                   period="2020 - Atual"
                   desc="Liderança de P&D em Finanças Quantitativas, Custódia (MPC) e Hardware IoT. Gestão de equipes."
                   current
                />
                <TimelineItem 
                   role="Gestão de Planejamento" 
                   company="Prefeitura de Itupeva" 
                   period="2017 - 2023"
                   desc="Responsável pelo planejamento estratégico municipal, orçamento e desenvolvimento socioeconômico."
                />
                <TimelineItem 
                   role="Sócio-Diretor & Arquiteto" 
                   company="MV9 Web & Sistemas" 
                   period="2012 - 2019"
                   desc="Desenvolvimento de ERPs, automação comercial e parceria com Google. Migração Cloud."
                />
                <TimelineItem 
                   role="Consultor Estratégico" 
                   company="C3 Group / EconoFísica" 
                   period="2013 - 2018"
                   desc="Auditoria de algoritmos (Loterias), LGPD e Business Intelligence financeiro."
                />
                 <TimelineItem 
                   role="Gestão & Tecnologia (Início)" 
                   company="Junifer / Bemarco / Skam" 
                   period="1998 - 2012"
                   desc="Década fundamental: Analista Financeiro, Coordenador Técnico e dev de sistemas iniciais (VBA/PHP)."
                   isOld
                />
             </div>
          </div>
        </section>

        {/* ENGENHARIA & PRODUTOS */}
        <section id="engineering" className="mb-24 scroll-mt-24">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                 <Code className="text-purple-500" /> Engenharia & Produtos
              </h2>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <ProductCard 
                 title="Codex Hash Algo-Trading" 
                 desc="Sistema estocástico de arbitragem e alta frequência (HFT) para mercados de criptoativos."
                 tags={["PYTHON", "MQL5", "GENETIC ALGO"]}
              />
              <ProductCard 
                 title="GoldenLeaf IoT System" 
                 desc="Sistema embarcado para controle ambiental e agricultura de precisão com criptografia de curva elíptica."
                 tags={["C++", "ESP32", "EDGE COMPUTING"]}
              />
              <ProductCard 
                 title="BioBytes Legacy" 
                 desc="Sistema de preservação digital de memória e herança biográfica com segurança de nível militar."
                 tags={["SECURITY", "CRYPTOGRAPHY", "BLOCKCHAIN"]}
              />
              <ProductCard 
                 title="Clube Santo Platform" 
                 desc="Plataforma digital de ensino teológico e comunidades virtuais com CMS proprietário."
                 tags={["REACT", "NODE.JS", "LMS"]}
              />
           </div>
        </section>

        {/* SKILLS & CERTIFICAÇÕES */}
        <section className="mb-24 scroll-mt-24">
           <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Database size={16} className="text-emerald-500"/> Stack Tecnológica & Habilidades
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                 <SkillColumn 
                    title="Core Engineering" 
                    items={["Node.js / TypeScript", "Python / Rust", "C++ / C# / C", "PHP / Java", "Solidity (Contracts)"]}
                 />
                 <SkillColumn 
                    title="Architecture & DevOps" 
                    items={["Microservices & Docker", "CI/CD Pipelines", "Linux CLI & OS", "UML / Design Patterns", "Cloudless Architectures"]}
                 />
                 <SkillColumn 
                    title="Gestão & Processos" 
                    items={["BPMN (Bizagi)", "Scrum & Agile / XP", "Value Stream Mapping", "Business Intelligence", "Quality Assurance (QA)"]}
                 />
                 <div>
                    <h4 className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-4 border-b border-emerald-500/20 pb-2">Certificações (Alura/FIAP)</h4>
                    <div className="flex flex-wrap gap-2">
                       {["AI Generativa", "Midjourney", "MongoDB", "RPA", "Blockchain Business", "C++ STL", "DevOps"].map((s, i) => (
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
             <BookOpen className="text-cyan-500" /> Publicações Selecionadas
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

        <section id="codexhash" className="mb-24 scroll-mt-24 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Codex Hash Ltda</h2>
          <p className="text-neutral-300 leading-relaxed mb-4">
            Laboratório de P&D (deep tech) com foco em finanças quantitativas/Web3, arquitetura cloudless para IoT
            e inteligência artificial aplicada à resiliência ciberfinanceira.
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Esta seção é a âncora oficial <code>#codexhash</code> para resolver links semânticos internos.
          </p>
        </section>

        {/* SEÇÃO: FORMAL BIO / MANIFESTO (O Texto Lattes na íntegra) */}
        <section id="manifesto" className="mb-24 scroll-mt-24 border-t border-white/5 pt-12">
           <div className="flex items-center gap-3 mb-8 opacity-70">
              <FileText size={18} className="text-neutral-500" />
              <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Resumo Profissional & Acadêmico (Lattes)</h2>
           </div>
           
           <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-8 font-mono text-sm text-neutral-400 leading-relaxed text-justify space-y-6 shadow-inner">
              <p>
                <span className="text-emerald-500 font-bold">&gt;</span> Cientista Econômico, Analista de Sistemas e Pesquisador Polímata com sólida trajetória de mais de 28 anos na convergência entre Engenharia Financeira, Arquitetura de Software Distribuída e Humanidades. Atua na fronteira do desenvolvimento tecnológico, integrando rigor acadêmico e pragmatismo executivo para solucionar problemas em sistemas complexos adaptativos.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div>
                   <strong className="block text-neutral-300 mb-2">:: Formação Acadêmica e Pesquisa Avançada</strong>
                   <p>Mestrando em Inteligência Artificial pela American Global Tech University (AGTU/EUA), onde desenvolve pesquisa de ponta sobre "Resiliência Cibernética e Financeira". Sua dissertação investiga arquiteturas híbridas que acoplam Redes Neurais Recorrentes (LSTM) com modelos estocásticos de fluxo (Lei de Little) e Inferência Bayesiana, visando a criação de agentes autônomos antifrágeis para mercados de alta volatilidade. Possui MBA em Blockchain Development & Technologies pela FIAP, com foco em criptoeconomia e governança descentralizada. Bacharel em Ciências Econômicas, com monografia revisitando a Teoria do Caos e a não-linearidade nos mercados sob a ótica da Escola Austríaca.</p>
                </div>
                <div>
                   <strong className="block text-neutral-300 mb-2">:: Liderança Executiva e Inovação</strong>
                   <p>Atualmente é CTO e Pesquisador Chefe na Codex Hash Ltda, liderando um laboratório de P&D focado em três pilares: Finanças Quantitativas & Web3 (HFT, Cash and Carry, Solidity, Custódia MPC/Monero), Engenharia de Hardware & IoT (Edge Computing, "Cloudless", Zero Trust, ESP32) e Inteligência Artificial Aplicada (Data Science para séries temporais financeiras).</p>
                </div>
              </div>

              <div className="pt-4">
                 <strong className="block text-neutral-300 mb-2">:: Arsenal Técnico & Humanidades</strong>
                 <p className="mb-4">
                   <strong>Engenharia de Software:</strong> Arquiteto de soluções distribuídas com domínio de microsserviços, orquestração de contêineres e DevOps. Expert em stack JavaScript moderna e sistemas críticos em C++ e MQL5.
                   <br/>
                   <strong>Ciência de Dados:</strong> Proficiência avançada em Python (Pandas, Scikit-learn, TensorFlow, PyTorch).
                 </p>
                 <p>
                   <strong>Humanidades:</strong> Paralelamente à carreira tecnológica, mantém linha de pesquisa em Teologia Histórica e Arqueologia Cognitiva. Fundador do Instituto Clube Santo, aplica metodologia de Crítica Textual e hermenêutica comparada. Perfil Intelectual que combina a capacidade analítica das ciências exatas com a profundidade filosófica, alinhando inovação digital com preservação da memória e liberdade individual (Cypherpunk ethos).
                 </p>
              </div>
           </div>
        </section>

        <footer className="text-center text-neutral-600 text-sm py-12 border-t border-white/5">
          <p>© 2026 Codex Hash Ltda. All rights reserved.</p>
          <p className="text-xs mt-2 font-mono text-neutral-700">UlissesFlores.com • v10.0 • State of the Art</p>
        </footer>

      </main>
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
    <div className={`border-l-2 pl-4 py-1 transition-colors group ${highlight ? 'border-emerald-500' : 'border-neutral-800 hover:border-cyan-500'} mb-6`}>
      <div className={`text-xs font-mono mb-1 ${highlight ? 'text-emerald-400' : 'text-cyan-600'}`}>{year}</div>
      <div className={`font-bold text-lg ${highlight ? 'text-white' : 'text-neutral-200 group-hover:text-white'}`}>{title}</div>
      <div className="text-sm text-neutral-400 mb-1">{inst}</div>
      <div className="text-xs text-neutral-500 italic leading-relaxed">{desc}</div>
    </div>
  )
}

function TimelineItem({ role, company, period, desc, current, isOld }: any) {
  return (
    <div className={`relative ${isOld ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
      <span className={`absolute -left-[41px] top-1.5 w-4 h-4 rounded-full border-2 border-neutral-950 ${current ? 'bg-emerald-500' : 'bg-neutral-700'}`}></span>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
        <h3 className={`text-lg font-bold ${current ? 'text-white' : 'text-neutral-300'}`}>{role}</h3>
        <span className="text-xs font-mono px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-500">{period}</span>
      </div>
      <div className={`font-medium text-sm mb-2 ${current ? 'text-emerald-400' : 'text-cyan-600'}`}>
        {company}
        {current && <span className="ml-2 text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">ATUAL</span>}
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
