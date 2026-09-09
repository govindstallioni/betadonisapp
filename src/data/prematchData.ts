// ── Shared pre-match ("Maç Öncesi") dataset ─────────────────────────────────
// One source of truth for the Maç Öncesi top section (PreMatchScreen), the
// home "En iyi Maç Öncesi" carousel (TopPreMatch) and match-detail links.
// Mirrors liveData.ts's Match/liveSportCats shape so the sport-category strip
// can filter pre-match fixtures the same way CanliBahisScreen filters live ones.
// Football ids match MatchDetailScreen.tsx's matchesData 1:1 so /match?id=...
// opens the correct fixture — see the matching entries added there.

import { MatchOdd, SportCat } from './liveData'

export interface PreMatch {
  id: string
  sport: string
  league: string
  flag: string
  team1: string
  team2: string
  logo1: string
  logo2: string
  date: string
  time: string
  hasStream: boolean
  popular?: boolean
  odds: MatchOdd[]
}

const J1 = '/teams/jersey1.png'
const J2 = '/teams/jersey2.png'

export const preMatches: PreMatch[] = [
  // ── Futbol (ids match MatchDetailScreen.tsx's matchesData) ──
  {
    id: 'bes-tra', sport: 'Futbol', league: 'Türkiye, Süper Lig', flag: '🇹🇷',
    team1: 'Beşiktaş', team2: 'Trabzonspor', logo1: J1, logo2: J2,
    date: '25 Mar', time: '20:00', hasStream: true, popular: true,
    odds: [{ label: 'Ev1', value: '1.85', trend: 'up' }, { label: 'X', value: '3.40' }, { label: 'Dep2', value: '4.20', trend: 'down' }],
  },
  {
    id: 'liv-che', sport: 'Futbol', league: 'İngiltere, Premier Lig', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    team1: 'Liverpool', team2: 'Chelsea', logo1: J2, logo2: J1,
    date: '26 Mar', time: '22:00', hasStream: true, popular: true,
    odds: [{ label: 'Ev1', value: '1.55' }, { label: 'X', value: '4.10', trend: 'up' }, { label: 'Dep2', value: '5.20', trend: 'down' }],
  },
  {
    id: 'atl-sev', sport: 'Futbol', league: 'İspanya, La Liga', flag: '🇪🇸',
    team1: 'Atletico Madrid', team2: 'Sevilla', logo1: J1, logo2: J2,
    date: '27 Mar', time: '19:30', hasStream: false, popular: false,
    odds: [{ label: 'Ev1', value: '2.10', trend: 'down' }, { label: 'X', value: '3.25' }, { label: 'Dep2', value: '3.50', trend: 'up' }],
  },
  {
    id: 'gs-bay', sport: 'Futbol', league: 'Şampiyonlar Ligi, Grup Aşaması', flag: '🏆',
    team1: 'Galatasaray', team2: 'Bayern Münih', logo1: J1, logo2: J2,
    date: '28 Mar', time: '19:30', hasStream: true, popular: true,
    odds: [{ label: 'Ev1', value: '4.50', trend: 'up' }, { label: 'X', value: '3.80' }, { label: 'Dep2', value: '1.65', trend: 'down' }],
  },
  {
    id: 'rma-mci', sport: 'Futbol', league: 'Şampiyonlar Ligi, Grup Aşaması', flag: '🏆',
    team1: 'Real Madrid', team2: 'Manchester City', logo1: J2, logo2: J1,
    date: '28 Mar', time: '22:00', hasStream: true, popular: false,
    odds: [{ label: 'Ev1', value: '2.40' }, { label: 'X', value: '3.60', trend: 'down' }, { label: 'Dep2', value: '2.75', trend: 'up' }],
  },
  // ── Basketbol (new id — matching entry added to MatchDetailScreen.tsx) ──
  {
    id: 'bos-gsw', sport: 'Basketbol', league: 'ABD, NBA', flag: '🇺🇸',
    team1: 'Boston Celtics', team2: 'Golden State Warriors', logo1: J1, logo2: J2,
    date: '25 Mar', time: '21:00', hasStream: true, popular: true,
    odds: [{ label: 'Ev1', value: '1.65', trend: 'up' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '2.20', trend: 'down' }],
  },
  // ── Tenis (new id) ──
  {
    id: 'sin-zve', sport: 'Tenis', league: 'ATP, Masters 1000', flag: '🌍',
    team1: 'Sinner', team2: 'Zverev', logo1: J2, logo2: J1,
    date: '26 Mar', time: '18:00', hasStream: true, popular: true,
    odds: [{ label: 'Ev1', value: '1.45' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '2.65', trend: 'up' }],
  },
  // ── Voleybol (new id) ──
  {
    id: 'vak-ecz', sport: 'Voleybol', league: 'Türkiye, Sultanlar Ligi', flag: '🇹🇷',
    team1: 'VakıfBank', team2: 'Eczacıbaşı', logo1: J1, logo2: J2,
    date: '27 Mar', time: '19:00', hasStream: false, popular: true,
    odds: [{ label: 'Ev1', value: '1.80', trend: 'down' }, { label: 'X', value: '—' }, { label: 'Dep2', value: '1.95' }],
  },
  // ── Buz Hokeyi (new id) ──
  {
    id: 'tor-bos', sport: 'Buz Hokeyi', league: 'ABD, NHL', flag: '🇺🇸',
    team1: 'Toronto Maple Leafs', team2: 'Boston Bruins', logo1: J2, logo2: J1,
    date: '28 Mar', time: '20:30', hasStream: true, popular: true,
    odds: [{ label: 'Ev1', value: '2.05' }, { label: 'X', value: '3.70', trend: 'up' }, { label: 'Dep2', value: '2.50' }],
  },
]

export const preMatchSportCats: SportCat[] = [
  { label: 'Futbol', count: 2534 },
  { label: 'Basketbol', count: 363 },
  { label: 'Tenis', count: 298 },
  { label: 'Voleybol', count: 92 },
  { label: 'Buz Hokeyi', count: 248 },
]
