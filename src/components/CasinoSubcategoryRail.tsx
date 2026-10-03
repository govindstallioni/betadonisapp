import Link from 'next/link'
import { CASINO_SUBCATEGORIES } from '@/components/slotGamesData'

// ── "En Çok Oynananlar" (Most Played) rail — v6.6 task 29 ───────────────────
// Left-right scrollable tiles for the casino sub-categories, each with its
// name and an image (game art where we have it, otherwise a gradient + emoji).
export default function CasinoSubcategoryRail() {
  return (
    <div className="flex gap-[10px] overflow-x-auto scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
      {CASINO_SUBCATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/slots/${c.slug}`}
          style={{ scrollSnapAlign: 'start', background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
          className="relative flex-shrink-0 w-[112px] h-[128px] rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
        >
          {c.image && <img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <span className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[17px] leading-none">{c.emoji}</span>
          <span className="absolute bottom-2 left-2 right-2 text-[11px] font-bold text-white leading-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{c.label}</span>
        </Link>
      ))}
    </div>
  )
}
