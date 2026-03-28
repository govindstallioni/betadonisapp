import SectionHeader from './SectionHeader'

const events = [
  {
    title: 'ŞAMPİYONLAR LİGİ',
    icon: (
      <img src="/events/champions-league.png" alt="Champions League" className="w-full h-full object-cover rounded-full" />
    ),
    color: '#1a56db',
    bg: 'transparent',
  },
  {
    title: 'Avrupa Ligi',
    icon: (
      <img src="/events/europa-league.png" alt="Europa League" className="w-full h-full object-cover rounded-full" />
    ),
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    title: 'Türkiye Süper Ligi',
    icon: (
      <img src="/events/turkey-league.png" alt="Türkiye Süper Ligi" className="w-full h-full object-cover rounded-full" />
    ),
    color: '#e11d48',
    bg: '#fff1f2',
  },
  /*{
    title: 'İtalya Serie A',
    icon: (
      <img src="/events/italy-series-a.png" alt="İtalya Serie A" className="w-full h-full object-cover rounded-full" />
    ),
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    title: 'Fransa Ligi',
    icon: (
      <img src="/events/french-league.png" alt="Fransa Ligi" className="w-full h-full object-cover rounded-full" />
    ),
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    title: 'Dünya Kupası',
    icon: (
      <img src="/events/worldcup.png" alt="Dünya Kupası" className="w-full h-full object-cover rounded-full" />
    ),
    color: '#7c3aed',
    bg: '#f5f3ff',
  },*/
]

export default function TopEvents() {
  return (
    <div>
      <SectionHeader title="Öne Çıkan Etkinlikler" showAll />
      <div className="flex flex-col gap-[6px]">
        {events.map((event, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 bg-white rounded-xl px-2.5 py-2 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden shadow-sm"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: event.bg }}
            >
              {event.icon}
            </div>
            <span className="text-[11px] font-medium text-[#1a2332] flex-1">{event.title}</span>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ backgroundColor: event.color }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
            {/* Decorative right-side graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
              <svg width="112" height="100%" viewBox="0 0 112 52" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor={event.color} stopOpacity="0.15" />
                    <stop offset="50%" stopColor={event.color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={event.color} stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <path d="M50,0 C40,8 35,18 30,26 C25,34 20,44 15,52 L112,52 L112,0 Z" fill={event.color} opacity="0.06" />
                <path d="M70,0 C62,8 55,18 50,26 C45,34 38,44 32,52 L112,52 L112,0 Z" fill={event.color} opacity="0.15" />
                <path d="M90,0 C82,8 76,18 72,26 C68,34 60,44 55,52 L112,52 L112,0 Z" fill={event.color} opacity="0.28" />
                <path d="M105,0 C100,10 96,20 93,30 C90,40 85,46 80,52 L112,52 L112,0 Z" fill={event.color} opacity="0.4" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
