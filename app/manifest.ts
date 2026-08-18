import type { MetadataRoute } from 'next';
import { COLORS } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ecosistema de vínculos',
    short_name: 'Ecosistema',
    description: 'Mantén vivo el equilibrio entre Personal, Amigos, Familia y Pareja.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: COLORS.bg,
    theme_color: COLORS.bg,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
