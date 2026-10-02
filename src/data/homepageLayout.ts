// ── Homepage block layout store (localStorage) ──────────────────────────────
// Task 2: drag-and-drop (here: reorder + on/off) for the homepage block
// areas. A plain module like withdrawals.ts / coupons.ts — this is read by
// the homepage itself and by the "Giriş Sayfası Düzeni" settings screen,
// not across the whole app, so it doesn't need a React provider.
//
// Static export has no backend, so like every other per-user preference in
// this app (favorites, betslip, ADC, withdrawals) the layout is per-device,
// stored in localStorage — there is nowhere else to put it.

export interface HomepageBlock {
  id: string
  /** Shown in the "Giriş Sayfası Düzeni" settings list. */
  label: string
  /** Margin-top class the block currently renders with on the homepage —
   *  kept per-block so the default (unmodified) order renders pixel-identical
   *  to the old hardcoded JSX. */
  mt: string
  /** False for the casino/slots/virtual blocks that the "Sporlar" view
   *  (/?view=sports) hides regardless of the user's own on/off choice. */
  showInSports: boolean
}

// Order here is the current default homepage order (src/app/page.tsx).
export const HOMEPAGE_BLOCKS: HomepageBlock[] = [
  { id: 'promo', label: 'Promosyonlar', mt: 'mt-3', showInSports: false },
  { id: 'adc', label: 'Adonis Coin', mt: 'mt-3', showInSports: true },
  { id: 'callme', label: 'Sizi Arayalım', mt: 'mt-3', showInSports: true },
  { id: 'megajackpot', label: 'Mega Jackpot', mt: 'mt-4', showInSports: false },
  { id: 'topevents', label: 'Öne Çıkan Etkinlikler', mt: 'mt-4', showInSports: false },
  { id: 'sonkazananlar', label: 'Son Kazananlar', mt: 'mt-4', showInSports: false },
  { id: 'livebets', label: 'En İyi Canlı Bahisler', mt: 'mt-5', showInSports: true },
  { id: 'toppreMatch', label: 'En İyi Maç Öncesi Bahisler', mt: 'mt-3', showInSports: true },
  { id: 'todaysparlays', label: "Bugünün Kombineleri", mt: 'mt-3', showInSports: true },
  { id: 'gamecategories', label: 'Tüm Oyunlar', mt: 'mt-3', showInSports: false },
  { id: 'carkikazananlar', label: 'Çark Kazananları', mt: 'mt-3', showInSports: false },
  { id: 'toptournaments', label: 'Canlı Turnuvalar', mt: 'mt-3', showInSports: false },
  { id: 'topproviders', label: 'Sağlayıcılar', mt: 'mt-3', showInSports: false },
  { id: 'ensonkazananlar', label: 'En Son Kazananlar', mt: 'mt-3', showInSports: false },
  { id: 'casinocategories', label: 'Casino Kategorileri', mt: 'mt-4', showInSports: false },
  { id: 'inthespotlight', label: 'Öne Çıkanlar', mt: 'mt-4', showInSports: false },
  { id: 'selectedforyou', label: 'Sizin İçin Seçtiklerimiz', mt: 'mt-4', showInSports: false },
  { id: 'dailywheel', label: 'Şans Çarkı', mt: 'mt-3', showInSports: false },
  { id: 'virtualbets', label: 'Sanal Bahisler', mt: 'mt-3', showInSports: false },
]

export const DEFAULT_ORDER = HOMEPAGE_BLOCKS.map(b => b.id)
const BLOCK_BY_ID = new Map(HOMEPAGE_BLOCKS.map(b => [b.id, b]))

export interface HomepageLayout {
  order: string[]
  /** Ids the user switched off — absent (not an explicit false flag per id)
   *  so new blocks added in a future update default to visible. */
  hidden: string[]
}

const KEY = 'bta_homepage_layout'

function sanitize(layout: Partial<HomepageLayout> | null): HomepageLayout {
  const knownIds = new Set(DEFAULT_ORDER)
  const order = Array.isArray(layout?.order) ? layout!.order.filter(id => knownIds.has(id)) : []
  // Any block missing from a stored order (new block shipped since, or a
  // corrupt entry dropped above) is appended at the end rather than lost.
  for (const id of DEFAULT_ORDER) if (!order.includes(id)) order.push(id)
  const hidden = Array.isArray(layout?.hidden) ? layout!.hidden.filter(id => knownIds.has(id)) : []
  return { order, hidden }
}

export function loadHomepageLayout(): HomepageLayout {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return sanitize(JSON.parse(raw))
  } catch {}
  return { order: [...DEFAULT_ORDER], hidden: [] }
}

export function saveHomepageLayout(layout: HomepageLayout) {
  try { localStorage.setItem(KEY, JSON.stringify(layout)) } catch {}
}

export function blockDef(id: string): HomepageBlock | undefined {
  return BLOCK_BY_ID.get(id)
}

/** The ids a given layout actually renders, in order, for a given view. */
export function visibleBlockIds(layout: HomepageLayout, sportsOnly: boolean): string[] {
  return layout.order.filter(id => {
    const def = BLOCK_BY_ID.get(id)
    if (!def) return false
    if (layout.hidden.includes(id)) return false
    if (sportsOnly && !def.showInSports) return false
    return true
  })
}
