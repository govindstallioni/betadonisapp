'use client'

import { useState } from 'react'
import { useAdc } from './AdcProvider'
import { fmtAdc } from '@/data/adc'
import { ESPORTS_HREF } from '@/data/esports'

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
// Slot machine: cabinet, three-reel window, pull lever
export const iSlots = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 6V4.5A1.5 1.5 0 0 1 6.5 3h8A1.5 1.5 0 0 1 16 4.5V6" /><rect x="3" y="6" width="15" height="15" rx="2" /><rect x="5.5" y="9" width="10" height="6" rx="1" /><path d="M8.83 9v6M12.17 9v6M7 18h7M18 16h1a2 2 0 0 0 2-2V9" /><circle cx="21" cy="7" r="1.5" fill="#fff" /></svg>
const iChip = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.4" /><path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5" strokeLinecap="round" /></svg>
const iCasino = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM11 8.5A1.5 1.5 0 1 1 8 8.5a1.5 1.5 0 0 1 3 0zm1 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-.5-6.5A1.5 1.5 0 1 1 16 8.5a1.5 1.5 0 0 1-.5-1z" /></svg>
const iPoker = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C9 6.5 5 9.5 5 13.5 5 17 8 19 12 19s7-2 7-5.5C19 9.5 15 6.5 12 2zm-1 19h2l-.5-3h-1L11 21z" /></svg>
const iDice = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 3.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 3.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg>
const iHorse = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M19 3l-1.4 1.4c.9.9 1.4 2.1 1.4 3.6 0 1.8-.9 3.4-2.3 4.4L14 10l-2 5-5 2 1-4-4-2 6-3 3-3c1-1 2.4-1.6 3.9-1.6 1.5 0 2.8.5 3.7 1.4L21 1l-2 2zM5 20h14v2H5v-2z" /></svg>
export const iWheel = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" fill="#fff" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2" /></svg>
const iPartner = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
const iPromo = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
const iAdc = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14.6l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0 0 20.05 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.13 0-.23-.11-.22-.24z" /></svg>
const iHelp = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 4.9.75c0 1.66-2.4 1.9-2.4 3.5" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
const iEsports = <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.5 7h-11C4.57 7 3 8.57 3 10.5v3C3 15.43 4.57 17 6.5 17c1.1 0 2.09-.5 2.75-1.3L10.5 14h3l1.25 1.7c.66.8 1.65 1.3 2.75 1.3 1.93 0 3.5-1.57 3.5-3.5v-3C21 8.57 19.43 7 17.5 7zM9 12H7.5v1.5h-1V12H5v-1h1.5V9.5h1V11H9v1zm5.5-.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm2 2a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm0-3.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm2 1.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" /></svg>

// ── Decorative right-edge visuals for the featured cards (task 24: "the icon
// is on the left, a relevant visual on the right side ... the visual should
// overflow/be cut off at the edge", matching menu6.png's bleeding illustration).
// Each card clips with overflow-hidden, so positioning these partly past the
// card's own right edge is what produces the "taşmış" cut-off look.
const vAdc = (
  <svg width="104" height="104" viewBox="0 0 104 104" fill="none" className="absolute -right-4 -bottom-5 opacity-90 pointer-events-none">
    <circle cx="40" cy="64" r="30" fill="#fff" fillOpacity="0.14" />
    <circle cx="62" cy="38" r="34" fill="#fff" fillOpacity="0.22" />
    <circle cx="62" cy="38" r="26" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
    <text x="62" y="47" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#fff" fillOpacity="0.85">₳</text>
  </svg>
)
const vPromo = (
  <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="absolute -right-3 -bottom-4 opacity-90 pointer-events-none">
    <circle cx="55" cy="55" r="46" fill="#fff" fillOpacity="0.12" />
    <g transform="translate(28,34) rotate(-18)">
      <path d="M0 10 L26 2 V28 L0 20 Z" fill="#fff" fillOpacity="0.9" />
      <rect x="-7" y="10" width="7" height="10" rx="2" fill="#fff" fillOpacity="0.9" />
      <path d="M26 2 L42 -6 V36 L26 28 Z" fill="#fff" fillOpacity="0.55" />
      <circle cx="6" cy="34" r="2.4" fill="#fff" fillOpacity="0.8" />
      <circle cx="14" cy="38" r="2" fill="#fff" fillOpacity="0.6" />
      <circle cx="-2" cy="40" r="1.6" fill="#fff" fillOpacity="0.7" />
    </g>
  </svg>
)
const vLive = (
  <svg width="108" height="108" viewBox="0 0 108 108" fill="none" className="absolute -right-4 -bottom-5 opacity-90 pointer-events-none">
    <circle cx="54" cy="54" r="44" fill="#fff" fillOpacity="0.12" />
    <circle cx="48" cy="48" r="13" fill="#fff" fillOpacity="0.85" />
    <path d="M48 36c3 4 3 22 0 26M38 40c2 3 2 16 0 19M58 40c2 3 2 16 0 19" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" fill="none" />
    <circle cx="80" cy="30" r="5" fill="#fff" fillOpacity="0.5" />
    <circle cx="86" cy="70" r="4" fill="#fff" fillOpacity="0.35" />
  </svg>
)
const vVirtual = (
  <svg width="108" height="108" viewBox="0 0 108 108" fill="none" className="absolute -right-4 -bottom-5 opacity-90 pointer-events-none">
    <circle cx="54" cy="54" r="44" fill="#fff" fillOpacity="0.12" />
    <rect x="26" y="42" width="56" height="30" rx="14" fill="#fff" fillOpacity="0.85" />
    <circle cx="42" cy="57" r="6" fill="#7c3aed" />
    <circle cx="66" cy="57" r="6" fill="#7c3aed" />
    <rect x="48" y="52" width="12" height="4" rx="2" fill="#7c3aed" />
  </svg>
)
const vEsports = (
  <svg width="108" height="108" viewBox="0 0 108 108" fill="none" className="absolute -right-4 -bottom-5 opacity-90 pointer-events-none">
    <circle cx="54" cy="54" r="44" fill="#fff" fillOpacity="0.12" />
    <rect x="22" y="44" width="64" height="30" rx="15" fill="#fff" fillOpacity="0.85" />
    <rect x="35" y="55" width="12" height="4" rx="2" fill="#1a2332" />
    <rect x="39" y="51" width="4" height="12" rx="2" fill="#1a2332" />
    <circle cx="65" cy="54" r="3.5" fill="#1a2332" />
    <circle cx="74" cy="60" r="3.5" fill="#1a2332" />
  </svg>
)

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
  /** Visually featured row (gradient card instead of plain white), like the
   *  client's reference for the Adonis Coin entry (adoniscoins.png) — and,
   *  per task 24, Promosyonlar, Live/Virtual Betting and E-Spor. */
  featured?: boolean
  /** Tailwind gradient stops for a featured card; falls back to the cyan
   *  Adonis Coin gradient when a featured item doesn't set its own. */
  gradient?: string
  /** Decorative illustration bled off the card's right edge (task 24). */
  visual?: React.ReactNode
  /** When set, the row's desc is live and read from state at render time
   *  rather than taken from this static list. */
  live?: 'adc'
}

// Adonis Coin Kodları and Promosyonlar sit right above CANLI BAHİS (task 24);
// Live Betting, Virtual Betting and the new E-Spor entry share the same
// featured-card-with-bleeding-visual styling but keep their own position.
export const digerleriItems: DigerleriItem[] = [
  { title: 'Adonis Coin Kodları', desc: 'Promosyon Puanları: 0 ADC PUAN', href: '/adonis-coin', color: '#0891b2', icon: iAdc, featured: true, gradient: 'from-[#0891b2] to-[#0e7490]', visual: vAdc, live: 'adc' },
  { title: 'Promosyonlar', desc: 'Güncel bonuslar ve özel kampanyaları keşfedin', href: '/promosyonlar', color: '#0E8FCF', icon: iPromo, featured: true, gradient: 'from-[#f59e0b] to-[#d97706]', visual: vPromo },
  { title: 'CANLI BAHİS', desc: 'Canlı maçlarda yüksek oranlarla kazanın', href: '/live', color: '#0E8FCF', icon: iLive, featured: true, gradient: 'from-[#0E8FCF] to-[#0a5f8a]', visual: vLive },
  { title: 'Maç öncesi', desc: 'Yaklaşan etkinliklere bahis yapın', href: '/prematch', color: '#0E8FCF', icon: iCalendar },
  { title: 'E-Spor', desc: 'Popüler e-spor liglerine bahis yapın', href: ESPORTS_HREF, color: '#16a34a', icon: iEsports, featured: true, gradient: 'from-[#16a34a] to-[#15803d]', visual: vEsports },
  { title: 'Günün Kombinesi', desc: 'Kazanç potansiyeli yüksek hazır kombineler', href: '/kupon/accumulator', color: '#27ae60', icon: iCombo },
  { title: 'Canlı Yayınlar', desc: 'Bahislerinizi canlı izlerken oynayın', href: '/live?stream=1', color: '#e74c3c', icon: iStream },
  { title: 'SANAL BAHİS', desc: 'En iyi sanal bahis etkinlikleri', href: '/sanal-bahis', color: '#7c3aed', icon: iVirtual, featured: true, gradient: 'from-[#7c3aed] to-[#5b21b6]', visual: vVirtual },
  { title: 'Slot Oyunları', desc: 'En iyi slot oyunları', href: '/slots', color: '#ea580c', icon: iSlots },
  { title: 'Casino', desc: 'Slot, crash ve şans oyunları bir arada', color: '#6d28d9', icon: iChip, children: casinoChildren },
  { title: 'Canlı Casino', desc: 'Kendinizi casinodaymış gibi hissedin', href: '/live-casino', color: '#c026d3', icon: iCasino },
  { title: 'Poker', desc: 'Şans değil, tamamen strateji', href: '/poker', color: '#1a2332', icon: iPoker },
  { title: 'Canlı Oyunlar', desc: 'Her saniye yeni kazanç', href: '/live-casino', color: '#0891b2', icon: iDice },
  { title: 'Golden Race', desc: 'Kazanırken eğlenmek, kontrol sende', href: '/golden-race', color: '#d97706', icon: iHorse },
  { title: 'Şans Çarkı', desc: 'Hergün senin için nakit ödül, boş yok', href: '/sans-carki', color: '#f59e0b', icon: iWheel },
  { title: 'Ortaklık', desc: 'Finansal ekosistemin ortağı ol', href: '/ortaklik', color: '#27ae60', icon: iPartner },
  { title: 'Yardım ve Destek', desc: 'SSS, canlı destek, iletişim ve şikayet', href: '/yardim', color: '#0E8FCF', icon: iHelp },
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
  const { loaded, available } = useAdc()

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

        const desc = item.live === 'adc'
          ? `Promosyon Puanları: ${loaded ? fmtAdc(available) : 0} ADC PUAN`
          : item.desc

        return (
          <button
            key={item.title}
            onClick={() => onNavigate(item.href!)}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-3 border transition-colors w-full ${
              item.featured
                ? `overflow-hidden border-transparent bg-gradient-to-r ${item.gradient ?? 'from-[#0891b2] to-[#0e7490]'} active:scale-[0.99]`
                : 'bg-white border-[#e8ecf1] hover:bg-[#f8fafc]'
            }`}
          >
            {item.featured && item.visual}
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: item.featured ? 'rgba(255,255,255,0.2)' : item.color }}
            >
              {item.icon}
            </div>
            <div className={`relative flex-1 text-left min-w-0 ${item.featured ? 'pr-11' : ''}`}>
              <p className={`text-[12px] font-semibold leading-tight ${item.featured ? 'text-white' : 'text-[#1a2332]'}`}>{item.title}</p>
              <p className={`text-[9px] mt-[2px] ${item.featured ? 'text-white/75' : 'text-[#737B8C]'}`}>{desc}</p>
            </div>
            {!item.featured && <Chevron />}
          </button>
        )
      })}
    </div>
  )
}
