// ── Withdrawal requests store (localStorage) ────────────────────────────────
// Real withdrawals created on /kupon/withdraw. Before this module the screen
// debited the balance and remembered nothing, so "Son Para Çekme" could never
// have shown the request the user had just made.
//
// A plain module rather than a React provider, like src/data/coupons.ts: this
// data is read by the withdrawal screen and Geçmiş, not across the whole app.

export type WithdrawStatus = 'pending' | 'approved' | 'cancelled'

export interface Withdrawal {
  /** Reference number, also the row id (BW-XXXXXXX). */
  id: string
  method: string
  /** "Havale", "Online Papara", "Kripto" — the parenthesised type in the picker. */
  methodType: string
  amount: number
  at: number
  status: WithdrawStatus
  /** Long-form reason shown in the AÇIKLAMA sheet. */
  note: string
  /** The form values the request was made with. */
  details: Record<string, string>
}

const KEY = 'bta_withdrawals'
const DAY = 86_400_000
const HOUR = 3_600_000

export const WITHDRAW_STATUS_LABEL: Record<WithdrawStatus, string> = {
  pending: 'İnceleniyor',
  approved: 'Onaylandı',
  cancelled: 'İptal Edilmiş',
}

/** Short line under the amount on the card. */
export const WITHDRAW_STATUS_LINE: Record<WithdrawStatus, string> = {
  pending: 'Para çekme işleminiz inceleniyor.',
  approved: 'Para çekme işleminiz tamamlanmıştır.',
  cancelled: 'Para çekme işleminiz iptal edilmiştir.',
}

export const WITHDRAW_STATUS_COLOR: Record<WithdrawStatus, string> = {
  pending: '#f39c12',
  approved: '#27ae60',
  cancelled: '#e74c3c',
}

// Demo history so the list, the statuses and "Daha Fazla Yükle" have something
// to show on a fresh browser — the same idiom BetHistory already uses for its
// sample bets. Real requests are prepended ahead of these.
const SEED: { daysAgo: number; hour: number; minute: number; method: string; methodType: string; amount: number; status: WithdrawStatus; note: string; details: Record<string, string> }[] = [
  {
    daysAgo: 2, hour: 19, minute: 47, method: 'Bank Transfer', methodType: 'Havale', amount: 2000, status: 'cancelled',
    note: 'Talebiniz, hesap sahibi adı ile üyelik bilgileriniz eşleşmediği için iptal edilmiştir. Bilgilerinizi güncelleyip tekrar deneyebilirsiniz.',
    details: { 'Banka Adı': 'GARANTİ BANKASI', 'Hesap Sahibi': 'Ahmet Yılmaz', 'IBAN': 'TR09 0006 2000 7390 0006 6237 10' },
  },
  {
    daysAgo: 13, hour: 14, minute: 4, method: 'Bank Transfer', methodType: 'Havale', amount: 2000, status: 'cancelled',
    note: 'Çevrim şartı tamamlanmadığı için talebiniz iptal edilmiştir. Aktif bonusunuzun çevrim durumunu Bonuslar sayfasından görebilirsiniz.',
    details: { 'Banka Adı': 'GARANTİ BANKASI', 'Hesap Sahibi': 'Ahmet Yılmaz', 'IBAN': 'TR09 0006 2000 7390 0006 6237 10' },
  },
  {
    daysAgo: 17, hour: 12, minute: 26, method: 'Papara (MPAY)', methodType: 'Online Papara', amount: 1500, status: 'approved',
    note: 'Talebiniz onaylandı ve tutar Papara hesabınıza aktarıldı.',
    details: { 'Hesap Sahibi': 'Ahmet Yılmaz', 'Papara Numarası': '1234567890' },
  },
  {
    daysAgo: 24, hour: 21, minute: 9, method: 'Tether USDT', methodType: 'Kripto', amount: 3000, status: 'approved',
    note: 'Talebiniz onaylandı ve tutar cüzdanınıza gönderildi. Ağ onayı sonrasında bakiyenize yansıyacaktır.',
    details: { 'Ağ': 'TRC20', 'Cüzdan Adresi': 'TQ5n9…8vKp' },
  },
  {
    daysAgo: 31, hour: 10, minute: 52, method: 'Bank Transfer', methodType: 'Havale', amount: 2000, status: 'cancelled',
    note: 'Talebiniz, belirtilen IBAN geçersiz olduğu için iptal edilmiştir. Lütfen IBAN bilgilerinizi kontrol edin.',
    details: { 'Banka Adı': 'ZİRAAT BANKASI', 'Hesap Sahibi': 'Ahmet Yılmaz', 'IBAN': 'TR33 0001 0000 0000 0000 0000 01' },
  },
  {
    daysAgo: 38, hour: 16, minute: 33, method: 'Bitcoin', methodType: 'Kripto', amount: 5000, status: 'approved',
    note: 'Talebiniz onaylandı ve tutar cüzdanınıza gönderildi.',
    details: { 'Ağ': 'Bitcoin', 'Cüzdan Adresi': 'bc1qx…4f7d' },
  },
]

function seeded(): Withdrawal[] {
  const now = Date.now()
  return SEED.map((s, i) => {
    const d = new Date(now - s.daysAgo * DAY)
    d.setHours(s.hour, s.minute, 0, 0)
    return {
      id: 'BW-' + String(4200000 + i * 10781),
      method: s.method,
      methodType: s.methodType,
      amount: s.amount,
      at: d.getTime(),
      status: s.status,
      note: s.note,
      details: s.details,
    }
  })
}

export function loadWithdrawals(): Withdrawal[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as Withdrawal[]
    }
    const s = seeded()
    saveWithdrawals(s)
    return s
  } catch {
    return []
  }
}

export function saveWithdrawals(list: Withdrawal[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
}

export function addWithdrawal(w: Withdrawal) {
  const all = loadWithdrawals()
  all.unshift(w)
  saveWithdrawals(all)
}

export function makeRef() {
  return 'BW-' + String(Math.floor(1_000_000 + Math.random() * 9_000_000))
}

const p2 = (n: number) => String(n).padStart(2, '0')

/** "10.09" — the reference shows date and time as two separate chips. */
export function fmtDay(ts: number) {
  const d = new Date(ts)
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}`
}

export function fmtTime(ts: number) {
  const d = new Date(ts)
  return `${p2(d.getHours())}:${p2(d.getMinutes())}`
}

export function fmtFull(ts: number) {
  const d = new Date(ts)
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`
}

export const fmtAmount = (n: number) =>
  n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export { HOUR }
