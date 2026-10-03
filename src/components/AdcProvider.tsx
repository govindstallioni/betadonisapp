'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthProvider'
import {
  adcForDeposit, betQualifies, issueCode, shopItem,
  type AdcCode, type AdcTx, type AdcTxType,
} from '@/data/adc'
import {
  ACTIVITY_KEEP_MS, CASINO_LAUNCH_AMOUNT, EMPTY_ACTIVITY, PROFILE_REWARD, QUESTS, REFERRAL_REWARD,
  SOCIAL_PLATFORMS, SOCIAL_REVIEW_MS, dayStr, periodKey, questProgress,
  type AdcActivity, type Invite, type SocialPlatform, type SocialSubmission,
} from '@/data/adcQuests'

// ── Adonis Coin balance, codes and ledger (task 27 + work3 task 8) ──────────
// Two pots, not one counter. The client's brief makes this its second layer of
// house protection: a deposit only ACCRUES points ("bekleyen"), and they are
// finalised into a spendable balance once the user places a real qualifying
// bet — min. 100₺ at min. 1.50 odds.
//
// v2.1 (revize-coin.html) adds three more earning sources, credited straight
// to the spendable balance once earned: quests, social-media shares (after
// review) and friend invites. Activity that drives quest progress is recorded
// here from the screens that produce it (login, bet slip, casino game).

const STORAGE_KEY = 'bta_adc'
/** Key in `claims` that records the one-off profile reward (task 33). */
export const PROFILE_CLAIM_KEY = 'profile-reward'

export interface AdcState {
  /** Spendable now. */
  available: number
  /** Accrued from deposits, waiting on a qualifying bet. */
  pending: number
  totalDeposited: number
  codes: AdcCode[]
  transactions: AdcTx[]
  activity: AdcActivity
  /** questId → period key it was last claimed in. */
  claims: Record<string, string>
  social: SocialSubmission[]
  invites: Invite[]
}

const EMPTY: AdcState = {
  available: 0,
  pending: 0,
  totalDeposited: 0,
  codes: [],
  transactions: [],
  activity: EMPTY_ACTIVITY,
  claims: {},
  social: [],
  invites: [],
}

export interface BetRecord { stake: number; sports: string[]; combo: boolean; live: boolean }
export interface SocialInput { platform: SocialPlatform; link: string; file: { name: string; size: number; lastModified: number }; note: string }

interface AdcContextValue extends AdcState {
  loaded: boolean
  /** Credits pending ADC for a deposit. Returns the amount accrued. */
  accrueDeposit: (amount: number) => number
  /** Converts pending → available if the coupon qualifies. Returns the amount
   *  released (0 when the bet does not qualify or nothing is pending). */
  qualifyBet: (stake: number, totalOdds: number) => number
  /** Spends ADC on a shop item and issues its code. Null if unaffordable. */
  redeem: (itemId: string) => AdcCode | null
  /** Marks a code used — called when a coupon / casino game uses it. */
  markCodeUsed: (code: string) => void
  /** Real-money bet placed (free bets and bonus money don't count). */
  recordBet: (b: BetRecord) => void
  /** Real-money casino game launched. */
  recordCasinoPlay: (game: string) => void
  /** Claims a completed quest's reward. Returns the ADC credited (0 if not claimable). */
  claimQuest: (questId: string) => number
  /** Credits the one-off profile-completion reward. A no-op once claimed. */
  claimProfileReward: () => void
  /** Sends a social share for review. Returns an error message, or null on success. */
  submitSocial: (s: SocialInput) => string | null
  /** Records a friend invite. */
  addInvite: (name: string) => void
}

const AdcContext = createContext<AdcContextValue>({
  ...EMPTY,
  loaded: false,
  accrueDeposit: () => 0,
  qualifyBet: () => 0,
  redeem: () => null,
  markCodeUsed: () => {},
  recordBet: () => {},
  recordCasinoPlay: () => {},
  claimQuest: () => 0,
  claimProfileReward: () => {},
  submitSocial: () => null,
  addInvite: () => {},
})

export function useAdc() {
  return useContext(AdcContext)
}

let txSeq = 0
const txId = () => `adc-${Date.now().toString(36)}-${txSeq++}`
const tx = (type: AdcTxType, amount: number, note: string): AdcTx => ({ id: txId(), type, amount, note, at: Date.now() })

/** Drops activity nothing reads any more, so the stored state stays small. */
function prune(a: AdcActivity): AdcActivity {
  const cutoff = Date.now() - ACTIVITY_KEEP_MS
  const cutoffDay = dayStr(new Date(cutoff))
  return {
    ...a,
    loginDays: a.loginDays.filter(d => d >= cutoffDay),
    bets: a.bets.filter(b => b.at >= cutoff),
    casino: a.casino.filter(c => c.at >= cutoff),
  }
}

export default function AdcProvider({ children }: { children: React.ReactNode }) {
  const { loaded: authLoaded, isLoggedIn } = useAuth()
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
            activity: { ...EMPTY_ACTIVITY, ...(parsed.activity || {}), firsts: { ...(parsed.activity?.firsts || {}) } },
            claims: parsed.claims && typeof parsed.claims === 'object' ? parsed.claims : {},
            social: Array.isArray(parsed.social) ? parsed.social : [],
            invites: Array.isArray(parsed.invites) ? parsed.invites : [],
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

  // Daily login — counted once per calendar day while logged in.
  useEffect(() => {
    if (!loaded || !authLoaded || !isLoggedIn) return
    const today = dayStr(new Date())
    setState(s => s.activity.loginDays.includes(today)
      ? s
      : { ...s, activity: prune({ ...s.activity, loginDays: [...s.activity.loginDays, today] }) })
  }, [loaded, authLoaded, isLoggedIn])

  // Simulated back office: reviews social shares and advances invites.
  useEffect(() => {
    if (!loaded) return
    const tick = () => setState(s => {
      const now = Date.now()
      let changed = false
      let credit = 0
      const txs: AdcTx[] = []

      const social = s.social.map(sub => {
        if (sub.status !== 'pending' || sub.reviewAt > now) return sub
        changed = true
        // "Aynı görsel reddedilir" — an earlier submission with the same image.
        const dup = s.social.some(o => o.id !== sub.id && o.fingerprint === sub.fingerprint && o.createdAt < sub.createdAt)
        if (dup) return { ...sub, status: 'rejected' as const, reviewedAt: now, adminNote: 'Aynı ekran görüntüsü daha önce gönderildi.' }
        credit += sub.reward
        const name = SOCIAL_PLATFORMS.find(p => p.id === sub.platform)?.name ?? sub.platform
        txs.push(tx('social', sub.reward, `${name} paylaşımı onaylandı`))
        return { ...sub, status: 'approved' as const, reviewedAt: now }
      })

      const invites = s.invites.map(inv => {
        if (inv.status === 'sent' && inv.registerAt <= now) { changed = true; inv = { ...inv, status: 'registered' } }
        if (inv.status === 'registered' && inv.depositAt <= now) {
          changed = true
          credit += REFERRAL_REWARD
          txs.push(tx('referral', REFERRAL_REWARD, `${inv.name} ilk yatırımını yaptı`))
          inv = { ...inv, status: 'deposited', rewardedAt: now }
        }
        return inv
      })

      if (!changed) return s
      return { ...s, social, invites, available: s.available + credit, transactions: [...txs, ...s.transactions] }
    })
    tick()
    const iv = setInterval(tick, 3000)
    return () => clearInterval(iv)
  }, [loaded])

  const accrueDeposit = useCallback((amount: number) => {
    const earned = adcForDeposit(amount)
    setState(s => ({
      ...s,
      totalDeposited: s.totalDeposited + amount,
      pending: s.pending + earned,
      transactions: earned > 0
        ? [tx('deposit', earned, `${amount.toLocaleString('tr-TR')} ₺ yatırım`), ...s.transactions]
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
        transactions: [tx('confirm', s.pending, 'Geçerli bahis ile onaylandı'), ...s.transactions],
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
        transactions: [tx('spend', -item.cost, `${item.name} — ${issued.code}`), ...s.transactions],
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

  const recordBet = useCallback((b: BetRecord) => {
    const at = Date.now()
    setState(s => {
      const firsts = { ...s.activity.firsts }
      if (b.combo && !firsts.combo) firsts.combo = at
      if (b.live && !firsts.live) firsts.live = at
      return { ...s, activity: prune({ ...s.activity, bets: [...s.activity.bets, { at, ...b }], firsts }) }
    })
  }, [])

  const recordCasinoPlay = useCallback((game: string) => {
    const at = Date.now()
    setState(s => ({
      ...s,
      activity: prune({
        ...s.activity,
        casino: [...s.activity.casino, { at, amount: CASINO_LAUNCH_AMOUNT, game }],
        firsts: { ...s.activity.firsts, casino: s.activity.firsts.casino ?? at },
      }),
    }))
  }, [])

  const claimQuest = useCallback((questId: string) => {
    const q = QUESTS.find(x => x.id === questId)
    if (!q) return 0
    let credited = 0
    setState(s => {
      const key = periodKey(q.resets)
      if (s.claims[q.id] === key) return s
      if (questProgress(q, s.activity) < q.target) return s
      credited = q.reward
      return {
        ...s,
        available: s.available + q.reward,
        claims: { ...s.claims, [q.id]: key },
        transactions: [tx('quest', q.reward, `Görev: ${q.title}`), ...s.transactions],
      }
    })
    return credited
  }, [])

  // Guarded inside the updater so a double-fired effect can't credit twice.
  const claimProfileReward = useCallback(() => {
    setState(s => {
      if (s.claims[PROFILE_CLAIM_KEY]) return s
      return {
        ...s,
        available: s.available + PROFILE_REWARD,
        claims: { ...s.claims, [PROFILE_CLAIM_KEY]: 'done' },
        transactions: [tx('quest', PROFILE_REWARD, 'Profil bilgileri tamamlandı'), ...s.transactions],
      }
    })
  }, [])

  const submitSocial = useCallback((input: SocialInput) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === input.platform)
    if (!platform) return 'Platform seçin.'
    const today = dayStr(new Date())
    // "Günde 1/platform" — a rejected share doesn't use up the day.
    const usedToday = state.social.some(x =>
      x.platform === input.platform && x.status !== 'rejected' && dayStr(new Date(x.createdAt)) === today)
    if (usedToday) return `${platform.name} için bugünkü paylaşım hakkınızı kullandınız.`
    const now = Date.now()
    const sub: SocialSubmission = {
      id: `SOC-${now.toString(36).toUpperCase()}`,
      platform: input.platform,
      link: input.link.trim(),
      fileName: input.file.name,
      fileSize: input.file.size,
      fingerprint: `${input.file.name}|${input.file.size}|${input.file.lastModified}`,
      note: input.note.trim(),
      reward: platform.reward,
      status: 'pending',
      createdAt: now,
      reviewAt: now + SOCIAL_REVIEW_MS,
    }
    setState(s => ({ ...s, social: [sub, ...s.social] }))
    return null
  }, [state.social])

  const addInvite = useCallback((name: string) => {
    const now = Date.now()
    const inv: Invite = {
      id: `INV-${now.toString(36)}`,
      name: name.trim(),
      status: 'sent',
      createdAt: now,
      registerAt: now + 15_000,
      depositAt: now + 40_000,
    }
    setState(s => ({ ...s, invites: [inv, ...s.invites] }))
  }, [])

  return (
    <AdcContext.Provider value={{
      ...state, loaded, accrueDeposit, qualifyBet, redeem, markCodeUsed,
      recordBet, recordCasinoPlay, claimQuest, claimProfileReward, submitSocial, addInvite,
    }}>
      {children}
    </AdcContext.Provider>
  )
}
