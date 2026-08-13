import type { MetadataRoute } from 'next';

// PWA manifest (file convention). Ícones = símbolo do arqueiro sobre marinho,
// servidos pelos arquivos estáticos app/icon.png e app/apple-icon.png.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ulisses Flores',
    short_name: 'Ulisses Flores',
    description:
      'Ulisses Flores — Codex Hash Research Laboratory. AI, complex systems, and research.',
    start_url: '/',
    display: 'standalone',
    background_color: '#101D2A',
    theme_color: '#101D2A',
    icons: [
      { src: '/icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
