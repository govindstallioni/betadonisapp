// ── E-sports game list ──────────────────────────────────────────────────────
// Shared by the E-Spor page (/e-spor), the Sporlar screen's E-Spor tab and the
// home "CANLI Turnuvalar" section, which the client confirmed is e-sports.

import type { Match, MatchOdd } from './liveData'
import type { PreMatch } from './prematchData'

export const ESPORTS_HREF = '/e-spor'

// Game-title icon, keyed by the same label as `sport` on e-sports fixtures.
export const ESPORT_ICON: Record<string, string> = {
  'Dota 2': '/icons/dota2_5.png',
  'Call of Duty': '/icons/callOfDuty_5.png',
  'King Of Glory': '/icons/kingOfGlory_5.png',
  'League of Legends': '/icons/LOL_5.png',
  'Rainbow Six': '/icons/rainbowSix_5.png',
  'Counter-Strike': '/icons/CS2_5.png',
  'e-Dövüş': '/icons/eFighting_5.png',
  'e-Tenis': '/icons/eTennis_5.png',
  'Mobile Legends': '/icons/mobileLegends_5.png',
  'Valorant': '/icons/valorant_5.png',
}

export const esportGames = [
  { label: 'Dota 2', count: 28, icon: <img src={ESPORT_ICON['Dota 2']} width={20} height={20} style={{ objectFit: 'contain' }} alt="Dota 2" /> },
  { label: 'Call of Duty', count: 14, icon: <img src={ESPORT_ICON['Call of Duty']} width={20} height={20} style={{ objectFit: 'contain' }} alt="Call of Duty" /> },
  { label: 'King Of Glory', count: 11, icon: <img src={ESPORT_ICON['King Of Glory']} width={20} height={20} style={{ objectFit: 'contain' }} alt="King Of Glory" /> },
  { label: 'League of Legends', count: 35, icon: <img src={ESPORT_ICON['League of Legends']} width={20} height={20} style={{ objectFit: 'contain' }} alt="League of Legends" /> },
  { label: 'Rainbow Six', count: 9, icon: <img src={ESPORT_ICON['Rainbow Six']} width={20} height={20} style={{ objectFit: 'contain' }} alt="Rainbow Six" /> },
  { label: 'Counter-Strike', count: 52, icon: <img src={ESPORT_ICON['Counter-Strike']} width={20} height={20} style={{ objectFit: 'contain' }} alt="Counter-Strike" /> },
  { label: 'e-Dövüş', count: 8, icon: <img src={ESPORT_ICON['e-Dövüş']} width={20} height={20} style={{ objectFit: 'contain' }} alt="e-Dövüş" /> },
  { label: 'e-Tenis', count: 16, icon: <img src={ESPORT_ICON['e-Tenis']} width={20} height={20} style={{ objectFit: 'contain' }} alt="e-Tenis" /> },
  { label: 'Mobile Legends', count: 22, icon: <img src={ESPORT_ICON['Mobile Legends']} width={20} height={20} style={{ objectFit: 'contain' }} alt="Mobile Legends" /> },
  { label: 'Valorant', count: 18, icon: <img src={ESPORT_ICON['Valorant']} width={20} height={20} style={{ objectFit: 'contain' }} alt="Valorant" /> },
]

// ── E-sports fixtures ───────────────────────────────────────────────────────
// Same shapes as liveData / prematchData so MatchCard and PreMatchCard render
// them unchanged. `sport` is the game title; `flag` is empty, which makes the
// cards show the game icon in the league header instead of a country flag.
// E-sports have no draw, so the X column uses the suspended '—' convention.

const NO_DRAW: MatchOdd[] = [{ label: 'Evet', value: '—' }, { label: 'Hayır', value: '—' }]
const NO_DRAW_CS: MatchOdd[] = [{ label: '1X', value: '—' }, { label: '12', value: '—' }, { label: 'X2', value: '—' }]
const NO_CORNER: MatchOdd[] = [{ label: 'Alt Korner', value: '—' }, { label: 'Üst Korner', value: '—' }]

function live(
  id: string, sport: string, league: string, team1: string, team2: string,
  score1: number, score2: number, map: string, hasStream: boolean,
  ev1: string, dep2: string, total: string, hcp: [string, string],
): Match {
  const logo = ESPORT_ICON[sport]
  return {
    id, sport, league, flag: '', team1, team2, logo1: logo, logo2: logo,
    score1, score2, minute: map, half: 'DA', hasStream,
    odds: [{ label: 'Ev1', value: ev1, trend: 'up' }, { label: 'X', value: '—' }, { label: 'Dep2', value: dep2, trend: 'down' }],
    altUst: [{ label: `Alt ${total}`, value: '1.85' }, { label: `Üst ${total}`, value: '1.90' }],
    cifteSans: NO_DRAW_CS,
    beraber: NO_DRAW,
    handikap: [{ label: `Ev1 (${hcp[0]})`, value: '1.95' }, { label: `Dep2 (${hcp[1]})`, value: '1.80' }],
    korner: NO_CORNER,
  }
}

export const esportLiveMatches: Match[] = [
  live('esp-spi-navi', 'Counter-Strike', 'IEM Cologne', 'Team Spirit', 'Natus Vincere', 1, 0, 'Harita 2', true, '1.45', '2.65', '2.5 Harita', ['-1.5', '+1.5']),
  live('esp-mouz-g2', 'Counter-Strike', 'ESL Pro League', 'MOUZ', 'G2 Esports', 0, 1, 'Harita 2', false, '2.30', '1.58', '2.5 Harita', ['+1.5', '-1.5']),
  live('esp-t1-geng', 'League of Legends', 'LCK Summer', 'T1', 'Gen.G', 1, 1, 'Oyun 3', true, '1.95', '1.85', '3.5 Oyun', ['+1.5', '-1.5']),
  live('esp-liq-tun', 'Dota 2', 'The International', 'Team Liquid', 'Tundra Esports', 0, 0, 'Harita 1', true, '1.80', '2.00', '2.5 Harita', ['-1.5', '+1.5']),
  live('esp-fnc-sen', 'Valorant', 'VCT Masters', 'Fnatic', 'Sentinels', 1, 0, 'Harita 2', true, '1.52', '2.45', '2.5 Harita', ['-1.5', '+1.5']),
  live('esp-onic-rrq', 'Mobile Legends', 'MPL Indonesia', 'ONIC', 'RRQ Hoshi', 2, 1, 'Oyun 4', false, '1.35', '3.10', '4.5 Oyun', ['-1.5', '+1.5']),
  live('esp-optic-faze', 'Call of Duty', 'CDL Major', 'OpTic Texas', 'Atlanta FaZe', 1, 2, 'Harita 4', false, '2.60', '1.48', '4.5 Harita', ['+1.5', '-1.5']),
]

function pre(
  id: string, sport: string, league: string, team1: string, team2: string,
  date: string, time: string, ev1: string, dep2: string, opts: { stream?: boolean; popular?: boolean } = {},
): PreMatch {
  const logo = ESPORT_ICON[sport]
  return {
    id, sport, league, flag: '', team1, team2, logo1: logo, logo2: logo, date, time,
    hasStream: !!opts.stream, popular: opts.popular,
    odds: [{ label: 'Ev1', value: ev1 }, { label: 'X', value: '—' }, { label: 'Dep2', value: dep2 }],
  }
}

export const esportPreMatches: PreMatch[] = [
  pre('esp-vit-faze', 'Counter-Strike', 'IEM Cologne', 'Team Vitality', 'FaZe Clan', '18 Eyl', '18:00', '1.40', '2.85', { stream: true, popular: true }),
  pre('esp-blg-fnc', 'League of Legends', 'Worlds', 'Bilibili Gaming', 'Fnatic', '18 Eyl', '12:00', '1.30', '3.40', { stream: true, popular: true }),
  pre('esp-gg-fal', 'Dota 2', 'The International', 'Gaimin Gladiators', 'Team Falcons', '19 Eyl', '15:30', '2.05', '1.75', { popular: true }),
  pre('esp-prx-th', 'Valorant', 'VCT Champions', 'Paper Rex', 'Team Heretics', '19 Eyl', '20:00', '1.70', '2.10', { stream: true }),
  pre('esp-w7m-faze', 'Rainbow Six', 'BLAST R6 Major', 'w7m esports', 'FaZe Clan', '20 Eyl', '17:00', '1.85', '1.95'),
  pre('esp-wolves-ag', 'King Of Glory', 'KPL', 'Chongqing Wolves', 'AG Super Play', '20 Eyl', '11:00', '2.20', '1.65'),
  pre('esp-etenis-1', 'e-Tenis', 'Setka Cup', 'A. Petrov', 'M. Kovalenko', '18 Eyl', '14:45', '1.75', '2.00'),
  pre('esp-efight-1', 'e-Dövüş', 'Tekken World Tour', 'Arslan Ash', 'Knee', '21 Eyl', '19:00', '1.60', '2.25', { stream: true }),
]
