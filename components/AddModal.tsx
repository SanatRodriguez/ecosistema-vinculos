'use client';

import { X } from 'lucide-react';
import { AREAS, COLORS } from '@/lib/constants';
import { usePlans, todayISO } from '@/lib/plans-context';
import type { ListedArea } from '@/lib/types';

const CATS: ListedArea[] = ['amigos', 'familia'];

export function AddModal() {
  const { modalOpen, modalCategory, setModalCategory, form, setForm, savePlan, closeModal, saving } = usePlans();
  if (!modalOpen) return null;
  const a = AREAS[modalCategory];

  return (
    <div
      className="fixed inset-0 z-40 flex items-end"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={closeModal}
    >
      <div
        className="mx-auto w-full max-w-md rounded-t-3xl p-6"
        style={{ background: COLORS.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl" style={{ color: COLORS.text }}>
            Nuevo plan
          </h2>
          <button onClick={closeModal} className="cursor-pointer">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setModalCategory(c)}
              className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: modalCategory === c ? AREAS[c].color : 'transparent',
                color: modalCategory === c ? COLORS.bg : AREAS[c].color,
                border: `1px solid ${AREAS[c].color}`,
              }}
            >
              {AREAS[c].label}
            </button>
          ))}
        </div>

        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="¿Qué plan hicieron?"
          className="mt-4 w-full rounded-xl p-3 text-sm outline-none"
          style={{ background: COLORS.surfaceAlt, color: COLORS.text }}
        />
        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Un detalle para recordarlo (opcional)"
          rows={2}
          className="mt-2 w-full resize-none rounded-xl p-3 text-sm outline-none"
          style={{ background: COLORS.surfaceAlt, color: COLORS.text }}
        />
        <label className="mt-2 block text-xs" style={{ color: COLORS.textMuted }}>
          Fecha
          <input
            type="date"
            value={form.date}
            max={todayISO()}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-1 w-full rounded-xl p-3 text-sm outline-none"
            style={{ background: COLORS.surfaceAlt, color: COLORS.text }}
          />
        </label>

        <button
          onClick={savePlan}
          disabled={saving || !form.title.trim()}
          className="mt-4 w-full cursor-pointer rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
          style={{ background: a.color, color: COLORS.bg }}
        >
          {saving ? 'Guardando...' : 'Guardar recuerdo'}
        </button>
      </div>
    </div>
  );
}
