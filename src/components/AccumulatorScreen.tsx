'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'live' | 'prematch'

type AccMatch = {
  league: string
  name: string
  status: string
  betType: string
  odd: string
  isBonus?: boolean
}

type Accumulator = {
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

const liveAccumulators: Accumulator[] = [
  { id: 1, name: 'Kombine CANLI 1', events: 4, odds: 6.76,  sports: ['⚽','⚽','⚽','%'], matches: liveMatches1 },
  { id: 2, name: 'Kombine CANLI 2', events: 4, odds: 5.701, sports: ['⚽','🏀','🎾','%'], matches: liveMatches2 },
]

const prematchAccumulators: Accumulator[] = [
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

const sportSvgs: Record<string, ReactNode> = {
  '⚽': <svg width="14" height="14" viewBox="0 0 512 512" fill="#0E8FCF"><path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z"/></svg>,
  '🏀': <svg width="14" height="14" viewBox="0 0 32 32" fill="#0E8FCF"><path d="M30.06 15h0c.3 0 .6 0 .9 0a14.82 14.82 0 0 0-3.68-8.82l-5.72 5.72A13 13 0 0 0 30.06 15zM20.17 10.41l5.72-5.72A14.82 14.82 0 0 0 17.07 1c0 .31 0 .62 0 .93A13 13 0 0 0 20.17 10.41zM11.84 18.74L14.58 16 4.68 6.11A14.82 14.82 0 0 0 1 15.05c.32 0 .65 0 1 0A15 15 0 0 1 11.84 18.74zM30.06 17a15 15 0 0 1-9.89-3.73L17.42 16l9.89 9.9a15 15 0 0 0 3.69-9c-.3 0-.61.05-.91.05zM2 17c-.32 0-.64 0-1 0A15 15 0 0 0 4.68 25.9l5.74-5.74A13 13 0 0 0 2 17zM25.89 27.32L16 17.42l-2.74 2.74A15 15 0 0 1 17 30c0 .33 0 .66 0 1A14.82 14.82 0 0 0 25.89 27.32zM11.84 21.58L6.1 27.32A15 15 0 0 0 14.94 31c0-.32.05-.64.05-1A13 13 0 0 0 11.84 21.58zM6.1 4.69L16 14.58l2.75-2.75A15 15 0 0 1 15 1.94c0-.31 0-.63.05-.94A15 15 0 0 0 6.1 4.69z"/></svg>,
  '🎾': <svg width="14" height="14" viewBox="0 0 100 100" fill="#0E8FCF"><path d="M9.2 98c1.9 0 3.7-.8 5.1-2.1l22.2-22.2c.1-.1.2-.2.4-.5.9-1.3.8-3-.4-4.1l-5.6-5.6c-1.1-1.1-2.8-1.2-4.1-.4-.2.1-.4.3-.5.4L4.1 85.7C2.8 87 2 88.8 2 90.8c0 1.9.8 3.7 2.1 5.1C5.5 97.2 7.3 98 9.2 98zm61.1-79.4-7.5-7.5c-3.6 1.6-7.1 3.9-10.3 6.9l9.2 9.2 8.6-8.6zM53.1 38.7l8.6 8.5 8.6-8.7-8.5-8.5zM60.4 28.6l-9.2-9.2c-3 3.2-5.4 6.8-7 10.5l7.4 7.3 8.8-8.6zM80.1 28.4 71.7 20l-8.5 8.6 8.5 8.5zM81.5 27l8.5-8.7c-.8-1.9-1.9-3.6-3.3-5s-3.1-2.5-5-3.3l-8.6 8.6 8.4 8.4zm-8.4 11.5 8.9 8.9c2.9-3.1 5.3-6.6 6.9-10.3l-7.3-7.3-8.5 8.7zm-9.9 10.1 7.2 7.1c3.7-1.6 7.2-3.9 10.3-6.9l-8.9-8.9-8.6 8.7zM90.9 9.1c-11-11-30.8-9-44.2 4.4-7.3 7.3-11.5 16.8-11.5 26 0 4.5-1 8.4-2.8 11.8l-5 9.3c.4-.1.8-.1 1.3-.1 1.4 0 2.7.5 3.7 1.5l5.6 5.6c1.3 1.3 1.8 3.2 1.4 4.9l9.3-5c3.4-1.8 7.4-2.8 11.8-2.8 4.6 0 9.3-1.1 13.8-3 4.5-2 8.6-4.8 12.3-8.5C99.9 39.8 101.9 20 90.9 9.1z"/></svg>,
  '🎮': <img src="/icons/digerleri.svg" width={14} height={14} style={{ objectFit: 'contain' }} alt="Sanal Bahis" />,
  '🏒': <svg width="14" height="14" viewBox="0 0 48 48" fill="#0E8FCF"><ellipse cx="23.756" cy="42.595" rx="5.351" ry="1.531"/><path d="M29.11 44.67v1.44c0 .63-2.4 1.14-5.35 1.14s-5.35-.51-5.35-1.14V44.67a13.156 13.156 0 0 0 5.35.96A13.21 13.21 0 0 0 29.11 44.67zM23.13 24.54c-.82 1.35-1.34 2.2-1.54 2.48-.01.01-.01.02-.02.03C16.56 18.87 9.53 6.41 7.41 2.64A1.27 1.27 0 0 1 9.62 1.39C11.85 5.24 19.38 18.25 23.13 24.54zM40.094.907a1.274 1.274 0 0 0-1.715.479C35.536 6.3 24.079 26.1 22.821 27.884a15.575 15.575 0 0 1-5.158 4.778.738.738 0 0 1 .071.133l1.222 4.015A16.792 16.792 0 0 0 21.9 33.922c3.254-3.947 15.74-26.03 18.691-31.277A1.27 1.27 0 0 0 40.094.907z"/></svg>,
}

function SportIcon({ emoji }: { emoji: string }) {
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

function SmallSportIcon() {
  return (
    <div className="w-[16px] h-[16px] rounded-full bg-[#edf5ff] border border-[#d0e8f8] flex items-center justify-center flex-shrink-0">
      {sportSvgs['⚽']}
    </div>
  )
}

function AccumulatorCard({ item, open, onToggle }: { item: Accumulator; open: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-sm">
      {/* Header row — full row is clickable */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center px-3 py-[10px] text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[3px] mb-[5px]">
            {item.sports.map((s, i) => <SportIcon key={i} emoji={s} />)}
          </div>
          <span className="text-[11px] font-bold text-[#1a2332]">{item.name}</span>
        </div>
        <div className="flex items-center gap-[10px] flex-shrink-0 ml-3">
          <div className="text-right">
            <p className="text-[10px] text-[#737B8C]">Etkinlikler: <span className="font-medium text-[#1a2332]">{item.events}</span></p>
            <p className="text-[10px] text-[#737B8C]">Oran: <span className="text-[11px] font-medium text-[#1a2332]">{item.odds.toFixed(3)}</span></p>
          </div>
          <div className="w-[28px] h-[28px] rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 border border-[#e8ecf1]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded matches */}
      {open && (
        <div className="border-t border-[#f0f4f8]">
          {item.matches.map((m, i) => (
            <div key={i} className={`px-3 py-[10px] ${i < item.matches.length - 1 ? 'border-b border-[#f4f6f9]' : ''}`}>
              {m.isBonus ? (
                /* Bonus row */
                <>
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <div className="w-[16px] h-[16px] rounded-full border border-[#0E8FCF]/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-bold text-[#0E8FCF]">%</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#1a2332]">Bonus</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#f4f7fb] rounded-[8px] px-3 py-[8px]">
                    <span className="text-[11px] text-[#737B8C]">{m.betType}</span>
                    <span className="text-[11px] font-bold text-[#1a2332] tabular-nums">{m.odd}</span>
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-[8px] mt-[10px]">
                    <button type="button" className="flex-1 py-[10px] rounded-xl text-[12px] font-semibold text-[#0E8FCF] bg-[#dce8f5] border border-[#b8d4ec]">
                      Kupona Ekle
                    </button>
                    <button type="button" className="flex-1 py-[10px] rounded-xl text-[12px] font-semibold text-white bg-[#0E8FCF]">
                      Bahis Yap
                    </button>
                  </div>
                </>
              ) : (
                /* Match row */
                <>
                  <div className="flex items-center gap-[5px] mb-[3px]">
                    <SmallSportIcon />
                    <span className="text-[10px] text-[#737B8C] truncate">{m.league}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-[#1a2332] mb-[3px] leading-tight">{m.name}</p>
                  <p className="text-[10px] text-[#94a3b8] mb-[6px]">{m.status}</p>
                  <div className="flex items-center justify-between bg-[#f4f7fb] rounded-[8px] px-3 py-[7px]">
                    <span className="text-[10px] text-[#737B8C]">{m.betType}</span>
                    <span className="text-[11px] font-bold text-[#1a2332] tabular-nums">{m.odd}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AccumulatorScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('live')
  const [openIds, setOpenIds] = useState<Set<number>>(new Set())

  const list = tab === 'live' ? liveAccumulators : prematchAccumulators
  const allExpanded = list.every(item => openIds.has(item.id))

  function toggleAll() {
    if (allExpanded) {
      setOpenIds(new Set())
    } else {
      setOpenIds(new Set(list.map(i => i.id)))
    }
  }

  function toggleOne(id: number) {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Reset open state when tab changes
  function handleTabChange(t: Tab) {
    setTab(t)
    setOpenIds(new Set())
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] flex items-center">
        <button type="button" onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Günün Kombinesi</h1>
        {/* Expand / Collapse all */}
        <button type="button" onClick={toggleAll} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={allExpanded ? '#0E8FCF' : '#1a2332'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="4" rx="1"/>
            <rect x="2" y="10" width="20" height="4" rx="1"/>
            <rect x="2" y="17" width="20" height="4" rx="1"/>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 pb-3">
        <div className="bg-[#dce8f5] rounded-full p-[3px] flex">
          {(['live', 'prematch'] as Tab[]).map(t => (
            <button key={t} type="button" onClick={() => handleTabChange(t)}
              className={`flex-1 py-[8px] rounded-full text-[12px] font-semibold transition-all ${tab === t ? 'bg-[#0E8FCF] text-white shadow-sm' : 'text-[#0E8FCF]'}`}>
              {t === 'live' ? 'CANLI' : 'Maç Öncesi'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-3 pb-28 flex flex-col gap-[8px]">
        {list.map(item => (
          <AccumulatorCard
            key={item.id}
            item={item}
            open={openIds.has(item.id)}
            onToggle={() => toggleOne(item.id)}
          />
        ))}
      </div>
    </div>
  )
}
