// ── Payment-provider branding, shared by deposit and withdrawal ─────────────
// Task 29. Lives in its own module because both screens show the same
// providers: "Papara (MPAY)" appears on /kupon/deposit and, one tap away
// through the Para Yatırma / Para Çekme toggle, on /kupon/withdraw. A local
// copy in each screen meant the same brand rendered two different ways.
//
// The live site's deposit grid (parayatirma.png) shows real provider logos,
// but at 393x852 each one is roughly 70x40 lossy pixels — cropping and
// upscaling those would look worse than the initials badges they replace.
// What the screenshot does give us reliably is the brands and their colours,
// so these are redrawn as inline SVG wordmarks. When the client supplies the
// real logo files, only LOGOS below has to change.
//
// Solid brand-coloured tiles rather than white ones: SVG fills are not touched
// by the html.dark class overrides in globals.css, so a tile carries its own
// contrast into dark mode exactly like a real logo would.

export type LogoKey = 'havaleEft' | 'fast' | 'hizli' | 'papara'

export const LOGOS: Record<LogoKey, React.ReactNode> = {
  havaleEft: (
    <>
      <rect width="84" height="36" rx="6" fill="#1565c0" />
      <text x="42" y="17" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontStyle="italic" fontFamily="system-ui, sans-serif">fast</text>
      <text x="42" y="29" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" letterSpacing="1.2" fontFamily="system-ui, sans-serif">HAVALE</text>
    </>
  ),
  fast: (
    <>
      <rect width="84" height="36" rx="6" fill="#1b222e" />
      <path d="M12 12h13l-5 6h5l-9 9 3-7h-5z" fill="#f97316" />
      <text x="52" y="17" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="800" fontStyle="italic" fontFamily="system-ui, sans-serif">FAST</text>
      <text x="52" y="29" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" letterSpacing="0.8" fontFamily="system-ui, sans-serif">HAVALE</text>
    </>
  ),
  hizli: (
    <>
      <rect width="84" height="36" rx="6" fill="#1273c7" />
      <text x="42" y="17" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800" fontFamily="system-ui, sans-serif">hızlı</text>
      <text x="42" y="29" textAnchor="middle" fill="#bfe0f7" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">havale</text>
    </>
  ),
  papara: (
    <>
      <rect width="84" height="36" rx="6" fill="#cf2b76" />
      <circle cx="17" cy="18" r="7" fill="#fff" />
      <circle cx="17" cy="18" r="2.6" fill="#cf2b76" />
      <text x="52" y="23" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">papara</text>
    </>
  ),
}

// ── Fallback badge ──────────────────────────────────────────────────────────
// For every method the reference does not show a logo for: a distinct,
// deterministic coloured badge rather than one shared type-icon.
const BADGE_COLORS = ['#0E8FCF', '#27ae60', '#e74c3c', '#f59e0b', '#7c3aed', '#0891b2', '#d97706', '#c026d3', '#16a34a', '#2563eb']

function initials(name: string) {
  const words = name.split(/[\s()/-]+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function badgeColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return BADGE_COLORS[hash % BADGE_COLORS.length]
}

export function MethodBadge({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-white font-extrabold"
      style={{ width: size, height: size, background: badgeColor(name), fontSize: size * 0.34 }}
    >
      {initials(name)}
    </div>
  )
}

/** A provider's brand wordmark, falling back to the generated initials badge
 *  for the methods the reference does not show a logo for. `size` is the
 *  wordmark's width; the badge fallback is sized to match its visual weight. */
export function MethodLogo({ name, logo, size = 84 }: { name: string; logo?: LogoKey; size?: number }) {
  if (!logo) return <MethodBadge name={name} size={Math.round(size * 0.5)} />
  return (
    <svg width={size} height={size * (36 / 84)} viewBox="0 0 84 36" role="img" aria-label={name}>
      {LOGOS[logo]}
    </svg>
  )
}
