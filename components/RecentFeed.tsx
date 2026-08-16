import { AREAS, COLORS, LISTED_AREAS } from '@/lib/constants';
import { daysAgo } from '@/lib/plans-context';
import type { Area, ListedArea, Plan } from '@/lib/types';

export function RecentFeed({ plans }: { plans: Record<Area, Plan[]> }) {
  const all = LISTED_AREAS.flatMap((k) => plans[k].map((p) => ({ ...p, area: k as ListedArea })));
  all.sort((a, b) => daysAgo(a.created_at) - daysAgo(b.created_at));

  return (
    <div className="mt-6 pb-4">
      <p className="font-mono uppercase tracking-widest" style={{ color: COLORS.textMuted, fontSize: 10 }}>
        Últimos recuerdos
      </p>
      <div className="mt-3 space-y-2">
        {all.length === 0 && (
          <p className="mt-3 text-sm" style={{ color: COLORS.textMuted }}>
            Aún no hay recuerdos registrados.
          </p>
        )}
        {all.slice(0, 4).map((p) => {
          const d = daysAgo(p.created_at);
          return (
            <div
              key={p.id}
              className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: COLORS.surface, borderLeft: `3px solid ${AREAS[p.area].color}` }}
            >
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: COLORS.text }}>
                  {p.title}
                </p>
                {p.note && (
                  <p className="mt-0.5 text-xs" style={{ color: COLORS.textMuted }}>
                    {p.note}
                  </p>
                )}
              </div>
              <span className="font-mono" style={{ color: COLORS.textMuted, fontSize: 10 }}>
                {d === 0 ? 'hoy' : `${d}d`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
