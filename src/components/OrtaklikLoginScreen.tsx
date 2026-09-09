'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Self-contained demo form — deliberately does NOT touch AuthProvider/main
// session: affiliate accounts are a separate system from player accounts.
export default function OrtaklikLoginScreen() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const submit = () => {
    if (!username.trim() || !password.trim()) {
      setError(true)
      return
    }
    setError(false)
    setSuccess(true)
  }

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Ortak Girişi</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 pb-4">
        {success ? (
          <div className="flex flex-col items-center text-center pt-10">
            <span className="w-[60px] h-[60px] rounded-full bg-[#e8f7ef] flex items-center justify-center mb-4">
              <span className="w-[42px] h-[42px] rounded-full bg-[#27ae60] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
            </span>
            <p className="text-[15px] font-bold text-[#1a2332]">Ortak panelinize hoş geldiniz</p>
            <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed">Bu, ortaklık sistemi için bir demo giriş ekranıdır.</p>
            <Link href="/ortaklik" className="mt-6 w-full h-[44px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold flex items-center justify-center">
              Ortaklık Sayfasına Dön
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[12px] text-[#737B8C] leading-relaxed mb-5">
              Ortaklık hesabınız, oyuncu hesabınızdan bağımsız ayrı bir sistemdir.
            </p>

            <div className="mt-2">
              <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">Kullanıcı Adı</label>
              <div className="flex items-center gap-2.5 bg-white rounded-xl px-3 h-[44px] border border-[#e0e5ec] focus-within:border-[#0E8FCF] transition-colors">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ortak kullanıcı adınız"
                  className="flex-1 text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]" />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">Şifre</label>
              <div className="flex items-center gap-2.5 bg-white rounded-xl px-3 h-[44px] border border-[#e0e5ec] focus-within:border-[#0E8FCF] transition-colors">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifreniz"
                  className="flex-1 text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]" />
              </div>
            </div>

            {error && (
              <div className="mt-3 px-3 py-2.5 bg-[#fef2f2] border border-[#e74c3c]/30 rounded-xl flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#e74c3c"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
                <span className="text-[10px] text-[#b91c1c] font-medium flex-1">Kullanıcı adı ve şifre gerekli.</span>
              </div>
            )}

            <button onClick={submit} className="w-full mt-5 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors">
              Giriş Yap
            </button>

            <div className="flex items-center justify-center gap-1 mt-4">
              <span className="text-[11px] text-[#737B8C]">Henüz ortak değil misiniz?</span>
              <Link href="/ortaklik/register" className="text-[11px] text-[#0E8FCF] font-semibold">Bize Katılın</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
