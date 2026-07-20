'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import { gameHref } from './gameHref'

// ── Data ────────────────────────────────────────────────────────────────────
type Table = {
  name: string
  category: string
  provider: string
  image: string
  dealer?: string
  players: number
  minBet: string
  show?: boolean
  promo?: boolean
}

const promoBanners = [
  { title: 'Diamond Roulette', image: '/canli-casino/10.png' },
  { title: 'VIP Blackjack', image: '/canli-casino/11.png' },
  { title: 'Poker Lobby', image: '/canli-casino/9.png' },
]

const categoryChips = ['Tümü', 'Rulet', 'Blackjack', 'Bakara', 'Poker', 'Oyun Şovları', 'Dragon Tiger']

const allTables: Table[] = [
  { name: 'Lightning Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/1.jpg', dealer: 'Ayşe', players: 1242, minBet: '5 ₺', promo: true },
  { name: 'Immersive Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/2.jpg', dealer: 'Mert', players: 876, minBet: '10 ₺' },
  { name: 'Instant Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/3.jpg', dealer: 'Elif', players: 543, minBet: '5 ₺' },
  { name: 'Blackjack Azure', category: 'Blackjack', provider: 'Pragmatic Play Live', image: '/canli-casino/4.jpg', dealer: 'Deniz', players: 312, minBet: '25 ₺' },
  { name: 'VIP Blackjack 16', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/5.jpg', dealer: 'Kaan', players: 198, minBet: '50 ₺', promo: true },
  { name: 'Speed Blackjack', category: 'Blackjack', provider: 'Ezugi', image: '/canli-casino/6.jpg', dealer: 'Sena', players: 421, minBet: '20 ₺' },
  { name: 'Texas Hold’em', category: 'Poker', provider: 'Evolution', image: '/canli-casino/7.jpg', dealer: 'Burak', players: 267, minBet: '15 ₺' },
  { name: 'Casino Hold’em', category: 'Poker', provider: 'Playtech', image: '/canli-casino/8.jpg', dealer: 'Ceren', players: 154, minBet: '10 ₺', promo: true },
  { name: 'Speed Baccarat', category: 'Bakara', provider: 'Evolution', image: '/canli-casino/9.png', dealer: 'Efe', players: 689, minBet: '20 ₺' },
  { name: 'Dragon Tiger', category: 'Dragon Tiger', provider: 'Ezugi', image: '/canli-casino/10.png', dealer: 'Zeynep', players: 733, minBet: '5 ₺' },
]

const gameShows: Table[] = [
  { name: 'Crazy Time', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/1.jpg', dealer: 'James', players: 8421, minBet: '2 ₺', show: true, promo: true },
  { name: 'Monopoly Live', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/2.jpg', dealer: 'Lucy', players: 5310, minBet: '2 ₺', show: true },
  { name: 'Sweet Bonanza CandyLand', category: 'Oyun Şovları', provider: 'Pragmatic Play Live', image: '/canli-casino/11.png', dealer: 'Mia', players: 4102, minBet: '5 ₺', show: true, promo: true },
  { name: 'Mega Wheel', category: 'Oyun Şovları', provider: 'Pragmatic Play Live', image: '/canli-casino/9.png', dealer: 'Alex', players: 2876, minBet: '2 ₺', show: true },
  { name: 'Dream Catcher', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/3.jpg', dealer: 'Noah', players: 1988, minBet: '5 ₺', show: true },
]

const kategoriler = [
  { name: 'Rulet', image: '/canli-casino/1.jpg' },
  { name: 'Blackjack', image: '/canli-casino/4.jpg' },
  { name: 'Bakara', image: '/canli-casino/9.png' },
  { name: 'Poker', image: '/canli-casino/7.jpg' },
  { name: 'Dragon Tiger', image: '/canli-casino/10.png' },
  { name: 'Oyun Şovları', image: '/canli-casino/11.png' },
]

const providers = [
  { name: 'Evolution', logo: '/providers/provider1.png', tables: 214 },
  { name: 'Pragmatic Play Live', logo: '/providers/pragmatic.png', tables: 96 },
  { name: 'Ezugi', logo: '/providers/provider2.png', tables: 74 },
  { name: 'Playtech', logo: '/providers/provider3.png', tables: 58 },
  { name: 'Vivo Gaming', logo: '', tables: 33 },
  { name: 'Atmosfera', logo: '', tables: 21 },
  { name: 'Absolute Live', logo: '', tables: 18 },
  { name: 'LuckyStreak', logo: '', tables: 12 },
]

// ── Live table card ─────────────────────────────────────────────────────────
function TableCard({ t, w = 'w-full' }: { t: Table; w?: string }) {
  return (
    <Link href={gameHref(t.name, t.image, t.provider)} className={`flex-shrink-0 ${w} bg-white rounded-xl overflow-hidden border border-[#e8ecf1] block`}>
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
        {/* CANLI badge */}
        <span className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-[#e74c3c] rounded px-[5px] py-[2px]">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse-dot" />
          <span className="text-white text-[7px] font-bold uppercase tracking-wide">Canlı</span>
        </span>
        {/* Players online */}
        <span className="absolute top-1.5 right-1.5 flex items-center gap-[3px] bg-black/60 rounded px-[5px] py-[2px]">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /></svg>
          <span className="text-white text-[8px] font-bold tabular-nums">{t.players.toLocaleString('tr-TR')}</span>
        </span>
        {t.promo && <span className="absolute bottom-1.5 left-1.5 bg-[#f59e0b] text-white text-[7px] font-bold px-[5px] py-[2px] rounded uppercase">Promo</span>}
      </div>
      <div className="px-2.5 py-2">
        <p className="text-[11px] font-semibold text-[#1a2332] leading-tight truncate">{t.name}</p>
        <p className="text-[8px] text-[#737B8C] leading-tight truncate mt-[1px]">{t.dealer ? `${t.dealer} · ` : ''}{t.provider}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-[8px] font-semibold text-[#0E8FCF] bg-[#edf5ff] rounded px-[5px] py-[2px]">Min {t.minBet}</span>
        </div>
      </div>
    </Link>
  )
}

export default function LiveCasinoScreen() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [providersOpen, setProvidersOpen] = useState(false)
  const [activeProvider, setActiveProvider] = useState<string | null>(null)

  const searchPool = useMemo(() => [...allTables, ...gameShows], [])
  const searchResults = query.trim()
    ? searchPool.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.provider.toLowerCase().includes(query.toLowerCase()) || t.category.toLowerCase().includes(query.toLowerCase()))
    : []

  const popular = allTables.slice(0, 6)

  const gridTables = useMemo(() => {
    let list = [...allTables, ...gameShows]
    const cat = categoryChips[activeCategory]
    if (cat !== 'Tümü') list = list.filter(t => t.category === cat)
    if (activeProvider) list = list.filter(t => t.provider === activeProvider)
    return list
  }, [activeCategory, activeProvider])

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative">
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30">
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <button onClick={() => { setSearchOpen(false); setQuery('') }} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className="flex-1 flex items-center gap-2 bg-[#f1f5f9] rounded-full px-3 py-[8px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Masa veya sağlayıcı ara..." className="flex-1 bg-transparent text-[13px] text-[#1a2332] placeholder-[#94a3b8] outline-none" />
              {query && (
                <button onClick={() => setQuery('')}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <h1 className="text-[16px] font-bold text-[#1a2332]">Canlı Casino</h1>
            <div className="flex items-center gap-[2px]">
              <button onClick={() => setProvidersOpen(true)} aria-label="Sağlayıcılar" className="w-9 h-9 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
              </button>
              <button onClick={() => setSearchOpen(true)} aria-label="Ara" className="w-9 h-9 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {searchOpen ? (
        <div className="px-4 pt-3 pb-24">
          {query.trim() === '' ? (
            <p className="text-[12px] text-[#94a3b8] text-center py-10">Masa adı, sağlayıcı veya kategori yazın.</p>
          ) : searchResults.length === 0 ? (
            <p className="text-[12px] text-[#94a3b8] text-center py-10">&ldquo;{query}&rdquo; için sonuç bulunamadı.</p>
          ) : (
            <>
              <p className="text-[11px] text-[#737B8C] mb-2">{searchResults.length} sonuç</p>
              <div className="grid grid-cols-2 gap-[8px]">{searchResults.map((t, i) => <TableCard key={i} t={t} />)}</div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* ── Promo banners ── */}
          <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-4 py-3">
            {promoBanners.map((banner, i) => (
              <div key={i} className="flex-shrink-0 w-[110px]">
                <div className="w-full h-[100px] rounded-xl overflow-hidden"><img src={banner.image} alt={banner.title} className="w-full h-full object-cover" /></div>
                <p className="text-[8px] font-medium text-[#1a2332] mt-[3px] leading-tight text-center line-clamp-2">{banner.title}</p>
              </div>
            ))}
          </div>

          {/* ── Category chips + Providers ── */}
          <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-4 pb-3 items-center">
            <button onClick={() => setProvidersOpen(true)} className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-[12px] py-[6px] text-[10px] font-semibold bg-[#1a2332] text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
              Sağlayıcılar
            </button>
            {categoryChips.map((cat, i) => (
              <button key={cat} onClick={() => setActiveCategory(i)} className={`flex-shrink-0 rounded-full px-[12px] py-[6px] text-[10px] font-medium transition-all ${activeCategory === i ? 'bg-[#0E8FCF] text-white' : 'bg-white text-[#1a2332] border border-[#e8ecf1]'}`}>{cat}</button>
            ))}
          </div>

          {/* ── Popüler Masalar ── */}
          <div className="px-4 pt-1"><SectionHeader title="Popüler Masalar" badge="Canli Casino" showAll /></div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {popular.map((t, i) => <TableCard key={i} t={t} w="w-[150px]" />)}
          </div>

          {/* ── Oyun Şovları ── */}
          <div className="px-4 pt-1"><SectionHeader title="Oyun Şovları" badge="Canli Casino" showAll /></div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {gameShows.map((t, i) => <TableCard key={i} t={t} w="w-[160px]" />)}
          </div>

          {/* ── Kategoriler ── */}
          <div className="px-4 pt-1"><SectionHeader title="Kategoriler" showAll /></div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {kategoriler.map((cat, idx) => (
              <button key={cat.name} onClick={() => { const ci = categoryChips.indexOf(cat.name); if (ci >= 0) setActiveCategory(ci) }}
                className="flex-shrink-0 w-[92px] rounded-2xl relative overflow-hidden cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform">
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                <div className="relative z-10 h-[100px] flex flex-col justify-end px-[6px] pb-[8px]">
                  <span className="text-[10px] font-semibold text-white leading-tight text-center" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{cat.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* ── Ayın Sağlayıcısı ── */}
          <div className="px-4 pt-1 pb-4">
            <SectionHeader title="Ayın Sağlayıcısı" showAll />
            <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#111827] to-[#1f2937] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src="/providers/provider1.png" alt="Evolution" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-white leading-tight">Evolution</p>
                  <p className="text-[10px] text-white/70 mt-[2px]">214 masa · Canlı casino lideri</p>
                </div>
                <button onClick={() => setActiveProvider('Evolution')} className="bg-white/15 border border-white/30 text-white text-[10px] font-semibold rounded-full px-3 py-1.5">Tümü</button>
              </div>
              <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
                {allTables.filter(t => t.provider === 'Evolution').slice(0, 4).map((t, i) => (
                  <Link key={i} href={gameHref(t.name, t.image, t.provider)} className="flex-shrink-0 w-[100px]">
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      <span className="absolute top-1 left-1 bg-[#e74c3c] text-white text-[6px] font-bold px-[4px] py-[1px] rounded uppercase">Canlı</span>
                    </div>
                    <p className="text-[9px] font-semibold text-white mt-[3px] leading-tight truncate">{t.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tüm Masalar (filterable) ── */}
          <div className="px-4 pt-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1a2332]">
                {activeProvider ?? (categoryChips[activeCategory] === 'Tümü' ? 'Tüm Masalar' : categoryChips[activeCategory])}
              </h3>
              {(activeProvider || activeCategory !== 0) && (
                <button onClick={() => { setActiveProvider(null); setActiveCategory(0) }} className="flex items-center gap-1 text-[11px] text-[#0E8FCF] font-semibold bg-[#edf5ff] rounded-full px-[10px] py-[4px]">
                  Filtreyi temizle
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          </div>
          <div className="px-4 pb-24">
            {gridTables.length === 0 ? (
              <div className="bg-white rounded-xl py-10 text-center border border-[#e8ecf1]"><p className="text-[12px] text-[#94a3b8]">Bu filtreyle masa yok.</p></div>
            ) : (
              <div className="grid grid-cols-2 gap-[8px]">{gridTables.map((t, i) => <TableCard key={i} t={t} />)}</div>
            )}
          </div>
        </>
      )}

      {/* ── Providers popup ── */}
      {providersOpen && (
        <>
          <div className="fixed inset-0 z-[70] bg-black/40" onClick={() => setProvidersOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl" style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div className="w-10 h-1 rounded-full bg-[#e2e8f0]" /></div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f2f5] flex-shrink-0">
              <h3 className="text-[14px] font-bold text-[#1a2332]">Sağlayıcılar</h3>
              <button onClick={() => setProvidersOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-4 py-3">
              <div className="grid grid-cols-2 gap-[8px]">
                {providers.map((p) => (
                  <button key={p.name} onClick={() => { setActiveProvider(p.name); setActiveCategory(0); setProvidersOpen(false); setSearchOpen(false) }}
                    className="flex items-center gap-2.5 bg-[#f8fafc] rounded-xl border border-[#e8ecf1] px-3 py-2.5 hover:bg-[#edf5ff] transition-colors text-left">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#e8ecf1] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p.logo ? <img src={p.logo} alt={p.name} className="w-7 h-7 object-contain" /> : <span className="text-[11px] font-bold text-[#0E8FCF]">{p.name.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[#1a2332] leading-tight truncate">{p.name}</p>
                      <p className="text-[9px] text-[#737B8C]">{p.tables} masa</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
