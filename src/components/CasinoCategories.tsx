import SectionHeader from './SectionHeader'

const categories = [
  {
    name: 'Favori Oyunlarim',
    image: '/categories/1.png',
    bg: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path fill="#fff" d="M26 19.34C26 25.44 20.95 30.35 14.85 29.98C8.58 29.61 4.29 23.58 5.1 17.28C5.59 13.44 7.38 10.16 9.34 7.61C9.68 7.16 10.03 10.74 10.38 10.35C10.73 9.94 13.97 4.33 15.1 2.36C15.31 1.99 15.79 1.88 16.13 2.14C18.39 3.85 26 10.28 26 19.34Z" />
        <path fill="rgba(255,255,255,0.5)" d="M23 21.85C23 25.89 19.48 29.14 15.2 29C10.58 28.84 7.41 24.61 8.09 20.26C9.07 14.01 15.48 10 15.48 10C15.48 10 23 14.71 23 21.85Z" />
      </svg>
    ),
  },
  {
    name: 'Video Slots',
    image: '/categories/2.png',
    bg: 'linear-gradient(135deg, #a855f7 0%, #6b21a8 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <rect x="2" y="4" width="20" height="16" rx="3" fillOpacity="0.3" />
        <rect x="4" y="7" width="4" height="10" rx="1" />
        <rect x="10" y="7" width="4" height="10" rx="1" />
        <rect x="16" y="7" width="4" height="10" rx="1" />
      </svg>
    ),
  },
  {
    name: 'Masa Oyunları',
    image: '/categories/3.png',
    bg: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <ellipse cx="12" cy="14" rx="9" ry="6" fillOpacity="0.3" />
        <ellipse cx="12" cy="12" rx="9" ry="6" fill="white" fillOpacity="0.5" />
        <circle cx="9" cy="11" r="1.5" />
        <circle cx="15" cy="11" r="1.5" />
        <circle cx="12" cy="13" r="1.5" />
      </svg>
    ),
  },
  {
    name: 'Blackjack',
    image: '/categories/4.png',
    bg: 'linear-gradient(135deg, #0E8FCF 0%, #1e40af 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" fillOpacity="0.9" />
      </svg>
    ),
  },
  {
    name: 'Kazi Kazan',
    image: '/categories/1.png',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M12 3C7 3 4 7 4 11c0 5 8 10 8 10s8-5 8-10c0-4-3-8-8-8z" fillOpacity="0.3" />
        <text x="12" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">21</text>
      </svg>
    ),
  },
  {
    name: 'Video Poker',
    image: '/categories/2.png',
    bg: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <rect x="3" y="4" width="8" height="12" rx="1.5" fillOpacity="0.4" />
        <rect x="13" y="4" width="8" height="12" rx="1.5" fillOpacity="0.6" />
        <path d="M7 8l-1.5 2.5L7 13l1.5-2.5L7 8z" />
        <path d="M17 7v6M14 10h6" strokeWidth="0" />
        <circle cx="17" cy="10" r="2" />
      </svg>
    ),
  },
  {
    name: 'Kazı Kazan',
    image: '/categories/3.png',
    bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <rect x="3" y="6" width="18" height="12" rx="2" fillOpacity="0.3" />
        <rect x="6" y="9" width="12" height="6" rx="1" fillOpacity="0.5" />
        <path d="M10 12h4M12 10v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Spor Slotları',
    image: '/categories/4.png',
    bg: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <circle cx="12" cy="12" r="9" fillOpacity="0.3" />
        <path d="M12 3v18M3 12h18" stroke="white" strokeWidth="1.5" />
        <path d="M5.6 5.6c3.5 2 5.4 3.9 6.4 6.4c1-2.5 2.9-4.4 6.4-6.4" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M5.6 18.4c3.5-2 5.4-3.9 6.4-6.4c1 2.5 2.9 4.4 6.4 6.4" stroke="white" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
]

export default function CasinoCategories() {
  return (
    <div>
      <SectionHeader title="Kategoriler" badge="Casino Oyunları" gamesCount={categories.length} />
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex-shrink-0 w-[100px] rounded-2xl cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform relative overflow-hidden"
            style={!cat.image ? { background: cat.bg } : undefined}
          >
            {cat.image && (
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="relative z-10 h-[100px] flex flex-col justify-end px-[8px] pb-[8px]">
              <span className="text-[10px] font-bold text-white leading-tight text-center w-full"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                {cat.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
