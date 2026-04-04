'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white">
      {/* Top row: logo centered, search icon right */}
      <div className="flex items-center justify-between px-4 h-[48px]">
        <div className="w-8" />
        <Link href="/">
          <img src="/logo.png" alt="BetAdonis" className="h-[20px] object-contain" />
        </Link>
        <button className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </div>

      {/* Auth buttons row */}
      <div className="flex items-center gap-3 px-4 pb-3">
        <Link href="/login" className="flex-1 h-[40px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-medium tracking-wide flex items-center justify-center">
          Giriş Yap
        </Link>
        <Link href="/register" className="flex-1 h-[40px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-medium tracking-wide flex items-center justify-center">
          Kayıt Ol
        </Link>
      </div>

      <div className="h-[1px] bg-border" />
    </header>
  )
}
