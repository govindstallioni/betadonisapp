// ── Adonis Coin v2.1 — quests, social shares, invites (work3 task 8) ────────
// From betadonis.store/revize-coin.html §3, §5, §6. Pure data and maths; the
// state lives in AdcProvider. Progress is derived from the activity the app
// records (logins, placed bets, casino launches) — never typed in by hand.

/** One-off reward for completing and verifying the profile (task 33). */
export const PROFILE_REWARD = 25

export type QuestTab = 'daily' | 'weekly' | 'achievement'
export type Reset = 'day' | 'week' | 'month' | 'never'
export type QuestMetric =
  | 'login' | 'bet' | 'bet_sports' | 'casino_volume'
  | 'week_login_days' | 'week_volume' | 'month_volume'
  | 'first_combo' | 'first_live' | 'first_casino' | 'streak'

export interface Quest {
  id: string
  tab: QuestTab
  title: string
  desc: string
  metric: QuestMetric
  target: number
  reward: number
  resets: Reset
  /** Progress unit shown next to the numbers ('₺', 'gün'). */
  unit?: string
  badge?: string
}

export const QUESTS: Quest[] = [
  // Günlük — reset at 00:00
  { id: 'd-login', tab: 'daily', title: 'Günlük Giriş', desc: 'Her gün siteye giriş yap', metric: 'login', target: 1, reward: 5, resets: 'day' },
  { id: 'd-bet', tab: 'daily', title: '1 Bahis Oyna', desc: 'Min. 50₺ değerinde bahis', metric: 'bet', target: 1, reward: 15, resets: 'day' },
  { id: 'd-sports', tab: 'daily', title: '3 Farklı Spora Bahis', desc: 'Futbol, basketbol, tenis…', metric: 'bet_sports', target: 3, reward: 40, resets: 'day' },
  { id: 'd-casino', tab: 'daily', title: 'Casino’da 100₺ Çevir', desc: 'Herhangi bir casino oyunu', metric: 'casino_volume', target: 100, reward: 25, resets: 'day', unit: '₺' },
  // Haftalık (Pazartesi 00:00) + aylık
  { id: 'w-login', tab: 'weekly', title: 'Haftalık 5 Gün Giriş', desc: 'Bu hafta 5 farklı gün giriş yap', metric: 'week_login_days', target: 5, reward: 100, resets: 'week', unit: 'gün' },
  { id: 'w-volume', tab: 'weekly', title: 'Haftalık 5.000₺ Bahis', desc: 'Bu hafta toplam 5.000₺ bahis hacmi', metric: 'week_volume', target: 5000, reward: 250, resets: 'week', unit: '₺' },
  { id: 'm-volume', tab: 'weekly', title: 'Aylık 25.000₺ Bahis', desc: 'Bu ay toplam 25.000₺ bahis hacmi', metric: 'month_volume', target: 25000, reward: 1500, resets: 'month', unit: '₺', badge: 'AYLIK' },
  // Başarı — once
  { id: 'a-combo', tab: 'achievement', title: 'İlk Kombine Kupon', desc: '3+ maçlık kombine oyna', metric: 'first_combo', target: 1, reward: 100, resets: 'never', badge: 'TEK SEFER' },
  { id: 'a-live', tab: 'achievement', title: 'İlk Canlı Bahis', desc: 'Canlı bir maça bahis yap', metric: 'first_live', target: 1, reward: 75, resets: 'never', badge: 'TEK SEFER' },
  { id: 'a-casino', tab: 'achievement', title: 'İlk Casino Oyunu', desc: 'Bir casino oyununu gerçek parayla aç', metric: 'first_casino', target: 1, reward: 50, resets: 'never', badge: 'TEK SEFER' },
  // Seri (streak) — §5 table
  { id: 's-3', tab: 'achievement', title: '3 Gün Seri', desc: '3 gün üst üste giriş yap', metric: 'streak', target: 3, reward: 30, resets: 'week', unit: 'gün', badge: 'SERİ' },
  { id: 's-7', tab: 'achievement', title: '7 Gün Seri', desc: '7 gün üst üste giriş · %5 bahis bonusu', metric: 'streak', target: 7, reward: 200, resets: 'week', unit: 'gün', badge: 'SERİ' },
  { id: 's-14', tab: 'achievement', title: '14 Gün Seri', desc: '14 gün üst üste giriş · %10 bahis bonusu', metric: 'streak', target: 14, reward: 500, resets: 'month', unit: 'gün', badge: 'SERİ' },
  { id: 's-30', tab: 'achievement', title: '30 Gün Seri', desc: '30 gün üst üste giriş · VIP + %15 bahis bonusu', metric: 'streak', target: 30, reward: 1500, resets: 'month', unit: 'gün', badge: 'SERİ' },
]

// ── Activity (what the app records) ─────────────────────────────────────────

export interface BetActivity { at: number; stake: number; sports: string[]; combo: boolean; live: boolean }
export interface CasinoActivity { at: number; amount: number; game: string }

export interface AdcActivity {
  /** Local 'YYYY-MM-DD' days the user was logged in. */
  loginDays: string[]
  bets: BetActivity[]
  casino: CasinoActivity[]
  firsts: { combo?: number; live?: number; casino?: number }
}

export const EMPTY_ACTIVITY: AdcActivity = { loginDays: [], bets: [], casino: [], firsts: {} }

const p2 = (n: number) => String(n).padStart(2, '0')
export const dayStr = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`

function startOfWeek(now: Date) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // Monday
  return d
}

/** Key of the period a quest is currently in; a claim is valid for one key. */
export function periodKey(resets: Reset, now = new Date()): string {
  if (resets === 'day') return dayStr(now)
  if (resets === 'week') return `W${dayStr(startOfWeek(now))}`
  if (resets === 'month') return `M${now.getFullYear()}-${p2(now.getMonth() + 1)}`
  return 'once'
}

/** Consecutive login days ending today (or yesterday, if today isn't in yet). */
export function currentStreak(loginDays: string[], now = new Date()): number {
  const set = new Set(loginDays)
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!set.has(dayStr(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (set.has(dayStr(d))) { n++; d.setDate(d.getDate() - 1) }
  return n
}

export function questProgress(q: Quest, a: AdcActivity, now = new Date()): number {
  const today = dayStr(now)
  const weekStart = startOfWeek(now).getTime()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const isToday = (t: number) => dayStr(new Date(t)) === today
  switch (q.metric) {
    case 'login': return a.loginDays.includes(today) ? 1 : 0
    case 'bet': return a.bets.filter(b => isToday(b.at) && b.stake >= 50).length
    case 'bet_sports': return new Set(a.bets.filter(b => isToday(b.at)).flatMap(b => b.sports)).size
    case 'casino_volume': return a.casino.filter(c => isToday(c.at)).reduce((s, c) => s + c.amount, 0)
    case 'week_login_days': return a.loginDays.filter(d => new Date(`${d}T00:00:00`).getTime() >= weekStart).length
    case 'week_volume': return a.bets.filter(b => b.at >= weekStart).reduce((s, b) => s + b.stake, 0)
    case 'month_volume': return a.bets.filter(b => b.at >= monthStart).reduce((s, b) => s + b.stake, 0)
    case 'first_combo': return a.firsts.combo ? 1 : 0
    case 'first_live': return a.firsts.live ? 1 : 0
    case 'first_casino': return a.firsts.casino ? 1 : 0
    case 'streak': return currentStreak(a.loginDays, now)
  }
}

/** Activity older than this is dropped — nothing reads further back. */
export const ACTIVITY_KEEP_MS = 40 * 86_400_000

/** Demo amount a real-money casino launch counts toward "Casino'da 100₺ çevir"
 *  (the prototype has no game rounds to measure). */
export const CASINO_LAUNCH_AMOUNT = 50

// ── Social media shares (§6) — manual review ────────────────────────────────

export type SocialPlatform = 'x' | 'facebook' | 'instagram' | 'tiktok' | 'telegram'

export const SOCIAL_PLATFORMS: { id: SocialPlatform; name: string; task: string; reward: number; color: string }[] = [
  { id: 'x', name: 'X (Twitter)', task: 'Post paylaş + #AdonisCoin', reward: 75, color: '#0f1419' },
  { id: 'instagram', name: 'Instagram', task: 'Story paylaş + mention', reward: 50, color: '#d6249f' },
  { id: 'facebook', name: 'Facebook', task: 'Sayfa/grup paylaşımı', reward: 50, color: '#1877f2' },
  { id: 'tiktok', name: 'TikTok', task: 'Video paylaş + hashtag', reward: 100, color: '#111111' },
  { id: 'telegram', name: 'Telegram', task: 'Grup paylaşımı', reward: 30, color: '#26a5e4' },
]

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface SocialSubmission {
  id: string
  platform: SocialPlatform
  link: string
  /** Screenshot metadata only — the image itself is never stored (it would
   *  not fit in localStorage). The fingerprint drives the duplicate rule. */
  fileName: string
  fileSize: number
  fingerprint: string
  note: string
  reward: number
  status: SubmissionStatus
  adminNote?: string
  createdAt: number
  /** Simulated review time — there is no admin panel in this prototype. */
  reviewAt: number
  reviewedAt?: number
}

export const SOCIAL_REVIEW_MS = 25_000

// ── Friend invites (§3: +50 ADC when the invited friend first deposits) ─────

export const REFERRAL_REWARD = 50
export type InviteStatus = 'sent' | 'registered' | 'deposited'

export interface Invite {
  id: string
  name: string
  status: InviteStatus
  createdAt: number
  /** Simulated milestones (no backend to report them). */
  registerAt: number
  depositAt: number
  rewardedAt?: number
}

export const INVITE_STATUS_LABEL: Record<InviteStatus, string> = {
  sent: 'Davet gönderildi',
  registered: 'Kayıt oldu · ilk yatırım bekleniyor',
  deposited: 'İlk yatırımı yaptı',
}

export const referralCode = (username: string) =>
  `ADN-${(username || 'UYE').toLocaleUpperCase('tr-TR').replace(/[^A-Z0-9ÇĞİÖŞÜ]/g, '').slice(0, 10) || 'UYE'}`
