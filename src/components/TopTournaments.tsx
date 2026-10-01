import Link from 'next/link'
import SectionHeader from './SectionHeader'
import { esportGames, ESPORTS_HREF } from '@/data/esports'

// Home "CANLI Turnuvalar" — an e-sports block (work3 task 11): the rows are
// the most-played e-sports titles, and both the rows and "Tümü" open the
// E-Spor section of the Sporlar screen.
const featured = ['Counter-Strike', 'League of Legends', 'Dota 2', 'Valorant', 'Mobile Legends', 'Call of Duty']
const tournaments = featured.map((label) => esportGames.find((g) => g.label === label)!)
const total = esportGames.reduce((n, g) => n + g.count, 0)

// Split into chunks of 3
const chunks: (typeof tournaments)[] = []
for (let i = 0; i < tournaments.length; i += 3) {
  chunks.push(tournaments.slice(i, i + 3))
}

export default function TopTournaments() {
  return (
    <div>
      <SectionHeader title="CANLI Turnuvalar" badge="Esports" showAll count={total} href={ESPORTS_HREF} />
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mr-3">
        {chunks.map((chunk, ci) => (
          <div
            key={ci}
            className="flex-shrink-0 w-[85%] bg-white rounded-2xl overflow-hidden border border-[#e8ecf1]"
          >
            {chunk.map((t, i) => (
              <Link
                key={t.label}
                href={ESPORTS_HREF}
                className={`flex items-center justify-between px-[14px] py-[11px] ${
                  i < chunk.length - 1 ? 'border-b border-[#f0f2f5]' : ''
                }`}
              >
                {/* Left: game icon + title */}
                <div className="flex items-center gap-[10px] flex-1 min-w-0">
                  <span className="w-[22px] h-[22px] rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0 [&>img]:w-[16px] [&>img]:h-[16px]">{t.icon}</span>
                  <span className="text-[11px] text-[#1a2332] font-medium truncate">{t.label}</span>
                  <div className="flex items-center gap-[3px] bg-[#fde8e8] rounded-full px-[6px] py-[2px] flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#e74c3c">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="text-[9px] text-[#e74c3c] font-semibold">CANLI</span>
                  </div>
                </div>

                {/* Right: fixture count + chevron */}
                <div className="flex items-center gap-[6px] flex-shrink-0 ml-[10px]">
                  <span className="text-[10px] text-[#1a2332] font-medium bg-[#edf5ff] rounded-full min-w-[20px] h-[20px] px-[4px] flex items-center justify-center">{t.count}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
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
