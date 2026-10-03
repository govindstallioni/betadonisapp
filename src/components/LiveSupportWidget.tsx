'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// ── LiveChat (livechat.com) integration — v6.6 task 27 ─────────────────────
// Standard LiveChat snippet: sets window.__lc.license, then the loader defines
// window.LiveChatWidget (a queueing stub) and injects cdn.livechatinc.com's
// tracking.js. API calls made before tracking.js finishes loading are queued
// by the stub and replayed, so opening from the footer never races the script.
export const LIVECHAT_LICENSE = 9481590

const LIVECHAT_SNIPPET = `
window.__lc = window.__lc || {};
window.__lc.license = ${LIVECHAT_LICENSE};
;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
`

export function isLiveSupportConfigured() {
  return LIVECHAT_LICENSE > 0
}

// Lift the widget so it clears the bottom tab bar. LiveChat injects its own
// container and rewrites its inline style, so a stylesheet rule can lose;
// an inline !important set from here (and re-set on every change) cannot.
const LIFT_PX = 50

// Only the minimized launcher is lifted. An open chat is full-screen on phones,
// so lifting it would push its header (and the minimize / close button) 50px off
// the top of the screen.
let chatVisibility: 'minimized' | 'maximized' | 'hidden' = 'minimized'

function liftWidget() {
  const el = document.getElementById('chat-widget-container')
  if (!el) return
  const want = chatVisibility === 'maximized' ? '0px' : `${LIFT_PX}px`
  if (el.style.getPropertyValue('bottom') !== want) {
    el.style.setProperty('bottom', want, 'important')
  }
}

// Mounted once in the root layout — loads LiveChat site-wide.
export default function LiveSupportWidget() {
  useEffect(() => {
    type Vis = { visibility: typeof chatVisibility }
    type LC = { on: (e: string, cb: (d: Vis) => void) => void; off: (e: string, cb: (d: Vis) => void) => void }
    const getLc = () => (window as unknown as { LiveChatWidget?: LC }).LiveChatWidget
    const onVisibility = (d: Vis) => { chatVisibility = d.visibility; liftWidget() }
    // The loader script runs after hydration, so LiveChatWidget may not exist
    // yet — retry until it does, then subscribe (once).
    let lc: LC | undefined
    const subscribe = () => {
      lc = getLc()
      if (!lc) return false
      lc.on('visibility_changed', onVisibility)
      return true
    }
    const subPoll = subscribe() ? undefined : setInterval(() => { if (subscribe()) clearInterval(subPoll) }, 200)
    liftWidget()
    const mo = new MutationObserver(liftWidget)
    mo.observe(document.body, { childList: true, subtree: true })
    const container = () => document.getElementById('chat-widget-container')
    const attrObserver = new MutationObserver(liftWidget)
    const poll = setInterval(() => {
      const el = container()
      if (el) {
        attrObserver.observe(el, { attributes: true, attributeFilter: ['style', 'class'] })
        clearInterval(poll)
      }
    }, 500)
    return () => { clearInterval(subPoll); lc?.off('visibility_changed', onVisibility); mo.disconnect(); attrObserver.disconnect(); clearInterval(poll) }
  }, [])

  return (
    <Script id="livechat-loader" strategy="afterInteractive">
      {LIVECHAT_SNIPPET}
    </Script>
  )
}

// Opens the LiveChat window. Returns false only if the loader hasn't run yet
// (e.g. clicked before hydration finished), so callers can ignore or retry.
export function openLiveSupport(): boolean {
  if (typeof window === 'undefined') return false
  const api = (window as unknown as { LiveChatWidget?: { call: (m: string) => void } }).LiveChatWidget
  if (!api) return false
  api.call('maximize')
  return true
}
