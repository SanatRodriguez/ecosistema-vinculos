'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePlans } from '@/lib/plans-context';
import { usePareja } from '@/lib/pareja-context';
import { RadialMap } from '@/components/RadialMap';
import { SuggestionCard } from '@/components/SuggestionCard';
import { RecentFeed } from '@/components/RecentFeed';
import { COLORS, LISTED_AREAS, pickSuggestionText } from '@/lib/constants';

function daysAgoFromTimestamp(iso: string) {
  const d = new Date(iso);
  const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.round((todayMidnight.getTime() - dateOnly.getTime()) / 86400000));
}

export default function InicioPage() {
  const { plans, freshness, openModal, loading } = usePlans();
  const { spots, loading: parejaLoading } = usePareja();
  const router = useRouter();

  const parejaCompleted = useMemo(() => spots.filter((s) => s.completed_at), [spots]);
  const parejaFreshness = useMemo(() => {
    if (parejaCompleted.length === 0) return 30;
    const mostRecent = parejaCompleted.reduce(
      (latest, s) => (s.completed_at! > latest ? s.completed_at! : latest),
      parejaCompleted[0].completed_at!,
    );
    return daysAgoFromTimestamp(mostRecent);
  }, [parejaCompleted]);

  const combinedFreshness = { ...freshness, pareja: parejaFreshness };

  const neglected = LISTED_AREAS.reduce(
    (worst, key) => (combinedFreshness[key] > combinedFreshness[worst] ? key : worst),
    LISTED_AREAS[0],
  );
  const neglectedPlanCount = neglected === 'pareja' ? parejaCompleted.length : plans[neglected].filter((p) => p.isMine).length;
  const suggestionText = pickSuggestionText(neglected, neglectedPlanCount, combinedFreshness[neglected]);

  const today = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  return (
    <div className="px-6 pt-8">
      <p className="font-mono uppercase tracking-widest" style={{ color: COLORS.textMuted, fontSize: 10 }}>
        {today}
      </p>
      <h1 className="font-display text-3xl mt-1" style={{ color: COLORS.text }}>
        Tu ecosistema
      </h1>
      {loading || parejaLoading ? (
        <p className="mt-6 text-sm" style={{ color: COLORS.textMuted }}>
          Cargando...
        </p>
      ) : (
        <>
          <RadialMap freshness={combinedFreshness} />
          <SuggestionCard
            area={neglected}
            text={suggestionText}
            onAdd={() => (neglected === 'pareja' ? router.push('/pareja') : openModal(neglected))}
          />
          <RecentFeed plans={plans} />
        </>
      )}
    </div>
  );
}
