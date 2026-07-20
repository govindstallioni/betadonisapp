'use client'

import { useState } from 'react'

// ── Shared, canonical "Diğerleri" navigation list ──────────────────────────
// One source of truth rendered by BOTH the /digerleri page (DigerleriScreen)
// and the BottomNav "Menü" overlay's Diğerleri tab, so the two can't drift.
// Order + copy mirror Betadonis mobile (menu1.png).

// Generic launcher for casino mini-games (reuses /game).
const gameHref = (name: string, img = '/spotlight/1.png') =>
  `/game?${new URLSearchParams({ name, img, provider: 'Betadonis Games' }).toString()}`

// ── Icons (white glyphs on a colored rounded square, matching MenuRow) ──────
const iLive = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="3" /><path d="M7.76 16.24a6 6 0 0 1 0-8.48l-1.42-1.42a8 8 0 0 0 0 11.31l1.42-1.41zm8.48-8.48a6 6 0 0 1 0 8.48l1.42 1.42a8 8 0 0 0 0-11.31l-1.42 1.41zM4.93 19.07a10 10 0 0 1 0-14.14L3.51 3.51a12 12 0 0 0 0 16.97l1.42-1.41zm14.14-14.14a10 10 0 0 1 0 14.14l1.42 1.42a12 12 0 0 0 0-16.97l-1.42 1.41z" /></svg>
const iCalendar = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>
const iCombo = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
const iStream = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-11-2 5.5-3L10 9v6z" /></svg>
const iVirtual = <img src="/icons/vr-glasses.svg" alt="" width={22} height={22} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
const iSlots = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm-2 15H5v-3h2v3zm0-5H5v-3h2v3zm6 5h-2v-3h2v3zm0-5h-2v-3h2v3zm6 5h-2v-3h2v3zm0-5h-2v-3h2v3z" /></svg>
const iChip = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.4" /><path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5" strokeLinecap="round" /></svg>
const iCasino = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM11 8.5A1.5 1.5 0 1 1 8 8.5a1.5 1.5 0 0 1 3 0zm1 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-.5-6.5A1.5 1.5 0 1 1 16 8.5a1.5 1.5 0 0 1-.5-1z" /></svg>
const iPoker = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C9 6.5 5 9.5 5 13.5 5 17 8 19 12 19s7-2 7-5.5C19 9.5 15 6.5 12 2zm-1 19h2l-.5-3h-1L11 21z" /></svg>
const iDice = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 3.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 3.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg>
const iHorse = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M19 3l-1.4 1.4c.9.9 1.4 2.1 1.4 3.6 0 1.8-.9 3.4-2.3 4.4L14 10l-2 5-5 2 1-4-4-2 6-3 3-3c1-1 2.4-1.6 3.9-1.6 1.5 0 2.8.5 3.7 1.4L21 1l-2 2zM5 20h14v2H5v-2z" /></svg>
const iWheel = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" fill="#fff" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2" /></svg>
const iPartner = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
const iPromo = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>

// Casino sub-menu (dropdown) items.
const casinoChildren = [
  { name: 'Slot Oyunları', href: '/slots' },
  { name: 'Crash Games', href: gameHref('Crash') },
  { name: 'Chicken Road', href: gameHref('Chicken Road') },
  { name: 'Plinko', href: gameHref('Plinko') },
  { name: 'Piyango', href: gameHref('Piyango') },
  { name: 'Mines', href: gameHref('Mines') },
]

export type DigerleriItem = {
  title: string
  desc: string
  href?: string
  color: string
  icon: React.ReactNode
  children?: { name: string; href: string }[]
}

export const digerleriItems: DigerleriItem[] = [
  { title: 'CANLI BAHİS', desc: 'Canlı maçlarda yüksek oranlarla kazanın', href: '/live', color: '#0E8FCF', icon: iLive },
  { title: 'Maç öncesi', desc: 'Yaklaşan etkinliklere bahis yapın', href: '/prematch', color: '#0E8FCF', icon: iCalendar },
  { title: 'Günün Kombinesi', desc: 'Kazanç potansiyeli yüksek hazır kombineler', href: '/kupon/accumulator', color: '#27ae60', icon: iCombo },
  { title: 'Canlı Yayınlar', desc: 'Bahislerinizi canlı izlerken oynayın', href: '/live?stream=1', color: '#e74c3c', icon: iStream },
  { title: 'SANAL BAHİS', desc: 'En iyi sanal bahis etkinlikleri', href: '/sanal-bahis', color: '#7c3aed', icon: iVirtual },
  { title: 'Slot Oyunları', desc: 'En iyi slot oyunları', href: '/slots', color: '#ea580c', icon: iSlots },
  { title: 'Casino', desc: 'Slot, crash ve şans oyunları bir arada', color: '#6d28d9', icon: iChip, children: casinoChildren },
  { title: 'Canlı Casino', desc: 'Kendinizi casinodaymış gibi hissedin', href: '/live-casino', color: '#c026d3', icon: iCasino },
  { title: 'Poker', desc: 'Şans değil, tamamen strateji', href: '/poker', color: '#1a2332', icon: iPoker },
  { title: 'Canlı Oyunlar', desc: 'Her saniye yeni kazanç', href: '/live-casino', color: '#0891b2', icon: iDice },
  { title: 'Golden Race', desc: 'Kazanırken eğlenmek, kontrol sende', href: '/golden-race', color: '#d97706', icon: iHorse },
  { title: 'Şans Çarkı', desc: 'Hergün senin için nakit ödül, boş yok', href: '/sans-carki', color: '#f59e0b', icon: iWheel },
  { title: 'Ortaklık', desc: 'Finansal ekosistemin ortağı ol', href: '/bilgi/ortaklik', color: '#27ae60', icon: iPartner },
  { title: 'Promosyonlar', desc: 'Güncel bonuslar ve özel kampanyaları keşfedin', href: '/promosyonlar', color: '#0E8FCF', icon: iPromo },
]

const Chevron = ({ open }: { open?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

// ── Shared list renderer ────────────────────────────────────────────────────
export default function DigerleriMenu({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [casinoOpen, setCasinoOpen] = useState(false)

  return (
    <div className="flex flex-col gap-[8px]">
      {digerleriItems.map((item) => {
        if (item.children) {
          return (
            <div key={item.title} className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
              <button
                onClick={() => setCasinoOpen((v) => !v)}
                className="flex items-center gap-3 px-3 py-3 w-full hover:bg-[#f8fafc] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">{item.title}</p>
                  <p className="text-[9px] text-[#737B8C] mt-[2px]">{item.desc}</p>
                </div>
                <Chevron open={casinoOpen} />
              </button>
              {casinoOpen && (
                <div className="border-t border-[#f0f2f5] bg-[#f8fafc]">
                  {item.children.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => onNavigate(c.href)}
                      className="flex items-center gap-3 pl-[52px] pr-3 py-[11px] w-full hover:bg-[#eef3f8] transition-colors border-b border-[#eef1f5] last:border-b-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6d28d9] flex-shrink-0" />
                      <span className="text-[12px] font-medium text-[#1a2332] flex-1 text-left">{c.name}</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        }

        return (
          <button
            key={item.title}
            onClick={() => onNavigate(item.href!)}
            className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 border border-[#e8ecf1] hover:bg-[#f8fafc] transition-colors w-full"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">{item.title}</p>
              <p className="text-[9px] text-[#737B8C] mt-[2px]">{item.desc}</p>
            </div>
            <Chevron />
          </button>
        )
      })}
    </div>
  )
}
