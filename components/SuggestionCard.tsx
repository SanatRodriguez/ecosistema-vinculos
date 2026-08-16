import { Sparkles, ArrowRight } from 'lucide-react';
import { AREAS, COLORS, SUGGESTIONS } from '@/lib/constants';
import type { Area } from '@/lib/types';

export function SuggestionCard({ area, onAdd }: { area: Area; onAdd: () => void }) {
  const a = AREAS[area];
  return (
    <div className="mt-6 rounded-2xl p-4" style={{ background: COLORS.surface, border: `1px solid ${a.color}33` }}>
      <div className="flex items-center gap-2">
        <Sparkles size={14} style={{ color: a.color }} />
        <span className="font-mono uppercase tracking-widest" style={{ color: a.color, fontSize: 10 }}>
          Sugerido para ti
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: COLORS.text }}>
        {SUGGESTIONS[area]}
      </p>
      <button onClick={onAdd} className="mt-3 flex cursor-pointer items-center gap-1 text-sm font-medium">
        <span style={{ color: a.color }}>Registrar este plan</span>
        <ArrowRight size={14} style={{ color: a.color }} />
      </button>
    </div>
  );
}
