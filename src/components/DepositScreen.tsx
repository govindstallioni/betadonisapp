'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import WheelPromoModal from '@/components/WheelPromoModal'
import { useAdc } from './AdcProvider'
import { adcForDeposit, adcRateFor, fmtAdc } from '@/data/adc'
import { MethodLogo, type LogoKey } from './PaymentLogos'

// ── Payment methods ─────────────────────────────────────────────────────────
// Task 29: names, type labels, fees and floors for the first four come from the
// live site's own deposit grid (parayatirma.png). The reference shows a FLAT
// grid — no ÖNERİLEN / BANKA TRANSFERİ / KRİPTO PARA / E-CÜZDAN headers — so the
// sections are gone and "Para Yatırma Grupları" now filters by the reference's
// own type vocabulary instead. The methods below the fold in that screenshot are
// still unknown, so the rest of our list is kept as-is rather than deleted.
type MethodType = 'bank' | 'crypto' | 'ewallet'
type Method = {
  id: number
  name: string
  type: MethodType
  /** The parenthesised type under the name, as the reference prints it. */
  typeLabel: string
  logo?: LogoKey
  fee: string
  min: number
  max: number
}

const methods: Method[] = [
  // ── Confirmed against parayatirma.png ──
  { id: 2, name: 'HAVALE EFT (MPAY)', type: 'bank', typeLabel: 'Havale/Eft', logo: 'havaleEft', fee: 'Ücretsiz', min: 2000, max: 100000 },
  { id: 24, name: 'MPAY (FAST)', type: 'bank', typeLabel: 'Havale/Eft', logo: 'fast', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 13, name: 'HIZLI HAVALE', type: 'bank', typeLabel: 'Havale/Eft', logo: 'hizli', fee: 'Ücretsiz', min: 500, max: 100000 },
  { id: 21, name: 'Papara (MPAY)', type: 'ewallet', typeLabel: 'Online Papara', logo: 'papara', fee: 'Ücretsiz', min: 1000, max: 100000 },
  // ── Below the fold in the reference — kept from our own list, unverified ──
  { id: 1, name: 'Halk Bank', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 3, name: 'Instant QR', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 100, max: 50000 },
  { id: 4, name: 'Vakıf Bank', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 5, name: 'YapıKredi', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 10, name: 'VIP Havale', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 5000, max: 250000 },
  { id: 11, name: 'Türkiye İş Bankası', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 12, name: 'Enpara', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 14, name: 'Garanti BBVA', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 15, name: 'Ziraat Bankası', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 16, name: 'Akbank', type: 'bank', typeLabel: 'Havale/Eft', fee: 'Ücretsiz', min: 250, max: 100000 },
  { id: 6, name: 'Tether on Tron', type: 'crypto', typeLabel: 'Kripto', fee: 'Ağ Ücreti', min: 500, max: 500000 },
  { id: 7, name: 'TRON', type: 'crypto', typeLabel: 'Kripto', fee: 'Ağ Ücreti', min: 500, max: 500000 },
  { id: 17, name: 'Bitcoin', type: 'crypto', typeLabel: 'Kripto', fee: 'Ağ Ücreti', min: 500, max: 1000000 },
  { id: 18, name: 'Ethereum', type: 'crypto', typeLabel: 'Kripto', fee: 'Ağ Ücreti', min: 500, max: 1000000 },
  { id: 19, name: 'USDT (TRC20)', type: 'crypto', typeLabel: 'Kripto', fee: 'Ücretsiz', min: 500, max: 500000 },
  { id: 20, name: 'USDT (ERC20)', type: 'crypto', typeLabel: 'Kripto', fee: 'Ağ Ücreti', min: 500, max: 500000 },
  { id: 22, name: 'PayFix', type: 'ewallet', typeLabel: 'Online Cüzdan', fee: 'Ücretsiz', min: 1000, max: 100000 },
  { id: 23, name: 'CMT', type: 'ewallet', typeLabel: 'Online Cüzdan', fee: 'Ücretsiz', min: 1000, max: 100000 },
]

const QUICK = [100, 250, 500, 1000, 2500, 5000]
const BONUSES = ['Bonus istemiyorum', '%100 Hoşgeldin Bonusu (max 5.000 ₺)', '%50 Yatırım Bonusu', '%25 Kripto Bonusu']
const MIN = 50
const MAX = 100000

const fmt = (n: number) => n.toLocaleString('tr-TR')
/** The reference grid groups with commas ("Min 2,000 TRY"), not the tr-TR dot
 *  the rest of the app uses. Only the red-boxed card block uses this. */
const fmtRef = (n: number) => n.toLocaleString('en-US')

// The reference replaces our section headers with the parenthesised type, so the
// groups sheet filters on that instead — order of first appearance.
const GROUPS = ['Tümü', ...Array.from(new Set(methods.map(m => m.typeLabel)))]


export default function DepositScreen() {
  const router = useRouter()
  const { balance, adjustBalance, recordFirstDeposit } = useAuth()
  const { accrueDeposit } = useAdc()
  const [selected, setSelected] = useState<Method | null>(null)
  const [amount, setAmount] = useState('')
  const [bonus, setBonus] = useState(0)
  const [done, setDone] = useState<null | { ref: string; amount: number; method: string; adc: number }>(null)
  const [groupFilter, setGroupFilter] = useState('Tümü')
  const [showGroups, setShowGroups] = useState(false)
  const [showWheelUnlock, setShowWheelUnlock] = useState(false)

  const amt = Number(amount) || 0
  // The reference prints a different Min per method, so validate against the
  // selected method's own floor rather than one global MIN for every card.
  const minAmt = selected ? selected.min : MIN
  const maxAmt = selected ? selected.max : MAX
  const valid = amt >= minAmt && amt <= maxAmt
  const inRange = QUICK.filter(v => v >= minAmt && v <= maxAmt)
  const quicks = inRange.length >= 3 ? inRange : [minAmt, minAmt * 2, minAmt * 5].filter(v => v <= maxAmt)

  const confirm = () => {
    if (!selected || !valid) return
    const ref = 'BD-' + String(amt * 7 + selected.id * 131 + 100000).slice(-8)
    // Credit the deposit (and any selected bonus %) to the live balance.
    const bonusAmt = bonus === 1 ? Math.min(amt, 5000) : bonus === 2 ? amt * 0.5 : bonus === 3 ? amt * 0.25 : 0
    adjustBalance(amt, bonusAmt)
    // First deposit ever unlocks the 14-day Lucky Wheel — show the promo popup once.
    if (recordFirstDeposit()) setShowWheelUnlock(true)
    // Adonis Coin accrues on the DEPOSIT alone — never deposit + bonus, which
    // would push the house cost past the brief's 0.25–1.25% ceiling. It lands
    // as "bekleyen" until a qualifying bet finalises it (see AdcProvider).
    const adc = accrueDeposit(amt)
    setDone({ ref, amount: amt, method: selected.name, adc })
  }

  const reset = () => { setSelected(null); setAmount(''); setBonus(0); setDone(null) }

  // ── Success view ──
  if (done) {
    return (
      <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">
        <Header title="Para Yatır" onBack={() => router.push('/')} />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <p className="text-[17px] font-bold text-[#1a2332]">Talebiniz Alındı</p>
          <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed px-4">Yatırımınız onaylandıktan sonra bakiyenize eklenecektir. Bu genellikle birkaç dakika sürer.</p>
          <div className="bg-white rounded-xl border border-[#e8ecf1] w-full mt-6 overflow-hidden">
            <Line k="Tutar" v={`${fmt(done.amount)} ₺`} />
            <Line k="Yöntem" v={done.method} />
            <Line k="Referans No" v={done.ref} />
            <Line k="Durum" v="Beklemede" vColor="#f39c12" last={done.adc === 0} />
            {done.adc > 0 && <Line k="Adonis Coin" v={`+${fmtAdc(done.adc)} ADC`} vColor="#0E8FCF" last />}
          </div>
          {done.adc > 0 && (
            <p className="text-[10px] text-[#737B8C] mt-2 leading-relaxed px-2">
              {fmtAdc(done.adc)} ADC hesabınıza <span className="font-semibold text-[#1a2332]">bekleyen puan</span> olarak eklendi.
              En az 100 ₺ ve 1.50 oranlı bir bahis yaptığınızda kullanılabilir hale gelecek.
            </p>
          )}
          <button onClick={reset} className="w-full mt-6 py-[13px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl">Yeni Yatırım</button>
          <button onClick={() => router.push('/')} className="w-full mt-2.5 py-[13px] text-[#0E8FCF] text-[13px] font-semibold">Ana Sayfaya Dön</button>
        </div>
        {showWheelUnlock && <WheelPromoModal variant="deposit" onClose={() => setShowWheelUnlock(false)} />}
      </div>
    )
  }

  // ── Amount + details view ──
  if (selected) {
    return (
      <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">
        <Header title="Para Yatır" onBack={() => setSelected(null)} />
        <div className="px-4 pt-4 pb-28 flex flex-col gap-3">
          {/* Selected method */}
          <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3">
            <MethodLogo name={selected.name} logo={selected.logo} size={62} />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#1a2332]">{selected.name}</p>
              <p className="text-[10px] text-[#737B8C]">({selected.typeLabel}) · Min {fmt(selected.min)} ₺ · Max {fmt(selected.max)} ₺</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-[11px] font-semibold text-[#0E8FCF]">Değiştir</button>
          </div>

          {/* Amount */}
          <div className="bg-white rounded-xl border border-[#e8ecf1] px-4 py-4">
            <label className="text-[11px] font-medium text-[#737B8C]">Yatırım Tutarı</label>
            <div className="flex items-center gap-2 mt-1.5 border-b-2 border-[#0E8FCF] pb-1.5">
              <input
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                placeholder="0"
                className="flex-1 text-[26px] font-bold text-[#1a2332] bg-transparent outline-none placeholder-[#c0c8d4]"
              />
              <span className="text-[20px] font-bold text-[#737B8C]">₺</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {quicks.map(v => (
                <button key={v} onClick={() => setAmount(String(v))}
                  className={`py-2 rounded-lg text-[12px] font-semibold transition-colors ${amt === v ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332]'}`}>
                  {fmt(v)} ₺
                </button>
              ))}
            </div>
            {amount && !valid && (
              <p className="text-[10px] text-[#e74c3c] mt-2">Tutar {fmt(minAmt)} ₺ ile {fmt(maxAmt)} ₺ arasında olmalıdır.</p>
            )}

            {/* Adonis Coin preview — the tier is chosen by THIS deposit's size. */}
            {valid && (
              <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[#edf5ff] px-3 py-2.5">
                <span className="w-7 h-7 rounded-full bg-[#0E8FCF] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold">₳</span>
                <p className="text-[10px] text-[#737B8C] leading-relaxed flex-1">
                  {adcForDeposit(amt) > 0 ? (
                    <>
                      Bu yatırımdan <span className="font-bold text-[#0E8FCF]">{fmtAdc(adcForDeposit(amt))} ADC</span> kazanacaksınız
                      <span className="text-[#94a3b8]"> ({adcRateFor(amt)} ADC / 100 ₺)</span>
                    </>
                  ) : (
                    <>Adonis Coin kazanmak için en az <span className="font-semibold text-[#1a2332]">100 ₺</span> yatırmalısınız.</>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Bonus */}
          <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
            <p className="px-4 py-2.5 text-[11px] font-bold text-[#0E8FCF] border-b border-[#f0f2f5]">Bonus Seçimi</p>
            {BONUSES.map((b, i) => (
              <button key={b} onClick={() => setBonus(i)} className={`w-full flex items-center gap-3 px-4 py-3 text-left ${i < BONUSES.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}>
                <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${bonus === i ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                  {bonus === i && <div className="w-[9px] h-[9px] rounded-full bg-[#0E8FCF]" />}
                </div>
                <span className={`text-[12px] font-medium ${bonus === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{b}</span>
              </button>
            ))}
          </div>

          {/* Task 29: the "Transfer Info" card that used to sit here (Havale
              Bilgileri / Gönderim Adresi / Hesap Bilgileri) is gone — the live
              site has no such section, its deposits run through a payment
              gateway rather than showing destination details on this screen. */}
        </div>

        {/* Sticky confirm */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#e8ecf1] px-4 py-3">
          <button onClick={confirm} disabled={!valid} className="w-full py-[13px] bg-[#0E8FCF] text-white text-[14px] font-bold rounded-xl disabled:opacity-40 hover:bg-[#0a7ab5] transition-colors">
            {valid ? `${fmt(amt)} ₺ Yatır` : 'Para Yatır'}
          </button>
        </div>
      </div>
    )
  }

  const visibleMethods = groupFilter === 'Tümü' ? methods : methods.filter(m => m.typeLabel === groupFilter)

  // ── Method grid (default) ──
  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">
      <Header title="Hesaba Para Yatır" onBack={() => router.back()} />
      <div className="px-4 pt-4 pb-28 flex flex-col gap-[12px]">
        {/* Para Yatırma / Para Çekme tabs */}
        <div className="flex bg-white rounded-full p-[3px] border border-[#e8ecf1]">
          <button className="flex-1 text-[12px] font-semibold py-[8px] rounded-full bg-[#0E8FCF] text-white">Para Yatırma</button>
          <button onClick={() => router.push('/kupon/withdraw')} className="flex-1 text-[12px] font-semibold py-[8px] rounded-full text-[#1a2332]">Para Çekme</button>
        </div>

        {/* Task 29: the reference's header is heading -> balance -> groups
            button, straight into the grid. Three blocks that used to sit here
            are gone because the live screen has none of them: the "HESAP
            1612620843" line, the BETADONİS İLE İŞ BİRLİĞİ YAP banner and the
            "Ödemeniz 12 SAAT içinde alınmazsa..." notice. */}
        <p className="text-[15px] font-bold text-[#1a2332] text-center mt-1">Ödeme Yöntemini Seçin</p>
        <p className="text-[12px] font-semibold text-[#27ae60] text-center tabular-nums -mt-[6px]">
          Toplam Bakiye: {fmt(balance.total)} TRY
        </p>

        <button onClick={() => setShowGroups(true)} className="w-full flex items-center justify-center gap-2 bg-white rounded-xl border border-[#e8ecf1] py-[10px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          <span className="text-[12px] font-semibold text-[#0E8FCF]">Para Yatırma Grupları{groupFilter !== 'Tümü' ? `: ${groupFilter}` : ''}</span>
        </button>

        {/* Flat grid — the reference carries no section headers. */}
        <div className="grid grid-cols-2 gap-[10px]">
          {visibleMethods.map(method => (
            <div key={method.id} className="relative flex flex-col items-center text-center bg-white rounded-xl border border-[#e8ecf1] px-2.5 py-3">
              <div className="h-[36px] flex items-center justify-center">
                <MethodLogo name={method.name} logo={method.logo} />
              </div>
              <p className="text-[10px] font-semibold text-[#1a2332] leading-tight mt-2 line-clamp-2 h-[26px]">{method.name}</p>
              <p className="text-[9px] text-[#737B8C] leading-tight">({method.typeLabel})</p>
              <p className="text-[9px] text-[#737B8C] mt-1">Ücret: <span className="font-medium text-[#1a2332]">{method.fee}</span></p>
              <p className="text-[8px] text-[#94a3b8] leading-tight mt-[2px]">Min {fmtRef(method.min)} TRY<br />Max {method.max.toFixed(2)} TRY</p>
              <button
                onClick={() => setSelected(method)}
                className="w-full mt-2.5 py-[7px] rounded-lg bg-[#0E8FCF] text-white text-[10px] font-bold active:scale-95 transition-transform"
              >
                Para Yatırma
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Groups sheet */}
      {showGroups && (
        <>
          <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70]" onClick={() => setShowGroups(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-[#d0d5dd] rounded-full" /></div>
            <h3 className="text-[15px] font-bold text-[#1a2332] text-center pb-3">Para Yatırma Grupları</h3>
            <div className="px-4 pb-8">
              {GROUPS.map((g, i) => (
                <button key={g} onClick={() => { setGroupFilter(g); setShowGroups(false) }}
                  className={`w-full flex items-center justify-between py-[14px] ${i < GROUPS.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}>
                  <span className={`text-[13px] font-medium ${groupFilter === g ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{g}</span>
                  <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${groupFilter === g ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                    {groupFilter === g && <div className="w-[10px] h-[10px] rounded-full bg-[#0E8FCF]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

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
    <div className={`flex items-center justify-between px-4 py-3 ${!last ? 'border-b border-[#f0f2f5]' : ''}`}>
      <span className="text-[12px] text-[#737B8C]">{k}</span>
      <span className="text-[12px] font-bold" style={{ color: vColor || 'var(--color-text-primary)' }}>{v}</span>
    </div>
  )
}
