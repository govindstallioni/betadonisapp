'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useBetSlip, type Selection } from './BetSlipProvider'
import { useAuth } from './AuthProvider'
import { addCoupon, fmtDateTime, round2, type Coupon } from '@/data/coupons'
import { Toggle } from './settings/SettingsUI'
import LiveTag from './LiveTag'

// ── Helpers ────────────────────────────────────────────────────
function fmt(n: number) {
  const [int, dec] = (isFinite(n) ? n : 0).toFixed(2).split('.')
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec} ₺`
}

// k-index combinations of [0..n-1]
function combinations(n: number, k: number): number[][] {
  const res: number[][] = []
  const rec = (start: number, acc: number[]) => {
    if (acc.length === k) { res.push(acc.slice()); return }
    for (let i = start; i < n; i++) { acc.push(i); rec(i + 1, acc); acc.pop() }
  }
  rec(0, [])
  return res
}
function nCk(n: number, k: number) {
  let r = 1
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1)
  return Math.round(r)
}
const num = (s: string) => { const v = parseFloat(s); return isFinite(v) && v > 0 ? v : 0 }

const TABS = ['Tekli', 'Kombine', 'Sistem'] as const
type Tab = typeof TABS[number]

const CONFIRM_SECONDS = 9

// ── Live odd arrow ─────────────────────────────────────────────
function OddArrow({ dir }: { dir: Selection['dir'] }) {
  if (!dir) return null
  const up = dir === 'up'
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill={up ? '#27ae60' : '#e74c3c'} className="flex-shrink-0">
      {up ? <path d="M12 4l8 12H4z" /> : <path d="M12 20L4 8h16z" />}
    </svg>
  )
}

// ── Selection row ──────────────────────────────────────────────
function Row({ s, onRemove, tab, amount, onAmountChange }: {
  s: Selection; onRemove: () => void; tab: Tab; amount?: string; onAmountChange?: (v: string) => void
}) {
  return (
    <div className={`px-4 py-[11px] border-b border-[#f0f2f5] transition-opacity ${s.locked ? 'opacity-45' : ''}`}>
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[5px] min-w-0">
            {s.isLive && <LiveTag />}
            <p className="text-[10px] text-[#94a3b8] truncate">{s.league}</p>
          </div>
          <p className="text-[12px] font-bold text-[#1a2332] truncate leading-tight">{s.match}</p>
          <p className="text-[11px] leading-tight mt-[2px] truncate">
            <span className="text-[#737B8C]">{s.market}: </span>
            <span className="text-[#0E8FCF] font-semibold">{s.pick}</span>
          </p>
        </div>
        <div className="flex flex-col items-end justify-between flex-shrink-0">
          <button onClick={onRemove} aria-label="Kaldır"
            className="w-[20px] h-[20px] rounded-full bg-[#f1f5f9] flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {s.locked ? (
            <div className="flex items-center gap-1 text-[#94a3b8]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[10px] font-semibold">Kilitli</span>
            </div>
          ) : (
            <div className="flex items-center gap-[3px] min-w-[52px] justify-end">
              <OddArrow dir={s.dir} />
              <span className={`text-[13px] font-bold tabular-nums ${s.dir === 'up' ? 'text-[#27ae60]' : s.dir === 'down' ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>
                {s.odd.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tekli: each selection carries its own stake */}
      {tab === 'Tekli' && !s.locked && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-[#eef1f5]">
          <span className="text-[10px] text-[#737B8C]">Tutar (TRY)</span>
          <div className="flex items-center bg-[#f1f5f9] rounded-lg border border-[#e8ecf1] overflow-hidden">
            <input type="number" inputMode="decimal" value={amount ?? ''} onChange={e => onAmountChange?.(e.target.value)}
              placeholder="10"
              className="w-[80px] px-2 py-[6px] text-[12px] font-bold text-[#1a2332] text-right outline-none bg-transparent tabular-nums" />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main modal ─────────────────────────────────────────────────
export default function BetSlipModal() {
  const { selections, isOpen, close, remove, clear } = useBetSlip()
  const { isLoggedIn, balance, adjustBalance } = useAuth()
  const [tab, setTab] = useState<Tab>('Kombine')
  const [stakeSingleById, setStakeSingleById] = useState<Record<string, string>>({})
  const [stakeKombine, setStakeKombine] = useState('10')
  const [stakeSistemBySize, setStakeSistemBySize] = useState<Record<number, string>>({})
  const [confirmOddsChanges, setConfirmOddsChanges] = useState(false)
  const [ackOdds, setAckOdds] = useState<Record<string, number>>({})

  // flow: idle (editing) → confirming (9s live check) → placed (success screen)
  const [flow, setFlow] = useState<'idle' | 'confirming' | 'placed'>('idle')
  const [countdown, setCountdown] = useState(CONFIRM_SECONDS)
  const [pending, setPending] = useState<{ stakeTotal: number; ret: number; makeCoupon: () => Coupon } | null>(null)
  const [placedSummary, setPlacedSummary] = useState<{ betCount: number; totalOddsDisplay: string; stakeTotal: number; ret: number } | null>(null)

  const n = selections.length
  const hasLocked = selections.some(s => s.locked)
  const hasLive = selections.some(s => s.isLive)
  const oddsChanged = selections.some(s => s.odd !== (ackOdds[s.id] ?? s.baseOdd))

  // ── Tekli: each selection is an independent single, own stake ──
  const tekliAmt = (id: string) => stakeSingleById[id] ?? '10'
  const tekli = useMemo(() => {
    let totalStake = 0, totalReturn = 0
    for (const s of selections) {
      if (s.locked) continue
      const amt = num(tekliAmt(s.id))
      totalStake += amt
      totalReturn += amt * s.odd
    }
    return { totalStake, totalReturn }
  }, [selections, stakeSingleById])

  // ── Kombine: product of all odds, one stake ──
  const kombine = useMemo(() => {
    const stake = num(stakeKombine)
    const combined = selections.reduce((a, s) => a * s.odd, 1)
    return { combined, totalReturn: stake * combined, totalStake: stake }
  }, [selections, stakeKombine])

  // ── Sistem: every k = 1..n, each with its own stake ──
  const sistemAmt = (k: number) => stakeSistemBySize[k] ?? '10'
  const sistem = useMemo(() => {
    const odds = selections.map(s => s.odd)
    let totalStake = 0, totalReturn = 0
    for (let k = 1; k <= n; k++) {
      const amt = num(sistemAmt(k))
      if (amt <= 0) continue
      const cs = combinations(n, k)
      totalStake += amt * cs.length
      for (const c of cs) totalReturn += amt * c.reduce((p, idx) => p * odds[idx], 1)
    }
    return { totalStake, totalReturn }
  }, [selections, stakeSistemBySize, n])

  // Build a pending coupon from the current selections for the active tab.
  const buildCoupon = (type: Coupon['type'], stake: number, ret: number, totalOdds: number): Coupon => ({
    id: 'BD' + String(Date.now()).slice(-7),
    type,
    status: 'pending',
    date: fmtDateTime(Date.now()),
    stake: round2(stake),
    totalOdds: round2(totalOdds),
    payout: round2(ret),
    legs: selections.map(s => ({ league: s.league, match: s.match, pick: `${s.market}: ${s.pick}`, odd: s.odd, result: 'pending' as const })),
    placedAt: Date.now(),
    settleAt: Date.now() + 8000 + Math.floor(Math.random() * 12000), // settles in ~8–20s
  })

  // ── Unified active-tab summary (drives the shared footer) ──
  const active = (() => {
    if (tab === 'Tekli') {
      return {
        betCount: n, oddsLabel: 'Bahis Sayısı', oddsValue: `${n}`, totalOddsDisplay: '—',
        stakeTotal: tekli.totalStake, ret: tekli.totalReturn,
        disabled: hasLocked || tekli.totalStake <= 0,
        disabledReason: hasLocked ? 'Askıya alınan seçim var, kaldırın veya bekleyin.' : 'Bahis miktarı girin.',
        makeCoupon: () => buildCoupon('Tekli', tekli.totalStake, tekli.totalReturn, tekli.totalStake > 0 ? tekli.totalReturn / tekli.totalStake : 0),
      }
    }
    if (tab === 'Sistem') {
      return {
        betCount: n, oddsLabel: 'Bahis Sayısı', oddsValue: `${n}`, totalOddsDisplay: '—',
        stakeTotal: sistem.totalStake, ret: sistem.totalReturn,
        disabled: n < 2 || hasLocked || sistem.totalStake <= 0,
        disabledReason: n < 2 ? 'En az 2 seçim gerekli.' : hasLocked ? 'Askıya alınan seçim var, kaldırın veya bekleyin.' : 'Bahis miktarı girin.',
        makeCoupon: () => buildCoupon('Sistem', sistem.totalStake, sistem.totalReturn, sistem.totalStake > 0 ? sistem.totalReturn / sistem.totalStake : 0),
      }
    }
    // Kombine
    return {
      betCount: n, oddsLabel: 'Toplam Oran', oddsValue: kombine.combined.toFixed(2), totalOddsDisplay: kombine.combined.toFixed(2),
      stakeTotal: kombine.totalStake, ret: kombine.totalReturn,
      disabled: n < 2 || hasLocked || kombine.totalStake <= 0,
      disabledReason: n < 2 ? 'En az 2 seçim gerekli.' : hasLocked ? 'Askıya alınan seçim var, kaldırın veya bekleyin.' : 'Bahis miktarı girin.',
      makeCoupon: () => buildCoupon('Kombine', kombine.totalStake, kombine.totalReturn, kombine.combined),
    }
  })()

  const insufficient = isLoggedIn && active.stakeTotal > balance.withdrawable
  const blocked = active.disabled || insufficient
  const blockedReason = insufficient ? 'Yetersiz bakiye — lütfen para yatırın.' : active.disabledReason

  function doPlace(a: { stakeTotal: number; ret: number; makeCoupon: () => Coupon }) {
    adjustBalance(-a.stakeTotal)
    addCoupon(a.makeCoupon())
    setPlacedSummary({ betCount: active.betCount, totalOddsDisplay: active.totalOddsDisplay, stakeTotal: a.stakeTotal, ret: a.ret })
    setFlow('placed')
  }

  function acknowledgeOdds() {
    const snap: Record<string, number> = {}
    selections.forEach(s => { snap[s.id] = s.odd })
    setAckOdds(snap)
  }

  function handlePrimary() {
    if (blocked) return
    if (oddsChanged && !confirmOddsChanges) {
      acknowledgeOdds()
      return
    }
    if (hasLive) {
      setPending({ stakeTotal: active.stakeTotal, ret: active.ret, makeCoupon: active.makeCoupon })
      setCountdown(CONFIRM_SECONDS)
      setFlow('confirming')
      return
    }
    doPlace(active)
  }

  // 9-second live-bet countdown
  useEffect(() => {
    if (flow !== 'confirming') return
    if (countdown <= 0) {
      if (pending) doPlace(pending)
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [flow, countdown])

  function dismiss() {
    setFlow('idle')
    setPending(null)
    setPlacedSummary(null)
    clear()
    close()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={close} className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/45 z-[90]" />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[95] bg-[#edf1f7] rounded-t-2xl animate-slide-up flex flex-col" style={{ maxHeight: '88vh' }}>

        {/* Header */}
        <div className="bg-white rounded-t-2xl px-4 pt-3 pb-3 border-b border-[#e8ecf1] flex-shrink-0">
          <div className="flex items-center justify-between">
            <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f1f5f9]" aria-label="Kapat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#1a2332]">Kuponum</h3>
              {n > 0 && <span className="text-[11px] font-bold text-white bg-[#0E8FCF] rounded-full min-w-[20px] h-[20px] px-[6px] flex items-center justify-center">{n}</span>}
            </div>
            {n > 0 ? (
              <button onClick={clear} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f1f5f9]" aria-label="Kuponu temizle">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            ) : <div className="w-8" />}
          </div>

          {/* Tabs */}
          {n > 0 && flow === 'idle' && (
            <div className="flex bg-[#f1f5f9] rounded-full p-[3px] border border-[#e8ecf1] mt-3">
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 text-[12px] font-semibold py-[7px] rounded-full transition-all ${tab === t ? 'bg-[#0E8FCF] text-white' : 'text-[#1a2332]'}`}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {n === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-8 py-16 bg-[#edf1f7]">
            <div className="w-[76px] h-[76px] rounded-full bg-[#dce8f5] flex items-center justify-center mb-4">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2z" />
                <path d="M13 5v14" strokeDasharray="2 2" />
              </svg>
            </div>
            <p className="text-[14px] font-bold text-[#1a2332]">Kuponunuz boş</p>
            <p className="text-[12px] text-[#737B8C] text-center mt-1 leading-relaxed">
              Bir etkinlikteki orana dokunarak kuponunuza ekleyin.
            </p>
          </div>
        ) : flow === 'placed' && placedSummary ? (
          /* ── Confirmed summary ── */
          <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 bg-white">
            <div className="flex flex-col items-center text-center">
              <span className="w-[52px] h-[52px] rounded-full bg-[#e8f0fb] flex items-center justify-center mb-3">
                <span className="w-[38px] h-[38px] rounded-full bg-[#0E8FCF] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
              </span>
              <div className="w-full bg-[#0E8FCF] text-white text-[13px] font-bold rounded-xl py-[10px] mb-4">Bahsiniz onaylanmıştır</div>
              <div className="w-full flex flex-col gap-[8px] text-left mb-5">
                <div className="flex items-center justify-between text-[12px]"><span className="text-[#737B8C]">Bahis Sayısı</span><span className="font-bold text-[#1a2332] tabular-nums">{placedSummary.betCount}</span></div>
                <div className="flex items-center justify-between text-[12px]"><span className="text-[#737B8C]">Toplam Oran</span><span className="font-bold text-[#1a2332] tabular-nums">{placedSummary.totalOddsDisplay}</span></div>
                <div className="flex items-center justify-between text-[12px]"><span className="text-[#737B8C]">Tutar (TRY)</span><span className="font-bold text-[#1a2332] tabular-nums">{fmt(placedSummary.stakeTotal)}</span></div>
                <div className="flex items-center justify-between text-[12px]"><span className="text-[#737B8C]">Olası Kazanç (TRY)</span><span className="font-bold text-[#0E8FCF] tabular-nums">{fmt(placedSummary.ret)}</span></div>
                <div className="flex items-center justify-between text-[12px]"><span className="text-[#737B8C]">Normal Olası Kazanç (TRY)</span><span className="font-bold text-[#1a2332] tabular-nums">{fmt(placedSummary.ret)}</span></div>
              </div>
            </div>
            <button onClick={dismiss} className="w-full py-[13px] rounded-xl text-[13px] font-bold text-white bg-[#0E8FCF]">Tamam</button>
          </div>
        ) : (
          <>
            {/* Odds-change banner */}
            {flow === 'idle' && oddsChanged && !confirmOddsChanges && (
              <div className="mx-4 mt-3 rounded-lg bg-[#f39c12] text-white text-[12px] font-bold text-center py-[9px] flex-shrink-0">
                Kupon Değişiklik Onayı Bekliyor
              </div>
            )}

            {/* 9s live-confirmation banner */}
            {flow === 'confirming' && (
              <div className="mx-4 mt-3 rounded-lg bg-[#1a2332] text-white text-[12px] font-semibold text-center py-[9px] px-3 flex-shrink-0">
                Bekleyiniz ({countdown}) ...
                <div className="h-[3px] bg-white/25 rounded-full mt-[6px] overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: `${((CONFIRM_SECONDS - countdown) / CONFIRM_SECONDS) * 100}%` }} />
                </div>
              </div>
            )}

            {/* Scrollable body */}
            <div className={`flex-1 overflow-y-auto transition-opacity ${flow === 'confirming' ? 'opacity-40 pointer-events-none' : ''}`}>
              {/* Selections */}
              <div className="bg-white">
                {selections.map(s => (
                  <Row key={s.id} s={s} onRemove={() => remove(s.id)} tab={tab}
                    amount={tekliAmt(s.id)} onAmountChange={(v) => setStakeSingleById(prev => ({ ...prev, [s.id]: v }))} />
                ))}
              </div>

              {/* Confirm-odds-changes toggle */}
              <div className="flex items-center justify-between gap-3 bg-white px-4 py-[10px] border-t border-[#f0f2f5]">
                <span className="text-[11px] text-[#737B8C]">Oran değişikliklerini onayla</span>
                <Toggle value={confirmOddsChanges} onChange={setConfirmOddsChanges} />
              </div>

              {/* Per-tab controls */}
              <div className="bg-white mt-2">
                {tab === 'Tekli' && (
                  <p className="px-4 py-3 text-[10px] text-[#94a3b8]">Her seçim, üstteki kendi tutarıyla ayrı bir bahis olarak oynanır ({n} tekli).</p>
                )}
                {tab === 'Kombine' && (
                  n < 2
                    ? <p className="px-4 py-4 text-[12px] text-[#e08a12]">Kombine için en az 2 seçim gerekli.</p>
                    : <>
                        <div className="flex items-center justify-between gap-3 px-4 py-[10px]">
                          <span className="text-[12px] text-[#737B8C]">Bahis miktarı</span>
                          <div className="flex items-center bg-[#f1f5f9] rounded-lg border border-[#e8ecf1] overflow-hidden">
                            <input type="number" inputMode="decimal" value={stakeKombine} onChange={e => setStakeKombine(e.target.value)}
                              className="w-[92px] px-3 py-[8px] text-[13px] font-bold text-[#1a2332] text-right outline-none bg-transparent tabular-nums" placeholder="0" />
                            <span className="pr-3 text-[12px] font-semibold text-[#737B8C]">₺</span>
                          </div>
                        </div>
                        <p className="px-4 pb-3 text-[10px] text-[#94a3b8]">Tüm seçimler tek bir kupon olarak birleştirilir.</p>
                      </>
                )}
                {tab === 'Sistem' && (
                  n < 2
                    ? <p className="px-4 py-4 text-[12px] text-[#e08a12]">Sistem için en az 2 seçim gerekli.</p>
                    : <div className="px-4 py-1">
                        {Array.from({ length: n }, (_, i) => i + 1).map(k => (
                          <div key={k} className="flex items-center justify-between gap-3 py-[9px] border-b border-[#f0f2f5] last:border-b-0">
                            <div className="flex items-center gap-[6px] text-[11px]">
                              <span className="text-[#737B8C]">Tutar(TRY)</span>
                              <span className="text-[#1a2332] font-bold">{k}/{n}</span>
                              <span className="text-[#94a3b8]">{nCk(n, k)} x</span>
                            </div>
                            <div className="flex items-center bg-[#f1f5f9] rounded-lg border border-[#e8ecf1] overflow-hidden">
                              <input type="number" inputMode="decimal" value={sistemAmt(k)} onChange={e => setStakeSistemBySize(prev => ({ ...prev, [k]: e.target.value }))}
                                placeholder="10"
                                className="w-[70px] px-2 py-[6px] text-[12px] font-bold text-[#1a2332] text-right outline-none bg-transparent tabular-nums" />
                            </div>
                          </div>
                        ))}
                      </div>
                )}
              </div>
            </div>

            {/* Footer — summary + action */}
            <div className="border-t border-[#e8ecf1] bg-white px-4 pt-3 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between text-[12px] mb-[6px]">
                <span className="text-[#737B8C]">{active.oddsLabel}</span>
                <span className="font-bold text-[#1a2332] tabular-nums">{active.oddsValue}</span>
              </div>
              <div className="flex items-center justify-between text-[12px] mb-[6px]">
                <span className="text-[#737B8C]">Toplam Bahis</span>
                <span className="font-bold text-[#1a2332] tabular-nums">{fmt(active.stakeTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] mb-2">
                <span className="text-[#737B8C] font-semibold">Muhtemel Kazanç</span>
                <span className="font-extrabold text-[#0E8FCF] tabular-nums">{fmt(active.ret)}</span>
              </div>

              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between text-[11px] mb-3 pb-2 border-b border-dashed border-[#e8ecf1]">
                    <span className="text-[#94a3b8]">Kullanılabilir bakiye</span>
                    <span className={`font-semibold tabular-nums ${insufficient ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>{fmt(balance.withdrawable)}</span>
                  </div>

                  {flow === 'confirming' ? (
                    <div className="flex gap-[10px]">
                      <button onClick={() => { if (pending) doPlace(pending) }} className="flex-1 py-[13px] rounded-xl text-[13px] font-bold text-white bg-[#0E8FCF]">ONAYLA</button>
                      <button onClick={() => { setFlow('idle'); setPending(null) }} className="flex-1 py-[13px] rounded-xl text-[13px] font-bold text-white bg-[#e74c3c]">GERİ</button>
                    </div>
                  ) : (
                    <>
                      <button type="button" disabled={blocked && !(oddsChanged && !confirmOddsChanges)} onClick={handlePrimary}
                        className={`w-full py-[13px] rounded-xl text-[13px] font-bold tracking-wide transition-all ${
                          oddsChanged && !confirmOddsChanges
                            ? 'bg-[#f39c12] text-white'
                            : blocked ? 'bg-[#dce8f5] text-[#94a3b8] cursor-not-allowed' : 'bg-[#0E8FCF] text-white'
                        }`}>
                        {oddsChanged && !confirmOddsChanges ? 'DEĞİŞİKLİKLERİ ONAYLA' : 'BAHİS KUPONUNU OYNA'}
                      </button>
                      {blocked && !oddsChanged && blockedReason && (
                        <p className="text-[10px] text-[#e08a12] text-center mt-2">{blockedReason}</p>
                      )}
                      {insufficient && (
                        <Link href="/kupon/deposit" onClick={close} className="block text-[11px] text-[#0E8FCF] font-bold text-center mt-1.5">Para Yatır →</Link>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="flex gap-[10px]">
                    <Link href="/login" onClick={close} className="flex-1 h-[44px] rounded-xl border-2 border-[#0E8FCF] text-[#0E8FCF] text-[13px] font-bold flex items-center justify-center">
                      Giriş Yap
                    </Link>
                    <Link href="/register" onClick={close} className="flex-1 h-[44px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold flex items-center justify-center">
                      Kayıt Ol
                    </Link>
                  </div>
                  <p className="text-[10px] text-[#94a3b8] text-center mt-2">Bahis yapmak için giriş yapın veya kayıt olun.</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
