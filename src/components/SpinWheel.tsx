'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { DAY_MULTIPLIERS, WHEEL_WINDOW_DAYS } from '@/data/wheelData'

// ── Prize segments ────────────────────────────────────────────────────────
// The client's exact 18-item list (their "10 EUR Spin Again" token read as
// two segments — see plan's scope decision). wheelLabel is the short text
// drawn on the wedge; fullLabel is the spelled-out version used in messages.
type SegmentKind = 'cash' | 'spinAgain' | 'empty' | 'extraDay'
type Segment = {
  wheelLabel: string
  fullLabel: string
  kind: SegmentKind
  amount?: number
  days?: number
  color: string
  weight: number
}

const SEGMENTS: Segment[] = [
  { wheelLabel: 'TEKRAR', fullLabel: 'Tekrar Çevir', kind: 'spinAgain', color: '#0891B2', weight: 8 },
  { wheelLabel: '10₺', fullLabel: '10 ₺', kind: 'cash', amount: 10, color: '#2563EB', weight: 14 },
  { wheelLabel: 'TEKRAR', fullLabel: 'Tekrar Çevir', kind: 'spinAgain', color: '#0E9F6E', weight: 8 },
  { wheelLabel: 'TEKRAR', fullLabel: 'Tekrar Çevir', kind: 'spinAgain', color: '#0891B2', weight: 8 },
  { wheelLabel: '5₺', fullLabel: '5 ₺', kind: 'cash', amount: 5, color: '#059669', weight: 18 },
  { wheelLabel: 'TEKRAR', fullLabel: 'Tekrar Çevir', kind: 'spinAgain', color: '#0E9F6E', weight: 8 },
  { wheelLabel: '15₺', fullLabel: '15 ₺', kind: 'cash', amount: 15, color: '#7C3AED', weight: 8 },
  { wheelLabel: '17₺', fullLabel: '17 ₺', kind: 'cash', amount: 17, color: '#DB2777', weight: 6 },
  { wheelLabel: 'BOŞ', fullLabel: 'Boş', kind: 'empty', color: '#6B7280', weight: 10 },
  { wheelLabel: '+3 GÜN', fullLabel: '3 Ekstra Gün', kind: 'extraDay', days: 3, color: '#EA580C', weight: 2 },
  { wheelLabel: 'TEKRAR', fullLabel: 'Tekrar Çevir', kind: 'spinAgain', color: '#0891B2', weight: 8 },
  { wheelLabel: '5₺', fullLabel: '5 ₺', kind: 'cash', amount: 5, color: '#059669', weight: 18 },
  { wheelLabel: '2₺', fullLabel: '2 ₺', kind: 'cash', amount: 2, color: '#D97706', weight: 22 },
  { wheelLabel: '+1 GÜN', fullLabel: '1 Ekstra Gün', kind: 'extraDay', days: 1, color: '#F59E0B', weight: 6 },
  { wheelLabel: '17₺', fullLabel: '17 ₺', kind: 'cash', amount: 17, color: '#DB2777', weight: 6 },
  { wheelLabel: 'BOŞ', fullLabel: 'Boş', kind: 'empty', color: '#6B7280', weight: 10 },
  { wheelLabel: 'TEKRAR', fullLabel: 'Tekrar Çevir', kind: 'spinAgain', color: '#0E9F6E', weight: 8 },
  { wheelLabel: '10₺', fullLabel: '10 ₺', kind: 'cash', amount: 10, color: '#2563EB', weight: 14 },
]
const N = SEGMENTS.length
const SEG = 360 / N

const LS_KEY = 'bta_wheel_last' // 'YYYY-M-D' of the last spin
const LS_PRIZE = 'bta_wheel_prize' // last prize label

const dayKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` }
const msToMidnight = () => { const now = new Date(); const m = new Date(now); m.setHours(24, 0, 0, 0); return m.getTime() - now.getTime() }
const fmtCountdown = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = String(Math.floor(s / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

// Weighted random segment index.
function pickWin() {
  const total = SEGMENTS.reduce((a, s) => a + s.weight, 0)
  let r = Math.random() * total
  for (let i = 0; i < N; i++) { r -= SEGMENTS[i].weight; if (r <= 0) return i }
  return N - 1
}

export default function SpinWheel() {
  const { loaded, isLoggedIn, adjustBalance, wheel, addExtraDays } = useAuth()
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<Segment | null>(null)
  const [resultAmount, setResultAmount] = useState(0)
  const [resultMultiplier, setResultMultiplier] = useState(1)
  const [spinAgainNotice, setSpinAgainNotice] = useState(false)
  const [spunToday, setSpunToday] = useState(false)
  const [lastPrize, setLastPrize] = useState<string | null>(null)
  const [countdown, setCountdown] = useState('')
  const [loginPrompt, setLoginPrompt] = useState(false)
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Restore daily state on mount (client-only).
  useEffect(() => {
    try {
      if (localStorage.getItem(LS_KEY) === dayKey()) {
        setSpunToday(true)
        setLastPrize(localStorage.getItem(LS_PRIZE))
      }
    } catch {}
  }, [])

  // Countdown ticker while the spin is used up for today.
  useEffect(() => {
    if (!spunToday) { if (cdRef.current) clearInterval(cdRef.current); return }
    const tick = () => {
      const ms = msToMidnight()
      setCountdown(fmtCountdown(ms))
      if (ms <= 0) { setSpunToday(false); setResult(null); setLastPrize(null); try { localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_PRIZE) } catch {} }
    }
    tick()
    cdRef.current = setInterval(tick, 1000)
    return () => { if (cdRef.current) clearInterval(cdRef.current) }
  }, [spunToday])

  // Lucky Wheel eligibility: first-deposit gated, running on a 14(+extra)-day window.
  const needsDeposit = loaded && isLoggedIn && wheel.firstDepositAt === null
  const dayNumber = wheel.firstDepositAt ? Math.floor((Date.now() - wheel.firstDepositAt) / 86400000) + 1 : 0
  const windowTotal = WHEEL_WINDOW_DAYS + wheel.extraDays
  const windowExpired = loaded && isLoggedIn && wheel.firstDepositAt !== null && dayNumber > windowTotal
  const multiplier = dayNumber > 0 ? DAY_MULTIPLIERS[(dayNumber - 1) % 7] : 1

  const spin = useCallback(() => {
    if (spinning || spunToday) return
    if (loaded && !isLoggedIn) { setLoginPrompt(true); return }
    if (needsDeposit || windowExpired) return
    const win = pickWin()
    const seg = SEGMENTS[win]
    setSpinning(true)
    setResult(null)
    setSpinAgainNotice(false)
    // Land segment `win` centre under the top pointer. Segment i centre sits at
    // (i*SEG + SEG/2) clockwise from top; rotate forward by whole turns minus that.
    const target = rotation + 360 * 6 + (360 - (win * SEG + SEG / 2)) - (rotation % 360)
    setRotation(target)
    window.setTimeout(() => {
      setSpinning(false)
      if (seg.kind === 'spinAgain') {
        // Bonus re-spin: doesn't consume the day's spin or credit anything.
        setSpinAgainNotice(true)
        window.setTimeout(() => { setSpinAgainNotice(false); spin() }, 900)
        return
      }
      setResult(seg)
      setSpunToday(true)
      try { localStorage.setItem(LS_KEY, dayKey()); localStorage.setItem(LS_PRIZE, seg.fullLabel) } catch {}
      if (seg.kind === 'cash') {
        const credited = Math.round(seg.amount! * multiplier * 100) / 100
        setResultAmount(credited)
        setResultMultiplier(multiplier)
        adjustBalance(credited)
      } else if (seg.kind === 'extraDay') {
        addExtraDays(seg.days!)
      }
      // 'empty' needs no further action beyond locking the day.
    }, 4300)
  }, [spinning, spunToday, loaded, isLoggedIn, needsDeposit, windowExpired, rotation, multiplier, adjustBalance, addExtraDays])

  return (
    <div>
      {/* ── Wheel stage ── */}
      <div className="relative rounded-2xl overflow-hidden px-4 pt-5 pb-5 flex flex-col items-center"
        style={{ background: 'linear-gradient(160deg, #2a0a4a 0%, #0d1b2a 55%, #1a0533 100%)' }}>

        {/* Title plaque */}
        <div className="relative z-30 rounded-lg px-5 py-[7px] mb-2"
          style={{
            background: 'linear-gradient(180deg, #3a3f4a 0%, #14171d 55%, #24272e 100%)',
            border: '1px solid #565c68',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 3px rgba(0,0,0,0.5), 0 3px 8px rgba(0,0,0,0.4)',
          }}>
          <span className="text-[15px] font-black tracking-[0.12em] text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(180deg, #fff 0%, #cfd3da 60%, #8b909c 100%)', textShadow: '0 1px 0 rgba(0,0,0,0.6)' }}>
            ŞANS ÇARKI
          </span>
        </div>

        {/* Pointer */}
        <div className="relative w-[248px] h-[248px] flex items-center justify-center">
          <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 z-30 w-[22px] h-[22px] rotate-45 rounded-[3px]"
            style={{
              background: 'linear-gradient(135deg, #fff7d6 0%, #ffd700 35%, #b8860b 75%, #8a6508 100%)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.5), inset -2px -2px 3px rgba(0,0,0,0.35), inset 2px 2px 3px rgba(255,255,255,0.6)',
            }} />

          {/* Gold outer ring */}
          <div className="absolute inset-[-6px] rounded-full" style={{ background: 'conic-gradient(from 0deg, #b8860b, #ffd700, #b8860b, #ffd700, #b8860b, #ffd700, #b8860b)', padding: '5px' }}>
            <div className="w-full h-full rounded-full" style={{ background: '#1a0533' }} />
          </div>
          {/* Bezel rivets */}
          <div className="absolute inset-[-6px] z-20">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute w-[5px] h-[5px] rounded-full" style={{
                top: '50%', left: '50%',
                transform: `rotate(${i * 18}deg) translateY(-130px) translate(-50%, -50%)`,
                background: 'radial-gradient(circle at 35% 30%, #f5f5f5, #9a9a9a 60%, #5a5a5a)',
                boxShadow: '0 1px 1px rgba(0,0,0,0.5)',
              }} />
            ))}
          </div>
          {/* LED dots */}
          <div className="absolute inset-[-2px] z-20">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="absolute w-[6px] h-[6px] rounded-full" style={{
                top: '50%', left: '50%',
                transform: `rotate(${i * 22.5}deg) translateY(-128px) translate(-50%, -50%)`,
                background: i % 2 === 0 ? '#fbbf24' : '#fff',
                boxShadow: i % 2 === 0 ? '0 0 6px #fbbf24' : '0 0 4px #fff',
                animation: `ledBlink 1.1s ease-in-out ${i * 0.06}s infinite`,
              }} />
            ))}
          </div>

          {/* Rotating wheel */}
          <div className="absolute inset-[4px] rounded-full overflow-hidden z-10"
            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4.2s cubic-bezier(0.15,0.9,0.15,1)' : 'none' }}>
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {SEGMENTS.map((seg, i) => {
                const a0 = (i * SEG - 90) * Math.PI / 180
                const a1 = ((i + 1) * SEG - 90) * Math.PI / 180
                const x1 = 100 + 100 * Math.cos(a0), y1 = 100 + 100 * Math.sin(a0)
                const x2 = 100 + 100 * Math.cos(a1), y2 = 100 + 100 * Math.sin(a1)
                const mid = ((i + 0.5) * SEG - 90) * Math.PI / 180
                const tx = 100 + 82 * Math.cos(mid), ty = 100 + 82 * Math.sin(mid)
                return (
                  <g key={i}>
                    <path d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`} fill={i % 2 === 0 ? '#0E8FCF' : '#0a3d5c'} stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
                    <text x={tx} y={ty} fill="#fff" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                      transform={`rotate(${(i + 0.5) * SEG}, ${tx}, ${ty})`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                      {seg.wheelLabel}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Center hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42px] h-[42px] rounded-full z-20 flex items-center justify-center"
            style={{ background: 'radial-gradient(circle at 35% 35%, #ffd700, #b8860b)', border: '3px solid #ffd700', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            <span className="text-[16px] font-black text-amber-900">₺</span>
          </div>
        </div>

        {/* Status line under wheel */}
        <p className="text-[11px] text-white/80 font-medium mt-4 text-center">
          {needsDeposit ? 'İlk yatırımınızı yapın, çarkı açın'
            : windowExpired ? '14 günlük Şans Çarkı süreniz doldu'
            : spinAgainNotice ? 'Tekrar çeviriliyor… 🔁'
            : spunToday ? 'Bugünlük çevirme hakkın doldu'
            : spinning ? 'Çark dönüyor…'
            : `Gün ${dayNumber}/${windowTotal} · Bugünkü çarpan: x${multiplier}`}
        </p>
      </div>

      {/* ── Spin CTA ── */}
      {needsDeposit ? (
        <Link href="/kupon/deposit" className="mt-4 w-full h-[52px] rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-[15px] font-extrabold shadow-[0_4px_16px_rgba(217,119,6,0.4)] flex items-center justify-center">
          İlk Yatırımını Yap
        </Link>
      ) : windowExpired ? (
        <div className="mt-4 w-full h-[52px] rounded-xl bg-[#eef1f5] border border-[#e0e5ec] flex items-center justify-center">
          <span className="text-[12px] font-semibold text-[#737B8C]">Şans Çarkı süreniz sona erdi</span>
        </div>
      ) : spunToday ? (
        <div className="mt-4 w-full h-[52px] rounded-xl bg-[#eef1f5] border border-[#e0e5ec] flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" /></svg>
          <span className="text-[12px] font-semibold text-[#737B8C]">Yeni çevirme:</span>
          <span className="text-[14px] font-extrabold text-[#1a2332] tabular-nums">{countdown}</span>
        </div>
      ) : (
        <button onClick={spin} disabled={spinning}
          className="mt-4 w-full h-[52px] rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-[15px] font-extrabold shadow-[0_4px_16px_rgba(217,119,6,0.4)] active:scale-[0.99] transition-transform disabled:opacity-70 flex items-center justify-center gap-2">
          {spinning ? (
            <>
              <span className="w-[18px] h-[18px] rounded-full border-[3px] border-white/40 border-t-white animate-spin" />
              Çevriliyor…
            </>
          ) : (loaded && !isLoggedIn) ? 'Giriş Yap ve Çevir' : 'ÇARKI ÇEVİR'}
        </button>
      )}

      {/* ── Result modal ── */}
      {result && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/55 left-1/2 -translate-x-1/2 w-full max-w-[430px]" onClick={() => setResult(null)} />
          <div className="fixed z-[95] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-2xl overflow-hidden animate-slide-up">
            <div className="px-6 pt-6 pb-5 text-center" style={{ background: 'linear-gradient(160deg, #2a0a4a, #1a0533)' }}>
              {result.kind === 'cash' && (
                <>
                  <div className="text-[34px] mb-1">🎉</div>
                  <p className="text-[13px] text-white/80 font-medium">Tebrikler, kazandın!</p>
                  <p className="text-[34px] font-black text-[#ffd700] leading-tight mt-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{resultAmount} ₺</p>
                  {resultMultiplier !== 1 && (
                    <p className="text-[11px] text-white/60 font-medium mt-1">{result.fullLabel} × Gün {dayNumber} çarpanı (x{resultMultiplier})</p>
                  )}
                </>
              )}
              {result.kind === 'extraDay' && (
                <>
                  <div className="text-[34px] mb-1">🎁</div>
                  <p className="text-[13px] text-white/80 font-medium">Tebrikler, kazandın!</p>
                  <p className="text-[26px] font-black text-[#ffd700] leading-tight mt-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{result.fullLabel}</p>
                  <p className="text-[11px] text-white/60 font-medium mt-1">Şans Çarkı süreniz uzatıldı</p>
                </>
              )}
              {result.kind === 'empty' && (
                <>
                  <div className="text-[34px] mb-1">😔</div>
                  <p className="text-[15px] text-white font-bold">Bu sefer olmadı</p>
                  <p className="text-[11px] text-white/60 font-medium mt-1">Yarın tekrar deneyin!</p>
                </>
              )}
            </div>
            <div className="px-5 py-4">
              {result.kind === 'cash' && (
                <div className="flex items-center gap-2 justify-center mb-3">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <p className="text-[11px] text-[#1a7a43] font-semibold">Çevrimsiz · anında çekilebilir bakiye</p>
                </div>
              )}
              <button onClick={() => setResult(null)} className="w-full py-[12px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold">Tamam</button>
            </div>
          </div>
        </>
      )}

      {/* ── Login prompt (logged-out) ── */}
      {loginPrompt && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/55 left-1/2 -translate-x-1/2 w-full max-w-[430px]" onClick={() => setLoginPrompt(false)} />
          <div className="fixed z-[95] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-2xl p-5 animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-[#fff7ed] flex items-center justify-center mx-auto mb-3">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" fill="#d97706" stroke="none" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeLinecap="round" /></svg>
            </div>
            <p className="text-[15px] font-bold text-[#1a2332] text-center">Çevirmek için giriş yap</p>
            <p className="text-[11px] text-[#737B8C] text-center mt-1 leading-relaxed">Günlük ücretsiz çarkı çevirmek ve ödülünü almak için hesabına giriş yap.</p>
            <div className="flex gap-2.5 mt-4">
              <Link href="/login" className="flex-1 h-[42px] rounded-xl border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-bold flex items-center justify-center">Giriş Yap</Link>
              <Link href="/register" className="flex-1 h-[42px] rounded-xl bg-[#0E8FCF] text-white text-[12px] font-bold flex items-center justify-center">Kayıt Ol</Link>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes ledBlink { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  )
}
