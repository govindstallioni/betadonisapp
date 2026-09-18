import type { ComponentType } from 'react'
import { Ban, Banknote, CalendarPlus, Coins, Crown, Gem, HandCoins, RotateCw } from 'lucide-react'

// ── Şans Çarkı face (work3 task 4 — betadonis.store/cark.html, 1:1) ─────────
// Same 17 slices, order, palette, icon colours, text sizes and radii as the
// reference; Font Awesome glyphs are swapped for their lucide equivalents.
// Shared by the real wheel (SpinWheel) and the home teaser (DailyWheel).

type Icon = ComponentType<{ x?: number; y?: number; width?: number; height?: number; color?: string; strokeWidth?: number }>

export type WheelSlice = { text: string; icon: Icon; iconColor: string; isBig: boolean }

export const WHEEL_SLICES: WheelSlice[] = [
  { text: 'Tekrar Çevir', icon: RotateCw, iconColor: '#38bdf8', isBig: false },
  { text: '10 ₺', icon: Coins, iconColor: '#fde047', isBig: true },
  { text: 'Tekrar Çevir', icon: RotateCw, iconColor: '#38bdf8', isBig: false },
  { text: 'Tekrar Çevir', icon: RotateCw, iconColor: '#38bdf8', isBig: false },
  { text: '5 ₺', icon: HandCoins, iconColor: '#4ade80', isBig: true },
  { text: 'Tekrar Çevir', icon: RotateCw, iconColor: '#38bdf8', isBig: false },
  { text: '15 ₺', icon: Gem, iconColor: '#38bdf8', isBig: true },
  { text: '17 ₺', icon: Crown, iconColor: '#fbbf24', isBig: true },
  { text: 'BOŞ', icon: Ban, iconColor: '#ef4444', isBig: false },
  { text: '3 Gün Ekstra', icon: CalendarPlus, iconColor: '#f59e0b', isBig: false },
  { text: 'Tekrar Çevir', icon: RotateCw, iconColor: '#38bdf8', isBig: false },
  { text: '5 ₺', icon: Coins, iconColor: '#fde047', isBig: true },
  { text: '2 ₺', icon: Banknote, iconColor: '#4ade80', isBig: true },
  { text: '1 Gün Ekstra', icon: CalendarPlus, iconColor: '#ec4899', isBig: false },
  { text: '17 ₺', icon: Gem, iconColor: '#38bdf8', isBig: true },
  { text: 'BOŞ', icon: Ban, iconColor: '#ef4444', isBig: false },
  { text: 'Tekrar Çevir', icon: RotateCw, iconColor: '#38bdf8', isBig: false },
]

const PALETTE = [
  '#0284c7', '#0f172a', '#0369a1', '#0f172a', '#2563eb',
  '#0f172a', '#0099ff', '#0f172a', '#0284c7', '#0f172a',
  '#1d4ed8', '#0f172a', '#0284c7', '#0f172a', '#0369a1',
  '#0f172a', '#2563eb',
]

export const SLICE_ANGLE = 360 / WHEEL_SLICES.length

const rad = (deg: number) => (deg - 90) * (Math.PI / 180)
const at = (r: number, deg: number) => [200 + r * Math.cos(rad(deg)), 200 + r * Math.sin(rad(deg))] as const

/** The wheel disc (400×400 viewBox). `idPrefix` keeps gradient ids unique when
 *  more than one wheel is on the page. */
export function WheelDisc({ idPrefix, rotation = 0, transition, className = '', sparkle = true }: {
  idPrefix: string; rotation?: number; transition?: string; className?: string; sparkle?: boolean
}) {
  const id = (n: string) => `${idPrefix}-${n}`
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
        transition,
        filter: 'drop-shadow(0 0 18px rgba(202, 138, 4, 0.35))',
      }}
    >
      <defs>
        <linearGradient id={id('gold')} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="25%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#ca8a04" />
          <stop offset="75%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <linearGradient id={id('bg')} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id={id('glass')} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="196" fill="none" stroke={`url(#${id('gold')})`} strokeWidth="8" />
      <circle cx="200" cy="200" r="190" fill={`url(#${id('bg')})`} stroke="#0284c7" strokeWidth="1.5" />

      {WHEEL_SLICES.map((s, i) => {
        const start = i * SLICE_ANGLE
        const mid = start + SLICE_ANGLE / 2
        const [x1, y1] = at(186, start)
        const [x2, y2] = at(186, start + SLICE_ANGLE)
        const [ix, iy] = at(160, mid)
        const [tx, ty] = at(110, mid)
        const Icon = s.icon
        return (
          <g key={i}>
            <path d={`M 200 200 L ${x1} ${y1} A 186 186 0 0 1 ${x2} ${y2} Z`} fill={PALETTE[i]} stroke="#1e293b" strokeWidth="1" />
            <g transform={`rotate(${mid + 90}, ${ix}, ${iy})`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))' }}>
              <Icon x={ix - 9} y={iy - 9} width={18} height={18} color={s.iconColor} strokeWidth={2.4} />
            </g>
            <text
              x={tx} y={ty}
              fill="#ffffff"
              fontSize={s.isBig ? 20 : 11.5}
              fontWeight={900}
              letterSpacing="0.3"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${mid + 90}, ${tx}, ${ty})`}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}
            >
              {s.text}
            </text>
          </g>
        )
      })}

      {WHEEL_SLICES.map((_, i) => {
        const [dx, dy] = at(191, i * SLICE_ANGLE)
        return <circle key={i} cx={dx} cy={dy} r={2.5} fill="#fef08a" className={sparkle ? 'wheel-gold-dot' : undefined} />
      })}

      <circle cx="200" cy="200" r="186" fill={`url(#${id('glass')})`} pointerEvents="none" />
    </svg>
  )
}

/** Gold teardrop pointer from the reference. */
export function WheelPointer({ idPrefix }: { idPrefix: string }) {
  return (
    <svg viewBox="0 0 40 50" width="100%" height="100%">
      <defs>
        <linearGradient id={`${idPrefix}-ptr`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fde047" />
          <stop offset="80%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
      </defs>
      <path d="M20 50 L2 8 Q20 0 38 8 Z" fill={`url(#${idPrefix}-ptr)`} stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  )
}

/** Keyframes for the sparkle dots and pointer tick (reference CSS). */
export const WHEEL_CSS = `
.wheel-gold-dot { animation: wheelGoldGlow 0.9s infinite alternate ease-in-out; }
.wheel-gold-dot:nth-of-type(even) { animation-delay: 0.45s; }
@keyframes wheelGoldGlow {
  0% { fill: #fef08a; filter: drop-shadow(0 0 2px #fde047); r: 2.5px; }
  100% { fill: #ffffff; filter: drop-shadow(0 0 8px #fde047) drop-shadow(0 0 12px #ca8a04); r: 4px; }
}
.wheel-pointer-tick { animation: wheelPointerTick 0.1s ease-in-out alternate infinite; }
@keyframes wheelPointerTick {
  0% { transform: translateX(-50%) rotate(0deg); }
  100% { transform: translateX(-50%) rotate(-10deg); }
}
`
