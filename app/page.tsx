'use client';

import { usePlans } from '@/lib/plans-context';
import { RadialMap } from '@/components/RadialMap';
import { SuggestionCard } from '@/components/SuggestionCard';
import { RecentFeed } from '@/components/RecentFeed';
import { COLORS, LISTED_AREAS, pickSuggestionText } from '@/lib/constants';

export default function InicioPage() {
  const { plans, freshness, openModal, loading } = usePlans();

  const neglected = LISTED_AREAS.reduce(
    (worst, key) => (freshness[key] > freshness[worst] ? key : worst),
    LISTED_AREAS[0],
  );
  const neglectedPlanCount = plans[neglected].filter((p) => p.isMine).length;
  const suggestionText = pickSuggestionText(neglected, neglectedPlanCount, freshness[neglected]);

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
      {loading ? (
        <p className="mt-6 text-sm" style={{ color: COLORS.textMuted }}>
          Cargando...
        </p>
      ) : (
        <>
          <RadialMap freshness={freshness} />
          <SuggestionCard area={neglected} text={suggestionText} onAdd={() => openModal(neglected)} />
          <RecentFeed plans={plans} />
        </>
      )}
    </div>
  );
}
