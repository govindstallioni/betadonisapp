import SectionHeader from './SectionHeader'

interface LiveMatch {
  league: string
  team1: string
  team2: string
  logo1: string
  logo2: string
  score1: number
  score2: number
  minute: string
  half: string
  hasStream: boolean
  odds: { label: string; value: string }[]
  totalOdds: number
}

const liveMatches: LiveMatch[] = [
  {
    league: 'Türkiye, Süper Lig',
    team1: 'Galatasaray',
    team2: 'Fenerbahçe',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    score1: 2,
    score2: 1,
    minute: "67'",
    half: '2Y',
    hasStream: true,
    odds: [
      { label: '1', value: '1.85' },
      { label: 'X', value: '3.40' },
      { label: '2', value: '4.20' },
    ],
    totalOdds: 48,
  },
  {
    league: 'İngiltere, Premier Lig',
    team1: 'Manchester City',
    team2: 'Arsenal',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    score1: 0,
    score2: 0,
    minute: "23'",
    half: '1Y',
    hasStream: true,
    odds: [
      { label: '1', value: '2.10' },
      { label: 'X', value: '3.25' },
      { label: '2', value: '3.50' },
    ],
    totalOdds: 52,
  },
  {
    league: 'İspanya, La Liga',
    team1: 'Real Madrid',
    team2: 'Barcelona',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    score1: 1,
    score2: 2,
    minute: "78'",
    half: '2Y',
    hasStream: false,
    odds: [
      { label: '1', value: '3.10' },
      { label: 'X', value: '3.60' },
      { label: '2', value: '2.15' },
    ],
    totalOdds: 61,
  },
]

export default function LiveBets() {
  return (
    <div>
      <SectionHeader title="En iyi CANLI BAHİS" badge="Spor" />
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {liveMatches.map((match, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[75%] bg-white rounded-xl overflow-hidden border border-[#e8ecf1]"
          >
            {/* League header */}
            <div className="flex items-center justify-between px-[10px] py-[7px] border-b border-[#f0f2f5]">
              <div className="flex items-center gap-[5px]">
                <span className="w-[6px] h-[6px] bg-accent-red rounded-full animate-pulse-dot" />
                <span className="text-[10px] text-[#737B8C] font-medium truncate max-w-[110px]">{match.league}</span>
              </div>
              <div className="flex items-center gap-[6px]">
                {match.hasStream && (
                  <div className="flex items-center gap-[3px] bg-[#eef7fc] rounded-full px-[5px] py-[2px]">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#0E8FCF">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="text-[8px] text-[#0E8FCF] font-semibold">CANLI</span>
                  </div>
                )}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
            </div>

            {/* Match center: teams + score */}
            <div className="px-[10px] py-[10px]">
              <div className="flex items-center">
                {/* Team 1 */}
                <div className="flex-1 flex flex-col items-center gap-[4px]">
                  <img src={match.logo1} alt={match.team1} className="w-[26px] h-[26px] object-contain" />
                  <span className="text-[10px] text-[#374957] font-semibold leading-tight text-center">{match.team1}</span>
                </div>

                {/* Score center */}
                <div className="flex flex-col items-center px-[8px]">
                  <div className="bg-[#374957] rounded-md px-[8px] py-[3px] flex items-center gap-[4px]">
                    <span className="text-[13px] font-bold text-white leading-none">{match.score1}</span>
                    <span className="text-[10px] font-bold text-[#556677] leading-none">:</span>
                    <span className="text-[13px] font-bold text-white leading-none">{match.score2}</span>
                  </div>
                  <div className="flex items-center gap-[3px] mt-[4px]">
                    <span className="w-[4px] h-[4px] bg-accent-red rounded-full animate-pulse-dot" />
                    <span className="text-[10px] font-bold text-accent-red leading-none">{match.minute}</span>
                    <span className="text-[9px] text-[#737B8C] font-medium leading-none">{match.half}</span>
                  </div>
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
