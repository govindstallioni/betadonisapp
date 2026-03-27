import SectionHeader from './SectionHeader'

const virtualSports = [
  { name: 'Futbol', image: '/virtualbet/banner3.png' },
  { name: 'Tenis', image: '/virtualbet/banner2.png' },
  { name: 'Basketbol', image: '/virtualbet/banner1.png' },
]

export default function VirtualBets() {
  return (
    <div>
      <SectionHeader title="Sanal Bahisler" badge="Spor" />
      <div className="flex flex-col gap-[10px]">
        {virtualSports.map((sport) => (
          <div
            key={sport.name}
            className="w-full rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform relative"
          >
            <img
              src={sport.image}
              alt={sport.name}
              className="w-full h-auto object-contain"
            />
            {/* Badges top-left */}
            <div className="absolute top-[10px] left-[10px] flex gap-[6px] z-10">
              <span className="flex items-center gap-[4px] bg-black/60 backdrop-blur-sm rounded-full px-[8px] py-[3px] text-[10px] font-bold text-white">
                🔥 Dota
              </span>
              <span className="flex items-center gap-[4px] bg-red-600 rounded-full px-[8px] py-[3px] text-[10px] font-bold text-white">
                <span className="w-[5px] h-[5px] rounded-full bg-white animate-pulse" />
                Live
              </span>
            </div>
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Sport name */}
            <span className="absolute bottom-[12px] left-[14px] text-[16px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {sport.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
