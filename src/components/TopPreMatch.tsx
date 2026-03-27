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
  odds: { label: string; value: string }[]
}

const matches: PreMatch[] = [
  {
    league: 'Türkiye, Süper Lig',
    team1: 'Beşiktaş',
    team2: 'Trabzonspor',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    date: '25 Mar',
    time: '20:00',
    totalOdds: 35,
    odds: [
      { label: '1', value: '1.85' },
      { label: 'X', value: '3.40' },
      { label: '2', value: '4.20' },
    ],
  },
  {
    league: 'İngiltere, Premier Lig',
    team1: 'Liverpool',
    team2: 'Chelsea',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    date: '26 Mar',
    time: '22:00',
    totalOdds: 42,
    odds: [
      { label: '1', value: '1.55' },
      { label: 'X', value: '4.10' },
      { label: '2', value: '5.20' },
    ],
  },
  {
    league: 'İspanya, La Liga',
    team1: 'Atletico Madrid',
    team2: 'Sevilla',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    date: '27 Mar',
    time: '19:30',
    totalOdds: 38,
    odds: [
      { label: '1', value: '2.10' },
      { label: 'X', value: '3.25' },
      { label: '2', value: '3.50' },
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
            className="flex-shrink-0 w-[75%] bg-white rounded-xl overflow-hidden border border-[#e8ecf1]"
          >
            {/* League header */}
            <div className="flex items-center justify-between px-[10px] py-[7px] border-b border-[#f0f2f5]">
              <div className="flex items-center gap-[4px]">
                <svg width="12" height="12" viewBox="0 0 512 512" fill="#374957">
                  <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z" />
                </svg>
                <span className="text-[10px] text-[#737B8C] font-medium truncate max-w-[110px]">{match.league}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>

            {/* Match center: teams + date/time */}
            <div className="px-[10px] py-[10px]">
              <div className="flex items-center">
                {/* Team 1 */}
                <div className="flex-1 flex flex-col items-center gap-[4px]">
                  <img src={match.logo1} alt={match.team1} className="w-[26px] h-[26px] object-contain" />
                  <span className="text-[10px] text-[#374957] font-semibold leading-tight text-center">{match.team1}</span>
                </div>

                {/* Date & Time center */}
                <div className="flex flex-col items-center px-[8px]">
                  <div className="bg-[#374957] rounded-md px-[8px] py-[3px] flex items-center gap-[2px]">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span className="text-[12px] font-bold text-white leading-none ml-[2px]">{match.time}</span>
                  </div>
                  <span className="text-[9px] text-[#737B8C] font-semibold mt-[4px]">{match.date}</span>
                </div>

                {/* Team 2 */}
                <div className="flex-1 flex flex-col items-center gap-[4px]">
                  <img src={match.logo2} alt={match.team2} className="w-[26px] h-[26px] object-contain" />
                  <span className="text-[10px] text-[#374957] font-semibold leading-tight text-center">{match.team2}</span>
                </div>
              </div>
            </div>

            {/* Odds */}
            <div className="px-[10px] pb-[10px]">
              <div className="flex gap-[5px]">
                {match.odds.map((odd, j) => (
                  <button
                    key={j}
                    className="flex-1 bg-[#f5f7fa] border border-[#e8ecf1] rounded-lg py-[6px] text-center hover:bg-[#edf0f5] transition-all"
                  >
                    <div className="text-[8px] text-[#737B8C] font-semibold leading-none mb-[3px] uppercase">{odd.label}</div>
                    <div className="text-[12px] font-bold text-[#374957] leading-none">{odd.value}</div>
                  </button>
                ))}
              </div>
              <button className="w-full text-center mt-[8px]">
                <span className="text-[10px] text-[#0E8FCF] font-semibold">+{match.totalOdds} bahis seçeneği →</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
