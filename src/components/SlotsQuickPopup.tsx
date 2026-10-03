'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import FavoriteStar from '@/components/FavoriteStar'
import { gameHref } from '@/components/gameHref'
import { CASINO_SUBCATEGORIES, crashGames, popularSlots } from '@/components/slotGamesData'
import { artFallback } from './placeholderGameArt'

// ── Slots shortcut popup (v6.6 task 29) ─────────────────────────────────────
// Opened from the "Slotlar" icon in the top category tabs. "Tümü" goes to the
// full slot games page; every other entry is an icon + text shortcut to the
// same /slots/[slug] pages used elsewhere; "En Çok Kazandıran" is a
// scrollable rail of the biggest-multiplier games.

const SLOT_SHORTCUTS = [
  { slug: 'populer', label: 'Popüler', emoji: '🔥' },
  { slug: 'yeni-oyunlar', label: 'Yeni Oyunlar', emoji: '✨' },
  { slug: 'video-slots', label: 'Video Slots', emoji: '🎬' },
  { slug: 'jackpot', label: 'Jackpot', emoji: '💰' },
  { slug: 'megaways', label: 'Megaways', emoji: '⚡' },
  { slug: 'kazi-kazan', label: 'Kazı Kazan', emoji: '🪙' },
]

// Biggest headline multipliers first, then the most-played slots.
const MOST_WINNING = [
  ...[...crashGames].sort((a, b) => parseFloat(b.mult) - parseFloat(a.mult)).map((g) => ({ ...g, badge: g.mult })),
  ...popularSlots.slice(0, 4).map((g) => ({ ...g, badge: '' })),
]

function Shortcut({ href, emoji, label, onClose }: { href: string; emoji: string; label: string; onClose: () => void }) {
  return (
    <Link href={href} onClick={onClose} className="flex flex-col items-center gap-[5px] active:scale-[0.97] transition-transform">
      <span className="w-[52px] h-[52px] rounded-2xl bg-[#edf5ff] border border-[#e8ecf1] flex items-center justify-center text-[24px] leading-none">{emoji}</span>
      <span className="text-[10px] font-medium text-[#1a2332] text-center leading-tight">{label}</span>
    </Link>
  )
}

export default function SlotsQuickPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Slotlar"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] max-h-[85vh] overflow-y-auto bg-white rounded-t-2xl px-[16px] pt-[14px] pb-[24px]"
      >
        <div className="flex items-center justify-between mb-[12px]">
          <h2 className="text-[16px] font-semibold text-[#1a2332]">Slotlar</h2>
          <button onClick={onClose} aria-label="Kapat" className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#737B8C]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        {/* All */}
        <Link
          href="/slots"
          onClick={onClose}
          className="h-[44px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-semibold flex items-center justify-center gap-[8px] mb-[16px]"
        >
          <span className="text-[16px] leading-none">🎰</span>
          Tümü
        </Link>

        {/* Casino sub-categories */}
        <p className="text-[12px] font-bold text-[#1a2332] mb-[10px]">Casino</p>
        <div className="grid grid-cols-4 gap-x-[8px] gap-y-[14px] mb-[18px]">
          {CASINO_SUBCATEGORIES.map((c) => (
            <Shortcut key={c.slug} href={`/slots/${c.slug}`} emoji={c.emoji} label={c.label} onClose={onClose} />
          ))}
        </div>

        {/* Slot categories */}
        <p className="text-[12px] font-bold text-[#1a2332] mb-[10px]">Kategoriler</p>
        <div className="grid grid-cols-4 gap-x-[8px] gap-y-[14px] mb-[18px]">
          {SLOT_SHORTCUTS.map((c) => (
            <Shortcut key={c.slug} href={`/slots/${c.slug}`} emoji={c.emoji} label={c.label} onClose={onClose} />
          ))}
        </div>

        {/* Most winning */}
        <p className="text-[12px] font-bold text-[#1a2332] mb-[10px]">En Çok Kazandıran</p>
        <div className="flex gap-[8px] overflow-x-auto scrollbar-hide -mx-[16px] px-[16px]">
          {MOST_WINNING.map((g) => (
            <Link key={g.name} href={gameHref(g.name, g.image, g.provider)} onClick={onClose} className="flex-shrink-0 w-[96px]">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#e8ecf1]">
                <img src={g.image} alt={g.name} className="w-full h-full object-cover" onError={artFallback(g.name, g.provider)} />
                {g.badge && (
                  <span className="absolute bottom-1 left-1 bg-black/70 text-[#22c55e] text-[8px] font-bold px-[4px] py-[1px] rounded-md tabular-nums">{g.badge}</span>
                )}
                <FavoriteStar
                  size={11}
                  inactiveStroke="#fff"
                  activeColor="#f5b301"
                  className="absolute top-1 right-1 flex items-center justify-center w-[17px] h-[17px] rounded-full bg-black/40"
                  item={{ type: 'game', id: `slot-${g.name}`, title: g.name, subtitle: g.provider, image: g.image, href: gameHref(g.name, g.image, g.provider) }}
                />
              </div>
              <p className="text-[9px] font-semibold text-[#1a2332] mt-[3px] leading-tight truncate">{g.name}</p>
              <p className="text-[7px] text-[#737B8C] leading-tight truncate">{g.provider}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
