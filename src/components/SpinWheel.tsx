'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { DAY_MULTIPLIERS, WHEEL_WINDOW_DAYS } from '@/data/wheelData'
import { WheelDisc, WheelPointer, WHEEL_CSS, WHEEL_SLICES } from './WheelFace'

// ── Prize segments ────────────────────────────────────────────────────────
// Same 17 slices and order as betadonis.store/cark.html (work3 task 4) —
// WheelFace draws them; this list adds the payout logic and odds per slice.
type SegmentKind = 'cash' | 'spinAgain' | 'empty' | 'extraDay'
type Segment = {
  fullLabel: string
  kind: SegmentKind
  amount?: number
  days?: number
  weight: number
}

const SEGMENTS: Segment[] = [
  { fullLabel: 'Tekrar Çevir', kind: 'spinAgain', weight: 8 },
  { fullLabel: '10 ₺', kind: 'cash', amount: 10, weight: 14 },
  { fullLabel: 'Tekrar Çevir', kind: 'spinAgain', weight: 8 },
  { fullLabel: 'Tekrar Çevir', kind: 'spinAgain', weight: 8 },
  { fullLabel: '5 ₺', kind: 'cash', amount: 5, weight: 18 },
  { fullLabel: 'Tekrar Çevir', kind: 'spinAgain', weight: 8 },
  { fullLabel: '15 ₺', kind: 'cash', amount: 15, weight: 8 },
  { fullLabel: '17 ₺', kind: 'cash', amount: 17, weight: 6 },
  { fullLabel: 'Boş', kind: 'empty', weight: 10 },
  { fullLabel: '3 Gün Ekstra', kind: 'extraDay', days: 3, weight: 2 },
  { fullLabel: 'Tekrar Çevir', kind: 'spinAgain', weight: 8 },
  { fullLabel: '5 ₺', kind: 'cash', amount: 5, weight: 18 },
  { fullLabel: '2 ₺', kind: 'cash', amount: 2, weight: 22 },
  { fullLabel: '1 Gün Ekstra', kind: 'extraDay', days: 1, weight: 6 },
  { fullLabel: '17 ₺', kind: 'cash', amount: 17, weight: 6 },
  { fullLabel: 'Boş', kind: 'empty', weight: 10 },
  { fullLabel: 'Tekrar Çevir', kind: 'spinAgain', weight: 8 },
]
if (SEGMENTS.length !== WHEEL_SLICES.length) throw new Error('SpinWheel: SEGMENTS and WHEEL_SLICES must match')
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
    }, 5000)
  }, [spinning, spunToday, loaded, isLoggedIn, needsDeposit, windowExpired, rotation, multiplier, adjustBalance, addExtraDays])

  return (
    <div className="flex flex-col gap-4">
      {/* ── Wheel stage (cark.html .wheel-card-header) ── */}
      <div
        className="relative rounded-[20px] pt-[18px] pb-4 px-1 flex flex-col items-center"
        style={{ background: 'linear-gradient(180deg, #111827 0%, #1e293b 40%, #0284c7 100%)', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.15)' }}
      >
        <div
          className="rounded-xl px-7 py-1.5 mb-3.5 text-white text-[20px] font-black tracking-[2px] uppercase backdrop-blur-md"
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '3.5px solid',
            borderColor: '#fef08a #ca8a04 #854d0e #fde047',
            textShadow: '0 0 8px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.6), 0 3px 6px rgba(0,0,0,0.9)',
            boxShadow: '0 0 25px rgba(255,255,255,0.35), 0 8px 20px rgba(0,0,0,0.8), inset 0 0 15px rgba(255,255,255,0.4)',
          }}
        >
          ŞANS ÇARKI
        </div>

        <div className="relative w-full aspect-square flex items-center justify-center">
          {/* Pointer */}
          <div
            className={`absolute -top-[6px] left-1/2 w-10 h-11 z-20 ${spinning ? 'wheel-pointer-tick' : ''}`}
            style={{ transform: 'translateX(-50%)', transformOrigin: 'top center', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }}
          >
            <WheelPointer idPrefix="spin" />
          </div>

          <WheelDisc
            idPrefix="spin"
            rotation={rotation}
            transition={spinning ? 'transform 5s cubic-bezier(0.12, 0.8, 0.15, 1)' : 'none'}
            className="w-[99%] h-[99%]"
          />

          {/* Centre ÇEVİR button */}
          <button
            onClick={spin}
            disabled={spinning}
            aria-label="Çarkı çevir"
            className={`absolute top-1/2 left-1/2 w-[28%] h-[28%] rounded-full z-[15] flex items-center justify-center text-white text-[19px] font-black tracking-[1.5px] backdrop-blur-sm transition-transform -translate-x-1/2 -translate-y-1/2 hover:scale-105 active:scale-95 ${spunToday || needsDeposit || windowExpired ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            style={{
              background: 'radial-gradient(circle at 35% 35%, rgba(14,116,144,0.95) 0%, rgba(15,23,42,0.95) 85%)',
              border: '4px solid',
              borderColor: '#fef08a #ca8a04 #854d0e #fde047',
              textShadow: '0 0 10px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.8), 0 2px 5px rgba(0,0,0,0.9)',
              boxShadow: '0 0 25px rgba(255,255,255,0.3), 0 6px 20px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.5), inset 0 -2px 5px rgba(0,0,0,0.7)',
            }}
          >
            ÇEVİR
          </button>
        </div>

        {/* Status line — only for states the reference has no UI for */}
        {(needsDeposit || windowExpired || spinAgainNotice) && (
          <p className="text-[12px] text-white font-semibold mt-3 text-center px-3">
            {needsDeposit ? 'İlk yatırımınızı yapın, çarkı açın'
              : windowExpired ? '14 günlük Şans Çarkı süreniz doldu'
              : 'Tekrar Çevir! Çark yeniden dönüyor…'}
          </p>
        )}
      </div>

      {/* ── Spin CTA (cark.html .btn-spin-main / .countdown-box) ── */}
      {needsDeposit ? (
        <Link
          href="/kupon/deposit"
          className="w-full rounded-[14px] p-[14px] text-white text-[16px] font-extrabold tracking-[0.5px] text-center border border-[#bae6fd]"
          style={{ background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%)', textShadow: '0 1px 2px rgba(0,0,0,0.3)', boxShadow: '0 4px 12px rgba(2,132,199,0.35)' }}
        >
          İlk Yatırımını Yap
        </Link>
      ) : windowExpired ? (
        <div className="w-full rounded-2xl bg-[#eef2f6] px-3 py-4 text-center text-[15px] font-semibold text-[#64748b]">
          Şans Çarkı süreniz sona erdi
        </div>
      ) : spunToday ? (
        <div className="w-full rounded-2xl bg-[#eef2f6] px-3 py-4 flex items-center justify-center gap-2.5 text-[15px] font-semibold text-[#64748b]" style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" /></svg>
          Yeni çevirme:
          <span className="ml-1 text-[18px] font-extrabold text-[#0f172a] tabular-nums">{countdown}</span>
        </div>
      ) : (
        <button
          onClick={spin}
          disabled={spinning}
          className="w-full rounded-[14px] p-[14px] text-white text-[16px] font-extrabold tracking-[0.5px] border border-[#bae6fd] disabled:opacity-80 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%)', textShadow: '0 1px 2px rgba(0,0,0,0.3)', boxShadow: '0 4px 12px rgba(2,132,199,0.35)' }}
        >
          {spinning ? 'Çark dönüyor…' : (loaded && !isLoggedIn) ? 'Giriş Yap ve Çevir' : 'ÇARKI ÇEVİR'}
        </button>
      )}

      {/* ── Result modal ── */}
      {result && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/55 left-1/2 -translate-x-1/2 w-full max-w-[430px]" onClick={() => setResult(null)} />
          <div className="fixed z-[95] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-2xl overflow-hidden animate-slide-up">
            <div className="px-6 pt-6 pb-5 text-center" style={{ background: 'linear-gradient(180deg, #111827 0%, #1e293b 45%, #0284c7 100%)' }}>
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

      <style>{WHEEL_CSS}</style>
    </div>
  )
}
