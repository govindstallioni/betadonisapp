'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MatchCard from './MatchCard'
import { liveMatches, liveSportCats } from '@/data/liveData'

// ── Sport-strip icons (blue glyphs, one per liveSportCats label) ────────────
const sportIcons: Record<string, React.ReactNode> = {
  Futbol: <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor"><path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z" /></svg>,
  Basketbol: <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path d="M30.06 15c.3 0 .6 0 .9 0a14.82 14.82 0 0 0-3.68-8.82l-5.72 5.72A13 13 0 0 0 30.06 15zM20.17 10.41l5.72-5.72A14.82 14.82 0 0 0 17.07 1c0 .31 0 .62 0 .93A13 13 0 0 0 20.17 10.41zM11.84 18.74L14.58 16 4.68 6.11A14.82 14.82 0 0 0 1 15.05c.32 0 .65 0 1 0A15 15 0 0 1 11.84 18.74zM30.06 17a15 15 0 0 1-9.89-3.73L17.42 16l9.89 9.9a15 15 0 0 0 3.69-9c-.3 0-.61.05-.91.05zM2 17c-.32 0-.64 0-1 0A15 15 0 0 0 4.68 25.9l5.74-5.74A13 13 0 0 0 2 17zM25.89 27.32L16 17.42l-2.74 2.74A15 15 0 0 1 17 30c0 .33 0 .66 0 1A14.82 14.82 0 0 0 25.89 27.32zM11.84 21.58L6.1 27.32A15 15 0 0 0 14.94 31c0-.32.05-.64.05-1A13 13 0 0 0 11.84 21.58zM6.1 4.69L16 14.58l2.75-2.75A15 15 0 0 1 15 1.94c0-.31 0-.63.05-.94A15 15 0 0 0 6.1 4.69z" /></svg>,
  Tenis: <svg width="20" height="20" viewBox="0 0 100 100" fill="currentColor"><path d="M9.2 98c1.9 0 3.7-.8 5.1-2.1l22.2-22.2c.9-1.3.8-3-.4-4.1l-5.6-5.6c-1.1-1.1-2.8-1.2-4.1-.4L4.1 85.7C2.8 87 2 88.8 2 90.8c0 1.9.8 3.7 2.1 5.1C5.5 97.2 7.3 98 9.2 98zm81.7-88.9c-11-11-30.8-9-44.2 4.4-7.3 7.3-11.5 16.8-11.5 26 0 4.5-1 8.4-2.8 11.8l-5 9.3c1.4 0 2.7.5 3.7 1.5l5.6 5.6c1.3 1.3 1.8 3.2 1.4 4.9l9.3-5c3.4-1.8 7.4-2.8 11.8-2.8 4.6 0 9.3-1.1 13.8-3 4.5-2 8.6-4.8 12.3-8.5C99.9 39.8 101.9 20 90.9 9.1z" /></svg>,
  Voleybol: <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor"><path d="M256.07 0C114.467 0-.326 114.793-.326 256.396s114.793 256.395 256.396 256.395 256.395-114.792 256.395-256.395S397.673 0 256.07 0zm210.597 224.064c-19.353 12.05-40.515 20.917-62.677 26.261-4.595-68.333-27.183-134.234-65.472-191.019C406.956 88.198 455.48 150.56 466.667 224.064zM256 42.667c5.397 0 10.667.405 15.979.811 53.223 58.444 84.842 133.342 89.6 212.245-29.153.997-58.199-4.013-85.333-14.72-4.247-72.136-38.705-139.14-94.912-184.555C205.188 47.391 230.484 42.722 256 42.667z" /></svg>,
  'Buz Hokeyi': <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor"><ellipse cx="23.756" cy="42.595" rx="5.351" ry="1.531" /><path d="M23.13 24.54c-.82 1.35-1.34 2.2-1.54 2.48C16.56 18.87 9.53 6.41 7.41 2.64A1.27 1.27 0 0 1 9.62 1.39C11.85 5.24 19.38 18.25 23.13 24.54zM40.094.907a1.274 1.274 0 0 0-1.715.479C35.536 6.3 24.079 26.1 22.821 27.884a15.575 15.575 0 0 1-5.158 4.778l1.222 4.015A16.792 16.792 0 0 0 21.9 33.922c3.254-3.947 15.74-26.03 18.691-31.277A1.27 1.27 0 0 0 40.094.907z" /></svg>,
  'Masa Tenisi': <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor"><path d="M43.89 27.24a4 4 0 1 0-.13 5.66A4 4 0 0 0 43.89 27.24z" /><path d="M37.39 33.46a5 5 0 0 1 7-7.11 19 19 0 0 0 1.68-9.49A16 16 0 0 0 31 1.92c-5.85-.5-11.49 1.79-16.3 6.6a17.39 17.39 0 0 0-3.28 4.6L34.89 36.56a17.58 17.58 0 0 0 3.53-2.3A5 5 0 0 1 37.39 33.46zM32.9 37.4L10.62 15.12a17.65 17.65 0 0 0-.67 2.5L30.4 38.07A17.64 17.64 0 0 0 32.9 37.4zM9.65 20.15a17.43 17.43 0 0 0 1 6.8 3.92 3.92 0 0 1-.85 4.17L3.39 37.55a3.95 3.95 0 0 0 0 5.58l1.49 1.49a4 4 0 0 0 5.58 0l6.44-6.44a3.92 3.92 0 0 1 4.17-.85 17.42 17.42 0 0 0 6.8 1z" /></svg>,
}

// Popular-league shortcut chips (filter by league substring; 'Tümü' = all).
const shortcuts = ['Tümü', 'Süper Lig', 'Premier Lig', 'La Liga', 'Bundesliga', 'Serie A', 'NBA']

export default function CanliBahisScreen() {
  const router = useRouter()
  const [activeSport, setActiveSport] = useState('Tümü')
  const [shortcut, setShortcut] = useState('Tümü')
  const [streamOnly, setStreamOnly] = useState(false)
  const [twoCol, setTwoCol] = useState(false)

  const matches = liveMatches.filter((m) => {
    if (activeSport !== 'Tümü' && m.sport !== activeSport) return false
    if (shortcut !== 'Tümü' && !m.league.includes(shortcut)) return false
    if (streamOnly && !m.hasStream) return false
    return true
  })

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen pb-24">

      {/* ── Header ── */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="text-[16px] font-bold text-[#1a2332]">CANLI BAHİS</h1>
          <div className="flex items-center gap-[2px]">
            <button onClick={() => router.push('/search')} className="w-9 h-9 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </button>
            {/* Live-broadcast toggle */}
            <button
              onClick={() => setStreamOnly((v) => !v)}
              aria-pressed={streamOnly}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${streamOnly ? 'bg-[#0E8FCF]' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={streamOnly ? '#fff' : '#1a2332'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sport-category strip */}
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-3 pb-2">
          {[{ label: 'Tümü', count: liveMatches.length }, ...liveSportCats].map((s) => {
            const active = activeSport === s.label
            return (
              <button
                key={s.label}
                onClick={() => setActiveSport(s.label)}
                className={`flex flex-col items-center gap-[3px] flex-shrink-0 min-w-[58px] py-[6px] px-1 rounded-xl transition-colors ${active ? 'bg-[#edf5ff]' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#0E8FCF]'}`}>
                  {s.label === 'Tümü' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
                  ) : sportIcons[s.label]}
                </div>
                <span className={`text-[9px] font-semibold leading-none whitespace-nowrap ${active ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{s.label}</span>
                <span className="text-[8px] text-[#94a3b8] leading-none">{s.count}</span>
              </button>
            )
          })}
        </div>

        {/* Shortcut chips */}
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-3 pb-2 border-t border-[#f0f2f5] pt-2">
          {shortcuts.map((s) => (
            <button
              key={s}
              onClick={() => setShortcut(s)}
              className={`flex-shrink-0 px-[12px] py-[5px] rounded-full text-[10px] font-semibold transition-all ${shortcut === s ? 'bg-[#0E8FCF] text-white shadow-sm' : 'bg-white text-[#1a2332] border border-[#e8ecf1]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Count + layout toggle ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-[#e74c3c] animate-pulse-dot" />
          <span className="text-[12px] font-bold text-[#1a2332]">Canlı Etkinlikler</span>
          <span className="text-[10px] text-[#737B8C] font-semibold">{matches.length}</span>
        </div>
        <div className="flex items-center bg-white rounded-full border border-[#e8ecf1] p-[2px]">
          <button onClick={() => setTwoCol(false)} aria-label="Tek sütun" className={`w-7 h-7 rounded-full flex items-center justify-center ${!twoCol ? 'bg-[#0E8FCF]' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={!twoCol ? '#fff' : '#737B8C'} strokeWidth="2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
          </button>
          <button onClick={() => setTwoCol(true)} aria-label="İki sütun" className={`w-7 h-7 rounded-full flex items-center justify-center ${twoCol ? 'bg-[#0E8FCF]' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={twoCol ? '#fff' : '#737B8C'} strokeWidth="2" strokeLinecap="round"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>
          </button>
        </div>
      </div>

      {/* ── Match list ── */}
      <div className="px-3">
        {matches.length === 0 ? (
          <div className="bg-white rounded-xl py-10 text-center border border-[#e8ecf1]">
            <p className="text-[12px] text-[#94a3b8]">Bu filtreyle canlı etkinlik yok.</p>
          </div>
        ) : (
          <div className={twoCol ? 'grid grid-cols-2 gap-[8px]' : 'flex flex-col gap-[10px]'}>
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} compact={twoCol} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
