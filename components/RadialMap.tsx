'use client';

import { useRouter } from 'next/navigation';
import { AREAS, COLORS } from '@/lib/constants';
import type { ListedArea } from '@/lib/types';

const NODES: { key: ListedArea; angle: number; r: number }[] = [
  { key: 'pareja', angle: -90, r: 110 },
  { key: 'amigos', angle: 150, r: 110 },
  { key: 'familia', angle: 30, r: 110 },
];

const CENTER = { x: 150, y: 148 };

function pos(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER.x + radius * Math.cos(rad), y: CENTER.y + radius * Math.sin(rad) };
}

export function RadialMap({ freshness }: { freshness: Record<ListedArea, number> }) {
  const router = useRouter();

  return (
    <div className="relative mt-4">
      <svg viewBox="0 0 300 280" width="100%" height="240">
        {NODES.map((n) => {
          const p = pos(n.angle, n.r);
          const days = freshness[n.key];
          const opacity = Math.max(0.25, 1 - days / 14);
          return (
            <line
              key={n.key}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={p.x}
              y2={p.y}
              stroke={AREAS[n.key].color}
              strokeWidth={2}
              opacity={opacity}
            />
          );
        })}
        <circle cx={CENTER.x} cy={CENTER.y} r={34} fill={COLORS.personal} className="pulse" />
        <text
          x={CENTER.x}
          y={CENTER.y + 4}
          textAnchor="middle"
          className="font-mono"
          fontSize={11}
          fontWeight={600}
          fill={COLORS.bg}
        >
          TÚ
        </text>
        {NODES.map((n) => {
          const p = pos(n.angle, n.r);
          const days = freshness[n.key];
          const opacity = Math.max(0.4, 1 - days / 14);
          return (
            <g
              key={n.key}
              onClick={() => router.push(AREAS[n.key].path)}
              style={{ cursor: 'pointer' }}
              className={days <= 3 ? 'pulse' : ''}
            >
              <circle cx={p.x} cy={p.y} r={25} fill={AREAS[n.key].color} opacity={opacity} />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                className="font-mono"
                fontSize={10}
                fontWeight={600}
                fill={COLORS.bg}
              >
                {AREAS[n.key].label[0]}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="grid grid-cols-3 gap-2 -mt-2">
        {NODES.map((n) => {
          const days = freshness[n.key];
          const stale = days > 7;
          return (
            <div key={n.key} className="text-center">
              <p
                className="font-mono"
                style={{ color: stale ? AREAS[n.key].color : COLORS.textMuted, fontSize: 10 }}
              >
                {AREAS[n.key].label} · {days === 0 ? 'hoy' : `hace ${days}d`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
