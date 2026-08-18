import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { AppShell } from '@/components/AppShell';
import { COLORS } from '@/lib/constants';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['300', '500', '600'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Ecosistema de vínculos',
  description: 'Mantén vivo el equilibrio entre Personal, Amigos, Familia y Pareja.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ecosistema',
  },
};

export const viewport: Viewport = {
  themeColor: COLORS.bg,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body style={{ background: '#0B1512' }}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
