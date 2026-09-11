// Shared slot-games pool for the Slotlar screen and its category subpages.
// Every game here already existed inside SlotsScreen.tsx — this file just
// consolidates those arrays into one tagged pool so a category slug can be
// looked up from both the chip row and the `/slots/[slug]` subpages.

export type Game = { name: string; provider: string; image: string; promo?: boolean; tag: string }

export const promoBanners = [
  { title: 'Evaginarium: Wonder Circus', image: '/spotlight/1.png', badge: '€100,000' },
  { title: 'Hoşgeldin Paketi 75.500 TRY', image: '/spotlight/2.png' },
  { title: 'Wild Spin Chase', image: '/spotlight/3.png' },
  { title: 'Haftanın Slot Oyunu', image: '/spotlight/4.png' },
  { title: '1X Fortune Gems 2', image: '/spotlight/5.png' },
]

export const kategoriler = [
  { name: 'En Popüler', image: '/categories/01.png', slug: 'populer' },
  { name: 'Masa Oyunları', image: '/categories/02.png', slug: 'masa-oyunlari' },
  { name: 'Video Slots', image: '/categories/03.png', slug: 'video-slots' },
  { name: 'Jackpot', image: '/categories/04.png', slug: 'jackpot' },
  { name: 'Megaways', image: '/categories/05.png', slug: 'megaways' },
  { name: 'Kazı Kazan', image: '/categories/06.png', slug: 'kazi-kazan' },
  { name: 'Yeni Oyunlar', image: '/categories/07.png', slug: 'yeni-oyunlar' },
]

export const providers = [
  { name: 'Pragmatic Play', logo: '/providers/pragmatic.png', games: 312 },
  { name: 'JILI Games', logo: '/providers/provider1.png', games: 148 },
  { name: 'BGaming', logo: '/providers/provider2.png', games: 96 },
  { name: "Play'n GO", logo: '/providers/provider3.png', games: 204 },
  { name: 'Winspinity', logo: '/providers/01.png', games: 42 },
  { name: 'Fazi', logo: '', games: 67 },
  { name: 'Solidicon', logo: '', games: 31 },
  { name: 'Hacksaw', logo: '', games: 88 },
  { name: 'Relax Gaming', logo: '', games: 120 },
  { name: 'Evolution', logo: '', games: 175 },
  { name: 'NetEnt', logo: '', games: 133 },
  { name: 'Spribe', logo: '', games: 12 },
]

// Popüler Slotlar rail
const popular: Game[] = [
  { name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '/spotlight/1.png', promo: true, tag: 'populer' },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/spotlight/2.png', promo: true, tag: 'populer' },
  { name: 'Sugar Rush', provider: 'Pragmatic Play', image: '/spotlight/3.png', tag: 'populer' },
  { name: 'Fortune Gems 3', provider: 'JILI Games', image: '/spotlight/4.png', promo: true, tag: 'populer' },
  { name: 'Book of Dead', provider: "Play'n GO", image: '/spotlight/5.png', tag: 'populer' },
  { name: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: '/spotlight/6.png', promo: true, tag: 'populer' },
]

// Sizin için Seçilen rail
const forYou: Game[] = [
  { name: 'Sizin İçin: Wild West Gold', provider: 'Pragmatic Play', image: '/for you/1.png', tag: 'sizin-icin-secilen' },
  { name: 'Sizin İçin: Wanted Dead', provider: 'Hacksaw', image: '/for you/2.png', promo: true, tag: 'sizin-icin-secilen' },
  { name: 'Sizin İçin: Money Train 3', provider: 'Relax Gaming', image: '/for you/3.png', tag: 'sizin-icin-secilen' },
]

// Efsane Çarpanlar rail (crash / multiplier games)
const crash: (Game & { mult: string })[] = [
  { name: 'Aviator', provider: 'Spribe', image: '/spotlight/6.png', mult: '125.00x', tag: 'efsane-carpanlar' },
  { name: 'JetX', provider: 'SmartSoft', image: '/spotlight/5.png', mult: '88.40x', tag: 'efsane-carpanlar' },
  { name: 'Spaceman', provider: 'Pragmatic Play', image: '/spotlight/4.png', mult: '210.00x', tag: 'efsane-carpanlar' },
  { name: 'Plinko', provider: 'Turbo Games', image: '/spotlight/3.png', mult: '64.00x', tag: 'efsane-carpanlar' },
  { name: 'Mines', provider: 'Turbo Games', image: '/spotlight/2.png', mult: '24.75x', tag: 'efsane-carpanlar' },
  { name: 'Zeppelin', provider: 'BetSolutions', image: '/spotlight/1.png', mult: '150.00x', tag: 'efsane-carpanlar' },
]

// Ayın Sağlayıcısı (Pragmatic Play) rail
const providerOfMonth: Game[] = [
  { name: 'Starlight Princess', provider: 'Pragmatic Play', image: '/spotlight/2.png', promo: true, tag: 'saglayici-pragmatic-play' },
  { name: 'The Dog House', provider: 'Pragmatic Play', image: '/spotlight/3.png', tag: 'saglayici-pragmatic-play' },
  { name: 'Wolf Gold', provider: 'Pragmatic Play', image: '/spotlight/4.png', tag: 'saglayici-pragmatic-play' },
]

// General pool, spread deterministically across the remaining category slugs.
const generalNames: { name: string; provider: string; image: string; promo?: boolean }[] = [
  { name: 'Cash Me Eva', provider: 'Winspinity', image: '/spotlight/1.png', promo: true },
  { name: 'Golden Crown Extreme', provider: 'Fazi', image: '/spotlight/2.png', promo: true },
  { name: 'Fortune Gems 3', provider: 'JILI Games', image: '/spotlight/3.png', promo: true },
  { name: 'Navigator', provider: 'Solidicon', image: '/spotlight/4.png' },
  { name: 'Fortune Numbers', provider: 'BGaming', image: '/spotlight/5.png', promo: true },
  { name: 'Royalty', provider: 'Pragmatic Play', image: '/spotlight/6.png', promo: true },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/spotlight/1.png' },
  { name: 'Book of Dead', provider: "Play'n GO", image: '/spotlight/2.png', promo: true },
  { name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '/spotlight/3.png' },
  { name: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: '/spotlight/4.png', promo: true },
  { name: 'Starlight Princess', provider: 'Pragmatic Play', image: '/spotlight/5.png' },
  { name: 'The Dog House', provider: 'Pragmatic Play', image: '/spotlight/6.png', promo: true },
  { name: 'Wolf Gold', provider: 'Pragmatic Play', image: '/spotlight/1.png' },
  { name: 'Wild West Gold', provider: 'Pragmatic Play', image: '/spotlight/2.png' },
  { name: 'Wanted Dead', provider: 'Hacksaw', image: '/spotlight/3.png', promo: true },
  { name: 'Money Train 3', provider: 'Relax Gaming', image: '/spotlight/4.png' },
  { name: 'Reactoonz', provider: "Play'n GO", image: '/spotlight/5.png' },
  { name: 'Legacy of Dead', provider: "Play'n GO", image: '/spotlight/6.png', promo: true },
]

const generalTags = ['yeni-oyunlar', 'masa-oyunlari', 'video-slots', 'video-poker', 'blackjack', 'kazi-kazan', 'diger-oyunlar', 'jackpot', 'megaways']

const general: Game[] = generalNames.map((g, i) => ({ ...g, tag: generalTags[i % generalTags.length] }))

export const ALL_GAMES: Game[] = [...popular, ...forYou, ...crash, ...providerOfMonth, ...general]

export const crashGames = crash
export const popularSlots = popular
export const forYouGames = forYou
export const monthProviderGames = providerOfMonth

export function gamesFor(slug: string): Game[] {
  if (slug === 'tumu') return ALL_GAMES
  // "Provider of the month" page: every game from that provider, not just the curated rail.
  if (slug === 'saglayici-pragmatic-play') return ALL_GAMES.filter(g => g.provider === 'Pragmatic Play')
  return ALL_GAMES.filter(g => g.tag === slug)
}

export function countFor(slug: string): number {
  return gamesFor(slug).length
}

// Chip row + subpage labels, in the exact order/naming the client requested.
export const SLOT_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'tumu', label: 'Tümü' },
  { slug: 'favoriler', label: 'Favoriler' },
  { slug: 'populer', label: 'Popüler' },
  { slug: 'yeni-oyunlar', label: 'Yeni Oyunlar' },
  { slug: 'masa-oyunlari', label: 'Masa Oyunları' },
  { slug: 'video-slots', label: 'Video Slots' },
  { slug: 'video-poker', label: 'Video Poker' },
  { slug: 'blackjack', label: 'Blackjack' },
  { slug: 'kazi-kazan', label: 'Kazı Kazan' },
  { slug: 'diger-oyunlar', label: 'Diğer Oyunlar' },
]

// Extra subpages that exist only via the "Kategoriler" tiles / provider block,
// not the chip row.
export const EXTRA_CATEGORY_LABELS: Record<string, string> = {
  jackpot: 'Jackpot',
  megaways: 'Megaways',
  'sizin-icin-secilen': 'Sizin için Seçilen',
  'efsane-carpanlar': 'Efsane Çarpanlar',
  'saglayici-pragmatic-play': 'Pragmatic Play',
}
