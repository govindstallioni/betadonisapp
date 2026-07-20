'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ── Sanal Bahis (iframe provider) ───────────────────────────────────────────
// Like Golden Race and Poker, virtual betting is served by an external provider
// inside an <iframe>. We keep a virtual-sport selector strip on top; picking a
// product loads that provider game. Supply the real embed URL per sport in
// `src` (or wire to an env var) to go live; until then a placeholder renders.

const virtualSports = [
  { name: 'Sanal Futbol',      short: 'Futbol',   freq: 'Her 3 dk',  icon: '/icons/vrtrdrSoccer_5.png',      color: '#0E8FCF', src: '' },
  { name: 'Sanal Basketbol',   short: 'Basketbol', freq: 'Her 2 dk', icon: '/icons/vrtrdrBasketball_5.png',  color: '#ea580c', src: '' },
  { name: 'Sanal Tenis',       short: 'Tenis',    freq: 'Her 1 dk',  icon: '/icons/vrtrdrTennis_5.png',      color: '#27ae60', src: '' },
  { name: 'Sanal At Yarışı',   short: 'At Yarışı', freq: 'Her 5 dk', icon: '/icons/vrtrdrHorseRacing_5.png', color: '#d97706', src: '' },
  { name: 'Sanal Tazı Yarışı', short: 'Tazı',     freq: 'Her 4 dk',  icon: '/icons/vrtrdrGreyhounds_5.png',  color: '#7c3aed', src: '' },
  { name: 'Sanal Beyzbol',     short: 'Beyzbol',  freq: 'Her 3 dk',  icon: '/icons/vrtrdrBaseball_5.png',    color: '#e11d48', src: '' },
]

export default function SanalBahisScreen() {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const sport = virtualSports[active]

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen flex flex-col">
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="text-[16px] font-bold text-[#1a2332]">Sanal Bahis</h1>
          <button onClick={() => router.push('/search')} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>
        </div>
      </div>

      {/* ── Virtual-sport selector strip ── */}
      <div className="bg-white border-b border-[#e8ecf1] flex-shrink-0">
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-3 py-2">
          {virtualSports.map((s, i) => {
            const on = active === i
            return (
              <button
                key={s.name}
                onClick={() => setActive(i)}
                className={`flex flex-col items-center gap-[4px] flex-shrink-0 min-w-[62px] py-[6px] px-1 rounded-xl transition-colors ${on ? 'bg-[#edf5ff]' : ''}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: on ? s.color : `${s.color}18` }}>
                  <img src={s.icon} alt="" width={22} height={22} style={{ objectFit: 'contain', filter: on ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
                <span className={`text-[9px] font-semibold leading-none whitespace-nowrap ${on ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{s.short}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Provider iframe (or placeholder) ── */}
      {sport.src ? (
        <iframe
          key={sport.name}
          src={sport.src}
          title={sport.name}
          className="flex-1 w-full border-0 mb-[64px]"
          allow="autoplay; fullscreen; payment"
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-28">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${sport.color}18` }}>
            <img src={sport.icon} alt="" width={34} height={34} style={{ objectFit: 'contain' }} />
          </div>
          <p className="text-[15px] font-bold text-[#1a2332]">{sport.name}</p>
          <p className="text-[11px] text-[#0E8FCF] font-semibold mt-[2px]">{sport.freq} · kesintisiz</p>
          <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed max-w-[280px]">
            {sport.name} içeriği harici sağlayıcıdan tam ekran iframe olarak yüklenir. Sonuçları beklemeden anında bahis yapın.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#fff7ed] border border-[#f59e0b]/30 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            <span className="text-[10px] font-semibold text-[#b45309]">Sağlayıcı bağlantısı bekleniyor</span>
          </div>
        </div>
      )}
    </div>
  )
}
