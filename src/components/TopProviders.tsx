import SectionHeader from './SectionHeader'

const providers = [
  {
    name: 'Pragmatic',
    games: 285,
    image: '/providers/provider1.png',
    accent: '#f5c518',
  },
  {
    name: '3 Oaks Gaming',
    games: 192,
    image: '/providers/provider2.png',
    accent: '#ff6b35',
  },
  {
    name: 'Abracadabra',
    games: 214,
    image: '/providers/provider3.png',
    accent: '#76ff03',
  },
]

export default function TopProviders() {
  return (
    <div>
      <SectionHeader title="Bu Ayın En İyi Sağlayıcısı" badge="Casino" />
      <div className="flex gap-[10px]">
        {providers.map((p) => (
          <div
            key={p.name}
            className="flex-1 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform relative"
          >
            {/* Background image */}
            <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Spacer to push bottom bar down */}
            <div className="relative z-10 pt-[70px]" />

            {/* Bottom bar */}
            <div className="relative z-10 px-[8px] py-[8px] bg-black/40 backdrop-blur-sm flex flex-col gap-[2px]">
              <div className="text-[10px] font-bold text-white leading-tight truncate">{p.name}</div>
              <div className="text-[9px] font-semibold" style={{ color: p.accent }}>{p.games} oyun</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
