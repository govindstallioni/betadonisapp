'use client'

import { useState } from 'react'
import Link from 'next/link'
import SlideUpBubble from './SlideUpBubble'
import { useAuth } from './AuthProvider'
import { useMessages } from './MessagesProvider'

// ── "Sizi Arayalım" (Call Me) ───────────────────────────────────────────────
// Fields and copy follow the client's reference flow (betadonis.store/ara.html):
// name, phone, subject, preferred call window, then a confirmation carrying a
// booking number. Two differences from that reference, both deliberate:
//
//  • The reference mocks its own passwordless login modal. We gate on the real
//    AuthProvider and send guests to /login instead — "giriş ekranımız zorunlu
//    olmalı" means OUR login screen.
//  • It has no backend. There is no call-centre queue to post to, so a request
//    is filed through the existing message inbox (see submit below), which is
//    where every other user-generated record in this prototype lives.

const TOPICS = [
  'Özel fırsatlar hakkında bilgi',
  'Hesap & bonus görüşmesi',
  'VIP üyelik detayları',
  'Kişisel asistan görüşmesi',
]

const TIME_SLOTS = [
  'En kısa sürede aransın',
  '09:00 – 12:00',
  '12:00 – 18:00',
  '18:00 – 24:00',
]

// Turkish mobile numbers: 05XX XXX XX XX — 11 digits starting 05.
const PHONE_RE = /^05\d{9}$/

function digitsOnly(s: string) {
  return s.replace(/\D/g, '').slice(0, 11)
}

/** 05XX XXX XX XX as the user types. */
function formatPhone(s: string) {
  const d = digitsOnly(s)
  const parts = [d.slice(0, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean)
  return parts.join(' ')
}

function bookingNo() {
  const year = new Date().getFullYear()
  const n = Math.floor(1000 + Math.random() * 9000)
  return `#VIP-${year}-${n}`
}

/** Shared launcher state: opens the form, or the login gate for guests. */
export function useCallMe() {
  const { loaded, isLoggedIn } = useAuth()
  const [formOpen, setFormOpen] = useState(false)
  const [loginPrompt, setLoginPrompt] = useState(false)

  // `loaded` matters: AuthProvider restores from localStorage in an effect, so
  // isLoggedIn is false on the very first render even for signed-in users.
  const launch = () => {
    if (!loaded) return
    if (!isLoggedIn) { setLoginPrompt(true); return }
    setFormOpen(true)
  }

  return {
    formOpen, loginPrompt, launch,
    closeForm: () => setFormOpen(false),
    closeLoginPrompt: () => setLoginPrompt(false),
  }
}

/** Login-required prompt — same shape the daily-wheel gate uses. */
export function CallMeLoginPrompt({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/55 left-1/2 -translate-x-1/2 w-full max-w-[430px]" onClick={onClose} />
      <div className="fixed z-[95] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-2xl p-5 animate-slide-up">
        <div className="w-14 h-14 rounded-full bg-[#e6f3fb] flex items-center justify-center mx-auto mb-3">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <p className="text-[15px] font-bold text-[#1a2332] text-center">Devam etmek için giriş yap</p>
        <p className="text-[11px] text-[#737B8C] text-center mt-1 leading-relaxed">
          Sizi arayabilmemiz için hesabınıza giriş yapmanız gerekiyor.
        </p>
        <div className="flex gap-2.5 mt-4">
          <Link href="/login" className="flex-1 h-[42px] rounded-xl border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-bold flex items-center justify-center">Giriş Yap</Link>
          <Link href="/register" className="flex-1 h-[42px] rounded-xl bg-[#0E8FCF] text-white text-[12px] font-bold flex items-center justify-center">Kayıt Ol</Link>
        </div>
        <button onClick={onClose} className="w-full mt-2.5 h-[36px] text-[11px] font-semibold text-[#94a3b8]">Vazgeç</button>
      </div>
    </>
  )
}

/** The request form itself, as a bottom sheet. */
export function CallMeSheet({ onClose }: { onClose: () => void }) {
  const { username } = useAuth()
  const { send } = useMessages()

  // AuthProvider holds only a username — no stored name or phone to prefill.
  const [name, setName] = useState(username || '')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState('')
  const [slot, setSlot] = useState('')
  const [touched, setTouched] = useState(false)
  const [ref, setRef] = useState<string | null>(null)

  const phoneDigits = digitsOnly(phone)
  const errors = {
    name: name.trim().length < 3,
    phone: !PHONE_RE.test(phoneDigits),
    topic: topic === '',
    slot: slot === '',
  }
  const invalid = Object.values(errors).some(Boolean)

  const submit = () => {
    setTouched(true)
    if (invalid) return
    const no = bookingNo()
    // No call-centre backend exists in this prototype — file the request through
    // the message inbox so it is at least recorded and visible to the user.
    send(
      `Arama talebi ${no}`,
      `Ad Soyad: ${name.trim()}\nTelefon: ${formatPhone(phoneDigits)}\nGörüşme Konusu: ${topic}\nUygun Arama Saati: ${slot}`,
    )
    setRef(no)
  }

  const fieldCls = (bad: boolean) =>
    `w-full h-[44px] rounded-xl px-3 text-[13px] text-[#1a2332] bg-[#f4f7fb] border outline-none ${
      touched && bad ? 'border-[#e74c3c]' : 'border-[#e8ecf1] focus:border-[#0E8FCF]'
    }`

  if (ref) {
    return (
      <SlideUpBubble onClose={onClose}>
        <div className="px-5 pt-6 pb-7 text-center">
          <div className="w-16 h-16 rounded-full bg-[#eafaf1] flex items-center justify-center mx-auto mb-3">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-[16px] font-bold text-[#1a2332]">Randevunuz Oluşturuldu</h2>
          <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed">
            Kısa süre içinde sizinle iletişime geçilecek. Telefonunuzu açık tutmanız yeterli.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#edf5ff] rounded-full px-4 py-2">
            <span className="text-[10px] font-semibold text-[#737B8C]">RANDEVU NO</span>
            <span className="text-[12px] font-bold text-[#0E8FCF] tabular-nums">{ref}</span>
          </div>
          <p className="text-[10px] text-[#94a3b8] mt-3">Talebiniz Mesajlar bölümüne kaydedildi.</p>
          <button onClick={onClose} className="w-full h-[46px] mt-5 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold">
            Tamam
          </button>
        </div>
      </SlideUpBubble>
    )
  }

  return (
    <SlideUpBubble onClose={onClose}>
      <div className="px-5 pt-5 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[16px] font-bold text-[#1a2332]">Sizi Arayalım</h2>
            <p className="text-[11px] text-[#737B8C] mt-1 leading-relaxed">
              Detaylarınızı bırakın, müşteri temsilcimiz sizinle iletişime geçsin.
            </p>
          </div>
          <button onClick={onClose} aria-label="Kapat" className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="cm-name" className="text-[11px] font-semibold text-[#1a2332]">Ad Soyad</label>
            <input
              id="cm-name" type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Adınız ve soyadınız" className={`${fieldCls(errors.name)} mt-1.5`}
            />
            {touched && errors.name && <p className="text-[10px] text-[#e74c3c] mt-1">Lütfen ad ve soyadınızı girin.</p>}
          </div>

          <div>
            <label htmlFor="cm-phone" className="text-[11px] font-semibold text-[#1a2332]">Telefon Numarası</label>
            <input
              id="cm-phone" type="tel" inputMode="numeric" value={formatPhone(phone)}
              onChange={e => setPhone(e.target.value)}
              placeholder="05XX XXX XX XX" className={`${fieldCls(errors.phone)} mt-1.5 tabular-nums`}
            />
            {touched && errors.phone && <p className="text-[10px] text-[#e74c3c] mt-1">05 ile başlayan 11 haneli numaranızı girin.</p>}
          </div>

          <div>
            <label htmlFor="cm-topic" className="text-[11px] font-semibold text-[#1a2332]">Görüşme Konusu</label>
            <select id="cm-topic" value={topic} onChange={e => setTopic(e.target.value)} className={`${fieldCls(errors.topic)} mt-1.5`}>
              <option value="">Seçiniz…</option>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {touched && errors.topic && <p className="text-[10px] text-[#e74c3c] mt-1">Bir konu seçin.</p>}
          </div>

          <div>
            <label htmlFor="cm-slot" className="text-[11px] font-semibold text-[#1a2332]">Uygun Arama Saati</label>
            <select id="cm-slot" value={slot} onChange={e => setSlot(e.target.value)} className={`${fieldCls(errors.slot)} mt-1.5`}>
              <option value="">Seçiniz…</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {touched && errors.slot && <p className="text-[10px] text-[#e74c3c] mt-1">Bir saat aralığı seçin.</p>}
          </div>
        </div>

        <button onClick={submit} className="w-full h-[46px] mt-5 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold active:scale-[0.99] transition-transform">
          Randevu Oluştur
        </button>
        <p className="text-[10px] text-[#94a3b8] text-center mt-2.5 leading-relaxed">
          Bilgileriniz KVKK kapsamında korunur, 3. taraflarla paylaşılmaz.
        </p>
      </div>
    </SlideUpBubble>
  )
}
