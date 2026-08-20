'use client';

import { useState } from 'react';
import { Plus, User as UserIcon } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import { GoalsProvider, useGoals } from '@/lib/goals-context';
import { GoalCard } from '@/components/GoalCard';
import { AddGoalModal } from '@/components/AddGoalModal';

function PersonalContent() {
  const { goals, loading, addGoal, toggleToday } = useGoals();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div
        className="px-6 pt-8 pb-5"
        style={{ background: `linear-gradient(180deg, ${COLORS.personal}22, transparent)` }}
      >
        <div className="flex items-center gap-2">
          <UserIcon size={16} style={{ color: COLORS.personal }} />
          <span className="font-mono uppercase tracking-widest" style={{ color: COLORS.personal, fontSize: 10 }}>
            Ecosistema
          </span>
        </div>
        <h1 className="font-display text-3xl mt-1" style={{ color: COLORS.text }}>
          Personal
        </h1>
      </div>

      <div className="px-6">
        <p className="font-mono uppercase tracking-widest mt-2" style={{ color: COLORS.textMuted, fontSize: 10 }}>
          {loading ? 'Cargando...' : `${goals.length} meta${goals.length !== 1 ? 's' : ''}`}
        </p>

        <div className="mt-3 space-y-2 pb-6">
          {!loading && goals.length === 0 && (
            <div className="rounded-xl p-5 text-center" style={{ background: COLORS.surface }}>
              <p className="text-sm" style={{ color: COLORS.textMuted }}>
                Aún no tienes metas. Empieza con algo simple, como hacer ejercicio unas veces por semana.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-3 cursor-pointer text-sm font-medium"
                style={{ color: COLORS.personal }}
              >
                Crear tu primera meta
              </button>
            </div>
          )}
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} onToggleToday={() => toggleToday(g.id)} />
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
          background: COLORS.personal,
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        }}
      >
        <Plus size={22} style={{ color: COLORS.bg }} />
      </button>

      <AddGoalModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={addGoal} />
    </div>
  );
}

export default function PersonalPage() {
  return (
    <GoalsProvider>
      <PersonalContent />
    </GoalsProvider>
  );
}
