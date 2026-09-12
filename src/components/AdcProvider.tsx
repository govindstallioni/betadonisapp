'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  adcForDeposit, betQualifies, issueCode, shopItem,
  type AdcCode, type AdcTx,
} from '@/data/adc'

// ── Adonis Coin balance, codes and ledger (task 27) ─────────────────────────
// Two pots, not one counter. The client's brief makes this its second layer of
// house protection: a deposit only ACCRUES points ("bekleyen"), and they are
// finalised into a spendable balance once the user places a real qualifying
// bet — min. 100₺ at min. 1.50 odds. Collapsing the two would look identical
// on screen while quietly dropping one of the four protections.
//
// Earning is deposit-only: there is no registration bonus and nothing else in
// the app grants ADC.

const STORAGE_KEY = 'bta_adc'

export interface AdcState {
  /** Spendable now. */
  available: number
  /** Accrued from deposits, waiting on a qualifying bet. */
  pending: number
  totalDeposited: number
  codes: AdcCode[]
  transactions: AdcTx[]
}

const EMPTY: AdcState = {
  available: 0,
  pending: 0,
  totalDeposited: 0,
  codes: [],
  transactions: [],
}

interface AdcContextValue extends AdcState {
  loaded: boolean
  /** Credits pending ADC for a deposit. Returns the amount accrued. */
  accrueDeposit: (amount: number) => number
  /** Converts pending → available if the coupon qualifies. Returns the amount
   *  released (0 when the bet does not qualify or nothing is pending). */
  qualifyBet: (stake: number, totalOdds: number) => number
  /** Spends ADC on a shop item and issues its code. Null if unaffordable. */
  redeem: (itemId: string) => AdcCode | null
  /** Marks a code used — called when a coupon is placed with it. */
  markCodeUsed: (code: string) => void
}

const AdcContext = createContext<AdcContextValue>({
  ...EMPTY,
  loaded: false,
  accrueDeposit: () => 0,
  qualifyBet: () => 0,
  redeem: () => null,
  markCodeUsed: () => {},
})

export function useAdc() {
  return useContext(AdcContext)
}

let txSeq = 0
const txId = () => `adc-${Date.now().toString(36)}-${txSeq++}`

export default function AdcProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdcState>(EMPTY)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          setState({
            available: Number(parsed.available) || 0,
            pending: Number(parsed.pending) || 0,
            totalDeposited: Number(parsed.totalDeposited) || 0,
            codes: Array.isArray(parsed.codes) ? parsed.codes : [],
            transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
          })
        }
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state, loaded])

  const accrueDeposit = useCallback((amount: number) => {
    const earned = adcForDeposit(amount)
    setState(s => ({
      ...s,
      totalDeposited: s.totalDeposited + amount,
      pending: s.pending + earned,
      transactions: earned > 0
        ? [{ id: txId(), type: 'deposit' as const, amount: earned, note: `${amount.toLocaleString('tr-TR')} ₺ yatırım`, at: Date.now() }, ...s.transactions]
        : s.transactions,
    }))
    return earned
  }, [])

  const qualifyBet = useCallback((stake: number, totalOdds: number) => {
    if (!betQualifies(stake, totalOdds)) return 0
    let released = 0
    setState(s => {
      if (s.pending <= 0) return s
      released = s.pending
      return {
        ...s,
        available: s.available + s.pending,
        pending: 0,
        transactions: [
          { id: txId(), type: 'confirm' as const, amount: s.pending, note: 'Geçerli bahis ile onaylandı', at: Date.now() },
          ...s.transactions,
        ],
      }
    })
    return released
  }, [])

  const redeem = useCallback((itemId: string) => {
    const item = shopItem(itemId)
    if (!item) return null
    let issued: AdcCode | null = null
    setState(s => {
      if (s.available < item.cost) return s
      issued = issueCode(item)
      return {
        ...s,
        available: s.available - item.cost,
        codes: [issued, ...s.codes],
        transactions: [
          { id: txId(), type: 'spend' as const, amount: -item.cost, note: `${item.name} — ${issued.code}`, at: Date.now() },
          ...s.transactions,
        ],
      }
    })
    return issued
  }, [])

  const markCodeUsed = useCallback((code: string) => {
    setState(s => ({
      ...s,
      codes: s.codes.map(c => (c.code === code && !c.usedAt ? { ...c, usedAt: Date.now() } : c)),
    }))
  }, [])

  return (
    <AdcContext.Provider value={{ ...state, loaded, accrueDeposit, qualifyBet, redeem, markCodeUsed }}>
      {children}
    </AdcContext.Provider>
  )
}
