'use client'

import Link from 'next/link'
import SectionHeader from './SectionHeader'

const events = [
  {
    title: 'ŞAMPİYONLAR LİGİ',
    count: 48,
    icon: <img src="/events/champions-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#1a56db',
    bg: 'transparent',
    type: 'cup',
  },
  {
    title: 'Avrupa Ligi',
    count: 32,
    icon: <img src="/events/europa-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#f59e0b',
    bg: '#fffbeb',
    type: 'cup',
  },
  {
    title: 'Türkiye Süper Ligi',
    count: 44,
    icon: <img src="/events/turkey-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#e11d48',
    bg: '#fff1f2',
    type: 'league',
  },
  {
    title: 'Almanya Bundesliga',
    count: 36,
    icon: <img src="/events/champions-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#dc2626',
    bg: '#fef2f2',
    type: 'league',
  },
  {
    title: 'İngiltere Premier Ligi',
    count: 52,
    icon: <img src="/events/europa-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#7c3aed',
    bg: '#f5f3ff',
    type: 'league',
  },
  {
    title: 'İspanya La Liga',
    count: 40,
    icon: <img src="/events/turkey-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#ea580c',
    bg: '#fff7ed',
    type: 'league',
  },
]

function getEventHref(event: typeof events[0]) {
  if (event.type === 'cup') {
    return `/event?title=${encodeURIComponent(event.title)}&color=${encodeURIComponent(event.color)}`
  }
  return `/league?title=${encodeURIComponent(event.title)}&color=${encodeURIComponent(event.color)}`
}

// Split into chunks of 3
const chunks: (typeof events)[] = []
for (let c = 0; c < events.length; c += 3) {
  chunks.push(events.slice(c, c + 3))
}

export default function TopEvents() {
  return (
    <div>
      <SectionHeader title="Öne Çıkan Etkinlikler" />
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {chunks.map((chunk, ci) => (
          <div key={ci} className="flex-shrink-0 w-[95%] flex flex-col gap-[6px]">
            {chunk.map((event, i) => (
              <Link
                key={i}
                href={getEventHref(event)}
                className="flex items-center gap-2.5 bg-white rounded-xl px-2.5 py-2 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden shadow-sm"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: event.bg }}
                >
                  {event.icon}
                </div>
                <div className="flex-1 flex items-center gap-[6px]">
                  <span className="text-[11px] font-medium text-[#1a2332]">{event.title}</span>
                  <span className="text-[9px] bg-[#edf5ff] text-[#0E8FCF] rounded-full px-[6px] py-[2px] leading-none font-bold">{event.count}</span>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ backgroundColor: event.color }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                  <svg width="112" height="100%" viewBox="0 0 112 52" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <path d="M50,0 C40,8 35,18 30,26 C25,34 20,44 15,52 L112,52 L112,0 Z" fill={event.color} opacity="0.06" />
                    <path d="M70,0 C62,8 55,18 50,26 C45,34 38,44 32,52 L112,52 L112,0 Z" fill={event.color} opacity="0.15" />
                    <path d="M90,0 C82,8 76,18 72,26 C68,34 60,44 55,52 L112,52 L112,0 Z" fill={event.color} opacity="0.28" />
                    <path d="M105,0 C100,10 96,20 93,30 C90,40 85,46 80,52 L112,52 L112,0 Z" fill={event.color} opacity="0.4" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
