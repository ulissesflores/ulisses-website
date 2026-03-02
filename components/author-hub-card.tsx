import Link from 'next/link';

type AuthorHubCardProps = {
  label?: string;
  name?: string;
  href?: string;
  description?: string;
  compact?: boolean;
};

export function AuthorHubCard({
  label = 'Autor',
  name = 'Ulisses Flores',
  href = '/identidade',
  description = 'Fonte canônica de autoria e identidade semântica deste conteúdo.',
  compact = false,
}: AuthorHubCardProps) {
  return (
    <aside
      className={`rounded-xl border border-neutral-800 bg-neutral-900/40 ${
        compact ? 'p-4' : 'p-5'
      }`}
      aria-label='Author canonical hub'
    >
      <p className='text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-2'>{label}</p>
      <p className={`text-neutral-400 ${compact ? 'text-xs mb-3' : 'text-sm mb-4'}`}>{description}</p>
      <Link
        href={href}
        rel='author'
        className='inline-flex items-center gap-2 rounded-full border border-emerald-500/50 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/20 transition-colors'
      >
        {name}
      </Link>
    </aside>
  );
}
