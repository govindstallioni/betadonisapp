// Shared slot-games pool for the Slotlar screen and its category subpages.
// One tagged pool so a category slug can be looked up from both the chip row
// and the `/slots/[slug]` subpages.
//
// Task 21: names and artwork are the real catalogue from the client's own
// desktop casino (betadonis1296.com/tr/casino/home) rather than a curated
// list with generated placeholders. Source thumbnails are 300x300 PNG; they
// are stored here as 240x240 WebP under public/casino/, which is why the
// rails render at aspect-[1/1] — a square source in a 3/4 box lost a quarter
// of the artwork, and real box art carries the title near its edge.


export type Game = { name: string; provider: string; image: string; promo?: boolean; tag: string }

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
  { name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '/casino/gates-of-olympus.webp', promo: true, tag: 'populer' },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/casino/sweet-bonanza.webp', promo: true, tag: 'populer' },
  { name: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: '/casino/big-bass-bonanza.webp', promo: true, tag: 'populer' },
  { name: 'Starlight Princess 1000', provider: 'Pragmatic Play', image: '/casino/starlight-princess-1000.webp', tag: 'populer' },
  { name: 'Sugar Rush 1000', provider: 'Pragmatic Play', image: '/casino/sugar-rush-1000.webp', tag: 'populer' },
  { name: 'The Dog House', provider: 'Pragmatic Play', image: '/casino/the-dog-house.webp', tag: 'populer' },
]

// Sizin için Seçilen rail
const forYou: Game[] = [
  { name: 'Big Bass Splash', provider: 'Pragmatic Play', image: '/casino/big-bass-splash.webp', tag: 'sizin-icin-secilen' },
  { name: 'Zeus vs Hades – Gods of War 250', provider: 'Pragmatic Play', image: '/casino/zeus-vs-hades-gods-of-war-250.webp', promo: true, tag: 'sizin-icin-secilen' },
  { name: 'Treasures of Aztec', provider: 'PG Soft', image: '/casino/treasures-of-aztec.webp', tag: 'sizin-icin-secilen' },
]

// Efsane Çarpanlar rail — crash/instant titles carry a headline multiplier.
const crash: (Game & { mult: string })[] = [
  { name: 'Aviator', provider: 'Spribe', image: '/casino/aviator.webp', mult: '128.4x', tag: 'efsane-carpanlar' },
  { name: 'Ultimate Striker', provider: 'PG Soft', image: '/casino/ultimate-striker.webp', mult: '52.7x', tag: 'efsane-carpanlar' },
  { name: '9 Coins', provider: 'Wazdan', image: '/casino/9-coins.webp', mult: '31.2x', tag: 'efsane-carpanlar' },
  { name: '12 Coins', provider: 'Wazdan', image: '/casino/12-coins.webp', mult: '24.6x', tag: 'efsane-carpanlar' },
]

// Ayın Sağlayıcısı rail
const providerOfMonth: Game[] = [
  { name: 'Gates of Olympus 1000', provider: 'Pragmatic Play', image: '/casino/gates-of-olympus-1000.webp', promo: true, tag: 'saglayici-pragmatic-play' },
  { name: 'Sweet Bonanza 1000', provider: 'Pragmatic Play', image: '/casino/sweet-bonanza-1000.webp', promo: true, tag: 'saglayici-pragmatic-play' },
  { name: 'Bigger Bass Bonanza', provider: 'Pragmatic Play', image: '/casino/bigger-bass-bonanza.webp', tag: 'saglayici-pragmatic-play' },
  { name: 'Gold Party', provider: 'Pragmatic Play', image: '/casino/gold-party.webp', tag: 'saglayici-pragmatic-play' },
  { name: 'Spellmaster', provider: 'Pragmatic Play', image: '/casino/spellmaster.webp', tag: 'saglayici-pragmatic-play' },
  { name: 'Saray Rüyası', provider: 'Pragmatic Play', image: '/casino/saray-ruyasi.webp', tag: 'saglayici-pragmatic-play' },
]

// The rest of the catalogue, spread across the category subpages.
const generalNames: Omit<Game, 'tag'>[] = [
  { name: 'Gates of Olympus Super Scatter', provider: 'Pragmatic Play', image: '/casino/gates-of-olympus-super-scatter.webp', promo: true },
  { name: 'Lucky Penny 3 Pots Super Wheel', provider: '3 Oaks', image: '/casino/lucky-penny-3-pots-super-wheel.webp' },
  { name: 'Lucky Apple x1000', provider: '3 Oaks', image: '/casino/lucky-apple-x1000.webp' },
  { name: 'Super China Pots', provider: '3 Oaks', image: '/casino/super-china-pots.webp' },
  { name: 'Big Bass Bonanza 1000', provider: 'Pragmatic Play', image: '/casino/big-bass-bonanza-1000.webp', promo: true },
  { name: '40 Burning Hot Bell Link', provider: 'EGT Digital', image: '/casino/40-burning-hot-bell-link.webp' },
  { name: '40 Shining Crown Bell Link', provider: 'EGT Digital', image: '/casino/40-shining-crown-bell-link.webp' },
  { name: '100 Super Hot  - Clover Chance', provider: 'EGT Digital', image: '/casino/100-super-hot-clover-chance.webp' },
  { name: 'Pompeii Megareels Megaways', provider: 'Pragmatic Play', image: '/casino/pompeii-megareels-megaways.webp', promo: true },
  { name: '4 Clover Pots', provider: '3 Oaks', image: '/casino/4-clover-pots.webp' },
  { name: 'Big Bass Vegas Double Down Deluxe', provider: 'Pragmatic Play', image: '/casino/big-bass-vegas-double-down-deluxe.webp' },
  { name: 'Christmas Big Bass Bonanza', provider: 'Pragmatic Play', image: '/casino/christmas-big-bass-bonanza.webp' },
  { name: 'Mythical Treasure', provider: 'Amusnet', image: '/casino/mythical-treasure.webp', promo: true },
  { name: 'Bigger Bass Blizzard - Christmas Catch', provider: 'Pragmatic Play', image: '/casino/bigger-bass-blizzard-christmas-catch.webp' },
  { name: 'Royal Beelion', provider: 'BGaming', image: '/casino/royal-beelion.webp' },
  { name: 'Big Bass Halloween', provider: 'Pragmatic Play', image: '/casino/big-bass-halloween.webp' },
  { name: 'Flaming Hot Extreme Bell Link', provider: 'EGT Digital', image: '/casino/flaming-hot-extreme-bell-link.webp', promo: true },
  { name: '5 Mega Thunder Coins RUNNING WINS™', provider: 'Fugaso', image: '/casino/5-mega-thunder-coins-running-wins.webp' },
  { name: '40 Super Hot', provider: 'Amusnet', image: '/casino/40-super-hot.webp' },
  { name: 'Burning Hot Extreme  - Clover Chance', provider: 'EGT Digital', image: '/casino/burning-hot-extreme-clover-chance.webp' },
  { name: '40 Burning Hot 6 Reels', provider: 'Amusnet', image: '/casino/40-burning-hot-6-reels.webp', promo: true },
  { name: '3 Coin Volcanos', provider: '3 Oaks', image: '/casino/3-coin-volcanos.webp' },
  { name: 'Starlight Princess Super Scatter', provider: 'Pragmatic Play', image: '/casino/starlight-princess-super-scatter.webp' },
  { name: 'Coin Princess x1000', provider: '3 Oaks', image: '/casino/coin-princess-x1000.webp' },
  { name: 'Cash Volcano XXL', provider: 'Kendoo', image: '/casino/cash-volcano-xxl.webp', promo: true },
  { name: '100 Golden Coins', provider: 'Amusnet', image: '/casino/100-golden-coins.webp' },
  { name: '100 Bulky Dice', provider: 'Amusnet', image: '/casino/100-bulky-dice.webp' },
  { name: '100 Lucky Bell', provider: 'Popok Gaming', image: '/casino/100-lucky-bell.webp' },
  { name: 'Bigger Bass Splash', provider: 'Pragmatic Play', image: '/casino/bigger-bass-splash.webp', promo: true },
  { name: '10 Burning Power', provider: 'EGT Digital', image: '/casino/10-burning-power.webp' },
  { name: '100 Burning Clover - Clover Chance', provider: 'EGT Digital', image: '/casino/100-burning-clover-clover-chance.webp' },
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
