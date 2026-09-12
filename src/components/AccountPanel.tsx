'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { useAccountPanel } from './AccountPanelProvider'
import ConfirmDialog from './ConfirmDialog'

// ── Icons (mirrors BottomNav.tsx's account-row idiom: currentColor stroke) ──
const iLimit = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>
const iProfile = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
const iHistory = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></svg>
const iBonus = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /><path d="M12 8C12 5 10 3 8 3a2.5 2.5 0 0 0 0 5M12 8c0-3 2-5 4-5a2.5 2.5 0 0 1 0 5" /></svg>
const iMessage = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></svg>
const iTicket = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2z" /><path d="M13 5v14" strokeDasharray="2 2" /></svg>
const iUpload = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
const iBell = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
const iPhone = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
const iLogout = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>

const accountActions = [
  { title: 'LİMİT BELİRLEME', desc: 'Limitlerinizi belirleyin veya hesabınızı kapatın', href: '/hesap/limitler', icon: iLimit },
  { title: 'PROFİL BİLGİLERİ', desc: 'Şifrenizi yenileyin ve bilgilerinizi güncelleyin', href: '/hesap/profil', icon: iProfile },
  { title: 'HAREKETLER', desc: 'Tüm oyun ve finansal hareketlerinizi inceleyin', href: '/history', icon: iHistory },
  { title: 'BONUSLAR', desc: 'Aktif ve geçmiş bonuslarınızı kontrol edin', href: '/hesap/bonuslar', icon: iBonus },
  { title: 'MESAJLAR', desc: 'Yeni mesaj gönderin ve gelen yanıtları inceleyin', href: '/hesap/mesajlar', icon: iMessage },
  { title: 'KUPONLARIM', desc: 'Kazanan ve bekleyen kuponları inceleyin', href: '/kupon', icon: iTicket },
  { title: 'BELGE YÜKLEME', desc: 'Hesap doğrulama belgelerinizi yükleyin', href: '/hesap/belgeler', icon: iUpload },
  { title: 'Bildirimler', desc: 'Bildirimlerini açtığınız etkinlikleri görün', href: '/hesap/bildirimler', icon: iBell },
  { title: 'SİZİ ARAYALIM', desc: 'Numaranızı bırakın, müşteri temsilcimiz sizi arasın', href: '/hesap/sizi-arayalim', icon: iPhone },
]

const fmt = (n: number) => `${n.toFixed(2)} TRY`

export default function AccountPanel() {
  const { isOpen, close } = useAccountPanel()
  const { isLoggedIn, username, balance, logout } = useAuth()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const router = useRouter()

  if (!isOpen) return null

  const go = (href: string) => {
    close()
    router.push(href)
  }

  const doLogout = () => {
    setConfirmLogout(false)
    close()
    logout()
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={close} className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/45 z-[90]" />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[95] bg-[#edf1f7] rounded-t-2xl animate-slide-up flex flex-col" style={{ maxHeight: '88vh' }}>

        {/* Header */}
        <div className="bg-white rounded-t-2xl px-4 pt-3 pb-3 border-b border-[#e8ecf1] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#edf5ff] flex items-center justify-center text-[#0E8FCF]">{iProfile}</span>
              <h3 className="text-[15px] font-bold text-[#1a2332]">{isLoggedIn ? (username || 'Hesabım') : 'Hesabım'}</h3>
            </div>
            <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f1f5f9]" aria-label="Kapat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6">
          {isLoggedIn ? (
            <div className="flex flex-col gap-3">
              {/* Balance card — deposit/withdraw visible at the top */}
              <div className="bg-white rounded-xl border border-[#e8ecf1] px-4 py-3.5">
                <div className="flex items-center gap-2.5 mb-3">
                  <Link href="/kupon/withdraw" onClick={close} className="flex-1 h-[38px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                    Para Çekme
                  </Link>
                  <Link href="/kupon/deposit" onClick={close} className="flex-1 h-[38px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                    Para Yatırma
                  </Link>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[12px] font-semibold text-[#1a2332]">Çekilebilir Tutar:</span>
                  <span className="text-[12px] font-bold text-[#0E8FCF]">{fmt(balance.withdrawable)}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[12px] font-semibold text-[#1a2332]">Bonus Tutarı:</span>
                  <span className="text-[12px] font-bold text-[#1a2332]">{fmt(balance.bonus)}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[12px] font-semibold text-[#1a2332]">Bonuslarda Kilitlenmiş:</span>
                  <span className="text-[12px] font-bold text-[#1a2332]">{fmt(balance.locked)}</span>
                </div>
                <div className="h-px bg-[#eef1f5] my-1.5" />
                <div className="flex items-center justify-between py-1">
                  <span className="text-[13px] font-bold text-[#1a2332]">Toplam:</span>
                  <span className="text-[13px] font-bold text-[#0E8FCF]">{fmt(balance.total)}</span>
                </div>
              </div>

              {/* Account actions */}
              <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
                {accountActions.map((item, idx) => (
                  <button
                    key={item.title}
                    onClick={() => go(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#f8fafc] transition-colors ${idx < accountActions.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0 text-[#0E8FCF]">
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">{item.title}</p>
                      <p className="text-[9px] text-[#737B8C] mt-[2px]">{item.desc}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* ÇIKIŞ */}
              <button
                onClick={() => setConfirmLogout(true)}
                className="w-full h-[46px] rounded-xl border border-[#e8ecf1] bg-white text-[#e74c3c] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#fef2f2] transition-colors"
              >
                <span className="text-[#e74c3c]">{iLogout}</span>
                ÇIKIŞ
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-[#0E8FCF] to-[#2da8e6] rounded-xl px-4 py-4">
              <p className="text-[13px] font-bold text-white leading-tight">Hesabınıza giriş yapın</p>
              <p className="text-[10px] text-white/80 mt-1 mb-3">Bakiyenizi, kuponlarınızı ve bonuslarınızı görmek için giriş yapın.</p>
              <div className="flex items-center gap-2.5">
                <Link href="/login" onClick={close} className="flex-1 h-[38px] rounded-full bg-white text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center">Giriş Yap</Link>
                <Link href="/register" onClick={close} className="flex-1 h-[38px] rounded-full bg-white/15 border border-white/40 text-white text-[12px] font-semibold flex items-center justify-center">Kayıt Ol</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Çıkış Yap"
        body="Hesabınızdan çıkış yapmak istediğinize emin misiniz?"
        confirmLabel="Çıkış Yap"
        onConfirm={doLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  )
}
