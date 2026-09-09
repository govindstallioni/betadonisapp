import type { ReactNode } from 'react'

// Shared "Günün Kombinesi" data — used by AccumulatorScreen (/kupon/accumulator)
// and the homepage "Bugünün Kombinesi" teaser rails.

export type AccMatch = {
  league: string
  name: string
  status: string
  betType: string
  odd: string
  isBonus?: boolean
}

export type Accumulator = {
  id: number
  name: string
  events: number
  odds: number
  sports: string[]
  matches: AccMatch[]
}

const liveMatches1: AccMatch[] = [
  { league: 'Güney Kore. WK-Ligi', name: 'Hyundai Steel Red Angels (K) - Sejong Sportstoto (K)', status: 'devre arası (0-0)', betType: 'Normal süre, 1X2: W1', odd: '1.96' },
  { league: 'Güney Kore. WK-Ligi', name: 'Suwon (K) - Gangjin Swans (K)', status: 'devre arası (0-2)', betType: 'Normal süre, Toplam: Üst (3.5)', odd: '2.01' },
  { league: 'Güney Kore. K3 Ligi', name: 'Gangneung City - Gyeongju KHNP', status: '2. yarı (1-0)', betType: 'Normal süre, 1X2: W1', odd: '1.56' },
  { league: '', name: 'Bonus', status: '', betType: 'Oran', odd: '1.1', isBonus: true },
]

const liveMatches2: AccMatch[] = [
  { league: 'Rusya. 3. Lig. Sibirya', name: 'Baikal Irkutsk - Temp Barnaul', status: 'devre arası (1-1)', betType: 'Normal süre, 1X2: W2', odd: '1.72' },
  { league: 'Rusya. FNL 2', name: 'Metallurg Lipetsk - Enisey', status: '2. yarı (0-0)', betType: 'Normal süre, 1X2: W1', odd: '2.34' },
  { league: 'Brezilya. Série B', name: 'Botafogo SP - Coritiba', status: '2. yarı (1-0)', betType: 'Normal süre, 1X2: W1', odd: '1.85' },
  { league: '', name: 'Bonus', status: '', betType: 'Oran', odd: '1.1', isBonus: true },
]

const prematchMatches1: AccMatch[] = [
  { league: 'Türkiye. Süper Lig', name: 'Galatasaray - Fenerbahçe', status: '20.05.26 20:00', betType: 'Normal süre, 1X2: W1', odd: '2.35' },
  { league: 'İngiltere. Premier Ligi', name: 'Arsenal - Chelsea', status: '20.05.26 21:00', betType: 'Normal süre, 1X2: W1', odd: '1.85' },
  { league: 'İspanya. La Liga', name: 'Real Madrid - Barcelona', status: '21.05.26 22:00', betType: 'Normal süre, 1X2: W1', odd: '2.10' },
  { league: '', name: 'Bonus', status: '', betType: 'Oran', odd: '1.1', isBonus: true },
]

export const liveAccumulators: Accumulator[] = [
  { id: 1, name: 'Kombine CANLI 1', events: 4, odds: 6.76,  sports: ['⚽','⚽','⚽','%'], matches: liveMatches1 },
  { id: 2, name: 'Kombine CANLI 2', events: 4, odds: 5.701, sports: ['⚽','🏀','🎾','%'], matches: liveMatches2 },
]

export const prematchAccumulators: Accumulator[] = [
  { id: 1,  name: 'Kombine Maç Öncesi 1',  events: 5, odds: 8.217, sports: ['⚽','⚽','⚽','⚽','%'], matches: prematchMatches1 },
  { id: 2,  name: 'Kombine Maç Öncesi 2',  events: 5, odds: 7.994, sports: ['⚽','⚽','⚽','⚽','%'], matches: prematchMatches1 },
  { id: 3,  name: 'Kombine Maç Öncesi 3',  events: 6, odds: 7.314, sports: ['⚽','⚽','⚽','⚽','⚽','%'], matches: prematchMatches1 },
  { id: 4,  name: 'Kombine Maç Öncesi 4',  events: 5, odds: 5.744, sports: ['⚽','⚽','⚽','⚽','%'], matches: prematchMatches1 },
  { id: 5,  name: 'Kombine Maç Öncesi 5',  events: 4, odds: 2.761, sports: ['⚽','⚽','⚽','%'], matches: prematchMatches1 },
  { id: 6,  name: 'Kombine Maç Öncesi 6',  events: 6, odds: 8.270, sports: ['🏀','⚽','🎾','🎮','🎮','%'], matches: prematchMatches1 },
  { id: 7,  name: 'Kombine Maç Öncesi 7',  events: 6, odds: 6.805, sports: ['⚽','🎮','⚽','⚽','⚽','%'], matches: prematchMatches1 },
  { id: 8,  name: 'Kombine Maç Öncesi 8',  events: 5, odds: 9.091, sports: ['🏀','🏀','🏀','⚽','%'], matches: prematchMatches1 },
  { id: 9,  name: 'Kombine Maç Öncesi 9',  events: 5, odds: 6.887, sports: ['🎾','⚽','🎾','⚽','%'], matches: prematchMatches1 },
  { id: 10, name: 'Kombine Maç Öncesi 10', events: 5, odds: 7.467, sports: ['🏀','🎮','🎮','🎮','%'], matches: prematchMatches1 },
  { id: 11, name: 'Kombine Maç Öncesi 11', events: 6, odds: 7.372, sports: ['🏀','⚽','⚽','🎾','⚽','%'], matches: prematchMatches1 },
  { id: 12, name: 'Kombine Maç Öncesi 12', events: 5, odds: 5.110, sports: ['⚽','⚽','🏀','⚽','%'], matches: prematchMatches1 },
]

export const sportSvgs: Record<string, ReactNode> = {
  '⚽': <svg width="14" height="14" viewBox="0 0 512 512" fill="#0E8FCF"><path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z" /></svg>,
  '🏀': <svg width="14" height="14" viewBox="0 0 32 32" fill="#0E8FCF"><path d="M30.06 15h0c.3 0 .6 0 .9 0a14.82 14.82 0 0 0-3.68-8.82l-5.72 5.72A13 13 0 0 0 30.06 15zM20.17 10.41l5.72-5.72A14.82 14.82 0 0 0 17.07 1c0 .31 0 .62 0 .93A13 13 0 0 0 20.17 10.41zM11.84 18.74L14.58 16 4.68 6.11A14.82 14.82 0 0 0 1 15.05c.32 0 .65 0 1 0A15 15 0 0 1 11.84 18.74zM30.06 17a15 15 0 0 1-9.89-3.73L17.42 16l9.89 9.9a15 15 0 0 0 3.69-9c-.3 0-.61.05-.91.05zM2 17c-.32 0-.64 0-1 0A15 15 0 0 0 4.68 25.9l5.74-5.74A13 13 0 0 0 2 17zM25.89 27.32L16 17.42l-2.74 2.74A15 15 0 0 1 17 30c0 .33 0 .66 0 1A14.82 14.82 0 0 0 25.89 27.32zM11.84 21.58L6.1 27.32A15 15 0 0 0 14.94 31c0-.32.05-.64.05-1A13 13 0 0 0 11.84 21.58zM6.1 4.69L16 14.58l2.75-2.75A15 15 0 0 1 15 1.94c0-.31 0-.63.05-.94A15 15 0 0 0 6.1 4.69z" /></svg>,
  '🎾': <svg width="14" height="14" viewBox="0 0 100 100" fill="#0E8FCF"><path d="M9.2 98c1.9 0 3.7-.8 5.1-2.1l22.2-22.2c.1-.1.2-.2.4-.5.9-1.3.8-3-.4-4.1l-5.6-5.6c-1.1-1.1-2.8-1.2-4.1-.4-.2.1-.4.3-.5.4L4.1 85.7C2.8 87 2 88.8 2 90.8c0 1.9.8 3.7 2.1 5.1C5.5 97.2 7.3 98 9.2 98zm61.1-79.4-7.5-7.5c-3.6 1.6-7.1 3.9-10.3 6.9l9.2 9.2 8.6-8.6zM53.1 38.7l8.6 8.5 8.6-8.7-8.5-8.5zM60.4 28.6l-9.2-9.2c-3 3.2-5.4 6.8-7 10.5l7.4 7.3 8.8-8.6zM80.1 28.4 71.7 20l-8.5 8.6 8.5 8.5zM81.5 27l8.5-8.7c-.8-1.9-1.9-3.6-3.3-5s-3.1-2.5-5-3.3l-8.6 8.6 8.4 8.4zm-8.4 11.5 8.9 8.9c2.9-3.1 5.3-6.6 6.9-10.3l-7.3-7.3-8.5 8.7zm-9.9 10.1 7.2 7.1c3.7-1.6 7.2-3.9 10.3-6.9l-8.9-8.9-8.6 8.7zM90.9 9.1c-11-11-30.8-9-44.2 4.4-7.3 7.3-11.5 16.8-11.5 26 0 4.5-1 8.4-2.8 11.8l-5 9.3c.4-.1.8-.1 1.3-.1 1.4 0 2.7.5 3.7 1.5l5.6 5.6c1.3 1.3 1.8 3.2 1.4 4.9l9.3-5c3.4-1.8 7.4-2.8 11.8-2.8 4.6 0 9.3-1.1 13.8-3 4.5-2 8.6-4.8 12.3-8.5C99.9 39.8 101.9 20 90.9 9.1z" /></svg>,
  '🎮': <img src="/icons/digerleri.svg" width={14} height={14} style={{ objectFit: 'contain' }} alt="Sanal Bahis" />,
  '🏒': <svg width="14" height="14" viewBox="0 0 48 48" fill="#0E8FCF"><ellipse cx="23.756" cy="42.595" rx="5.351" ry="1.531" /><path d="M29.11 44.67v1.44c0 .63-2.4 1.14-5.35 1.14s-5.35-.51-5.35-1.14V44.67a13.156 13.156 0 0 0 5.35.96A13.21 13.21 0 0 0 29.11 44.67zM23.13 24.54c-.82 1.35-1.34 2.2-1.54 2.48-.01.01-.01.02-.02.03C16.56 18.87 9.53 6.41 7.41 2.64A1.27 1.27 0 0 1 9.62 1.39C11.85 5.24 19.38 18.25 23.13 24.54zM40.094.907a1.274 1.274 0 0 0-1.715.479C35.536 6.3 24.079 26.1 22.821 27.884a15.575 15.575 0 0 1-5.158 4.778.738.738 0 0 1 .071.133l1.222 4.015A16.792 16.792 0 0 0 21.9 33.922c3.254-3.947 15.74-26.03 18.691-31.277A1.27 1.27 0 0 0 40.094.907z" /></svg>,
}

export function SportIcon({ emoji }: { emoji: string }) {
  if (emoji === '%') return (
    <div className="w-[20px] h-[20px] rounded-full border border-[#0E8FCF]/40 flex items-center justify-center flex-shrink-0">
      <span className="text-[9px] font-bold text-[#0E8FCF]">%</span>
    </div>
  )
  return (
    <div className="w-[22px] h-[22px] rounded-full bg-[#edf5ff] border border-[#d0e8f8] flex items-center justify-center flex-shrink-0">
      {sportSvgs[emoji] ?? <span className="text-[10px]">{emoji}</span>}
    </div>
  )
}

export function SmallSportIcon() {
  return (
    <div className="w-[16px] h-[16px] rounded-full bg-[#edf5ff] border border-[#d0e8f8] flex items-center justify-center flex-shrink-0">
      {sportSvgs['⚽']}
    </div>
  )
}
