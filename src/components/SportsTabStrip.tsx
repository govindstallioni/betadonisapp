'use client'

import Link from 'next/link'

// ── Sports section chooser (task 24 item 8) ─────────────────────────────────
// Shown on the "Sporlar" home view (/?view=sports), which is a mixed overview
// rather than one of the three sections — so no pill is marked selected here.
// All three read as equally tappable destinations; the screen you land on has
// its own strip with the matching tab highlighted.
const SECTIONS = [
  { label: 'Canlı Bahis', href: '/live' },
  { label: 'Maç Öncesi', href: '/prematch' },
  { label: 'E-Spor', href: '/prematch?tab=2' },
]

export default function SportsTabStrip() {
  return (
    <div className="bg-[#edf5ff] rounded-full p-[3px] flex items-center gap-[3px]">
      {SECTIONS.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className="flex-1 py-[8px] rounded-full bg-white text-[#0E8FCF] text-[11px] font-semibold text-center shadow-sm transition-all active:scale-[0.97]"
        >
          {s.label}
        </Link>
      ))}
    </div>
  )
}
