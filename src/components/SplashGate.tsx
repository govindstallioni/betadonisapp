'use client'

import { useState, useEffect } from 'react'
import SplashScreen from './SplashScreen'

// Shows the launch splash once per app session (fresh tab/session open).
// The pre-paint script in layout.tsx sets data-splash="on" before React
// mounts; here we confirm the decision and clear it when finished.
export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let shouldShow = false
    try {
      shouldShow = !sessionStorage.getItem('bta_splash')
      if (shouldShow) sessionStorage.setItem('bta_splash', '1')
    } catch {
      shouldShow = false
    }

    if (shouldShow) {
      setShow(true)
    } else {
      document.documentElement.removeAttribute('data-splash')
    }
  }, [])

  const handleDone = () => {
    setShow(false)
    document.documentElement.removeAttribute('data-splash')
  }

  return (
    <>
      {children}
      {show && <SplashScreen onDone={handleDone} />}
    </>
  )
}
