'use client'

import Script from 'next/script'

// ── LiveSupport (livesupport.com) integration ──────────────────────────────
// Paste the embed script URL LiveSupport gives you under their dashboard's
// Settings > Installation page (looks like a <script src="..."> tag) here.
// Until this is filled in, "Canlı Destek" keeps falling back to the in-app
// message inbox (/hesap/mesajlar) exactly as it does today — nothing breaks.
export const LIVE_SUPPORT_SCRIPT_URL = ''

// Only needed if LiveSupport's snippet passes the account/widget id as a
// separate data attribute rather than baking it into the script URL itself.
export const LIVE_SUPPORT_WIDGET_ID = ''

export function isLiveSupportConfigured() {
  return LIVE_SUPPORT_SCRIPT_URL.length > 0
}

// Mounted once in the root layout — loads LiveSupport's widget script
// site-wide (it renders its own floating launcher) once configured above.
export default function LiveSupportWidget() {
  if (!isLiveSupportConfigured()) return null
  return (
    <Script
      src={LIVE_SUPPORT_SCRIPT_URL}
      data-widget-id={LIVE_SUPPORT_WIDGET_ID || undefined}
      strategy="lazyOnload"
    />
  )
}

// Opens the LiveSupport chat window via the `window.LiveSupport.open()` /
// `window.livesupport.open()` API most live-chat embed scripts expose.
// Returns false if the widget script isn't loaded/configured yet, so callers
// can fall back to their own contact flow.
export function openLiveSupport(): boolean {
  if (typeof window === 'undefined') return false
  const api = (window as unknown as { LiveSupport?: any; livesupport?: any }).LiveSupport
    ?? (window as unknown as { livesupport?: any }).livesupport
  if (api?.open) { api.open(); return true }
  if (api?.show) { api.show(); return true }
  return false
}
