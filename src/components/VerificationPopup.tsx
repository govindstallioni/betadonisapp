'use client'

import { useEffect, useRef, useState } from 'react'
import { NoticeBubble, useNotice } from '@/components/AuthWidgets'
import { DEMO_MODE, mmss, newCode } from '@/components/CodeVerifyScreen'
import { validateEmail } from '@/components/authValidation'
import { findAccount, isEmailTaken, updateAccountEmail } from '@/components/authStore'

// ── SMS + e-mail verification popup (v6.6 tasks 31 + 32) ────────────────────
// One popup, two entry points (registersms.png / profil44.png):
//   • right after phone registration ("Kayıt İşlemi Tamamlanmıştır")
//   • from the profile's E-posta / Telefon rows, on its own page
// Following the live site, verification is always optional:
//   • SMS Kodu — one field, "Kalan Süre" countdown, SMS Doğrula / Tekrar SMS Gönder
//   • Email Adresi — add an address and verify it with a mailed code
//   • "Doğrulamayı Daha Sonra Yapacağım" — skip and continue to the site
//
// Codes are generated in the browser while DEMO_MODE is on (see
// CodeVerifyScreen): there is no SMS / e-mail gateway in this prototype.

const CODE_LENGTH = 6
const CODE_TTL = 120 // seconds — the reference counts down from ~02:00
const RESEND_AFTER = 30
const MAX_ATTEMPTS = 5

/** One code-entry channel: generation, expiry, resend cooldown, attempt limit. */
function useOtp(initiallyVerified = false) {
  const [code, setCode] = useState('')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [expiresIn, setExpiresIn] = useState(0)
  const [resendIn, setResendIn] = useState(0)
  const [verified, setVerified] = useState(initiallyVerified)

  useEffect(() => {
    const t = setInterval(() => {
      setExpiresIn((s) => (s > 0 ? s - 1 : 0))
      setResendIn((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  /** Issues a fresh code and returns it (for the demo bubble). */
  const send = () => {
    const c = newCode()
    setCode(c)
    setInput('')
    setError('')
    setAttempts(0)
    setExpiresIn(CODE_TTL)
    setResendIn(RESEND_AFTER)
    return c
  }

  /** Returns true when the typed code is right. */
  const check = (): boolean => {
    if (!code) { setError('Önce doğrulama kodu gönderin.'); return false }
    if (attempts >= MAX_ATTEMPTS) { setError('Çok fazla hatalı deneme. Lütfen yeni kod isteyin.'); return false }
    if (expiresIn === 0) { setError('Kodun süresi doldu. Lütfen yeni kod isteyin.'); return false }
    if (input.length < CODE_LENGTH) { setError(`Lütfen ${CODE_LENGTH} haneli kodu eksiksiz girin.`); return false }
    if (input !== code) {
      const used = attempts + 1
      setAttempts(used)
      const left = MAX_ATTEMPTS - used
      setError(left > 0 ? `Doğrulama kodu hatalı. Kalan deneme hakkı: ${left}` : 'Çok fazla hatalı deneme. Lütfen yeni kod isteyin.')
      setInput('')
      return false
    }
    setError('')
    setVerified(true)
    return true
  }

  return { code, input, setInput, error, setError, attempts, expiresIn, resendIn, verified, send, check, sent: code !== '' }
}

const inputCls = 'w-full h-[44px] rounded-lg bg-white border px-3 text-[14px] text-[#1a2332] outline-none transition-colors placeholder-[#b0b8c4]'

function CodeRow({ label, expiresIn, active }: { label: string; expiresIn: number; active: boolean }) {
  return (
    <div className="flex items-end justify-between mb-1.5">
      <span className="text-[12px] text-[#737B8C]">{label}</span>
      {active && (
        <span className="text-[12px] text-[#737B8C]">
          Kalan Süre{' '}
          <span className={`font-semibold tabular-nums ${expiresIn > 0 ? 'text-[#27ae60]' : 'text-[#e74c3c]'}`}>{mmss(expiresIn)}</span>
        </span>
      )}
    </div>
  )
}

const btnPrimary = 'w-full h-[40px] rounded-lg bg-[#0E8FCF] text-white text-[13px] font-semibold disabled:opacity-40 hover:bg-[#0a7ab5] transition-colors'
const btnSecondary = 'w-full h-[40px] rounded-lg bg-[#edf5ff] text-[#0E8FCF] text-[13px] font-semibold disabled:opacity-60 transition-colors'

export default function VerificationPopup({
  title, intro, phone, phoneVerified = false, initialEmail = '', emailVerified = false,
  username, onClose, onPhoneVerified, onEmailVerified,
}: {
  title: React.ReactNode
  /** Paragraph under the title; mention the number the SMS goes to. */
  intro: React.ReactNode
  /** E.164 number the SMS goes to, or null when there is no usable number. */
  phone: string | null
  phoneVerified?: boolean
  initialEmail?: string
  emailVerified?: boolean
  username: string
  onClose: () => void
  onPhoneVerified: () => void
  onEmailVerified: (email: string) => void
}) {
  const notice = useNotice()
  const sms = useOtp(phoneVerified)
  const mail = useOtp(emailVerified)
  const [email, setEmail] = useState(initialEmail)
  const [emailError, setEmailError] = useState('')
  const [busy, setBusy] = useState(false)
  const smsInput = useRef<HTMLInputElement>(null)

  const announce = (c: string, what: string) =>
    notice.show('success', DEMO_MODE ? `Demo modu: ${what} servisi bağlı değil. Doğrulama kodunuz ${c}` : 'Doğrulama kodu gönderildi.')

  // The SMS goes out as soon as the popup opens, as in the reference — unless
  // there is no number to send to or it is already verified.
  useEffect(() => {
    if (!phone || phoneVerified) return
    announce(sms.send(), 'SMS')
    smsInput.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const verifySms = () => {
    if (sms.check()) {
      notice.show('success', 'Telefon numaranız doğrulandı.')
      onPhoneVerified()
    } else {
      notice.show('error', 'Telefon doğrulanamadı.')
    }
  }

  const sendMail = async () => {
    const bad = validateEmail(email)
    if (bad) { setEmailError(bad); return }
    setBusy(true)
    // The user's own address (already on their account) is not "taken".
    const own = (await findAccount(username))?.email?.toLowerCase()
    const taken = (await isEmailTaken(email)) && own !== email.trim().toLowerCase()
    setBusy(false)
    if (taken) { setEmailError('Bu e-posta adresi zaten kayıtlı.'); return }
    setEmailError('')
    announce(mail.send(), 'E-posta')
  }

  const verifyMail = async () => {
    if (!mail.check()) { notice.show('error', 'E-posta doğrulanamadı.'); return }
    await updateAccountEmail(username, email)
    notice.show('success', 'E-posta adresiniz doğrulandı.')
    onEmailVerified(email.trim())
  }

  const smsLocked = sms.attempts >= MAX_ATTEMPTS
  const mailLocked = mail.attempts >= MAX_ATTEMPTS

  return (
    <div className="max-w-[430px] mx-auto min-h-screen relative flex items-center justify-center bg-[#1a2332]/60 px-4 py-6">
      <NoticeBubble notice={notice.notice} onClose={notice.hide} />
      <div role="dialog" aria-modal="true" aria-label="Hesap doğrulama" className="relative w-full max-h-[94vh] overflow-y-auto bg-white rounded-2xl px-5 pt-12 pb-6 shadow-2xl">
        <button onClick={onClose} aria-label="Kapat" className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-black/5 flex items-center justify-center text-[#737B8C]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>

        <h2 className="text-[20px] font-bold text-[#1a2332] text-center leading-snug">{title}</h2>
        <p className="text-[13px] text-[#4a5568] text-center leading-relaxed mt-3">{intro}</p>

        {/* SMS */}
        <div className="mt-6">
          {!phone ? (
            <p className="rounded-lg bg-[#fef3c7] text-[#92400e] text-[12px] leading-relaxed px-3 py-3 text-center">
              Profilinizde kayıtlı bir telefon numarası yok. SMS doğrulaması için önce profilinize telefon numaranızı ekleyin.
            </p>
          ) : sms.verified ? (
            <p className="flex items-center justify-center gap-2 rounded-lg bg-[#e8f7ef] text-[#16a34a] text-[13px] font-semibold py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z" /></svg>
              Telefon numaranız doğrulandı
            </p>
          ) : (
            <>
              <CodeRow label="SMS Kodu" expiresIn={sms.expiresIn} active={sms.sent} />
              <input
                ref={smsInput}
                value={sms.input}
                onChange={(e) => { sms.setInput(e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH)); sms.setError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') verifySms() }}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={CODE_LENGTH}
                disabled={smsLocked}
                aria-label="SMS Kodu"
                aria-invalid={!!sms.error}
                className={`${inputCls} ${sms.error ? 'border-[#e74c3c]' : 'border-[#e0e5ec] focus:border-[#0E8FCF]'}`}
              />
              {sms.error && <p role="alert" className="mt-1 text-[11px] text-[#e74c3c]">{sms.error}</p>}
              <div className="flex flex-col gap-2 mt-2">
                <button onClick={verifySms} disabled={sms.input.length < CODE_LENGTH || smsLocked} className={btnPrimary}>SMS Doğrula</button>
                <button
                  onClick={() => announce(sms.send(), 'SMS')}
                  disabled={sms.resendIn > 0 && sms.expiresIn > 0 && !smsLocked}
                  className={btnSecondary}
                >
                  Tekrar SMS Gönder{sms.resendIn > 0 && sms.expiresIn > 0 && !smsLocked ? ` (${mmss(sms.resendIn)})` : ''}
                </button>
              </div>
            </>
          )}
        </div>

        {/* E-mail */}
        <div className="mt-6">
          {mail.verified ? (
            <p className="flex items-center justify-center gap-2 rounded-lg bg-[#e8f7ef] text-[#16a34a] text-[13px] font-semibold py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z" /></svg>
              E-posta adresiniz doğrulandı
            </p>
          ) : (
            <>
              <span className="block mb-1.5 text-[12px] text-[#737B8C]">Email Adresi</span>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); if (mail.sent) mail.setInput('') }}
                type="email"
                inputMode="email"
                autoComplete="email"
                disabled={mail.sent}
                placeholder="ornek@eposta.com"
                aria-label="Email Adresi"
                aria-invalid={!!emailError}
                className={`${inputCls} ${emailError ? 'border-[#e74c3c]' : 'border-[#e0e5ec] focus:border-[#0E8FCF]'} disabled:bg-[#f5f7fa]`}
              />
              {emailError && <p role="alert" className="mt-1 text-[11px] text-[#e74c3c]">{emailError}</p>}

              {!mail.sent ? (
                <button onClick={sendMail} disabled={busy || !email.trim()} className={`${btnPrimary} mt-2`}>
                  Doğrulama Kodunu Mail Adresine Gönder
                </button>
              ) : (
                <div className="mt-3">
                  <CodeRow label="E-posta Kodu" expiresIn={mail.expiresIn} active />
                  <input
                    value={mail.input}
                    onChange={(e) => { mail.setInput(e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH)); mail.setError('') }}
                    onKeyDown={(e) => { if (e.key === 'Enter') verifyMail() }}
                    inputMode="numeric"
                    maxLength={CODE_LENGTH}
                    disabled={mailLocked}
                    aria-label="E-posta Kodu"
                    aria-invalid={!!mail.error}
                    className={`${inputCls} ${mail.error ? 'border-[#e74c3c]' : 'border-[#e0e5ec] focus:border-[#0E8FCF]'}`}
                  />
                  {mail.error && <p role="alert" className="mt-1 text-[11px] text-[#e74c3c]">{mail.error}</p>}
                  <div className="flex flex-col gap-2 mt-2">
                    <button onClick={verifyMail} disabled={mail.input.length < CODE_LENGTH || mailLocked} className={btnPrimary}>E-postayı Doğrula</button>
                    <button
                      onClick={() => announce(mail.send(), 'E-posta')}
                      disabled={mail.resendIn > 0 && mail.expiresIn > 0 && !mailLocked}
                      className={btnSecondary}
                    >
                      Kodu Tekrar Gönder{mail.resendIn > 0 && mail.expiresIn > 0 && !mailLocked ? ` (${mmss(mail.resendIn)})` : ''}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className={`w-full h-[40px] mt-7 rounded-lg text-[13px] font-semibold transition-colors ${sms.verified || mail.verified ? 'bg-[#27ae60] text-white hover:bg-[#219a52]' : 'bg-[#f1f5f9] text-[#1a2332]'}`}
        >
          {sms.verified || mail.verified ? 'Devam Et' : 'Doğrulamayı Daha Sonra Yapacağım'}
        </button>
      </div>
    </div>
  )
}
