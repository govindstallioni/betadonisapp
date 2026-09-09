'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface Balance {
  withdrawable: number
  bonus: number
  locked: number
  total: number
}

// Lucky Wheel eligibility state: the 14-day window starts on the user's
// first deposit and can be extended by "Extra Day" wheel prizes.
export interface WheelState {
  firstDepositAt: number | null
  extraDays: number
}

interface AuthContextValue {
  loaded: boolean
  isLoggedIn: boolean
  username: string
  lastLoginAt: number | null
  balance: Balance
  wheel: WheelState
  login: (username?: string) => void
  logout: () => void
  // Mutate the (persisted) balance. Positive credits, negative debits the
  // withdrawable pot; deltaBonus adjusts the bonus pot. Total is recomputed.
  adjustBalance: (deltaWithdrawable: number, deltaBonus?: number) => void
  // Marks the user's first deposit (idempotent — no-op on repeat deposits).
  // Returns true only the first time it's called for this user.
  recordFirstDeposit: () => boolean
  // Extends the Lucky Wheel's 14-day window by n days (an "Extra Day" prize).
  addExtraDays: (n: number) => void
}

// Starting balance for logged-in users (prototype has no backend).
const DEMO_BALANCE: Balance = {
  withdrawable: 499.21,
  bonus: 0,
  locked: 0,
  total: 499.21,
}

const DEMO_WHEEL: WheelState = { firstDepositAt: null, extraDays: 0 }

const AuthContext = createContext<AuthContextValue>({
  loaded: false,
  isLoggedIn: false,
  username: '',
  lastLoginAt: null,
  balance: DEMO_BALANCE,
  wheel: DEMO_WHEEL,
  login: () => {},
  logout: () => {},
  adjustBalance: () => {},
  recordFirstDeposit: () => false,
  addExtraDays: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

const STORAGE_KEY = 'bta_auth'
const BAL_KEY = 'bta_balance'
const WHEEL_KEY = 'bta_wheel_state'
const round2 = (n: number) => Math.round(n * 100) / 100

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [lastLoginAt, setLastLoginAt] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [balance, setBalance] = useState<Balance>(DEMO_BALANCE)
  const [wheel, setWheel] = useState<WheelState>(DEMO_WHEEL)

  // Load persisted session + balance once on mount (client-only → no hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.isLoggedIn) {
          setIsLoggedIn(true)
          setUsername(typeof parsed.username === 'string' ? parsed.username : '')
          setLastLoginAt(typeof parsed.lastLoginAt === 'number' ? parsed.lastLoginAt : null)
        }
      }
      const braw = localStorage.getItem(BAL_KEY)
      if (braw) {
        const b = JSON.parse(braw)
        if (b && typeof b.withdrawable === 'number') {
          setBalance({ withdrawable: b.withdrawable, bonus: b.bonus ?? 0, locked: b.locked ?? 0, total: b.total ?? b.withdrawable })
        }
      }
      const wraw = localStorage.getItem(WHEEL_KEY)
      if (wraw) {
        const w = JSON.parse(wraw)
        if (w) {
          setWheel({
            firstDepositAt: typeof w.firstDepositAt === 'number' ? w.firstDepositAt : null,
            extraDays: typeof w.extraDays === 'number' ? w.extraDays : 0,
          })
        }
      }
    } catch {}
    setLoaded(true)
  }, [])

  const login = useCallback((name?: string) => {
    const u = name && name.trim() ? name.trim() : 'Kullanıcı'
    const now = Date.now()
    setIsLoggedIn(true)
    setUsername(u)
    setLastLoginAt(now)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn: true, username: u, lastLoginAt: now }))
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

  const recordFirstDeposit = useCallback(() => {
    // Reads current state directly (rather than inferring the result from
    // inside a setState updater, which React doesn't guarantee runs
    // synchronously) so the caller gets a reliable true/false immediately.
    if (wheel.firstDepositAt) return false
    const next: WheelState = { ...wheel, firstDepositAt: Date.now() }
    setWheel(next)
    try { localStorage.setItem(WHEEL_KEY, JSON.stringify(next)) } catch {}
    return true
  }, [wheel])

  const addExtraDays = useCallback((n: number) => {
    setWheel(prev => {
      const next: WheelState = { ...prev, extraDays: prev.extraDays + n }
      try { localStorage.setItem(WHEEL_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ loaded, isLoggedIn, username, lastLoginAt, balance, wheel, login, logout, adjustBalance, recordFirstDeposit, addExtraDays }}>
      {children}
    </AuthContext.Provider>
  )
}
