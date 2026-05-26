import type { MetadataRoute } from 'next';

// PWA manifest (file convention). Icons reference the generated /icon route.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ulisses Flores',
    short_name: 'Ulisses Flores',
    description:
      'Ulisses Flores — Codex Hash Research Laboratory. AI, complex systems, and research.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/icon', sizes: '192x192', type: 'image/png' },
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
