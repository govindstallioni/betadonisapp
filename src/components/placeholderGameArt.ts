// Fallback thumbnail for casino/slot games.
//
// Task 21 replaced the curated game list with the client's own catalogue and
// its real artwork (public/casino, public/canli-casino), so this is no longer
// what the screens normally show — it is the safety net behind them. When a
// file is missing or fails to load, `artFallback` swaps in a generated
// gradient + motif derived from the game's name, so the card still reads
// instead of showing a broken-image icon.
//
// Square (1:1) on purpose, matching both the real 240x240 source art and the
// aspect-[1/1] the rails now render at.

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// A handful of generic slot-machine motifs, centered on (150,150) —
// plain shapes, not any provider's actual character art or logo.
const MOTIFS: ((c: string) => string)[] = [
  // Gem / diamond
  (c) => `<path d="M150 95 L200 145 L150 220 L100 145 Z" fill="${c}" />`,
  // Cherries
  (c) => `<circle cx="128" cy="170" r="26" fill="${c}" /><circle cx="176" cy="180" r="26" fill="${c}" /><path d="M150 100 C150 140, 128 140, 128 144 M150 100 C150 145, 176 148, 176 154" stroke="${c}" stroke-width="5" fill="none" />`,
  // Bell
  (c) => `<path d="M150 90 C120 90 110 120 110 150 L110 170 L95 190 L205 190 L190 170 L190 150 C190 120 180 90 150 90 Z" fill="${c}" /><circle cx="150" cy="205" r="10" fill="${c}" />`,
  // Star
  (c) => `<polygon points="150,80 165,125 213,125 174,153 189,198 150,171 111,198 126,153 87,125 135,125" fill="${c}" />`,
  // Crown
  (c) => `<path d="M95 180 L105 110 L135 145 L150 100 L165 145 L195 110 L205 180 Z" fill="${c}" />`,
  // Four-leaf clover
  (c) => `<circle cx="130" cy="140" r="24" fill="${c}" /><circle cx="170" cy="140" r="24" fill="${c}" /><circle cx="130" cy="180" r="24" fill="${c}" /><circle cx="170" cy="180" r="24" fill="${c}" />`,
  // Dice
  (c) => `<rect x="105" y="115" width="90" height="90" rx="14" fill="${c}" /><circle cx="130" cy="140" r="7" fill="#1a2332" /><circle cx="170" cy="140" r="7" fill="#1a2332" /><circle cx="130" cy="180" r="7" fill="#1a2332" /><circle cx="170" cy="180" r="7" fill="#1a2332" /><circle cx="150" cy="160" r="7" fill="#1a2332" />`,
  // Coin
  (c) => `<circle cx="150" cy="155" r="52" fill="${c}" /><circle cx="150" cy="155" r="38" fill="none" stroke="#1a2332" stroke-width="3" opacity="0.35" />`,
  // Lucky seven
  (c) => `<text x="150" y="195" font-size="120" font-weight="900" text-anchor="middle" fill="${c}" font-family="Arial, sans-serif">7</text>`,
]

// A curated set of pleasant two-color gradient pairs (hue-shifted so
// nothing clashes), picked deterministically per game.
const PALETTES: [string, string][] = [
  ['#7c3aed', '#4c1d95'],
  ['#0E8FCF', '#0a3d5c'],
  ['#e11d48', '#7f1d1d'],
  ['#f59e0b', '#92400e'],
  ['#059669', '#064e3b'],
  ['#db2777', '#831843'],
  ['#2563eb', '#1e3a8a'],
  ['#ea580c', '#7c2d12'],
  ['#0d9488', '#134e4a'],
  ['#a855f7', '#581c87'],
]

export function gameArt(name: string, provider?: string): string {
  const h = hashStr(name + (provider ?? ''))
  const [c1, c2] = PALETTES[h % PALETTES.length]
  const motif = MOTIFS[Math.floor(h / PALETTES.length) % MOTIFS.length]
  const iconColor = 'rgba(255,255,255,0.92)'
  const gradId = `g${h}`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#${gradId})" />
    <circle cx="150" cy="150" r="95" fill="rgba(255,255,255,0.08)" />
    ${motif(iconColor)}
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** onError handler that paints the generated motif when real art fails. */
export function artFallback(name: string, provider?: string) {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    if (el.dataset.fallback) return          // already swapped; avoid a loop
    el.dataset.fallback = '1'
    el.src = gameArt(name, provider)
  }
}
