'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [usernameFocused, setUsernameFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      {/* Hero illustration */}
      <div className="relative h-[220px] bg-[#dce8f5] overflow-hidden">
        <button
          onClick={() => router.back()}
          className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <svg viewBox="0 0 430 220" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="350" cy="80" r="140" fill="#4a9fd8" opacity="0.3" />
          <circle cx="350" cy="80" r="120" fill="#5aabdf" opacity="0.4" />
          <circle cx="350" cy="80" r="100" fill="#6ab5e5" opacity="0.3" />
          <path d="M270,10 Q350,80 270,150" stroke="white" strokeWidth="3" fill="none" opacity="0.3" />
          <path d="M350,-10 L350,170" stroke="white" strokeWidth="2" opacity="0.15" />
          <circle cx="150" cy="150" r="65" fill="#e05555" opacity="0.8" />
          <ellipse cx="135" cy="135" rx="20" ry="35" fill="white" opacity="0.15" transform="rotate(-20 135 135)" />
          <circle cx="270" cy="215" r="35" fill="#f0ebe5" />
          <path d="M252,198 Q267,215 252,232" stroke="#c4a882" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M288,198 Q273,215 288,232" stroke="#c4a882" strokeWidth="1.5" fill="none" opacity="0.5" />
        </svg>
      </div>

      {/* Login form */}
      <div className="flex-1 px-5 pt-5 pb-4 flex flex-col">
        <h1 className="text-[20px] font-bold text-[#1a2332]">Giriş Yap</h1>

        {/* Username field */}
        <div className="mt-5">
          <label className={`text-[10px] font-medium mb-1 block transition-colors ${usernameFocused ? 'text-[#0E8FCF]' : 'text-[#737B8C]'}`}>
            Kullanıcı Adı
          </label>
          <div className={`flex items-center gap-2.5 bg-white rounded-xl px-3 h-[44px] border transition-colors ${
            usernameFocused ? 'border-[#0E8FCF] shadow-[0_0_0_3px_rgba(14,143,207,0.1)]' : 'border-[#e0e5ec]'
          }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={usernameFocused ? '#0E8FCF' : '#b0b8c4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="7" r="4" /><path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              placeholder="Kullanıcı adınızı giriniz"
              className="flex-1 text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="mt-3">
          <label className={`text-[10px] font-medium mb-1 block transition-colors ${passwordFocused ? 'text-[#0E8FCF]' : 'text-[#737B8C]'}`}>
            Şifre
          </label>
          <div className={`flex items-center gap-2.5 bg-white rounded-xl px-3 h-[44px] border transition-colors ${
            passwordFocused ? 'border-[#0E8FCF] shadow-[0_0_0_3px_rgba(14,143,207,0.1)]' : 'border-[#e0e5ec]'
          }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={passwordFocused ? '#0E8FCF' : '#b0b8c4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Şifrenizi giriniz"
              className="flex-1 text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="flex-shrink-0 p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0b8c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showPassword ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <button className="mt-2 self-end text-[10px] text-[#0E8FCF] font-medium">
          Şifrenizi mi unuttunuz?
        </button>

        {/* Login button */}
        <button onClick={() => router.push('/')} className="w-full mt-4 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors shadow-[0_4px_12px_rgba(14,143,207,0.3)]">
          Giriş Yap
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-px bg-[#e0e5ec]" />
          <span className="text-[9px] text-[#b0b8c4] font-medium uppercase">veya kayıt ol</span>
          <div className="flex-1 h-px bg-[#e0e5ec]" />
        </div>

        {/* Google only registration */}
        <button className="flex items-center justify-center gap-2.5 mt-3 w-full h-[44px] rounded-xl bg-white border border-[#e8ecf1] hover:border-[#d0d5dd] hover:shadow-sm transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-[12px] font-medium text-[#1a2332]">Gmail ile Kayıt Ol</span>
        </button>

        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="text-[11px] text-[#737B8C]">Hesabınız yok mu?</span>
          <Link href="/register" className="text-[11px] text-[#0E8FCF] font-semibold">Kayıt Ol</Link>
        </div>
      </div>
    </div>
  )
}
