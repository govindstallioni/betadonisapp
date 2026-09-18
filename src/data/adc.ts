// ── Adonis Coin (ADC) — rules, tiers and shop catalogue ─────────────────────
// Single source of truth for the loyalty system described in the client's
// technical brief (betadonis.store/coin.html, v2.0). Pure data and maths — no
// React — so the tier table can be read and checked against the brief directly.
//
// The brief's defining rules, all enforced here or in AdcProvider:
//   • Deposits accrue points on the tier table below (v2.0 — kept as is).
//   • 4-layer house protection: tiered rate, a qualifying-bet requirement,
//     a fixed code/point ratio, and strict code usage rules.
//
// v2.1 revision (betadonis.store/revize-coin.html, work3 task 8) adds, on top:
//   • casino codes next to sports codes (SPOR / CASINO shop tabs),
//   • quests, social-media shares (manual review) and friend invites as extra
//     earning sources — see src/data/adcQuests.ts.

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
export const CASINO_CODE_LIFETIME_DAYS = 30
export const CODE_MIN_ODDS = 1.5
/** Max win from a casino code (brief §4); VIP codes use the higher limit. */
export const CASINO_MAX_WIN = 500
export const CASINO_VIP_MAX_WIN = 2000
const DAY = 86_400_000

/** Which half of the shop an item / code belongs to. Codes stored before the
 *  casino tab existed have no scope and are sports codes. */
export type AdcScope = 'sport' | 'casino'
export const scopeOf = (x: { scope?: AdcScope }): AdcScope => x.scope ?? 'sport'

export type CasinoGame = 'Slot' | 'Rulet' | 'Blackjack' | 'Crash' | 'Canlı Casino' | 'Tümü'

export type AdcCategory = 'Sporlar' | 'Esporlar' | 'Bahis' | 'Slot' | 'Masa & Crash' | 'Canlı Casino'

export interface AdcShopItem {
  id: string
  name: string
  scope: AdcScope
  category: AdcCategory
  /** Price in ADC. */
  cost: number
  /** Free-bet value in ₺ (for spin codes: the number of spins). */
  value: number
  /** How `value` reads: '₺' (default) or 'spin'. */
  unit?: '₺' | 'spin'
  /** Code prefix from the brief (FB-XXXX, KMB-XXXX, CS-SLOT-XXXX, …). */
  prefix: string
  /** Casino only: wagering requirement (×) and which games accept the code. */
  wagering?: number
  casinoGame?: CasinoGame
  /** Sport the resulting code is valid for; 'Tümü' = any sport. */
  sport: string
  /** Minimum legs, for the combo codes. */
  minLegs?: number
  desc: string
  /** Card artwork: our own gradient + glyph, not the reference's photography. */
  gradient: [string, string]
  icon: 'futbol' | 'basketbol' | 'tenis' | 'hokey' | 'espor' | 'kombine' | 'yildiz' | 'kupa'
    | 'slot' | 'rulet' | 'kart' | 'crash' | 'canli' | 'elmas'
}

/** The shop: sports codes (brief v2.0 §5) followed by casino codes (v2.1 §4). */
export const ADC_SHOP: AdcShopItem[] = [
  {
    id: 'futbol', name: 'Futbol Free Bet', scope: 'sport', category: 'Sporlar',
    cost: 100, value: 25, prefix: 'FB', sport: 'Futbol',
    desc: 'Futbol dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#16a34a', '#065f46'], icon: 'futbol',
  },
  {
    id: 'basketbol', name: 'Basketbol Free Bet', scope: 'sport', category: 'Sporlar',
    cost: 100, value: 25, prefix: 'BK', sport: 'Basketbol',
    desc: 'Basketbol dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#ea580c', '#9a3412'], icon: 'basketbol',
  },
  {
    id: 'tenis', name: 'Tenis Free Bet', scope: 'sport', category: 'Sporlar',
    cost: 100, value: 25, prefix: 'TN', sport: 'Tenis',
    desc: 'Tenis dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#ca8a04', '#713f12'], icon: 'tenis',
  },
  {
    id: 'buz-hokeyi', name: 'Buz Hokeyi Free Bet', scope: 'sport', category: 'Sporlar',
    cost: 150, value: 40, prefix: 'BH', sport: 'Buz Hokeyi',
    desc: 'Buz hokeyi dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#0891b2', '#155e75'], icon: 'hokey',
  },
  {
    id: 'espor', name: 'E-Spor Free Bet', scope: 'sport', category: 'Esporlar',
    cost: 150, value: 40, prefix: 'ES', sport: 'E-Spor',
    desc: 'E-spor dalında, 1.50 veya daha yüksek oranlı herhangi bir etkinlikte geçerli ücretsiz bahis kodu.',
    gradient: ['#7c3aed', '#4c1d95'], icon: 'espor',
  },
  {
    id: 'kombine', name: 'Kombine Free Bet (3+)', scope: 'sport', category: 'Bahis',
    cost: 200, value: 60, prefix: 'KMB', sport: 'Tümü', minLegs: 3,
    desc: 'En az 3 seçimli, her biri 1.50 veya daha yüksek oranlı kombine kuponlarda geçerli ücretsiz bahis kodu.',
    gradient: ['#0E8FCF', '#075985'], icon: 'kombine',
  },
  {
    id: 'super', name: 'Süper Spor Bonusu', scope: 'sport', category: 'Bahis',
    cost: 500, value: 200, prefix: 'BETA', sport: 'Tümü',
    desc: 'Tüm spor dallarında geçerli, 200₺ değerinde ücretsiz bahis kodu. 1.50 minimum oran kuralı geçerlidir.',
    gradient: ['#e11d48', '#881337'], icon: 'yildiz',
  },
  {
    id: 'vip', name: 'VIP Mega Spor Bonusu', scope: 'sport', category: 'Bahis',
    cost: 1000, value: 500, prefix: 'VIP', sport: 'Tümü',
    desc: 'Tüm spor dallarında geçerli, 500₺ değerinde en yüksek ücretsiz bahis kodu. 1.50 minimum oran kuralı geçerlidir.',
    gradient: ['#1a2332', '#3a4d6b'], icon: 'kupa',
  },
]

// ── Casino codes (v2.1 §4) ──────────────────────────────────────────────────
ADC_SHOP.push(
  {
    id: 'cs-slot-spin', name: 'Slot Free Spin (20x)', scope: 'casino', category: 'Slot',
    cost: 100, value: 20, unit: 'spin', prefix: 'CS-SLOT', wagering: 10, casinoGame: 'Slot', sport: 'Casino',
    desc: 'Slot oyunlarında geçerli 20 ücretsiz dönüş. Kazançlar 10x çevrim şartına tabidir.',
    gradient: ['#db2777', '#831843'], icon: 'slot',
  },
  {
    id: 'cs-slot-bakiye', name: 'Slot Bonus Bakiye', scope: 'casino', category: 'Slot',
    cost: 150, value: 30, prefix: 'CS-SLOT', wagering: 10, casinoGame: 'Slot', sport: 'Casino',
    desc: 'Slot oyunlarında kullanabileceğiniz 30₺ bonus bakiye. 10x çevrim şartına tabidir.',
    gradient: ['#f59e0b', '#92400e'], icon: 'slot',
  },
  {
    id: 'cs-rulet', name: 'Rulet Free Bet', scope: 'casino', category: 'Masa & Crash',
    cost: 200, value: 50, prefix: 'CS-RLT', wagering: 15, casinoGame: 'Rulet', sport: 'Casino',
    desc: 'Rulet masalarında geçerli 50₺ ücretsiz bahis. 15x çevrim şartına tabidir.',
    gradient: ['#dc2626', '#7f1d1d'], icon: 'rulet',
  },
  {
    id: 'cs-blackjack', name: 'Blackjack Free Bet', scope: 'casino', category: 'Masa & Crash',
    cost: 200, value: 50, prefix: 'CS-BJ', wagering: 15, casinoGame: 'Blackjack', sport: 'Casino',
    desc: 'Blackjack masalarında geçerli 50₺ ücretsiz bahis. 15x çevrim şartına tabidir.',
    gradient: ['#15803d', '#14532d'], icon: 'kart',
  },
  {
    id: 'cs-crash', name: 'Crash/Aviator Free Bet', scope: 'casino', category: 'Masa & Crash',
    cost: 150, value: 40, prefix: 'CS-CRSH', wagering: 10, casinoGame: 'Crash', sport: 'Casino',
    desc: 'Crash ve Aviator oyunlarında geçerli 40₺ ücretsiz bahis. 10x çevrim şartına tabidir.',
    gradient: ['#e11d48', '#4c0519'], icon: 'crash',
  },
  {
    id: 'lc-live', name: 'Canlı Casino Free Bet', scope: 'casino', category: 'Canlı Casino',
    cost: 250, value: 60, prefix: 'LC-LIVE', wagering: 20, casinoGame: 'Canlı Casino', sport: 'Casino',
    desc: 'Canlı casino masalarında geçerli 60₺ ücretsiz bahis. 20x çevrim şartına tabidir.',
    gradient: ['#9333ea', '#3b0764'], icon: 'canli',
  },
  {
    id: 'cs-vip', name: 'VIP Casino Bonus', scope: 'casino', category: 'Canlı Casino',
    cost: 1000, value: 500, prefix: 'CS-VIP', wagering: 25, casinoGame: 'Tümü', sport: 'Casino',
    desc: 'Tüm casino oyunlarında geçerli 500₺ VIP bonus. 25x çevrim şartına tabidir; maksimum kazanç 2.000₺.',
    gradient: ['#1a2332', '#b45309'], icon: 'elmas',
  },
)

export const ADC_CATEGORIES: Record<AdcScope, AdcCategory[]> = {
  sport: ['Sporlar', 'Esporlar', 'Bahis'],
  casino: ['Slot', 'Masa & Crash', 'Canlı Casino'],
}

/** "25 ₺" or "20 spin". */
export const fmtReward = (x: { value: number; unit?: '₺' | 'spin' }) =>
  x.unit === 'spin' ? `${x.value} spin` : `${x.value} ₺`

export function shopItem(id: string): AdcShopItem | undefined {
  return ADC_SHOP.find(i => i.id === id)
}

// ── Codes ───────────────────────────────────────────────────────────────────

export interface AdcCode {
  code: string
  itemId: string
  name: string
  scope?: AdcScope
  sport: string
  unit?: '₺' | 'spin'
  wagering?: number
  casinoGame?: CasinoGame
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

/** `FB-4821` — the brief's PREFIX-XXXX format. Casino codes use the brief's
 *  alphanumeric suffix (CS-SLOT-A3B7). */
export function makeCode(prefix: string, scope: AdcScope = 'sport'): string {
  if (scope === 'sport') return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let tail = ''
  for (let i = 0; i < 4; i++) tail += chars[Math.floor(Math.random() * chars.length)]
  return `${prefix}-${tail}`
}

export function issueCode(item: AdcShopItem, now = Date.now()): AdcCode {
  const lifetime = item.scope === 'casino' ? CASINO_CODE_LIFETIME_DAYS : CODE_LIFETIME_DAYS
  return {
    code: makeCode(item.prefix, item.scope),
    itemId: item.id,
    name: item.name,
    scope: item.scope,
    sport: item.sport,
    unit: item.unit,
    wagering: item.wagering,
    casinoGame: item.casinoGame,
    minLegs: item.minLegs,
    value: item.value,
    minOdds: CODE_MIN_ODDS,
    cost: item.cost,
    createdAt: now,
    expiresAt: now + lifetime * DAY,
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

export type AdcTxType = 'deposit' | 'confirm' | 'spend' | 'quest' | 'social' | 'referral'
/** Types that create new points (confirm only moves pending → available). */
export const EARN_TX: AdcTxType[] = ['deposit', 'quest', 'social', 'referral']

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
  if (scopeOf(c) === 'casino') return 'Yalnızca casino oyunlarında geçerli.'
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

/** Why a casino code can't be used on a game of type `game`, or null. */
export function casinoCodeReason(c: AdcCode, game: CasinoGame, now = Date.now()): string | null {
  if (scopeOf(c) !== 'casino') return 'Bu bir spor kodu; kupon ekranında kullanılır.'
  const st = codeStatus(c, now)
  if (st === 'used') return 'Bu kod kullanıldı.'
  if (st === 'expired') return 'Bu kodun süresi geçti.'
  if (c.casinoGame && c.casinoGame !== 'Tümü' && c.casinoGame !== game) return `Yalnızca ${c.casinoGame} oyunlarında geçerli.`
  return null
}

export const fmtAdc = (n: number) => n.toLocaleString('tr-TR')
