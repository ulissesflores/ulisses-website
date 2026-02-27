import Link from 'next/link';

export function GlobalFooter() {
  return (
    <footer className='border-t border-white/10 bg-neutral-950/90'>
      <div className='max-w-6xl mx-auto px-6 py-5 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-3'>
        <p>Ulisses Flores · Ground Truth Knowledge Hub</p>
        <Link href='/identidade' className='text-emerald-300 hover:text-emerald-200 transition-colors'>
          Sovereign Identity Graph
        </Link>
      </div>
    </footer>
  );
}
