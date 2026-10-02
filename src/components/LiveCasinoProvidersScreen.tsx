'use client'

import { useRouter } from 'next/navigation'
import { providers } from './liveCasinoData'

// Dedicated "Sağlayıcılar" directory page (task 25) — reached from the new
// shortcut bar on /live-casino, reference: betadonis.store/saglayicilar.png.
// Picking a provider filters /live-casino/tumu down to its tables.
export default function LiveCasinoProvidersScreen() {
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative pb-10">
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Sağlayıcılar</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4 pt-4 grid grid-cols-2 gap-[10px]">
        {providers.map((p) => (
          <button
            key={p.name}
            onClick={() => router.push(`/live-casino/tumu?provider=${encodeURIComponent(p.name)}`)}
            className="flex items-center gap-2.5 bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 text-left hover:bg-[#f8fafc] active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {p.logo
                ? <img src={p.logo} alt={p.name} className="w-8 h-8 object-contain" />
                : <span className="text-[12px] font-bold text-[#0E8FCF]">{p.name.slice(0, 2).toUpperCase()}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#1a2332] leading-tight truncate">{p.name}</p>
              <p className="text-[9px] text-[#737B8C] mt-[2px]">{p.tables} masa</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
