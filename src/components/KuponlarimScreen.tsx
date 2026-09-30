'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import Footer from './Footer'
import {
  BetCard, CasinoHistoryRow, ClockBadge, Mascot, sampleBets, sampleCasinoBets, sortKey, useSettledCoupons,
  type Bet, type CasinoBet,
} from './BetHistory'

// ── Kuponlarım (work3 tasks 7 + 15, kupon2.png) ─────────────────────────────
// The user's coupons on their own page, separate from Hareketler (/history),
// which stays the transaction list. Opened from the account menu's KUPONLARIM
// row and the bottom bar's BAHİS tab. Opens on "Bekleyenler" (task 7), and the
// title dropdown switches to casino results instead of coupons.

type Section = 'kupon' | 'casino'
const SECTIONS: { key: Section; label: string; title: string }[] = [
  { key: 'kupon', label: 'Kuponlar', title: 'Kuponlarım' },
  { key: 'casino', label: 'Casino', title: 'Casino' },
]

type Tab = 'all' | 'won' | 'pending'
const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Hepsi' },
  { key: 'won', label: 'Kazanmış' },
  { key: 'pending', label: 'Bekleyenler' },
]

// Filtre periods. Default is the last 24 hours, as on Betadonis.
type Period = '24h' | '7d' | '30d' | '90d' | 'all'
const PERIODS: { key: Period; label: string; empty: string; ms: number }[] = [
  { key: '24h', label: 'Son 24 Saat', empty: 'Son 24 saate', ms: 24 * 3600e3 },
  { key: '7d', label: 'Son 7 Gün', empty: 'Son 7 güne', ms: 7 * 24 * 3600e3 },
  { key: '30d', label: 'Son 30 Gün', empty: 'Son 30 güne', ms: 30 * 24 * 3600e3 },
  { key: '90d', label: 'Son 3 Ay', empty: 'Son 3 aya', ms: 90 * 24 * 3600e3 },
  { key: 'all', label: 'Tümü', empty: 'Seçilen döneme', ms: Infinity },
]

// "12.07.2026 21:45" → epoch ms (local time)
function betTime(date: string) {
  const [d, m, y] = date.split(' ')[0].split('.').map(Number)
  const [hh, mm] = (date.split(' ')[1] || '00:00').split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm).getTime()
}

const OPEN_KEY = 'bta_kuponlarim_open'

export default function KuponlarimScreen() {
  const router = useRouter()
  const { loaded, isLoggedIn } = useAuth()
  const coupons = useSettledCoupons()
  const [section, setSection] = useState<Section>('kupon')
  const [tab, setTab] = useState<Tab>('pending')
  const [period, setPeriod] = useState<Period>('24h')
  const [draftPeriod, setDraftPeriod] = useState<Period>('24h')
  const [sheet, setSheet] = useState<'section' | 'filter' | null>(null)
  const [openBets, setOpenBets] = useState<Set<string>>(() => new Set())
  const [now, setNow] = useState(0)

  // Client-only clock + expanded-coupon restore (no hydration mismatch).
  useEffect(() => {
    setNow(Date.now())
    try {
      const raw = localStorage.getItem(OPEN_KEY)
      if (raw) setOpenBets(new Set(JSON.parse(raw) as string[]))
    } catch {}
  }, [])

  function toggleBet(id: string) {
    setOpenBets(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      try { localStorage.setItem(OPEN_KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }

  const p = PERIODS.find(x => x.key === period)!
  const source: (Bet | CasinoBet)[] = section === 'kupon' ? [...coupons, ...sampleBets] : sampleCasinoBets
  const bets = source
    .filter(b => now === 0 || now - betTime(b.date) <= p.ms)
    .filter(b => tab === 'all' || b.status === tab)
    .sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)))

  const current = SECTIONS.find(s => s.key === section)!
  const noun = section === 'kupon' ? 'kupon' : 'casino'

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back()
    else router.push('/')
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen relative">
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-3 pb-4 border-b border-[#e8ecf1]">
        <div className="flex items-center justify-between">
          <button onClick={goBack} aria-label="Geri" className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button onClick={() => setSheet('section')} aria-haspopup="dialog" className="flex items-center gap-[6px]">
            <h1 className="text-[20px] font-bold text-[#1a2332]">{current.title}</h1>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div className="w-8 h-8" />
        </div>

        {/* Hepsi / Kazanmış / Bekleyenler + Filtrele */}
        <div className="flex items-center gap-[8px] mt-4">
          <div className="flex-1 flex rounded-lg border border-[#e0e5ec] overflow-hidden">
            {TABS.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                aria-pressed={tab === t.key}
                className={`flex-1 py-[9px] text-[12px] font-semibold transition-colors ${i > 0 ? 'border-l border-[#e0e5ec]' : ''} ${tab === t.key ? 'bg-[#0E8FCF] text-white' : 'text-[#1a2332]'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setDraftPeriod(period); setSheet('filter') }}
            className="flex items-center gap-[6px] px-[12px] py-[9px] rounded-lg border border-[#e0e5ec] text-[12px] font-semibold text-[#1a2332] flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
            Filtrele
          </button>
        </div>
        {period !== '24h' && (
          <p className="text-[10px] text-[#737B8C] mt-2">Dönem: <span className="font-semibold text-[#0E8FCF]">{p.label}</span></p>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-3 pt-3">
        {!loaded ? null : !isLoggedIn ? (
          <div className="flex flex-col items-center px-5 pt-10 pb-6">
            <ClockBadge />
            <p className="text-[13px] text-[#737B8C] font-medium text-center leading-relaxed mt-5">
              Kuponlarınızı görmek için giriş yapın
            </p>
            <div className="flex gap-[10px] w-full mt-6">
              <Link href="/login" className="flex-1 h-[42px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center">Giriş Yap</Link>
              <Link href="/register" className="flex-1 h-[42px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-semibold flex items-center justify-center">Kayıt Ol</Link>
            </div>
          </div>
        ) : bets.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e8ecf1] px-5 py-5 text-center">
            <p className="text-[13px] text-[#1a2332] leading-relaxed">
              {p.empty} ait {noun} verisi bulunmamaktadır.<br />Filtre ayarlarını uygulayın.
            </p>
            {period !== 'all' && (
              <button onClick={() => setPeriod('all')} className="mt-3 text-[12px] font-semibold text-[#0E8FCF]">
                Tüm dönemi göster
              </button>
            )}
            {section === 'kupon' && tab !== 'won' && (
              <div className="flex justify-center mt-2 [&_svg]:w-[110px] [&_svg]:h-[110px]"><Mascot /></div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-[8px]">
            {bets.map(b => 'legs' in b ? (
              <BetCard key={b.id} bet={b} open={openBets.has(b.id)} onToggle={() => toggleBet(b.id)} />
            ) : (
              <CasinoHistoryRow key={b.id} bet={b} />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-24">
        <Footer />
      </div>

      {/* ── Section sheet (Kuponlar / Casino) ── */}
      {sheet === 'section' && (
        <>
          <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70]" onClick={() => setSheet(null)} />
          <div role="dialog" aria-label="Geçmiş Türü" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-[#d0d5dd] rounded-full" /></div>
            <h3 className="text-[15px] font-bold text-[#1a2332] text-center pb-3">Geçmiş Türü</h3>
            <div className="px-4 pb-8">
              {SECTIONS.map((s, i) => {
                const on = section === s.key
                return (
                  <button
                    key={s.key}
                    onClick={() => { setSection(s.key); setSheet(null) }}
                    className={`w-full flex items-center justify-between py-[14px] ${i < SECTIONS.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
                  >
                    <span className={`text-[13px] font-medium ${on ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{s.label}</span>
                    <span className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${on ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                      {on && <span className="w-[10px] h-[10px] rounded-full bg-[#0E8FCF]" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Filter sheet (period) ── */}
      {sheet === 'filter' && (
        <>
          <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70]" onClick={() => setSheet(null)} />
          <div role="dialog" aria-label="Filtrele" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-[#d0d5dd] rounded-full" /></div>
            <div className="relative flex items-center justify-center py-3 border-b border-[#f0f2f5]">
              <h3 className="text-[16px] font-bold text-[#1a2332]">Filtrele</h3>
              <button onClick={() => setSheet(null)} aria-label="Filtreyi kapat" className="absolute right-3 top-1/2 -translate-y-1/2 w-[28px] h-[28px] rounded-full bg-[#f1f5f9] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="px-4 pt-4 pb-6">
              <p className="text-[12px] font-semibold text-[#1a2332] mb-[10px]">Dönem Seçiniz</p>
              <div className="flex flex-wrap gap-[8px] mb-6">
                {PERIODS.map(x => (
                  <button
                    key={x.key}
                    onClick={() => setDraftPeriod(x.key)}
                    className={`px-[16px] py-[8px] rounded-full text-[12px] font-semibold transition-all ${draftPeriod === x.key ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332] border border-[#e8ecf1]'}`}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setPeriod(draftPeriod); setSheet(null) }}
                className="w-full py-[13px] rounded-xl text-[13px] font-bold tracking-wide text-white bg-[#0E8FCF]"
              >
                FİLTRELE
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
