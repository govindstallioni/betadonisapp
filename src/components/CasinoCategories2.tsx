import SectionHeader from './SectionHeader'

const games = [
  { name: 'Olympus 1000', bg: 'linear-gradient(160deg, #818cf8 0%, #312e81 100%)' },
  { name: 'Saray', bg: 'linear-gradient(160deg, #fbbf24 0%, #92400e 100%)' },
  { name: 'Flaming Hot', bg: 'linear-gradient(160deg, #f87171 0%, #991b1b 100%)' },
  { name: 'Big Bass', bg: 'linear-gradient(160deg, #38bdf8 0%, #0c4a6e 100%)' },
  { name: 'Wild Riches', bg: 'linear-gradient(160deg, #4ade80 0%, #14532d 100%)' },
]

export default function CasinoCategories2() {
  return (
    <div>
      <SectionHeader title="Categories" badge="Casino" />
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {games.map((game) => (
          <div
            key={game.name}
            className="flex-shrink-0 w-[95px] h-[125px] rounded-2xl flex items-end p-[10px] cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
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
