import Link from 'next/link'
import { gameHref } from './gameHref'

// Home promo tiles. Bonus tiles open their promotion on /promosyonlar with the
// rules popup already open (work3 task 9); game tiles open the game itself.
const promo = (id: string) => `/promosyonlar?promo=${id}`

const promos = [
  { title: '%100 Özel Kayıp Bonusu', image: '/promotions/01.png', href: promo('ozel-kayip-100') },
  { title: '%20 Casino Kayıp Bonusu', image: '/promotions/02.png', href: promo('casino-kayip-20') },
  { title: '%25 Kripto Bonusu', image: '/promotions/03.png', href: promo('kripto-25') },
  { title: 'Cuma Gün Bonusu', image: '/promotions/04.png', href: promo('cuma-gun') },
  { title: 'POKER Lobby', image: '/promotions/05.png', href: '/poker' },
  { title: 'VIP Blackjack', image: '/promotions/06.png', href: '/live-casino' },
  { title: 'Gates of Olympus 1000', image: '/promotions/07.png', href: gameHref('Gates of Olympus 1000', '/promotions/07.png', 'Pragmatic Play') },
  { title: 'Big Bass Splash', image: '/promotions/08.png', href: gameHref('Big Bass Splash', '/promotions/08.png', 'Pragmatic Play') },
  { title: 'Sweet Bonanza', image: '/promotions/09.png', href: gameHref('Sweet Bonanza', '/promotions/09.png', 'Pragmatic Play') },
  { title: 'Abone Ol', image: '/promotions/10.png', href: promo('telegram') },
]

export default function PromoBanners() {
  return (
    <div className="flex gap-[10px] overflow-x-auto scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
      {promos.map((p) => (
        <Link
          key={p.title}
          href={p.href}
          className="flex-shrink-0 w-[calc((100%-30px)/4)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[9px] font-medium text-[#1a2332] mt-[6px] leading-tight text-center line-clamp-2">
            {p.title}
          </p>
        </Link>
      ))}
    </div>
  )
}
