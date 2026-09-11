'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'
import { useAccountPanel } from './AccountPanelProvider'
import { useMessages } from './MessagesProvider'
import { useNotifications } from './NotificationsProvider'
import ConfirmDialog from './ConfirmDialog'

const fmtBalance = (n: number) => `${n.toFixed(2).replace('.', ',')} ₺`

// Small red unread-count badge — mirrors BottomNav.tsx's bet-slip count badge.
function Badge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -top-[2px] -right-[2px] min-w-[16px] h-[16px] px-[4px] rounded-full bg-[#e74c3c] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const darkMode = theme === 'dark'
  const { loaded, isLoggedIn, balance, logout } = useAuth()
  const { open: openAccountPanel } = useAccountPanel()
  const { unreadCount: unreadMessages } = useMessages()
  const { unreadCount: unreadNotifications } = useNotifications()
  const [confirmLogout, setConfirmLogout] = useState(false)

  return (
    <>
    <header className="bg-white">
      {/* Top row: logo centered, search+favorites left, theme+settings right */}
      <div className="flex items-center justify-between px-4 h-[48px]">
        <div className="flex items-center gap-1">
          <Link href="/search" aria-label="Ara" className="w-8 h-8 flex items-center justify-center" suppressHydrationWarning>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#e4e8ec' : '#1a2332'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
          <Link href="/favorites" aria-label="Favorilerim" className="w-8 h-8 flex items-center justify-center" suppressHydrationWarning>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#e4e8ec' : '#1a2332'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </Link>
        </div>
        <Link href="/" suppressHydrationWarning>
          <img src={darkMode ? '/logo-dark.png' : '/logo.png'} alt="BetAdonis" className="h-[20px] object-contain" />
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

          {loaded && isLoggedIn && (
            <>
              <Link href="/hesap/mesajlar" aria-label="Mesajlarım" className="relative w-8 h-8 flex items-center justify-center" suppressHydrationWarning>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#e4e8ec' : '#1a2332'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
                </svg>
                <Badge count={unreadMessages} />
              </Link>
              <Link href="/hesap/bildirimler" aria-label="Bildirimler" className="relative w-8 h-8 flex items-center justify-center" suppressHydrationWarning>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#e4e8ec' : '#1a2332'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <Badge count={unreadNotifications} />
              </Link>
            </>
          )}

          <Link href="/settings" aria-label="Ayarlar" className="w-8 h-8 flex items-center justify-center" suppressHydrationWarning>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#e4e8ec' : '#1a2332'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            </svg>
          </Link>

          <button onClick={openAccountPanel} aria-label="Hesabım" className="w-8 h-8 flex items-center justify-center">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#e4e8ec' : '#1a2332'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </button>

          {loaded && isLoggedIn && (
            <button onClick={() => setConfirmLogout(true)} aria-label="Çıkış" className="w-8 h-8 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Auth / balance row — reflects logged-in state */}
      {loaded && isLoggedIn ? (
        <div className="flex items-center gap-2 px-4 pb-3">
          <button onClick={openAccountPanel} className="flex-1 h-[40px] rounded-full bg-[#edf5ff] border border-[#0E8FCF]/25 flex items-center gap-2 px-3.5" suppressHydrationWarning>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" /><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z" /><circle cx="16.5" cy="12.5" r="1.2" fill="#0E8FCF" stroke="none" />
            </svg>
            <span className="text-[13px] font-bold text-[#1a2332] tabular-nums leading-none">{fmtBalance(balance.total)}</span>
          </button>
          <Link href="/kupon/deposit" aria-label="Para Yatır" className="h-[40px] px-4 rounded-full bg-[#27ae60] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 flex-shrink-0" suppressHydrationWarning>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Para Yatır
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 pb-3">
          <Link href="/login" className="flex-1 h-[40px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-medium tracking-wide flex items-center justify-center" suppressHydrationWarning>
            Giriş Yap
          </Link>
          <Link href="/register" className="flex-1 h-[40px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-medium tracking-wide flex items-center justify-center" suppressHydrationWarning>
            Kayıt Ol
          </Link>
        </div>
      )}

      <div className="h-[1px] bg-border" />
    </header>

    <ConfirmDialog
      open={confirmLogout}
      title="Çıkış Yap"
      body="Hesabınızdan çıkış yapmak istediğinize emin misiniz?"
      confirmLabel="Çıkış Yap"
      onConfirm={() => { setConfirmLogout(false); logout() }}
      onCancel={() => setConfirmLogout(false)}
    />
    </>
  )
}
