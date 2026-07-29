import Image from 'next/image';
import Link from 'next/link';

type AuthorHubCardProps = {
  label?: string;
  name?: string;
  href?: string;
  description?: string;
  compact?: boolean;
  /** Sem `contactLabel` o card não mostra o CTA — páginas de coleção seguem só com o link de autor. */
  contactLabel?: string;
  contactHref?: string;
};

export function AuthorHubCard({
  label,
  name = 'Ulisses Flores',
  href = '/identidade',
  description,
  compact = false,
  contactLabel,
  contactHref = '/#contact',
}: AuthorHubCardProps) {
  return (
    <aside
      className={`rounded-xl border border-neutral-800 bg-neutral-900/40 ${compact ? 'p-4' : 'p-5'}`}
      aria-label='Author canonical hub'
    >
      {label && <p className='text-[11px] uppercase tracking-[0.18em] text-neutral-400 mb-3'>{label}</p>}

      {/* `items-start`: com bio longa o alinhamento central faz o retrato flutuar
          no meio do parágrafo, longe do nome a que pertence. */}
      <div className='flex items-start gap-4'>
        {/* Retrato: o bloco é lido como "uma pessoa" antes de qualquer texto ser processado.
            `alt` vazio porque o nome vem ao lado — senão o leitor de tela diz duas vezes. */}
        <Image
          src='/carlos-ulisses-flores-cto.jpg'
          alt=''
          aria-hidden='true'
          width={56}
          height={56}
          className='h-14 w-14 shrink-0 rounded-full border border-neutral-700 object-cover'
        />

        <div className='min-w-0'>
          <Link
            href={href}
            rel='author'
            className='font-semibold text-white transition-colors hover:text-emerald-300'
          >
            {name}
          </Link>
          {description && (
            <p className={`mt-0.5 text-neutral-400 ${compact ? 'text-xs' : 'text-sm'}`}>{description}</p>
          )}
        </div>
      </div>

      {contactLabel && (
        <Link
          href={contactHref}
          className='mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/50 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-900/20'
        >
          {contactLabel}
        </Link>
      )}
    </aside>
  );
}
