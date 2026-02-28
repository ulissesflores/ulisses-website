import Link from 'next/link';

export default function AuthorHubCard() {
  return (
    <footer className='mt-20 pt-8 pb-4 border-t border-neutral-900/50'>
      <div className='max-w-prose mx-auto text-center md:text-left'>
        <p className='text-[13px] text-neutral-500 font-light'>
          Escrito por{' '}
          <Link
            href='/identidade'
            rel='author'
            className='text-neutral-400 hover:text-emerald-400 transition-colors border-b border-transparent hover:border-emerald-400/30 pb-0.5'
          >
            Carlos Ulisses Flores
          </Link>{' '}
          · CTO e Pesquisador Polímata.
        </p>
      </div>
    </footer>
  );
}
