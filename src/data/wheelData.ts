// Shared Lucky Wheel (Şans Çarkı) constants — used by SpinWheel.tsx (applies
// the multiplier to winnings) and DayMultiplierStrip.tsx (displays it) so the
// two stay in sync by construction.

// Client-specified per-day payout multiplier for the 14-day wheel program.
// Only 7 values were given for a 14-day window — read as a repeating weekly
// pattern (day 8 reuses day 1's multiplier, day 9 reuses day 2's, etc.),
// applied via DAY_MULTIPLIERS[(dayNumber - 1) % 7].
export const DAY_MULTIPLIERS = [1, 1, 1.5, 1, 1.5, 1, 1]

export const WHEEL_WINDOW_DAYS = 14
