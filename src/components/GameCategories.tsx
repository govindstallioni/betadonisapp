const categories = [
  {
    name: 'All Games',
    bg: '#e8f4fd',
    iconBg: '#3b82f6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0.5">
        <path d="M6 11h4V7H6v4zm0 4h4v-2H6v2zm4 2h4v-4h-4v4zm4-2h4v-4h-4v4zm-4-4h4V7h-4v4zm4 0h4V7h-4v4z" />
      </svg>
    ),
  },
  {
    name: 'Crash',
    bg: '#fde8e8',
    iconBg: '#ef4444',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6z" />
        <circle cx="12" cy="16" r="1.5" />
        <rect x="11" y="10" width="2" height="4" rx="1" />
      </svg>
    ),
  },
  {
    name: 'Crystal',
    bg: '#ede9fe',
    iconBg: '#8b5cf6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L4 8l8 14 8-14-8-6zM6.5 8.5L12 4.5l5.5 4L12 19 6.5 8.5z" />
      </svg>
    ),
  },
  {
    name: 'Burning Hell',
    bg: '#fff3e0',
    iconBg: '#f97316',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 23c-3.6 0-6.5-2.8-6.5-6.3 0-2.5 1.3-4.4 2.6-6.1.7-.9 1.5-1.8 2-2.9.3-.6.9-1 1.5-.9.6 0 1.1.5 1.3 1.1.4 1.1 1.2 2 2 2.9 1.3 1.5 2.6 3.2 2.6 5.9C17.5 20.2 15.6 23 12 23z" />
      </svg>
    ),
  },
  {
    name: 'Mayan Tomb',
    bg: '#dcfce7',
    iconBg: '#22c55e',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L2 7v2h20V7L12 2zM4 11v8h3v-8H4zm5 0v8h3v-8H9zm5 0v8h3v-8h-3zm5 0v8h1V11h-1zM2 21h20v2H2v-2z" />
      </svg>
    ),
  },
  {
    name: 'Western Slot',
    bg: '#fef3c7',
    iconBg: '#eab308',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
  },
]

export default function GameCategories() {
  return (
    <div className="flex gap-[14px] overflow-x-auto scrollbar-hide -mx-4 px-4">
      {categories.map((cat) => (
        <button key={cat.name} className="flex flex-col items-center gap-[6px] flex-shrink-0 group">
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: cat.bg }}
          >
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: cat.iconBg }}
            >
              {cat.icon}
            </div>
          </div>
          <span className="text-[10px] text-text-secondary font-medium text-center w-[52px] leading-[1.2]">
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  )
}
