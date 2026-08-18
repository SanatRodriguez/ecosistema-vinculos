'use client';

import { AREAS, COLORS, pickSuggestionText } from '@/lib/constants';
import { usePlans, daysAgo } from '@/lib/plans-context';
import { SuggestionCard } from './SuggestionCard';
import type { ListedArea } from '@/lib/types';

export function AreaScreen({ area }: { area: ListedArea }) {
  const { plans, openModal, loading } = usePlans();
  const a = AREAS[area];
  const Icon = a.icon;
  const list = plans[area];
  const mine = list.filter((p) => p.isMine);
  const daysSinceLast = mine.length ? Math.min(...mine.map((p) => daysAgo(p.plan_date))) : 30;
  const suggestionText = pickSuggestionText(area, mine.length, daysSinceLast);

  return (
    <div>
      <div className="px-6 pt-8 pb-5" style={{ background: `linear-gradient(180deg, ${a.color}22, transparent)` }}>
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: a.color }} />
          <span className="font-mono uppercase tracking-widest" style={{ color: a.color, fontSize: 10 }}>
            Ecosistema
          </span>
        </div>
        <h1 className="font-display text-3xl mt-1" style={{ color: COLORS.text }}>
          {a.label}
        </h1>
      </div>
      <div className="px-6">
        <SuggestionCard area={area} text={suggestionText} onAdd={() => openModal(area)} />
        <p className="font-mono uppercase tracking-widest mt-6" style={{ color: COLORS.textMuted, fontSize: 10 }}>
          {loading ? 'Cargando...' : `${list.length} plan${list.length !== 1 ? 'es' : ''} registrado${list.length !== 1 ? 's' : ''}`}
        </p>
        <div className="mt-3 space-y-2 pb-6">
          {!loading && list.length === 0 && (
            <div className="rounded-xl p-5 text-center" style={{ background: COLORS.surface }}>
              <p className="text-sm" style={{ color: COLORS.textMuted }}>
                Aún no registras planes en {a.label.toLowerCase()}. Cada momento cuenta.
              </p>
              <button
                onClick={() => openModal(area)}
                className="mt-3 cursor-pointer text-sm font-medium"
                style={{ color: a.color }}
              >
                Registrar el primero
              </button>
            </div>
          )}
          {list.map((p) => {
            const d = daysAgo(p.plan_date);
            return (
              <div key={p.id} className="rounded-xl p-3" style={{ background: COLORS.surface, borderLeft: `3px solid ${a.color}` }}>
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium" style={{ color: COLORS.text }}>
                    {p.title}
                    {!p.isMine && (
                      <span className="ml-1 font-normal" style={{ color: COLORS.textMuted }}>
                        — {p.profiles?.display_name || p.profiles?.email || 'un amigo'}
                      </span>
                    )}
                  </p>
                  <span className="font-mono" style={{ color: COLORS.textMuted, fontSize: 10 }}>
                    {d === 0 ? 'hoy' : `${d}d`}
                  </span>
                </div>
                {p.note && (
                  <p className="mt-1 text-xs" style={{ color: COLORS.textMuted }}>
                    {p.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
