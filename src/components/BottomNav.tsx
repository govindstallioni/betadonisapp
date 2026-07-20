'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { useBetSlip } from '@/components/BetSlipProvider'
import DigerleriMenu from '@/components/DigerleriMenu'

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

// ── Inline icons (match the app's hand-rolled SVG idiom) ───────

const iFlame = <svg width="24" height="24" viewBox="0 0 24 24" fill="#e8672e"><path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>
const iLive = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="3" /><path d="M7.76 16.24a6 6 0 0 1 0-8.48l-1.42-1.42a8 8 0 0 0 0 11.31l1.42-1.41zm8.48-8.48a6 6 0 0 1 0 8.48l1.42 1.42a8 8 0 0 0 0-11.31l-1.42 1.41zM4.93 19.07a10 10 0 0 1 0-14.14L3.51 3.51a12 12 0 0 0 0 16.97l1.42-1.41zm14.14-14.14a10 10 0 0 1 0 14.14l1.42 1.42a12 12 0 0 0 0-16.97l-1.42 1.41z" /></svg>
const iCalendar = <img src="/icons/calendar.svg" alt="" width={20} height={20} style={{ objectFit: 'contain' }} />
const iCombo = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
const iStream = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-11-2 5.5-3L10 9v6z" /></svg>
const iVirtual = <img src="/icons/vr-glasses.svg" alt="" width={20} height={20} style={{ objectFit: 'contain' }} />
const iSlots = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm-2 15H5v-3h2v3zm0-5H5v-3h2v3zm6 5h-2v-3h2v3zm0-5h-2v-3h2v3zm6 5h-2v-3h2v3zm0-5h-2v-3h2v3z" /></svg>
const iCasino = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM11 8.5A1.5 1.5 0 1 1 8 8.5a1.5 1.5 0 0 1 3 0zm1 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-.5-6.5A1.5 1.5 0 1 1 16 8.5a1.5 1.5 0 0 1-.5-1z" /></svg>
const iPoker = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C9 6.5 5 9.5 5 13.5 5 17 8 19 12 19s7-2 7-5.5C19 9.5 15 6.5 12 2zm-1 19h2l-.5-3h-1L11 21z" /></svg>
const iDice = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 3.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 3.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg>
const iHorse = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M19 3l-1.4 1.4c.9.9 1.4 2.1 1.4 3.6 0 1.8-.9 3.4-2.3 4.4L14 10l-2 5-5 2 1-4-4-2 6-3 3-3c1-1 2.4-1.6 3.9-1.6 1.5 0 2.8.5 3.7 1.4L21 1l-2 2zM5 20h14v2H5v-2z" /></svg>
const iWheel = <img src="/icons/top.svg" alt="" width={20} height={20} style={{ objectFit: 'contain' }} />
const iPartner = <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>

// Account (Diğerleri) icons — blue on light bg, use currentColor
const iLimit = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>
const iProfile = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
const iHistory = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></svg>
const iBonus = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /><path d="M12 8C12 5 10 3 8 3a2.5 2.5 0 0 0 0 5M12 8c0-3 2-5 4-5a2.5 2.5 0 0 1 0 5" /></svg>
const iMessage = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></svg>
const iTicket = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2z" /><path d="M13 5v14" strokeDasharray="2 2" /></svg>
const iUpload = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
const iBell = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
const iInfo = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
const iLogout = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>

// ── Menu tabs ──────────────────────────────────────────────────

const menuTabs = [
  { label: 'TREND', icon: iFlame },
  { label: 'Sporlar', icon: <img src="/icons/sporlar.svg" alt="Sporlar" className="w-[24px] h-[24px] object-contain" /> },
  { label: 'Sanal Bahis', icon: <img src="/icons/vr-glasses-blue.svg" alt="Sanal Bahis" className="w-[24px] h-[24px] object-contain" /> },
  { label: 'Canlı Casino', icon: <img src="/icons/casino.svg" alt="Canlı Casino" className="w-[24px] h-[24px] object-contain" /> },
  { label: 'Slotlar', icon: <img src="/icons/slotlar.svg" alt="Slotlar" className="w-[24px] h-[24px] object-contain" /> },
  { label: 'Diğerleri', icon: <img src="/icons/digerleri.svg" alt="Diğerleri" className="w-[24px] h-[24px] object-contain" /> },
]

// ── TREND tab items ────────────────────────────────────────────

const trendItems = [
  { title: 'CANLI BAHİS', desc: 'Canlı maçlarda yüksek oranlarla kazanın', href: '/live', color: '#0E8FCF', icon: iLive },
  { title: 'Maç Öncesi', desc: 'Yaklaşan etkinliklere bahis yapın', href: '/prematch', color: '#0E8FCF', icon: iCalendar },
  { title: 'Günün Kombinesi', desc: 'Kazanç potansiyeli yüksek hazır kombineler', href: '/kupon/accumulator', color: '#27ae60', icon: iCombo },
  { title: 'Canlı Yayınlar', desc: 'Bahislerinizi canlı izlerken oynayın', href: '/live', color: '#e74c3c', icon: iStream },
  { title: 'SANAL BAHİS', desc: 'En iyi sanal bahis etkinlikleri', href: '#', color: '#7c3aed', icon: iVirtual },
  { title: 'Slot Oyunları', desc: 'En iyi slot oyunları', href: '/slots', color: '#ea580c', icon: iSlots },
  { title: 'Canlı Casino', desc: 'Kendinizi casinodaymış gibi hissedin', href: '/live-casino', color: '#c026d3', icon: iCasino },
  { title: 'Poker', desc: 'Şans değil, tamamen strateji', href: '#', color: '#1a2332', icon: iPoker },
  { title: 'Canlı Oyunlar', desc: 'Her saniye yeni kazanç', href: '#', color: '#0891b2', icon: iDice },
  { title: 'Golden Race', desc: 'Kazanırken eğlenmek, kontrol sende', href: '#', color: '#d97706', icon: iHorse },
  { title: 'Şans Çarkı', desc: 'Hergün senin için nakit ödül, boş yok', href: '#', color: '#f59e0b', icon: iWheel },
  { title: 'Ortaklık', desc: 'Finansal ekosistemin ortağı ol', href: '/bilgi/ortaklik', color: '#27ae60', icon: iPartner },
]

// ── Sporlar tab items ──────────────────────────────────────────

const sporItems = [
  { title: 'CANLI BAHİS', desc: 'Canlı etkinliklere bahis yapın', href: '/live', color: '#0E8FCF', icon: <img src="/icons/livebetting.svg" alt="" width={22} height={22} style={{ objectFit: 'contain' }} /> },
  { title: 'Maç Öncesi', desc: 'Yaklaşan etkinliklere bahis yapın', href: '/prematch', color: '#0E8FCF', icon: <img src="/icons/calendar.svg" alt="" width={22} height={22} style={{ objectFit: 'contain' }} /> },
  { title: 'Günün Kombinesi', desc: 'Kazançlı bahislere bahis yapın', href: '/kupon/accumulator', color: '#0E8FCF', icon: iCombo },
  { title: 'Canlı Yayın', desc: 'Canlı oynanan bahis oyunları', href: '/live', color: '#0E8FCF', icon: iStream },
  { title: 'SANAL BAHİS', desc: 'En iyi sanal bahis etkinlikleri', href: '#', color: '#0E8FCF', icon: <img src="/icons/vr-glasses.svg" alt="" width={22} height={22} style={{ objectFit: 'contain' }} /> },
]

// ── Sanal Bahis tab items ──────────────────────────────────────

const sanalItems = [
  { title: 'Sanal Futbol', desc: 'Dakikada bir maç, kesintisiz bahis', href: '#', color: '#0E8FCF', icon: <img src="/icons/vrtrdrSoccer_5.png" alt="" width={22} height={22} style={{ objectFit: 'contain' }} /> },
  { title: 'Sanal Basketbol', desc: 'Hızlı tempolu sanal basketbol', href: '#', color: '#ea580c', icon: <img src="/icons/vrtrdrBasketball_5.png" alt="" width={22} height={22} style={{ objectFit: 'contain' }} /> },
  { title: 'Sanal Tenis', desc: 'Anlık sonuçlanan tenis maçları', href: '#', color: '#27ae60', icon: <img src="/icons/vrtrdrTennis_5.png" alt="" width={22} height={22} style={{ objectFit: 'contain' }} /> },
  { title: 'At Yarışı', desc: 'Sanal at yarışları her an başlıyor', href: '#', color: '#d97706', icon: <img src="/icons/vrtrdrHorseRacing_5.png" alt="" width={22} height={22} style={{ objectFit: 'contain' }} /> },
  { title: 'Tazı Yarışı', desc: 'Hızlı sanal tazı yarışları', href: '#', color: '#7c3aed', icon: <img src="/icons/vrtrdrGreyhounds_5.png" alt="" width={22} height={22} style={{ objectFit: 'contain' }} /> },
]

// ── Canlı Casino tab items ─────────────────────────────────────

const casinoItems = [
  { title: 'Tüm Canlı Casino', desc: 'Gerçek krupiyeler eşliğinde oynayın', href: '/live-casino', color: '#c026d3', icon: iCasino },
  { title: 'Rulet', desc: 'Canlı rulet masaları', href: '/live-casino', color: '#e74c3c', icon: iCasino },
  { title: 'Blackjack', desc: '21\'i yakalayın, krupiyeyi yenin', href: '/live-casino', color: '#1a2332', icon: iCasino },
  { title: 'Baccarat', desc: 'Klasik canlı baccarat masaları', href: '/live-casino', color: '#0E8FCF', icon: iCasino },
  { title: 'Poker', desc: 'Şans değil, tamamen strateji', href: '/live-casino', color: '#27ae60', icon: iPoker },
]

// ── Slotlar tab items ──────────────────────────────────────────

const slotItems = [
  { title: 'Tüm Slotlar', desc: 'En iyi slot oyunları bir arada', href: '/slots', color: '#ea580c', icon: iSlots },
  { title: 'Popüler Slotlar', desc: 'En çok oynanan slot oyunları', href: '/slots', color: '#e74c3c', icon: iSlots },
  { title: 'Jackpot Oyunları', desc: 'Büyük ikramiyeli slotlar', href: '/slots', color: '#f59e0b', icon: iSlots },
  { title: 'Yeni Slotlar', desc: 'Yeni eklenen slot oyunları', href: '/slots', color: '#7c3aed', icon: iSlots },
  { title: 'Megaways', desc: 'Binlerce kazanma şansı', href: '/slots', color: '#0E8FCF', icon: iSlots },
]

// ── Diğerleri (account) ────────────────────────────────────────

const accountActions = [
  { title: 'LİMİT BELİRLEME', desc: 'Limitlerinizi belirleyin veya hesabınızı kapatın', href: '/hesap/limitler', icon: iLimit },
  { title: 'PROFİL BİLGİLERİ', desc: 'Şifrenizi yenileyin ve bilgilerinizi güncelleyin', href: '/hesap/profil', icon: iProfile },
  { title: 'HAREKETLER', desc: 'Tüm oyun ve finansal hareketlerinizi inceleyin', href: '/history', icon: iHistory },
  { title: 'BONUSLAR', desc: 'Aktif ve geçmiş bonuslarınızı kontrol edin', href: '/hesap/bonuslar', icon: iBonus },
  { title: 'MESAJLAR', desc: 'Yeni mesaj gönderin ve gelen yanıtları inceleyin', href: '/hesap/mesajlar', icon: iMessage },
  { title: 'KUPONLARIM', desc: 'Kazanan ve bekleyen kuponları inceleyin', href: '/kupon', icon: iTicket },
  { title: 'BELGE YÜKLEME', desc: 'Hesap doğrulama belgelerinizi yükleyin', href: '/hesap/belgeler', icon: iUpload },
  { title: 'Bildirimler', desc: 'Bildirimlerini açtığınız etkinlikleri görün', href: '/hesap/bildirimler', icon: iBell },
]

const infoLinks = [
  { title: 'Betadonis Hakkında', href: '/bilgi/hakkinda' },
  { title: 'Şartlar ve Koşullar', href: '/bilgi/sartlar' },
  { title: 'Sorumlu Oyun', href: '/bilgi/sorumlu-oyun' },
  { title: 'Hesap Doğrulama', href: '/bilgi/hesap-dogrulama' },
  { title: 'Gizlilik Politikası', href: '/bilgi/gizlilik' },
  { title: 'VIP Statü', href: '/bilgi/vip' },
  { title: 'Bonuslar', href: '/bilgi/bonuslar' },
  { title: 'Ortaklık', href: '/bilgi/ortaklik' },
]

const fmt = (n: number) => `${n.toFixed(2)} TRY`

// ── Reusable list row ──────────────────────────────────────────

function MenuRow({ icon, color, title, desc, onClick }: {
  icon: React.ReactNode; color: string; title: string; desc: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 border border-[#e8ecf1] hover:shadow-sm transition-shadow w-full"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">{title}</p>
        <p className="text-[9px] text-[#737B8C] mt-[2px]">{desc}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  )
}

// ── Component ──────────────────────────────────────────────────

export default function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenuTab, setActiveMenuTab] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, balance, logout } = useAuth()
  const { open: openBetSlip, count: slipCount } = useBetSlip()

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
      if (i === 2) openBetSlip()
    }
  }

  const navigateFromMenu = (href: string) => {
    setMenuOpen(false)
    router.push(href)
  }

  const listTabItems: Record<number, typeof trendItems> = {
    0: trendItems,
    1: sporItems,
    2: sanalItems,
    3: casinoItems,
    4: slotItems,
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
              <button onClick={() => navigateFromMenu('/settings')} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

            {/* Auth / balance buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 mb-4">
                <Link href="/kupon/withdraw" onClick={() => setMenuOpen(false)} className="flex-1 h-[40px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                  PARA ÇEKME
                </Link>
                <Link href="/kupon/deposit" onClick={() => setMenuOpen(false)} className="flex-1 h-[40px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  PARA YATIRMA
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-4">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 h-[40px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center">
                  Giriş Yap
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 h-[40px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-semibold flex items-center justify-center">
                  Kayıt Ol
                </Link>
              </div>
            )}

            {/* Favorilerim quick access */}
            <button
              onClick={() => navigateFromMenu('/favorites')}
              className="w-full flex items-center gap-3 bg-[#edf5ff] rounded-xl px-3 py-2.5 mb-4 border border-[#0E8FCF]/20 hover:shadow-sm transition-shadow"
            >
              <div className="w-9 h-9 rounded-full bg-[#0E8FCF] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">Favorilerim</p>
                <p className="text-[9px] text-[#737B8C] mt-[2px]">Etkinlikler, ligler ve oyunlar</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {/* Category tabs — horizontally scrollable */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4">
              {menuTabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveMenuTab(i)}
                  className="flex flex-col items-center gap-[5px] flex-shrink-0 min-w-[62px] py-1"
                >
                  <div className="w-[24px] h-[24px] flex items-center justify-center">{tab.icon}</div>
                  <span className={`text-[10px] font-medium leading-none whitespace-nowrap ${activeMenuTab === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{tab.label}</span>
                  <span className={`w-full h-[2px] rounded-full ${activeMenuTab === i ? 'bg-[#0E8FCF]' : 'bg-transparent'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28">

            {/* ── List-style tabs: TREND / Sporlar / Sanal / Casino / Slotlar ── */}
            {activeMenuTab <= 4 && (
              <div className="flex flex-col gap-[8px]">
                {listTabItems[activeMenuTab].map((item) => (
                  <MenuRow
                    key={item.title}
                    icon={item.icon}
                    color={item.color}
                    title={item.title}
                    desc={item.desc}
                    onClick={() => navigateFromMenu(item.href)}
                  />
                ))}
              </div>
            )}

            {/* ── Diğerleri tab ── */}
            {activeMenuTab === 5 && (
              <div className="flex flex-col gap-3">
                {/* Canonical navigation list (shared with /digerleri) */}
                <DigerleriMenu onNavigate={navigateFromMenu} />

                {/* Account section — kept reachable below the nav list */}
                <div className="flex items-center gap-2 px-1 pt-2 pb-1">
                  <span className="text-[#0E8FCF]">{iProfile}</span>
                  <p className="text-[12px] font-bold text-[#1a2332] leading-tight">Hesabım</p>
                </div>
                {isLoggedIn ? (
                  <>
                    {/* Balance card */}
                    <div className="bg-white rounded-xl border border-[#e8ecf1] px-4 py-3.5">
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
                          onClick={() => navigateFromMenu(item.href)}
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

                    {/* Bilgi */}
                    <div>
                      <div className="flex items-center gap-2 px-1 pt-1 pb-2">
                        <span className="text-[#0E8FCF]">{iInfo}</span>
                        <div>
                          <p className="text-[12px] font-bold text-[#1a2332] leading-tight">Bilgi</p>
                          <p className="text-[9px] text-[#737B8C]">Kurallar, politikalar ve kurumsal bilgiler</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
                        {infoLinks.map((item, idx) => (
                          <button
                            key={item.title}
                            onClick={() => navigateFromMenu(item.href)}
                            className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#f8fafc] transition-colors ${idx < infoLinks.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
                          >
                            <span className="text-[12px] font-medium text-[#1a2332] flex-1 text-left">{item.title}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ÇIKIŞ */}
                    <button
                      onClick={() => { logout(); setMenuOpen(false) }}
                      className="w-full h-[46px] rounded-xl border border-[#e8ecf1] bg-white text-[#e74c3c] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#fef2f2] transition-colors mt-1"
                    >
                      <span className="text-[#e74c3c]">{iLogout}</span>
                      ÇIKIŞ
                    </button>
                  </>
                ) : (
                  <>
                    {/* Logged-out prompt */}
                    <div className="bg-gradient-to-r from-[#0E8FCF] to-[#2da8e6] rounded-xl px-4 py-4">
                      <p className="text-[13px] font-bold text-white leading-tight">Hesabınıza giriş yapın</p>
                      <p className="text-[10px] text-white/80 mt-1 mb-3">Bakiyenizi, kuponlarınızı ve bonuslarınızı görmek için giriş yapın.</p>
                      <div className="flex items-center gap-2.5">
                        <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 h-[38px] rounded-full bg-white text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center">Giriş Yap</Link>
                        <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 h-[38px] rounded-full bg-white/15 border border-white/40 text-white text-[12px] font-semibold flex items-center justify-center">Kayıt Ol</Link>
                      </div>
                    </div>

                    {/* Bilgi (public) */}
                    <div>
                      <div className="flex items-center gap-2 px-1 pt-1 pb-2">
                        <span className="text-[#0E8FCF]">{iInfo}</span>
                        <div>
                          <p className="text-[12px] font-bold text-[#1a2332] leading-tight">Bilgi</p>
                          <p className="text-[9px] text-[#737B8C]">Kurallar, politikalar ve kurumsal bilgiler</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
                        {infoLinks.map((item, idx) => (
                          <button
                            key={item.title}
                            onClick={() => navigateFromMenu(item.href)}
                            className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#f8fafc] transition-colors ${idx < infoLinks.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
                          >
                            <span className="text-[12px] font-medium text-[#1a2332] flex-1 text-left">{item.title}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
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
                      <div className="relative w-[52px] h-[52px] rounded-full bg-[#0E8FCF] flex items-center justify-center shadow-[0_4px_12px_rgba(14,143,207,0.4)]">
                        {item.icon(true)}
                        {slipCount > 0 && (
                          <span className="absolute -top-[2px] -right-[2px] min-w-[20px] h-[20px] px-[5px] rounded-full bg-[#e74c3c] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
                            {slipCount}
                          </span>
                        )}
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
