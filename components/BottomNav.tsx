'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Users, Home, Heart, User, type LucideIcon } from 'lucide-react';
import { AREAS, COLORS } from '@/lib/constants';

const ITEMS: { key: string; label: string; icon: LucideIcon; href: string }[] = [
  { key: 'inicio', label: 'Inicio', icon: Compass, href: '/' },
  { key: 'amigos', label: 'Amigos', icon: Users, href: '/amigos' },
  { key: 'familia', label: 'Familia', icon: Home, href: '/familia' },
  { key: 'pareja', label: 'Pareja', icon: Heart, href: '/pareja' },
  { key: 'perfil', label: 'Perfil', icon: User, href: '/perfil' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{ background: COLORS.bg, borderTop: `1px solid ${COLORS.surfaceAlt}` }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around py-3">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href;
          const areaColor = it.key in AREAS ? AREAS[it.key as keyof typeof AREAS].color : COLORS.personal;
          const color = active ? areaColor : COLORS.textMuted;
          return (
            <Link key={it.key} href={it.href} className="flex flex-col items-center gap-1">
              <Icon size={20} style={{ color }} />
              <span className="font-mono" style={{ color, fontSize: 9 }}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
