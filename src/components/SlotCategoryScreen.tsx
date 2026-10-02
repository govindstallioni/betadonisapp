'use client'

import { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import FavoriteStar from '@/components/FavoriteStar'
import { gameHref } from '@/components/gameHref'
import { gamesFor, SLOT_CATEGORIES, EXTRA_CATEGORY_LABELS } from '@/components/slotGamesData'
import { artFallback } from './placeholderGameArt'

const LABELS: Record<string, string> = {
  ...Object.fromEntries(SLOT_CATEGORIES.map(c => [c.slug, c.label])),
  ...EXTRA_CATEGORY_LABELS,
}

function GameGrid({ games }: { games: ReturnType<typeof gamesFor> }) {
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {games.map((game, i) => (
        <Link href={gameHref(game.name, game.image, game.provider)} key={`${game.name}-${i}`} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1] block">
          <div className="relative w-full aspect-[1/1] overflow-hidden">
            <img src={game.image} alt={game.name} className="w-full h-full object-cover" onError={artFallback(game.name, game.provider)} />
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
  )
}

export default function SlotCategoryScreen() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const title = LABELS[slug]
  // Task 25: the Sağlayıcılar directory links here with ?provider=NAME.
  const providerFilter = searchParams.get('provider')
  const games = title ? gamesFor(slug).filter(g => !providerFilter || g.provider === providerFilter) : []
  // Task 16: search is scoped to the "Tümü" (All) page — it already lists
  // every slot, so it's the one place a within-page search makes sense.
  const isAllGames = slug === 'tumu'
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchResults = query.trim()
    ? games.filter(g => g.name.toLowerCase().includes(query.toLowerCase()) || g.provider.toLowerCase().includes(query.toLowerCase()))
    : []

  const closeSearch = () => { setSearchOpen(false); setQuery('') }

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative">
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30 border-b border-[#e8ecf1]">
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <button onClick={closeSearch} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className="flex-1 flex items-center gap-2 bg-[#f1f5f9] rounded-full px-3 py-[8px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Oyun adı veya sağlayıcı ara..."
                className="flex-1 bg-transparent text-[13px] text-[#1a2332] placeholder-[#94a3b8] outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-[16px] font-bold text-[#1a2332] leading-tight">{providerFilter ?? (title ?? 'Kategori')}</h1>
              {title && <p className="text-[10px] text-[#737B8C] leading-tight">{games.length} oyun</p>}
            </div>
            {isAllGames ? (
              <button onClick={() => setSearchOpen(true)} aria-label="Ara" className="w-8 h-8 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>
        )}
      </div>

      {searchOpen ? (
        <div className="px-4 pt-4 pb-24">
          {query.trim() === '' ? (
            <p className="text-[12px] text-[#94a3b8] text-center py-10">Oyun adı veya sağlayıcı yazın.</p>
          ) : searchResults.length === 0 ? (
            <p className="text-[12px] text-[#94a3b8] text-center py-10">&ldquo;{query}&rdquo; için sonuç bulunamadı.</p>
          ) : (
            <>
              <p className="text-[11px] text-[#737B8C] mb-2">{searchResults.length} sonuç</p>
              <GameGrid games={searchResults} />
            </>
          )}
        </div>
      ) : !title ? (
        <div className="pt-10 text-center text-[13px] text-[#737B8C]">Kategori bulunamadı.</div>
      ) : games.length === 0 ? (
        <div className="pt-10 text-center text-[13px] text-[#737B8C]">Bu kategoride henüz oyun yok.</div>
      ) : (
        <div className="px-4 pt-4 pb-24">
          <GameGrid games={games} />
        </div>
      )}
    </div>
  )
}
