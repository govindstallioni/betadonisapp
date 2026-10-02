'use client'

import { useRouter } from 'next/navigation'
import { CATEGORY_SLUGS, kategoriler } from './liveCasinoData'

// Dedicated "Kategoriler" directory page (task 25) — reached from the new
// shortcut bar on /live-casino, reference: betadonis.store/categories.png.
export default function LiveCasinoCategoriesScreen() {
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative pb-10">
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Kategoriler</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4 pt-4 grid grid-cols-2 gap-[10px]">
        <button
          onClick={() => router.push('/live-casino/tumu')}
          className="flex items-center gap-2.5 bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 text-left active:scale-[0.98] transition-transform"
        >
          <span className="w-10 h-10 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
          </span>
          <span className="text-[12px] font-semibold text-[#1a2332]">Tümü</span>
        </button>

        {kategoriler.map((cat) => {
          const slug = CATEGORY_SLUGS.find((c) => c.label === cat.name)?.slug ?? 'tumu'
          return (
            <button
              key={cat.name}
              onClick={() => router.push(`/live-casino/${slug}`)}
              className="relative rounded-xl overflow-hidden h-[80px] active:scale-[0.98] transition-transform"
            >
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <span className="absolute bottom-2 left-3 text-[12px] font-bold text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
