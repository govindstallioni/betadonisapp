'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
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

        {/* Email field */}
        <div className="mt-5">
          <label className={`text-[10px] font-medium mb-1 block transition-colors ${emailFocused ? 'text-[#0E8FCF]' : 'text-[#737B8C]'}`}>
            E-posta, ID veya kullanıcı adı
          </label>
          <div className={`flex items-center gap-2.5 bg-white rounded-xl px-3 h-[44px] border transition-colors ${
            emailFocused ? 'border-[#0E8FCF] shadow-[0_0_0_3px_rgba(14,143,207,0.1)]' : 'border-[#e0e5ec]'
          }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={emailFocused ? '#0E8FCF' : '#b0b8c4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="7" r="4" /><path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
            </svg>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="E-posta veya ID giriniz"
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
          <span className="text-[9px] text-[#b0b8c4] font-medium uppercase">veya devam et</span>
          <div className="flex-1 h-px bg-[#e0e5ec]" />
        </div>

        {/* Social login */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button className="w-10 h-10 rounded-xl bg-white border border-[#e8ecf1] flex items-center justify-center hover:border-[#d0d5dd] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center hover:bg-[#333] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center hover:bg-[#4752c4] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#0E8FCF] flex items-center justify-center hover:bg-[#0a7ab5] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-xl bg-white border border-[#e8ecf1] flex items-center justify-center hover:border-[#d0d5dd] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#737B8C">
              <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="text-[11px] text-[#737B8C]">Hesabınız yok mu?</span>
          <Link href="/register" className="text-[11px] text-[#0E8FCF] font-semibold">Kayıt Ol</Link>
        </div>
      </div>
    </div>
  )
}
