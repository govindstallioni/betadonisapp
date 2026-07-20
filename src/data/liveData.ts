// ── Shared live / pre-match dataset ─────────────────────────────────────────
// One source of truth for the CANLI BAHİS match-list screen, the home
// "En iyi CANLI BAHİS" carousel and (later) the per-league match lists.
// Matches carry a `hasStream` flag so the live-broadcast filter toggle is a
// one-line filter, and a `sport` key so the sport-category strip filters them.

export interface MatchOdd {
  label: string
  value: string
  trend?: 'up' | 'down'
}

export interface Match {
  id: string
  sport: string
  league: string
  flag: string
  team1: string
  team2: string
  logo1: string
  logo2: string
  score1: number
  score2: number
  minute: string
  half: '1Y' | '2Y' | 'HT' | 'DA'
  hasStream: boolean
  odds: MatchOdd[]
}

const J1 = '/teams/jersey1.png'
const J2 = '/teams/jersey2.png'

// Live matches, grouped implicitly by `sport`.
export const liveMatches: Match[] = [
  // ── Futbol ──
  {
    id: 'gal-fen', sport: 'Futbol', league: 'Türkiye, Süper Lig', flag: '🇹🇷',
    team1: 'Galatasaray', team2: 'Fenerbahçe', logo1: J2, logo2: J1,
    score1: 2, score2: 1, minute: '67', half: '2Y', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.85', trend: 'up' }, { label: 'X', value: '3.40' }, { label: 'Dep2', value: '4.20', trend: 'down' }],
  },
  {
    id: 'mci-ars', sport: 'Futbol', league: 'İngiltere, Premier Lig', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    team1: 'Manchester City', team2: 'Arsenal', logo1: J1, logo2: J2,
    score1: 0, score2: 0, minute: '23', half: '1Y', hasStream: true,
    odds: [{ label: 'Ev1', value: '2.10' }, { label: 'X', value: '3.25', trend: 'up' }, { label: 'Dep2', value: '3.50' }],
  },
  {
    id: 'rma-bar', sport: 'Futbol', league: 'İspanya, La Liga', flag: '🇪🇸',
    team1: 'Real Madrid', team2: 'Barcelona', logo1: J1, logo2: J2,
    score1: 1, score2: 2, minute: '78', half: '2Y', hasStream: false,
    odds: [{ label: 'Ev1', value: '3.10', trend: 'up' }, { label: 'X', value: '3.60' }, { label: 'Dep2', value: '2.15', trend: 'down' }],
  },
  {
    id: 'bay-dor', sport: 'Futbol', league: 'Almanya, Bundesliga', flag: '🇩🇪',
    team1: 'Bayern München', team2: 'Dortmund', logo1: J2, logo2: J1,
    score1: 3, score2: 1, minute: '55', half: '2Y', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.40' }, { label: 'X', value: '4.80', trend: 'down' }, { label: 'Dep2', value: '6.50' }],
  },
  {
    id: 'juv-nap', sport: 'Futbol', league: 'İtalya, Serie A', flag: '🇮🇹',
    team1: 'Juventus', team2: 'Napoli', logo1: J1, logo2: J2,
    score1: 0, score2: 0, minute: 'HT', half: 'HT', hasStream: false,
    odds: [{ label: 'Ev1', value: '2.55' }, { label: 'X', value: '3.10' }, { label: 'Dep2', value: '2.90', trend: 'up' }],
  },
  // ── Basketbol ──
  {
    id: 'lal-bos', sport: 'Basketbol', league: 'ABD, NBA', flag: '🇺🇸',
    team1: 'LA Lakers', team2: 'Boston Celtics', logo1: J1, logo2: J2,
    score1: 88, score2: 84, minute: 'Q3', half: 'DA', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.72', trend: 'up' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '2.05', trend: 'down' }],
  },
  {
    id: 'fen-efe', sport: 'Basketbol', league: 'EuroLeague', flag: '🌍',
    team1: 'Fenerbahçe', team2: 'Anadolu Efes', logo1: J2, logo2: J1,
    score1: 45, score2: 51, minute: 'Q2', half: 'DA', hasStream: true,
    odds: [{ label: 'Ev1', value: '2.30' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '1.62', trend: 'up' }],
  },
  // ── Tenis ──
  {
    id: 'djo-alc', sport: 'Tenis', league: 'ATP, Wimbledon', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    team1: 'Djokovic', team2: 'Alcaraz', logo1: J1, logo2: J2,
    score1: 1, score2: 1, minute: '3. Set', half: 'DA', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.90' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '1.90' }],
  },
  {
    id: 'swi-gau', sport: 'Tenis', league: 'WTA, Wimbledon', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    team1: 'Swiatek', team2: 'Gauff', logo1: J2, logo2: J1,
    score1: 0, score2: 1, minute: '2. Set', half: 'DA', hasStream: false,
    odds: [{ label: 'Ev1', value: '1.55', trend: 'down' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '2.45', trend: 'up' }],
  },
  // ── Voleybol ──
  {
    id: 'zir-van', sport: 'Voleybol', league: 'Türkiye, Sultanlar Ligi', flag: '🇹🇷',
    team1: 'VakıfBank', team2: 'Fenerbahçe', logo1: J1, logo2: J2,
    score1: 1, score2: 1, minute: '3. Set', half: 'DA', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.44' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '2.75' }],
  },
  // ── Buz Hokeyi ──
  {
    id: 'nyr-tor', sport: 'Buz Hokeyi', league: 'ABD, NHL', flag: '🇺🇸',
    team1: 'NY Rangers', team2: 'Toronto', logo1: J2, logo2: J1,
    score1: 2, score2: 2, minute: '2. Periyot', half: 'DA', hasStream: false,
    odds: [{ label: 'Ev1', value: '2.10' }, { label: 'X', value: '3.90' }, { label: 'Dep2', value: '2.60', trend: 'up' }],
  },
]

// Sport categories shown in the horizontal strip (with live match counts).
export interface SportCat {
  label: string
  count: number
}

export const liveSportCats: SportCat[] = [
  { label: 'Futbol', count: 2534 },
  { label: 'Basketbol', count: 363 },
  { label: 'Tenis', count: 298 },
  { label: 'Voleybol', count: 92 },
  { label: 'Buz Hokeyi', count: 248 },
  { label: 'Masa Tenisi', count: 541 },
]

export function halfText(half: Match['half']) {
  if (half === '1Y') return '1. yarı'
  if (half === '2Y') return '2. yarı'
  if (half === 'HT') return 'Devre arası'
  return ''
}

// Live matches for a given league (tapping a league in the tournament list).
// Prototype: return a curated set of live football fixtures relabeled to the
// selected league so the list is always populated and header-consistent.
export function leagueMatches(league: string, flag?: string): Match[] {
  const ids = ['gal-fen', 'mci-ars', 'rma-bar', 'bay-dor', 'juv-nap']
  return liveMatches
    .filter((m) => ids.includes(m.id))
    .map((m) => ({ ...m, league, flag: flag || m.flag }))
}
