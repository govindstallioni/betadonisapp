'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Tournament = {
  id: number
  name: string
  flag: string
  count: number
  isHot?: boolean
  sub?: Tournament[]
}

const footballTournaments: Tournament[] = [
  { id: 1,  name: 'Türkiye. Süper Ligi',                    flag: '🇹🇷', count: 5, isHot: true },
  { id: 2,  name: 'Türkiye. 1. Lig',                        flag: '🇹🇷', count: 3 },
  { id: 3,  name: 'England. Premier League',                 flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 4, isHot: true },
  { id: 4,  name: 'Spain. La Liga',                         flag: '🇪🇸', count: 3, isHot: true },
  { id: 5,  name: 'Germany. Bundesliga',                    flag: '🇩🇪', count: 2 },
  { id: 6,  name: 'Italy. Serie A',                         flag: '🇮🇹', count: 3 },
  { id: 7,  name: 'France. Ligue 1',                        flag: '🇫🇷', count: 2 },
  { id: 8,  name: 'Indonesia. Super League',                flag: '🇮🇩', count: 1, isHot: true },
  { id: 9,  name: 'China. Second League',                   flag: '🇨🇳', count: 4 },
  { id: 10, name: 'Club Friendlies',                        flag: '🌍', count: 2 },
  { id: 11, name: 'Poland',                                 flag: '🇵🇱', count: 2,
    sub: [
      { id: 111, name: 'Poland. Ekstraklasa',               flag: '🇵🇱', count: 1 },
      { id: 112, name: 'Poland. I Liga',                    flag: '🇵🇱', count: 1 },
    ]},
  { id: 12, name: 'Algeria Championship U20',               flag: '🇩🇿', count: 1 },
  { id: 13, name: 'Ethiopia. Premier League. Women',        flag: '🇪🇹', count: 1 },
  { id: 14, name: 'India',                                  flag: '🇮🇳', count: 2,
    sub: [
      { id: 141, name: 'India. Delhi. Premier League',      flag: '🇮🇳', count: 1 },
      { id: 142, name: 'India. Sikkim Premier League',      flag: '🇮🇳', count: 1 },
    ]},
  { id: 15, name: '9x9. Vietnam. Thuyen Festival',         flag: '🇻🇳', count: 1, isHot: true },
  { id: 16, name: 'Russia. Far East Cup. Amateur',         flag: '🇷🇺', count: 1, isHot: true },
  { id: 17, name: 'Angola. Liga Bantu',                    flag: '🇦🇴', count: 1 },
  { id: 18, name: 'Kazakhstan',                            flag: '🇰🇿', count: 2,
    sub: [
      { id: 181, name: 'Kazakhstan. Premier League',        flag: '🇰🇿', count: 1 },
      { id: 182, name: 'Kazakhstan. First Division',        flag: '🇰🇿', count: 1 },
    ]},
]

const basketballTournaments: Tournament[] = [
  { id: 1, name: 'NBA',                    flag: '🇺🇸', count: 2, isHot: true },
  { id: 2, name: 'EuroLeague',             flag: '🌍', count: 1, isHot: true },
  { id: 3, name: 'Turkey. BSL',            flag: '🇹🇷', count: 1 },
]

const tenisTournaments: Tournament[] = [
  { id: 1, name: 'ATP. Wimbledon',         flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 18, isHot: true },
  { id: 2, name: 'WTA. Wimbledon',         flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 14, isHot: true },
  { id: 3, name: 'ATP. Challenger',        flag: '🌍', count: 8 },
  { id: 4, name: 'ITF. Men',               flag: '🌍', count: 7 },
]

const tournamentMap: Record<string, Tournament[]> = {
  'Futbol': footballTournaments,
  'Basketbol': basketballTournaments,
  'Tenis': tenisTournaments,
}

const prematchTournaments: Tournament[] = [
  { id: 101, name: 'Günün Özel Maçları',               flag: '🌍', count: 3 },
  { id: 102, name: 'Günün Maçları',                    flag: '🌍', count: 2 },
  { id: 103, name: 'Dünya Kupası 2026',                 flag: '🌍', count: 52, isHot: true },
  { id: 104, name: 'Dünya Kupası 2026. Günün Maçları',  flag: '🌍', count: 10 },
  { id: 105, name: 'UEFA Şampiyonlar Ligi',             flag: '🏆', count: 2,  isHot: true },
  { id: 106, name: 'UEFA Şampiyonlar Ligi. Şampiyon',   flag: '🏆', count: 3 },
  { id: 107, name: 'UEFA Avrupa Ligi',                  flag: '🏆', count: 3,  isHot: true },
  { id: 108, name: 'UEFA Avrupa Ligi. Takım - Oyuncu',  flag: '🏆', count: 6 },
  { id: 109, name: 'UEFA Avrupa Ligi. Şampiyon',        flag: '🏆', count: 3 },
  { id: 110, name: 'UEFA Avrupa Ligi. Özel Bahisler',   flag: '🏆', count: 2 },
  { id: 111, name: 'UEFA Konferans Ligi',               flag: '🏆', count: 3 },
  { id: 112, name: 'UEFA Konferans Ligi. Takım - Oyuncu',flag: '🏆', count: 8 },
  { id: 113, name: 'Türkiye. Süper Lig',               flag: '🇹🇷', count: 9, isHot: true },
  { id: 114, name: 'Türkiye. 1. Lig',                  flag: '🇹🇷', count: 6 },
  { id: 115, name: 'İngiltere. Premier Ligi',          flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 10, isHot: true },
  { id: 116, name: 'İspanya. La Liga',                 flag: '🇪🇸', count: 8 },
  { id: 117, name: 'Almanya. Bundesliga',              flag: '🇩🇪', count: 9 },
  { id: 118, name: 'İtalya. Serie A',                  flag: '🇮🇹', count: 10 },
  { id: 119, name: 'Fransa. Ligue 1',                  flag: '🇫🇷', count: 7 },
]

const timeFilters = ['Tümü', '30 dk', '1 saat', '2 saat', '6 saat', '12 saat', '24 saat']

const sportTabs = [
  { label: 'Futbol',     icon: <svg width="22" height="22" viewBox="0 0 512 512" fill="#0E8FCF"><path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z"/></svg> },
  { label: 'Basketbol',  icon: <svg width="22" height="22" viewBox="0 0 32 32" fill="#0E8FCF"><path d="M30.06 15c.3 0 .6 0 .9 0a14.82 14.82 0 0 0-3.68-8.82l-5.72 5.72A13 13 0 0 0 30.06 15zM20.17 10.41l5.72-5.72A14.82 14.82 0 0 0 17.07 1c0 .31 0 .62 0 .93A13 13 0 0 0 20.17 10.41zM11.84 18.74L14.58 16 4.68 6.11A14.82 14.82 0 0 0 1 15.05c.32 0 .65 0 1 0A15 15 0 0 1 11.84 18.74zM30.06 17a15 15 0 0 1-9.89-3.73L17.42 16l9.89 9.9a15 15 0 0 0 3.69-9c-.3 0-.61.05-.91.05zM2 17c-.32 0-.64 0-1 0A15 15 0 0 0 4.68 25.9l5.74-5.74A13 13 0 0 0 2 17zM25.89 27.32L16 17.42l-2.74 2.74A15 15 0 0 1 17 30c0 .33 0 .66 0 1A14.82 14.82 0 0 0 25.89 27.32zM11.84 21.58L6.1 27.32A15 15 0 0 0 14.94 31c0-.32.05-.64.05-1A13 13 0 0 0 11.84 21.58zM6.1 4.69L16 14.58l2.75-2.75A15 15 0 0 1 15 1.94c0-.31 0-.63.05-.94A15 15 0 0 0 6.1 4.69z"/></svg> },
  { label: 'Tenis',      icon: <svg width="22" height="22" viewBox="0 0 100 100" fill="#0E8FCF"><path d="M9.2 98c1.9 0 3.7-.8 5.1-2.1l22.2-22.2c.9-1.3.8-3-.4-4.1l-5.6-5.6c-1.1-1.1-2.8-1.2-4.1-.4L4.1 85.7C2.8 87 2 88.8 2 90.8c0 1.9.8 3.7 2.1 5.1C5.5 97.2 7.3 98 9.2 98zm61.1-79.4-7.5-7.5c-3.6 1.6-7.1 3.9-10.3 6.9l9.2 9.2 8.6-8.6zM53.1 38.7l8.6 8.5 8.6-8.7-8.5-8.5zM60.4 28.6l-9.2-9.2c-3 3.2-5.4 6.8-7 10.5l7.4 7.3 8.8-8.6zM80.1 28.4 71.7 20l-8.5 8.6 8.5 8.5zM81.5 27l8.5-8.7c-.8-1.9-1.9-3.6-3.3-5s-3.1-2.5-5-3.3l-8.6 8.6 8.4 8.4zm-8.4 11.5 8.9 8.9c2.9-3.1 5.3-6.6 6.9-10.3l-7.3-7.3-8.5 8.7zM90.9 9.1c-11-11-30.8-9-44.2 4.4-7.3 7.3-11.5 16.8-11.5 26 0 4.5-1 8.4-2.8 11.8l-5 9.3c1.4 0 2.7.5 3.7 1.5l5.6 5.6c1.3 1.3 1.8 3.2 1.4 4.9l9.3-5c3.4-1.8 7.4-2.8 11.8-2.8 4.6 0 9.3-1.1 13.8-3 4.5-2 8.6-4.8 12.3-8.5C99.9 39.8 101.9 20 90.9 9.1z"/></svg> },
  { label: 'Buz Hokeyi', icon: <svg width="22" height="22" viewBox="0 0 48 48" fill="#0E8FCF"><ellipse cx="23.756" cy="42.595" rx="5.351" ry="1.531"/><path d="M23.13 24.54c-.82 1.35-1.34 2.2-1.54 2.48C16.56 18.87 9.53 6.41 7.41 2.64A1.27 1.27 0 0 1 9.62 1.39C11.85 5.24 19.38 18.25 23.13 24.54zM40.094.907a1.274 1.274 0 0 0-1.715.479C35.536 6.3 24.079 26.1 22.821 27.884a15.575 15.575 0 0 1-5.158 4.778l1.222 4.015A16.792 16.792 0 0 0 21.9 33.922c3.254-3.947 15.74-26.03 18.691-31.277A1.27 1.27 0 0 0 40.094.907z"/></svg> },
  { label: 'Voleybol',   icon: <svg width="22" height="22" viewBox="0 0 512 512" fill="#0E8FCF"><path d="M256.07 0C114.467 0-.326 114.793-.326 256.396s114.793 256.395 256.396 256.395 256.395-114.792 256.395-256.395S397.673 0 256.07 0zm210.597 224.064c-19.353 12.05-40.515 20.917-62.677 26.261-4.595-68.333-27.183-134.234-65.472-191.019C406.956 88.198 455.48 150.56 466.667 224.064zM256 42.667c5.397 0 10.667.405 15.979.811 53.223 58.444 84.842 133.342 89.6 212.245-29.153.997-58.199-4.013-85.333-14.72-4.247-72.136-38.705-139.14-94.912-184.555C205.188 47.391 230.484 42.722 256 42.667z"/></svg> },
  { label: 'Masa Tenisi',icon: <svg width="22" height="22" viewBox="0 0 48 48" fill="#0E8FCF"><path d="M43.89 27.24a4 4 0 1 0-.13 5.66A4 4 0 0 0 43.89 27.24z"/><path d="M37.39 33.46a5 5 0 0 1 7-7.11 19 19 0 0 0 1.68-9.49A16 16 0 0 0 31 1.92c-5.85-.5-11.49 1.79-16.3 6.6a17.39 17.39 0 0 0-3.28 4.6L34.89 36.56a17.58 17.58 0 0 0 3.53-2.3A5 5 0 0 1 37.39 33.46zM32.9 37.4L10.62 15.12a17.65 17.65 0 0 0-.67 2.5L30.4 38.07A17.64 17.64 0 0 0 32.9 37.4zM9.65 20.15a17.43 17.43 0 0 0 1 6.8 3.92 3.92 0 0 1-.85 4.17L3.39 37.55a3.95 3.95 0 0 0 0 5.58l1.49 1.49a4 4 0 0 0 5.58 0l6.44-6.44a3.92 3.92 0 0 1 4.17-.85 17.42 17.42 0 0 0 6.8 1z"/></svg> },
]

export default function LiveSportScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sportName = searchParams.get('name') || 'Futbol'

  const [activeSport, setActiveSport] = useState(
    Math.max(0, sportTabs.findIndex(s => s.label === sportName))
  )
  const [activeTab, setActiveTab] = useState(0)
  const [activeTimeFilter, setActiveTimeFilter] = useState(0)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const currentSport = sportTabs[activeSport].label
  const tournaments = activeTab === 0 ? (tournamentMap[currentSport] ?? []) : prematchTournaments

  function toggleExpand(id: number) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleFav(id: number) {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function TournamentRow({ t, indent = false }: { t: Tournament; indent?: boolean }) {
    const isFav = favorites.has(t.id)
    const isExp = expanded.has(t.id)
    const hasChildren = t.sub && t.sub.length > 0

    return (
      <>
        <button
          onClick={() => hasChildren ? toggleExpand(t.id) : router.push(activeTab === 1 ? `/prematch/league?name=${encodeURIComponent(t.name)}` : `/live/matches?league=${encodeURIComponent(t.name)}`)}
          className={`w-full flex items-center gap-2 px-3 py-[8px] bg-white hover:bg-[#f8fafc] transition-colors border-b border-[#f0f4f8] ${indent ? 'pl-[44px]' : ''}`}
        >
          {/* Flag */}
          <div className="relative flex-shrink-0">
            <div className={`${indent ? 'w-[26px] h-[26px]' : 'w-[30px] h-[30px]'} rounded-full bg-[#f1f5f9] flex items-center justify-center border border-[#e8ecf1]`}>
              <span className={indent ? 'text-[13px]' : 'text-[15px]'}>{t.flag}</span>
            </div>
            {t.isHot && (
              <span className="absolute -top-[3px] -right-[3px] w-[14px] h-[14px] rounded-full bg-[#ef4444] flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
                </svg>
              </span>
            )}
            {hasChildren && !t.isHot && (
              <span className="absolute -top-[3px] -right-[3px] w-[16px] h-[16px] rounded-full bg-[#0E8FCF] flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">{t.sub!.length}</span>
              </span>
            )}
          </div>

          {/* Name */}
          <span className="flex-1 text-[12px] font-medium text-[#1a2332] text-left truncate">{t.name}</span>

          {/* Count */}
          <span className="text-[11px] font-semibold text-[#737B8C] mr-2 flex-shrink-0">{t.count}</span>

          {/* Action */}
          {hasChildren ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`flex-shrink-0 transition-transform duration-200 ${isExp ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); toggleFav(t.id) }}
              className="flex-shrink-0 p-[2px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="1.8">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          )}
        </button>

        {/* Sub-items */}
        {hasChildren && isExp && t.sub!.map(sub => (
          <TournamentRow key={sub.id} t={sub} indent />
        ))}
      </>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">

      {/* ── Header ── */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="text-[15px] font-bold text-[#1a2332]">Turnuvalar</h1>
          <div className="flex items-center gap-[2px]">
            <button className="w-9 h-9 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* CANLI / Maç Öncesi tabs */}
        <div className="px-4 pb-2">
          <div className="bg-[#edf5ff] rounded-full p-[3px] flex">
            {['CANLI', 'Maç Öncesi'].map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-[7px] rounded-full text-[11px] font-semibold transition-all ${
                  activeTab === i ? 'bg-[#0E8FCF] text-white shadow-sm' : 'text-[#737B8C]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {/* Time filters — pre-match only */}
        {activeTab === 1 && (
          <div className="flex gap-[5px] overflow-x-auto scrollbar-hide px-3 pb-2">
            {timeFilters.map((f, i) => (
              <button
                key={f}
                onClick={() => setActiveTimeFilter(i)}
                className={`flex-shrink-0 px-[10px] py-[5px] rounded-full text-[10px] font-semibold transition-all ${
                  activeTimeFilter === i
                    ? 'bg-[#0E8FCF] text-white shadow-sm'
                    : 'bg-white text-[#1a2332] border border-[#e8ecf1]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Sport section header ── */}
      <div className="flex items-center gap-2 px-3 py-[7px]">
        <div className="flex-shrink-0 scale-75 origin-left">{sportTabs[activeSport].icon}</div>
        <span className="text-[12px] font-bold text-[#1a2332]">{currentSport}</span>
      </div>

      {/* ── Tournament list ── */}
      <div className="rounded-xl overflow-hidden mx-3 mb-24 shadow-sm">
        {tournaments.map(t => (
          <TournamentRow key={t.id} t={t} />
        ))}
      </div>
    </div>
  )
}
