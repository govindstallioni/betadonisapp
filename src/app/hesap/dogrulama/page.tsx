'use client'

import { useRouter } from 'next/navigation'
import VerificationPopup from '@/components/VerificationPopup'
import { useAuth } from '@/components/AuthProvider'
import { useSecurity, phoneDigits, formatPhone } from '@/components/SecurityProvider'
import { useVerification } from '@/components/verificationStore'
import { validateEmail } from '@/components/authValidation'

// Profile verification (v6.6 task 32, profil44.png): the same SMS + e-mail
// popup shown after registration, opened from the profile's E-posta / Telefon
// rows. A popup-style card, but on its own page: /hesap/dogrulama.
// (Older links carry ?type=email|phone; both channels are on the one popup now.)

export default function DogrulamaPage() {
  const router = useRouter()
  const { username } = useAuth()
  const { loaded, state, setProfileField } = useSecurity()
  const { isVerified, markVerified } = useVerification()
  const back = () => router.replace('/hesap/profil')

  if (!loaded) return <div className="max-w-[430px] mx-auto min-h-screen bg-[#1a2332]/60" />

  const digits = phoneDigits(state.profile['Telefon'] ?? '')
  const phoneOk = /^05\d{9}$/.test(digits)
  const phoneE164 = phoneOk ? '+90' + digits.slice(1) : null
  const email = (state.profile['E-posta'] ?? '').trim()
  const emailOk = !!email && !validateEmail(email)

  return (
    <VerificationPopup
      title="Hesap Doğrulama"
      intro={
        phoneE164 ? (
          <>Doğrulama kodunuz <span className="font-semibold text-[#1a2332]">+90 {formatPhone(digits)}</span> numaralı telefona gönderilmiştir. İsterseniz e-posta adresinizi de doğrulayabilirsiniz.</>
        ) : (
          <>Hesabınızı korumak için e-posta adresinizi doğrulayın.</>
        )
      }
      phone={phoneE164}
      phoneVerified={phoneOk && isVerified('phone', digits)}
      initialEmail={emailOk ? email : ''}
      emailVerified={emailOk && isVerified('email', email)}
      username={username}
      onClose={back}
      onPhoneVerified={() => markVerified('phone', digits)}
      onEmailVerified={(verified) => { setProfileField('E-posta', verified); markVerified('email', verified) }}
    />
  )
}
