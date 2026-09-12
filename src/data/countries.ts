// ── Shared country/flag set ─────────────────────────────────────────────────
// Task 15 asked for one flag icon set reused everywhere (pre-match, live
// betting, region sheets and menus); task 24 then asked that the region picker
// list country *names* alongside those flags rather than a bare emoji.
//
// Fixtures carry only a flag emoji, so this maps that emoji to the label shown
// next to it. Anything unmapped falls back to a neutral "Diğer" so a new flag
// in the data can never render a blank row.

export const COUNTRY_NAMES: Record<string, string> = {
  '🇹🇷': 'Türkiye',
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'İngiltere',
  '🇪🇸': 'İspanya',
  '🇮🇹': 'İtalya',
  '🇩🇪': 'Almanya',
  '🇺🇸': 'ABD',
  '🇪🇺': 'Avrupa',
  '🏆': 'Turnuvalar',
  '🌍': 'Uluslararası',
}

export function countryName(flag: string): string {
  return COUNTRY_NAMES[flag] ?? 'Diğer'
}
