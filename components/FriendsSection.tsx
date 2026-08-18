'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { UserPlus, Check, X as XIcon } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

interface ProfileRef {
  id: string;
  email: string;
  display_name: string | null;
}

interface FriendshipRow {
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  requester_id: string;
  addressee_id: string;
  requester: ProfileRef;
  addressee: ProfileRef;
}

export function FriendsSection() {
  const { user } = useAuth();
  const [rows, setRows] = useState<FriendshipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function fetchFriendships() {
    const { data, error } = await supabase
      .from('friendships')
      .select(
        '*, requester:profiles!friendships_requester_id_fkey(id,email,display_name), addressee:profiles!friendships_addressee_id_fkey(id,email,display_name)',
      );
    return error || !data ? [] : (data as unknown as FriendshipRow[]);
  }

  async function refresh() {
    setRows(await fetchFriendships());
  }

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchFriendships().then((rows) => {
      if (cancelled) return;
      setRows(rows);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function sendRequest(e: FormEvent) {
    e.preventDefault();
    if (!user || !email.trim()) return;
    setMessage(null);
    setSending(true);
    const targetEmail = email.trim().toLowerCase();
    if (targetEmail === user.email?.toLowerCase()) {
      setMessage('Ese es tu propio correo.');
      setSending(false);
      return;
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .eq('email', targetEmail)
      .maybeSingle();
    if (profileError || !profile) {
      setMessage('No encontramos una cuenta con ese correo.');
      setSending(false);
      return;
    }
    const { error: insertError } = await supabase
      .from('friendships')
      .insert({ requester_id: user.id, addressee_id: profile.id });
    setSending(false);
    if (insertError) {
      setMessage(
        insertError.code === '23505' ? 'Ya existe una solicitud con esa persona.' : 'No se pudo enviar la solicitud.',
      );
      return;
    }
    setEmail('');
    setMessage('Solicitud enviada.');
    refresh();
  }

  async function respond(id: string, status: 'accepted' | 'declined') {
    await supabase.from('friendships').update({ status }).eq('id', id);
    refresh();
  }

  if (!user) return null;

  const incoming = rows.filter((r) => r.status === 'pending' && r.addressee_id === user.id);
  const outgoing = rows.filter((r) => r.status === 'pending' && r.requester_id === user.id);
  const accepted = rows.filter((r) => r.status === 'accepted');

  return (
    <div className="mt-8">
      <p className="font-mono uppercase tracking-widest" style={{ color: COLORS.textMuted, fontSize: 10 }}>
        Amigos
      </p>

      <form onSubmit={sendRequest} className="mt-3 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo de tu amigo"
          className="flex-1 rounded-xl p-3 text-sm outline-none"
          style={{ background: COLORS.surfaceAlt, color: COLORS.text }}
        />
        <button
          type="submit"
          disabled={sending || !email.trim()}
          className="flex cursor-pointer items-center justify-center rounded-xl px-4 disabled:opacity-50"
          style={{ background: COLORS.amigos }}
        >
          <UserPlus size={18} style={{ color: COLORS.bg }} />
        </button>
      </form>
      {message && (
        <p className="mt-2 text-xs" style={{ color: COLORS.textMuted }}>
          {message}
        </p>
      )}

      {!loading && incoming.length > 0 && (
        <div className="mt-4 space-y-2">
          {incoming.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-xl p-3"
              style={{ background: COLORS.surface }}
            >
              <span className="text-sm" style={{ color: COLORS.text }}>
                {r.requester.display_name || r.requester.email} quiere ser tu amigo
              </span>
              <div className="flex gap-2">
                <button onClick={() => respond(r.id, 'accepted')} className="cursor-pointer">
                  <Check size={18} style={{ color: COLORS.amigos }} />
                </button>
                <button onClick={() => respond(r.id, 'declined')} className="cursor-pointer">
                  <XIcon size={18} style={{ color: COLORS.pareja }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && accepted.length > 0 && (
        <div className="mt-4 space-y-2">
          {accepted.map((r) => {
            const other = r.requester_id === user.id ? r.addressee : r.requester;
            return (
              <div
                key={r.id}
                className="rounded-xl p-3 text-sm"
                style={{ background: COLORS.surface, color: COLORS.text }}
              >
                {other.display_name || other.email}
              </div>
            );
          })}
        </div>
      )}

      {!loading && outgoing.length > 0 && (
        <p className="mt-3 text-xs" style={{ color: COLORS.textMuted }}>
          {outgoing.length} solicitud{outgoing.length !== 1 ? 'es' : ''} pendiente{outgoing.length !== 1 ? 's' : ''} de
          aceptar.
        </p>
      )}

      {!loading && rows.length === 0 && (
        <p className="mt-3 text-xs" style={{ color: COLORS.textMuted }}>
          Aún no tienes amigos agregados.
        </p>
      )}
    </div>
  );
}
