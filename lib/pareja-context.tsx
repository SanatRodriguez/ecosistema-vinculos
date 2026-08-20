'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth-context';

export type ParejaStatus = 'pendiente' | 'realizado';

export interface ParejaSpot {
  id: string;
  name: string;
  category: string;
  zone: string | null;
  address: string | null;
  maps_url: string | null;
  description: string | null;
  avg_price_for_two: number | null;
  hours: string | null;
  contact: string | null;
  photo_url: string | null;
  status: ParejaStatus;
  completed_at: string | null;
  created_at: string;
}

export interface NewParejaSpot {
  name: string;
  category: string;
  zone: string;
  address: string;
  maps_url: string;
  description: string;
  avg_price_for_two: string;
  hours: string;
  contact: string;
}

interface ParejaContextValue {
  spots: ParejaSpot[];
  loading: boolean;
  uploading: boolean;
  addSpot: (fields: NewParejaSpot, photoFile: File | null) => Promise<void>;
  setStatus: (id: string, status: ParejaStatus) => Promise<void>;
}

const ParejaContext = createContext<ParejaContextValue | null>(null);

export function ParejaProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [spots, setSpots] = useState<ParejaSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from('pareja_spots')
        .select('*')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('Error cargando planes de pareja:', error);
        setLoading(false);
        return;
      }
      setSpots((data ?? []) as ParejaSpot[]);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function addSpot(fields: NewParejaSpot, photoFile: File | null) {
    if (!user || !fields.name.trim()) return;
    setUploading(true);
    let photoUrl: string | null = null;
    if (photoFile) {
      const ext = photoFile.name.split('.').pop();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('pareja-photos').upload(path, photoFile);
      if (uploadError) {
        console.error('Error subiendo foto:', uploadError);
      } else {
        photoUrl = supabase.storage.from('pareja-photos').getPublicUrl(path).data.publicUrl;
      }
    }
    const { data, error } = await supabase
      .from('pareja_spots')
      .insert({
        user_id: user.id,
        name: fields.name.trim(),
        category: fields.category,
        zone: fields.zone.trim() || null,
        address: fields.address.trim() || null,
        maps_url: fields.maps_url.trim() || null,
        description: fields.description.trim() || null,
        avg_price_for_two: fields.avg_price_for_two.trim() ? Number(fields.avg_price_for_two) : null,
        hours: fields.hours.trim() || null,
        contact: fields.contact.trim() || null,
        photo_url: photoUrl,
      })
      .select()
      .single();
    setUploading(false);
    if (error) {
      console.error('Error creando plan de pareja:', error);
      return;
    }
    setSpots((prev) => [data as ParejaSpot, ...prev]);
  }

  async function setStatus(id: string, status: ParejaStatus) {
    const { data, error } = await supabase
      .from('pareja_spots')
      .update({ status, completed_at: status === 'realizado' ? new Date().toISOString() : null })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error actualizando estado:', error);
      return;
    }
    setSpots((prev) => prev.map((s) => (s.id === id ? (data as ParejaSpot) : s)));
  }

  return (
    <ParejaContext.Provider value={{ spots, loading, uploading, addSpot, setStatus }}>
      {children}
    </ParejaContext.Provider>
  );
}

export function usePareja() {
  const ctx = useContext(ParejaContext);
  if (!ctx) throw new Error('usePareja debe usarse dentro de ParejaProvider');
  return ctx;
}
