'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProviderPlay from './ProviderPlay'

const ACCENT = '#d97706'

const raceTypes = [
  { name: 'At Yarışı', short: 'At', img: '/icons/vrtrdrHorseRacing_5.png', color: '#d97706', every: 'Her 3 dk' },
  { name: 'Tazı Yarışı', short: 'Tazı', img: '/icons/vrtrdrGreyhounds_5.png', color: '#7c3aed', every: 'Her 2 dk' },
  { name: 'Motor Yarışı', short: 'Motor', svg: 'moto', color: '#e11d48', every: 'Her 4 dk' },
  { name: 'Speedway', short: 'Speedway', svg: 'flag', color: '#0E8FCF', every: 'Her 5 dk' },
  { name: 'Trotting', short: 'Trotting', img: '/icons/vrtrdrHorseRacing_5.png', color: '#27ae60', every: 'Her 4 dk' },
]

// Deterministic upcoming races (vary the labels a little by race type index).
function upcoming(typeIdx: number) {
  const base = [
    { no: 1421, mins: 1, secs: 12, runners: 8 },
    { no: 1422, mins: 3, secs: 40, runners: 6 },
    { no: 1423, mins: 6, secs: 5, runners: 10 },
    { no: 1424, mins: 9, secs: 22, runners: 7 },
    { no: 1425, mins: 12, secs: 48, runners: 8 },
  ]
  return base.map((r, i) => ({ ...r, no: r.no + typeIdx * 100, runners: ((r.runners + typeIdx) % 6) + 6 }))
}

const lastResults = [
  { no: 1420, order: [3, 7, 1] },
  { no: 1419, order: [5, 2, 8] },
  { no: 1418, order: [1, 4, 6] },
]

function TypeIcon({ t, on }: { t: typeof raceTypes[number]; on: boolean }) {
  if (t.svg === 'moto') return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? '#fff' : t.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17" r="3" /><circle cx="18.5" cy="17" r="3" /><path d="M5.5 17h6l4-6h3M12 11l-2-4H7" /></svg>
  if (t.svg === 'flag') return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? '#fff' : t.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V4M4 4h13l-2 4 2 4H4" /></svg>
  return <img src={t.img} alt="" width={22} height={22} style={{ objectFit: 'contain', filter: on ? 'brightness(0) invert(1)' : 'none' }} />
}

export default function GoldenRaceScreen() {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [play, setPlay] = useState<{ title: string; subtitle?: string } | null>(null)
  const type = raceTypes[active]
  const races = upcoming(active)
  const next = races[0]

  if (play) return <ProviderPlay title={play.title} subtitle={play.subtitle} accent={ACCENT} onBack={() => setPlay(null)} />

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="text-[16px] font-bold text-[#1a2332]">Golden Race</h1>
          <button onClick={() => router.push('/search')} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>
        </div>
      </div>

      {/* Race-type selector */}
      <div className="bg-white border-b border-[#e8ecf1]">
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-3 py-2">
          {raceTypes.map((t, i) => {
            const on = active === i
            return (
              <button key={t.name} onClick={() => setActive(i)} className={`flex flex-col items-center gap-[4px] flex-shrink-0 min-w-[64px] py-[6px] px-1 rounded-xl transition-colors ${on ? 'bg-[#fff7ed]' : ''}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: on ? t.color : `${t.color}18` }}>
                  <TypeIcon t={t} on={on} />
                </div>
                <span className={`text-[9px] font-semibold leading-none whitespace-nowrap ${on ? 'text-[#b45309]' : 'text-[#1a2332]'}`}>{t.short}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Next race hero */}
      <div className="px-4 pt-3">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#7c4a03] via-[#b45309] to-[#f59e0b] px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/80 font-semibold uppercase tracking-wide">Sıradaki {type.name}</p>
              <p className="text-[15px] font-extrabold text-white leading-tight mt-[2px]">Yarış No {next.no}</p>
              <p className="text-[10px] text-white/80 mt-[2px]">{next.runners} koşucu · {type.every}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-[3px]">
                <span className="bg-black/30 text-white text-[16px] font-extrabold rounded-md px-[8px] py-[4px] tabular-nums">{String(next.mins).padStart(2, '0')}</span>
                <span className="text-white font-extrabold">:</span>
                <span className="bg-black/30 text-white text-[16px] font-extrabold rounded-md px-[8px] py-[4px] tabular-nums">{String(next.secs).padStart(2, '0')}</span>
              </div>
              <p className="text-[8px] text-white/80 mt-1">başlamasına</p>
            </div>
          </div>
          <button onClick={() => setPlay({ title: `${type.name} · Yarış ${next.no}`, subtitle: `${next.runners} koşucu` })}
            className="mt-3 w-full h-[40px] rounded-full bg-white text-[#b45309] text-[13px] font-bold flex items-center justify-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#b45309"><polygon points="6 4 20 12 6 20 6 4" /></svg>
            Şimdi Oyna
          </button>
        </div>
      </div>

      {/* Upcoming races */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" /></svg>
          <span className="text-[13px] font-bold text-[#1a2332]">Yaklaşan Yarışlar</span>
        </div>
        <div className="flex flex-col gap-[8px]">
          {races.map((r) => (
            <div key={r.no} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-2.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fff7ed] flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-extrabold text-[#b45309]">{r.runners}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#1a2332]">Yarış No {r.no}</p>
                <p className="text-[9px] text-[#737B8C] mt-[1px]">{r.runners} koşucu · {type.name}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" /></svg>
                <span className="text-[11px] font-bold text-[#d97706] tabular-nums">{String(r.mins).padStart(2, '0')}:{String(r.secs).padStart(2, '0')}</span>
              </div>
              <button onClick={() => setPlay({ title: `${type.name} · Yarış ${r.no}`, subtitle: `${r.runners} koşucu` })} className="flex-shrink-0 bg-[#d97706] text-white text-[11px] font-bold rounded-full px-3.5 py-2">Bahis</button>
            </div>
          ))}
        </div>
      </div>

      {/* Last results */}
      <div className="px-4 pt-4">
        <p className="text-[13px] font-bold text-[#1a2332] mb-2">Son Sonuçlar</p>
        <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
          {lastResults.map((res) => (
            <div key={res.no} className="flex-shrink-0 bg-white rounded-xl border border-[#e8ecf1] px-3 py-2.5">
              <p className="text-[9px] text-[#737B8C] font-semibold mb-1.5">Yarış {res.no}</p>
              <div className="flex items-center gap-1.5">
                {res.order.map((n, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className={`w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-extrabold text-white ${i === 0 ? 'bg-[#f59e0b]' : i === 1 ? 'bg-[#94a3b8]' : 'bg-[#b45309]'}`}>{n}</span>
                    {i < res.order.length - 1 && <span className="text-[8px] text-[#cbd5e1]">›</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
