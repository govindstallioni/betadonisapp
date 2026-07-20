'use client'

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────
export type OddDir = 'up' | 'down' | null

export interface Selection {
  id: string          // unique key for the market outcome
  league: string
  match: string       // "Galatasaray - Fenerbahçe"
  market: string      // "Maç Sonucu"
  pick: string        // "1", "Üst 2.5", ...
  baseOdd: number     // the odd when it was added
  odd: number         // current (live) odd
  dir: OddDir         // last live movement, for the red/green arrow
  locked: boolean     // suspended → faded & unusable
}

// The persisted shape — only the stable fields, never the ticking odd.
type StoredSelection = Pick<Selection, 'id' | 'league' | 'match' | 'market' | 'pick' | 'baseOdd'>

interface BetSlipValue {
  selections: Selection[]
  count: number
  isOpen: boolean
  open: () => void
  close: () => void
  has: (id: string) => boolean
  toggle: (sel: Omit<Selection, 'odd' | 'dir' | 'locked'>) => void
  remove: (id: string) => void
  clear: () => void
}

const BetSlipContext = createContext<BetSlipValue>({
  selections: [], count: 0, isOpen: false,
  open: () => {}, close: () => {}, has: () => false,
  toggle: () => {}, remove: () => {}, clear: () => {},
})

export function useBetSlip() {
  return useContext(BetSlipContext)
}

const STORAGE_KEY = 'bta_betslip'

// Seed a realistic slip so the engine is demonstrable on first open:
// a single match (each row in Tekli) and a 4-match parlay (Kombine).
const demoSelections: StoredSelection[] = [
  { id: 'gs-fb-ms1',   league: 'Türkiye. Süper Lig',    match: 'Galatasaray - Fenerbahçe', market: 'Maç Sonucu',      pick: '1',       baseOdd: 2.10 },
  { id: 'rm-bar-ust',  league: 'İspanya. La Liga',      match: 'Real Madrid - Barcelona',  market: 'Toplam Gol',      pick: 'Üst 2.5', baseOdd: 1.75 },
  { id: 'ars-che-kg',  league: 'İngiltere. Premier Ligi', match: 'Arsenal - Chelsea',      market: 'Karşılıklı Gol',  pick: 'Var',     baseOdd: 1.65 },
  { id: 'bay-dor-ms1', league: 'Almanya. Bundesliga',   match: 'Bayern - Dortmund',        market: 'Maç Sonucu',      pick: '1',       baseOdd: 1.50 },
]

function hydrate(stored: StoredSelection[]): Selection[] {
  return stored.map(s => ({ ...s, odd: s.baseOdd, dir: null, locked: false }))
}

export default function BetSlipProvider({ children }: { children: React.ReactNode }) {
  const [selections, setSelections] = useState<Selection[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Restore persisted slip after mount (or seed the demo on first ever load).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw !== null) {
        setSelections(hydrate(JSON.parse(raw) as StoredSelection[]))
      } else {
        setSelections(hydrate(demoSelections))
      }
    } catch {
      setSelections(hydrate(demoSelections))
    }
    setLoaded(true)
  }, [])

  // Persist only the stable fields — never the live-ticking odd/dir/locked.
  useEffect(() => {
    if (!loaded) return
    try {
      const stored: StoredSelection[] = selections.map(({ id, league, match, market, pick, baseOdd }) =>
        ({ id, league, match, market, pick, baseOdd }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {}
  }, [selections, loaded])

  // ── Live-odds engine ──
  // Only ticks while the slip is open; cleaned up on close/unmount.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (!isOpen) return
    timer.current = setInterval(() => {
      setSelections(prev => prev.map(s => {
        // Locked markets have a chance to re-open; otherwise stay suspended.
        if (s.locked) {
          return Math.random() < 0.4 ? { ...s, locked: false, dir: null } : s
        }
        // Small chance a market suspends.
        if (Math.random() < 0.08) {
          return { ...s, locked: true, dir: null }
        }
        // Otherwise, maybe drift the odd up or down a notch.
        if (Math.random() < 0.55) {
          const step = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 6) + 1) / 100
          const next = Math.max(1.01, Math.round((s.odd + step) * 100) / 100)
          if (next === s.odd) return { ...s, dir: null }
          return { ...s, odd: next, dir: next > s.odd ? 'up' : 'down' }
        }
        return { ...s, dir: null }
      }))
    }, 2500)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [isOpen])

  const has = useCallback((id: string) => selections.some(s => s.id === id), [selections])

  const toggle = useCallback((sel: Omit<Selection, 'odd' | 'dir' | 'locked'>) => {
    setSelections(prev => prev.some(s => s.id === sel.id)
      ? prev.filter(s => s.id !== sel.id)
      : [...prev, { ...sel, odd: sel.baseOdd, dir: null, locked: false }])
  }, [])

  const remove = useCallback((id: string) => {
    setSelections(prev => prev.filter(s => s.id !== id))
  }, [])

  const clear = useCallback(() => setSelections([]), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <BetSlipContext.Provider value={{
      selections, count: selections.length, isOpen,
      open, close, has, toggle, remove, clear,
    }}>
      {children}
    </BetSlipContext.Provider>
  )
}
