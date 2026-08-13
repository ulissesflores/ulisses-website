'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useDict } from '@/lib/i18n-context';
import {
  supportedLocales,
  defaultLocale,
  localeLabels,
  type Locale,
} from '@/data/i18n';

/* `brandName` chega por prop do layout: o nome mora no UPKF, e componente
   'use client' não importa artefato gerado (bundle safety, anti-dry.test.ts). */
export function GlobalHeader({ brandName }: { brandName: string }) {
  const { common, locale } = useDict();
  /* Versal + tracking largo é tratamento só-latino: o hebraico não versaliza nem
     traqueia (mesmo condicional da rota-piloto em app/[locale]/c/page.tsx). */
  const latinLabel =
    locale === 'he' ? 'text-sm' : 'text-[0.72rem] uppercase tracking-[0.18em]';
  /* A barra desktop é a única linha do site que disputa espaço horizontal com
     5 grupos + idioma + CTA: tracking menor que o do drawer, senão os rótulos
     longos (IT/ES) transbordam do container e invadem o nome. */
  const navLabel =
    locale === 'he' ? 'text-sm' : 'text-[0.72rem] uppercase tracking-[0.1em]';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Prefix an internal path with the current locale (skip for default locale and anchors). */
  const localePath = useCallback(
    (href: string) => {
      if (!href.startsWith('/')) return href;
      if (locale === defaultLocale) return href;
      if (href.startsWith('/#')) return `/${locale}${href}`;
      return `/${locale}${href}`;
    },
    [locale],
  );

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setLangOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape closes whatever menu is open; Tab cycles inside the mobile drawer.
  useEffect(() => {
    if (!mobileOpen && !langOpen && !activeDropdown) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (mobileOpen) {
          setMobileOpen(false);
          hamburgerRef.current?.focus();
        } else if (langOpen) {
          setLangOpen(false);
          langButtonRef.current?.focus();
        } else {
          // The trigger of the open dropdown is the only one with aria-expanded="true".
          dropdownRef.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus();
          setActiveDropdown(null);
        }
        return;
      }

      if (event.key !== 'Tab' || !mobileOpen || !drawerRef.current) return;

      // The close button is the hamburger itself, which lives in the header —
      // outside the drawer — so it has to be part of the cycle.
      const focusable = [
        hamburgerRef.current,
        ...drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((element): element is HTMLElement => element !== null);
      if (focusable.length === 0) return;

      const index = focusable.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey) {
        if (index <= 0) {
          event.preventDefault();
          focusable[focusable.length - 1].focus();
        }
      } else if (index === -1 || index === focusable.length - 1) {
        event.preventDefault();
        focusable[0].focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, langOpen, activeDropdown]);

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

  // ─── Language Switcher ──────────────────────────────────────────────
  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) {
      setLangOpen(false);
      return;
    }

    // Strip current locale prefix from pathname to get bare path
    let barePath = pathname;

    // Remove current locale prefix if present
    for (const loc of supportedLocales) {
      if (barePath.startsWith(`/${loc}/`)) {
        barePath = barePath.slice(`/${loc}`.length);
        break;
      }
      if (barePath === `/${loc}`) {
        barePath = '/';
        break;
      }
    }

    // Build new path
    const newPath = newLocale === defaultLocale
      ? barePath || '/'
      : `/${newLocale}${barePath === '/' ? '' : barePath}`;

    setLangOpen(false);
    router.push(newPath);
  }

  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-50 bg-brand-navy-deep/85 backdrop-blur-md border-b border-brand-gold/20'>
        <nav className='max-w-[76rem] mx-auto px-6 h-18 flex items-center justify-between gap-4'>
          {/* Marca: símbolo do arqueiro + nome. O símbolo é decorativo — o nome
              acessível do link vem do texto ao lado. */}
          <Link href={localePath('/')} className='flex shrink-0 items-center gap-3 text-brand-offwhite'>
            <Image src='/brand/symbol-gold.png' alt='' width={184} height={168} priority className='h-10 w-auto' />
            <span className='font-display text-[0.95rem] font-semibold uppercase tracking-[0.12em] whitespace-nowrap'>
              {brandName}
            </span>
          </Link>

          {/* Desktop Mega Menu */}
          <div ref={dropdownRef} className='hidden xl:flex min-w-0 flex-1 items-center justify-center gap-1'>
            {common.nav.categories.map((category) => (
              <div
                key={category.label}
                className='relative'
                onMouseEnter={() => handleMouseEnter(category.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type='button'
                  aria-expanded={activeDropdown === category.label}
                  aria-haspopup='true'
                  onClick={() => setActiveDropdown(activeDropdown === category.label ? null : category.label)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 rounded-md transition-colors ${navLabel} ${
                    activeDropdown === category.label
                      ? 'text-brand-gold-light'
                      : 'text-brand-offwhite/75 hover:text-brand-gold-light'
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
                    className='absolute top-full left-0 mt-1 w-72 rounded-xl border border-brand-gold/30 bg-brand-navy-deep backdrop-blur-lg shadow-2xl shadow-black/50 py-2'
                    onMouseEnter={() => handleMouseEnter(category.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        href={localePath(item.href)}
                        onClick={() => setActiveDropdown(null)}
                        className='block px-4 py-3 hover:bg-brand-gold/12 transition-colors group'
                      >
                        <span className='text-sm font-medium text-brand-offwhite group-hover:text-brand-gold-light transition-colors'>
                          {item.label}
                        </span>
                        {item.description && (
                          <span className='block text-xs text-brand-offwhite/65 mt-0.5'>{item.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side: Lang Switcher + CTA + Hamburger */}
          <div className='flex shrink-0 items-center gap-3'>
            {/* Language Switcher */}
            <div ref={langRef} className='relative hidden sm:block'>
              <button
                ref={langButtonRef}
                type='button'
                aria-expanded={langOpen}
                aria-haspopup='true'
                onClick={() => setLangOpen(!langOpen)}
                className='flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-brand-offwhite/75 hover:text-brand-gold-light rounded-md border border-brand-gold/25 hover:border-brand-gold/60 transition-colors'
                aria-label={common.languageSwitcher.label}
              >
                <Globe size={14} />
                {localeLabels[locale]}
                <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className='absolute top-full end-0 mt-1 w-40 rounded-xl border border-brand-gold/30 bg-brand-navy-deep backdrop-blur-lg shadow-2xl shadow-black/50 py-1 z-50'>
                  {supportedLocales.map((loc) => (
                    <button
                      key={loc}
                      type='button'
                      onClick={() => switchLocale(loc)}
                      className={`block w-full text-start px-4 py-2 text-sm transition-colors ${
                        loc === locale
                          ? 'text-brand-gold-light bg-brand-gold/12'
                          : 'text-brand-offwhite/85 hover:bg-brand-gold/12 hover:text-brand-gold-light'
                      }`}
                    >
                      {localeLabels[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Abaixo de lg o CTA vive dentro do drawer (mockup aprovado): mantê-lo
                aqui empurrava o hambúrguer para fora dos 390px do iPhone. */}
            <Link
              href={localePath('/#contact')}
              className={`hidden xl:inline-block px-4 py-2.5 bg-brand-gold text-brand-navy font-medium rounded-full whitespace-nowrap hover:bg-brand-gold-light transition-colors ${navLabel}`}
            >
              {common.cta}
            </Link>

            {/* Mobile hamburger */}
            <button
              ref={hamburgerRef}
              type='button'
              aria-expanded={mobileOpen}
              aria-controls='mobile-menu'
              onClick={() => setMobileOpen(!mobileOpen)}
              className='xl:hidden p-2 text-brand-gold-light hover:text-brand-offwhite transition-colors'
              aria-label={mobileOpen ? common.mobileMenu.close : common.mobileMenu.open}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          ref={drawerRef}
          id='mobile-menu'
          role='dialog'
          aria-modal='true'
          aria-label={common.mobileMenu.label}
          className='fixed inset-0 z-40 bg-brand-navy-deep backdrop-blur-lg pt-22 overflow-y-auto xl:hidden'
        >
          <nav className='max-w-md mx-auto px-6 py-8 space-y-6'>
            {common.nav.categories.map((category) => (
              <div key={category.label}>
                <p className={`text-brand-gold mb-3 font-medium ${latinLabel}`}>
                  {category.label}
                </p>
                <div className='space-y-1'>
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={localePath(item.href)}
                      onClick={() => setMobileOpen(false)}
                      className='block px-4 py-3 rounded-lg text-brand-offwhite hover:bg-brand-gold/12 hover:text-brand-gold-light transition-colors'
                    >
                      <span className='text-sm font-medium'>{item.label}</span>
                      {item.description && (
                        <span className='block text-xs text-brand-offwhite/65 mt-0.5'>{item.description}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile Language Switcher */}
            <div className='pt-2 border-t border-brand-gold/20'>
              <p className={`text-brand-offwhite/70 mb-3 font-medium flex items-center gap-2 ${latinLabel}`}>
                <Globe size={12} /> {common.languageSwitcher.label}
              </p>
              <div className='flex flex-wrap gap-2'>
                {supportedLocales.map((loc) => (
                  <button
                    key={loc}
                    type='button'
                    onClick={() => { switchLocale(loc); setMobileOpen(false); }}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      loc === locale
                        ? 'border-brand-gold/60 text-brand-gold-light bg-brand-gold/12'
                        : 'border-brand-gold/25 text-brand-offwhite/75 hover:text-brand-gold-light hover:border-brand-gold/60'
                    }`}
                  >
                    {localeLabels[loc]}
                  </button>
                ))}
              </div>
            </div>

            <div className='pt-4 border-t border-brand-gold/20'>
              <Link
                href={localePath('/#contact')}
                onClick={() => setMobileOpen(false)}
                className={`block w-full text-center px-4 py-3 bg-brand-gold text-brand-navy font-medium rounded-full hover:bg-brand-gold-light transition-colors ${latinLabel}`}
              >
                {common.cta}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
