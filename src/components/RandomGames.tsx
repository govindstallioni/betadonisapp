import SectionHeader from './SectionHeader'

const games = [
  { name: 'Grand Spinn', bg: 'linear-gradient(160deg, #fbbf24 0%, #78350f 100%)' },
  { name: 'Mega Moolah', bg: 'linear-gradient(160deg, #f472b6 0%, #831843 100%)' },
  { name: 'Starburst', bg: 'linear-gradient(160deg, #a78bfa 0%, #4c1d95 100%)' },
  { name: 'Gonzo Quest', bg: 'linear-gradient(160deg, #2dd4bf 0%, #134e4a 100%)' },
  { name: 'Book of Dead', bg: 'linear-gradient(160deg, #fb923c 0%, #7c2d12 100%)' },
]

export default function RandomGames() {
  return (
    <div>
      <SectionHeader title="Random Games" />
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {games.map((game) => (
          <div
            key={game.name}
            className="flex-shrink-0 w-[105px] h-[135px] rounded-2xl flex items-end p-[10px] cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            style={{ background: game.bg }}
          >
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15" />
            <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-white/10" />
            <span className="text-[11px] font-bold text-white leading-tight drop-shadow-sm relative z-10">
              {game.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
