'use client';

import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '@/lib/constants';

export function AddGoalModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (activityName: string, targetPerWeek: number) => Promise<void>;
}) {
  const [activityName, setActivityName] = useState('');
  const [targetPerWeek, setTargetPerWeek] = useState(3);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!activityName.trim() || saving) return;
    setSaving(true);
    await onCreate(activityName, targetPerWeek);
    setSaving(false);
    setActivityName('');
    setTargetPerWeek(3);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end" style={{ background: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
      <div
        className="mx-auto w-full max-w-md rounded-t-3xl p-6"
        style={{ background: COLORS.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl" style={{ color: COLORS.text }}>
            Nueva meta
          </h2>
          <button onClick={onClose} className="cursor-pointer">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder="¿Qué actividad? (ej. Ejercicio)"
            className="mt-4 w-full rounded-xl p-3 text-sm outline-none"
            style={{ background: COLORS.surfaceAlt, color: COLORS.text }}
          />

          <p className="mt-4 text-xs" style={{ color: COLORS.textMuted }}>
            ¿Cuántas veces por semana?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTargetPerWeek(n)}
                className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  background: targetPerWeek === n ? COLORS.personal : 'transparent',
                  color: targetPerWeek === n ? COLORS.bg : COLORS.personal,
                  border: `1px solid ${COLORS.personal}`,
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {activityName.trim() && (
            <p className="mt-3 text-xs" style={{ color: COLORS.textMuted }}>
              Se guardará como:{' '}
              <span style={{ color: COLORS.text }}>
                {activityName.trim()} — {targetPerWeek}x por semana
              </span>
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !activityName.trim()}
            className="mt-4 w-full cursor-pointer rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
            style={{ background: COLORS.personal, color: COLORS.bg }}
          >
            {saving ? 'Guardando...' : 'Crear meta'}
          </button>
        </form>
      </div>
    </div>
  );
}
