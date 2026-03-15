import Link from 'next/link';
import { Home, Search, BookOpen, Shield, FlaskConical } from 'lucide-react';

export default function NotFound() {
  const quickLinks = [
    { label: 'Home', href: '/', icon: Home, description: 'Pagina principal' },
    { label: 'Publicacoes', href: '/research', icon: BookOpen, description: 'Research, Whitepapers e Essays' },
    { label: 'Identidade', href: '/identidade', icon: Shield, description: 'Hub canonico de identidade' },
    { label: 'Simulacoes', href: '/simulacoes', icon: FlaskConical, description: 'Laboratorio de cenarios' },
  ];

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#10b98108,transparent)] pointer-events-none' />

      <main className='relative max-w-2xl mx-auto px-6 py-20 text-center z-10'>
        <p className='text-7xl font-bold text-emerald-500 mb-4'>404</p>
        <h1 className='text-3xl font-bold text-white mb-3'>Pagina nao encontrada</h1>
        <p className='text-neutral-400 mb-10 max-w-md mx-auto'>
          A pagina que voce procura pode ter sido movida, renomeada ou nao existe mais.
          Explore as secoes principais abaixo.
        </p>

        <div className='grid gap-3 sm:grid-cols-2 mb-10'>
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className='flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 px-5 py-4 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors text-left'
              >
                <Icon size={20} className='text-emerald-500 shrink-0' />
                <div>
                  <p className='text-sm font-medium text-neutral-200'>{link.label}</p>
                  <p className='text-xs text-neutral-500'>{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className='flex items-center gap-2 justify-center text-sm text-neutral-500'>
          <Search size={14} />
          <span>Ou use a navegacao no topo para encontrar o que procura.</span>
        </div>
      </main>
    </div>
  );
}
