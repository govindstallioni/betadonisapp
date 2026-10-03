'use client'

import { useCallback, useEffect, useState } from 'react'

// ── Profile e-mail / phone verification state (v6.6 task 32) ────────────────
// Remembers *which value* was verified, not just a flag: if the user later
// edits the e-mail or phone, the new value is unverified again.

export type VerifyKind = 'email' | 'phone'

const KEY = 'bta_verified'
const EVENT = 'betadonis:verified'

type Store = Partial<Record<VerifyKind, string>>

const norm = (kind: VerifyKind, v: string) => (kind === 'email' ? v.trim().toLowerCase() : v.replace(/\D/g, ''))

function read(): Store {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function useVerification() {
  const [store, setStore] = useState<Store>({})

  useEffect(() => {
    setStore(read())
    const sync = () => setStore(read())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isVerified = useCallback(
    (kind: VerifyKind, value: string) => !!value.trim() && store[kind] === norm(kind, value),
    [store],
  )

  const markVerified = useCallback((kind: VerifyKind, value: string) => {
    const next = { ...read(), [kind]: norm(kind, value) }
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
    setStore(next)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return { isVerified, markVerified }
}
