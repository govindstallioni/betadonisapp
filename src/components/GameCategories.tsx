const categories = [
  {
    name: 'All Games',
    image: null,
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
  {
    name: 'Crash',
    image: '/categories/1.png',
  },
  {
    name: 'Crystal',
    image: '/categories/2.png',
  },
  {
    name: 'Burning Hot',
    image: '/categories/3.png',
  },
  {
    name: 'Mayan Tomb',
    image: '/categories/4.png',
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
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: cat.iconBg }}
              >
                {cat.icon}
              </div>
            )}
            <span className="text-[8px] text-[#374957] font-medium text-center leading-tight w-full px-0.5">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
