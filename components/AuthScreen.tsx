'use client';

import { useState, type FormEvent } from 'react';
import { COLORS } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error, needsConfirmation } = await signUp(email, password, displayName);
      if (error) setError(error);
      else if (needsConfirmation) setNotice('Cuenta creada. Revisa tu correo para confirmarla antes de entrar.');
    }
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: COLORS.bg }}>
      <div className="w-full max-w-sm">
        <p className="font-mono uppercase tracking-widest" style={{ color: COLORS.textMuted, fontSize: 10 }}>
          Ecosistema de vínculos
        </p>
        <h1 className="font-display text-3xl mt-1" style={{ color: COLORS.text }}>
          {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === 'signup' && (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-xl p-3 text-sm outline-none"
              style={{ background: COLORS.surfaceAlt, color: COLORS.text }}
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={{ background: COLORS.surfaceAlt, color: COLORS.text }}
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full rounded-xl p-3 text-sm outline-none"
            style={{ background: COLORS.surfaceAlt, color: COLORS.text }}
          />

          {error && (
            <p className="text-sm" style={{ color: COLORS.pareja }}>
              {error}
            </p>
          )}
          {notice && (
            <p className="text-sm" style={{ color: COLORS.amigos }}>
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
            style={{ background: COLORS.personal, color: COLORS.bg }}
          >
            {submitting ? 'Un momento...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError(null);
            setNotice(null);
          }}
          className="mt-4 cursor-pointer text-sm"
          style={{ color: COLORS.textMuted }}
        >
          {mode === 'login' ? '¿No tienes cuenta? Crea una' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}
