import { Users, Home, Heart, User, type LucideIcon } from 'lucide-react';
import type { Area, ListedArea } from './types';

export const COLORS = {
  bg: '#10201B',
  surface: '#17281F',
  surfaceAlt: '#1C2E24',
  text: '#F3EFE6',
  textMuted: '#9CAA9F',
  personal: '#E3B23C',
  amigos: '#4FA9A8',
  familia: '#D9714B',
  pareja: '#C15C7A',
} as const;

export const AREAS: Record<Area, { label: string; color: string; icon: LucideIcon; path: string }> = {
  personal: { label: 'Personal', color: COLORS.personal, icon: User, path: '/' },
  amigos: { label: 'Amigos', color: COLORS.amigos, icon: Users, path: '/amigos' },
  familia: { label: 'Familia', color: COLORS.familia, icon: Home, path: '/familia' },
  pareja: { label: 'Pareja', color: COLORS.pareja, icon: Heart, path: '/pareja' },
};

const SUGGESTIONS: Record<Area, { first: string; neglected: string; steady: string }> = {
  personal: {
    first: 'Aún no registras nada en Personal. Empieza con algo chico: 20 minutos del proyecto que dejaste a medias.',
    neglected: 'Bloquea 45 minutos esta semana para el proyecto que dejaste a medias.',
    steady: 'Vas bien en Personal. Sigue anotando tus avances, por pequeños que sean.',
  },
  amigos: {
    first: 'Aún no registras planes con amigos. La mayoría con tu perfil arma una salida de trekking una vez al mes.',
    neglected: 'Ya pasó un tiempo sin ver a tus amigos. La mayoría con tu perfil arma una salida una vez al mes.',
    steady: 'Vas bien con tus amigos. Un café rápido también cuenta.',
  },
  familia: {
    first: 'Aún no registras planes en Familia. Muchos empiezan con un almuerzo dominical.',
    neglected: 'Muchos registran un almuerzo familiar los domingos. Pocas cosas cuestan tan poco y duran tanto.',
    steady: 'Vas bien con Familia. Una llamada corta también suma.',
  },
  pareja: {
    first: 'Aún no registras planes en Pareja. Una cena en casa con algo nuevo en el menú es un buen inicio.',
    neglected: 'Las cenas en casa con algo nuevo en el menú son el plan más repetido en pareja.',
    steady: 'Vas bien en Pareja. Un detalle pequeño sin ocasión especial siempre suma.',
  },
};

export function pickSuggestionText(area: Area, planCount: number, daysSinceLast: number): string {
  if (planCount === 0) return SUGGESTIONS[area].first;
  if (daysSinceLast > 7) return SUGGESTIONS[area].neglected;
  return SUGGESTIONS[area].steady;
}

export const LISTED_AREAS: ListedArea[] = ['amigos', 'familia', 'pareja'];
