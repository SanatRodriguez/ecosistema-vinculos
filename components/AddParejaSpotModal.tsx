'use client';

import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import type { NewParejaSpot } from '@/lib/pareja-context';

const CATEGORIES = ['Comida', 'Bebidas', 'Postres', 'Actividad', 'Entretenimiento', 'Otro'];

const EMPTY: NewParejaSpot = {
  name: '',
  category: 'Comida',
  zone: '',
  address: '',
  maps_url: '',
  description: '',
  avg_price_for_two: '',
  hours: '',
  contact: '',
};

export function AddParejaSpotModal({
  open,
  onClose,
  onCreate,
  uploading,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (fields: NewParejaSpot, photoFile: File | null) => Promise<void>;
  uploading: boolean;
}) {
  const [fields, setFields] = useState<NewParejaSpot>(EMPTY);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  if (!open) return null;

  function set<K extends keyof NewParejaSpot>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fields.name.trim() || uploading) return;
    await onCreate(fields, photoFile);
    setFields(EMPTY);
    setPhotoFile(null);
    onClose();
  }

  const inputStyle = { background: COLORS.surfaceAlt, color: COLORS.text };

  return (
    <div className="fixed inset-0 z-40 flex items-end" style={{ background: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
      <div
        className="mx-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl p-6"
        style={{ background: COLORS.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl" style={{ color: COLORS.text }}>
            Nuevo plan de pareja
          </h2>
          <button onClick={onClose} className="cursor-pointer">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-xs" style={{ color: COLORS.textMuted }}>
              Foto del lugar
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-xs"
              style={{ color: COLORS.textMuted }}
            />
          </label>

          <input
            value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Nombre del lugar"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={inputStyle}
          />

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set('category', c)}
                className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  background: fields.category === c ? COLORS.pareja : 'transparent',
                  color: fields.category === c ? COLORS.bg : COLORS.pareja,
                  border: `1px solid ${COLORS.pareja}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <input
            value={fields.zone}
            onChange={(e) => set('zone', e.target.value)}
            placeholder="Zona (ej. Miraflores)"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={inputStyle}
          />
          <input
            value={fields.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Dirección"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={inputStyle}
          />
          <input
            value={fields.maps_url}
            onChange={(e) => set('maps_url', e.target.value)}
            placeholder="Link de Google Maps"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={inputStyle}
          />
          <textarea
            value={fields.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Descripción"
            rows={2}
            className="w-full resize-none rounded-xl p-3 text-sm outline-none"
            style={inputStyle}
          />
          <input
            value={fields.avg_price_for_two}
            onChange={(e) => set('avg_price_for_two', e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="Precio promedio para 2 (S/)"
            inputMode="decimal"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={inputStyle}
          />
          <input
            value={fields.hours}
            onChange={(e) => set('hours', e.target.value)}
            placeholder="Horario"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={inputStyle}
          />
          <input
            value={fields.contact}
            onChange={(e) => set('contact', e.target.value)}
            placeholder="Teléfono o link de contacto"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={uploading || !fields.name.trim()}
            className="w-full cursor-pointer rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
            style={{ background: COLORS.pareja, color: COLORS.bg }}
          >
            {uploading ? 'Guardando...' : 'Guardar plan'}
          </button>
        </form>
      </div>
    </div>
  );
}
