'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = () => {
    if (!value.trim()) return
    setSent(true)
  }

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5" aria-label="Geri">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-5 pt-3 pb-4 flex flex-col">
        {!sent ? (
          <>
            <h1 className="text-[20px] font-bold text-[#1a2332]">Şifrenizi mi unuttunuz?</h1>
            <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed">
              Kayıtlı kullanıcı adınızı veya e-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim.
            </p>

            <div className="mt-5">
              <label className={`text-[10px] font-medium mb-1 block transition-colors ${focused ? 'text-[#0E8FCF]' : 'text-[#737B8C]'}`}>
                Kullanıcı Adı veya E-posta
              </label>
              <div className={`flex items-center gap-2.5 bg-white rounded-xl px-3 h-[44px] border transition-colors ${
                focused ? 'border-[#0E8FCF] shadow-[0_0_0_3px_rgba(14,143,207,0.1)]' : 'border-[#e0e5ec]'
              }`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={focused ? '#0E8FCF' : '#b0b8c4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" />
                </svg>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Kullanıcı adı veya e-posta"
                  className="flex-1 text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
                />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={!value.trim()}
              className="w-full mt-5 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] disabled:opacity-40 transition-colors shadow-[0_4px_12px_rgba(14,143,207,0.3)]"
            >
              Sıfırlama Bağlantısı Gönder
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center pt-10">
            <span className="w-[64px] h-[64px] rounded-full bg-[#e8f7ef] flex items-center justify-center mb-4">
              <span className="w-[46px] h-[46px] rounded-full bg-[#27ae60] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
            </span>
            <p className="text-[16px] font-bold text-[#1a2332]">Bağlantı gönderildi</p>
            <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed">
              <span className="font-semibold text-[#1a2332]">{value}</span> adresine şifre sıfırlama bağlantısı gönderdik. Gelen kutunuzu kontrol edin.
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-1 mt-6">
          <span className="text-[11px] text-[#737B8C]">Şifrenizi hatırladınız mı?</span>
          <Link href="/login" className="text-[11px] text-[#0E8FCF] font-semibold">Giriş Yap</Link>
        </div>
      </div>
    </div>
  )
}
