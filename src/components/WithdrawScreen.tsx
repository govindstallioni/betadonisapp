'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const MIN = 100
const fmt = (n: number) => n.toLocaleString('tr-TR')

type MethodKey = 'havale' | 'papara' | 'kripto'
type Method = { key: MethodKey; name: string; desc: string; time: string; fee: string }

const METHODS: Method[] = [
  { key: 'havale', name: 'Banka Havalesi / EFT', desc: 'Tüm bankalar · 7/24', time: '5-30 dk', fee: 'Ücretsiz' },
  { key: 'papara', name: 'Papara', desc: 'Anında hesabınıza', time: 'Anında', fee: 'Ücretsiz' },
  { key: 'kripto', name: 'Kripto Para (USDT)', desc: 'TRC20 / ERC20', time: '10-60 dk', fee: 'Ağ ücreti' },
]

export default function WithdrawScreen() {
  const router = useRouter()
  const { balance, adjustBalance } = useAuth()
  const BALANCE = balance.withdrawable
  const [selected, setSelected] = useState<Method | null>(null)
  const [amount, setAmount] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [network, setNetwork] = useState('TRC20')
  const [done, setDone] = useState<null | { ref: string; amount: number; method: string }>(null)

  const amt = Number(amount) || 0
  const amountOk = amt >= MIN && amt <= BALANCE

  const fieldDefs: Record<MethodKey, { key: string; label: string; placeholder: string }[]> = {
    havale: [
      { key: 'name', label: 'Ad Soyad', placeholder: 'Hesap sahibinin adı soyadı' },
      { key: 'iban', label: 'IBAN', placeholder: 'TR__ ____ ____ ____ ____ ____ __' },
      { key: 'bank', label: 'Banka', placeholder: 'Banka adı' },
    ],
    papara: [
      { key: 'name', label: 'Ad Soyad', placeholder: 'Papara hesap adı' },
      { key: 'papara', label: 'Papara Numarası', placeholder: '10 haneli Papara no' },
    ],
    kripto: [
      { key: 'wallet', label: 'Cüzdan Adresi', placeholder: 'USDT cüzdan adresiniz' },
    ],
  }

  const defs = selected ? fieldDefs[selected.key] : []
  const fieldsOk = defs.every(d => (fields[d.key] || '').trim().length > 2)
  const canSubmit = selected && amountOk && fieldsOk

  const submit = () => {
    if (!canSubmit || !selected) return
    const ref = 'BW-' + String(amt * 3 + 900000).slice(-8)
    adjustBalance(-amt) // debit the withdrawal from the live balance
    setDone({ ref, amount: amt, method: selected.name })
  }

  const reset = () => { setSelected(null); setAmount(''); setFields({}); setDone(null) }

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
          <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed px-4">Talebiniz incelendikten sonra işleme alınacaktır. Geçmiş sekmesinden durumu takip edebilirsiniz.</p>
          <div className="bg-white rounded-xl border border-[#e8ecf1] w-full mt-6 overflow-hidden">
            <Line k="Tutar" v={`${fmt(done.amount)} ₺`} />
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

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">
      <Header title="Hesabından Para Çek" onBack={() => (selected ? setSelected(null) : router.back())} />

      <div className="px-4 pt-4 pb-28 flex flex-col gap-3">
        {/* Balance */}
        <div className="rounded-xl px-4 py-4 text-white" style={{ background: 'linear-gradient(135deg,#071428 0%,#0c2a5a 60%,#0E8FCF 100%)' }}>
          <p className="text-[11px] text-white/70">Kullanılabilir Bakiye</p>
          <p className="text-[24px] font-extrabold mt-0.5">{fmt(BALANCE)},00 ₺</p>
        </div>

        {!selected ? (
          <>
            <p className="text-[11px] font-bold text-[#0E8FCF] px-1 pt-1">Çekim Yöntemi Seçin</p>
            {METHODS.map(m => (
              <button key={m.key} onClick={() => setSelected(m)} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3 text-left hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[#edf5ff] flex items-center justify-center flex-shrink-0 text-[#0E8FCF]">
                  {m.key === 'kripto' ? <CryptoIcon /> : m.key === 'papara' ? <WalletIcon /> : <BankIcon />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a2332]">{m.name}</p>
                  <p className="text-[10px] text-[#737B8C] mt-0.5">{m.desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-semibold text-[#27ae60]">{m.time}</p>
                  <p className="text-[9px] text-[#737B8C]">{m.fee}</p>
                </div>
              </button>
            ))}
          </>
        ) : (
          <>
            {/* Selected method */}
            <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#edf5ff] flex items-center justify-center flex-shrink-0 text-[#0E8FCF]">
                {selected.key === 'kripto' ? <CryptoIcon /> : selected.key === 'papara' ? <WalletIcon /> : <BankIcon />}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#1a2332]">{selected.name}</p>
                <p className="text-[10px] text-[#737B8C]">{selected.time} · {selected.fee}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[11px] font-semibold text-[#0E8FCF]">Değiştir</button>
            </div>

            {/* Amount */}
            <div className="bg-white rounded-xl border border-[#e8ecf1] px-4 py-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-[#737B8C]">Çekim Tutarı</label>
                <button onClick={() => setAmount(String(BALANCE))} className="text-[10px] font-semibold text-[#0E8FCF]">Tümü ({fmt(BALANCE)} ₺)</button>
              </div>
              <div className="flex items-center gap-2 mt-1.5 border-b-2 border-[#0E8FCF] pb-1.5">
                <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="0" className="flex-1 text-[26px] font-bold text-[#1a2332] bg-transparent outline-none placeholder-[#c0c8d4]" />
                <span className="text-[20px] font-bold text-[#737B8C]">₺</span>
              </div>
              <p className="text-[10px] mt-2" style={{ color: amount && !amountOk ? '#e74c3c' : '#737B8C' }}>
                {amount && amt > BALANCE ? 'Bakiyenizden fazla çekemezsiniz.' : amount && amt < MIN ? `Minimum çekim ${fmt(MIN)} ₺.` : `Min ${fmt(MIN)} ₺ · Max ${fmt(BALANCE)} ₺`}
              </p>
            </div>

            {/* Account details */}
            <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
              <p className="px-4 py-2.5 text-[11px] font-bold text-[#0E8FCF] border-b border-[#f0f2f5]">Hesap Bilgileri</p>
              {selected.key === 'kripto' && (
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

            <div className="bg-[#fff8e1] rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-[#8a6d00] leading-relaxed">Çekim talepleri hesap sahibinin kimlik bilgileriyle eşleşmelidir. Farklı bir kişiye ait hesaba çekim yapılamaz.</p>
            </div>
          </>
        )}
      </div>

      {selected && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#e8ecf1] px-4 py-3">
          <button onClick={submit} disabled={!canSubmit} className="w-full py-[13px] bg-[#0E8FCF] text-white text-[14px] font-bold rounded-xl disabled:opacity-40 hover:bg-[#0a7ab5] transition-colors">
            {amountOk ? `${fmt(amt)} ₺ Çek` : 'Para Çek'}
          </button>
        </div>
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

const BankIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>
const CryptoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.5 8h4a2 2 0 0 1 0 4h-4h4.5a2 2 0 0 1 0 4H9.5M10 6v12" /></svg>
const WalletIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" /></svg>
