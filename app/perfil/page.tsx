'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import { AREAS, COLORS } from '@/lib/constants';
import { usePlans } from '@/lib/plans-context';

const WEEKLY: Record<keyof typeof AREAS, number[]> = {
  personal: [1, 1, 0, 1, 1, 1, 0, 1],
  amigos: [1, 0, 1, 1, 0, 1, 1, 1],
  familia: [1, 1, 1, 0, 1, 1, 1, 0],
  pareja: [0, 1, 1, 1, 1, 0, 1, 1],
};

export default function PerfilPage() {
  const { plans } = usePlans();
  const now = new Date();
  const totalThisMonth = Object.values(plans)
    .flat()
    .filter((p) => {
      const d = new Date(p.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

  return (
    <div className="px-6 pt-8 pb-6">
      <p className="font-mono uppercase tracking-widest" style={{ color: COLORS.textMuted, fontSize: 10 }}>
        Perfil
      </p>
      <h1 className="font-display text-3xl mt-1" style={{ color: COLORS.text }}>
        Sofía Ramírez
      </h1>

      <div className="mt-6 rounded-2xl p-4" style={{ background: COLORS.surface }}>
        <p className="font-mono uppercase tracking-widest" style={{ color: COLORS.personal, fontSize: 10 }}>
          Plan gratuito
        </p>
        <p className="mt-1 text-sm" style={{ color: COLORS.text }}>
          {totalThisMonth} plan{totalThisMonth !== 1 ? 'es' : ''} registrado{totalThisMonth !== 1 ? 's' : ''} este mes
        </p>
        <button className="mt-3 flex cursor-pointer items-center gap-1 text-sm font-medium" style={{ color: COLORS.personal }}>
          Mejorar a Premium <ArrowRight size={14} />
        </button>
      </div>

      <p className="font-mono uppercase tracking-widest mt-8" style={{ color: COLORS.textMuted, fontSize: 10 }}>
        Tu constancia · últimas 8 semanas
      </p>
      <div className="mt-3 space-y-3">
        {(Object.keys(AREAS) as (keyof typeof AREAS)[]).map((k) => (
          <div key={k} className="flex items-center gap-3">
            <span className="w-16 text-xs" style={{ color: COLORS.text }}>
              {AREAS[k].label}
            </span>
            <div className="flex gap-1">
              {WEEKLY[k].map((v, i) => (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: v ? AREAS[k].color : COLORS.surfaceAlt,
                    opacity: v ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl p-4" style={{ background: COLORS.surface }}>
        <Sparkles size={18} style={{ color: COLORS.personal }} />
        <p className="text-xs" style={{ color: COLORS.textMuted }}>
          Ganas puntos cuando otras personas guardan tus planes. Hoy tienes{' '}
          <span style={{ color: COLORS.text, fontWeight: 600 }}>120 pts</span>.
        </p>
      </div>
    </div>
  );
}
