// ── Live casino data ─────────────────────────────────────────────────────────
// Plain data module (no 'use client') so generateStaticParams in
// live-casino/[category]/page.tsx (a server component) can import it directly —
// importing from a 'use client' file there silently resolves to the wrong
// thing at build time. Mirrors slotGamesData.ts's split for the same reason.

export type Table = {
  name: string
  category: string
  provider: string
  image: string
  dealer?: string
  players: number
  minBet: string
  show?: boolean
  promo?: boolean
}

// Task 21: tables, names and artwork are the real catalogue from the client's
// own live-casino lobby (betadonis1296.com/tr/canli-casino/lobby). Selection is
// 40 tables spread across the chips below, marquee providers first. Dealer
// names, player counts and min-bets stay local — the lobby does not expose them.
export const categoryChips = ['Tümü', 'Rulet', 'Blackjack', 'Bakara', 'Poker', 'Oyun Şovları', 'Dragon Tiger']

// Task 17: each chip/tile opens its own dedicated /live-casino/[slug] page
// (mirroring /slots/[slug]) instead of just filtering the home page in place.
export const CATEGORY_SLUGS: { label: string; slug: string }[] = [
  { label: 'Tümü', slug: 'tumu' },
  { label: 'Rulet', slug: 'rulet' },
  { label: 'Blackjack', slug: 'blackjack' },
  { label: 'Bakara', slug: 'bakara' },
  { label: 'Poker', slug: 'poker' },
  { label: 'Oyun Şovları', slug: 'oyun-sovlari' },
  { label: 'Dragon Tiger', slug: 'dragon-tiger' },
]

export const allTables: Table[] = [
  { name: 'Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/roulette.webp', dealer: 'Ayşe', players: 457, minBet: '25 ₺', promo: true },
  { name: 'Roulette Live', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/roulette-live.webp', dealer: 'Mert', players: 976, minBet: '20 ₺' },
  { name: 'Auto Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/auto-roulette.webp', dealer: 'Elif', players: 1101, minBet: '10 ₺' },
  { name: 'Speed Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/speed-roulette.webp', dealer: 'Deniz', players: 1092, minBet: '50 ₺' },
  { name: 'Greek Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/greek-roulette.webp', dealer: 'Kaan', players: 495, minBet: '50 ₺', promo: true },
  { name: 'Dansk Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/dansk-roulette.webp', dealer: 'Sena', players: 1200, minBet: '10 ₺' },
  { name: 'Norsk Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/norsk-roulette.webp', dealer: 'Burak', players: 126, minBet: '5 ₺' },
  { name: 'Hindi Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/hindi-roulette.webp', dealer: 'Ceren', players: 879, minBet: '50 ₺' },
  { name: 'Lotus Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/lotus-roulette.webp', dealer: 'Efe', players: 996, minBet: '5 ₺', promo: true },
  { name: 'Svensk Roulette', category: 'Rulet', provider: 'Evolution', image: '/canli-casino/svensk-roulette.webp', dealer: 'Zeynep', players: 416, minBet: '10 ₺' },
  { name: 'Blackjack A', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-a.webp', dealer: 'James', players: 596, minBet: '5 ₺' },
  { name: 'Blackjack B', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-b.webp', dealer: 'Lucy', players: 1014, minBet: '25 ₺' },
  { name: 'Blackjack C', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-c.webp', dealer: 'Mia', players: 1381, minBet: '25 ₺', promo: true },
  { name: 'Easy Blackjack', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/easy-blackjack.webp', dealer: 'Alex', players: 189, minBet: '20 ₺' },
  { name: 'Blackjack VIP1', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-vip1.webp', dealer: 'Noah', players: 1226, minBet: '25 ₺' },
  { name: 'Blackjack VIP2', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-vip2.webp', dealer: 'Derya', players: 357, minBet: '20 ₺' },
  { name: 'Blackjack VIP3', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-vip3.webp', dealer: 'Emre', players: 167, minBet: '10 ₺', promo: true },
  { name: 'Blackjack VIP4', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-vip4.webp', dealer: 'Selin', players: 301, minBet: '5 ₺' },
  { name: 'Blackjack VIP5', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-vip5.webp', dealer: 'Onur', players: 160, minBet: '25 ₺' },
  { name: 'Blackjack VIP6', category: 'Blackjack', provider: 'Evolution', image: '/canli-casino/blackjack-vip6.webp', dealer: 'Buse', players: 449, minBet: '50 ₺' },
  { name: 'Baccarat A', category: 'Bakara', provider: 'Evolution', image: '/canli-casino/baccarat-a.webp', dealer: 'Ayşe', players: 822, minBet: '25 ₺', promo: true },
  { name: 'Baccarat B', category: 'Bakara', provider: 'Evolution', image: '/canli-casino/baccarat-b.webp', dealer: 'Mert', players: 1112, minBet: '10 ₺' },
  { name: 'Peek Baccarat', category: 'Bakara', provider: 'Evolution', image: '/canli-casino/peek-baccarat.webp', dealer: 'Elif', players: 502, minBet: '5 ₺' },
  { name: 'Speed Baccarat A', category: 'Bakara', provider: 'Evolution', image: '/canli-casino/speed-baccarat-a.webp', dealer: 'Deniz', players: 1082, minBet: '10 ₺' },
  { name: 'Speed Baccarat B', category: 'Bakara', provider: 'Evolution', image: '/canli-casino/speed-baccarat-b.webp', dealer: 'Kaan', players: 272, minBet: '10 ₺', promo: true },
  { name: 'Speed Baccarat C', category: 'Bakara', provider: 'Evolution', image: '/canli-casino/speed-baccarat-c.webp', dealer: 'Sena', players: 547, minBet: '50 ₺' },
  { name: 'Poker', category: 'Poker', provider: 'Evolution', image: '/canli-casino/poker.webp', dealer: 'Burak', players: 265, minBet: '5 ₺' },
  { name: 'Three Card Poker', category: 'Poker', provider: 'Evolution', image: '/canli-casino/three-card-poker.webp', dealer: 'Ceren', players: 1267, minBet: '25 ₺' },
  { name: 'Triple Card Poker', category: 'Poker', provider: 'Evolution', image: '/canli-casino/triple-card-poker.webp', dealer: 'Efe', players: 1264, minBet: '25 ₺', promo: true },
  { name: '2 Hand Casino Holdem', category: 'Poker', provider: 'Evolution', image: '/canli-casino/2-hand-casino-holdem.webp', dealer: 'Zeynep', players: 531, minBet: '20 ₺' },
  { name: 'Emperor Dragon Tiger', category: 'Dragon Tiger', provider: 'Evolution', image: '/canli-casino/emperor-dragon-tiger.webp', dealer: 'James', players: 419, minBet: '50 ₺' },
  { name: 'Dragon Tiger Phoenix', category: 'Dragon Tiger', provider: 'Evolution', image: '/canli-casino/dragon-tiger-phoenix.webp', dealer: 'Lucy', players: 958, minBet: '20 ₺' },
  { name: 'Lightning Dragon Tiger', category: 'Dragon Tiger', provider: 'Evolution', image: '/canli-casino/lightning-dragon-tiger.webp', dealer: 'Mia', players: 867, minBet: '25 ₺', promo: true },
]

export const gameShows: Table[] = [
  { name: 'Crazy Time', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/crazy-time.webp', dealer: 'Ayşe', players: 8107, minBet: '5 ₺', show: true, promo: true },
  { name: 'Funky Time', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/funky-time.webp', dealer: 'Mert', players: 6604, minBet: '5 ₺', show: true },
  { name: 'Crazy Balls', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/crazy-balls.webp', dealer: 'Elif', players: 7166, minBet: '5 ₺', show: true },
  { name: 'Crazy Time A', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/crazy-time-a.webp', dealer: 'Deniz', players: 4219, minBet: '2 ₺', show: true },
  { name: 'Balloon Race', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/balloon-race.webp', dealer: 'Kaan', players: 5302, minBet: '5 ₺', show: true, promo: true },
  { name: 'Monopoly Live', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/monopoly-live.webp', dealer: 'Sena', players: 4023, minBet: '5 ₺', show: true },
  { name: 'Dream Catcher', category: 'Oyun Şovları', provider: 'Evolution', image: '/canli-casino/dream-catcher.webp', dealer: 'Burak', players: 4574, minBet: '2 ₺', show: true },
]

/** All tables + game shows for a category slug ('tumu' = everything). */
export function tablesFor(slug: string): Table[] {
  const entry = CATEGORY_SLUGS.find(c => c.slug === slug)
  if (!entry) return []
  const all = [...allTables, ...gameShows]
  return entry.label === 'Tümü' ? all : all.filter(t => t.category === entry.label)
}

// Task 25: shared here (not local to LiveCasinoScreen.tsx) so the dedicated
// /live-casino/kategoriler and /live-casino/saglayicilar pages can import
// them too.
export const kategoriler = [
  { name: 'Rulet', image: '/canli-casino/roulette.webp' },
  { name: 'Blackjack', image: '/canli-casino/blackjack-a.webp' },
  { name: 'Bakara', image: '/canli-casino/baccarat-a.webp' },
  { name: 'Poker', image: '/canli-casino/poker.webp' },
  { name: 'Dragon Tiger', image: '/canli-casino/emperor-dragon-tiger.webp' },
  { name: 'Oyun Şovları', image: '/canli-casino/crazy-time.webp' },
]

export const providers = [
  { name: 'Evolution', logo: '/providers/provider1.png', tables: 214 },
  { name: 'Pragmatic Play Live', logo: '/providers/pragmatic.png', tables: 96 },
  { name: 'Ezugi', logo: '/providers/provider2.png', tables: 74 },
  { name: 'Playtech', logo: '/providers/provider3.png', tables: 58 },
  { name: 'Vivo Gaming', logo: '', tables: 33 },
  { name: 'Atmosfera', logo: '', tables: 21 },
  { name: 'Absolute Live', logo: '', tables: 18 },
  { name: 'LuckyStreak', logo: '', tables: 12 },
]
