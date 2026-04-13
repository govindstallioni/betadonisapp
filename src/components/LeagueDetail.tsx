'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LeagueDetailProps {
  league: { title: string; color: string }
}

const mainTabs = ['Popüler', 'Yaklaşanlar']
const timeFilters = ['3 Saat', '6 Saat', '12 Saat', '24 Saat']

const liveEvents = [
  {
    team1: 'Galatasaray', team2: 'Fenerbahçe',
    logo1: '/teams/jersey2.png', logo2: '/teams/jersey1.png',
    score1: 2, score2: 1, minute: "67", half: '2Y',
    odds: [
      { label: 'Ev1', value: '1.85', trend: 'up' as const },
      { label: 'X', value: '3.40' },
      { label: 'Dep2', value: '4.20', trend: 'down' as const },
    ],
  },
]

const preMatchEvents = [
  {
    team1: 'Beşiktaş', team2: 'Trabzonspor',
    logo1: '/teams/jersey1.png', logo2: '/teams/jersey2.png',
    dateTime: '28.03.26 07:30 pm',
    countdown: { hours: '03', minutes: '34', seconds: '24' },
    odds: [
      { label: 'Ev1', value: '2.45', trend: 'up' as const },
      { label: 'X', value: '3.25' },
      { label: 'Dep2', value: '2.80', trend: 'down' as const },
    ],
  },
  {
    team1: 'Başakşehir', team2: 'Antalyaspor',
    logo1: '/teams/jersey2.png', logo2: '/teams/jersey1.png',
    dateTime: '28.03.26 10:00 pm',
    countdown: { hours: '05', minutes: '12', seconds: '48' },
    odds: [
      { label: 'Ev1', value: '1.95' },
      { label: 'X', value: '3.60', trend: 'up' as const },
      { label: 'Dep2', value: '3.10', trend: 'down' as const },
    ],
  },
  {
    team1: 'Kasımpaşa', team2: 'Konyaspor',
    logo1: '/teams/jersey1.png', logo2: '/teams/jersey2.png',
    dateTime: '29.03.26 05:00 pm',
    countdown: { hours: '18', minutes: '45', seconds: '10' },
    odds: [
      { label: 'Ev1', value: '2.20' },
      { label: 'X', value: '3.15' },
      { label: 'Dep2', value: '3.40', trend: 'up' as const },
    ],
  },
]

export default function LeagueDetail({ league }: LeagueDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [activeTime, setActiveTime] = useState(0)

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative pb-20">
      {/* Hero Banner */}
      <div className="relative h-[140px] overflow-hidden">
        <img src="/events/bannerbg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ backgroundColor: `${league.color}cc` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative z-10 flex items-center justify-between px-4 pt-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-4 left-4 z-10">
          <h1 className="text-[16px] font-bold text-white drop-shadow-lg">{league.title}</h1>
        </div>
      </div>

      {/* Tabs: Popüler / Yaklaşanlar */}
      <div className="bg-white px-4 py-2">
        <div className="bg-[#edf5ff] rounded-full p-[3px] flex items-center">
          {mainTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-[7px] rounded-full text-[10px] font-medium text-center transition-all ${
                activeTab === i ? 'bg-[#0E8FCF] text-white shadow-sm' : 'text-[#737B8C]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Time filters for Yaklaşanlar */}
      {activeTab === 1 && (
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-4 py-2.5">
          {timeFilters.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveTime(i)}
              className={`flex-shrink-0 rounded-full px-[14px] py-[6px] text-[10px] font-medium transition-all ${
                activeTime === i ? 'bg-[#0E8FCF] text-white' : 'bg-white text-[#1a2332] border border-[#e8ecf1]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* ── Canlı Etkinlikler ── */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-[6px] h-[6px] rounded-full bg-[#e74c3c] animate-pulse-dot" />
          <h2 className="text-[14px] font-bold text-[#1a2332]">Canlı Etkinlikler</h2>
        </div>

        {liveEvents.map((match, i) => (
          <Link key={i} href="/match?id=gal-fen" className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1] mb-3 block">
            {/* Live badge */}
            <div className="flex items-center justify-between px-3 py-[6px] border-b border-[#f0f2f5]">
              <div className="flex items-center gap-[3px] bg-[#fde8e8] rounded-full px-[6px] py-[2px]">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#e74c3c"><path d="M8 5v14l11-7z" /></svg>
                <span className="text-[8px] text-[#e74c3c] font-semibold">CANLI</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>

            <div className="px-3 py-2.5">
              <div className="flex items-center">
                <div className="flex-1 flex items-center justify-end gap-[6px]">
                  <span className="text-[11px] text-[#1a2332] font-medium truncate text-right">{match.team1}</span>
                  <img src={match.logo1} alt="" className="w-[24px] h-[24px] object-contain flex-shrink-0" />
                </div>
                <div className="flex flex-col items-center px-4">
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[14px] font-bold text-[#1a2332]">{match.score1}</span>
                    <span className="text-[10px] font-bold text-[#9ca3af]">:</span>
                    <span className="text-[14px] font-bold text-[#1a2332]">{match.score2}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#e74c3c] animate-pulse-dot" />
                    <span className="text-[9px] text-[#e74c3c] font-semibold">{match.minute}<span className="animate-pulse-dot">&apos;</span></span>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-[6px]">
                  <img src={match.logo2} alt="" className="w-[24px] h-[24px] object-contain flex-shrink-0" />
                  <span className="text-[11px] text-[#1a2332] font-medium truncate">{match.team2}</span>
                </div>
              </div>
            </div>

            <div className="px-3 pb-3">
              <div className="flex gap-[5px]">
                {match.odds.map((odd, j) => (
                  <span key={j} className={`flex-1 bg-[#edf5ff] border border-[#e8ecf1] rounded-lg py-[6px] px-[8px] flex items-center justify-between ${odd.trend === 'up' ? 'animate-flash-green' : odd.trend === 'down' ? 'animate-flash-red' : ''}`}>
                    <span className="text-[9px] text-[#737B8C] font-semibold uppercase">{odd.label}</span>
                    <span className={`text-[10px] font-medium flex items-center gap-[2px] ${odd.trend === 'up' ? 'text-[#27ae60]' : odd.trend === 'down' ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>
                      {odd.value}
                      {odd.trend === 'up' && <svg width="8" height="8" viewBox="0 0 24 24" fill="#27ae60"><path d="M7 14l5-5 5 5z" /></svg>}
                      {odd.trend === 'down' && <svg width="8" height="8" viewBox="0 0 24 24" fill="#e74c3c"><path d="M7 10l5 5 5-5z" /></svg>}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Maç Öncesi Etkinlikler ── */}
      <div className="px-4 pb-4">
        <h2 className="text-[14px] font-bold text-[#1a2332] mb-3">Maç Öncesi Etkinlikler</h2>

        <div className="flex flex-col gap-3">
          {preMatchEvents.map((match, i) => (
            <Link key={i} href="/match?id=bes-tra" className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
              <div className="flex items-center justify-between px-3 py-[6px] border-b border-[#f0f2f5]">
                <span className="text-[9px] text-[#737B8C] font-medium">{match.dateTime}</span>
                <div className="flex items-center gap-[6px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>

              <div className="px-3 pt-3 pb-2">
                <div className="flex items-center">
                  <div className="flex-1 flex items-center justify-end gap-[6px]">
                    <span className="text-[11px] text-[#1a2332] font-medium truncate text-right">{match.team1}</span>
                    <img src={match.logo1} alt="" className="w-[24px] h-[24px] object-contain flex-shrink-0" />
                  </div>
                  <div className="px-4">
                    <span className="text-[13px] font-medium text-[#1a2332]">VS</span>
                  </div>
                  <div className="flex-1 flex items-center gap-[6px]">
                    <img src={match.logo2} alt="" className="w-[24px] h-[24px] object-contain flex-shrink-0" />
                    <span className="text-[11px] text-[#1a2332] font-medium truncate">{match.team2}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-[4px] mt-2.5">
                  <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px]">{match.countdown.hours}</span>
                  <span className="text-[#1a2332] font-bold text-[10px]">:</span>
                  <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px]">{match.countdown.minutes}</span>
                  <span className="text-[#1a2332] font-bold text-[10px]">:</span>
                  <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px]">{match.countdown.seconds}</span>
                </div>
              </div>

              <div className="px-3">
                <span className="text-[11px] font-bold text-[#1a2332]">1X2</span>
              </div>

              <div className="px-3 py-2 pb-3">
                <div className="flex gap-[5px]">
                  {match.odds.map((odd, j) => (
                    <span key={j} className={`flex-1 bg-[#edf5ff] border border-[#e8ecf1] rounded-lg py-[8px] px-[8px] flex items-center justify-between ${odd.trend === 'up' ? 'animate-flash-green' : odd.trend === 'down' ? 'animate-flash-red' : ''}`}>
                      <span className="text-[9px] text-[#737B8C] font-medium uppercase">{odd.label}</span>
                      <span className={`text-[10px] font-medium flex items-center gap-[2px] ${odd.trend === 'up' ? 'text-[#27ae60]' : odd.trend === 'down' ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>
                        {odd.value}
                        {odd.trend === 'up' && <svg width="8" height="8" viewBox="0 0 24 24" fill="#27ae60"><path d="M7 14l5-5 5 5z" /></svg>}
                        {odd.trend === 'down' && <svg width="8" height="8" viewBox="0 0 24 24" fill="#e74c3c"><path d="M7 10l5 5 5-5z" /></svg>}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
