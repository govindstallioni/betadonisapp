'use client'

import Link from 'next/link'
import { useTheme } from './ThemeProvider'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const darkMode = theme === 'dark'

  return (
    <header className="bg-white">
      {/* Top row: logo centered, icons right */}
      <div className="flex items-center justify-between px-4 h-[48px]">
        <div className="w-[68px]" />
        <Link href="/">
          <img src="/logo.png" alt="BetAdonis" className="h-[20px] object-contain" />
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center">
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#e4e8ec' : '#1a2332'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
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
