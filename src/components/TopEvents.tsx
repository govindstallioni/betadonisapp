'use client'

import Link from 'next/link'
import SectionHeader from './SectionHeader'
<<<<<<< HEAD
import { useBetSlip } from './BetSlipProvider'

interface OddCell { label: string; value: string; trend?: 'up' | 'down' }
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971

const events = [
  {
    title: 'ŞAMPİYONLAR LİGİ',
    count: 48,
    icon: <img src="/events/champions-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#1a56db',
    bg: 'transparent',
    type: 'cup',
<<<<<<< HEAD
    match: {
      id: 'gs-bay', league: 'Şampiyonlar Ligi', team1: 'Galatasaray', team2: 'Bayern Münih',
      odds: [{ label: 'Ev1', value: '3.10', trend: 'up' }, { label: 'X', value: '3.60' }, { label: 'Dep2', value: '2.15', trend: 'down' }] as OddCell[],
    },
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
  },
  {
    title: 'Avrupa Ligi',
    count: 32,
    icon: <img src="/events/europa-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#f59e0b',
    bg: '#fffbeb',
    type: 'cup',
<<<<<<< HEAD
    match: {
      id: 'te-roma-lev', league: 'Avrupa Ligi', team1: 'Roma', team2: 'Leverkusen',
      odds: [{ label: 'Ev1', value: '2.45' }, { label: 'X', value: '3.30', trend: 'up' }, { label: 'Dep2', value: '2.70' }] as OddCell[],
    },
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
  },
  {
    title: 'Türkiye Süper Ligi',
    count: 44,
    icon: <img src="/events/turkey-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#e11d48',
    bg: '#fff1f2',
    type: 'league',
<<<<<<< HEAD
    match: {
      id: 'bes-tra', league: 'Türkiye. Süper Lig', team1: 'Beşiktaş', team2: 'Trabzonspor',
      odds: [{ label: 'Ev1', value: '1.85', trend: 'up' }, { label: 'X', value: '3.40' }, { label: 'Dep2', value: '4.20', trend: 'down' }] as OddCell[],
    },
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
  },
  {
    title: 'Almanya Bundesliga',
    count: 36,
    icon: <img src="/events/champions-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#dc2626',
    bg: '#fef2f2',
    type: 'league',
<<<<<<< HEAD
    match: {
      id: 'te-bay-dor', league: 'Almanya. Bundesliga', team1: 'Bayern', team2: 'Dortmund',
      odds: [{ label: 'Ev1', value: '1.50' }, { label: 'X', value: '4.50' }, { label: 'Dep2', value: '5.50', trend: 'up' }] as OddCell[],
    },
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
  },
  {
    title: 'İngiltere Premier Ligi',
    count: 52,
    icon: <img src="/events/europa-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#7c3aed',
    bg: '#f5f3ff',
    type: 'league',
<<<<<<< HEAD
    match: {
      id: 'mci-ars', league: 'İngiltere. Premier Lig', team1: 'Manchester City', team2: 'Arsenal',
      odds: [{ label: 'Ev1', value: '2.10', trend: 'down' }, { label: 'X', value: '3.25' }, { label: 'Dep2', value: '3.50' }] as OddCell[],
    },
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
  },
  {
    title: 'İspanya La Liga',
    count: 40,
    icon: <img src="/events/turkey-league.png" alt="" className="w-full h-full object-cover rounded-full" />,
    color: '#ea580c',
    bg: '#fff7ed',
    type: 'league',
<<<<<<< HEAD
    match: {
      id: 'rma-bar', league: 'İspanya. La Liga', team1: 'Real Madrid', team2: 'Barcelona',
      odds: [{ label: 'Ev1', value: '2.30' }, { label: 'X', value: '3.40', trend: 'up' }, { label: 'Dep2', value: '2.90', trend: 'down' }] as OddCell[],
    },
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
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
<<<<<<< HEAD
  const { has, toggle } = useBetSlip()

=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
  return (
    <div>
      <SectionHeader title="Öne Çıkan Etkinlikler" />
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {chunks.map((chunk, ci) => (
          <div key={ci} className="flex-shrink-0 w-[95%] flex flex-col gap-[6px]">
            {chunk.map((event, i) => (
<<<<<<< HEAD
              <div
                key={i}
                className="bg-white rounded-xl relative overflow-hidden shadow-sm"
              >
                {/* Decorative wave */}
                <div className="absolute right-0 top-0 h-[42px] w-1/2 overflow-hidden pointer-events-none">
=======
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
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
                  <svg width="112" height="100%" viewBox="0 0 112 52" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <path d="M50,0 C40,8 35,18 30,26 C25,34 20,44 15,52 L112,52 L112,0 Z" fill={event.color} opacity="0.06" />
                    <path d="M70,0 C62,8 55,18 50,26 C45,34 38,44 32,52 L112,52 L112,0 Z" fill={event.color} opacity="0.15" />
                    <path d="M90,0 C82,8 76,18 72,26 C68,34 60,44 55,52 L112,52 L112,0 Z" fill={event.color} opacity="0.28" />
                    <path d="M105,0 C100,10 96,20 93,30 C90,40 85,46 80,52 L112,52 L112,0 Z" fill={event.color} opacity="0.4" />
                  </svg>
                </div>
<<<<<<< HEAD

                {/* Header — navigates to the league/cup */}
                <Link
                  href={getEventHref(event)}
                  className="relative flex items-center gap-2.5 px-2.5 pt-2 pb-1.5 cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: event.bg }}
                  >
                    {event.icon}
                  </div>
                  <div className="flex-1 flex items-center gap-[6px] min-w-0">
                    <span className="text-[11px] font-medium text-[#1a2332] truncate">{event.title}</span>
                    <span className="text-[9px] bg-[#edf5ff] text-[#0E8FCF] rounded-full px-[6px] py-[2px] leading-none font-bold flex-shrink-0">{event.count}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ backgroundColor: event.color }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </Link>

                {/* Featured match 1X2 odds — add to slip */}
                <div className="relative px-2.5 pb-2">
                  <p className="text-[9px] text-[#737B8C] mb-[5px] truncate">{event.match.team1} - {event.match.team2}</p>
                  <div className="flex gap-[5px]">
                    {event.match.odds.map((odd, j) => {
                      const id = `${event.match.id}::1X2::${odd.label}`
                      const sel = has(id)
                      return (
                        <button
                          key={j}
                          type="button"
                          onClick={() => toggle({
                            id,
                            league: event.match.league,
                            match: `${event.match.team1} - ${event.match.team2}`,
                            market: '1X2',
                            pick: odd.label,
                            baseOdd: parseFloat(odd.value) || 1,
                          })}
                          className={`flex-1 rounded-lg py-[6px] px-[8px] flex items-center justify-between border transition-all active:scale-[0.97] ${sel ? 'bg-[#0E8FCF] border-[#0E8FCF]' : `bg-[#edf5ff] border-[#e8ecf1] ${odd.trend === 'up' ? 'animate-flash-green' : odd.trend === 'down' ? 'animate-flash-red' : ''}`}`}
                        >
                          <span className={`text-[9px] font-semibold uppercase ${sel ? 'text-white/80' : 'text-[#737B8C]'}`}>{odd.label}</span>
                          <span className={`text-[10px] font-medium flex items-center gap-[2px] ${sel ? 'text-white' : odd.trend === 'up' ? 'text-[#27ae60]' : odd.trend === 'down' ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>
                            {odd.value}
                            {!sel && odd.trend === 'up' && <svg width="8" height="8" viewBox="0 0 24 24" fill="#27ae60"><path d="M7 14l5-5 5 5z" /></svg>}
                            {!sel && odd.trend === 'down' && <svg width="8" height="8" viewBox="0 0 24 24" fill="#e74c3c"><path d="M7 10l5 5 5-5z" /></svg>}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
=======
              </Link>
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
