'use client'

import { useEffect, useState } from 'react'

// Scrolling "current address" notice (gunceladres.png) — offshore betting
// sites rotate domains frequently, so this keeps returning users pointed at
// the right one. Shown once per browser session (sessionStorage, matching
// layout.tsx's existing 'bta_splash' per-session convention) and dismissible.
const LS_CLOSED = 'bta_address_banner_closed'
const CURRENT_DOMAIN = 'betadonis1295.com'

export default function SiteAddressBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(LS_CLOSED)) return
    } catch {}
    setOpen(true)
  }, [])

  const close = () => {
    setOpen(false)
    try { sessionStorage.setItem(LS_CLOSED, '1') } catch {}
  }

  if (!open) return null

  return (
    <div className="max-w-[430px] mx-auto bg-[#1a2332] flex items-center gap-2 px-3 py-[6px] overflow-hidden">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" /><circle cx="12" cy="9" r="2.5" />
      </svg>
      <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap">
        <span className="inline-block animate-marquee text-[11px] font-medium text-white/90">
          Güncel adresimiz: <span className="font-bold text-[#4db8ff]">{CURRENT_DOMAIN}</span>
        </span>
      </div>
      <button onClick={close} aria-label="Kapat" className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
