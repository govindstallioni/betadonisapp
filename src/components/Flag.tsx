// ── Country flag icon ───────────────────────────────────────────────────────
// Fixture data carries flags as emoji ("🇹🇷"), but Windows browsers have no
// flag glyphs and print the two regional-indicator letters instead ("TR").
// This turns a flag emoji into its ISO code and renders the matching SVG from
// public/flags (flagcdn set, incl. gb-eng/gb-sct/gb-wls/gb-nir). Anything that
// isn't a flag emoji (🌍, 🏆, sport emoji…) is rendered as-is, since those
// glyphs do display everywhere.

const RI_BASE = 0x1f1e6 // REGIONAL INDICATOR SYMBOL LETTER A
const TAG_BASE = 0xe0000 // TAG characters used by subdivision flags (🏴 + tags)

export function flagCode(emoji: string): string | null {
  const cps = [...emoji].map((c) => c.codePointAt(0)!)
  if (cps.length === 2 && cps.every((cp) => cp >= RI_BASE && cp <= RI_BASE + 25)) {
    return cps.map((cp) => String.fromCharCode(97 + cp - RI_BASE)).join('')
  }
  // 🏴 + tag letters + CANCEL TAG, e.g. "gbeng" → "gb-eng"
  if (cps[0] === 0x1f3f4 && cps.length > 2) {
    const tag = cps.slice(1, -1).map((cp) => String.fromCharCode(cp - TAG_BASE)).join('')
    if (/^[a-z]{5}$/.test(tag)) return `${tag.slice(0, 2)}-${tag.slice(2)}`
  }
  return null
}

export default function Flag({ emoji, size = 14, className = '' }: { emoji: string; size?: number; className?: string }) {
  const code = flagCode(emoji)
  if (!code) {
    return <span className={`leading-none ${className}`} style={{ fontSize: size }}>{emoji}</span>
  }
  return (
    <img
      src={`/flags/${code}.svg`}
      alt={code.toUpperCase()}
      width={size}
      height={Math.round(size * 0.75)}
      loading="lazy"
      className={`inline-block flex-shrink-0 rounded-[2px] object-cover shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)] ${className}`}
      style={{ width: size, height: Math.round(size * 0.75) }}
    />
  )
}
