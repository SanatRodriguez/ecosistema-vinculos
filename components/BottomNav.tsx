'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Users, Home, Heart, Plus, type LucideIcon } from 'lucide-react';
import { AREAS, COLORS } from '@/lib/constants';
import { usePlans } from '@/lib/plans-context';

const LEFT_ITEMS: { key: string; label: string; icon: LucideIcon; href: string }[] = [
  { key: 'inicio', label: 'Inicio', icon: Compass, href: '/' },
  { key: 'amigos', label: 'Amigos', icon: Users, href: '/amigos' },
];

const RIGHT_ITEMS: { key: string; label: string; icon: LucideIcon; href: string }[] = [
  { key: 'familia', label: 'Familia', icon: Home, href: '/familia' },
  { key: 'pareja', label: 'Pareja', icon: Heart, href: '/pareja' },
];

const AREA_BY_PATH: Record<string, 'amigos' | 'familia'> = {
  '/amigos': 'amigos',
  '/familia': 'familia',
};

export function BottomNav() {
  const pathname = usePathname();
  const { openModal } = usePlans();
  const addCategory = AREA_BY_PATH[pathname];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{ background: COLORS.bg, borderTop: `1px solid ${COLORS.surfaceAlt}` }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around py-3">
        {LEFT_ITEMS.map((it) => (
          <NavLink key={it.key} item={it} active={pathname === it.href} />
        ))}
        {addCategory ? (
          <button
            onClick={() => openModal(addCategory)}
            className="flex cursor-pointer items-center justify-center"
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              background: AREAS[addCategory].color,
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            }}
          >
            <Plus size={22} style={{ color: COLORS.bg }} />
          </button>
        ) : (
          <div style={{ width: 46, height: 46 }} />
        )}
        {RIGHT_ITEMS.map((it) => (
          <NavLink key={it.key} item={it} active={pathname === it.href} />
        ))}
      </div>
    </div>
  );
}

function NavLink({
  item,
  active,
}: {
  item: { key: string; label: string; icon: LucideIcon; href: string };
  active: boolean;
}) {
  const Icon = item.icon;
  const areaColor = item.key in AREAS ? AREAS[item.key as keyof typeof AREAS].color : COLORS.personal;
  const color = active ? areaColor : COLORS.textMuted;
  return (
    <Link href={item.href} className="flex flex-col items-center gap-1">
      <Icon size={20} style={{ color }} />
      <span className="font-mono" style={{ color, fontSize: 9 }}>
        {item.label}
      </span>
    </Link>
  );
}
