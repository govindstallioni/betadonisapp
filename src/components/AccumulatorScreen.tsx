'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { liveAccumulators, prematchAccumulators, SportIcon, SmallSportIcon, type Accumulator } from './accumulatorData'

type Tab = 'live' | 'prematch'

function isTab(v: string | null): v is Tab {
  return v === 'live' || v === 'prematch'
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

function AccumulatorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab')
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : 'live')
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

export default function AccumulatorScreen() {
  return (
    <Suspense fallback={<div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen" />}>
      <AccumulatorContent />
    </Suspense>
  )
}
