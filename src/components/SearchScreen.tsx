'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import FavoriteStar from '@/components/FavoriteStar'

// ── Searchable index ───────────────────────────────────────────
type MatchItem = { id: string; home: string; away: string; league: string; live: boolean; score?: string; date?: string }
type LeagueItem = { title: string; emoji: string; count: number }
type GameItem = { name: string; provider: string; image: string }

const MATCHES: MatchItem[] = [
  { id: 'gal-fen', home: 'Galatasaray', away: 'Fenerbahçe', league: 'Türkiye Süper Ligi', live: true, score: '2:1' },
  { id: 'mci-ars', home: 'Manchester City', away: 'Arsenal', league: 'İngiltere Premier Ligi', live: true, score: '0:0' },
  { id: 'rma-bar', home: 'Real Madrid', away: 'Barcelona', league: 'İspanya La Liga', live: true, score: '1:2' },
  { id: 'bes-tra', home: 'Beşiktaş', away: 'Trabzonspor', league: 'Türkiye Süper Ligi', live: false, date: '25 Mar, 20:00' },
  { id: 'liv-che', home: 'Liverpool', away: 'Chelsea', league: 'İngiltere Premier Ligi', live: false, date: '26 Mar, 22:00' },
  { id: 'atl-sev', home: 'Atletico Madrid', away: 'Sevilla', league: 'İspanya La Liga', live: false, date: '27 Mar, 19:30' },
  { id: 'bay-dor', home: 'Bayern Münih', away: 'Dortmund', league: 'Almanya Bundesliga', live: false, date: '28 Mar, 19:30' },
  { id: 'int-juv', home: 'Inter', away: 'Juventus', league: 'İtalya Serie A', live: false, date: '29 Mar, 21:45' },
  { id: 'psg-mar', home: 'PSG', away: 'Marsilya', league: 'Fransa Ligue 1', live: false, date: '30 Mar, 22:00' },
]

const LEAGUES: LeagueItem[] = [
  { title: 'Türkiye Süper Ligi', emoji: '🇹🇷', count: 44 },
  { title: 'Şampiyonlar Ligi', emoji: '🏆', count: 48 },
  { title: 'Avrupa Ligi', emoji: '🏆', count: 32 },
  { title: 'İngiltere Premier Ligi', emoji: '🦁', count: 52 },
  { title: 'İspanya La Liga', emoji: '🇪🇸', count: 40 },
  { title: 'Almanya Bundesliga', emoji: '🇩🇪', count: 36 },
  { title: 'İtalya Serie A', emoji: '🇮🇹', count: 38 },
  { title: 'Fransa Ligue 1', emoji: '🇫🇷', count: 30 },
  { title: 'NBA', emoji: '🏀', count: 22 },
]

const GAMES: GameItem[] = [
  { name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '/spotlight/1.png' },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/spotlight/2.png' },
  { name: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: '/spotlight/3.png' },
  { name: 'Book of Dead', provider: 'Play n GO', image: '/spotlight/4.png' },
  { name: 'Fortune Gems 3', provider: 'JILI Games', image: '/spotlight/5.png' },
  { name: 'Wolf Gold', provider: 'Pragmatic Play', image: '/spotlight/6.png' },
  { name: 'Sugar Rush', provider: 'Pragmatic Play', image: '/spotlight/1.png' },
  { name: 'Starburst', provider: 'NetEnt', image: '/spotlight/2.png' },
]

const POPULAR = ['Galatasaray', 'Şampiyonlar Ligi', 'Fenerbahçe', 'Premier Lig', 'Real Madrid', 'Gates of Olympus', 'NBA', 'La Liga']

const RECENT_KEY = 'bta_recent_search'
const norm = (s: string) => s.toLocaleLowerCase('tr')

export default function SearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState<string[]>([])

  // Load recent searches
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) setRecent(arr)
      }
    } catch {}
  }, [])

  const saveRecent = (term: string) => {
    const t = term.trim()
    if (!t) return
    setRecent(prev => {
      const next = [t, ...prev.filter(x => norm(x) !== norm(t))].slice(0, 8)
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const clearRecent = () => {
    setRecent([])
    try { localStorage.removeItem(RECENT_KEY) } catch {}
  }

  const q = query.trim()
  const results = useMemo(() => {
    if (!q) return null
    const nq = norm(q)
    return {
      matches: MATCHES.filter(m => norm(m.home).includes(nq) || norm(m.away).includes(nq) || norm(m.league).includes(nq)).slice(0, 8),
      leagues: LEAGUES.filter(l => norm(l.title).includes(nq)).slice(0, 8),
      games: GAMES.filter(g => norm(g.name).includes(nq) || norm(g.provider).includes(nq)).slice(0, 8),
    }
  }, [q])

  const totalResults = results ? results.matches.length + results.leagues.length + results.games.length : 0

  const go = (href: string, term: string) => {
    saveRecent(term)
    router.push(href)
  }

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-screen">
      {/* Search bar header */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3 sticky top-0 z-10 border-b border-[#f0f2f5]">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 flex items-center gap-2 bg-[#f1f5f9] rounded-full px-4 py-[9px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveRecent(q) }}
            placeholder="Takım, lig veya oyun ara"
            className="flex-1 bg-transparent text-[13px] text-[#1a2332] placeholder-[#94a3b8] outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Temizle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {results ? (
        <div className="px-4 pt-4 pb-16">
          {totalResults === 0 ? (
            <EmptyResults query={q} />
          ) : (
            <>
              {results.matches.length > 0 && (
                <Section title="Etkinlikler" count={results.matches.length}>
                  {results.matches.map(m => (
                    <div key={m.id} onClick={() => go(`/match?id=${m.id}`, q)} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow">
                      <div className="flex items-center flex-shrink-0">
                        <img src="/teams/jersey1.png" className="w-[24px] h-[24px] object-contain" alt="" />
                        <img src="/teams/jersey2.png" className="w-[24px] h-[24px] object-contain -ml-2" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] font-semibold text-[#1a2332] leading-tight truncate">{m.home} - {m.away}</p>
                          {m.live && <span className="text-[8px] font-bold text-[#e74c3c] bg-[#fde8e8] rounded px-[4px] py-[1px] leading-none flex-shrink-0">CANLI</span>}
                        </div>
                        <p className="text-[10px] text-[#737B8C] mt-[2px] truncate">{m.league} · {m.live ? m.score : m.date}</p>
                      </div>
                      <FavoriteStar item={{ type: 'event', id: m.id, title: `${m.home} - ${m.away}`, subtitle: m.league, href: `/match?id=${m.id}`, logo1: '/teams/jersey1.png', logo2: '/teams/jersey2.png', score1: m.live ? Number(m.score?.split(':')[0]) : undefined, score2: m.live ? Number(m.score?.split(':')[1]) : undefined, isLive: m.live }} size={18} inactiveStroke="#0E8FCF" activeColor="#0E8FCF" />
                    </div>
                  ))}
                </Section>
              )}

              {results.leagues.length > 0 && (
                <Section title="Ligler" count={results.leagues.length}>
                  {results.leagues.map(l => {
                    const href = `/league?title=${encodeURIComponent(l.title)}&color=${encodeURIComponent('#0E8FCF')}`
                    return (
                      <div key={l.title} onClick={() => go(href, l.title)} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow">
                        <div className="w-10 h-10 rounded-lg bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
                          <span className="text-[18px] leading-none">{l.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#1a2332] leading-tight truncate">{l.title}</p>
                          <p className="text-[10px] text-[#737B8C] mt-[2px]">{l.count} etkinlik</p>
                        </div>
                        <FavoriteStar item={{ type: 'league', id: `search-${l.title}`, title: l.title, subtitle: `${l.count} etkinlik`, emoji: l.emoji, href }} size={18} inactiveStroke="#0E8FCF" activeColor="#0E8FCF" />
                      </div>
                    )
                  })}
                </Section>
              )}

              {results.games.length > 0 && (
                <Section title="Oyunlar" count={results.games.length}>
                  {results.games.map(g => (
                    <div key={g.name} onClick={() => go('/slots', g.name)} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow">
                      <div className="w-10 h-10 rounded-lg bg-[#edf5ff] overflow-hidden flex-shrink-0">
                        <img src={g.image} className="w-full h-full object-cover" alt="" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#1a2332] leading-tight truncate">{g.name}</p>
                        <p className="text-[10px] text-[#737B8C] mt-[2px] truncate">{g.provider}</p>
                      </div>
                      <FavoriteStar item={{ type: 'game', id: `slot-${g.name}`, title: g.name, subtitle: g.provider, image: g.image, href: '/slots' }} size={18} inactiveStroke="#0E8FCF" activeColor="#0E8FCF" />
                    </div>
                  ))}
                </Section>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="px-4 pt-4">
          {/* Recent searches */}
          {recent.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[13px] font-bold text-[#1a2332]">Son Aramalar</span>
                <button onClick={clearRecent} className="text-[11px] font-semibold text-[#e74c3c]">Temizle</button>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                {recent.map(term => (
                  <button key={term} onClick={() => setQuery(term)} className="flex items-center gap-[6px] bg-[#f1f5f9] rounded-full pl-[10px] pr-[10px] py-[6px] border border-[#e8ecf1] hover:border-[#0E8FCF] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
                    </svg>
                    <span className="text-[12px] font-medium text-[#1a2332] whitespace-nowrap">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches */}
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0E8FCF">
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
            </svg>
            <span className="text-[13px] font-bold text-[#1a2332]">Popüler Aramalar</span>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {POPULAR.map(term => (
              <button key={term} onClick={() => setQuery(term)} className="flex items-center gap-[6px] bg-[#edf5ff] rounded-full px-[12px] py-[7px] border border-[#e8ecf1] hover:border-[#0E8FCF] transition-colors">
                <span className="text-[12px] font-medium text-[#1a2332] whitespace-nowrap">{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[13px] font-bold text-[#1a2332]">{title}</span>
        <span className="text-[9px] font-bold text-white bg-[#0E8FCF] rounded-full px-[6px] py-[1px] leading-none">{count}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function EmptyResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center text-center pt-16 px-8">
      <div className="w-16 h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-4">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <p className="text-[15px] font-bold text-[#1a2332]">Sonuç bulunamadı</p>
      <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed">&quot;{query}&quot; için sonuç yok. Farklı bir takım, lig veya oyun adı deneyin.</p>
    </div>
  )
}
