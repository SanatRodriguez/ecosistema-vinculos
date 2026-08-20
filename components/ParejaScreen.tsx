'use client';

import { useMemo, useState } from 'react';
import { Plus, Heart } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import { usePareja, type ParejaStatus } from '@/lib/pareja-context';
import { ParejaSpotCard } from './ParejaSpotCard';
import { AddParejaSpotModal } from './AddParejaSpotModal';

type FilterValue = 'todos' | ParejaStatus;

export function ParejaScreen() {
  const { spots, loading, uploading, addSpot, setStatus } = usePareja();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterValue>('todos');

  const filtered = useMemo(() => {
    if (filter === 'todos') return spots;
    return spots.filter((s) => s.status === filter);
  }, [spots, filter]);

  return (
    <div>
      <div className="px-6 pt-8 pb-5" style={{ background: `linear-gradient(180deg, ${COLORS.pareja}22, transparent)` }}>
        <div className="flex items-center gap-2">
          <Heart size={16} style={{ color: COLORS.pareja }} />
          <span className="font-mono uppercase tracking-widest" style={{ color: COLORS.pareja, fontSize: 10 }}>
            Ecosistema
          </span>
        </div>
        <h1 className="font-display text-3xl mt-1" style={{ color: COLORS.text }}>
          Pareja
        </h1>
      </div>

      <div className="px-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterValue)}
          className="mt-2 cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium outline-none"
          style={{ background: COLORS.surfaceAlt, color: COLORS.text, border: `1px solid ${COLORS.pareja}` }}
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Plan pendiente</option>
          <option value="realizado">Plan realizado</option>
        </select>

        <p className="font-mono uppercase tracking-widest mt-3" style={{ color: COLORS.textMuted, fontSize: 10 }}>
          {loading ? 'Cargando...' : `Resultados encontrados: ${filtered.length}`}
        </p>

        <div className="mt-3 space-y-3 pb-6">
          {!loading && filtered.length === 0 && (
            <div className="rounded-xl p-5 text-center" style={{ background: COLORS.surface }}>
              <p className="text-sm" style={{ color: COLORS.textMuted }}>
                {spots.length === 0
                  ? 'Aún no agregas lugares para probar en pareja.'
                  : 'No hay planes con ese estado.'}
              </p>
              {spots.length === 0 && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-3 cursor-pointer text-sm font-medium"
                  style={{ color: COLORS.pareja }}
                >
                  Agregar el primero
                </button>
              )}
            </div>
          )}
          {filtered.map((s) => (
            <ParejaSpotCard key={s.id} spot={s} onStatusChange={(status) => setStatus(s.id, status)} />
          ))}
        </div>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed z-20 flex cursor-pointer items-center justify-center"
        style={{
          right: 20,
          bottom: 86,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: COLORS.pareja,
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        }}
      >
        <Plus size={22} style={{ color: COLORS.bg }} />
      </button>

      <AddParejaSpotModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={addSpot} uploading={uploading} />
    </div>
  );
}
