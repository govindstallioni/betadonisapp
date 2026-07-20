'use client'

// Animated header banner for the Login / Register screens.
// Brand-styled: gradient + aurora, sparkles, sheen sweep, the BetAdonis
// lightning mark, and floating odds chips — all entering on mount.

const MARK_PATH =
  'M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z'

type Variant = 'login' | 'register'

type Chip = { label: string; style: React.CSSProperties; dur: string; accent?: boolean }

const CONTENT: Record<Variant, { title: string; sub: string; chips: Chip[] }> = {
  login: {
    title: 'Tekrar hoş geldin',
    sub: 'Kaldığın yerden devam et',
    chips: [
      { label: '1.85', style: { top: '20%', left: '13%' }, dur: '4s' },
      { label: '2.40', style: { top: '30%', right: '11%' }, dur: '4.6s' },
      { label: 'x2', style: { bottom: '18%', left: '20%' }, dur: '5.2s' },
    ],
  },
  register: {
    title: 'Aramıza katıl',
    sub: 'Kazanmaya hemen başla',
    chips: [
      { label: '%100', style: { top: '19%', left: '12%' }, dur: '4.4s', accent: true },
      { label: '2.40', style: { top: '31%', right: '10%' }, dur: '5s' },
      { label: 'Bonus', style: { bottom: '17%', left: '18%' }, dur: '4.8s', accent: true },
    ],
  },
}

// Sparkle positions (percent) + per-star timing offsets
const SPARKS: { top: string; left: string; delay: string }[] = [
  { top: '24%', left: '30%', delay: '0s' },
  { top: '62%', left: '40%', delay: '0.5s' },
  { top: '35%', left: '72%', delay: '1s' },
  { top: '70%', left: '66%', delay: '1.4s' },
  { top: '18%', left: '58%', delay: '0.8s' },
  { top: '52%', left: '84%', delay: '1.8s' },
]

export default function AuthHero({ variant = 'login' }: { variant?: Variant }) {
  const c = CONTENT[variant]

  return (
    <div className="auth-hero" aria-hidden="true">
      {/* Drifting aurora */}
      <div className="auth-aurora auth-aurora-a" />
      <div className="auth-aurora auth-aurora-b" />

      {/* Sparkles */}
      {SPARKS.map((s, i) => (
        <span key={i} className="auth-spark" style={{ top: s.top, left: s.left, animationDelay: s.delay }} />
      ))}

      {/* Sheen sweep */}
      <div className="auth-sheen" />

      {/* Floating odds chips */}
      {c.chips.map((chip, i) => (
        <span key={i} className="auth-chip-wrap" style={{ ...chip.style, animationDelay: `${0.35 + i * 0.12}s` }}>
          <span
            className={`auth-chip${chip.accent ? ' auth-chip-accent' : ''}`}
            style={{ animationDuration: chip.dur, animationDelay: `${i * 0.4}s` }}
          >
            {chip.label}
          </span>
        </span>
      ))}

      {/* Brand mark + welcome */}
      <div className="auth-hero-content">
        <svg className="auth-mark" viewBox="0 0 48 46" fill="none">
          <defs>
            <linearGradient id={`authMark-${variant}`} x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9b6bff" />
              <stop offset="100%" stopColor="#47bfff" />
            </linearGradient>
          </defs>
          <path d={MARK_PATH} fill={`url(#authMark-${variant})`} stroke="#bfe3ff" strokeWidth={1} strokeLinejoin="round" />
        </svg>
        <img className="auth-wordmark" src="/logo-dark.png" alt="BetAdonis" />
        <p className="auth-hero-title">{c.title}</p>
        <p className="auth-hero-sub">{c.sub}</p>
      </div>
    </div>
  )
}
