'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface Balance {
  withdrawable: number
  bonus: number
  locked: number
  total: number
}

interface AuthContextValue {
  loaded: boolean
  isLoggedIn: boolean
  username: string
  balance: Balance
  login: (username?: string) => void
  logout: () => void
  // Mutate the (persisted) balance. Positive credits, negative debits the
  // withdrawable pot; deltaBonus adjusts the bonus pot. Total is recomputed.
  adjustBalance: (deltaWithdrawable: number, deltaBonus?: number) => void
}

// Starting balance for logged-in users (prototype has no backend).
const DEMO_BALANCE: Balance = {
  withdrawable: 499.21,
  bonus: 0,
  locked: 0,
  total: 499.21,
}

const AuthContext = createContext<AuthContextValue>({
  loaded: false,
  isLoggedIn: false,
  username: '',
  balance: DEMO_BALANCE,
  login: () => {},
  logout: () => {},
  adjustBalance: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

const STORAGE_KEY = 'bta_auth'
const BAL_KEY = 'bta_balance'
const round2 = (n: number) => Math.round(n * 100) / 100

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [balance, setBalance] = useState<Balance>(DEMO_BALANCE)

  // Load persisted session + balance once on mount (client-only → no hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.isLoggedIn) {
          setIsLoggedIn(true)
          setUsername(typeof parsed.username === 'string' ? parsed.username : '')
        }
      }
      const braw = localStorage.getItem(BAL_KEY)
      if (braw) {
        const b = JSON.parse(braw)
        if (b && typeof b.withdrawable === 'number') {
          setBalance({ withdrawable: b.withdrawable, bonus: b.bonus ?? 0, locked: b.locked ?? 0, total: b.total ?? b.withdrawable })
        }
      }
    } catch {}
    setLoaded(true)
  }, [])

  const login = useCallback((name?: string) => {
    const u = name && name.trim() ? name.trim() : 'Kullanıcı'
    setIsLoggedIn(true)
    setUsername(u)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn: true, username: u }))
    } catch {}
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUsername('')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const adjustBalance = useCallback((deltaWithdrawable: number, deltaBonus = 0) => {
    setBalance(prev => {
      const withdrawable = Math.max(0, round2(prev.withdrawable + deltaWithdrawable))
      const bonus = Math.max(0, round2(prev.bonus + deltaBonus))
      const next: Balance = { withdrawable, bonus, locked: prev.locked, total: round2(withdrawable + bonus + prev.locked) }
      try { localStorage.setItem(BAL_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ loaded, isLoggedIn, username, balance, login, logout, adjustBalance }}>
      {children}
    </AuthContext.Provider>
  )
}
