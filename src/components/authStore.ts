// ── Local account store (v6.6 task 30) ─────────────────────────────────────
// The app is a front-end prototype with no backend, so registered accounts
// live in localStorage. Passwords are stored as a hash, never as typed, and
// login / forgot-password now check against this list so a wrong username or
// password actually produces the warning bubble.
//
// `user` is the test account from the client's task sheet, so QA can log in
// without registering first.

export interface Account {
  username: string
  email?: string
  phone?: string // E.164-ish, e.g. +905551234567
  passwordHash: string | null // null for social (Google) sign-ups
  method: 'phone' | 'email' | 'social'
  currency?: string // ISO code chosen at registration; locked afterwards (task 33)
  createdAt: number
}

export const CURRENCY_LABELS: Record<string, string> = {
  TRY: 'Türk Lirası (TRY)',
  USD: 'ABD Doları (USD)',
  EUR: 'Euro (EUR)',
  GBP: 'İngiliz Sterlini (GBP)',
  USDT: 'Tether (USDT)',
}

const KEY = 'bta_accounts'
const SEED_USER = 'user'
const SEED_PASSWORD = 'Password12345.'

// SHA-256 where SubtleCrypto exists (https / localhost); a simple fallback on
// plain-http dev hosts, where crypto.subtle is undefined.
export async function hashPassword(pw: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`bta:${pw}`))
      return 's256:' + Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
    }
  } catch {}
  let h = 5381
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h + pw.charCodeAt(i)) | 0
  return 'djb:' + (h >>> 0).toString(16)
}

function readRaw(): Account[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function load(): Promise<Account[]> {
  const list = readRaw()
  if (!list.some((a) => a.username.toLowerCase() === SEED_USER)) {
    list.unshift({ username: SEED_USER, passwordHash: await hashPassword(SEED_PASSWORD), method: 'email', createdAt: 0 })
    try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
  }
  return list
}

const norm = (s: string) => s.trim().toLowerCase()
const digits = (s: string) => s.replace(/\D/g, '')

function matches(a: Account, id: string): boolean {
  const n = norm(id)
  if (!n) return false
  if (a.username.toLowerCase() === n) return true
  if (a.email && a.email.toLowerCase() === n) return true
  if (a.phone && digits(id).length >= 7 && digits(a.phone).endsWith(digits(id))) return true
  return false
}

export async function findAccount(identifier: string): Promise<Account | undefined> {
  return (await load()).find((a) => matches(a, identifier))
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  return (await load()).some((a) => a.username.toLowerCase() === norm(username))
}

export async function isEmailTaken(email: string): Promise<boolean> {
  return (await load()).some((a) => a.email?.toLowerCase() === norm(email))
}

export async function isPhoneTaken(phone: string): Promise<boolean> {
  return (await load()).some((a) => a.phone && digits(a.phone) === digits(phone))
}

export async function registerAccount(input: { username: string; password?: string; email?: string; phone?: string; method: Account['method']; currency?: string }): Promise<Account> {
  const list = await load()
  const acc: Account = {
    username: input.username.trim(),
    email: input.email?.trim(),
    phone: input.phone,
    passwordHash: input.password ? await hashPassword(input.password) : null,
    method: input.method,
    currency: input.currency,
    createdAt: Date.now(),
  }
  list.push(acc)
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
  return acc
}

// Returns the matching account, or null when the identifier or password is wrong.
export async function verifyLogin(identifier: string, password: string): Promise<Account | null> {
  const acc = await findAccount(identifier)
  if (!acc || !acc.passwordHash) return null
  return (await hashPassword(password)) === acc.passwordHash ? acc : null
}

/** Adds or changes the e-mail on an existing account (e.g. after verifying it). */
export async function updateAccountEmail(username: string, email: string): Promise<void> {
  const list = await load()
  const acc = list.find((a) => a.username.toLowerCase() === norm(username))
  if (!acc) return
  acc.email = email.trim()
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
}
