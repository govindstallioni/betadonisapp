'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthHero from '@/components/AuthHero'
import { useAuth } from '@/components/AuthProvider'
import {
  CheckboxField, CodeSelect, LegalModal, NoticeBubble, PasswordField, PasswordRules,
  SelectField, TextField, useNotice, type Option,
} from '@/components/AuthWidgets'
import {
  normalizePhone, validateEmail, validateGmail, validatePassword, validatePasswordConfirm,
  validatePhone, validateUsername,
} from '@/components/authValidation'
import VerificationPopup from '@/components/VerificationPopup'
import { useSecurity } from '@/components/SecurityProvider'
import { useVerification } from '@/components/verificationStore'
import { isEmailTaken, isPhoneTaken, isUsernameTaken, registerAccount } from '@/components/authStore'

const docIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const regMethods = [
  {
    label: 'Telefon ile',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    label: 'E-posta ile',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
  {
    label: 'Sosyal Medya ile',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
]

const socialProviders = [
  { name: 'Google', color: '#fff', border: true, active: true, icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg> },
  { name: 'X.com', color: '#1a1a1a', border: false, active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
  { name: 'Discord', color: '#5865F2', border: false, active: false, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg> },
  { name: 'Telegram', color: '#26a5e4', border: false, active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg> },
  { name: 'Apple', color: '#1a1a1a', border: false, active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" /><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg> },
]

// ── Dropdown options ───────────────────────────────────────────

const PHONE_CODES: Option[] = [
  { value: '+90', label: 'Türkiye', flag: '🇹🇷', hint: '+90' },
  { value: '+994', label: 'Azerbaycan', flag: '🇦🇿', hint: '+994' },
  { value: '+49', label: 'Almanya', flag: '🇩🇪', hint: '+49' },
  { value: '+44', label: 'Birleşik Krallık', flag: '🇬🇧', hint: '+44' },
  { value: '+7', label: 'Rusya', flag: '🇷🇺', hint: '+7' },
  { value: '+1', label: 'ABD', flag: '🇺🇸', hint: '+1' },
  { value: '+33', label: 'Fransa', flag: '🇫🇷', hint: '+33' },
  { value: '+31', label: 'Hollanda', flag: '🇳🇱', hint: '+31' },
  { value: '+46', label: 'İsveç', flag: '🇸🇪', hint: '+46' },
  { value: '+966', label: 'Suudi Arabistan', flag: '🇸🇦', hint: '+966' },
]

const CURRENCIES: Option[] = [
  { value: 'TRY', label: 'Türk Lirası (TRY)' },
  { value: 'USD', label: 'ABD Doları (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'İngiliz Sterlini (GBP)' },
  { value: 'USDT', label: 'Tether (USDT)' },
]

const BONUSES: Option[] = [
  { value: 'spor', label: 'Spor bonusu' },
  { value: 'casino', label: 'Casino bonusu' },
  { value: 'none', label: 'Bonus istemiyorum' },
]

const COUNTRIES: Option[] = PHONE_CODES.map((c) => ({ value: c.label, label: c.label, flag: c.flag }))

// ── Form state helper ──────────────────────────────────────────
// Errors show once a field has been left (touched) or the form was submitted,
// so the user isn't shouted at while still typing the first character.
type Errors<T> = Partial<Record<keyof T, string>>
// Widen inferred literals ({ terms: false } → boolean) so setters accept both values.
type Widen<T> = { [K in keyof T]: T[K] extends boolean ? boolean : string }

function useForm<I extends Record<string, string | boolean>>(init: I, validate: (v: Widen<I>) => Errors<I>) {
  type T = Widen<I>
  const [values, setValues] = useState<T>(init as T)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [server, setServer] = useState<Errors<T>>({})

  const all = validate(values)
  const set = <K extends keyof T>(k: K, v: T[K]) => {
    setValues((p) => ({ ...p, [k]: v }))
    setServer((p) => (p[k] ? { ...p, [k]: undefined } : p))
  }
  const touch = (k: keyof T) => setTouched((p) => ({ ...p, [k]: true }))
  const err = (k: keyof T): string | undefined => server[k] ?? ((submitted || touched[k]) ? all[k] || undefined : undefined)

  return { values, set, touch, err, all, setServer, markSubmitted: () => setSubmitted(true) }
}

const TERMS_ERROR = 'Devam etmek için onaylamanız gerekir.'

// ── Shared chrome ──────────────────────────────────────────────

function LinkRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2.5 mt-2.5 hover:opacity-80 transition-opacity">
      <div className="w-7 h-7 rounded-lg bg-[#edf5ff] flex items-center justify-center flex-shrink-0">{docIcon}</div>
      <span className="text-[11px] text-[#0E8FCF] font-medium">{label}</span>
    </button>
  )
}

function LegalLinks({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <>
      <LinkRow label="Şartlar ve Koşullar" onClick={() => onOpen('sartlar')} />
      <LinkRow label="Müşteri Sözleşmesi" onClick={() => onOpen('musteri-sozlesmesi')} />
      <LinkRow label="Gizlilik Politikası" onClick={() => onOpen('gizlilik')} />
    </>
  )
}

function FormHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30">
      <div className="flex items-center">
        <button onClick={onBack} aria-label="Geri" className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-[16px] font-bold text-[#0E8FCF]">{title}</h1>
          <p className="text-[10px] text-[#737B8C]">{subtitle}</p>
        </div>
        <div className="w-8" />
      </div>
    </div>
  )
}

function SubmitBar({ onSubmit, busy }: { onSubmit: () => void; busy: boolean }) {
  return (
    <div className="sticky bottom-0 px-4 py-2 bg-bg">
      <button onClick={onSubmit} disabled={busy} className="w-full py-[12px] bg-[#27ae60] text-white text-[13px] font-medium rounded-xl hover:bg-[#219a52] disabled:opacity-60 transition-colors">
        {busy ? 'Kaydediliyor…' : 'Kayıt Ol'}
      </button>
    </div>
  )
}

function FormShell({ subtitle, onBack, onSubmit, busy, notice, children }: {
  subtitle: string; onBack: () => void; onSubmit: () => void; busy: boolean
  notice: ReturnType<typeof useNotice>; children: React.ReactNode
}) {
  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <NoticeBubble notice={notice.notice} onClose={notice.hide} />
      <FormHeader title="Kayıt" subtitle={subtitle} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {children}
        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="text-[11px] text-[#737B8C]">Zaten hesabınız var mı?</span>
          <Link href="/login" className="text-[11px] text-[#0E8FCF] font-medium">Giriş Yap</Link>
        </div>
      </div>
      <SubmitBar onSubmit={onSubmit} busy={busy} />
    </div>
  )
}

// Marks the account as signed in and hands off to the welcome bubble on home.
function useFinish() {
  const router = useRouter()
  const { login } = useAuth()
  return (username: string) => {
    try { localStorage.setItem('bta_welcome_bubble_pending', '1') } catch {}
    login(username)
    router.push('/')
  }
}

// ── Phone form ─────────────────────────────────────────────────

function PhoneForm({ onBack }: { onBack: () => void }) {
  const notice = useNotice()
  const router = useRouter()
  const { login } = useAuth()
  const { setProfileField } = useSecurity()
  const { markVerified } = useVerification()
  const [legal, setLegal] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  // Set once the account exists: registration is complete, and the popup offers
  // (optional) SMS / e-mail verification, as on the live site (registersms.png).
  const [created, setCreated] = useState<{ phone: string; username: string } | null>(null)

  // The profile stores Turkish mobiles as 05XXXXXXXXX.
  const profilePhone = (phone: string) => (f.values.dial === '+90' ? '0' + phone.slice(3) : null)

  const goHome = () => {
    try { localStorage.setItem('bta_welcome_bubble_pending', '1') } catch {}
    router.push('/')
  }
  const f = useForm(
    { dial: '+90', phone: '', username: '', password: '', confirm: '', currency: 'TRY', promo: '', bonus: 'spor', terms: false, marketing: true },
    (v) => ({
      phone: validatePhone(v.dial, v.phone),
      username: validateUsername(v.username),
      password: validatePassword(v.password),
      confirm: validatePasswordConfirm(v.password, v.confirm),
      terms: v.terms ? '' : TERMS_ERROR,
    }),
  )

  const submit = async () => {
    f.markSubmitted()
    if (Object.values(f.all).some(Boolean)) { notice.show('error', 'Lütfen işaretli alanları düzeltin.'); return }
    setBusy(true)
    const v = f.values
    const phone = normalizePhone(v.dial, v.phone)
    const [phoneTaken, userTaken] = await Promise.all([isPhoneTaken(phone), isUsernameTaken(v.username)])
    if (phoneTaken || userTaken) {
      f.setServer({
        ...(phoneTaken ? { phone: 'Bu telefon numarası zaten kayıtlı.' } : {}),
        ...(userTaken ? { username: 'Bu kullanıcı adı zaten alınmış.' } : {}),
      })
      notice.show('error', 'Kayıt tamamlanamadı. Lütfen bilgilerinizi kontrol edin.')
      setBusy(false)
      return
    }
    // Registration completes now; verification happens afterwards and is optional.
    await registerAccount({ username: v.username, password: v.password, phone, method: 'phone', currency: v.currency })
    login(v.username)
    const local = profilePhone(phone)
    if (local) setProfileField('Telefon', local)
    setBusy(false)
    setCreated({ phone, username: v.username })
  }

  if (created) {
    return (
      <VerificationPopup
        title={<>Kayıt İşlemi<br />Tamamlanmıştır</>}
        intro={<>Üyelik kaydınız başarıyla gerçekleşmiştir. Doğrulama kodunuz <span className="font-semibold text-[#1a2332]">{created.phone}</span> numaralı telefona gönderilmiştir.</>}
        phone={created.phone}
        username={created.username}
        onClose={goHome}
        onPhoneVerified={() => { const local = profilePhone(created.phone); if (local) markVerified('phone', local) }}
        onEmailVerified={(email) => { setProfileField('E-posta', email); markVerified('email', email) }}
      />
    )
  }

  return (
    <FormShell subtitle="Telefon ile" onBack={onBack} onSubmit={submit} busy={busy} notice={notice}>
      <div className="rounded-2xl px-1 py-1 mt-3">
        <div className="flex items-start gap-2">
          <CodeSelect options={PHONE_CODES} value={f.values.dial} onChange={(x) => f.set('dial', x)} />
          <div className="flex-1">
            <TextField
              placeholder="Telefon numarası *"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={f.values.phone}
              onChange={(x) => f.set('phone', x)}
              onBlur={() => f.touch('phone')}
              error={f.err('phone')}
            />
          </div>
        </div>
        <TextField label="Kullanıcı Adı" placeholder="Kullanıcı adınız *" required autoComplete="username" value={f.values.username} onChange={(x) => f.set('username', x)} onBlur={() => f.touch('username')} error={f.err('username')} />
        <PasswordField label="Şifre" placeholder="Şifrenizi giriniz" autoComplete="new-password" value={f.values.password} onChange={(x) => f.set('password', x)} onBlur={() => f.touch('password')} error={f.err('password')} />
        <PasswordField label="Şifre Tekrar" placeholder="Şifrenizi tekrar giriniz" autoComplete="new-password" value={f.values.confirm} onChange={(x) => f.set('confirm', x)} onBlur={() => f.touch('confirm')} error={f.err('confirm')} />
        <PasswordRules password={f.values.password} />
        <SelectField label="Para Birimi" required options={CURRENCIES} value={f.values.currency} onChange={(x) => f.set('currency', x)} />
        <TextField placeholder="Promosyon kodu (isteğe bağlı)" value={f.values.promo} onChange={(x) => f.set('promo', x)} />
        <SelectField label="Bonus" options={BONUSES} value={f.values.bonus} onChange={(x) => f.set('bonus', x)} />
      </div>
      <LegalLinks onOpen={setLegal} />
      <CheckboxField checked={f.values.terms} onChange={(x) => { f.set('terms', x); f.touch('terms') }} error={f.err('terms')} label="18 yaşından büyük olduğumu ve şirketin şartlar ve koşullarını ve gizlilik politikasını okuduğumu ve kabul ettiğimi onaylıyorum." />
      <CheckboxField checked={f.values.marketing} onChange={(x) => f.set('marketing', x)} label="Telefon yoluyla pazarlama ve promosyon teklifleri almayı kabul ediyorum." />
      <LegalModal slug={legal} onClose={() => setLegal(null)} />
    </FormShell>
  )
}

// ── Email form ─────────────────────────────────────────────────

function EmailForm({ onBack }: { onBack: () => void }) {
  const notice = useNotice()
  const finish = useFinish()
  const [legal, setLegal] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const f = useForm(
    { email: '', username: '', password: '', confirm: '', currency: 'TRY', bonus: 'spor', promo: '', terms: false },
    (v) => ({
      email: validateEmail(v.email),
      username: validateUsername(v.username),
      password: validatePassword(v.password),
      confirm: validatePasswordConfirm(v.password, v.confirm),
      terms: v.terms ? '' : TERMS_ERROR,
    }),
  )

  const submit = async () => {
    f.markSubmitted()
    if (Object.values(f.all).some(Boolean)) { notice.show('error', 'Lütfen işaretli alanları düzeltin.'); return }
    setBusy(true)
    const v = f.values
    const [mailTaken, userTaken] = await Promise.all([isEmailTaken(v.email), isUsernameTaken(v.username)])
    if (mailTaken || userTaken) {
      f.setServer({
        ...(mailTaken ? { email: 'Bu e-posta adresi zaten kayıtlı.' } : {}),
        ...(userTaken ? { username: 'Bu kullanıcı adı zaten alınmış.' } : {}),
      })
      notice.show('error', 'Kayıt tamamlanamadı. Lütfen bilgilerinizi kontrol edin.')
      setBusy(false)
      return
    }
    await registerAccount({ username: v.username, password: v.password, email: v.email, method: 'email', currency: v.currency })
    finish(v.username)
  }

  return (
    <FormShell subtitle="E-posta ile" onBack={onBack} onSubmit={submit} busy={busy} notice={notice}>
      <div className="rounded-2xl px-1 py-1 mt-3">
        <TextField label="E-posta" placeholder="E-posta adresiniz *" required type="email" inputMode="email" autoComplete="email" value={f.values.email} onChange={(x) => f.set('email', x)} onBlur={() => f.touch('email')} error={f.err('email')} />
        <TextField label="Kullanıcı Adı" placeholder="Kullanıcı adınız *" required autoComplete="username" value={f.values.username} onChange={(x) => f.set('username', x)} onBlur={() => f.touch('username')} error={f.err('username')} />
        <PasswordField label="Şifre" placeholder="Şifrenizi giriniz" autoComplete="new-password" value={f.values.password} onChange={(x) => f.set('password', x)} onBlur={() => f.touch('password')} error={f.err('password')} />
        <PasswordField label="Şifre Tekrar" placeholder="Şifrenizi tekrar giriniz" autoComplete="new-password" value={f.values.confirm} onChange={(x) => f.set('confirm', x)} onBlur={() => f.touch('confirm')} error={f.err('confirm')} />
        <PasswordRules password={f.values.password} />
        <SelectField label="Para Birimi" required options={CURRENCIES} value={f.values.currency} onChange={(x) => f.set('currency', x)} />
        <SelectField label="Bonus" options={BONUSES} value={f.values.bonus} onChange={(x) => f.set('bonus', x)} />
        <TextField placeholder="Promosyon kodu (isteğe bağlı)" value={f.values.promo} onChange={(x) => f.set('promo', x)} />
      </div>
      <LegalLinks onOpen={setLegal} />
      <CheckboxField checked={f.values.terms} onChange={(x) => { f.set('terms', x); f.touch('terms') }} error={f.err('terms')} label="18 yaşından büyük olduğumu ve şirketin şartlar ve koşullarını ve gizlilik politikasını okuduğumu ve kabul ettiğimi onaylıyorum." />
      <LegalModal slug={legal} onClose={() => setLegal(null)} />
    </FormShell>
  )
}

// ── Social form ────────────────────────────────────────────────
// Only Google is live. The form stays hidden until it is picked.

function SocialForm({ onBack }: { onBack: () => void }) {
  const notice = useNotice()
  const finish = useFinish()
  const [selected, setSelected] = useState<string | null>(null)
  const [legal, setLegal] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const f = useForm(
    { email: '', country: 'Türkiye', currency: 'TRY', bonus: 'spor', promo: '', terms: false },
    (v) => ({
      email: validateGmail(v.email),
      terms: v.terms ? '' : TERMS_ERROR,
    }),
  )

  const pick = (p: (typeof socialProviders)[number]) => {
    if (!p.active) { notice.show('warn', 'Bu seçenek şu anda aktif değildir.'); return }
    setSelected(p.name)
  }

  const submit = async () => {
    if (!selected) { notice.show('warn', 'Lütfen önce bir kayıt yöntemi seçin.'); return }
    f.markSubmitted()
    if (Object.values(f.all).some(Boolean)) { notice.show('error', 'Lütfen işaretli alanları düzeltin.'); return }
    setBusy(true)
    const v = f.values
    if (await isEmailTaken(v.email)) {
      f.setServer({ email: 'Bu Gmail hesabı zaten kayıtlı. Giriş yapmayı deneyin.' })
      notice.show('error', 'Kayıt tamamlanamadı. Lütfen bilgilerinizi kontrol edin.')
      setBusy(false)
      return
    }
    // The username is derived from the Gmail local part, de-duplicated.
    const base = v.email.split('@')[0].replace(/[^A-Za-z0-9_.]/g, '').slice(0, 16) || 'oyuncu'
    let username = base
    for (let i = 1; await isUsernameTaken(username); i++) username = `${base}${i}`
    await registerAccount({ username, email: v.email, method: 'social', currency: v.currency })
    finish(username)
  }

  return (
    <FormShell subtitle="Sosyal Medya ile" onBack={onBack} onSubmit={submit} busy={busy} notice={notice}>
      {/* Social providers */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {socialProviders.map((p) => {
          const isSel = selected === p.name
          return (
            <button
              key={p.name}
              onClick={() => pick(p)}
              aria-pressed={isSel}
              aria-disabled={!p.active}
              className={`flex flex-col items-center gap-1 w-[52px] py-2 rounded-lg transition-all ${p.border ? 'bg-white border' : ''} ${isSel ? 'border-[#0E8FCF] ring-2 ring-[#0E8FCF]/40' : p.border ? 'border-[#e8ecf1]' : ''} ${!p.active ? 'opacity-30' : ''}`}
              style={!p.border ? { backgroundColor: p.color } : undefined}
            >
              <div className="w-6 h-6 flex items-center justify-center [&>svg]:w-[16px] [&>svg]:h-[16px]">{p.icon}</div>
              <span className={`text-[7px] font-medium leading-none ${p.border ? 'text-[#1a2332]' : 'text-white'}`}>{p.name}</span>
            </button>
          )
        })}
      </div>

      {!selected ? (
        <p className="mt-4 text-center text-[11px] text-[#737B8C]">Devam etmek için Google ile kayıt yöntemini seçin.</p>
      ) : (
        <>
          <div className="rounded-2xl px-1 py-1 mt-2.5">
            <TextField label="Gmail Adresi" placeholder="ornek@gmail.com *" required type="email" inputMode="email" autoComplete="email" value={f.values.email} onChange={(x) => f.set('email', x)} onBlur={() => f.touch('email')} error={f.err('email')} />
            <SelectField label="Ülke" required options={COUNTRIES} value={f.values.country} onChange={(x) => f.set('country', x)} />
            <SelectField label="Para Birimi" required options={CURRENCIES} value={f.values.currency} onChange={(x) => f.set('currency', x)} />
            <SelectField label="Bonus" options={BONUSES} value={f.values.bonus} onChange={(x) => f.set('bonus', x)} />
            <TextField placeholder="Promosyon kodu (isteğe bağlı)" value={f.values.promo} onChange={(x) => f.set('promo', x)} />
          </div>
          <LegalLinks onOpen={setLegal} />
          <CheckboxField checked={f.values.terms} onChange={(x) => { f.set('terms', x); f.touch('terms') }} error={f.err('terms')} label="18 yaşından büyük olduğumu ve şartlar ve koşulları, müşteri sözleşmesini ve gizlilik politikasını kabul ettiğimi onaylıyorum." />
        </>
      )}
      <LegalModal slug={legal} onClose={() => setLegal(null)} />
    </FormShell>
  )
}

// ── Main screen ────────────────────────────────────────────────

const METHOD_PARAM: Record<string, number> = { phone: 0, email: 1, social: 2 }

export default function RegisterScreen() {
  // /register?method=social lets the login screen's "Gmail ile Kayıt Ol"
  // land straight on the social form.
  const params = useSearchParams()
  const initial = METHOD_PARAM[params.get('method') ?? ''] ?? null
  const [activeMethod, setActiveMethod] = useState<number | null>(initial)
  const router = useRouter()

  if (activeMethod === 0) return <PhoneForm onBack={() => setActiveMethod(null)} />
  if (activeMethod === 1) return <EmailForm onBack={() => setActiveMethod(null)} />
  if (activeMethod === 2) return <SocialForm onBack={() => setActiveMethod(null)} />

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      {/* Back button — fixed so it stays put on scroll (task 10) rather than
          scrolling away with the decorative hero underneath it. */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 px-3 pointer-events-none">
        <button onClick={() => router.back()} className="pointer-events-auto w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
      </div>

      {/* Animated hero */}
      <div className="relative h-[240px] overflow-hidden">
        <AuthHero variant="register" />
      </div>

      {/* Methods */}
      <div className="flex-1 px-5 pt-5 pb-4">
        <h1 className="text-[20px] font-bold text-[#1a2332]">Kayıt Ol</h1>
        <div className="flex flex-col gap-2 mt-4">
          {regMethods.map((method, i) => (
            <button key={method.label} onClick={() => setActiveMethod(i)} className="flex items-center gap-3 bg-white rounded-xl px-3 py-[10px] border border-[#e8ecf1] hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">{method.icon}</div>
              <span className="text-[12px] font-medium text-[#1a2332]">{method.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1 mt-5">
          <span className="text-[11px] text-[#737B8C]">Zaten hesabınız var mı?</span>
          <Link href="/login" className="text-[11px] text-[#0E8FCF] font-medium">Giriş Yap</Link>
        </div>
      </div>
    </div>
  )
}
