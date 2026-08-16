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

export const SUGGESTIONS: Record<Area, string> = {
  personal: 'Bloquea 45 minutos esta semana para el proyecto que dejaste a medias.',
  amigos: 'La mayoría con tu perfil arma una salida de trekking una vez al mes.',
  familia: 'Muchos registran un almuerzo familiar los domingos. Pocas cosas cuestan tan poco y duran tanto.',
  pareja: 'Las cenas en casa con algo nuevo en el menú son el plan más repetido en pareja.',
};

export const LISTED_AREAS: ListedArea[] = ['amigos', 'familia', 'pareja'];
