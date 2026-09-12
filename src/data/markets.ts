// ── Shared market identity ──────────────────────────────────────────────────
// The match-result market is offered on almost every surface (match cards, the
// home carousels, league lists, the match detail). Its title is both what the
// user reads AND part of the bet-slip id, so the two must never drift: a pick
// added from a card has to dedupe with the same pick added on the detail page.
//
// Betadonis labels this market "Maç sonucu"; we title-case it to match the rest
// of our market names (Çifte Şans, İlk Yarı Sonucu, Doğru Skor).

export const MATCH_RESULT = 'Maç Sonucu'

// Canonical outcome labels for the match-result market. Surfaces may *display*
// these differently (uppercase, say) but must pass these exact strings to the
// bet slip, or the same pick lands twice.
export const MATCH_RESULT_PICKS = { home: 'Ev1', draw: 'X', away: 'Dep2' } as const

/** Bet-slip id for a match-result outcome. The one place this format lives. */
export function matchResultOddId(matchId: string, label: string): string {
  return `${matchId}::${MATCH_RESULT}::${label}`
}
