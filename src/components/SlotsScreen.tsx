'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import FavoriteStar from '@/components/FavoriteStar'
import { gameHref } from '@/components/gameHref'

// ── Data ────────────────────────────────────────────────────────────────────
type Game = { name: string; provider: string; image: string; promo?: boolean }

const promoBanners = [
  { title: 'Evaginarium: Wonder Circus', image: '/spotlight/1.png', badge: '€100,000' },
  { title: 'Hoşgeldin Paketi 75.500 TRY', image: '/spotlight/2.png' },
  { title: 'Wild Spin Chase', image: '/spotlight/3.png' },
  { title: 'Haftanın Slot Oyunu', image: '/spotlight/4.png' },
  { title: '1X Fortune Gems 2', image: '/spotlight/5.png' },
]

const categoryChips = ['Tümü', 'Popüler', 'Yeni', 'Jackpot', 'Megaways', 'Bonus Al', 'Klasik', 'Meyve']

const popularSlots: Game[] = [
  { name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '/spotlight/1.png', promo: true },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/spotlight/2.png', promo: true },
  { name: 'Sugar Rush', provider: 'Pragmatic Play', image: '/spotlight/3.png' },
  { name: 'Fortune Gems 3', provider: 'JILI Games', image: '/spotlight/4.png', promo: true },
  { name: 'Book of Dead', provider: "Play'n GO", image: '/spotlight/5.png' },
  { name: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: '/spotlight/6.png', promo: true },
]

const forYouGames: Game[] = [
  { name: 'Sizin İçin: Wild West Gold', provider: 'Pragmatic Play', image: '/for you/1.png' },
  { name: 'Sizin İçin: Wanted Dead', provider: 'Hacksaw', image: '/for you/2.png', promo: true },
  { name: 'Sizin İçin: Money Train 3', provider: 'Relax Gaming', image: '/for you/3.png' },
]

// Crash / multiplier games — "Efsane Çarpanlar".
const crashGames = [
  { name: 'Aviator', provider: 'Spribe', image: '/spotlight/6.png', mult: '125.00x' },
  { name: 'JetX', provider: 'SmartSoft', image: '/spotlight/5.png', mult: '88.40x' },
  { name: 'Spaceman', provider: 'Pragmatic Play', image: '/spotlight/4.png', mult: '210.00x' },
  { name: 'Plinko', provider: 'Turbo Games', image: '/spotlight/3.png', mult: '64.00x' },
  { name: 'Mines', provider: 'Turbo Games', image: '/spotlight/2.png', mult: '24.75x' },
  { name: 'Zeppelin', provider: 'BetSolutions', image: '/spotlight/1.png', mult: '150.00x' },
]

const kategoriler = [
  { name: 'En Popüler', image: '/categories/01.png' },
  { name: 'Masa Oyunları', image: '/categories/02.png' },
  { name: 'Video Slots', image: '/categories/03.png' },
  { name: 'Jackpot', image: '/categories/04.png' },
  { name: 'Megaways', image: '/categories/05.png' },
  { name: 'Kazı Kazan', image: '/categories/06.png' },
  { name: 'Yeni Oyunlar', image: '/categories/07.png' },
]

const monthProviderGames: Game[] = [
  { name: 'Starlight Princess', provider: 'Pragmatic Play', image: '/spotlight/2.png', promo: true },
  { name: 'The Dog House', provider: 'Pragmatic Play', image: '/spotlight/3.png' },
  { name: 'Wolf Gold', provider: 'Pragmatic Play', image: '/spotlight/4.png' },
]

const allSlots: Game[] = [
  { name: 'Cash Me Eva', provider: 'Winspinity', image: '/spotlight/1.png', promo: true },
  { name: 'Golden Crown Extreme', provider: 'Fazi', image: '/spotlight/2.png', promo: true },
  { name: 'Fortune Gems 3', provider: 'JILI Games', image: '/spotlight/3.png', promo: true },
  { name: 'Navigator', provider: 'Solidicon', image: '/spotlight/4.png' },
  { name: 'Fortune Numbers', provider: 'BGaming', image: '/spotlight/5.png', promo: true },
  { name: 'Royalty', provider: 'Pragmatic Play', image: '/spotlight/6.png', promo: true },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/spotlight/1.png' },
  { name: 'Book of Dead', provider: "Play'n GO", image: '/spotlight/2.png', promo: true },
  { name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '/spotlight/3.png' },
  { name: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: '/spotlight/4.png', promo: true },
]

const providers = [
  { name: 'Pragmatic Play', logo: '/providers/pragmatic.png', games: 312 },
  { name: 'JILI Games', logo: '/providers/provider1.png', games: 148 },
  { name: 'BGaming', logo: '/providers/provider2.png', games: 96 },
  { name: "Play'n GO", logo: '/providers/provider3.png', games: 204 },
  { name: 'Winspinity', logo: '/providers/01.png', games: 42 },
  { name: 'Fazi', logo: '', games: 67 },
  { name: 'Solidicon', logo: '', games: 31 },
  { name: 'Hacksaw', logo: '', games: 88 },
  { name: 'Relax Gaming', logo: '', games: 120 },
  { name: 'Evolution', logo: '', games: 175 },
  { name: 'NetEnt', logo: '', games: 133 },
  { name: 'Spribe', logo: '', games: 12 },
]

// ── Small game card (used by horizontal rails) ──────────────────────────────
function GameThumb({ game, w = 'w-[110px]' }: { game: Game; w?: string }) {
  return (
    <Link href={gameHref(game.name, game.image, game.provider)} className={`flex-shrink-0 ${w}`}>
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-[#e8ecf1]">
        <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
        {game.promo && (
          <span className="absolute top-1.5 left-1.5 bg-[#e74c3c] text-white text-[7px] font-bold px-[5px] py-[2px] rounded uppercase">Promo</span>
        )}
      </div>
      <p className="text-[10px] font-semibold text-[#1a2332] mt-[4px] leading-tight truncate">{game.name}</p>
      <p className="text-[8px] text-[#737B8C] leading-tight truncate">{game.provider}</p>
    </Link>
  )
}

export default function SlotsScreen() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [providersOpen, setProvidersOpen] = useState(false)
  const [activeProvider, setActiveProvider] = useState<string | null>(null)

  // Search across every game rail.
  const searchPool = useMemo(
    () => [...popularSlots, ...forYouGames, ...crashGames, ...monthProviderGames, ...allSlots],
    []
  )
  const searchResults = query.trim()
    ? searchPool.filter(g => g.name.toLowerCase().includes(query.toLowerCase()) || g.provider.toLowerCase().includes(query.toLowerCase()))
    : []

  const gridGames = activeProvider ? allSlots.filter(g => g.provider === activeProvider) : allSlots

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
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Oyun veya sağlayıcı ara..." className="flex-1 bg-transparent text-[13px] text-[#1a2332] placeholder-[#94a3b8] outline-none" />
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
            <h1 className="text-[16px] font-bold text-[#1a2332]">Slotlar</h1>
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

      {/* ── Search results ── */}
      {searchOpen ? (
        <div className="px-4 pt-3 pb-24">
          {query.trim() === '' ? (
            <p className="text-[12px] text-[#94a3b8] text-center py-10">Oyun adı veya sağlayıcı yazın.</p>
          ) : searchResults.length === 0 ? (
            <p className="text-[12px] text-[#94a3b8] text-center py-10">&ldquo;{query}&rdquo; için sonuç bulunamadı.</p>
          ) : (
            <>
              <p className="text-[11px] text-[#737B8C] mb-2">{searchResults.length} sonuç</p>
              <div className="grid grid-cols-3 gap-[10px]">
                {searchResults.map((g, i) => <GameThumb key={i} game={g} w="w-full" />)}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* ── Balance bar ── */}
          <div className="bg-white px-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-[#edf5ff] rounded-full px-3 py-[8px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /></svg>
                <span className="text-[12px] font-medium text-[#1a2332] flex-1">0 ₺</span>
              </div>
              <Link href="/kupon/deposit" className="flex items-center gap-[6px] bg-[#27ae60] text-white rounded-full px-4 py-[8px] hover:bg-[#219a52] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                <span className="text-[11px] font-medium">Para Yatır</span>
              </Link>
            </div>
          </div>

          {/* ── Promo banners ── */}
          <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-4 py-3">
            {promoBanners.map((banner, i) => (
              <div key={i} className="flex-shrink-0 w-[100px]">
                <div className="w-full h-[120px] rounded-xl overflow-hidden relative">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  {banner.badge && <span className="absolute top-2 left-2 bg-[#0E8FCF] text-white text-[8px] font-medium px-[6px] py-[2px] rounded-full">{banner.badge}</span>}
                </div>
                <p className="text-[9px] font-medium text-[#1a2332] mt-[4px] leading-tight text-center line-clamp-2">{banner.title}</p>
              </div>
            ))}
          </div>

          {/* ── Category chips + Providers ── */}
          <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-4 pb-3 items-center">
            <button onClick={() => setProvidersOpen(true)} className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-[12px] py-[7px] text-[10px] font-semibold bg-[#1a2332] text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
              Sağlayıcılar
            </button>
            {categoryChips.map((cat, i) => (
              <button key={cat} onClick={() => setActiveCategory(i)} className={`flex-shrink-0 rounded-full px-[14px] py-[7px] text-[10px] font-medium transition-all ${activeCategory === i ? 'bg-[#0E8FCF] text-white' : 'bg-white text-[#1a2332] border border-[#e8ecf1]'}`}>{cat}</button>
            ))}
          </div>

          {/* ── Popüler Slotlar ── */}
          <div className="px-4 pt-1">
            <SectionHeader title="Popüler Slotlar" badge="Casino" showAll />
          </div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {popularSlots.map((g, i) => <GameThumb key={i} game={g} />)}
          </div>

          {/* ── Sizin için Seçilen ── */}
          <div className="px-4 pt-1">
            <SectionHeader title="Sizin için Seçilen" showAll />
          </div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {forYouGames.map((g, i) => <GameThumb key={i} game={g} w="w-[150px]" />)}
          </div>

          {/* ── Ayın Sağlayıcısı ── */}
          <div className="px-4 pt-1 pb-4">
            <SectionHeader title="Ayın Sağlayıcısı" showAll />
            <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#ff6b2c] to-[#ff9a3c] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src="/providers/pragmatic.png" alt="Pragmatic Play" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-white leading-tight">Pragmatic Play</p>
                  <p className="text-[10px] text-white/85 mt-[2px]">312 oyun · Ayın öne çıkan sağlayıcısı</p>
                </div>
                <button onClick={() => { setActiveProvider('Pragmatic Play'); }} className="bg-white/20 border border-white/40 text-white text-[10px] font-semibold rounded-full px-3 py-1.5">Tümü</button>
              </div>
              <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
                {monthProviderGames.map((g, i) => (
                  <Link key={i} href={gameHref(g.name, g.image, g.provider)} className="flex-shrink-0 w-[100px]">
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                      <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[9px] font-semibold text-white mt-[3px] leading-tight truncate">{g.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Kategoriler ── */}
          <div className="px-4 pt-1">
            <SectionHeader title="Kategoriler" showAll />
          </div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {kategoriler.map((cat) => (
              <div key={cat.name} className="flex-shrink-0 w-[84px] rounded-2xl relative overflow-hidden cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform">
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                <div className="relative z-10 h-[110px] flex flex-col justify-end px-[6px] pb-[8px]">
                  <span className="text-[10px] font-semibold text-white leading-tight text-center" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{cat.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Efsane Çarpanlar ── */}
          <div className="px-4 pt-1">
            <SectionHeader title="Efsane Çarpanlar" badge="Casino" showAll />
          </div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {crashGames.map((g, i) => (
              <Link key={i} href={gameHref(g.name, g.image, g.provider)} className="flex-shrink-0 w-[120px]">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#e8ecf1]">
                  <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-[#22c55e] text-[10px] font-bold px-[6px] py-[2px] rounded-md tabular-nums">{g.mult}</span>
                </div>
                <p className="text-[10px] font-semibold text-[#1a2332] mt-[4px] leading-tight truncate">{g.name}</p>
                <p className="text-[8px] text-[#737B8C] leading-tight truncate">{g.provider}</p>
              </Link>
            ))}
          </div>

          {/* ── Tüm Slotlar grid ── */}
          <div className="px-4 pt-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1a2332]">{activeProvider ?? 'Tüm Slotlar'}</h3>
              {activeProvider && (
                <button onClick={() => setActiveProvider(null)} className="flex items-center gap-1 text-[11px] text-[#0E8FCF] font-semibold bg-[#edf5ff] rounded-full px-[10px] py-[4px]">
                  Filtreyi temizle
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          </div>
          <div className="px-4 pb-24">
            <div className="grid grid-cols-2 gap-[10px]">
              {gridGames.map((game, i) => (
                <Link href={gameHref(game.name, game.image, game.provider)} key={i} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1] block">
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                    {game.promo && <span className="absolute top-2 left-2 bg-[#e74c3c] text-white text-[8px] font-bold px-[6px] py-[2px] rounded-md uppercase">Promo</span>}
                  </div>
                  <div className="px-2.5 py-2 flex items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#1a2332] leading-tight truncate">{game.name}</p>
                      <p className="text-[9px] text-[#737B8C] leading-tight mt-[1px]">{game.provider}</p>
                    </div>
                    <FavoriteStar size={18} inactiveStroke="#0E8FCF" activeColor="#0E8FCF" className="flex-shrink-0 ml-1"
                      item={{ type: 'game', id: `slot-${game.name}`, title: game.name, subtitle: game.provider, image: game.image, href: gameHref(game.name, game.image, game.provider) }} />
                  </div>
                </Link>
              ))}
            </div>
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
                  <button key={p.name} onClick={() => { setActiveProvider(p.name); setProvidersOpen(false); setSearchOpen(false) }}
                    className="flex items-center gap-2.5 bg-[#f8fafc] rounded-xl border border-[#e8ecf1] px-3 py-2.5 hover:bg-[#edf5ff] transition-colors text-left">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#e8ecf1] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p.logo
                        ? <img src={p.logo} alt={p.name} className="w-7 h-7 object-contain" />
                        : <span className="text-[12px] font-bold text-[#0E8FCF]">{p.name.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[#1a2332] leading-tight truncate">{p.name}</p>
                      <p className="text-[9px] text-[#737B8C]">{p.games} oyun</p>
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
