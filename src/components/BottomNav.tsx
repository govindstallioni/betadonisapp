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
      <svg width="20" height="20" viewBox="0 0 24 24">
        <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 2)">
          <polygon points="6.27 12.952 7.863 7.863 12.952 6.27 11.359 11.359" fill={active ? '#fff' : 'none'} stroke={active ? '#fff' : '#737B8C'} strokeWidth="1.5" />
          <circle cx="9.611" cy="9.611" r="9.611" fill="none" stroke={active ? '#fff' : '#737B8C'} strokeWidth="1.5" />
        </g>
      </svg>
    ),
  },
  {
    label: 'CANLI',
    href: '/live',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 128 128" fill={active ? '#fff' : '#737B8C'}>
        <path d="M64,48c-8.82,0-16,7.18-16,16s7.18,16,16,16s16-7.18,16-16S72.82,48,64,48z M64,72c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S68.41,72,64,72z M30.83,97.17c1.56,1.56,1.56,4.09,0,5.66c-0.78,0.78-1.8,1.17-2.83,1.17s-2.05-0.39-2.83-1.17C14.8,92.46,9.09,78.67,9.09,64s5.71-28.46,16.08-38.83c1.56-1.56,4.1-1.56,5.66,0c1.56,1.56,1.56,4.09,0,5.66C12.54,49.12,12.54,78.88,30.83,97.17z M44.83,44.83c-10.57,10.57-10.57,27.77,0,38.34c1.56,1.56,1.56,4.09,0,5.66C44.05,89.61,43.02,90,42,90s-2.05-0.39-2.83-1.17c-13.69-13.69-13.69-35.97,0-49.66c1.56-1.56,4.1-1.56,5.66,0C46.39,40.73,46.39,43.27,44.83,44.83z" />
      </svg>
    ),
  },
  {
    label: 'KUPON',
    href: '#',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 25 25" fill={active ? '#fff' : '#737B8C'} fillRule="evenodd" style={{ transform: 'rotate(225deg)' }}>
        <path d="M15.4260044,2 L18.9974329,2 C19.5497177,2 19.9974329,2.44771525 19.9974329,3 L19.9974329,12.34 L19.9974329,22 C19.9974329,22.5522847 19.5497177,23 18.9974329,23 L15.4260044,23 C15.4260044,21.3431458 14.0828586,20 12.4260044,20 C10.7691501,20 9.42600437,21.3431458 9.42600437,23 L6,23 C5.44771525,23 5,22.5522847 5,22 C5,21.9991454 5.0000011,21.9982908 5.00000329,21.9974362 L5.0244807,12.45 L5.00002795,3.00258829 C4.99859847,2.45030539 5.4451534,2.00143282 5.9974363,2.00000335 C5.99829907,2.00000112 5.99916183,2 6.0000246,2 L9.42600437,2 C9.42600437,3.65685425 10.7691501,5 12.4260044,5 C14.0828586,5 15.4260044,3.65685425 15.4260044,2 Z" />
      </svg>
    ),
  },
  {
    label: 'Geçmiş',
    href: '/history',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 4.233 4.233">
        <g transform="matrix(.9291 0 0 .9291 -17.842 -2.3)">
          <path fill="none" stroke={active ? '#fff' : '#737B8C'} strokeLinecap="round" strokeLinejoin="round" d="M 20.024199,3.6070661 A 1.8520832,1.8520832 0 0 1 22.367615,3.1255956 1.8520832,1.8520832 0 0 1 23.230813,5.3568064 1.8520832,1.8520832 0 0 1 21.173521,6.5778561 1.8520832,1.8520832 0 0 1 19.628393,4.7513866" strokeWidth=".285" />
          <path fill="none" stroke={active ? '#fff' : '#737B8C'} strokeLinecap="round" strokeLinejoin="round" d="M21.393658 4.1139613v.877204h.783213M20.024199 2.9017046V3.6070661M20.729561 3.6070661H20.024199" strokeWidth=".285" />
        </g>
      </svg>
    ),
  },
  {
    label: 'Menü',
    href: '#menu',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#fff' : '#737B8C'}>
        <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" />
      </svg>
    ),
  },
]

// ── Menu tab data ──────────────────────────────────────────────

const menuTabs = [
  { label: 'Top', icon: '/icons/top.svg' },
  { label: 'Sporlar', icon: '/icons/sporlar.svg' },
  { label: 'Casino', icon: '/icons/casino.svg' },
  { label: '1xOyunlar', icon: '/icons/slotlar.svg' },
  { label: 'Diğer', icon: '/icons/digerleri.svg' },
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
  { title: 'CANLI BAHİS', desc: 'Canlı etkinliklere bahis yapın', href: '/live', color: '#0E8FCF', icon: <svg width="22" height="22" viewBox="0 0 128 128" fill="#fff"><path d="M64,48c-8.82,0-16,7.18-16,16s7.18,16,16,16s16-7.18,16-16S72.82,48,64,48z M64,72c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S68.41,72,64,72z M30.83,97.17c1.56,1.56,1.56,4.09,0,5.66c-0.78,0.78-1.8,1.17-2.83,1.17s-2.05-0.39-2.83-1.17C14.8,92.46,9.09,78.67,9.09,64s5.71-28.46,16.08-38.83c1.56-1.56,4.1-1.56,5.66,0c1.56,1.56,1.56,4.09,0,5.66C12.54,49.12,12.54,78.88,30.83,97.17z M44.83,44.83c-10.57,10.57-10.57,27.77,0,38.34c1.56,1.56,1.56,4.09,0,5.66C44.05,89.61,43.02,90,42,90s-2.05-0.39-2.83-1.17c-13.69-13.69-13.69-35.97,0-49.66c1.56-1.56,4.1-1.56,5.66,0C46.39,40.73,46.39,43.27,44.83,44.83z" /></svg> },
  { title: 'Maç Öncesi', desc: 'Yaklaşan etkinliklere bahis yapın', href: '/prematch', color: '#0E8FCF', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg> },
  { title: 'Günün Kombinesi', desc: 'Kazançlı bahislere bahis yapın', href: '#', color: '#27ae60', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg> },
  { title: 'Canlı Yayın', desc: 'Canlı oynanan bahis oyunları', href: '#', color: '#e74c3c', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3" /></svg> },
  { title: 'SANAL BAHİS', desc: 'En iyi sanal bahis etkinlikleri', href: '#', color: '#8b5cf6', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z" /></svg> },
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

            {/* ── Casino tab ── */}
            {activeMenuTab === 2 && (
              <div className="flex flex-col gap-[8px]">
                {[
                  { title: 'SLOTLAR', desc: 'En iyi slot oyunları', href: '/slots', color: '#f59e0b' },
                  { title: 'CANLI CASİNO', desc: 'Kendinizi casinodaymış gibi hissedin', href: '/live-casino', color: '#8b5cf6' },
                  { title: 'CANLI OYUNLAR', desc: 'Size özel canlı oyunlar ile kazan', href: '#', color: '#0E8FCF' },
                  { title: 'POKER', desc: 'Özel poker tavla okey canlı oyunlar', href: '#', color: '#e74c3c' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigateFromMenu(item.href)}
                    className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 border border-[#e8ecf1] hover:shadow-sm transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z" /></svg>
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

            {/* ── 1xOyunlar tab ── */}
            {activeMenuTab === 3 && (
              <div className="flex flex-col gap-[8px]">
                {[
                  { title: 'GOLDEN RACE', desc: 'Canlı oyunlar ile başla, hemen kazan', href: '#', color: '#f59e0b' },
                  { title: 'ŞANS ÇARKI', desc: 'Ücretsiz çevirme hakkı ile her gün kazan!', href: '#', color: '#0E8FCF' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigateFromMenu(item.href)}
                    className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 border border-[#e8ecf1] hover:shadow-sm transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z" /></svg>
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

            {/* ── Diğer tab ── */}
            {activeMenuTab === 4 && (
              <div className="flex flex-col gap-[8px]">
                {[
                  { title: 'Ortaklık', desc: 'Sitemizdeki oyuncular ile para kazanın', href: '#', color: '#27ae60' },
                  { title: 'Müşteri Hizmetleri', desc: 'Bizimle iletişime geçin', href: '#', color: '#0E8FCF' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigateFromMenu(item.href)}
                    className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 border border-[#e8ecf1] hover:shadow-sm transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" /></svg>
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

              if (i === 4 || i === 2) {
                return <span key={item.label}>{navContent}</span>
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
