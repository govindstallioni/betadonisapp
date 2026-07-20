// ── Placed-bet coupons store (localStorage) ─────────────────────────────────
// Real coupons created when the user places a bet. They start `pending` and are
// settled (won/lost) after `settleAt`, crediting winnings to the balance on a
// win. Shown in Geçmiş (BetHistory) alongside the demo sample bets.

export type BetStatus = 'won' | 'lost' | 'pending' | 'cancelled'

export type CouponLeg = {
  league: string
  match: string
  pick: string      // "market: selection"
  odd: number
  result: BetStatus
  score?: string
}

export type Coupon = {
  id: string
  type: 'Tekli' | 'Kombine' | 'Sistem'
  status: BetStatus
  date: string
  stake: number
  totalOdds: number
  payout: number    // pending → potential return, won → paid, lost → 0
  legs: CouponLeg[]
  placedAt: number
  settleAt: number
}

const KEY = 'bta_coupons'
export const round2 = (n: number) => Math.round(n * 100) / 100

export function loadCoupons(): Coupon[] {
  try { const r = localStorage.getItem(KEY); return r ? (JSON.parse(r) as Coupon[]) : [] } catch { return [] }
}
export function saveCoupons(c: Coupon[]) {
  try { localStorage.setItem(KEY, JSON.stringify(c)) } catch {}
}
export function addCoupon(c: Coupon) {
  const all = loadCoupons()
  all.unshift(c)
  saveCoupons(all)
}

const p2 = (n: number) => String(n).padStart(2, '0')
export function fmtDateTime(ts: number) {
  const d = new Date(ts)
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`
}

// Settle a pending coupon → won/lost with fake per-leg scores. A leg's win
// chance is inversely related to its odd; the coupon wins only if every leg wins.
export function resolveOutcome(c: Coupon): Coupon {
  const legs: CouponLeg[] = c.legs.map((leg) => {
    const p = Math.min(0.85, Math.max(0.25, 0.92 / leg.odd))
    const won = Math.random() < p
    const a = Math.floor(Math.random() * 4)
    const b = Math.floor(Math.random() * 4)
    return { ...leg, result: won ? 'won' : 'lost', score: `${a}-${b}` }
  })
  const allWon = legs.every((l) => l.result === 'won')
  return { ...c, legs, status: allWon ? 'won' : 'lost', payout: allWon ? round2(c.payout) : 0 }
}
