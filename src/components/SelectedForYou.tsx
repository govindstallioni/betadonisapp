import SectionHeader from './SectionHeader'

const games = [
  {
    name: 'Gates of Olympus',
    provider: 'Pragmatic Play',
    image: '/for%20you/1.png',
    accent: '#fbbf24',
  },
  {
    name: 'Book of Dead',
    provider: 'Play\'n GO',
    image: '/for%20you/2.png',
    accent: '#f59e0b',
  },
  {
    name: 'Big Bass Bonanza',
    provider: 'Pragmatic Play',
    image: '/for%20you/3.png',
    accent: '#38bdf8',
  },
]

export default function SelectedForYou() {
  return (
    <div>
      <SectionHeader title="Sizin İçin Seçtiklerimiz" badge="Casino" />
      <div className="space-y-[10px]">
        {games.map((game) => (
          <div
            key={game.name}
            className="w-full h-[200px] rounded-2xl cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform relative overflow-hidden"
            style={{
              backgroundImage: `url(${game.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="relative z-10 flex flex-col justify-end h-full px-[18px] pb-[14px]">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-[15px] font-bold text-white leading-tight">{game.name}</div>
                  <div className="text-[12px] text-white/70 font-medium mt-[3px]">{game.provider}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
