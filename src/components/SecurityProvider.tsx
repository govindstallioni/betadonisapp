'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

// ── Security checklist state (task 26) ──────────────────────────────────────
// The client's reference (guvenlik1.PNG) shows a six-item checklist with an
// N/6 progress bar whose job is to nudge the user into filling the gaps. That
// only works if the items actually persist: before this provider, 2FA lived in
// a local useState that reset on every navigation, and the profile fields were
// hardcoded strings, so nothing could ever be *completed*.
//
// The editable profile fields live here too, because two of the six checklist
// items ("Telefon Numarası" and "Profil") are defined entirely by them.

const STORAGE_KEY = 'bta_security'
const DAY = 86_400_000

/** Passwords older than this count as stale — the reference spells the rule
 *  out in the row title ("her 90 günde bir değiştirin"). */
export const PASSWORD_MAX_AGE_DAYS = 90

/** Seeded so a fresh user starts at 1/6 like the reference: the password is
 *  the one item already satisfied, at 31 days old. */
const SEED_PASSWORD_AGE_DAYS = 31

export const SECURITY_QUESTIONS = [
  'İlk evcil hayvanınızın adı?',
  'Annenizin kızlık soyadı?',
  'İlkokulunuzun adı?',
  'Doğduğunuz şehir?',
  'En sevdiğiniz takımın adı?',
  'Çocukluk arkadaşınızın adı?',
]

/** Profile fields the "Profil" checklist item requires before it counts as
 *  filled in. Adres is deliberately blank in the defaults so a new user starts
 *  with the row in its warning state, as the reference shows. */
export const REQUIRED_PROFILE_FIELDS = ['Ad', 'Soyad', 'E-posta', 'Adres', 'Şehir', 'Ülke']

export const DEFAULT_PROFILE: Record<string, string> = {
  'Unvan': 'Bay',
  'Ad': 'Ahmet',
  'Soyad': 'Yılmaz',
  'E-posta': 'kullanici@betadonis.com',
  'Telefon': '',
  'Dil': 'Türkçe',
  'Adres': '',
  'Ek Adres': '',
  'Posta Kutusu': '',
  'Ülke': 'Türkiye',
  'Şehir': 'İstanbul',
  'Bonusların Kullanım Yeri': 'İkisi de (Spor + Casino)',
  'Engellenmiş Bonuslar': 'Yok',
  'Canlı İzleme Tipi': 'Her Zaman Göster',
}

export interface SecurityState {
  passwordChangedAt: number
  securityQuestion: string
  securityAnswer: string
  twoFactor: boolean
  blockEmailLogin: boolean
  profile: Record<string, string>
}

export type SecurityKey = 'phone' | 'password' | 'question' | 'twofa' | 'profile' | 'blockEmail'

export interface ChecklistItem {
  key: SecurityKey
  title: string
  /** Current state, shown under the title — green when done, red when not. */
  status: string
  done: boolean
  /** Where the user goes to satisfy this item (absent for the inline toggle). */
  href?: string
  /** Renders a toggle instead of a chevron. */
  toggle?: boolean
  /** Plain-language "what this does for you", for the step-by-step guidance the
   *  task asks for ("açıklamalar farklı, daha anlaşılabilir"). */
  hint: string
}

// Turkish mobile numbers: 05XX XXX XX XX.
const PHONE_RE = /^05\d{9}$/
export const phoneDigits = (s: string) => s.replace(/\D/g, '').slice(0, 11)
export const formatPhone = (s: string) => {
  const d = phoneDigits(s)
  return [d.slice(0, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean).join(' ')
}

interface SecurityContextValue {
  loaded: boolean
  state: SecurityState
  items: ChecklistItem[]
  doneCount: number
  total: number
  /** True only when every item is satisfied. */
  secured: boolean
  setTwoFactor: (v: boolean) => void
  setBlockEmailLogin: (v: boolean) => void
  setSecurityQuestion: (question: string, answer: string) => void
  setProfileField: (field: string, value: string) => void
  recordPasswordChange: () => void
}

const EMPTY: SecurityState = {
  passwordChangedAt: 0,
  securityQuestion: '',
  securityAnswer: '',
  twoFactor: false,
  blockEmailLogin: false,
  profile: DEFAULT_PROFILE,
}

const SecurityContext = createContext<SecurityContextValue>({
  loaded: false,
  state: EMPTY,
  items: [],
  doneCount: 0,
  total: 6,
  secured: false,
  setTwoFactor: () => {},
  setBlockEmailLogin: () => {},
  setSecurityQuestion: () => {},
  setProfileField: () => {},
  recordPasswordChange: () => {},
})

export function useSecurity() {
  return useContext(SecurityContext)
}

export default function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SecurityState>(EMPTY)
  const [loaded, setLoaded] = useState(false)

  // Restore once on mount (client-only → no hydration mismatch). The seeded
  // password age is computed here rather than at module scope so the server and
  // the first client render agree on EMPTY.
  useEffect(() => {
    let next: SecurityState = { ...EMPTY, passwordChangedAt: Date.now() - SEED_PASSWORD_AGE_DAYS * DAY }
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          next = {
            ...next,
            ...parsed,
            // Merge so profile fields added in a later build still appear.
            profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
          }
        }
      }
    } catch {}
    setState(next)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state, loaded])

  const setTwoFactor = useCallback((v: boolean) => setState(s => ({ ...s, twoFactor: v })), [])
  const setBlockEmailLogin = useCallback((v: boolean) => setState(s => ({ ...s, blockEmailLogin: v })), [])
  const setSecurityQuestion = useCallback(
    (question: string, answer: string) => setState(s => ({ ...s, securityQuestion: question, securityAnswer: answer })),
    []
  )
  const setProfileField = useCallback(
    (field: string, value: string) => setState(s => ({ ...s, profile: { ...s.profile, [field]: value } })),
    []
  )
  const recordPasswordChange = useCallback(() => setState(s => ({ ...s, passwordChangedAt: Date.now() })), [])

  const items = useMemo<ChecklistItem[]>(() => {
    const phone = phoneDigits(state.profile['Telefon'] || '')
    const phoneOk = PHONE_RE.test(phone)

    const days = state.passwordChangedAt ? Math.floor((Date.now() - state.passwordChangedAt) / DAY) : Infinity
    const passwordOk = days < PASSWORD_MAX_AGE_DAYS

    const questionOk = state.securityQuestion !== '' && state.securityAnswer.trim() !== ''
    const profileOk = REQUIRED_PROFILE_FIELDS.every(f => (state.profile[f] || '').trim() !== '')

    return [
      {
        key: 'phone',
        title: 'Telefon Numarası',
        done: phoneOk,
        status: phoneOk ? `0${phone.slice(1, 4)} *** ** ${phone.slice(9)}` : 'Bağlı değil',
        href: '/hesap/profil',
        hint: 'Şifrenizi unutursanız hesabınızı telefonunuzla geri alabilirsiniz.',
      },
      {
        key: 'password',
        title: 'Güncel şifre (her 90 günde bir değiştirin)',
        done: passwordOk,
        status: Number.isFinite(days)
          ? `Son değişiklikten bu yana geçen süre: ${days} gün`
          : 'Şifreniz hiç değiştirilmedi',
        href: '/hesap/profil',
        hint: 'Düzenli değişen bir şifre, sızdırılmış parolalarla girişi engeller.',
      },
      {
        key: 'question',
        title: 'Güvenlik sorusu',
        done: questionOk,
        status: questionOk ? state.securityQuestion : 'Seçim yapılmadı',
        href: '/settings/security-question',
        hint: 'Destek ekibimiz sizi bu soruyla doğrular, kimse başkası adına işlem yapamaz.',
      },
      {
        key: 'twofa',
        title: '2 Faktörlü Kimlik Doğrulama',
        done: state.twoFactor,
        status: state.twoFactor ? 'Etkin' : 'Devre dışı bırakıldı',
        href: '/settings/2fa',
        hint: 'Şifreniz ele geçse bile telefonunuzdaki kod olmadan giriş yapılamaz.',
      },
      {
        key: 'profile',
        title: 'Profil',
        done: profileOk,
        status: profileOk ? 'Dolduruldu' : 'Doldurulmadı',
        href: '/hesap/profil',
        hint: 'Eksiksiz profil, para çekme taleplerinizin beklemeden onaylanmasını sağlar.',
      },
      {
        key: 'blockEmail',
        title: 'E-posta ile oturum açmayı engelle',
        done: state.blockEmailLogin,
        status: state.blockEmailLogin ? 'Engelleme etkin' : 'Engelleme devre dışı bırakıldı',
        toggle: true,
        hint: 'Girişi yalnızca kullanıcı adınıza kapatır, e-postanız ele geçse bile hesabınıza girilemez.',
      },
    ]
  }, [state])

  const doneCount = items.filter(i => i.done).length

  return (
    <SecurityContext.Provider
      value={{
        loaded,
        state,
        items,
        doneCount,
        total: items.length,
        secured: doneCount === items.length,
        setTwoFactor,
        setBlockEmailLogin,
        setSecurityQuestion,
        setProfileField,
        recordPasswordChange,
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}
