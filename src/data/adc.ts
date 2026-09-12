// ── Adonis Coin (ADC) — rules, tiers and shop catalogue ─────────────────────
// Single source of truth for the loyalty system described in the client's
// technical brief (betadonis.store/coin.html, v2.0). Pure data and maths — no
// React — so the tier table can be read and checked against the brief directly.
//
// The brief's defining rules, all enforced here or in AdcProvider:
//   • Points come from DEPOSITS ONLY. No registration bonus, ever.
//   • Sports betting codes only. No casino, spin, cashback or bonus balance.
//   • 4-layer house protection: tiered rate, a qualifying-bet requirement,
//     a fixed code/point ratio, and strict code usage rules.

/** Deposit tiers. The rate is chosen by the SIZE OF THE SINGLE DEPOSIT, not by
 *  lifetime total — every worked example in the brief computes as
 *  `deposit / 100 × that deposit's rate` (500₺→5, 3.000₺→45, 600.000₺→30.000). */
export const ADC_TIERS: { min: number; max: number; rate: number }[] = [
  { min: 100, max: 999, rate: 1 },
  { min: 1_000, max: 4_999, rate: 1.5 },
  { min: 5_000, max: 9_999, rate: 2 },
  { min: 10_000, max: 24_999, rate: 2.5 },
  { min: 25_000, max: 49_999, rate: 3 },
  { min: 50_000, max: 99_999, rate: 3.5 },
  { min: 100_000, max: 249_999, rate: 4 },
  { min: 250_000, max: Infinity, rate: 5 },
]

/** Rate (ADC per 100₺) for a single deposit, or 0 below the 100₺ floor. */
export function adcRateFor(amount: number): number {
  return ADC_TIERS.find(t => amount >= t.min && amount <= t.max)?.rate ?? 0
}

/** ADC earned by a single deposit. Always computed on the DEPOSIT alone —
 *  never deposit + bonus, which would push house cost past the brief's
 *  0.25–1.25% ceiling. */
export function adcForDeposit(amount: number): number {
  const rate = adcRateFor(amount)
  return rate === 0 ? 0 : Math.floor((amount / 100) * rate)
}

// ── Layer 2: the qualifying bet ─────────────────────────────────────────────
// Points are NOT usable the moment money lands. They are finalised once the
// user places a real bet of at least 100₺ at odds of at least 1.50. Judged on
// the coupon as a whole: a Tekli leg can sit below 1.50 on its own, and the
// brief speaks about "a bet", not a leg.
export const QUALIFY_MIN_STAKE = 100
export const QUALIFY_MIN_ODDS = 1.5

export function betQualifies(stake: number, totalOdds: number): boolean {
  return stake >= QUALIFY_MIN_STAKE && totalOdds >= QUALIFY_MIN_ODDS
}

// ── Layers 3 & 4: code value ratio and usage rules ──────────────────────────
export const MIN_ADC_USAGE = 100
export const CODE_LIFETIME_DAYS = 60
export const CODE_MIN_ODDS = 1.5
const DAY = 86_400_000

export type AdcCategory = 'Sporlar' | 'Esporlar' | 'Bahis'

export interface AdcShopItem {
  id: string
  name: string
  category: AdcCategory
  /** Price in ADC. */
  cost: number
  /** Free-bet value in ₺. */
  value: number
  /** Code prefix from the brief (FB-XXXX, KMB-XXXX, …). */
  prefix: string
  /** Sport the resulting code is valid for; 'Tümü' = any sport. */
  sport: string
  /** Minimum legs, for the combo codes. */
  minLegs?: number
  desc: string
  /** Card artwork: our own gradient + glyph, not the reference's photography. */
  gradient: [string, string]
  icon: 'futbol' | 'basketbol' | 'tenis' | 'hokey' | 'espor' | 'kombine' | 'yildiz' | 'kupa'
}

/** The shop, straight from the brief's section 5.
 *
 *  Three categories, not the four in the 1xBet reference: its "Oyunlar" row
 *  (DOTA 21, Heroes of the Storm) is casino-style content, and both section 5
 *  and the section 7 scope rule say sports only. */
export const ADC_SHOP: AdcShopItem[] = [
  {
    id: 'futbol', name: 'Futbol Free Bet', category: 'Sporlar',
    cost: 100, value: 25, prefix: 'FB', sport: 'Futbol',
    desc: 'Futbol dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#16a34a', '#065f46'], icon: 'futbol',
  },
  {
    id: 'basketbol', name: 'Basketbol Free Bet', category: 'Sporlar',
    cost: 100, value: 25, prefix: 'BK', sport: 'Basketbol',
    desc: 'Basketbol dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#ea580c', '#9a3412'], icon: 'basketbol',
  },
  {
    id: 'tenis', name: 'Tenis Free Bet', category: 'Sporlar',
    cost: 100, value: 25, prefix: 'TN', sport: 'Tenis',
    desc: 'Tenis dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#ca8a04', '#713f12'], icon: 'tenis',
  },
  {
    id: 'buz-hokeyi', name: 'Buz Hokeyi Free Bet', category: 'Sporlar',
    cost: 150, value: 40, prefix: 'BH', sport: 'Buz Hokeyi',
    desc: 'Buz hokeyi dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#0891b2', '#155e75'], icon: 'hokey',
  },
  {
    id: 'espor', name: 'E-Spor Free Bet', category: 'Esporlar',
    cost: 150, value: 40, prefix: 'ES', sport: 'E-Spor',
    desc: 'E-spor dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#7c3aed', '#4c1d95'], icon: 'espor',
  },
  {
    id: 'kombine', name: 'Kombine Free Bet (3+)', category: 'Bahis',
    cost: 200, value: 60, prefix: 'KMB', sport: 'Tümü', minLegs: 3,
    desc: 'En az 3 seçimli, her biri 1.50 veya daha yüksek oranlı kombine kuponlarda geçerli ücretsiz bahis kodu.',
    gradient: ['#0E8FCF', '#075985'], icon: 'kombine',
  },
  {
    id: 'super', name: 'Süper Spor Bonusu', category: 'Bahis',
    cost: 500, value: 200, prefix: 'BETA', sport: 'Tümü',
    desc: 'Tüm spor dallarında geçerli, 200₺ değerinde ücretsiz bahis kodu. 1.50 minimum oran kuralı geçerlidir.',
    gradient: ['#e11d48', '#881337'], icon: 'yildiz',
  },
  {
    id: 'vip', name: 'VIP Mega Spor Bonusu', category: 'Bahis',
    cost: 1000, value: 500, prefix: 'VIP', sport: 'Tümü',
    desc: 'Tüm spor dallarında geçerli, 500₺ değerinde en yüksek ücretsiz bahis kodu. 1.50 minimum oran kuralı geçerlidir.',
    gradient: ['#1a2332', '#3a4d6b'], icon: 'kupa',
  },
]

export const ADC_CATEGORIES: AdcCategory[] = ['Sporlar', 'Esporlar', 'Bahis']

export function shopItem(id: string): AdcShopItem | undefined {
  return ADC_SHOP.find(i => i.id === id)
}

// ── Codes ───────────────────────────────────────────────────────────────────

export interface AdcCode {
  code: string
  itemId: string
  name: string
  sport: string
  minLegs?: number
  /** Free-bet value in ₺. */
  value: number
  minOdds: number
  cost: number
  createdAt: number
  expiresAt: number
  usedAt: number | null
}

export type AdcCodeStatus = 'active' | 'used' | 'expired'

export function codeStatus(c: AdcCode, now = Date.now()): AdcCodeStatus {
  if (c.usedAt) return 'used'
  return now > c.expiresAt ? 'expired' : 'active'
}

export const CODE_STATUS_LABEL: Record<AdcCodeStatus, string> = {
  active: 'Aktif',
  used: 'Kullanıldı',
  expired: 'Süresi geçti',
}

/** `FB-4821` — the brief's PREFIX-XXXX format. */
export function makeCode(prefix: string): string {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
}

export function issueCode(item: AdcShopItem, now = Date.now()): AdcCode {
  return {
    code: makeCode(item.prefix),
    itemId: item.id,
    name: item.name,
    sport: item.sport,
    minLegs: item.minLegs,
    value: item.value,
    minOdds: CODE_MIN_ODDS,
    cost: item.cost,
    createdAt: now,
    expiresAt: now + CODE_LIFETIME_DAYS * DAY,
    usedAt: null,
  }
}

export function daysLeft(c: AdcCode, now = Date.now()): number {
  return Math.max(0, Math.ceil((c.expiresAt - now) / DAY))
}

// ── Ledger ──────────────────────────────────────────────────────────────────
// Mirrors the brief's `adc_transactions` table. Surfaced by the ADC history
// view, which is deferred (plan item 8) — recorded from day one so that view
// has real data when it lands.

export type AdcTxType = 'deposit' | 'confirm' | 'spend'

export interface AdcTx {
  id: string
  type: AdcTxType
  /** Positive for earned, negative for spent. */
  amount: number
  note: string
  at: number
}

// ── Code eligibility against a coupon (task 27, item 7) ─────────────────────
// A code is a free bet with a scope: one sport (or "Tümü"), a minimum number of
// legs for the combo codes, and a minimum total odds. Rather than hide codes
// that do not fit, the slip shows them with the reason — so "why can't I use
// this?" is answered on the spot.
export interface CouponShape {
  /** 'Tekli' | 'Kombine' | 'Sistem' — Sistem splits one stake across many
   *  combinations, which a single free-bet value cannot express. */
  tab: string
  legs: number
  /** Sport per leg; undefined where a screen's data does not carry one. */
  sports: (string | undefined)[]
  totalOdds: number
}

export function codeIneligibleReason(c: AdcCode, k: CouponShape, now = Date.now()): string | null {
  const st = codeStatus(c, now)
  if (st === 'used') return 'Bu kod kullanıldı.'
  if (st === 'expired') return 'Bu kodun süresi geçti.'
  if (k.legs === 0) return 'Kuponunuz boş.'
  if (k.tab === 'Sistem') return 'Sistem kuponlarında kullanılamaz.'
  const need = c.minLegs ?? 1
  if (k.legs < need) return `En az ${need} maç gerekli.`
  if (k.totalOdds < c.minOdds) return `Toplam oran en az ${c.minOdds.toFixed(2)} olmalı.`
  if (c.sport !== 'Tümü') {
    // An unknown sport is treated as a mismatch — never wrongly allowed.
    if (!k.sports.every(sp => sp === c.sport)) return `Yalnızca ${c.sport} kuponlarında geçerli.`
  }
  return null
}

export const fmtAdc = (n: number) => n.toLocaleString('tr-TR')
