'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProviderPlay from './ProviderPlay'

const ACCENT = '#27ae60'

type CashTable = { name: string; game: string; stakes: string; players: number; max: number; avgPot: string; speed?: 'Hızlı' }
type Tournament = { name: string; buyin: string; prize: string; starts: string; registered: number; guaranteed?: boolean }
type SitGo = { name: string; buyin: string; seats: number; max: number }

const cashTables: CashTable[] = [
  { name: 'Istanbul Hold’em', game: "No Limit Hold'em", stakes: '₺1 / ₺2', players: 6, max: 6, avgPot: '₺84' },
  { name: 'Bosphorus High', game: "No Limit Hold'em", stakes: '₺5 / ₺10', players: 8, max: 9, avgPot: '₺420' },
  { name: 'Ankara Omaha', game: 'Pot Limit Omaha', stakes: '₺2 / ₺5', players: 5, max: 6, avgPot: '₺210' },
  { name: 'Turbo Cash', game: "No Limit Hold'em", stakes: '₺0.5 / ₺1', players: 4, max: 6, avgPot: '₺38', speed: 'Hızlı' },
  { name: 'İzmir Deep Stack', game: "No Limit Hold'em", stakes: '₺10 / ₺20', players: 7, max: 9, avgPot: '₺960' },
]

const tournaments: Tournament[] = [
  { name: 'Günün Ana Turnuvası', buyin: '₺250', prize: '₺500.000', starts: '00:18:42', registered: 1284, guaranteed: true },
  { name: 'Turbo Bounty', buyin: '₺100', prize: '₺120.000', starts: '00:42:10', registered: 642 },
  { name: 'Haftalık Freeroll', buyin: 'Ücretsiz', prize: '₺25.000', starts: '02:05:33', registered: 3120 },
  { name: 'Yüksek Bahis Şampiyonası', buyin: '₺1.000', prize: '₺1.000.000', starts: '05:30:00', registered: 214, guaranteed: true },
]

const sitgos: SitGo[] = [
  { name: 'Sit & Go 6-Max', buyin: '₺50', seats: 4, max: 6 },
  { name: 'Sit & Go Heads-Up', buyin: '₺100', seats: 1, max: 2 },
  { name: 'Sit & Go Turbo 9-Max', buyin: '₺25', seats: 7, max: 9 },
  { name: 'Hyper Turbo 3-Max', buyin: '₺75', seats: 2, max: 3 },
]

const tabs = ['Nakit Masalar', 'Turnuvalar', 'Sit & Go']

function Seats({ n, max }: { n: number; max: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`w-[6px] h-[6px] rounded-full ${i < n ? 'bg-[#27ae60]' : 'bg-[#d7dde5]'}`} />
      ))}
      <span className="text-[9px] font-semibold text-[#737B8C] ml-1">{n}/{max}</span>
    </div>
  )
}

export default function PokerScreen() {
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const [play, setPlay] = useState<{ title: string; subtitle?: string } | null>(null)

  if (play) return <ProviderPlay title={play.title} subtitle={play.subtitle} accent={ACCENT} onBack={() => setPlay(null)} />

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="text-[16px] font-bold text-[#1a2332]">Poker</h1>
          <button onClick={() => router.push('/search')} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 pt-3">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0b3d24] via-[#0f5132] to-[#166b43] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C9 6.5 5 9.5 5 13.5 5 17 8 19 12 19s7-2 7-5.5C19 9.5 15 6.5 12 2zm-1 19h2l-.5-3h-1L11 21z" /></svg>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-white leading-tight">PokerAdonis</p>
              <p className="text-[10px] text-white/75 mt-[2px]">7/24 canlı masalar · Şans değil, strateji</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse-dot" />
              <span className="text-[11px] font-bold text-white tabular-nums">8.421</span>
              <span className="text-[9px] text-white/70">oyuncu çevrimiçi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-white tabular-nums">312</span>
              <span className="text-[9px] text-white/70">aktif masa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3">
        <div className="bg-[#edf5ff] rounded-full p-[3px] flex">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className={`flex-1 py-[7px] rounded-full text-[11px] font-semibold transition-all ${tab === i ? 'bg-[#27ae60] text-white shadow-sm' : 'text-[#737B8C]'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Nakit Masalar */}
      {tab === 0 && (
        <div className="px-4 pt-3 flex flex-col gap-[8px]">
          {cashTables.map((c) => (
            <div key={c.name} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f7ef] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#27ae60"><path d="M12 2C9 6.5 5 9.5 5 13.5 5 17 8 19 12 19s7-2 7-5.5C19 9.5 15 6.5 12 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[12px] font-bold text-[#1a2332] truncate">{c.name}</p>
                  {c.speed && <span className="text-[7px] font-bold text-white bg-[#f59e0b] rounded px-[4px] py-[1px] uppercase">{c.speed}</span>}
                </div>
                <p className="text-[9px] text-[#737B8C] mt-[1px]">{c.game} · Ort. pot {c.avgPot}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] font-bold text-[#27ae60]">{c.stakes}</span>
                  <Seats n={c.players} max={c.max} />
                </div>
              </div>
              <button onClick={() => setPlay({ title: c.name, subtitle: `${c.game} · ${c.stakes}` })}
                className="flex-shrink-0 bg-[#27ae60] text-white text-[11px] font-bold rounded-full px-4 py-2 disabled:opacity-40" disabled={c.players >= c.max}>
                {c.players >= c.max ? 'Dolu' : 'Katıl'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Turnuvalar */}
      {tab === 1 && (
        <div className="px-4 pt-3 flex flex-col gap-[8px]">
          {tournaments.map((t) => (
            <div key={t.name} className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[#f8fafc] border-b border-[#f0f2f5]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-[12px] font-bold text-[#1a2332] truncate">{t.name}</p>
                  {t.guaranteed && <span className="text-[7px] font-bold text-[#27ae60] bg-[#e8f7ef] rounded px-[4px] py-[1px] uppercase flex-shrink-0">GTD</span>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" /></svg>
                  <span className="text-[10px] font-bold text-[#e74c3c] tabular-nums">{t.starts}</span>
                </div>
              </div>
              <div className="px-3 py-2.5 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[8px] text-[#737B8C] uppercase font-semibold">Ödül Havuzu</p>
                  <p className="text-[13px] font-extrabold text-[#1a2332]">{t.prize}</p>
                </div>
                <div>
                  <p className="text-[8px] text-[#737B8C] uppercase font-semibold">Giriş</p>
                  <p className="text-[12px] font-bold text-[#27ae60]">{t.buyin}</p>
                </div>
                <div>
                  <p className="text-[8px] text-[#737B8C] uppercase font-semibold">Kayıtlı</p>
                  <p className="text-[12px] font-bold text-[#1a2332]">{t.registered.toLocaleString('tr-TR')}</p>
                </div>
                <button onClick={() => setPlay({ title: t.name, subtitle: `Giriş ${t.buyin} · ${t.prize}` })} className="flex-shrink-0 bg-[#27ae60] text-white text-[11px] font-bold rounded-full px-3.5 py-2">Kayıt</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sit & Go */}
      {tab === 2 && (
        <div className="px-4 pt-3 flex flex-col gap-[8px]">
          {sitgos.map((s) => (
            <div key={s.name} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f7ef] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#1a2332] truncate">{s.name}</p>
                <div className="mt-1.5"><Seats n={s.seats} max={s.max} /></div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[8px] text-[#737B8C] uppercase font-semibold">Giriş</p>
                <p className="text-[12px] font-bold text-[#27ae60]">{s.buyin}</p>
              </div>
              <button onClick={() => setPlay({ title: s.name, subtitle: `Sit & Go · ${s.buyin}` })} className="flex-shrink-0 bg-[#27ae60] text-white text-[11px] font-bold rounded-full px-4 py-2">Katıl</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
