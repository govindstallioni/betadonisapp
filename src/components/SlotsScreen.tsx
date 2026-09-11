'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import FavoriteStar from '@/components/FavoriteStar'
import { gameHref } from '@/components/gameHref'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/AuthProvider'
import {
  promoBanners, kategoriler, providers,
  popularSlots, forYouGames, crashGames, monthProviderGames, ALL_GAMES,
  SLOT_CATEGORIES, gamesFor, countFor,
} from '@/components/slotGamesData'

// ── Small game card (used by horizontal rails) ──────────────────────────────
function GameThumb({ game, w = 'w-[110px]' }: { game: { name: string; provider: string; image: string; promo?: boolean }; w?: string }) {
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

const POPULER_INDEX = SLOT_CATEGORIES.findIndex(c => c.slug === 'populer')

export default function SlotsScreen() {
  const router = useRouter()
  const { balance } = useAuth()
  const { count: favCount } = useFavorites()
  const [activeCategory, setActiveCategory] = useState(POPULER_INDEX)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [providersOpen, setProvidersOpen] = useState(false)

  // Search across every game.
  const searchResults = query.trim()
    ? ALL_GAMES.filter(g => g.name.toLowerCase().includes(query.toLowerCase()) || g.provider.toLowerCase().includes(query.toLowerCase()))
    : []

  const onChipClick = (slug: string, i: number) => {
    setActiveCategory(i)
    if (slug === 'populer') return
    if (slug === 'favoriler') { router.push('/favorites?tab=game'); return }
    router.push(`/slots/${slug}`)
  }

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
                <span className="text-[12px] font-medium text-[#1a2332] flex-1">{balance.total.toLocaleString('tr-TR')} ₺</span>
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
            {SLOT_CATEGORIES.map((cat, i) => {
              const count = cat.slug === 'favoriler' ? favCount('game') : countFor(cat.slug)
              const active = activeCategory === i
              return (
                <button key={cat.slug} onClick={() => onChipClick(cat.slug, i)} className={`flex-shrink-0 flex items-center gap-[5px] rounded-full px-[14px] py-[7px] text-[10px] font-medium transition-all ${active ? 'bg-[#0E8FCF] text-white' : 'bg-white text-[#1a2332] border border-[#e8ecf1]'}`}>
                  {cat.label}
                  <span className={`text-[9px] rounded-full px-[5px] py-[1px] leading-none font-bold ${active ? 'bg-white/25 text-white' : 'bg-[#0E8FCF] text-white'}`}>{count}</span>
                </button>
              )
            })}
          </div>

          {/* ── Popüler Slotlar ── */}
          <div className="px-4 pt-1">
            <SectionHeader title="Popüler Slotlar" badge="Casino" showAll href="/slots/populer" count={countFor('populer')} />
          </div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {popularSlots.map((g, i) => <GameThumb key={i} game={g} />)}
          </div>

          {/* ── Sizin için Seçilen ── */}
          <div className="px-4 pt-1">
            <SectionHeader title="Sizin için Seçilen" showAll href="/slots/sizin-icin-secilen" count={countFor('sizin-icin-secilen')} />
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
                <Link href="/slots/saglayici-pragmatic-play" className="bg-white/20 border border-white/40 text-white text-[10px] font-semibold rounded-full px-3 py-1.5">Tümü</Link>
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
            <SectionHeader title="Kategoriler" showAll href="/slots/tumu" />
          </div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {kategoriler.map((cat) => (
              <Link key={cat.name} href={`/slots/${cat.slug}`} className="flex-shrink-0 w-[84px] rounded-2xl relative overflow-hidden cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform">
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                <div className="relative z-10 h-[110px] flex flex-col justify-end px-[6px] pb-[8px]">
                  <span className="text-[10px] font-semibold text-white leading-tight text-center" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Efsane Çarpanlar ── */}
          <div className="px-4 pt-1">
            <SectionHeader title="Efsane Çarpanlar" badge="Casino" showAll href="/slots/efsane-carpanlar" count={countFor('efsane-carpanlar')} />
          </div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-8">
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
                  <button key={p.name} onClick={() => { setProvidersOpen(false); setSearchOpen(false); if (p.name === 'Pragmatic Play') router.push('/slots/saglayici-pragmatic-play') }}
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
