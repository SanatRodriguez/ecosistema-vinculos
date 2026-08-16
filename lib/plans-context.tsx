'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import { LISTED_AREAS } from './constants';
import type { Area, ListedArea, Plan } from './types';

export function daysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

type PlansByArea = Record<Area, Plan[]>;

interface PlansContextValue {
  plans: PlansByArea;
  loading: boolean;
  freshness: Record<ListedArea, number>;
  modalOpen: boolean;
  modalCategory: Area;
  form: { title: string; note: string };
  setForm: (f: { title: string; note: string }) => void;
  setModalCategory: (a: Area) => void;
  openModal: (area: Area) => void;
  closeModal: () => void;
  savePlan: () => Promise<void>;
  saving: boolean;
}

const EMPTY_PLANS: PlansByArea = { personal: [], amigos: [], familia: [], pareja: [] };

const PlansContext = createContext<PlansContextValue | null>(null);

export function PlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<PlansByArea>(EMPTY_PLANS);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<Area>('amigos');
  const [form, setForm] = useState({ title: '', note: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('Error cargando planes:', error);
        setLoading(false);
        return;
      }
      const grouped: PlansByArea = { personal: [], amigos: [], familia: [], pareja: [] };
      (data ?? []).forEach((p) => grouped[p.area as Area].push(p as Plan));
      setPlans(grouped);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const freshness = useMemo(() => {
    const out = {} as Record<ListedArea, number>;
    LISTED_AREAS.forEach((k) => {
      const arr = plans[k];
      out[k] = arr.length ? Math.min(...arr.map((p) => daysAgo(p.created_at))) : 30;
    });
    return out;
  }, [plans]);

  function openModal(area: Area) {
    setModalCategory(area);
    setForm({ title: '', note: '' });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function savePlan() {
    if (!form.title.trim() || saving) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('plans')
      .insert({ area: modalCategory, title: form.title.trim(), note: form.note.trim() || null })
      .select()
      .single();
    setSaving(false);
    if (error) {
      console.error('Error guardando plan:', error);
      return;
    }
    setPlans((prev) => ({ ...prev, [modalCategory]: [data as Plan, ...prev[modalCategory]] }));
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
