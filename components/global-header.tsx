import Link from 'next/link';

export function GlobalHeader() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-neutral-950/85 backdrop-blur-md border-b border-white/5'>
      <nav className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
        <Link href='/' className='text-emerald-500 font-bold text-lg tracking-wider'>
          UF<span className='text-neutral-500 font-light'>.SCIENTIST</span>
        </Link>

        <div className='hidden md:flex gap-8 text-sm font-medium text-neutral-400'>
          <Link href='/#about' className='hover:text-white transition-colors'>
            Bio
          </Link>
          <Link href='/#pillars' className='hover:text-white transition-colors'>
            Expertise
          </Link>
          <Link href='/#trajectory' className='hover:text-white transition-colors'>
            Trajetoria
          </Link>
          <Link href='/#research' className='hover:text-white transition-colors'>
            Publicacoes
          </Link>
          <Link href='/certifications' className='hover:text-white transition-colors'>
            Certificacoes
          </Link>
          <Link href='/acervo-teologico' className='hover:text-white transition-colors'>
            Acervo Teologico
          </Link>
          <Link href='/mundo-politico' className='hover:text-white transition-colors'>
            Mundo Politico
          </Link>
        </div>

        <Link
          href='/#contact'
          className='px-4 py-2 bg-neutral-100 text-neutral-900 text-xs font-bold rounded-full hover:bg-emerald-400 transition-colors'
        >
          FALE COMIGO
        </Link>
      </nav>
    </header>
  );
}
