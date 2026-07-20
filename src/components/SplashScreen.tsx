'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'

// BetAdonis brand mark (from favicon) — used as the animated hero glyph
const MARK_PATH =
  'M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z'

const ODDS_SEQUENCE = ['1.85', '2.40', '1.98']

// Global timeline speed. 1 = base; higher = slower. Drives both the CSS
// animations (via the --splash-speed custom property) and the JS timers below.
const SPEED = 1.5

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const { theme } = useTheme()
  const logo = theme === 'dark' ? '/logo-dark.png' : '/logo.png'

  const [exiting, setExiting] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [odds, setOdds] = useState(ODDS_SEQUENCE[0])

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(isReduced)

    const exitMs = Math.round(420 * SPEED)
    const TOTAL = isReduced ? Math.max(650, exitMs + 150) : Math.round(2200 * SPEED)
    const EXIT_AT = TOTAL - exitMs

    // Lock scroll while the splash is up
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timers: ReturnType<typeof setTimeout>[] = []
    if (!isReduced) {
      // Ticking-odds flourish
      ODDS_SEQUENCE.forEach((v, i) => {
        timers.push(setTimeout(() => setOdds(v), Math.round((1300 + i * 220) * SPEED)))
      })
    }
    timers.push(setTimeout(() => setExiting(true), EXIT_AT))
    timers.push(setTimeout(onDone, TOTAL))

    return () => {
      timers.forEach(clearTimeout)
      document.body.style.overflow = prevOverflow
    }
  }, [onDone])

  const skip = () => {
    setExiting(true)
    setTimeout(onDone, Math.round(420 * SPEED))
  }

  return (
    <div
      className={`splash-root${exiting ? ' splash-exit' : ''}${reduced ? ' splash-reduced' : ''}`}
      onClick={skip}
      role="status"
      aria-label="BetAdonis yükleniyor"
      style={{ ['--splash-speed' as string]: String(SPEED) } as React.CSSProperties}
    >
      {/* Decorative speed lines */}
      <div className="splash-lines" aria-hidden="true">
        <span style={{ top: '38%', left: '18%', width: 90, animationDelay: `${0.15 * SPEED}s` }} />
        <span style={{ top: '46%', left: '12%', width: 130, animationDelay: `${0.28 * SPEED}s` }} />
        <span style={{ top: '58%', left: '22%', width: 70, animationDelay: `${0.4 * SPEED}s` }} />
      </div>

      <div className="splash-lockup">
        {/* Brand mark — draws in + pops */}
        <svg className="splash-mark" viewBox="0 0 48 46" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="splashMarkGrad" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#863bff" />
              <stop offset="100%" stopColor="#0E8FCF" />
            </linearGradient>
          </defs>
          <path
            d={MARK_PATH}
            pathLength={1}
            fill="url(#splashMarkGrad)"
            stroke="#47bfff"
            strokeWidth={1.4}
            strokeLinejoin="round"
            style={{ strokeDasharray: 1 }}
          />
        </svg>

        {/* Wordmark — two halves snap together */}
        <div className="splash-word">
          <img className="splash-word-sizer" src={logo} alt="BetAdonis" />
          <img className="splash-word-half splash-word-l" src={logo} alt="" aria-hidden="true" />
          <img className="splash-word-half splash-word-r" src={logo} alt="" aria-hidden="true" />
        </div>

        {/* Sweep bar */}
        <div className="splash-bar" aria-hidden="true" />

        {/* Odds ticker flourish */}
        <div className="splash-odds" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
          <span className="splash-odds-val">{odds}</span>
        </div>

        {/* Tagline */}
        <div className="splash-tagline" aria-hidden="true">SPOR · CASINO · CANLI</div>

        {/* Shine sweep across the lockup */}
        <div className="splash-shine" aria-hidden="true" />
      </div>
    </div>
  )
}
