import SectionHeader from './SectionHeader'

const spotlightGames = [
  {
    name: 'ŞAMPİYONLAR LİGİ',
    provider: 'Pragmatic Play',
    tag: 'CANLI',
    image: '/spotlight/1.png',
    accent: '#e74c3c',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.1)" />
        <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1" fill="rgba(255,255,255,0.05)" />
        <circle cx="12" cy="12" r="2" fill="white" />
        <line x1="12" y1="2" x2="12" y2="5" stroke="white" strokeWidth="1.5" />
        <line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="1.5" />
        <line x1="2" y1="12" x2="5" y2="12" stroke="white" strokeWidth="1.5" />
        <line x1="19" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: 'Avrupa Ligi',
    provider: 'Pragmatic Play',
    tag: 'HİT',
    image: '/spotlight/2.png',
    accent: '#f472b6',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="10" r="3.5" fill="#fbbf24" fillOpacity="0.8" />
        <circle cx="15" cy="8" r="3" fill="#ef4444" fillOpacity="0.8" />
        <circle cx="12" cy="14" r="4" fill="#22c55e" fillOpacity="0.8" />
        <circle cx="17" cy="14" r="2.5" fill="#a855f7" fillOpacity="0.8" />
        <circle cx="6" cy="15" r="2" fill="#3b82f6" fillOpacity="0.8" />
        <path d="M10 6l1-3.5M14 5l1-3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Türkiye Süper Ligi',
    provider: 'Spribe',
    tag: 'TREND',
    image: '/spotlight/3.png',
    accent: '#ef4444',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <path d="M3 18L12 4l9 14" stroke="#ef4444" strokeWidth="2" fill="none" />
        <path d="M5 16L12 6l7 10" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.4" fill="none" />
        <circle cx="12" cy="6" r="2" fill="#ef4444" />
        <path d="M4 20h16" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: 'Lightning Dice',
    provider: 'Evolution',
    tag: 'CANLI',
    image: '/spotlight/4.png',
    accent: '#fbbf24',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="10" height="10" rx="2" fill="white" fillOpacity="0.2" transform="rotate(-10 9 11)" />
        <rect x="10" y="8" width="10" height="10" rx="2" fill="white" fillOpacity="0.3" transform="rotate(5 15 13)" />
        <circle cx="7" cy="9" r="1" fill="white" />
        <circle cx="11" cy="13" r="1" fill="white" />
        <circle cx="9" cy="11" r="1" fill="white" />
        <path d="M13 3l-2 5h4l-3 6" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Fransa Ligi',
    provider: 'Ligue 1',
    tag: 'CANLI',
    image: '/spotlight/5.png',
    accent: '#1e40af',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.1)" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" stroke="white" strokeWidth="1" strokeDasharray="3 2" />
        <path d="M8 6l4 6-4 6" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M14 8l4 4-4 4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Dünya Kupası',
    provider: 'FIFA',
    tag: 'HİT',
    image: '/spotlight/6.png',
    accent: '#d4a017',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <path d="M8 21h8M12 17v4M6 3h12l-1.5 6H7.5L6 3z" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M7.5 9v2a4.5 4.5 0 009 0V9" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M4 5h2M18 5h2M4 5l2.5 4M20 5l-2.5 4" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function InTheSpotlight() {
  return (
    <div>
      <SectionHeader title="Günün Öne Çıkanları" badge="Casino Oyunları" gamesCount={spotlightGames.length} />
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {spotlightGames.map((game) => (
          <div
            key={game.name}
            className="flex-shrink-0 w-[70%] rounded-2xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform relative overflow-hidden"
          >
            <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 h-[160px] flex items-end px-[12px] pb-[12px]">
              <span className="text-[13px] font-bold text-white leading-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                {game.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
