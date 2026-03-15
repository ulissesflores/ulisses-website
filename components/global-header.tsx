'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavCategory {
  label: string;
  items: { label: string; href: string; description?: string }[];
}

const navCategories: NavCategory[] = [
  {
    label: 'Sobre',
    items: [
      { label: 'Bio', href: '/#about', description: 'Quem sou e minha trajetória' },
      { label: 'Expertise', href: '/#pillars', description: 'Pilares de atuação' },
      { label: 'Trajetória', href: '/#trajectory', description: 'Linha do tempo profissional' },
    ],
  },
  {
    label: 'Publicações',
    items: [
      { label: 'Research', href: '/research', description: 'IA, Economia e Sistemas Complexos' },
      { label: 'Whitepapers', href: '/whitepapers', description: 'Engenharia, IoT e Segurança' },
      { label: 'Projeto Ψ (PSI)', href: '/whitepapers/projeto-psi', description: 'Whitepaper técnico: Hardware Soberano' },
      { label: 'PSI — Demonstração', href: '/projeto-psi', description: 'Landing comercial: investimento e licenciamento' },
      { label: 'Essays', href: '/essays', description: 'Teologia, Humanidades e História' },
    ],
  },
  {
    label: 'Acervo',
    items: [
      { label: 'Acervo Teológico', href: '/acervo-teologico', description: 'Sermões por cluster temático' },
      { label: 'Mundo Político', href: '/mundo-politico', description: 'Artigos e análises políticas' },
    ],
  },
  {
    label: 'Ferramentas',
    items: [
      { label: 'Simulações', href: '/simulacoes', description: 'Laboratório de cenários prospectivos' },
      { label: 'Identidade', href: '/identidade', description: 'Hub canônico de identidade soberana' },
      { label: 'Certificações', href: '/certifications', description: 'Credenciais e verificações' },
    ],
  },
];

export function GlobalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  }, []);

  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-50 bg-neutral-950/85 backdrop-blur-md border-b border-white/5'>
        <nav className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='text-emerald-500 font-bold text-lg tracking-wider'>
            UF<span className='text-neutral-500 font-light'>.SCIENTIST</span>
          </Link>

          {/* Desktop Mega Menu */}
          <div ref={dropdownRef} className='hidden lg:flex items-center gap-1'>
            {navCategories.map((category) => (
              <div
                key={category.label}
                className='relative'
                onMouseEnter={() => handleMouseEnter(category.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type='button'
                  onClick={() => setActiveDropdown(activeDropdown === category.label ? null : category.label)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeDropdown === category.label
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {category.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeDropdown === category.label ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Panel */}
                {activeDropdown === category.label && (
                  <div
                    className='absolute top-full left-0 mt-1 w-72 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-lg shadow-2xl shadow-black/40 py-2'
                    onMouseEnter={() => handleMouseEnter(category.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className='block px-4 py-3 hover:bg-emerald-500/10 transition-colors group'
                      >
                        <span className='text-sm font-medium text-neutral-200 group-hover:text-emerald-300 transition-colors'>
                          {item.label}
                        </span>
                        {item.description && (
                          <span className='block text-xs text-neutral-500 mt-0.5'>{item.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side: CTA + Hamburger */}
          <div className='flex items-center gap-3'>
            <Link
              href='/#contact'
              className='px-4 py-2 bg-neutral-100 text-neutral-900 text-xs font-bold rounded-full hover:bg-emerald-400 transition-colors'
            >
              FALE COMIGO
            </Link>

            {/* Mobile hamburger */}
            <button
              type='button'
              onClick={() => setMobileOpen(!mobileOpen)}
              className='lg:hidden p-2 text-neutral-400 hover:text-white transition-colors'
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className='fixed inset-0 z-40 bg-neutral-950/98 backdrop-blur-lg pt-20 overflow-y-auto lg:hidden'>
          <nav className='max-w-md mx-auto px-6 py-8 space-y-6'>
            {navCategories.map((category) => (
              <div key={category.label}>
                <p className='text-xs uppercase tracking-[0.2em] text-emerald-400 mb-3 font-bold'>
                  {category.label}
                </p>
                <div className='space-y-1'>
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className='block px-4 py-3 rounded-lg text-neutral-200 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors'
                    >
                      <span className='text-sm font-medium'>{item.label}</span>
                      {item.description && (
                        <span className='block text-xs text-neutral-500 mt-0.5'>{item.description}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className='pt-4 border-t border-neutral-800'>
              <Link
                href='/#contact'
                onClick={() => setMobileOpen(false)}
                className='block w-full text-center px-4 py-3 bg-emerald-600 text-white text-sm font-bold rounded-full hover:bg-emerald-500 transition-colors'
              >
                FALE COMIGO
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
