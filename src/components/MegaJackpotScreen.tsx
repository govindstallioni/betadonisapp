'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import FavoriteStar from '@/components/FavoriteStar'
import { gameHref } from '@/components/gameHref'
import { jackpots, AnimatedAmount, jackpotGames } from '@/components/megaJackpotData'

export default function MegaJackpotScreen() {
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative">
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Mega Jackpot</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-4 py-4">
        {jackpots.map((jp, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[190px] rounded-xl px-[12px] py-[8px] flex flex-col items-center gap-[5px]"
            style={{ background: jp.gradient, boxShadow: `0 2px 6px ${jp.shadow}` }}
          >
            <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/80">{jp.label}</span>
            <img src={jp.icon} alt="" className="w-[44px] h-[44px] object-contain flex-shrink-0" />
            <div className="flex flex-col items-center gap-[1px]">
              <span className="text-[13px] font-black text-white leading-none tabular-nums"><AnimatedAmount target={jp.amount} /></span>
              <span className="text-[9px] font-bold text-white/80">TRY</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pt-1">
        <SectionHeader title="Pragmatic Play Jackpot Oyunları" badge="Casino" />
      </div>
      <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-[10px]">
          {jackpotGames.map((game, i) => (
            <Link href={gameHref(game.name, game.image, game.provider)} key={i} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1] block">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#0E8FCF] text-white text-[8px] font-bold px-[6px] py-[2px] rounded-md uppercase">Jackpot</span>
              </div>
              <div className="px-2.5 py-2">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#1a2332] leading-tight truncate">{game.name}</p>
                    <p className="text-[9px] text-[#737B8C] leading-tight mt-[1px]">{game.provider}</p>
                  </div>
                  <FavoriteStar size={18} inactiveStroke="#0E8FCF" activeColor="#0E8FCF" className="flex-shrink-0 ml-1"
                    item={{ type: 'game', id: `jackpot-${game.name}`, title: game.name, subtitle: game.provider, image: game.image, href: gameHref(game.name, game.image, game.provider) }} />
                </div>
                <div className="mt-[6px] bg-[#edf5ff] rounded-lg px-2 py-[5px]">
                  <p className="text-[8px] text-[#0E8FCF] font-semibold uppercase tracking-wide">Ödül Havuzu</p>
                  <p className="text-[11px] font-bold text-[#1a2332] tabular-nums leading-tight"><AnimatedAmount target={game.pool} /> ₺</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
