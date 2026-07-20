'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const accountNumber = '1612620843'

type Method = { id: number; name: string; badge?: string }
type MethodType = 'bank' | 'crypto' | 'ewallet'

const paymentSections: { title: string; type: MethodType; methods: Method[] }[] = [
  {
    title: 'ÖNERİLEN', type: 'bank',
    methods: [
      { id: 1, name: 'Halk Bank' },
      { id: 2, name: 'Hızlı Banka Havale-EFT-FAST 7/24', badge: 'cashback 10%' },
      { id: 3, name: 'Instant QR' },
      { id: 4, name: 'Vakıf Bank' },
      { id: 5, name: 'YapıKredi' },
      { id: 6, name: 'Tether on Tron' },
      { id: 7, name: 'TRON' },
    ],
  },
  {
    title: 'BANKA TRANSFERİ', type: 'bank',
    methods: [
      { id: 8, name: 'Halk Bank' },
      { id: 9, name: 'Hızlı Banka Havale-EFT-FAST 7/24', badge: 'cashback 10%' },
      { id: 10, name: 'VIP Havale' },
      { id: 11, name: 'Türkiye İş Bankası' },
      { id: 12, name: 'Enpara' },
      { id: 13, name: 'Trink Para Havale EFT 7/24' },
      { id: 14, name: 'Garanti BBVA' },
      { id: 15, name: 'Ziraat Bankası' },
      { id: 16, name: 'Akbank' },
    ],
  },
  {
    title: 'KRİPTO PARA', type: 'crypto',
    methods: [
      { id: 17, name: 'Bitcoin' },
      { id: 18, name: 'Ethereum' },
      { id: 19, name: 'USDT (TRC20)' },
      { id: 20, name: 'USDT (ERC20)' },
    ],
  },
  {
    title: 'E-CÜZDAN', type: 'ewallet',
    methods: [
      { id: 21, name: 'Papara' },
      { id: 22, name: 'PayFix' },
      { id: 23, name: 'CMT' },
    ],
  },
]

const QUICK = [100, 250, 500, 1000, 2500, 5000]
const BONUSES = ['Bonus istemiyorum', '%100 Hoşgeldin Bonusu (max 5.000 ₺)', '%50 Yatırım Bonusu', '%25 Kripto Bonusu']
const MIN = 50
const MAX = 100000

const fmt = (n: number) => n.toLocaleString('tr-TR')

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard?.writeText(value).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600) }
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-[#f0f2f5] last:border-b-0">
      <div className="min-w-0">
        <p className="text-[9px] text-[#737B8C] uppercase tracking-wide">{label}</p>
        <p className="text-[12px] font-semibold text-[#1a2332] truncate">{value}</p>
      </div>
      <button onClick={copy} className="flex-shrink-0 text-[10px] font-semibold flex items-center gap-1" style={{ color: copied ? '#27ae60' : '#0E8FCF' }}>
        {copied ? '✓ Kopyalandı' : 'Kopyala'}
      </button>
    </div>
  )
}

export default function DepositScreen() {
  const router = useRouter()
  const { adjustBalance } = useAuth()
  const [selected, setSelected] = useState<(Method & { type: MethodType }) | null>(null)
  const [amount, setAmount] = useState('')
  const [bonus, setBonus] = useState(0)
  const [done, setDone] = useState<null | { ref: string; amount: number; method: string }>(null)

  const amt = Number(amount) || 0
  const valid = amt >= MIN && amt <= MAX

  const confirm = () => {
    if (!selected || !valid) return
    const ref = 'BD-' + String(amt * 7 + selected.id * 131 + 100000).slice(-8)
    // Credit the deposit (and any selected bonus %) to the live balance.
    const bonusAmt = bonus === 1 ? Math.min(amt, 5000) : bonus === 2 ? amt * 0.5 : bonus === 3 ? amt * 0.25 : 0
    adjustBalance(amt, bonusAmt)
    setDone({ ref, amount: amt, method: selected.name })
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
            <Line k="Durum" v="Beklemede" vColor="#f39c12" last />
          </div>
          <button onClick={reset} className="w-full mt-6 py-[13px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl">Yeni Yatırım</button>
          <button onClick={() => router.push('/')} className="w-full mt-2.5 py-[13px] text-[#0E8FCF] text-[13px] font-semibold">Ana Sayfaya Dön</button>
        </div>
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
            <div className="w-10 h-10 rounded-lg bg-[#edf5ff] flex items-center justify-center flex-shrink-0 text-[#0E8FCF]">
              {selected.type === 'crypto' ? <CryptoIcon /> : selected.type === 'ewallet' ? <WalletIcon /> : <BankIcon />}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#1a2332]">{selected.name}</p>
              <p className="text-[10px] text-[#737B8C]">Min {fmt(MIN)} ₺ · Max {fmt(MAX)} ₺</p>
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
              {QUICK.map(v => (
                <button key={v} onClick={() => setAmount(String(v))}
                  className={`py-2 rounded-lg text-[12px] font-semibold transition-colors ${amt === v ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332]'}`}>
                  {fmt(v)} ₺
                </button>
              ))}
            </div>
            {amount && !valid && (
              <p className="text-[10px] text-[#e74c3c] mt-2">Tutar {fmt(MIN)} ₺ ile {fmt(MAX)} ₺ arasında olmalıdır.</p>
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

          {/* Payment details */}
          <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
            <p className="px-4 py-2.5 text-[11px] font-bold text-[#0E8FCF] border-b border-[#f0f2f5]">
              {selected.type === 'crypto' ? 'Gönderim Adresi' : selected.type === 'ewallet' ? 'Hesap Bilgileri' : 'Havale Bilgileri'}
            </p>
            {selected.type === 'bank' && (
              <>
                <CopyField label="Alıcı Ad Soyad" value="BETADONİS ÖDEME A.Ş." />
                <CopyField label="IBAN" value="TR76 0006 2000 1234 5678 9012 34" />
                <CopyField label="Açıklama (Zorunlu)" value={accountNumber} />
              </>
            )}
            {selected.type === 'crypto' && (
              <>
                <CopyField label="Ağ" value={selected.name.includes('ERC') ? 'ERC20 (Ethereum)' : selected.name.includes('TRC') || selected.name.includes('Tron') ? 'TRC20 (Tron)' : selected.name} />
                <CopyField label="Cüzdan Adresi" value="TQ5Nfkj2m8pWc3vXyZ9aBnR7dHgLpEeUu" />
              </>
            )}
            {selected.type === 'ewallet' && (
              <>
                <CopyField label="Ad Soyad" value="BETADONİS ÖDEME" />
                <CopyField label={`${selected.name} No`} value="1612620843" />
                <CopyField label="Açıklama (Zorunlu)" value={accountNumber} />
              </>
            )}
            <div className="px-3 py-2.5 bg-[#fff8e1]">
              <p className="text-[10px] text-[#8a6d00] leading-relaxed">Açıklama alanına yalnızca hesap numaranızı yazın. Yanlış açıklama işlemin gecikmesine sebep olur.</p>
            </div>
          </div>
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

  // ── Method grid (default) ──
  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">
      <Header title="Hesaba Para Yatır" onBack={() => router.back()} />
      <div className="px-4 pt-4 pb-28 flex flex-col gap-[12px]">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-extrabold text-[#1a2332] tracking-wide">HESAP {accountNumber}</span>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#071428 0%,#0c2a5a 60%,#0E8FCF 100%)' }}>
          <div className="flex items-center justify-center gap-3 px-4 py-[14px]">
            <div>
              <p className="text-[12px] font-extrabold text-white tracking-wide text-center">BETADONİS İLE İŞ BİRLİĞİ YAP</p>
              <p className="text-[11px] font-bold text-[#0E8FCF] text-center mt-[2px]">ELBETTE!</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl px-4 py-3 border border-[#e8ecf1]">
          <p className="text-[11px] text-[#737B8C] leading-relaxed">
            Ödemeniz <span className="font-bold text-[#1a2332]">12 SAAT</span> içinde alınmazsa, lütfen taleplerinizi{' '}
            <span className="text-[#0E8FCF] font-medium">odemeler@betadonis.com</span> adresine gönderin.
          </p>
        </div>

        {paymentSections.map(section => (
          <div key={section.title} className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
            <div className="px-4 py-[10px] bg-[#f4f7fb] border-b border-[#e8ecf1]">
              <span className="text-[10px] font-bold text-[#737B8C] tracking-wider">{section.title}</span>
            </div>
            <div className="grid grid-cols-3">
              {section.methods.map((method, i) => (
                <button
                  key={method.id}
                  onClick={() => setSelected({ ...method, type: section.type })}
                  className={`flex flex-col overflow-hidden border-[#f0f2f5] ${i % 3 !== 2 ? 'border-r' : ''} ${i < section.methods.length - (section.methods.length % 3 || 3) ? 'border-b' : ''}`}
                >
                  <div className="relative bg-[#f8fafc] flex items-center justify-center h-[72px]">
                    {method.badge && (
                      <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-[8px] font-bold px-[6px] py-[2px] rounded-bl-lg">{method.badge}</span>
                    )}
                    <div className="text-[#0E8FCF]">
                      {section.type === 'crypto' ? <CryptoIcon /> : section.type === 'ewallet' ? <WalletIcon /> : <BankIcon />}
                    </div>
                  </div>
                  <div className="bg-[#0E8FCF] px-[6px] py-[7px]">
                    <p className="text-[9px] font-semibold text-white text-center leading-tight line-clamp-2">{method.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
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

const BankIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>
const CryptoIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.5 8h4a2 2 0 0 1 0 4h-4h4.5a2 2 0 0 1 0 4H9.5M10 6v12" /></svg>
const WalletIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" /></svg>
