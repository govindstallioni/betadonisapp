'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { loadCoupons, saveCoupons, resolveOutcome, type Coupon } from '@/data/coupons'

const historyTypes = [
  { label: 'Bahis Geçmişi' },
  { label: 'Bekleyen Bahisler' },
]

// Quick-filter tabs shown in the header (see ls2/ls3 reference).
const tabs = ['Hepsi', 'Kazanmış', 'Bekleyenler']

// İşlem tipi options inside the Filtrele sheet.
const filterTypes = ['Hepsi', 'Kazanmış', 'Kaybetmiş', 'Bekleyen', 'İptal']

// ── Sample bet data (prototype has no backend) ──────────────────────────
type BetStatus = 'won' | 'lost' | 'pending' | 'cancelled'

type Leg = {
  league: string
  match: string
  pick: string          // market + selection, e.g. "Maç Sonucu: 1"
  odd: number
  result: BetStatus
  score?: string        // final/live score, when settled
}

type Bet = {
  id: string
  type: 'Tekli' | 'Kombine' | 'Sistem'
  status: BetStatus
  date: string
  stake: number
  totalOdds: number
  payout: number        // won → paid, lost → 0, pending → potential, cancelled → refund
  legs: Leg[]
}

const sampleBets: Bet[] = [
  {
    id: 'A1029',
    type: 'Kombine',
    status: 'won',
    date: '12.07.2026 21:45',
    stake: 100,
    totalOdds: 3.465,
    payout: 346.5,
    legs: [
      { league: 'Türkiye. Süper Lig', match: 'Galatasaray - Fenerbahçe', pick: 'Maç Sonucu: 1', odd: 2.10, result: 'won', score: '2-1' },
      { league: 'İspanya. La Liga', match: 'Real Madrid - Barcelona', pick: 'Karşılıklı Gol: Var', odd: 1.65, result: 'won', score: '3-2' },
    ],
  },
  {
    id: 'A0987',
    type: 'Kombine',
    status: 'pending',
    date: '15.07.2026 20:00',
    stake: 75,
    totalOdds: 6.815,
    payout: 511.13,
    legs: [
      { league: 'Türkiye. Süper Lig', match: 'Beşiktaş - Trabzonspor', pick: 'Maç Sonucu: 1', odd: 2.35, result: 'pending' },
      { league: 'Fransa. Ligue 1', match: 'PSG - Lyon', pick: 'İlk Yarı/Maç Sonu: 1/1', odd: 2.90, result: 'pending' },
    ],
  },
  {
    id: 'A0955',
    type: 'Tekli',
    status: 'won',
    date: '08.07.2026 04:00',
    stake: 200,
    totalOdds: 1.90,
    payout: 380,
    legs: [
      { league: 'ABD. NBA', match: 'LA Lakers - Boston Celtics', pick: 'Handikap: Ev (-4.5)', odd: 1.90, result: 'won', score: '110-102' },
    ],
  },
  {
    id: 'A0921',
    type: 'Tekli',
    status: 'lost',
    date: '10.07.2026 19:30',
    stake: 50,
    totalOdds: 1.80,
    payout: 0,
    legs: [
      { league: 'İngiltere. Premier Ligi', match: 'Arsenal - Chelsea', pick: 'Toplam: Üst (2.5)', odd: 1.80, result: 'lost', score: '1-0' },
    ],
  },
  {
    id: 'A0888',
    type: 'Tekli',
    status: 'pending',
    date: '15.07.2026 18:00',
    stake: 40,
    totalOdds: 2.05,
    payout: 82,
    legs: [
      { league: 'İngiltere. Premier Ligi', match: 'Manchester City - Liverpool', pick: 'Karşılıklı Gol & Üst 2.5', odd: 2.05, result: 'pending' },
    ],
  },
  {
    id: 'A0842',
    type: 'Tekli',
    status: 'cancelled',
    date: '05.07.2026 21:00',
    stake: 60,
    totalOdds: 1.00,
    payout: 60,
    legs: [
      { league: 'İtalya. Serie A', match: 'Juventus - Napoli', pick: 'Maç Sonucu: 2', odd: 3.10, result: 'cancelled' },
    ],
  },
]

// Status → Turkish label + badge/amount colors (readable on light & dark).
const statusMeta: Record<BetStatus, { label: string; color: string; bg: string }> = {
  won:       { label: 'Kazandı',  color: '#27ae60', bg: 'rgba(39,174,96,0.12)' },
  lost:      { label: 'Kaybetti', color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
  pending:   { label: 'Bekliyor', color: '#f39c12', bg: 'rgba(243,156,18,0.15)' },
  cancelled: { label: 'İptal',    color: '#8899aa', bg: 'rgba(136,153,170,0.15)' },
}

// localStorage key for which coupons are expanded (persists across reloads).
const OPEN_KEY = 'bta_history_open'

// Tab index → status filter, and İşlem Tipi label → status filter.
const tabStatus: (BetStatus | 'all')[] = ['all', 'won', 'pending']
const filterStatus: Record<string, BetStatus | 'all'> = {
  'Hepsi': 'all', 'Kazanmış': 'won', 'Kaybetmiş': 'lost', 'Bekleyen': 'pending', 'İptal': 'cancelled',
}

// Turkish currency: 1.250,00 ₺
function formatTRY(n: number) {
  const [int, dec] = n.toFixed(2).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${grouped},${dec} ₺`
}

// "12.07.2026 21:45" → "2026-07-12" (sortable, comparable to a date input value).
function betDay(date: string) {
  const [d, m, y] = date.split(' ')[0].split('.')
  return `${y}-${m}-${d}`
}

function SoccerIcon() {
  return (
    <div className="w-[16px] h-[16px] rounded-full bg-[#edf5ff] border border-[#d0e8f8] flex items-center justify-center flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 512 512" fill="#0E8FCF">
        <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z"/>
      </svg>
    </div>
  )
}

// Per-leg outcome indicator (settled → check/cross, open → clock).
function LegResult({ result }: { result: BetStatus }) {
  const m = statusMeta[result]
  return (
    <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: m.bg }}>
      {result === 'won' ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      ) : result === 'lost' ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      ) : result === 'cancelled' ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round"><line x1="6" y1="12" x2="18" y2="12"/></svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 8 12 12 15 14"/></svg>
      )}
    </div>
  )
}

function BetCard({ bet, open, onToggle }: { bet: Bet; open: boolean; onToggle: () => void }) {
  const m = statusMeta[bet.status]
  const payoutLabel = bet.status === 'pending' ? 'OLASI KAZANÇ' : bet.status === 'cancelled' ? 'İADE' : 'KAZANÇ'
  // Class-based colors so the html.dark overrides apply (#1a2332 → light, #737B8C stays muted).
  const payoutClass = bet.status === 'won' ? 'text-[#27ae60]' : bet.status === 'lost' ? 'text-[#737B8C]' : 'text-[#1a2332]'

  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-sm overflow-hidden">
      {/* Header — tap to expand/collapse */}
      <button type="button" onClick={onToggle} className="w-full flex items-center px-3 py-[10px] text-left">
        <div className="flex items-center gap-[8px] min-w-0 flex-1">
          <span className="text-[10px] font-bold px-[8px] py-[3px] rounded-full flex-shrink-0" style={{ color: m.color, background: m.bg }}>
            {m.label}
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#1a2332] leading-tight truncate">{bet.type} · {bet.legs.length} Maç</p>
            <p className="text-[10px] text-[#94a3b8] mt-[1px]">{bet.date} · No: {bet.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-[8px] flex-shrink-0 ml-2">
          <div className="text-right">
            <p className="text-[8px] font-semibold text-[#737B8C] tracking-wide">{payoutLabel}</p>
            <p className={`text-[12px] font-bold tabular-nums ${payoutClass}`}>{formatTRY(bet.payout)}</p>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-[#f0f4f8]">
          {/* Legs */}
          {bet.legs.map((leg, i) => (
            <div key={i} className={`px-3 py-[10px] ${i < bet.legs.length - 1 ? 'border-b border-[#f4f6f9]' : ''}`}>
              <div className="flex items-center gap-[5px] mb-[3px]">
                <SoccerIcon />
                <span className="text-[10px] text-[#737B8C] truncate">{leg.league}</span>
                {leg.score && <span className="text-[10px] font-semibold text-[#1a2332] ml-auto tabular-nums flex-shrink-0">{leg.score}</span>}
              </div>
              <p className="text-[12px] font-semibold text-[#1a2332] mb-[6px] leading-tight">{leg.match}</p>
              <div className="flex items-center gap-[8px] bg-[#f4f7fb] rounded-[8px] px-3 py-[7px]">
                <LegResult result={leg.result} />
                <span className="text-[10px] text-[#737B8C] flex-1 min-w-0 truncate">{leg.pick}</span>
                <span className="text-[11px] font-bold text-[#1a2332] tabular-nums flex-shrink-0">{leg.odd.toFixed(2)}</span>
              </div>
            </div>
          ))}

          {/* Footer — stake / total odds */}
          <div className="flex border-t border-[#f0f4f8] bg-[#f4f7fb]">
            <div className="flex-1 px-3 py-[9px] text-center border-r border-[#e8ecf1]">
              <p className="text-[9px] text-[#737B8C]">BAHİS</p>
              <p className="text-[12px] font-bold text-[#1a2332] tabular-nums mt-[1px]">{formatTRY(bet.stake)}</p>
            </div>
            <div className="flex-1 px-3 py-[9px] text-center">
              <p className="text-[9px] text-[#737B8C]">TOPLAM ORAN</p>
              <p className="text-[12px] font-bold text-[#1a2332] tabular-nums mt-[1px]">{bet.totalOdds.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Mascot() {
  return (
    <svg viewBox="0 0 160 160" width="160" height="160">
      {/* Calendar body */}
      <rect x="30" y="70" width="100" height="75" rx="10" fill="#c5dff0"/>
      <rect x="30" y="70" width="100" height="22" rx="10" fill="#8bb8d8"/>
      <rect x="30" y="81" width="100" height="11" fill="#8bb8d8"/>
      {/* Calendar grid lines */}
      <line x1="55" y1="103" x2="55" y2="135" stroke="#a8ccdf" strokeWidth="1"/>
      <line x1="80" y1="103" x2="80" y2="135" stroke="#a8ccdf" strokeWidth="1"/>
      <line x1="105" y1="103" x2="105" y2="135" stroke="#a8ccdf" strokeWidth="1"/>
      <line x1="38" y1="112" x2="122" y2="112" stroke="#a8ccdf" strokeWidth="1"/>
      <line x1="38" y1="124" x2="122" y2="124" stroke="#a8ccdf" strokeWidth="1"/>
      {/* Calendar dots */}
      {[45,67,92,117].map((x,i) => [103,115,127].map((y,j) => (
        <circle key={`${i}-${j}`} cx={x} cy={y} r="3" fill="#8bb8d8" opacity="0.7"/>
      )))}
      {/* Body/head */}
      <circle cx="80" cy="55" r="28" fill="#5b9fc4"/>
      {/* Hat brim */}
      <ellipse cx="80" cy="33" rx="30" ry="6" fill="#4a8db5"/>
      {/* Hat top */}
      <rect x="60" y="16" width="40" height="20" rx="4" fill="#4a8db5"/>
      {/* Hat band */}
      <rect x="60" y="30" width="40" height="5" rx="1" fill="#3a7da5"/>
      {/* Sunglasses */}
      <rect x="58" y="52" width="20" height="12" rx="5" fill="#3a7da5" opacity="0.9"/>
      <rect x="82" y="52" width="20" height="12" rx="5" fill="#3a7da5" opacity="0.9"/>
      <line x1="78" y1="57" x2="82" y2="57" stroke="#3a7da5" strokeWidth="2"/>
      <line x1="55" y1="57" x2="58" y2="57" stroke="#3a7da5" strokeWidth="2"/>
      <line x1="102" y1="57" x2="106" y2="57" stroke="#3a7da5" strokeWidth="2"/>
      {/* Smile */}
      <path d="M68 72 Q80 80 92 72" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Tentacles */}
      <path d="M52 75 Q30 65 28 80 Q26 95 35 90" stroke="#5b9fc4" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M108 75 Q130 65 132 80 Q134 95 125 90" stroke="#5b9fc4" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M52 85 Q20 80 22 100" stroke="#5b9fc4" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M108 85 Q140 80 138 100" stroke="#5b9fc4" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// Clock badge shown to logged-out users (see gecmislogin reference).
function ClockBadge() {
  return (
    <div className="w-[84px] h-[84px] rounded-full bg-[#aeb9c9] flex items-center justify-center">
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 7 12 12 15.5 14"/>
      </svg>
    </div>
  )
}

export default function BetHistory() {
  const router = useRouter()
  const { loaded, isLoggedIn, adjustBalance } = useAuth()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [activeHistoryType, setActiveHistoryType] = useState(0)
  const [showHistoryType, setShowHistoryType] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<BetStatus | 'all'>('all')
  const [filterType, setFilterType] = useState('Hepsi')
  const [startDate, setStartDate] = useState('')       // range inputs (uncommitted)
  const [endDate, setEndDate] = useState('')
  const [appliedStart, setAppliedStart] = useState('') // committed on FİLTRELE — filters the list
  const [appliedEnd, setAppliedEnd] = useState('')
  const [openBets, setOpenBets] = useState<Set<string>>(() => new Set())
  const [hydrated, setHydrated] = useState(false)

  // Restore expanded coupons after mount (client-only → no hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(OPEN_KEY)
      if (raw) setOpenBets(new Set(JSON.parse(raw) as string[]))
    } catch {}
    setHydrated(true)
  }, [])

  // Persist on change — but only after the initial restore, so the empty
  // default doesn't clobber saved state on first render.
  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(OPEN_KEY, JSON.stringify([...openBets])) } catch {}
  }, [openBets, hydrated])

  // Load real placed coupons and settle any that are due (win/lose). Winnings
  // are credited to the balance once, when a coupon flips pending → won.
  useEffect(() => {
    if (!isLoggedIn) { setCoupons([]); return }
    const settle = () => {
      const now = Date.now()
      const all = loadCoupons()
      let credit = 0
      let changed = false
      const resolved = all.map(c => {
        if (c.status === 'pending' && c.settleAt <= now) {
          changed = true
          const r = resolveOutcome(c)
          if (r.status === 'won') credit += r.payout
          return r
        }
        return c
      })
      if (changed) { saveCoupons(resolved); if (credit > 0) adjustBalance(credit) }
      setCoupons(resolved)
    }
    settle()
    const iv = setInterval(settle, 4000)
    return () => clearInterval(iv)
  }, [isLoggedIn, adjustBalance])

  const allBets: Bet[] = [...coupons, ...sampleBets]

  const visibleBets = allBets.filter(b => {
    const day = betDay(b.date)
    return (statusFilter === 'all' || b.status === statusFilter) &&
      (appliedStart === '' || day >= appliedStart) &&
      (appliedEnd === '' || day <= appliedEnd)
  })

  function toggleBet(id: string) {
    setOpenBets(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen relative">

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-[#e8ecf1]">
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-8"/>
          <button onClick={() => setShowHistoryType(true)} className="flex items-center gap-[4px]">
            <span className="text-[16px] font-bold text-[#1a2332]">
              {historyTypes[activeHistoryType].label}
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="4" rx="1"/>
              <rect x="2" y="10" width="20" height="4" rx="1"/>
              <rect x="2" y="17" width="20" height="4" rx="1"/>
            </svg>
          </button>
        </div>

        {/* Tabs + Filtrele */}
        <div className="flex items-center gap-[8px]">
          <div className="flex-1 flex bg-[#f1f5f9] rounded-full p-[3px] border border-[#e8ecf1]">
            {tabs.map((t, i) => (
              <button key={t} type="button" onClick={() => { setStatusFilter(tabStatus[i]); setFilterType(filterTypes[i === 0 ? 0 : i === 1 ? 1 : 3]) }}
                className={`flex-1 text-[12px] font-semibold py-[7px] rounded-full transition-all ${statusFilter === tabStatus[i] ? 'bg-[#0E8FCF] text-white' : 'text-[#1a2332]'}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setShowFilters(true)}
            className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-full bg-[#f1f5f9] border border-[#e8ecf1] text-[#0E8FCF] text-[12px] font-semibold flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filtrele
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {!loaded ? null : isLoggedIn ? (
        visibleBets.length > 0 ? (
          /* Logged-in: bet list */
          <div className="px-3 pt-3 pb-28 flex flex-col gap-[8px]">
            {visibleBets.map(bet => (
              <BetCard key={bet.id} bet={bet} open={openBets.has(bet.id)} onToggle={() => toggleBet(bet.id)} />
            ))}
          </div>
        ) : (
          /* Logged-in: no bets match the current filter */
          <div className="flex flex-col items-center justify-center px-8 pt-10 pb-28">
            <Mascot />
            <p className="text-[12px] text-[#737B8C] font-medium text-center leading-relaxed mt-3 mb-4 whitespace-pre-line">
              {'Seçilen dönem için bahis bulunmamaktadır.\nDaha fazla tahmin yapın ve kazanın!'}
            </p>
            <button onClick={() => router.push('/')} className="bg-[#0E8FCF] text-white text-[12px] font-semibold rounded-xl px-7 py-[10px]">
              Bahis Yap
            </button>
          </div>
        )
      ) : (
        /* Logged-out: history only for registered customers */
        <div className="flex flex-col items-center justify-center px-8 pt-16 pb-28">
          <ClockBadge />
          <p className="text-[13px] text-[#737B8C] font-medium text-center leading-relaxed mt-5">
            Bahis geçmişi sadece kayıtlı müşteriler için mevcuttur
          </p>
          <div className="flex gap-[10px] w-full mt-6">
            <Link href="/login" className="flex-1 h-[42px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center">
              Giriş Yap
            </Link>
            <Link href="/register" className="flex-1 h-[42px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-semibold flex items-center justify-center">
              Kayıt Ol
            </Link>
          </div>
        </div>
      )}

      {/* ── History Type Bottom Sheet ── */}
      {showHistoryType && (
        <>
          <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70]"
            onClick={() => setShowHistoryType(false)}/>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#d0d5dd] rounded-full"/>
            </div>
            <h3 className="text-[15px] font-bold text-[#1a2332] text-center pb-3">Geçmiş Türü</h3>
            <div className="px-4 pb-8">
              {historyTypes.map((type, i) => (
                <button key={type.label} onClick={() => { setActiveHistoryType(i); setShowHistoryType(false) }}
                  className={`w-full flex items-center justify-between py-[14px] ${i < historyTypes.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}>
                  <span className={`text-[13px] font-medium ${activeHistoryType === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>
                    {type.label}
                  </span>
                  <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${activeHistoryType === i ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                    {activeHistoryType === i && <div className="w-[10px] h-[10px] rounded-full bg-[#0E8FCF]"/>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Filters Bottom Sheet ── */}
      {showFilters && (
        <>
          <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70]"
            onClick={() => setShowFilters(false)}/>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl animate-slide-up">

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[#d0d5dd] rounded-full"/>
            </div>

            {/* Title row with close */}
            <div className="relative flex items-center justify-center py-3 border-b border-[#f0f2f5]">
              <h3 className="text-[16px] font-bold text-[#1a2332]">Filtrele</h3>
              <button onClick={() => setShowFilters(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-[28px] h-[28px] rounded-full bg-[#f1f5f9] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="px-4 pt-4 pb-6">
              {/* İşlem tipi */}
              <p className="text-[12px] font-semibold text-[#1a2332] mb-[10px]">İşlem Tipi</p>
              <div className="flex flex-wrap gap-[8px] mb-6">
                {filterTypes.map(t => (
                  <button key={t} type="button" onClick={() => setFilterType(t)}
                    className={`px-[16px] py-[8px] rounded-full text-[12px] font-semibold transition-all ${filterType === t ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332] border border-[#e8ecf1]'}`}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Dönem seçiniz */}
              <div className="flex items-center justify-between mb-[10px]">
                <p className="text-[12px] font-semibold text-[#1a2332]">Dönem Seçiniz</p>
                {(startDate || endDate) && (
                  <button type="button" onClick={() => { setStartDate(''); setEndDate('') }}
                    className="text-[11px] font-semibold text-[#0E8FCF]">Temizle</button>
                )}
              </div>
              <div className="flex items-end gap-[10px] mb-2">
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] text-[#737B8C] mb-[5px]">Başlangıç</label>
                  <input type="date" value={startDate} max={endDate || undefined} onChange={e => setStartDate(e.target.value)}
                    className="w-full px-[12px] py-[11px] rounded-xl bg-[#f1f5f9] border border-[#e8ecf1] text-[13px] font-medium text-[#1a2332]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] text-[#737B8C] mb-[5px]">Bitiş</label>
                  <input type="date" value={endDate} min={startDate || undefined} onChange={e => setEndDate(e.target.value)}
                    className="w-full px-[12px] py-[11px] rounded-xl bg-[#f1f5f9] border border-[#e8ecf1] text-[13px] font-medium text-[#1a2332]"/>
                </div>
              </div>
              <p className="text-[11px] text-[#94a3b8] mb-6">İki tarih arasındaki bahisler gösterilir. Bir alan boş bırakılabilir.</p>

              {/* Apply */}
              <button type="button" onClick={() => { setStatusFilter(filterStatus[filterType]); setAppliedStart(startDate); setAppliedEnd(endDate); setShowFilters(false) }}
                className="w-full py-[13px] rounded-xl text-[13px] font-bold tracking-wide text-white bg-[#0E8FCF]">
                FİLTRELE
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
