'use client'

import { useState, useEffect, useRef } from 'react'
import { ALL_GAMES } from './slotGamesData'

// Shared "Mega Jackpot" data — the homepage widget (MegaJackpot.tsx) and its
// destination list (MegaJackpotScreen.tsx) both render these tier cards.
export const jackpots = [
  {
    label: 'CASINO',
    provider: 'AMUSNET',
    amount: 4429349,
    icon: '/megajackpot/icon01.png',
    gradient: 'linear-gradient(160deg, #FFB347 0%, #FF7A00 50%, #E85D00 100%)',
    shadow: 'rgba(255,122,0,0.3)',
  },
  {
    label: 'CASINO',
    provider: 'AMUSNET',
    amount: 666679,
    icon: '/megajackpot/icon02.png',
    gradient: 'linear-gradient(160deg, #38BDF8 0%, #0284C7 50%, #0054A6 100%)',
    shadow: 'rgba(2,132,199,0.3)',
  },
  {
    label: 'CASINO',
    provider: 'AMUSNET',
    amount: 5627,
    icon: '/megajackpot/icon03.png',
    gradient: 'linear-gradient(160deg, #4ADE80 0%, #16A34A 50%, #166534 100%)',
    shadow: 'rgba(22,163,74,0.3)',
  },
  {
    label: 'CASINO',
    provider: 'AMUSNET',
    amount: 1400,
    icon: '/megajackpot/icon04.png',
    gradient: 'linear-gradient(160deg, #CBD5E1 0%, #94A3B8 50%, #64748B 100%)',
    shadow: 'rgba(100,116,139,0.3)',
  },
]

export function AnimatedAmount({ target }: { target: number }) {
  const [val, setVal] = useState(target)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    ref.current = setInterval(() => {
      setVal(p => p + Math.floor(Math.random() * 3) + 1)
    }, 200)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])
  return <>{val.toLocaleString('tr-TR')}</>
}

// The spec asks specifically for "jackpot slot games from Pragmatic provider
// with an example prize pool" — reuse the real Pragmatic Play games already
// in slotGamesData.ts rather than inventing new ones, deduped by name.
function hashPool(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return 10000 + (hash % 490000)
}

const seen = new Set<string>()
export const jackpotGames = ALL_GAMES
  .filter(g => g.provider === 'Pragmatic Play')
  .filter(g => (seen.has(g.name) ? false : (seen.add(g.name), true)))
  .map(g => ({ name: g.name, image: g.image, provider: g.provider, pool: hashPool(g.name) }))
