'use client';

import { Check } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import type { GoalWithProgress } from '@/lib/goals-context';

export function GoalCard({ goal, onToggleToday }: { goal: GoalWithProgress; onToggleToday: () => void }) {
  const reached = goal.weekCount >= goal.target_per_week;
  return (
    <div className="rounded-2xl p-4" style={{ background: COLORS.surface, borderLeft: `3px solid ${COLORS.personal}` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: COLORS.text }}>
            {goal.activity_name}
          </p>
          <p className="mt-0.5 font-mono" style={{ color: COLORS.textMuted, fontSize: 10 }}>
            {goal.target_per_week}x por semana
          </p>
        </div>
        <button
          onClick={onToggleToday}
          className="flex cursor-pointer items-center justify-center rounded-full"
          style={{
            width: 36,
            height: 36,
            background: goal.checkedToday ? COLORS.personal : COLORS.surfaceAlt,
            border: `1px solid ${COLORS.personal}`,
          }}
        >
          <Check size={18} style={{ color: goal.checkedToday ? COLORS.bg : COLORS.personal }} />
        </button>
      </div>
      <p className="mt-3 font-mono" style={{ color: reached ? COLORS.personal : COLORS.textMuted, fontSize: 10 }}>
        {goal.weekCount}/{goal.target_per_week} esta semana
      </p>
    </div>
  );
}
