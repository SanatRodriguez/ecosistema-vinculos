'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import { COLORS } from '@/lib/constants';

export function ProfileButton() {
  const pathname = usePathname();
  const active = pathname === '/perfil';

  return (
    <Link
      href="/perfil"
      className="fixed z-30 flex items-center justify-center"
      style={{
        top: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        background: active ? COLORS.personal : COLORS.surface,
        border: `1px solid ${COLORS.surfaceAlt}`,
      }}
    >
      <User size={18} style={{ color: active ? COLORS.bg : COLORS.textMuted }} />
    </Link>
  );
}
