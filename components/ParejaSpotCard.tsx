'use client';

/* eslint-disable @next/next/no-img-element */

import { MapPin, Clock, Phone, Image as ImageIcon } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import type { ParejaSpot, ParejaStatus } from '@/lib/pareja-context';

export function ParejaSpotCard({
  spot,
  onStatusChange,
}: {
  spot: ParejaSpot;
  onStatusChange: (status: ParejaStatus) => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ background: COLORS.surface, border: `1px solid ${COLORS.pareja}33` }}
    >
      {spot.photo_url ? (
        <img src={spot.photo_url} alt={spot.name} className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-20 w-full items-center justify-center" style={{ background: COLORS.surfaceAlt }}>
          <ImageIcon size={22} style={{ color: COLORS.textMuted }} />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.text }}>
              {spot.name}
            </p>
            <p className="font-mono uppercase tracking-widest" style={{ color: COLORS.pareja, fontSize: 9 }}>
              {spot.category}
            </p>
          </div>
          {spot.avg_price_for_two != null && (
            <div className="shrink-0 rounded-lg px-2 py-1 text-center" style={{ border: `1px dashed ${COLORS.textMuted}` }}>
              <p className="font-mono" style={{ color: COLORS.textMuted, fontSize: 8 }}>
                PROMEDIO 2
              </p>
              <p className="text-sm font-semibold" style={{ color: COLORS.text }}>
                S/ {spot.avg_price_for_two}
              </p>
            </div>
          )}
        </div>

        {(spot.zone || spot.address) && (
          <div className="mt-2 flex items-start gap-1.5">
            <MapPin size={12} style={{ color: COLORS.textMuted, marginTop: 2 }} />
            <div>
              {spot.zone && (
                <p className="text-xs" style={{ color: COLORS.text }}>
                  {spot.zone}
                </p>
              )}
              {spot.address && (
                <p className="text-xs" style={{ color: COLORS.textMuted }}>
                  {spot.address}
                </p>
              )}
              {spot.maps_url && (
                <a
                  href={spot.maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline"
                  style={{ color: COLORS.amigos }}
                >
                  Ver en Maps
                </a>
              )}
            </div>
          </div>
        )}

        {spot.description && (
          <p className="mt-3 text-xs leading-relaxed" style={{ color: COLORS.textMuted }}>
            {spot.description}
          </p>
        )}

        {spot.hours && (
          <div className="mt-2 flex items-center gap-1.5">
            <Clock size={12} style={{ color: COLORS.textMuted }} />
            <p className="text-xs" style={{ color: COLORS.textMuted }}>
              {spot.hours}
            </p>
          </div>
        )}
        {spot.contact && (
          <div className="mt-1 flex items-center gap-1.5">
            <Phone size={12} style={{ color: COLORS.textMuted }} />
            <p className="text-xs" style={{ color: COLORS.textMuted }}>
              {spot.contact}
            </p>
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <select
            value={spot.status}
            onChange={(e) => onStatusChange(e.target.value as ParejaStatus)}
            className="cursor-pointer rounded-full px-3 py-1 text-xs font-medium outline-none"
            style={{
              background: spot.status === 'realizado' ? `${COLORS.amigos}33` : `${COLORS.personal}33`,
              color: spot.status === 'realizado' ? COLORS.amigos : COLORS.personal,
              border: `1px solid ${spot.status === 'realizado' ? COLORS.amigos : COLORS.personal}`,
            }}
          >
            <option value="pendiente" style={{ background: COLORS.surface }}>
              Plan pendiente
            </option>
            <option value="realizado" style={{ background: COLORS.surface }}>
              Plan realizado
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
