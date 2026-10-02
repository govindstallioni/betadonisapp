'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Flag from './Flag'
import { openLiveSupport } from './LiveSupportWidget'

// ── Site footer (work3 task 16, footer.png) ─────────────────────────────────
// Same blocks, order and copy as the Betadonis footer, built in HTML/SVG and
// drawn with the app's own colour classes so html.dark (globals.css) themes it
// like every other card. It is a container-query component: inside the 430px
// mobile shell the three link groups are accordions; given a wide container
// (web layout) they open up side by side as columns.

const PRODUCTS = [
  { label: 'Spor Bahisleri', href: '/prematch' },
  { label: 'Canlı Bahis', href: '/live' },
  { label: 'Sanal Bahis', href: '/sanal-bahis' },
  { label: 'Slot Oyunları', href: '/slots' },
  { label: 'Canlı Casino', href: '/live-casino' },
  { label: 'Poker', href: '/poker' },
  { label: 'Canlı Oyunlar', href: '/live-casino' },
  { label: 'Golden Race', href: '/golden-race' },
  { label: 'Şans Çarkı', href: '/sans-carki' },
  { label: 'Promosyonlar', href: '/promosyonlar' },
  { label: 'Ortaklık', href: '/ortaklik' },
]

const LINKS = [
  { label: 'Betadonis Hakkında', href: '/bilgi/hakkinda' },
  { label: 'Şartlar ve Koşullar', href: '/bilgi/sartlar' },
  { label: 'Gizlilik Politikası', href: '/bilgi/gizlilik' },
  { label: 'Sorumlu Oyun', href: '/bilgi/sorumlu-oyun' },
  { label: 'Hesap Doğrulama', href: '/bilgi/hesap-dogrulama' },
  { label: 'VIP Statü', href: '/bilgi/vip' },
  { label: 'Bonuslar', href: '/bilgi/bonuslar' },
]

const HELP = [
  { label: 'Yardım Merkezi', href: '/yardim' },
  { label: 'Sıkça Sorulan Sorular', href: '/yardim/sss' },
  { label: 'İletişim', href: '/yardim/iletisim' },
  { label: 'Şikayet', href: '/yardim/sikayet' },
  { label: 'Mesajlarım', href: '/hesap/mesajlar' },
]

type Group = { key: string; title: string; items: { label: string; href: string }[] }
const GROUPS: Group[] = [
  { key: 'products', title: 'Ürünlerimiz', items: PRODUCTS },
  { key: 'links', title: 'Linkler', items: LINKS },
  { key: 'help', title: 'Yardım ve Destek', items: HELP },
]

// ── Payment tiles (redrawn wordmarks, like PaymentLogos.tsx) ────────────────
const PAYMENTS: { name: string; svg: React.ReactNode }[] = [
  {
    name: 'GigaPay',
    svg: (
      <>
        <circle cx="16" cy="18" r="8" fill="none" stroke="#2563eb" strokeWidth="3" />
        <path d="M16 18h6" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
        <text x="30" y="16" fill="#2563eb" fontSize="9" fontWeight="800" fontFamily="system-ui, sans-serif">PAY</text>
        <text x="30" y="26" fill="#7c3aed" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">GIGA</text>
      </>
    ),
  },
  {
    name: 'VISA',
    svg: <text x="36" y="25" textAnchor="middle" fill="#1a1f71" fontSize="17" fontWeight="900" fontStyle="italic" fontFamily="system-ui, sans-serif" letterSpacing="0.5">VISA</text>,
  },
  {
    name: 'Mastercard',
    svg: (
      <>
        <circle cx="29" cy="15" r="9" fill="#eb001b" />
        <circle cx="43" cy="15" r="9" fill="#f79e1b" fillOpacity="0.9" />
        <text x="36" y="31" textAnchor="middle" fill="#1a2332" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">MasterCard</text>
      </>
    ),
  },
]

function Chevron({ open }: { open: boolean }) {
  // footer.png: ▼ on the open group, ▲ on the collapsed ones
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={`transition-transform ${open ? '' : 'rotate-180'}`}>
      <path d="M4 8h16l-8 9z" />
    </svg>
  )
}

export default function Footer() {
  const router = useRouter()
  const [open, setOpen] = useState<Record<string, boolean>>({ products: true })

  return (
    <footer className="@container mt-6 pt-4 pb-6 border-t border-[#e8ecf1]">
      {/* Language + live support */}
      <div className="grid grid-cols-2 gap-[10px]">
        <Link
          href="/settings"
          className="h-[44px] rounded-xl bg-white border border-[#e8ecf1] flex items-center justify-center gap-[10px] text-[14px] font-medium text-[#1a2332]"
        >
          <Flag emoji="🇹🇷" size={26} />
          Türkçe
        </Link>
        <button
          onClick={() => { if (!openLiveSupport()) router.push('/hesap/mesajlar') }}
          className="h-[44px] rounded-xl bg-white border border-[#e8ecf1] flex items-center justify-center gap-[10px] text-[14px] font-medium text-[#1a2332]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Canlı Destek
        </button>
      </div>

      {/* Link groups — accordions on mobile, columns in a wide container */}
      <div className="mt-[14px] flex flex-col gap-[10px] @2xl:grid @2xl:grid-cols-3 @2xl:items-start">
        {GROUPS.map((g) => {
          const isOpen = !!open[g.key]
          return (
            <section key={g.key} className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
              <button
                onClick={() => setOpen((o) => ({ ...o, [g.key]: !o[g.key] }))}
                aria-expanded={isOpen}
                className="w-full h-[46px] px-[16px] flex items-center justify-between text-[15px] font-medium text-[#1a2332] @2xl:pointer-events-none"
              >
                {g.title}
                <span className="@2xl:hidden"><Chevron open={isOpen} /></span>
              </button>
              <div className={`${isOpen ? 'block' : 'hidden'} @2xl:block px-[16px] pb-[14px]`}>
                <div className="border-t border-[#e8ecf1] pt-[12px] grid grid-cols-2 gap-x-[16px] gap-y-[14px]">
                  {g.items.map((it) => (
                    <Link key={it.label} href={it.href} className="text-[13px] text-[#737B8C] underline underline-offset-2 truncate">
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Payment methods */}
      <div className="mt-[16px] flex items-center gap-[6px]">
        {PAYMENTS.map((p) => (
          <span key={p.name} className="w-[70px] h-[40px] rounded-md bg-[#fff] border border-[#e8ecf1] flex items-center justify-center">
            <svg width="66" height="36" viewBox="0 0 72 36" role="img" aria-label={p.name}>{p.svg}</svg>
          </span>
        ))}
        <Link href="/kupon/deposit" className="ml-auto flex-shrink-0 rounded-full border border-[#e8ecf1] px-[14px] py-[8px] text-[12px] text-[#1a2332] font-semibold whitespace-nowrap hover:bg-[#f8fafc] active:scale-[0.97] transition-all">
          Hepsini gör &gt;
        </Link>
      </div>

      {/* Trust badges */}
      <div className="mt-[18px] flex items-center justify-center gap-[18px]">
        <Link href="/bilgi/sorumlu-oyun" aria-label="18 yaş sınırı" className="w-[40px] h-[40px] rounded-full border-2 border-current text-[#1a2332] flex items-center justify-center text-[14px] font-bold">
          18+
        </Link>
        <Link href="/yardim/iletisim" aria-label="WhatsApp" className="w-[40px] h-[40px] rounded-full bg-[#25d366] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z" /></svg>
        </Link>
        <Link href="/yardim/iletisim" aria-label="Telegram" className="w-[40px] h-[40px] rounded-full bg-[#26a5e4] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M21.94 4.67 18.9 19.02c-.23 1.01-.83 1.26-1.68.78l-4.63-3.41-2.23 2.15c-.25.25-.45.45-.93.45l.33-4.72 8.59-7.76c.37-.33-.08-.52-.58-.19L7.16 13.01l-4.57-1.43c-.99-.31-1.01-.99.21-1.47L20.66 3.2c.83-.31 1.55.19 1.28 1.47z" /></svg>
        </Link>
        <Link href="/bilgi/hakkinda" aria-label="Lisans doğrulama" className="flex flex-col items-center leading-none">
          <svg width="28" height="28" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#1a2332" />
            <path d="M20 8a9 9 0 1 0 0 16 7 7 0 1 1 0-16z" fill="#e74c3c" />
            <circle cx="24" cy="7" r="4" fill="#f59e0b" />
          </svg>
          <span className="mt-[2px] text-[7px] font-bold text-[#e74c3c]">LİSANS</span>
          <span className="text-[6px] text-[#737B8C]">Doğrulamak için tıkla</span>
        </Link>
      </div>

      {/* App downloads */}
      <div className="mt-[20px] flex items-center justify-center gap-[12px]">
        {[
          { os: 'IOS APP', icon: <path d="M16.37 12.6c-.02-2.27 1.86-3.36 1.94-3.41-1.06-1.55-2.7-1.76-3.28-1.78-1.4-.14-2.73.82-3.44.82-.71 0-1.8-.8-2.96-.78-1.52.02-2.93.89-3.71 2.25-1.58 2.75-.4 6.81 1.14 9.04.75 1.09 1.65 2.31 2.82 2.27 1.13-.05 1.56-.73 2.93-.73 1.37 0 1.75.73 2.95.71 1.22-.02 1.99-1.11 2.73-2.2.86-1.26 1.22-2.49 1.24-2.55-.03-.01-2.37-.91-2.4-3.64zM14.12 5.93c.62-.76 1.04-1.8.93-2.85-.9.04-1.99.6-2.64 1.35-.58.67-1.08 1.74-.95 2.77 1 .08 2.03-.51 2.66-1.27z" fill="#fff" /> },
          { os: 'ANDROID APP', icon: <path d="M4 3.5v17l9.2-8.5L4 3.5zm10.4 7.4 2.7-2.5L6 2.2l8.4 8.7zm0 2.2L6 21.8l11.1-6.2-2.7-2.5zm3.8-3.6-2.9 2.5 2.9 2.5 2.9-1.6c.8-.5.8-1.3 0-1.8l-2.9-1.6z" fill="#fff" /> },
        ].map((a) => (
          <Link
            key={a.os}
            href="/settings/about"
            className="h-[40px] px-[10px] rounded-md bg-gradient-to-r from-[#0E8FCF] to-[#3b5bdb] flex items-center gap-[8px] shadow-sm"
          >
            <svg width="22" height="22" viewBox="0 0 24 24">{a.icon}</svg>
            <span className="flex flex-col leading-none text-left">
              <span className="text-[10px] font-extrabold tracking-wide text-[#ffe066]">HEMEN İNDİRİN</span>
              <span className="text-[11px] font-bold text-white mt-[2px]">{a.os}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Legal */}
      {/* Literal capitals, not CSS `uppercase`: under lang="tr" that turns i → İ */}
      <p className="mt-[22px] text-center text-[11px] leading-[1.6] text-[#737B8C]">
        COPYRIGHTS © 2010-2026, ALL RIGHTS RESERVED.<br />BETADONIS.COM
      </p>
      <p className="mt-[16px] text-center text-[11px] leading-[1.65] text-[#737B8C]">
        Betadonis.com is owned and operated by All Components Ltd. Registration number: 15787, registered address:
        Hamchako, Mutsamudu, Autonomous Island of Anjouan, Union of Comoros. Contact us info@betadonis.com.
        Betadonis.com is licensed and regulated by the Government of the Autonomous Island of Anjouan, Union of
        Comoros and operates under License No. ALSI-202408040-FI2. Betadonis.com has passed all regulatory
        compliance and is legally authorized to conduct gaming operations for any and all games of chance and
        wagering.
      </p>
    </footer>
  )
}
