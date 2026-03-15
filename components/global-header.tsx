'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

export function GlobalHeader() {
  const { common, locale } = useDict();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Prefix an internal path with the current locale (skip for default locale and anchors). */
  const localePath = useCallback(
    (href: string) => {
      if (!href.startsWith('/') || href.startsWith('/#')) return href;
      if (locale === defaultLocale) return href;
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
      <header className='fixed top-0 left-0 right-0 z-50 bg-neutral-950/85 backdrop-blur-md border-b border-white/5'>
        <nav className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
          {/* Logo */}
          <Link href={localePath('/')} className='text-emerald-500 font-bold text-lg tracking-wider'>
            UF<span className='text-neutral-500 font-light'>.SCIENTIST</span>
          </Link>

          {/* Desktop Mega Menu */}
          <div ref={dropdownRef} className='hidden lg:flex items-center gap-1'>
            {common.nav.categories.map((category) => (
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
                        href={localePath(item.href)}
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

          {/* Right side: Lang Switcher + CTA + Hamburger */}
          <div className='flex items-center gap-3'>
            {/* Language Switcher */}
            <div ref={langRef} className='relative hidden sm:block'>
              <button
                type='button'
                onClick={() => setLangOpen(!langOpen)}
                className='flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-white rounded-md border border-neutral-800 hover:border-neutral-600 transition-colors'
                aria-label={common.languageSwitcher.label}
              >
                <Globe size={14} />
                {localeLabels[locale]}
                <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className='absolute top-full end-0 mt-1 w-40 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-lg shadow-2xl shadow-black/40 py-1 z-50'>
                  {supportedLocales.map((loc) => (
                    <button
                      key={loc}
                      type='button'
                      onClick={() => switchLocale(loc)}
                      className={`block w-full text-start px-4 py-2 text-sm transition-colors ${
                        loc === locale
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-neutral-300 hover:bg-emerald-500/10 hover:text-emerald-300'
                      }`}
                    >
                      {localeLabels[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href='/#contact'
              className='px-4 py-2 bg-neutral-100 text-neutral-900 text-xs font-bold rounded-full hover:bg-emerald-400 transition-colors'
            >
              {common.cta}
            </Link>

            {/* Mobile hamburger */}
            <button
              type='button'
              onClick={() => setMobileOpen(!mobileOpen)}
              className='lg:hidden p-2 text-neutral-400 hover:text-white transition-colors'
              aria-label={mobileOpen ? common.mobileMenu.close : common.mobileMenu.open}
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
            {common.nav.categories.map((category) => (
              <div key={category.label}>
                <p className='text-xs uppercase tracking-[0.2em] text-emerald-400 mb-3 font-bold'>
                  {category.label}
                </p>
                <div className='space-y-1'>
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={localePath(item.href)}
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

            {/* Mobile Language Switcher */}
            <div className='pt-2 border-t border-neutral-800'>
              <p className='text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3 font-bold flex items-center gap-2'>
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
                        ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                        : 'border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    {localeLabels[loc]}
                  </button>
                ))}
              </div>
            </div>

            <div className='pt-4 border-t border-neutral-800'>
              <Link
                href='/#contact'
                onClick={() => setMobileOpen(false)}
                className='block w-full text-center px-4 py-3 bg-emerald-600 text-white text-sm font-bold rounded-full hover:bg-emerald-500 transition-colors'
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
