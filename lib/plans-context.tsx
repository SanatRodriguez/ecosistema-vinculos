'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import { LISTED_AREAS } from './constants';
import { useAuth } from './auth-context';
import type { Area, ListedArea, PlanWithMeta } from './types';

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysAgo(planDate: string) {
  const [y, m, d] = planDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.round((todayMidnight.getTime() - date.getTime()) / 86400000));
}

type PlansByArea = Record<Area, PlanWithMeta[]>;

interface PlansContextValue {
  plans: PlansByArea;
  loading: boolean;
  freshness: Record<ListedArea, number>;
  modalOpen: boolean;
  modalCategory: Area;
  form: { title: string; note: string; date: string };
  setForm: (f: { title: string; note: string; date: string }) => void;
  setModalCategory: (a: Area) => void;
  openModal: (area: Area) => void;
  closeModal: () => void;
  savePlan: () => Promise<void>;
  saving: boolean;
}

const EMPTY_PLANS: PlansByArea = { personal: [], amigos: [], familia: [], pareja: [] };

const PlansContext = createContext<PlansContextValue | null>(null);

export function PlansProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PlansByArea>(EMPTY_PLANS);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<Area>('amigos');
  const [form, setForm] = useState({ title: '', note: '', date: todayISO() });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from('plans')
        .select('*, profiles(display_name, email)')
        .order('plan_date', { ascending: false })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('Error cargando planes:', error);
        setLoading(false);
        return;
      }
      const grouped: PlansByArea = { personal: [], amigos: [], familia: [], pareja: [] };
      (data ?? []).forEach((p) => {
        const area = p.area as Area;
        grouped[area].push({ ...p, isMine: p.user_id === user!.id } as PlanWithMeta);
      });
      setPlans(grouped);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const freshness = useMemo(() => {
    const out = {} as Record<ListedArea, number>;
    LISTED_AREAS.forEach((k) => {
      const mine = plans[k].filter((p) => p.isMine);
      out[k] = mine.length ? Math.min(...mine.map((p) => daysAgo(p.plan_date))) : 30;
    });
    return out;
  }, [plans]);

  function openModal(area: Area) {
    setModalCategory(area);
    setForm({ title: '', note: '', date: todayISO() });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function savePlan() {
    if (!form.title.trim() || !user || saving) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('plans')
      .insert({
        area: modalCategory,
        title: form.title.trim(),
        note: form.note.trim() || null,
        plan_date: form.date,
        user_id: user.id,
      })
      .select('*, profiles(display_name, email)')
      .single();
    setSaving(false);
    if (error) {
      console.error('Error guardando plan:', error);
      return;
    }
    setPlans((prev) => ({
      ...prev,
      [modalCategory]: [{ ...data, isMine: true } as PlanWithMeta, ...prev[modalCategory]],
    }));
    setModalOpen(false);
  }

  const value: PlansContextValue = {
    plans,
    loading,
    freshness,
    modalOpen,
    modalCategory,
    form,
    setForm,
    setModalCategory,
    openModal,
    closeModal,
    savePlan,
    saving,
  };

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>;
}

export function usePlans() {
  const ctx = useContext(PlansContext);
  if (!ctx) throw new Error('usePlans debe usarse dentro de PlansProvider');
  return ctx;
}
