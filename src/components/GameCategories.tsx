<<<<<<< HEAD
import Link from 'next/link'

type Cat = { name: string; href?: string; provider?: string; image?: string; iconBg?: string; icon?: React.ReactNode }

const categories: Cat[] = [
  {
    name: 'Tüm Oyunlar',
    href: '/slots',
=======
const categories = [
  {
    name: 'All Games',
    image: null,
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
    iconBg: '#3b82f6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
<<<<<<< HEAD
  { name: 'Crash', provider: 'Spribe', image: '/gamecategory/01.png' },
  { name: 'Crystal', provider: 'Pragmatic Play', image: '/gamecategory/02.png' },
  { name: 'Burning Hot', provider: 'EGT', image: '/gamecategory/03.png' },
  { name: 'Mayan Tomb', provider: 'BGaming', image: '/gamecategory/04.png' },
  { name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '/spotlight/1.png' },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/spotlight/2.png' },
  { name: 'Big Bass', provider: 'Pragmatic Play', image: '/spotlight/3.png' },
  { name: 'Book of Dead', provider: 'Play n GO', image: '/spotlight/4.png' },
  { name: 'Fortune Gems', provider: 'JILI Games', image: '/spotlight/5.png' },
  { name: 'Wolf Gold', provider: 'Pragmatic Play', image: '/spotlight/6.png' },
  { name: 'Lucky Penny', provider: 'Pragmatic Play', image: '/canli-casino/1.jpg' },
  { name: 'Sweet Rush', provider: 'Pragmatic Play', image: '/canli-casino/2.jpg' },
  { name: 'Zodiac Wheel', provider: 'EGT', image: '/canli-casino/3.jpg' },
  { name: 'Royal Bonanza', provider: 'Amusnet', image: '/canli-casino/6.jpg' },
]

function hrefFor(cat: Cat) {
  if (cat.href) return cat.href
  const q = new URLSearchParams({ name: cat.name, img: cat.image || '', provider: cat.provider || '' })
  return `/game?${q.toString()}`
}

export default function GameCategories() {
  return (
    <div className="bg-white rounded-xl px-2.5 py-2.5 shadow-sm border border-[#f0f2f5]">
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-0.5 px-0.5">
        {categories.map((cat) => (
          <Link href={hrefFor(cat)} key={cat.name} className="flex flex-col items-center gap-[5px] flex-shrink-0 w-[52px] active:opacity-70 transition-opacity">
            {cat.image ? (
              <div className="w-[46px] h-[46px] rounded-full overflow-hidden border border-[#f0f2f5]">
=======
  {
    name: 'Crash',
    image: '/gamecategory/01.png',
  },
  {
    name: 'Crystal',
    image: '/gamecategory/02.png',
  },
  {
    name: 'Burning Hot',
    image: '/gamecategory/03.png',
  },
  {
    name: 'Mayan Tomb',
    image: '/gamecategory/04.png',
  },
  {
    name: 'Western slot',
    image: '/spotlight/1.png',
  },
]

export default function GameCategories() {
  return (
    <div className="bg-white rounded-xl px-2 py-2.5 shadow-sm border border-[#f0f2f5]">
      <div className="flex items-start justify-between overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button key={cat.name} className="flex flex-col items-center gap-[4px] flex-shrink-0 min-w-0 flex-1">
            {cat.image ? (
              <div className="w-[44px] h-[44px] rounded-full overflow-hidden border border-[#f0f2f5]">
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
<<<<<<< HEAD
                className="w-[46px] h-[46px] rounded-full flex items-center justify-center"
=======
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center"
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
                style={{ backgroundColor: cat.iconBg }}
              >
                {cat.icon}
              </div>
            )}
<<<<<<< HEAD
            <span className="text-[8px] text-[#374957] font-medium text-center leading-tight w-full line-clamp-2">
              {cat.name}
            </span>
          </Link>
=======
            <span className="text-[8px] text-[#374957] font-medium text-center leading-tight w-full px-0.5">
              {cat.name}
            </span>
          </button>
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
        ))}
      </div>
    </div>
  )
}
