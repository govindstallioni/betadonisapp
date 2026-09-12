// ── Suspended (locked) outcome ──────────────────────────────────────────────
// Betadonis renders an outcome that isn't available to bet as a padlock in an
// otherwise empty cell — no label, no price (see the market rows in the client's
// reference shots). Our data marks those outcomes with an em dash, e.g. the
// draw column on a sport that can't end level.

/** The value our fixture data uses to mean "no price / not bettable". */
export const SUSPENDED = '—'

export function isSuspended(value: string): boolean {
  return value === SUSPENDED
}

/** Padlock glyph shown in place of the label + price. */
export default function OddLock({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94a3b8"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Bahise kapalı"
      role="img"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
