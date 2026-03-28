import SectionHeader from './SectionHeader'

interface PreMatch {
  league: string
  team1: string
  team2: string
  logo1: string
  logo2: string
  date: string
  time: string
  totalOdds: number
  odds: { label: string; value: string; trend?: 'up' | 'down' }[]
}

const matches: PreMatch[] = [
  {
    league: 'Türkiye, Süper Lig',
    team1: 'Beşiktaş',
    team2: 'Trabzonspor',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    date: '25 Mar',
    time: '8:00 PM',
    totalOdds: 35,
    odds: [
      { label: 'W1', value: '1.85', trend: 'up' },
      { label: 'X', value: '3.40' },
      { label: 'W2', value: '4.20', trend: 'down' },
    ],
  },
  {
    league: 'İngiltere, Premier Lig',
    team1: 'Liverpool',
    team2: 'Chelsea',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    date: '26 Mar',
    time: '10:00 PM',
    totalOdds: 42,
    odds: [
      { label: 'W1', value: '1.55' },
      { label: 'X', value: '4.10', trend: 'up' },
      { label: 'W2', value: '5.20', trend: 'down' },
    ],
  },
  {
    league: 'İspanya, La Liga',
    team1: 'Atletico Madrid',
    team2: 'Sevilla',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    date: '27 Mar',
    time: '7:30 PM',
    totalOdds: 38,
    odds: [
      { label: 'W1', value: '2.10', trend: 'down' },
      { label: 'X', value: '3.25' },
      { label: 'W2', value: '3.50', trend: 'up' },
    ],
  },
]

export default function TopPreMatch() {
  return (
    <div>
      <SectionHeader title="En iyi Maç Öncesi" badge="Spor" showAll />
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {matches.map((match, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[85%] bg-white rounded-xl overflow-hidden border border-[#e8ecf1]"
          >
            {/* League header */}
            <div className="flex items-center justify-between px-[10px] py-[7px] border-b border-[#f0f2f5]">
              <div className="flex items-center gap-[2px]">
                <svg width="18" height="18" viewBox="0 0 512 512" fill="#374957">
                  <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z" />
                </svg>
                <span className="text-[10px] text-[#737B8C] font-medium truncate max-w-[110px]">{match.league}</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>

            {/* Match center: teams + date/time */}
            <div className="px-[10px] py-[10px]">
              <div className="flex items-center">
                {/* Team 1 */}
                <div className="flex-1 flex items-center justify-end gap-[6px]">
                  <span className="text-[11px] text-[#1a2332] font-medium leading-tight truncate text-right">{match.team1}</span>
                  <img src={match.logo1} alt={match.team1} className="w-[22px] h-[22px] object-contain flex-shrink-0" />
                </div>

                {/* VS center */}
                <div className="flex flex-col items-center px-[16px]">
                  <span className="text-[14px] font-bold text-[#1a2332] leading-none">VS</span>
                </div>

                {/* Team 2 */}
                <div className="flex-1 flex items-center gap-[6px]">
                  <img src={match.logo2} alt={match.team2} className="w-[22px] h-[22px] object-contain flex-shrink-0" />
                  <span className="text-[11px] text-[#1a2332] font-medium leading-tight truncate">{match.team2}</span>
                </div>
              </div>
              <p className="text-[9px] text-[#737B8C] text-center mt-[6px]">{match.date}, {match.time}</p>
            </div>

            {/* Odds */}
            <div className="px-[10px] pb-[10px]">
              <div className="flex gap-[5px]">
                {match.odds.map((odd, j) => (
                  <button
                    key={j}
                    className="flex-1 bg-[#edf5ff] border border-[#e8ecf1] rounded-lg py-[6px] px-[8px] flex items-center justify-between hover:bg-[#edf0f5] transition-all"
                  >
                    <span className="text-[9px] text-[#737B8C] font-semibold uppercase">{odd.label}</span>
                    <span className={`text-[10px] font-medium ${odd.trend === 'up' ? 'text-[#27ae60]' : odd.trend === 'down' ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>{odd.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
