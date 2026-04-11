'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface EventDetailProps {
  event: {
    title: string
    color: string
    banner?: string
  }
}

const tabs = ['Takvim', 'Maçlarım', 'İstatistikler']

const generateDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 10; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push({
      day: d.getDate(),
      month: d.toLocaleDateString('tr-TR', { month: 'long' }),
      isToday: i === 0,
    })
  }
  return dates
}

const dates = generateDates()

const preMatchEvents = [
  {
    league: 'Şampiyonlar Ligi. Grup Aşaması',
    leagueIcon: '/events/champions-league.png',
    team1: 'Galatasaray',
    team2: 'Bayern Münih',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    countdown: { hours: '03', minutes: '34', seconds: '24' },
    dateTime: '28.03.26 07:30 pm',
    odds: [
      { label: 'Ev1', value: '2.45', trend: 'up' as const },
      { label: 'X', value: '3.25' },
      { label: 'Dep2', value: '2.80', trend: 'down' as const },
    ],
  },
  {
    league: 'Şampiyonlar Ligi. Grup Aşaması',
    leagueIcon: '/events/champions-league.png',
    team1: 'Real Madrid',
    team2: 'Manchester City',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    countdown: { hours: '05', minutes: '12', seconds: '48' },
    dateTime: '28.03.26 10:00 pm',
    odds: [
      { label: 'Ev1', value: '1.95' },
      { label: 'X', value: '3.60', trend: 'up' as const },
      { label: 'Dep2', value: '3.10', trend: 'down' as const },
    ],
  },
]

const myTeams = [
  { name: 'Galatasaray', logo: '/teams/jersey1.png' },
  { name: 'Real Madrid', logo: '/teams/jersey2.png' },
  { name: 'Bayern Münih', logo: '/teams/jersey1.png' },
  { name: 'Barcelona', logo: '/teams/jersey2.png' },
  { name: 'Manchester City', logo: '/teams/jersey1.png' },
  { name: 'Fenerbahçe', logo: '/teams/jersey2.png' },
]

const teamMatches = [
  {
    league: 'Şampiyonlar Ligi. Grup Aşaması',
    leagueIcon: '/events/champions-league.png',
    team1: 'Galatasaray',
    team2: 'Bayern Münih',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    countdown: { hours: '01', minutes: '08', seconds: '59' },
    dateTime: '28.03.26 07:30 pm',
    odds: [
      { label: 'Ev1', value: '1.927' },
      { label: 'X', value: '50', trend: 'up' as const },
      { label: 'Dep2', value: '1.924', trend: 'down' as const },
    ],
  },
  {
    league: 'Şampiyonlar Ligi. Grup Aşaması',
    leagueIcon: '/events/champions-league.png',
    team1: 'Real Madrid',
    team2: 'Manchester City',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    countdown: { hours: '03', minutes: '22', seconds: '15' },
    dateTime: '28.03.26 10:00 pm',
    odds: [
      { label: 'Ev1', value: '2.10', trend: 'up' as const },
      { label: 'X', value: '3.40' },
      { label: 'Dep2', value: '2.85', trend: 'down' as const },
    ],
  },
]

const playoffTeams = [
  { name: 'Galatasaray', odds: '4.33', logo: '/teams/jersey1.png' },
  { name: 'Real Madrid', odds: '6.50', logo: '/teams/jersey2.png' },
  { name: 'Bayern Münih', odds: '8.00', logo: '/teams/jersey1.png' },
  { name: 'Manchester City', odds: '3.75', logo: '/teams/jersey2.png' },
  { name: 'Barcelona', odds: '5.20', logo: '/teams/jersey1.png' },
]

export default function EventDetail({ event }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [activeDate, setActiveDate] = useState(0)
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative">
      {/* Hero Banner */}
      <div className="relative h-[180px] overflow-hidden">
        <img src="/events/bannerbg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* Event title */}
        <div className="absolute bottom-5 left-4 z-10">
          <h1 className="text-[14px] font-medium text-white drop-shadow-lg">{event.title}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-2">
        <div className="bg-[#edf5ff] rounded-full p-[3px] flex items-center">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-[7px] rounded-full text-[9px] font-medium text-center transition-all ${
                activeTab === i
                  ? 'bg-[#0E8FCF] text-white shadow-sm'
                  : 'text-[#737B8C]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Date Picker */}
          <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-4 py-3">
            {dates.map((date, i) => (
              <button
                key={i}
                onClick={() => setActiveDate(i)}
                className={`flex-shrink-0 flex flex-col items-center gap-[2px] rounded-xl px-[14px] py-[10px] transition-all relative ${
                  activeDate === i
                    ? 'bg-[#0E8FCF] text-white'
                    : 'bg-white text-[#1a2332]'
                }`}
              >
                {date.isToday && (
                  <span className={`absolute top-[5px] right-[8px] w-[6px] h-[6px] rounded-full ${activeDate === i ? 'bg-green-300' : 'bg-green-500'}`} />
                )}
                <span className="text-[11px] font-medium leading-none">{date.day}</span>
                <span className={`text-[9px] leading-none ${activeDate === i ? 'text-white/80' : 'text-[#737B8C]'}`}>
                  {date.month}
                </span>
              </button>
            ))}
          </div>

          {/* Pre-match events */}
          <div className="px-4 pb-4">
            <h2 className="text-[15px] font-bold text-[#1a2332] mb-3">Maç Öncesi Etkinlikler</h2>

            <div className="flex flex-col gap-3">
              {preMatchEvents.map((match, i) => (
                <Link key={i} href={`/match?id=${i === 0 ? 'gs-bay' : 'rma-mci'}`} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
                  {/* League header */}
                  <div className="flex items-center justify-between px-3 py-[8px] border-b border-[#f0f2f5]">
                    <div className="flex items-center gap-[6px]">
                      <img src={match.leagueIcon} alt="" className="w-[20px] h-[20px] rounded-full object-cover" />
                      <span className="text-[10px] text-[#737B8C] font-medium">{match.league}</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                  </div>

                  {/* Teams + VS */}
                  <div className="px-3 pt-3 pb-2">
                    <div className="flex items-center">
                      <div className="flex-1 flex items-center justify-end gap-[6px]">
                        <span className="text-[11px] text-[#1a2332] font-medium leading-tight truncate text-right">{match.team1}</span>
                        <img src={match.logo1} alt={match.team1} className="w-[28px] h-[28px] object-contain flex-shrink-0" />
                      </div>
                      <div className="px-[16px]">
                        <span className="text-[13px] font-medium text-[#1a2332]">VS</span>
                      </div>
                      <div className="flex-1 flex items-center gap-[6px]">
                        <img src={match.logo2} alt={match.team2} className="w-[28px] h-[28px] object-contain flex-shrink-0" />
                        <span className="text-[11px] text-[#1a2332] font-medium leading-tight truncate">{match.team2}</span>
                      </div>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-center justify-center gap-[4px] mt-3">
                      <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px] leading-none">{match.countdown.hours}</span>
                      <span className="text-[#1a2332] font-bold text-[10px]">:</span>
                      <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px] leading-none">{match.countdown.minutes}</span>
                      <span className="text-[#1a2332] font-bold text-[10px]">:</span>
                      <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px] leading-none">{match.countdown.seconds}</span>
                    </div>

                    {/* Date/time */}
                    <p className="text-[9px] text-[#737B8C] text-center mt-[6px]">{match.dateTime}</p>
                  </div>

                  {/* 1X2 label */}
                  <div className="px-3">
                    <span className="text-[11px] font-bold text-[#1a2332]">1X2</span>
                  </div>

                  {/* Odds */}
                  <div className="px-3 py-2 pb-3">
                    <div className="flex gap-[5px]">
                      {match.odds.map((odd, j) => (
                        <span
                          key={j}
                          className={`flex-1 bg-[#edf5ff] border border-[#e8ecf1] rounded-lg py-[8px] px-[8px] flex items-center justify-between ${odd.trend === 'up' ? 'animate-flash-green' : odd.trend === 'down' ? 'animate-flash-red' : ''}`}
                        >
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

          {/* Playoff section */}
          <div className="px-4 pb-24">
            <h2 className="text-[15px] font-bold text-[#1a2332] mb-3">Playoff'u Kim Kazanır?</h2>

            <div className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
              {playoffTeams.map((team, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-3 ${
                    i < playoffTeams.length - 1 ? 'border-b border-[#f0f2f5]' : ''
                  }`}
                >
                  <img src={team.logo} alt={team.name} className="w-[32px] h-[32px] object-contain flex-shrink-0" />
                  <div className="flex-1 bg-[#edf5ff] rounded-lg px-3 py-[8px] flex items-center justify-between">
                    <span className="text-[10px] text-[#737B8C] font-medium">{team.name} - Evet</span>
                    <span className="text-[10px] font-medium text-[#1a2332]">{team.odds}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-3 py-[10px] bg-[#0E8FCF] text-white text-[12px] font-medium rounded-xl hover:bg-[#0a7ab5] transition-colors">
              Katılımcılar
            </button>
          </div>
        </>
      )}

      {/* My Games Tab */}
      {activeTab === 1 && (
        <div className="pb-24">
          {/* My Bets card */}
          <div className="px-4 pt-3">
            <div className="bg-white rounded-xl border border-[#e8ecf1] px-3
             py-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="text-[12px] font-medium text-[#1a2332]">Bahislerim</span>
            </div>
          </div>

          {/* My Teams */}
          <div className="px-4 pt-4">
            <h2 className="text-[15px] font-bold text-[#1a2332] mb-3">Takımlarım</h2>
          </div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
            {/* Change button */}
            <div className="flex-shrink-0 flex flex-col items-center gap-[6px]">
              <div className="w-[56px] h-[56px] rounded-xl bg-white border border-[#e8ecf1] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                  <circle cx="8" cy="6" r="2" fill="#737B8C" />
                  <circle cx="16" cy="12" r="2" fill="#737B8C" />
                  <circle cx="10" cy="18" r="2" fill="#737B8C" />
                </svg>
              </div>
              <span className="text-[9px] font-medium text-[#737B8C] text-center w-[60px]">Değiştir</span>
            </div>
            {/* Team items */}
            {myTeams.map((team, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-[6px]">
                <div className="w-[56px] h-[56px] rounded-xl bg-white border border-[#e8ecf1] flex items-center justify-center overflow-hidden p-1">
                  <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[9px] font-medium text-[#1a2332] text-center w-[60px] leading-tight line-clamp-2">{team.name}</span>
              </div>
            ))}
          </div>

          {/* Teams' matches */}
          <div className="px-4">
            <h2 className="text-[15px] font-bold text-[#1a2332] mb-3">Takım Maçları</h2>

            <div className="flex flex-col gap-3">
              {teamMatches.map((match, i) => (
                <Link key={i} href={`/match?id=${i === 0 ? 'gs-bay' : 'rma-mci'}`} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
                  {/* League header */}
                  <div className="flex items-center justify-between px-3 py-[8px] border-b border-[#f0f2f5]">
                    <div className="flex items-center gap-[6px]">
                      <img src={match.leagueIcon} alt="" className="w-[20px] h-[20px] rounded-full object-cover" />
                      <span className="text-[10px] text-[#737B8C] font-medium">{match.league}</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                  </div>

                  {/* Teams + VS */}
                  <div className="px-3 pt-3 pb-2">
                    <div className="flex items-center">
                      <div className="flex-1 flex items-center justify-end gap-[6px]">
                        <span className="text-[11px] text-[#1a2332] font-medium leading-tight truncate text-right">{match.team1}</span>
                        <img src={match.logo1} alt={match.team1} className="w-[28px] h-[28px] object-contain flex-shrink-0" />
                      </div>
                      <div className="px-[16px]">
                        <span className="text-[13px] font-medium text-[#1a2332]">VS</span>
                      </div>
                      <div className="flex-1 flex items-center gap-[6px]">
                        <img src={match.logo2} alt={match.team2} className="w-[28px] h-[28px] object-contain flex-shrink-0" />
                        <span className="text-[11px] text-[#1a2332] font-medium leading-tight truncate">{match.team2}</span>
                      </div>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-center justify-center gap-[4px] mt-3">
                      <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px] leading-none">{match.countdown.hours}</span>
                      <span className="text-[#1a2332] font-bold text-[10px]">:</span>
                      <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px] leading-none">{match.countdown.minutes}</span>
                      <span className="text-[#1a2332] font-bold text-[10px]">:</span>
                      <span className="bg-[#edf5ff] text-[#1a2332] text-[10px] font-medium rounded-md px-[6px] py-[3px] leading-none">{match.countdown.seconds}</span>
                    </div>

                    {/* Date/time */}
                    <p className="text-[9px] text-[#737B8C] text-center mt-[6px]">{match.dateTime}</p>
                  </div>

                  {/* 1X2 label */}
                  <div className="px-3">
                    <span className="text-[11px] font-bold text-[#1a2332]">1X2</span>
                  </div>

                  {/* Odds */}
                  <div className="px-3 py-2 pb-3">
                    <div className="flex gap-[5px]">
                      {match.odds.map((odd, j) => (
                        <span
                          key={j}
                          className={`flex-1 bg-[#edf5ff] border border-[#e8ecf1] rounded-lg py-[8px] px-[8px] flex items-center justify-between ${odd.trend === 'up' ? 'animate-flash-green' : odd.trend === 'down' ? 'animate-flash-red' : ''}`}
                        >
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

            <button className="w-full mt-3 py-[10px] bg-[#0E8FCF] text-white text-[12px] font-medium rounded-xl hover:bg-[#0a7ab5] transition-colors">
              Tüm Maçlar
            </button>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 2 && (
        <div className="pb-24">
          {/* Standings card */}
          <div className="px-4 pt-3">
            <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <div>
                <span className="text-[12px] font-medium text-[#1a2332] block">Puan Durumu</span>
                <span className="text-[9px] text-[#737B8C]">Takımların sıralamalarını öğrenin</span>
              </div>
            </div>
          </div>

          {/* Venues */}
          <div className="px-4 pt-4">
            <h2 className="text-[15px] font-bold text-[#1a2332] mb-3">Mekanlar</h2>

            <div className="flex flex-col gap-3">
              {/* Venue 1 */}
              <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0E8FCF">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-[#1a2332]">Atatürk Olimpiyat Stadı (İstanbul)</span>
                </div>
                <div className="ml-12 mt-2 flex flex-col gap-[4px]">
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[5px] h-[5px] rounded-full bg-[#0E8FCF]" />
                    <span className="text-[10px] text-[#0E8FCF] font-medium">Kapasite: 76092</span>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[5px] h-[5px] rounded-full bg-[#0E8FCF]" />
                    <span className="text-[10px] text-[#0E8FCF] font-medium">Açılış: 2002</span>
                  </div>
                </div>
              </div>

              {/* Venue 2 */}
              <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0E8FCF">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-[#1a2332]">Türk Telekom Stadyumu (İstanbul)</span>
                </div>
                <div className="ml-12 mt-2 flex flex-col gap-[4px]">
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[5px] h-[5px] rounded-full bg-[#0E8FCF]" />
                    <span className="text-[10px] text-[#0E8FCF] font-medium">Kapasite: 52652</span>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[5px] h-[5px] rounded-full bg-[#0E8FCF]" />
                    <span className="text-[10px] text-[#0E8FCF] font-medium">Açılış: 2011</span>
                  </div>
                </div>
              </div>

              {/* Venue 3 */}
              <div className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0E8FCF">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-[#1a2332]">Şükrü Saracoğlu Stadı (İstanbul)</span>
                </div>
              </div>

              <button className="w-full py-[10px] bg-[#0E8FCF] text-white text-[12px] font-medium rounded-xl hover:bg-[#0a7ab5] transition-colors">
                Tüm Mekanlar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
