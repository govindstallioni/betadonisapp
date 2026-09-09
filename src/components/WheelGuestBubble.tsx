'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import WheelPromoModal from './WheelPromoModal'

// Lucky Wheel teaser for guests who've never registered — shown once ever
// (unlike PromoBubble.tsx, which repeats every ~110s for as long as the user
// stays logged out). Gated by a localStorage flag, raw '1', matching
// SpinWheel.tsx's existing convention for wheel-related flags.
// Delay offset from PromoBubble's own 20s/110s cadence so the two never pop
// up on top of each other.
const FIRST_DELAY_MS = 45000
const LS_SEEN = 'bta_wheel_guest_seen'

export default function WheelGuestBubble() {
  const { loaded, isLoggedIn } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!loaded || isLoggedIn) { setOpen(false); return }
    try {
      if (localStorage.getItem(LS_SEEN)) return
    } catch {}
    const timer = setTimeout(() => setOpen(true), FIRST_DELAY_MS)
    return () => clearTimeout(timer)
  }, [loaded, isLoggedIn])

  const close = () => {
    setOpen(false)
    try { localStorage.setItem(LS_SEEN, '1') } catch {}
  }

  if (!open || !loaded || isLoggedIn) return null

  return <WheelPromoModal variant="guest" onClose={close} />
}
