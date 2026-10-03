'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { NoticeBubble, useNotice } from '@/components/AuthWidgets'

// ── One-time-code verification page (v6.6 tasks 31 + 32) ────────────────────
// Used for the phone-registration SMS step (full page) and for verifying the
// profile's e-mail / phone (popup-style page). It confirms a 6-digit code,
// then calls onVerified.
//
// There is no SMS / e-mail gateway in this prototype, so while DEMO_MODE is
// true the code is generated locally and shown in a "demo" bubble. To go live,
// set it to false, replace `sendCode` with a call to the real endpoint, and
// verify the code server-side instead of comparing against `code` below.

export const DEMO_MODE = true
const CODE_LENGTH = 6
const CODE_TTL = 120 // seconds a code stays valid
const RESEND_AFTER = 30 // seconds before "send again" unlocks
const MAX_ATTEMPTS = 5

export type Channel = 'sms' | 'email'

export function newCode(): string {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return String(100000 + (buf[0] % 900000))
}

export const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

// "+90 5•••••••67": keep the dial code, first digit and last two digits.
export function maskPhone(dial: string, phone: string): string {
  const rest = phone.slice(dial.length)
  if (rest.length < 4) return phone
  return `${dial} ${rest.slice(0, 1)}${'•'.repeat(rest.length - 3)}${rest.slice(-2)}`
}

// "k•••••••@betadonis.com": keep the first letter and the domain.
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  if (!domain) return email
  return `${name.slice(0, 1)}${'•'.repeat(Math.max(2, Math.min(name.length - 1, 8)))}@${domain}`
}

const COPY = {
  sms: {
    heading: 'Telefonunuzu doğrulayın',
    sentTo: 'numarasına',
    sentVia: 'doğrulama kodu gönderdik.',
    sent: 'Doğrulama kodu telefonunuza gönderildi.',
    ok: 'Telefon numaranız doğrulandı.',
    demo: 'SMS servisi bağlı değil.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 8h6M9 12h4" /><circle cx="12" cy="18" r=".6" fill="#0E8FCF" />
      </svg>
    ),
  },
  email: {
    heading: 'E-postanızı doğrulayın',
    sentTo: 'adresine',
    sentVia: 'doğrulama kodu gönderdik.',
    sent: 'Doğrulama kodu e-posta adresinize gönderildi.',
    ok: 'E-posta adresiniz doğrulandı.',
    demo: 'E-posta servisi bağlı değil.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
}

export default function CodeVerifyScreen({
  channel, target, onVerified, onBack, headerTitle = 'Kayıt', headerSubtitle, popup = false, doneLabel = 'Hesabınız oluşturuluyor…',
}: {
  channel: Channel
  target: string // already masked, e.g. "+90 5•••••••67"
  onVerified: () => void | Promise<void>
  onBack: () => void
  headerTitle?: string
  headerSubtitle?: string
  popup?: boolean // popup-style card over a dimmed page instead of a full page
  doneLabel?: string
}) {
  const copy = COPY[channel]
  const notice = useNotice()
  const [code, setCode] = useState('')
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [expiresIn, setExpiresIn] = useState(CODE_TTL)
  const [resendIn, setResendIn] = useState(RESEND_AFTER)
  const [verifying, setVerifying] = useState(false)
  const [done, setDone] = useState(false)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const sendCode = useCallback(() => {
    const c = newCode()
    setCode(c)
    setDigits(Array(CODE_LENGTH).fill(''))
    setError('')
    setAttempts(0)
    setExpiresIn(CODE_TTL)
    setResendIn(RESEND_AFTER)
    notice.show('success', DEMO_MODE ? `Demo modu: ${copy.demo} Doğrulama kodunuz ${c}` : copy.sent)
    setTimeout(() => refs.current[0]?.focus(), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // First code goes out as soon as the page opens.
  useEffect(() => { sendCode() }, [sendCode])

  useEffect(() => {
    const t = setInterval(() => {
      setExpiresIn((s) => (s > 0 ? s - 1 : 0))
      setResendIn((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const entered = digits.join('')
  const locked = attempts >= MAX_ATTEMPTS
  const expired = expiresIn === 0

  const setDigit = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, '')
    if (!d) {
      setDigits((p) => p.map((x, k) => (k === i ? '' : x)))
      return
    }
    // A multi-digit value (autofill / paste into one box) spreads forward.
    setDigits((p) => {
      const next = [...p]
      d.slice(0, CODE_LENGTH - i).split('').forEach((ch, k) => { next[i + k] = ch })
      return next
    })
    setError('')
    refs.current[Math.min(i + d.length, CODE_LENGTH - 1)]?.focus()
  }

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < CODE_LENGTH - 1) {
      refs.current[i + 1]?.focus()
    } else if (e.key === 'Enter') {
      verify()
    }
  }

  const verify = async () => {
    if (verifying || done) return
    if (locked) { setError('Çok fazla hatalı deneme. Lütfen yeni kod isteyin.'); return }
    if (expired) { setError('Kodun süresi doldu. Lütfen yeni kod isteyin.'); return }
    if (entered.length < CODE_LENGTH) { setError(`Lütfen ${CODE_LENGTH} haneli kodu eksiksiz girin.`); return }
    if (entered !== code) {
      const used = attempts + 1
      setAttempts(used)
      const left = MAX_ATTEMPTS - used
      const msg = left > 0 ? `Doğrulama kodu hatalı. Kalan deneme hakkı: ${left}` : 'Çok fazla hatalı deneme. Lütfen yeni kod isteyin.'
      setError(msg)
      notice.show('error', msg)
      setDigits(Array(CODE_LENGTH).fill(''))
      refs.current[0]?.focus()
      return
    }
    setVerifying(true)
    setError('')
    setDone(true)
    notice.show('success', copy.ok)
    await onVerified()
  }

  const boxBorder = error ? 'border-[#e74c3c]' : 'border-[#e0e5ec] focus:border-[#0E8FCF]'

  const body = (
    <div className="flex flex-col items-center text-center">
      <span className="w-[72px] h-[72px] rounded-full bg-[#edf5ff] flex items-center justify-center">{copy.icon}</span>
      <h2 className="text-[18px] font-bold text-[#1a2332] mt-4">{copy.heading}</h2>
      <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed">
        <span className="font-semibold text-[#1a2332]">{target}</span> {copy.sentTo} {CODE_LENGTH} haneli {copy.sentVia}
      </p>

      {/* Code boxes */}
      <div className="flex items-center justify-center gap-[8px] mt-6" onPaste={(e) => {
        const t = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
        if (!t) return
        e.preventDefault()
        setDigits(Array.from({ length: CODE_LENGTH }, (_, k) => t[k] ?? ''))
        setError('')
        refs.current[Math.min(t.length, CODE_LENGTH - 1)]?.focus()
      }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={CODE_LENGTH}
            aria-label={`Kod hanesi ${i + 1}`}
            disabled={done}
            className={`w-[42px] h-[52px] rounded-xl bg-white border text-center text-[20px] font-bold text-[#1a2332] outline-none transition-colors ${boxBorder}`}
          />
        ))}
      </div>

      {error && <p role="alert" className="mt-3 text-[11px] text-[#e74c3c] font-medium">{error}</p>}

      <p className={`mt-4 text-[11px] ${expired ? 'text-[#e74c3c] font-medium' : 'text-[#737B8C]'}`}>
        {expired ? 'Kodun süresi doldu.' : `Kodun geçerlilik süresi: ${mmss(expiresIn)}`}
      </p>

      <button
        onClick={verify}
        disabled={verifying || done || entered.length < CODE_LENGTH}
        className="w-full mt-6 py-[12px] bg-[#27ae60] text-white text-[13px] font-semibold rounded-xl hover:bg-[#219a52] disabled:opacity-50 transition-colors"
      >
        {done ? doneLabel : 'Doğrula'}
      </button>

      <div className="flex items-center justify-center gap-1 mt-4 text-[11px]">
        <span className="text-[#737B8C]">Kodu almadınız mı?</span>
        {resendIn > 0 && !expired && !locked ? (
          <span className="text-[#b0b8c4] font-medium">Tekrar gönder ({mmss(resendIn)})</span>
        ) : (
          <button onClick={sendCode} disabled={done} className="text-[#0E8FCF] font-semibold">Tekrar gönder</button>
        )}
      </div>
    </div>
  )

  // Popup-style: a card floating over a dimmed page, closed with the X.
  if (popup) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen relative flex items-center justify-center bg-[#1a2332]/60 px-4">
        <NoticeBubble notice={notice.notice} onClose={notice.hide} />
        <div role="dialog" aria-modal="true" aria-label={headerTitle} className="relative w-full bg-white rounded-2xl px-5 pt-10 pb-6 shadow-2xl">
          <button onClick={onBack} disabled={done} aria-label="Kapat" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#737B8C]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          {body}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <NoticeBubble notice={notice.notice} onClose={notice.hide} />

      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30">
        <div className="flex items-center">
          <button onClick={onBack} aria-label="Geri" className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-[16px] font-bold text-[#0E8FCF]">{headerTitle}</h1>
            {headerSubtitle && <p className="text-[10px] text-[#737B8C]">{headerSubtitle}</p>}
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 px-5 pt-8 pb-4">
        {body}
        <div className="flex justify-center">
          <button onClick={onBack} disabled={done} className="mt-3 text-[11px] text-[#0E8FCF] font-medium">Numarayı değiştir</button>
        </div>
      </div>
    </div>
  )
}
