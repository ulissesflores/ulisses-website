import { publications } from '@/data/publications';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Calendar, BookOpen, Share2 } from 'lucide-react';

// Gera as rotas estáticas no momento do build
export async function generateStaticParams() {
  return publications.map((pub) => ({
    category: pub.category,
    slug: pub.id,
  }));
}

// ATENÇÃO: Mudança para Next.js 15 (Async/Await)
// Definimos params como uma Promise
interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  // 1. Desembrulhamos a promessa com 'await'
  const { category, slug } = await params;

  // 2. Agora usamos as variáveis limpas
  const pub = publications.find((p) => p.id === slug && p.category === category);

  if (!pub) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-emerald-500/30">
      {/* Background Sutil */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#10b98108,transparent)] pointer-events-none"></div>

      <main className="relative max-w-4xl mx-auto px-6 py-20 z-10">
        
        {/* Navegação */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Voltar para Home
        </Link>

        {/* Cabeçalho do Artigo */}
        <header className="mb-12 border-b border-white/10 pb-12">
          <div className="flex gap-4 mb-6">
             <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full">
               {pub.category}
             </span>
             <span className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase">
               <Calendar size={12}/> {pub.date}
             </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            {pub.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {pub.tags.map(tag => (
              <span key={tag} className="text-xs bg-neutral-900 text-neutral-400 px-3 py-1 rounded-full border border-neutral-800">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={pub.downloadUrl} 
              target="_blank"
              className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <Download size={20} />
              Baixar PDF Completo
            </a>
          </div>
        </header>

        {/* Corpo do Artigo (Abstract) */}
        <div className="prose prose-invert max-w-none">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-cyan-500"/> Resumo Executivo (Abstract)
          </h2>
          <div className="bg-neutral-900/30 p-8 rounded-2xl border border-white/5 text-lg leading-relaxed text-neutral-300 shadow-inner">
            {pub.summary}
          </div>
          
          <div className="mt-12 p-6 border-l-4 border-emerald-500/30 bg-emerald-900/5 rounded-r-xl">
            <p className="text-sm text-neutral-400 italic">
              <strong>Como citar este trabalho:</strong> FLORES, C. U. "{pub.title}". Codex Hash Research, {pub.date}. Disponível em: https://ulissesflores.com/{pub.category}/{pub.id}
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}