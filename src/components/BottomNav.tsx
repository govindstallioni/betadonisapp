'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

// ── Bottom nav items ───────────────────────────────────────────

const navItems = [
  {
    label: 'KEŞFET',
    href: '/',
    icon: (active: boolean) => (
      // Home icon
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#737B8C'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 3l9 9" />
        <path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    label: 'CANLI',
    href: '/live',
    icon: (active: boolean) => (
      // Play button with live dot
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.5" stroke={active ? '#fff' : '#737B8C'} strokeWidth="1.6" />
        <polygon points="10,8.5 16.5,12 10,15.5" fill={active ? '#fff' : '#737B8C'} />
        <circle cx="18" cy="6" r="3" fill="#e74c3c" />
      </svg>
    ),
  },
  {
    label: 'KUPON',
    href: '#',
    icon: (_active: boolean) => (
      <img src="/icons/coupon.png" alt="Kupon" width={20} height={20} style={{ objectFit: 'contain', transform: 'rotate(120deg)' }} />
    ),
  },
  {
    label: 'Geçmiş',
    href: '/history',
    icon: (active: boolean) => (
      // Clock / history icon
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#737B8C'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 15" />
      </svg>
    ),
  },
  {
    label: 'Menü',
    href: '#menu',
    icon: (active: boolean) => (
      // Grid / dots menu
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#fff' : '#737B8C'}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
]

// ── Menu tab data ──────────────────────────────────────────────

const menuTabs = [
  { label: 'Top', icon: '/icons/top.svg' },
  { label: 'Sporlar', icon: '/icons/sporlar.svg' },
]

// TOP tab items — same as home screen
const topItems = [
  { title: 'ŞAMPİYONLAR LİGİ', count: 48, image: '/events/champions-league.png', color: '#1a56db', bg: 'transparent', type: 'cup' },
  { title: 'Avrupa Ligi', count: 32, image: '/events/europa-league.png', color: '#f59e0b', bg: '#fffbeb', type: 'cup' },
  { title: 'Türkiye Süper Ligi', count: 44, image: '/events/turkey-league.png', color: '#e11d48', bg: '#fff1f2', type: 'league' },
  { title: 'Almanya Bundesliga', count: 36, image: '/events/champions-league.png', color: '#dc2626', bg: '#fef2f2', type: 'league' },
  { title: 'İngiltere Premier Ligi', count: 52, image: '/events/europa-league.png', color: '#7c3aed', bg: '#f5f3ff', type: 'league' },
  { title: 'İspanya La Liga', count: 40, image: '/events/turkey-league.png', color: '#ea580c', bg: '#fff7ed', type: 'league' },
]

function getTopItemHref(item: typeof topItems[0]) {
  if (item.type === 'cup') return `/event?title=${encodeURIComponent(item.title)}&color=${encodeURIComponent(item.color)}`
  return `/league?title=${encodeURIComponent(item.title)}&color=${encodeURIComponent(item.color)}`
}

const topChunks: (typeof topItems)[] = []
for (let c = 0; c < topItems.length; c += 3) {
  topChunks.push(topItems.slice(c, c + 3))
}

// Spor tab items
const sporItems = [
  { title: 'CANLI BAHİS', desc: 'Canlı etkinliklere bahis yapın', href: '/live', color: '#0E8FCF', icon: (
    <img src="/icons/livebetting.svg" alt="Canlı Bahis" width={22} height={22} style={{ objectFit: 'contain' }} />
  ) },
  { title: 'Maç Öncesi', desc: 'Yaklaşan etkinliklere bahis yapın', href: '/prematch', color: '#0E8FCF', icon: (
    <img src="/icons/calendar.svg" alt="Maç Öncesi" width={22} height={22} style={{ objectFit: 'contain' }} />
  ) },
  { title: 'Günün Kombinesi', desc: 'Kazançlı bahislere bahis yapın', href: '#', color: '#0E8FCF', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
  ) },
  { title: 'Canlı Yayın', desc: 'Canlı oynanan bahis oyunları', href: '#', color: '#0E8FCF', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  ) },
  { title: 'SANAL BAHİS', desc: 'En iyi sanal bahis etkinlikleri', href: '#', color: '#0E8FCF', icon: (
    <img src="/icons/vr-glasses.svg" alt="Sanal Bahis" width={22} height={22} style={{ objectFit: 'contain' }} />
  ) },
]

// ── Component ──────────────────────────────────────────────────

export default function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenuTab, setActiveMenuTab] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('menu=open')) {
      setMenuOpen(true)
      window.history.replaceState({}, '', pathname)
    }
  }, [pathname])

  const getActiveIndex = () => {
    if (pathname === '/') return 0
    if (pathname === '/live') return 1
    if (pathname === '/history') return 3
    return -1
  }

  const activeIndex = getActiveIndex()

  const handleNavClick = (i: number) => {
    if (i === 4) {
      setMenuOpen(!menuOpen)
    } else {
      setMenuOpen(false)
    }
  }

  const navigateFromMenu = (href: string) => {
    setMenuOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* ── Full-screen menu ── */}
      <div
        className={`fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[60] transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-[#f5f7fa]" />
        <div className={`relative h-full flex flex-col transition-transform duration-300 ${menuOpen ? 'translate-y-0' : 'translate-y-8'}`}>

          {/* Header */}
          <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setMenuOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h2 className="text-[16px] font-bold text-[#1a2332]">Menü</h2>
              <button onClick={() => router.push('/settings')} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-3 mb-4">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 h-[40px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center">
                Giriş Yap
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 h-[40px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-semibold flex items-center justify-center">
                Kayıt Ol
              </Link>
            </div>

            {/* Category tabs */}
            <div className="flex items-center justify-between">
              {menuTabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveMenuTab(i)}
                  className="flex flex-col items-center gap-[5px] flex-1 py-1"
                >
                  <img src={tab.icon} alt={tab.label} className="w-[24px] h-[24px] object-contain" />
                  <span className={`text-[10px] font-medium leading-none ${activeMenuTab === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{tab.label}</span>
                  {activeMenuTab === i && <span className="w-full h-[2px] bg-[#0E8FCF] rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28">

            {/* ── TOP tab ── */}
            {activeMenuTab === 0 && (
              <div className="flex flex-col gap-3">
                {/* League slider — 3 per slide */}
                <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
                  {topChunks.map((chunk, ci) => (
                    <div key={ci} className="flex-shrink-0 w-[95%] flex flex-col gap-[6px]">
                      {chunk.map((item) => (
                        <button
                          key={item.title}
                          onClick={() => navigateFromMenu(getTopItemHref(item))}
                          className="flex items-center gap-2.5 bg-white rounded-xl px-2.5 py-2 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden shadow-sm text-left"
                        >
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-full" />
                          </div>
                          <div className="flex-1 flex items-center gap-[6px]">
                            <span className="text-[11px] font-medium text-[#1a2332]">{item.title}</span>
                            <span className="text-[9px] bg-[#edf5ff] text-[#0E8FCF] rounded-full px-[6px] py-[2px] leading-none font-bold">{item.count}</span>
                          </div>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ backgroundColor: item.color }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </div>
                          <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                            <svg width="112" height="100%" viewBox="0 0 112 52" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                              <path d="M50,0 C40,8 35,18 30,26 C25,34 20,44 15,52 L112,52 L112,0 Z" fill={item.color} opacity="0.06" />
                              <path d="M70,0 C62,8 55,18 50,26 C45,34 38,44 32,52 L112,52 L112,0 Z" fill={item.color} opacity="0.15" />
                              <path d="M90,0 C82,8 76,18 72,26 C68,34 60,44 55,52 L112,52 L112,0 Z" fill={item.color} opacity="0.28" />
                              <path d="M105,0 C100,10 96,20 93,30 C90,40 85,46 80,52 L112,52 L112,0 Z" fill={item.color} opacity="0.4" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Promosyonlar banner */}
                <div
                  onClick={() => navigateFromMenu('#')}
                  className="rounded-xl overflow-hidden cursor-pointer relative bg-gradient-to-r from-[#0E8FCF] to-[#2da8e6] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-white leading-tight">Promosyonlar</p>
                      <p className="text-[10px] text-white/70 mt-[2px]">Hergün Kazanmak için Şans Çarkı Aktif</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>

                {/* Ortaklık */}
                <button
                  onClick={() => navigateFromMenu('#')}
                  className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 border border-[#e8ecf1] hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-[#27ae60]/10 flex items-center justify-center flex-shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#27ae60">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">Ortaklık</p>
                    <p className="text-[9px] text-[#737B8C] mt-[2px]">Sitemizdeki oyuncular ile para kazanın</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                {/* Müşteri Hizmetleri */}
                <div className="mt-2 p-3.5 rounded-xl bg-[#0E8FCF]/10 border border-[#0E8FCF]/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#0E8FCF]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[12px] font-bold text-[#1a2332] leading-tight">Müşteri Hizmetleri</p>
                    <p className="text-[9px] text-[#737B8C] mt-[2px]">Bizimle iletişime geçin, size yardımcı olalım.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Sporlar tab ── */}
            {activeMenuTab === 1 && (
              <div className="flex flex-col gap-[8px]">
                {sporItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigateFromMenu(item.href)}
                    className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 border border-[#e8ecf1] hover:shadow-sm transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 [&>svg]:w-[20px] [&>svg]:h-[20px]" style={{ backgroundColor: item.color }}>
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
            )}

          </div>
        </div>
      </div>

      {/* ── Bottom navigation bar ── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
        <div className="bg-white shadow-[0_-2px_16px_rgba(0,0,0,0.08)] border-t border-[#e8ecf1]/60">
          <div className="flex items-end justify-around px-1 pt-1 pb-2">
            {navItems.map((item, i) => {
              const isCenter = i === 2
              const isActive = i === 4 ? menuOpen : i === activeIndex && !menuOpen
              const navContent = (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(i)}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    isCenter ? 'relative -mt-5' : 'gap-[2px] pt-1'
                  }`}
                >
                  {isCenter ? (
                    <>
                      <div className="w-[52px] h-[52px] rounded-full bg-[#0E8FCF] flex items-center justify-center shadow-[0_4px_12px_rgba(14,143,207,0.4)]">
                        {item.icon(true)}
                      </div>
                      <span className="text-[9px] leading-none mt-[2px] text-[#0E8FCF] font-bold">
                        {item.label}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-[28px] h-[28px] flex items-center justify-center">
                        {item.icon(false)}
                      </div>
                      <span
                        className={`text-[9px] leading-none transition-all duration-300 ${
                          isActive ? 'text-[#0E8FCF] font-bold' : 'text-[#8e9bae] font-medium'
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </button>
              )

              if (i === 4) {
                return <span key={item.label}>{navContent}</span>
              }

              if (i === 2) {
                return (
                  <Link key={item.label} href="/kupon">
                    {navContent}
                  </Link>
                )
              }

              return (
                <Link key={item.label} href={item.href}>
                  {navContent}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
