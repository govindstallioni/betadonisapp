'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import FavoriteStar from '@/components/FavoriteStar'
import { gameHref } from '@/components/gameHref'
import { gamesFor, SLOT_CATEGORIES, EXTRA_CATEGORY_LABELS } from '@/components/slotGamesData'

const LABELS: Record<string, string> = {
  ...Object.fromEntries(SLOT_CATEGORIES.map(c => [c.slug, c.label])),
  ...EXTRA_CATEGORY_LABELS,
}

export default function SlotCategoryScreen() {
  const router = useRouter()
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const title = LABELS[slug]
  const games = title ? gamesFor(slug) : []

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative">
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-[16px] font-bold text-[#1a2332] leading-tight">{title ?? 'Kategori'}</h1>
            {title && <p className="text-[10px] text-[#737B8C] leading-tight">{games.length} oyun</p>}
          </div>
          <div className="w-8" />
        </div>
      </div>

      {!title ? (
        <div className="pt-10 text-center text-[13px] text-[#737B8C]">Kategori bulunamadı.</div>
      ) : games.length === 0 ? (
        <div className="pt-10 text-center text-[13px] text-[#737B8C]">Bu kategoride henüz oyun yok.</div>
      ) : (
        <div className="px-4 pt-4 pb-24">
          <div className="grid grid-cols-2 gap-[10px]">
            {games.map((game, i) => (
              <Link href={gameHref(game.name, game.image, game.provider)} key={`${game.name}-${i}`} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1] block">
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
      )}
    </div>
  )
}
