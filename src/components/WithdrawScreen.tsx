'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import SlideUpBubble from '@/components/SlideUpBubble'
import {
  loadWithdrawals, addWithdrawal, makeRef, fmtDay, fmtTime, fmtFull, fmtAmount,
  WITHDRAW_STATUS_LABEL, WITHDRAW_STATUS_LINE, WITHDRAW_STATUS_COLOR,
  type Withdrawal,
} from '@/data/withdrawals'
import { MethodLogo, type LogoKey } from './PaymentLogos'

// ── Para Çekme (task 28) ────────────────────────────────────────────────────
// Follows the client's Betadonis mobile references, which are four screens on
// one route:
//   paracekme.png   → landing: methods hero, last withdrawals, "Daha Fazla Yükle"
//   paracekme1.png  → picker:  "Para Çekim Yönteminizi Seçin" + method grid
//   paracekme2.png  → form:    quick amounts, per-method fields, amount, buttons
//   (success stays as it was)
//
// Built with the app's own palette rather than a hand-rolled dark variant: every
// colour used here is in the html.dark override block in globals.css, so on dark
// mode these screens render dark like the references, for free.
//
// Branding comes from PaymentLogos, shared with the deposit screen: Papara is
// reachable from both sides of the Para Yatırma / Para Çekme toggle, so it has
// to render the same wordmark on both. Methods with no wordmark yet fall back
// to that module's generated initials badge.

const fmt = (n: number) => n.toLocaleString('tr-TR')

type MethodKey = 'havale' | 'papara' | 'bitcoin' | 'usdt' | 'ethereum' | 'tron'

type Method = {
  key: MethodKey
  name: string
  /** The parenthesised line under the name in the picker. */
  type: string
  fee: string
  min: number
  max: number
  time: string
  logo?: LogoKey
}

// Withdraw-specific list: the deposit screen's 23 methods are not all
// withdrawable. Names, types and floors follow paracekme1.png.
/** History rows keep the method as a plain string — map it back to its logo so
 *  a past Papara withdrawal shows the same wordmark as the picker. */
function logoFor(name: string): LogoKey | undefined {
  return METHODS.find(m => m.name === name)?.logo
}

const METHODS: Method[] = [
  { key: 'havale', name: 'Bank Transfer', type: 'Havale', fee: 'Ücretsiz', min: 50, max: 1_000_000, time: '5-30 dk' },
  { key: 'papara', name: 'Papara (MPAY)', type: 'Online Papara', fee: 'Ücretsiz', min: 1_000, max: 100_000, time: 'Anında', logo: 'papara' },
  { key: 'bitcoin', name: 'Bitcoin', type: 'Kripto', fee: 'Ücretsiz', min: 1_000, max: 1_000_000, time: '10-60 dk' },
  { key: 'usdt', name: 'Tether USDT', type: 'Kripto', fee: 'Ücretsiz', min: 100, max: 500_000, time: '10-60 dk' },
  { key: 'ethereum', name: 'Ethereum', type: 'Kripto', fee: 'Ücretsiz', min: 1_000, max: 1_000_000, time: '10-60 dk' },
  { key: 'tron', name: 'TRON', type: 'Kripto', fee: 'Ücretsiz', min: 500, max: 500_000, time: '10-60 dk' },
]

const FIELD_DEFS: Record<MethodKey, { key: string; label: string; placeholder: string }[]> = {
  havale: [
    { key: 'Banka Adı', label: 'Banka Adı', placeholder: 'Örn. GARANTİ BANKASI' },
    { key: 'Hesap Sahibi', label: 'Hesap Sahibi', placeholder: 'Hesap sahibinin adı soyadı' },
    { key: 'IBAN', label: 'IBAN', placeholder: 'TR__ ____ ____ ____ ____ ____ __' },
  ],
  papara: [
    { key: 'Hesap Sahibi', label: 'Hesap Sahibi', placeholder: 'Papara hesap adı' },
    { key: 'Papara Numarası', label: 'Papara Numarası', placeholder: '10 haneli Papara no' },
  ],
  bitcoin: [{ key: 'Cüzdan Adresi', label: 'Cüzdan Adresi', placeholder: 'Bitcoin cüzdan adresiniz' }],
  usdt: [{ key: 'Cüzdan Adresi', label: 'Cüzdan Adresi', placeholder: 'USDT cüzdan adresiniz' }],
  ethereum: [{ key: 'Cüzdan Adresi', label: 'Cüzdan Adresi', placeholder: 'Ethereum cüzdan adresiniz' }],
  tron: [{ key: 'Cüzdan Adresi', label: 'Cüzdan Adresi', placeholder: 'TRON cüzdan adresiniz' }],
}

const isCrypto = (m: Method) => m.type === 'Kripto'

/** How many history rows one "Daha Fazla Yükle" press adds. */
const PAGE = 3

// ── Method badge — same generated-initials convention the deposit screen uses,
// for want of real brand assets. ──

/** Quick-amount ladder anchored on the method's minimum. The reference's chips
 *  read 50 | 178 | 290 | 500 | 1600 — the odd values there look like that
 *  user's own past amounts and would read as a bug if copied literally. */
function quickAmounts(min: number, balance: number): number[] {
  const ladder = [min, min * 2, min * 5, min * 10, min * 20]
  const capped = ladder.filter(v => v <= Math.max(balance, min))
  return (capped.length ? capped : [min]).slice(0, 5)
}

export default function WithdrawScreen() {
  const router = useRouter()
  const { balance, adjustBalance } = useAuth()
  const BALANCE = balance.withdrawable

  type View = 'landing' | 'picker' | 'form'
  const [view, setView] = useState<View>('landing')
  const [selected, setSelected] = useState<Method | null>(null)
  const [amount, setAmount] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [network, setNetwork] = useState('TRC20')
  const [done, setDone] = useState<null | { ref: string; amount: number; method: string }>(null)

  // History (client-only → read in an effect so SSR and first paint agree)
  const [history, setHistory] = useState<Withdrawal[]>([])
  const [shown, setShown] = useState(PAGE)
  const [explain, setExplain] = useState<Withdrawal | null>(null)
  useEffect(() => { setHistory(loadWithdrawals()) }, [])

  const amt = Number(amount) || 0
  const min = selected?.min ?? 0
  const amountOk = !!selected && amt >= min && amt <= BALANCE

  const defs = selected ? FIELD_DEFS[selected.key] : []
  const fieldsOk = defs.every(d => (fields[d.key] || '').trim().length > 2)
  const canSubmit = !!selected && amountOk && fieldsOk

  const pickMethod = (m: Method) => {
    setSelected(m)
    setAmount('')
    setFields({})
    setView('form')
  }

  const submit = () => {
    if (!canSubmit || !selected) return
    const ref = makeRef()
    adjustBalance(-amt) // debit the withdrawal from the live balance
    const record: Withdrawal = {
      id: ref,
      method: selected.name,
      methodType: selected.type,
      amount: amt,
      at: Date.now(),
      status: 'pending',
      note: 'Talebiniz alındı ve finans ekibimiz tarafından inceleniyor. Onaylandığında tutar hesabınıza aktarılacaktır.',
      details: { ...(isCrypto(selected) ? { 'Ağ': network } : {}), ...fields },
    }
    addWithdrawal(record)
    setHistory(loadWithdrawals())
    setShown(PAGE)
    setDone({ ref, amount: amt, method: selected.name })
  }

  const reset = () => {
    setSelected(null); setAmount(''); setFields({}); setDone(null); setView('landing')
  }

  // ── Success ──
  if (done) {
    return (
      <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">
        <Header title="Para Çek" onBack={() => router.push('/')} />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <p className="text-[17px] font-bold text-[#1a2332]">Çekim Talebiniz Alındı</p>
          <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed px-4">Talebiniz incelendikten sonra işleme alınacaktır. Son Para Çekme listesinden durumu takip edebilirsiniz.</p>
          <div className="bg-white rounded-xl border border-[#e8ecf1] w-full mt-6 overflow-hidden">
            <Line k="Tutar" v={`${fmtAmount(done.amount)} ₺`} />
            <Line k="Yöntem" v={done.method} />
            <Line k="Referans No" v={done.ref} />
            <Line k="Durum" v="İnceleniyor" vColor="#f39c12" last />
          </div>
          <button onClick={reset} className="w-full mt-6 py-[13px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl">Yeni Çekim</button>
          <button onClick={() => router.push('/')} className="w-full mt-2.5 py-[13px] text-[#0E8FCF] text-[13px] font-semibold">Ana Sayfaya Dön</button>
        </div>
      </div>
    )
  }

  const back = () => {
    if (view === 'form') { setSelected(null); setView('picker'); return }
    if (view === 'picker') { setView('landing'); return }
    router.back()
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">
      <Header title={view === 'landing' ? 'Para Çekme' : 'Hesabından Para Çek'} onBack={back} />

      <div className="px-4 pt-4 pb-28 flex flex-col gap-3">
        {/* Para Yatırma / Para Çekme */}
        <div className="flex bg-white rounded-full p-[3px] border border-[#e8ecf1]">
          <button onClick={() => router.push('/kupon/deposit')} className="flex-1 text-[12px] font-semibold py-[8px] rounded-full text-[#1a2332]">Para Yatırma</button>
          <button className="flex-1 text-[12px] font-semibold py-[8px] rounded-full bg-[#0E8FCF] text-white">Para Çekme</button>
        </div>

        {view === 'landing' && (
          <Landing
            balance={BALANCE}
            history={history}
            shown={shown}
            onMore={() => setShown(s => s + PAGE)}
            onExplain={setExplain}
            onOpenMethods={() => setView('picker')}
          />
        )}

        {view === 'picker' && <Picker balance={BALANCE} onPick={pickMethod} />}

        {view === 'form' && selected && (
          <Form
            method={selected}
            balance={BALANCE}
            amount={amount} setAmount={setAmount}
            fields={fields} setFields={setFields}
            network={network} setNetwork={setNetwork}
            defs={defs}
            amt={amt} amountOk={amountOk} canSubmit={canSubmit}
            onSubmit={submit}
            onBack={back}
          />
        )}
      </div>

      {explain && <ExplainSheet item={explain} onClose={() => setExplain(null)} />}
    </div>
  )
}

// ── Landing (paracekme.png) ─────────────────────────────────────────────────

function Landing({ balance, history, shown, onMore, onExplain, onOpenMethods }: {
  balance: number
  history: Withdrawal[]
  shown: number
  onMore: () => void
  onExplain: (w: Withdrawal) => void
  onOpenMethods: () => void
}) {
  const visible = history.slice(0, shown)
  const hasMore = history.length > shown

  return (
    <>
      {/* Balance */}
      <div className="rounded-xl px-4 py-4 text-white" style={{ background: 'linear-gradient(135deg,#071428 0%,#0c2a5a 60%,#0E8FCF 100%)' }}>
        <p className="text-[11px] text-white/70">Kullanılabilir Bakiye</p>
        <p className="text-[24px] font-extrabold mt-0.5">{fmt(balance)} ₺</p>
      </div>

      {/* "Para Çekme Yöntemleri" hero */}
      <button
        onClick={onOpenMethods}
        className="relative overflow-hidden rounded-xl px-4 py-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
        style={{ background: 'linear-gradient(120deg,#14243d 0%,#2a1b52 55%,#3b1f6b 100%)' }}
      >
        <span className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
          </svg>
        </span>
        <span className="flex-1 min-w-0 relative">
          <span className="block text-[11px] text-white/70 leading-tight">Para Çekme</span>
          <span className="block text-[17px] font-extrabold text-white leading-tight">Yöntemleri</span>
          <span className="block text-[10px] text-white/60 mt-1 leading-snug">Hızlı, güvenli ve kolay para çekme seçeneklerini keşfedin.</span>
        </span>
        {/* Decorative coin motif, in place of the reference's wallet artwork */}
        <span className="absolute right-8 top-2 w-16 h-16 rounded-full bg-[#f59e0b]/20 pointer-events-none" />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 relative opacity-80">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Son Para Çekme */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3">
        <span className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0 text-[#0E8FCF]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#1a2332] leading-tight">Son Para Çekme</p>
          <p className="text-[10px] text-[#737B8C] mt-[2px]">Para çekme işlemlerinizin son durumu.</p>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e8ecf1] px-4 py-8 text-center">
          <p className="text-[12px] text-[#737B8C]">Henüz para çekme işleminiz yok.</p>
        </div>
      ) : (
        visible.map(w => <HistoryCard key={w.id} item={w} onExplain={() => onExplain(w)} />)
      )}

      {hasMore && (
        <button
          onClick={onMore}
          className="w-full rounded-xl bg-white border border-[#e8ecf1] py-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#0E8FCF] active:scale-[0.99] transition-transform"
        >
          Daha Fazla Yükle
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      )}
    </>
  )
}

function HistoryCard({ item, onExplain }: { item: Withdrawal; onExplain: () => void }) {
  const color = WITHDRAW_STATUS_COLOR[item.status]
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3">
      <div className="flex items-start gap-3">
        <MethodLogo name={item.method} logo={logoFor(item.method)} size={80} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[9px] font-semibold text-[#737B8C] bg-[#f1f5f9] rounded px-1.5 py-[2px]">{item.methodType}</span>
            <span className="text-[15px] font-extrabold text-[#1a2332] tabular-nums">{fmtAmount(item.amount)}</span>
            <span className="text-[10px] text-[#737B8C]">TRY</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[10px] text-[#737B8C]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>
              <span className="tabular-nums">{fmtDay(item.at)}</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#737B8C]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm.51 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
              <span className="tabular-nums">{fmtTime(item.at)}</span>
            </span>
          </div>
          <p className="flex items-center gap-1 mt-1.5 text-[10px] leading-tight" style={{ color }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            {WITHDRAW_STATUS_LINE[item.status]}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-2.5">
        <span
          className="flex-1 rounded-lg py-[7px] flex items-center justify-center gap-1.5 text-[11px] font-semibold"
          style={{ backgroundColor: `${color}1f`, color }}
        >
          <span className="w-[14px] h-[14px] rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: color }}>
            {item.status === 'approved' ? '✓' : item.status === 'pending' ? '!' : '✕'}
          </span>
          {WITHDRAW_STATUS_LABEL[item.status]}
        </span>
        <button
          onClick={onExplain}
          className="flex-1 rounded-lg py-[7px] flex items-center justify-center gap-1.5 text-[11px] font-semibold bg-[#edf5ff] text-[#0E8FCF] active:scale-[0.99] transition-transform"
        >
          <span className="w-[14px] h-[14px] rounded-full bg-[#0E8FCF] flex items-center justify-center text-white text-[9px] font-bold">i</span>
          AÇIKLAMA
        </button>
      </div>
    </div>
  )
}

function ExplainSheet({ item, onClose }: { item: Withdrawal; onClose: () => void }) {
  const color = WITHDRAW_STATUS_COLOR[item.status]
  return (
    <SlideUpBubble onClose={onClose}>
      <div className="px-5 pt-5 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[16px] font-bold text-[#1a2332]">Açıklama</h2>
            <p className="text-[11px] text-[#737B8C] mt-0.5">{item.method} · {item.methodType}</p>
          </div>
          <button onClick={onClose} aria-label="Kapat" className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="mt-4 rounded-xl px-3.5 py-3" style={{ backgroundColor: `${color}14` }}>
          <p className="text-[11px] font-bold" style={{ color }}>{WITHDRAW_STATUS_LABEL[item.status]}</p>
          <p className="text-[11px] text-[#374957] mt-1.5 leading-relaxed">{item.note}</p>
        </div>

        <div className="mt-3 bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          <Line k="Referans No" v={item.id} />
          <Line k="Tutar" v={`${fmtAmount(item.amount)} TRY`} />
          <Line k="Tarih" v={fmtFull(item.at)} />
          {Object.entries(item.details).map(([k, v]) => <Line key={k} k={k} v={v} />)}
          <Line k="Durum" v={WITHDRAW_STATUS_LABEL[item.status]} vColor={color} last />
        </div>

        <button onClick={onClose} className="w-full h-[44px] mt-4 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold">Kapat</button>
      </div>
    </SlideUpBubble>
  )
}

// ── Picker (paracekme1.png) ─────────────────────────────────────────────────

function Picker({ balance, onPick }: { balance: number; onPick: (m: Method) => void }) {
  return (
    <>
      <div className="text-center pt-1">
        <h2 className="text-[15px] font-bold text-[#1a2332]">Para Çekim Yönteminizi Seçin</h2>
        <p className="text-[11px] text-[#737B8C] mt-1">
          Çekilebilir Tutar: <span className="font-bold text-[#0E8FCF]">{fmtAmount(balance)} TRY</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {METHODS.map(m => (
          <div key={m.key} className="bg-white rounded-xl border border-[#e8ecf1] p-3 flex flex-col items-center text-center">
            <MethodLogo name={m.name} logo={m.logo} size={92} />
            <p className="text-[11px] font-semibold text-[#1a2332] mt-2 leading-tight">{m.name}</p>
            <p className="text-[10px] text-[#737B8C] leading-tight">({m.type})</p>
            <div className="w-full border-t border-[#f0f2f5] mt-2 pt-2">
              <p className="text-[10px] text-[#737B8C]"><span className="font-semibold text-[#1a2332]">Ücret:</span> {m.fee}</p>
            </div>
            <div className="w-full border-t border-[#f0f2f5] mt-2 pt-2">
              <p className="text-[10px] text-[#737B8C] leading-tight">Min {fmt(m.min)} TRY</p>
              <p className="text-[10px] text-[#737B8C] leading-tight">Max {fmt(m.max)} TRY</p>
            </div>
            <button
              onClick={() => onPick(m)}
              className="w-full mt-2.5 py-[7px] rounded-lg bg-[#0E8FCF] text-white text-[11px] font-semibold active:scale-[0.99] transition-transform"
            >
              Para Çekme
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Form (paracekme2.png) ───────────────────────────────────────────────────

function Form({ method, balance, amount, setAmount, fields, setFields, network, setNetwork, defs, amt, amountOk, canSubmit, onSubmit, onBack }: {
  method: Method
  balance: number
  amount: string
  setAmount: (v: string) => void
  fields: Record<string, string>
  setFields: React.Dispatch<React.SetStateAction<Record<string, string>>>
  network: string
  setNetwork: (v: string) => void
  defs: { key: string; label: string; placeholder: string }[]
  amt: number
  amountOk: boolean
  canSubmit: boolean
  onSubmit: () => void
  onBack: () => void
}) {
  // "Çekebileceğiniz Tutar": the withdrawable balance, dropping to the amount
  // actually entered once it is valid.
  const receivable = amount && amountOk ? amt : balance

  return (
    <>
      <p className="text-[11px] text-[#737B8C] text-center pt-1">
        Çekilebilir Tutar: <span className="font-bold text-[#0E8FCF]">{fmtAmount(balance)} TRY</span>
      </p>

      <div className="flex justify-center">
        <MethodLogo name={method.name} logo={method.logo} size={110} />
      </div>
      <p className="text-[12px] font-semibold text-[#1a2332] text-center -mt-1">{method.name} <span className="text-[#737B8C] font-normal">({method.type})</span></p>

      {/* Quick amounts */}
      <div className="flex bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
        {quickAmounts(method.min, balance).map((v, i, arr) => (
          <button
            key={v}
            onClick={() => setAmount(String(v))}
            className={`flex-1 py-[9px] text-[11px] font-semibold transition-colors ${i < arr.length - 1 ? 'border-r border-[#f0f2f5]' : ''} ${
              amt === v ? 'bg-[#0E8FCF] text-white' : 'text-[#1a2332]'
            }`}
          >
            {fmt(v)}
          </button>
        ))}
      </div>

      {/* Account details */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
        {isCrypto(method) && (
          <div className="px-3 py-2.5 border-b border-[#f0f2f5] flex items-center justify-between">
            <label className="text-[12px] font-medium text-[#1a2332]">Ağ</label>
            <select value={network} onChange={e => setNetwork(e.target.value)} className="text-[12px] font-medium text-[#1a2332] bg-[#edf5ff] border border-[#e8ecf1] rounded-lg px-[10px] py-[6px] outline-none">
              <option>TRC20</option><option>ERC20</option>
            </select>
          </div>
        )}
        {defs.map((d, i) => (
          <div key={d.key} className={`px-3 py-2.5 ${i < defs.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}>
            <label className="text-[10px] font-medium text-[#737B8C] block mb-1">{d.label}</label>
            <input
              value={fields[d.key] || ''}
              onChange={e => setFields(prev => ({ ...prev, [d.key]: e.target.value }))}
              placeholder={d.placeholder}
              className="w-full text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
            />
          </div>
        ))}
      </div>

      {/* Tutar */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-2.5">
        <label className="text-[10px] font-medium text-[#737B8C] block mb-1">Tutar</label>
        <div className="flex items-center gap-2 border-b border-[#e8ecf1] pb-1.5">
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            placeholder="Tutar"
            className="flex-1 text-[14px] font-semibold text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
          />
          <span className="text-[12px] font-semibold text-[#737B8C]">TRY</span>
        </div>
        <p className="text-[10px] mt-2" style={{ color: amount && !amountOk ? '#e74c3c' : '#737B8C' }}>
          {amount && amt > balance
            ? 'Bakiyenizden fazla çekemezsiniz.'
            : amount && amt < method.min
              ? `Minimum çekim ${fmt(method.min)} TRY.`
              : `Min ${fmt(method.min)} TRY · Max ${fmt(method.max)} TRY`}
        </p>
      </div>

      {/* Çekebileceğiniz Tutar */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-2.5">
        <p className="text-[10px] font-medium text-[#737B8C] mb-1">Çekebileceğiniz Tutar</p>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold text-[#1a2332] tabular-nums">{fmtAmount(receivable)}</span>
          <span className="text-[12px] font-semibold text-[#737B8C]">TRY</span>
        </div>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 py-[11px] rounded-lg bg-[#0E8FCF] text-white text-[12px] font-semibold disabled:opacity-40 active:scale-[0.99] transition-transform"
        >
          Para Çekme
        </button>
        <button
          onClick={onBack}
          className="flex-1 py-[11px] rounded-lg bg-[#0E8FCF] text-white text-[12px] font-semibold active:scale-[0.99] transition-transform"
        >
          Geri
        </button>
      </div>

      <div className="bg-[#fff7ed] rounded-xl px-3 py-2.5">
        <p className="text-[10px] text-[#8a6d00] leading-relaxed">
          Çekim talepleri hesap sahibinin kimlik bilgileriyle eşleşmelidir. Farklı bir kişiye ait hesaba çekim yapılamaz.
        </p>
      </div>
    </>
  )
}

// ── Shared ──────────────────────────────────────────────────────────────────

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] flex items-center sticky top-0 z-10">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">{title}</h1>
      <div className="w-8" />
    </div>
  )
}

function Line({ k, v, vColor, last }: { k: string; v: string; vColor?: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 ${!last ? 'border-b border-[#f0f2f5]' : ''}`}>
      <span className="text-[12px] text-[#737B8C] flex-shrink-0">{k}</span>
      <span className="text-[12px] font-bold text-right break-all" style={{ color: vColor || 'var(--color-text-primary)' }}>{v}</span>
    </div>
  )
}
