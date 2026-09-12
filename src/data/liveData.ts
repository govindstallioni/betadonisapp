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
  altUst: MatchOdd[]
  cifteSans: MatchOdd[]
  beraber: MatchOdd[]
  handikap: MatchOdd[]
  korner: MatchOdd[]
}

// Draw-less sports (no "X" outcome) don't have a real Çifte Şans/Beraberlik
// market either — reuse the same disabled '—' pill convention as the 1X2 X column.
const NO_DRAW: MatchOdd[] = [{ label: 'Evet', value: '—' }, { label: 'Hayır', value: '—' }]
const NO_DRAW_CS: MatchOdd[] = [{ label: '1X', value: '—' }, { label: '12', value: '—' }, { label: 'X2', value: '—' }]
// Corners are a football-only market — every other sport shows the same disabled convention.
const NO_CORNER: MatchOdd[] = [{ label: 'Alt Korner', value: '—' }, { label: 'Üst Korner', value: '—' }]

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
    altUst: [{ label: 'Alt 2.5', value: '1.95' }, { label: 'Üst 2.5', value: '1.80', trend: 'up' }],
    cifteSans: [{ label: '1X', value: '1.25' }, { label: '12', value: '1.35' }, { label: 'X2', value: '1.90' }],
    beraber: [{ label: 'Evet', value: '3.40' }, { label: 'Hayır', value: '1.28', trend: 'down' }],
    handikap: [{ label: 'Ev1 (-1)', value: '2.05' }, { label: 'Dep2 (+1)', value: '1.75' }],
    korner: [{ label: 'Alt 9.5 Korner', value: '1.90' }, { label: 'Üst 9.5 Korner', value: '1.90' }],
  },
  {
    id: 'mci-ars', sport: 'Futbol', league: 'İngiltere, Premier Lig', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    team1: 'Manchester City', team2: 'Arsenal', logo1: J1, logo2: J2,
    score1: 0, score2: 0, minute: '23', half: '1Y', hasStream: true,
    odds: [{ label: 'Ev1', value: '2.10' }, { label: 'X', value: '3.25', trend: 'up' }, { label: 'Dep2', value: '3.50' }],
    altUst: [{ label: 'Alt 2.5', value: '1.75', trend: 'up' }, { label: 'Üst 2.5', value: '2.05' }],
    cifteSans: [{ label: '1X', value: '1.30' }, { label: '12', value: '1.40' }, { label: 'X2', value: '1.75' }],
    beraber: [{ label: 'Evet', value: '3.25' }, { label: 'Hayır', value: '1.30' }],
    handikap: [{ label: 'Ev1 (-1)', value: '3.20' }, { label: 'Dep2 (+1)', value: '1.35' }],
    korner: [{ label: 'Alt 8.5 Korner', value: '1.85' }, { label: 'Üst 8.5 Korner', value: '1.95' }],
  },
  {
    id: 'rma-bar', sport: 'Futbol', league: 'İspanya, La Liga', flag: '🇪🇸',
    team1: 'Real Madrid', team2: 'Barcelona', logo1: J1, logo2: J2,
    score1: 1, score2: 2, minute: '78', half: '2Y', hasStream: false,
    odds: [{ label: 'Ev1', value: '3.10', trend: 'up' }, { label: 'X', value: '3.60' }, { label: 'Dep2', value: '2.15', trend: 'down' }],
    altUst: [{ label: 'Alt 2.5', value: '2.10' }, { label: 'Üst 2.5', value: '1.72', trend: 'down' }],
    cifteSans: [{ label: '1X', value: '1.65' }, { label: '12', value: '1.45' }, { label: 'X2', value: '1.35' }],
    beraber: [{ label: 'Evet', value: '3.60' }, { label: 'Hayır', value: '1.27' }],
    handikap: [{ label: 'Ev1 (+1)', value: '1.85' }, { label: 'Dep2 (-1)', value: '1.95' }],
    korner: [{ label: 'Alt 10.5 Korner', value: '1.90' }, { label: 'Üst 10.5 Korner', value: '1.90' }],
  },
  {
    id: 'bay-dor', sport: 'Futbol', league: 'Almanya, Bundesliga', flag: '🇩🇪',
    team1: 'Bayern München', team2: 'Dortmund', logo1: J2, logo2: J1,
    score1: 3, score2: 1, minute: '55', half: '2Y', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.40' }, { label: 'X', value: '4.80', trend: 'down' }, { label: 'Dep2', value: '6.50' }],
    altUst: [{ label: 'Alt 2.5', value: '2.60' }, { label: 'Üst 2.5', value: '1.45', trend: 'up' }],
    cifteSans: [{ label: '1X', value: '1.10' }, { label: '12', value: '1.20' }, { label: 'X2', value: '2.70' }],
    beraber: [{ label: 'Evet', value: '4.80' }, { label: 'Hayır', value: '1.18' }],
    handikap: [{ label: 'Ev1 (-2)', value: '2.10' }, { label: 'Dep2 (+2)', value: '1.70' }],
    korner: [{ label: 'Alt 11.5 Korner', value: '1.85' }, { label: 'Üst 11.5 Korner', value: '1.95' }],
  },
  {
    id: 'juv-nap', sport: 'Futbol', league: 'İtalya, Serie A', flag: '🇮🇹',
    team1: 'Juventus', team2: 'Napoli', logo1: J1, logo2: J2,
    score1: 0, score2: 0, minute: 'HT', half: 'HT', hasStream: false,
    odds: [{ label: 'Ev1', value: '2.55' }, { label: 'X', value: '3.10' }, { label: 'Dep2', value: '2.90', trend: 'up' }],
    altUst: [{ label: 'Alt 2.5', value: '1.85' }, { label: 'Üst 2.5', value: '1.90', trend: 'up' }],
    cifteSans: [{ label: '1X', value: '1.50' }, { label: '12', value: '1.40' }, { label: 'X2', value: '1.55' }],
    beraber: [{ label: 'Evet', value: '3.10' }, { label: 'Hayır', value: '1.29' }],
    handikap: [{ label: 'Ev1 (-1)', value: '3.40' }, { label: 'Dep2 (+1)', value: '1.30' }],
    korner: [{ label: 'Alt 9.5 Korner', value: '1.90' }, { label: 'Üst 9.5 Korner', value: '1.90' }],
  },
  // ── Basketbol ──
  {
    id: 'lal-bos', sport: 'Basketbol', league: 'ABD, NBA', flag: '🇺🇸',
    team1: 'LA Lakers', team2: 'Boston Celtics', logo1: J1, logo2: J2,
    score1: 88, score2: 84, minute: 'Q3', half: 'DA', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.72', trend: 'up' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '2.05', trend: 'down' }],
    altUst: [{ label: 'Alt 210.5', value: '1.88' }, { label: 'Üst 210.5', value: '1.88', trend: 'up' }],
    cifteSans: NO_DRAW_CS,
    beraber: NO_DRAW,
    handikap: [{ label: 'Ev1 (-4.5)', value: '1.90' }, { label: 'Dep2 (+4.5)', value: '1.90' }],
    korner: NO_CORNER,
  },
  {
    id: 'fen-efe', sport: 'Basketbol', league: 'EuroLeague', flag: '🌍',
    team1: 'Fenerbahçe', team2: 'Anadolu Efes', logo1: J2, logo2: J1,
    score1: 45, score2: 51, minute: 'Q2', half: 'DA', hasStream: true,
    odds: [{ label: 'Ev1', value: '2.30' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '1.62', trend: 'up' }],
    altUst: [{ label: 'Alt 168.5', value: '1.90' }, { label: 'Üst 168.5', value: '1.86' }],
    cifteSans: NO_DRAW_CS,
    beraber: NO_DRAW,
    handikap: [{ label: 'Ev1 (+5.5)', value: '1.90' }, { label: 'Dep2 (-5.5)', value: '1.90' }],
    korner: NO_CORNER,
  },
  // ── Tenis ──
  {
    id: 'djo-alc', sport: 'Tenis', league: 'ATP, Wimbledon', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    team1: 'Djokovic', team2: 'Alcaraz', logo1: J1, logo2: J2,
    score1: 1, score2: 1, minute: '3. Set', half: 'DA', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.90' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '1.90' }],
    altUst: [{ label: 'Alt 22.5 Oyun', value: '1.90' }, { label: 'Üst 22.5 Oyun', value: '1.90' }],
    cifteSans: NO_DRAW_CS,
    beraber: NO_DRAW,
    handikap: [{ label: 'Ev1 (-2.5 Oyun)', value: '1.90' }, { label: 'Dep2 (+2.5 Oyun)', value: '1.90' }],
    korner: NO_CORNER,
  },
  {
    id: 'swi-gau', sport: 'Tenis', league: 'WTA, Wimbledon', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    team1: 'Swiatek', team2: 'Gauff', logo1: J2, logo2: J1,
    score1: 0, score2: 1, minute: '2. Set', half: 'DA', hasStream: false,
    odds: [{ label: 'Ev1', value: '1.55', trend: 'down' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '2.45', trend: 'up' }],
    altUst: [{ label: 'Alt 20.5 Oyun', value: '1.85' }, { label: 'Üst 20.5 Oyun', value: '1.95' }],
    cifteSans: NO_DRAW_CS,
    beraber: NO_DRAW,
    handikap: [{ label: 'Ev1 (-3.5 Oyun)', value: '1.90' }, { label: 'Dep2 (+3.5 Oyun)', value: '1.90' }],
    korner: NO_CORNER,
  },
  // ── Voleybol ──
  {
    id: 'zir-van', sport: 'Voleybol', league: 'Türkiye, Sultanlar Ligi', flag: '🇹🇷',
    team1: 'VakıfBank', team2: 'Fenerbahçe', logo1: J1, logo2: J2,
    score1: 1, score2: 1, minute: '3. Set', half: 'DA', hasStream: true,
    odds: [{ label: 'Ev1', value: '1.44' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '2.75' }],
    altUst: [{ label: 'Alt 3.5 Set', value: '1.90' }, { label: 'Üst 3.5 Set', value: '1.90' }],
    cifteSans: NO_DRAW_CS,
    beraber: NO_DRAW,
    handikap: [{ label: 'Ev1 (-1.5 Set)', value: '1.90' }, { label: 'Dep2 (+1.5 Set)', value: '1.90' }],
    korner: NO_CORNER,
  },
  // ── Buz Hokeyi ──
  {
    id: 'nyr-tor', sport: 'Buz Hokeyi', league: 'ABD, NHL', flag: '🇺🇸',
    team1: 'NY Rangers', team2: 'Toronto', logo1: J2, logo2: J1,
    score1: 2, score2: 2, minute: '2. Periyot', half: 'DA', hasStream: false,
    odds: [{ label: 'Ev1', value: '2.10' }, { label: 'X', value: '3.90' }, { label: 'Dep2', value: '2.60', trend: 'up' }],
    altUst: [{ label: 'Alt 5.5', value: '1.95' }, { label: 'Üst 5.5', value: '1.85', trend: 'up' }],
    cifteSans: [{ label: '1X', value: '1.55' }, { label: '12', value: '1.30' }, { label: 'X2', value: '1.65' }],
    beraber: [{ label: 'Evet', value: '3.90' }, { label: 'Hayır', value: '1.24' }],
    handikap: [{ label: 'Ev1 (-1.5)', value: '1.90' }, { label: 'Dep2 (+1.5)', value: '1.90' }],
    korner: NO_CORNER,
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
  { label: 'Amerikan Futbolu', count: 156 },
  { label: 'Hentbol', count: 74 },
  { label: 'Beyzbol', count: 112 },
  { label: 'Kriket', count: 89 },
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
