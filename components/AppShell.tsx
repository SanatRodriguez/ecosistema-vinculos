'use client';

import { useAuth } from '@/lib/auth-context';
import { AuthScreen } from './AuthScreen';
import { PlansProvider } from '@/lib/plans-context';
import { BottomNav } from './BottomNav';
import { AddModal } from './AddModal';
import { ProfileButton } from './ProfileButton';
import { RegisterServiceWorker } from './RegisterServiceWorker';
import { COLORS } from '@/lib/constants';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: COLORS.bg }}>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          Cargando...
        </p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <PlansProvider>
      <div className="mx-auto min-h-screen max-w-md" style={{ background: COLORS.bg }}>
        <main className="pb-28">{children}</main>
      </div>
      <ProfileButton />
      <BottomNav />
      <AddModal />
      <RegisterServiceWorker />
    </PlansProvider>
  );
}
