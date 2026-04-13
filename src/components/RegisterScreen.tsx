'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const chevronDown = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

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

// ── Shared components ──────────────────────────────────────────

function DropdownField({ label, value, required }: { label: string; value?: string; required?: boolean }) {
  return (
    <button className="w-full flex items-center bg-white rounded-xl px-3 py-[2px] mt-2.5 border border-[#e8ecf1] hover:border-[#0E8FCF] transition-colors text-left">
      <div className="flex-1 py-[6px]">
        <span className="text-[9px] text-[#0E8FCF] font-medium block">{label}{required && ' *'}</span>
        <span className="text-[12px] text-[#1a2332] font-medium">{value || ''}</span>
      </div>
      {chevronDown}
    </button>
  )
}

function InputField({ label, placeholder, required, type = 'text' }: { label?: string; placeholder: string; required?: boolean; type?: string }) {
  return (
    <div className="mt-2.5">
      <div className="bg-white rounded-xl px-3 py-[2px] border border-[#e8ecf1] focus-within:border-[#0E8FCF] focus-within:shadow-[0_0_0_3px_rgba(14,143,207,0.1)] transition-all">
        {label && <span className="text-[9px] text-[#737B8C] font-medium block pt-[6px]">{label}{required && ' *'}</span>}
        <input type={type} placeholder={placeholder} className={`w-full text-[12px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4] ${label ? 'pb-[6px]' : 'py-[10px]'}`} />
      </div>
    </div>
  )
}

function PasswordField({ label, placeholder }: { label: string; placeholder: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="mt-2.5">
      <div className="flex items-center bg-white rounded-xl px-3 py-[2px] border border-[#e8ecf1] focus-within:border-[#0E8FCF] focus-within:shadow-[0_0_0_3px_rgba(14,143,207,0.1)] transition-all">
        <div className="flex-1 py-[6px]">
          <span className="text-[9px] text-[#737B8C] font-medium block">{label} *</span>
          <input type={show ? 'text' : 'password'} placeholder={placeholder} className="w-full text-[12px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]" />
        </div>
        <button onClick={() => setShow(!show)} className="flex-shrink-0 p-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {show ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
          </svg>
        </button>
      </div>
    </div>
  )
}

function CheckboxField({ label, checked }: { label: string; checked?: boolean }) {
  const [isChecked, setIsChecked] = useState(checked || false)
  return (
    <button onClick={() => setIsChecked(!isChecked)} className="flex items-start gap-2.5 mt-2.5 text-left">
      <div className={`w-[18px] h-[18px] rounded-[4px] flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${isChecked ? 'bg-[#0E8FCF]' : 'border-[1.5px] border-[#c0c8d4] bg-white'}`}>
        {isChecked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
      </div>
      <span className="text-[10px] text-[#1a2332] leading-relaxed">{label}</span>
    </button>
  )
}

function LinkRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2.5 mt-2.5 hover:opacity-80 transition-opacity">
      <div className="w-7 h-7 rounded-lg bg-[#edf5ff] flex items-center justify-center flex-shrink-0">{icon}</div>
      <span className="text-[11px] text-[#0E8FCF] font-medium">{label}</span>
    </button>
  )
}

function FormHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <div className="bg-white px-4 pt-4 pb-3">
      <div className="flex items-center">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
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

function BottomButton() {
  return (
    <div className="sticky bottom-0 px-4 py-2 bg-bg">
      <button className="w-full py-[12px] bg-[#27ae60] text-white text-[13px] font-medium rounded-xl hover:bg-[#219a52] transition-colors">Kayıt Ol</button>
    </div>
  )
}

// ── Phone form ─────────────────────────────────────────────────

function PhoneForm({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <FormHeader title="Kayıt" subtitle="Telefon ile" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="rounded-2xl px-1 py-1 mt-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-[2px] border border-[#e8ecf1]">
              <div className="py-[6px]">
                <span className="text-[9px] text-[#0E8FCF] font-medium block">Kod *</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px]">🇹🇷</span>
                  <span className="text-[12px] text-[#1a2332] font-medium">+90</span>
                  {chevronDown}
                </div>
              </div>
            </button>
            <div className="flex-1 bg-white rounded-xl px-3 py-[2px] border border-[#e8ecf1] focus-within:border-[#0E8FCF] transition-all">
              <input type="tel" placeholder="Telefon numarası *" className="w-full text-[12px] text-[#1a2332] py-[14px] bg-transparent outline-none placeholder-[#b0b8c4]" />
            </div>
          </div>
          <InputField label="Kullanıcı Adı" placeholder="Kullanıcı adınız *" required />
          <PasswordField label="Şifre" placeholder="Şifrenizi giriniz" />
          <PasswordField label="Şifre Tekrar" placeholder="Şifrenizi tekrar giriniz" />
          <DropdownField label="Para Birimi" value="Türk Lirası (TRY)" required />
          <InputField placeholder="Promosyon kodu (isteğe bağlı)" />
          <DropdownField label="Bonus" value="Spor bonusu" />
        </div>
        <LinkRow icon={docIcon} label="Şartlar ve Koşullar" />
        <LinkRow icon={docIcon} label="Gizlilik Politikası" />
        <CheckboxField label="18 yaşından büyük olduğumu ve şirketin şartlar ve koşullarını ve gizlilik politikasını okuduğumu ve kabul ettiğimi onaylıyorum." />
        <CheckboxField label="Telefon yoluyla pazarlama ve promosyon teklifleri almayı kabul ediyorum." checked />
        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="text-[11px] text-[#737B8C]">Zaten hesabınız var mı?</span>
          <Link href="/login" className="text-[11px] text-[#0E8FCF] font-medium">Giriş Yap</Link>
        </div>
      </div>
      <BottomButton />
    </div>
  )
}

// ── Email form ─────────────────────────────────────────────────

function EmailForm({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <FormHeader title="Kayıt" subtitle="E-posta ile" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="rounded-2xl px-1 py-1 mt-3">
          <InputField label="E-posta" placeholder="E-posta adresiniz *" required />
          <InputField label="Kullanıcı Adı" placeholder="Kullanıcı adınız *" required />
          <PasswordField label="Şifre" placeholder="Şifrenizi giriniz" />
          <PasswordField label="Şifre Tekrar" placeholder="Şifrenizi tekrar giriniz" />
          {/* Password requirements */}
          <button className="w-full flex items-center gap-2.5 bg-[#edf5ff] rounded-xl px-3 py-[10px] mt-2.5">
            <div className="w-6 h-6 rounded-full bg-[#0E8FCF] flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v-4M12 8h.01" /></svg>
            </div>
            <span className="text-[11px] text-[#1a2332] font-medium flex-1 text-left">Şifre gereksinimleri</span>
            {chevronDown}
          </button>
          <DropdownField label="Bonus" value="Spor bonusu" />
          <InputField placeholder="Promosyon kodu (isteğe bağlı)" />
        </div>
        <LinkRow icon={docIcon} label="Şartlar ve Koşullar" />
        <LinkRow icon={docIcon} label="Gizlilik Politikası" />
        <CheckboxField label="18 yaşından büyük olduğumu ve şirketin şartlar ve koşullarını ve gizlilik politikasını okuduğumu ve kabul ettiğimi onaylıyorum." />
        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="text-[11px] text-[#737B8C]">Zaten hesabınız var mı?</span>
          <Link href="/login" className="text-[11px] text-[#0E8FCF] font-medium">Giriş Yap</Link>
        </div>
      </div>
      <BottomButton />
    </div>
  )
}

// ── Social form ────────────────────────────────────────────────

function SocialForm({ onBack }: { onBack: () => void }) {
  const [inactiveAlert, setInactiveAlert] = useState(false)

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <FormHeader title="Kayıt" subtitle="Sosyal Medya ile" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Social providers */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {socialProviders.map((p) => (
            <button
              key={p.name}
              onClick={() => { if (!p.active) setInactiveAlert(true) }}
              className={`flex flex-col items-center gap-1 w-[52px] py-2 rounded-lg ${p.border ? 'bg-white border border-[#e8ecf1]' : ''} ${!p.active ? 'opacity-30' : ''}`}
              style={!p.border ? { backgroundColor: p.color } : undefined}
            >
              <div className="w-6 h-6 flex items-center justify-center [&>svg]:w-[16px] [&>svg]:h-[16px]">{p.icon}</div>
              <span className={`text-[7px] font-medium leading-none ${p.border ? 'text-[#1a2332]' : 'text-white'}`}>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Inactive alert */}
        {inactiveAlert && (
          <div className="mt-3 px-3 py-2.5 bg-[#fef3c7] border border-[#f59e0b]/30 rounded-xl flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
            <span className="text-[10px] text-[#92400e] font-medium flex-1">Bu seçenek şu anda aktif değildir.</span>
            <button onClick={() => setInactiveAlert(false)} className="text-[#92400e]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}

        <div className="rounded-2xl px-1 py-1 mt-2.5">
          <DropdownField label="Ülke" value="Türkiye" required />
          <DropdownField label="Para Birimi" value="Türk Lirası (TRY)" required />
          <DropdownField label="Bonus" value="Spor bonusu" />
          <InputField placeholder="Promosyon kodu (isteğe bağlı)" />
        </div>
        <LinkRow icon={docIcon} label="Şartlar ve Koşullar" />
        <LinkRow icon={docIcon} label="Gizlilik Politikası" />
        <CheckboxField label="18 yaşından büyük olduğumu onaylıyorum." />
        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="text-[11px] text-[#737B8C]">Zaten hesabınız var mı?</span>
          <Link href="/login" className="text-[11px] text-[#0E8FCF] font-medium">Giriş Yap</Link>
        </div>
      </div>
      <BottomButton />
    </div>
  )
}

// ── Main screen ────────────────────────────────────────────────

export default function RegisterScreen() {
  const [activeMethod, setActiveMethod] = useState<number | null>(null)
  const router = useRouter()

  if (activeMethod === 0) return <PhoneForm onBack={() => setActiveMethod(null)} />
  if (activeMethod === 1) return <EmailForm onBack={() => setActiveMethod(null)} />
  if (activeMethod === 2) return <SocialForm onBack={() => setActiveMethod(null)} />

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      {/* Hero */}
      <div className="relative h-[240px] bg-[#dce8f5] overflow-hidden">
        <button onClick={() => router.back()} className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <svg viewBox="0 0 430 320" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="140" cy="130" r="160" fill="#e0e8ef" />
          <circle cx="140" cy="130" r="155" fill="#eef2f6" />
          <circle cx="370" cy="140" r="110" fill="#f0a030" opacity="0.8" />
          <circle cx="370" cy="140" r="105" fill="#e89520" opacity="0.6" />
          <circle cx="280" cy="320" r="55" fill="#a4e34a" />
          <circle cx="280" cy="320" r="52" fill="#8fd630" />
        </svg>
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
