'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth-context';

export interface Goal {
  id: string;
  activity_name: string;
  target_per_week: number;
  created_at: string;
}

export interface GoalWithProgress extends Goal {
  checkinDates: string[];
  weekCount: number;
  checkedToday: boolean;
}

interface GoalsContextValue {
  goals: GoalWithProgress[];
  loading: boolean;
  addGoal: (activityName: string, targetPerWeek: number) => Promise<void>;
  toggleToday: (goalId: string) => Promise<void>;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

function dateToISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayISO() {
  return dateToISO(new Date());
}

function mondayOfWeek(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return dateToISO(date);
}

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [rawGoals, setRawGoals] = useState<Goal[]>([]);
  const [checkins, setCheckins] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const [goalsRes, checkinsRes] = await Promise.all([
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
        supabase.from('goal_checkins').select('goal_id, checkin_date'),
      ]);
      if (cancelled) return;
      if (goalsRes.error || checkinsRes.error) {
        console.error('Error cargando metas:', goalsRes.error || checkinsRes.error);
        setLoading(false);
        return;
      }
      const grouped: Record<string, string[]> = {};
      (checkinsRes.data ?? []).forEach((c) => {
        grouped[c.goal_id] = grouped[c.goal_id] ? [...grouped[c.goal_id], c.checkin_date] : [c.checkin_date];
      });
      setRawGoals((goalsRes.data ?? []) as Goal[]);
      setCheckins(grouped);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const goals = useMemo<GoalWithProgress[]>(() => {
    const monday = mondayOfWeek(todayISO());
    const today = todayISO();
    return rawGoals.map((g) => {
      const dates = checkins[g.id] ?? [];
      const weekCount = dates.filter((d) => d >= monday).length;
      return { ...g, checkinDates: dates, weekCount, checkedToday: dates.includes(today) };
    });
  }, [rawGoals, checkins]);

  async function addGoal(activityName: string, targetPerWeek: number) {
    if (!user || !activityName.trim()) return;
    const { data, error } = await supabase
      .from('goals')
      .insert({ user_id: user.id, activity_name: activityName.trim(), target_per_week: targetPerWeek })
      .select()
      .single();
    if (error) {
      console.error('Error creando meta:', error);
      return;
    }
    setRawGoals((prev) => [data as Goal, ...prev]);
  }

  async function toggleToday(goalId: string) {
    if (!user) return;
    const today = todayISO();
    const already = (checkins[goalId] ?? []).includes(today);
    if (already) {
      const { error } = await supabase.from('goal_checkins').delete().eq('goal_id', goalId).eq('checkin_date', today);
      if (error) {
        console.error('Error quitando check:', error);
        return;
      }
      setCheckins((prev) => ({ ...prev, [goalId]: (prev[goalId] ?? []).filter((d) => d !== today) }));
    } else {
      const { error } = await supabase
        .from('goal_checkins')
        .insert({ goal_id: goalId, user_id: user.id, checkin_date: today });
      if (error) {
        console.error('Error guardando check:', error);
        return;
      }
      setCheckins((prev) => ({ ...prev, [goalId]: [...(prev[goalId] ?? []), today] }));
    }
  }

  return <GoalsContext.Provider value={{ goals, loading, addGoal, toggleToday }}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error('useGoals debe usarse dentro de GoalsProvider');
  return ctx;
}
