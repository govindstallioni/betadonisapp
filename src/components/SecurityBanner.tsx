'use client'

import Link from 'next/link'
import { useSecurity } from './SecurityProvider'

// ── "Güvenliğinizi güçlendirin!" menu banner (task 26) ──────────────────────
// Mirrors guvenlik.PNG: a blue card sitting above the menu list, lock icon on
// the left, a decorative shield motif on the right. Two additions over the
// reference, both serving the client's "adım adım teşvik" note: the N/6
// progress bar, and the name of the next unfinished step.
//
// Rendered by DigerleriScreen and by the BottomNav "Menü" overlay as two
// explicit call sites — deliberately NOT inside DigerleriMenu, which is the
// shared canonical nav list and must stay a pure list of destinations.
export default function SecurityBanner() {
  const { loaded, doneCount, total, secured, items } = useSecurity()

  // Nothing to nudge about until state is restored, or once everything is done.
  if (!loaded || secured) return null

  const next = items.find(i => !i.done)
  const pct = Math.round((doneCount / total) * 100)

  return (
    <Link
      href="/settings/security"
      className="relative block overflow-hidden rounded-2xl bg-gradient-to-r from-[#0E8FCF] to-[#0a5f9e] px-4 py-3.5 active:scale-[0.99] transition-transform"
    >
      {/* Decorative shield motif — the reference's right-hand illustration */}
      <svg
        width="96" height="96" viewBox="0 0 24 24" fill="none"
        className="absolute -right-4 -top-3 text-white/10 pointer-events-none"
        aria-hidden="true"
      >
        <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor" />
      </svg>

      <div className="relative flex items-center gap-3">
        <span className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
          </svg>
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-white leading-tight">Güvenliğinizi güçlendirin!</p>
          <p className="text-[10px] text-white/75 mt-[2px] leading-tight">
            Hesabınız için ekstra güvenlik önlemi alın!
          </p>
        </div>

        <span className="flex-shrink-0 text-[11px] font-bold text-white bg-white/20 rounded-full px-2.5 py-1 tabular-nums">
          {doneCount}/{total}
        </span>
      </div>

      <div className="relative mt-3">
        <div className="h-[5px] rounded-full bg-white/25 overflow-hidden">
          <div className="h-full rounded-full bg-white transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        {next && (
          <p className="text-[10px] text-white/85 mt-1.5 leading-tight truncate">
            Sıradaki adım: <span className="font-semibold text-white">{next.title}</span>
          </p>
        )}
      </div>
    </Link>
  )
}
