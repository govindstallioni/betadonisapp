import { title } from "process"

const promos = [
  {
    title: '%100 Özel Kayıp Bonusu',
    image: '/promotions/01.png',
  },
  {
    title: '%20 Casino Kayıp Bonusu',
    image: '/promotions/02.png',
  },
  {
    title: '%25 Kripto Bonusu',
    image: '/promotions/03.png',
  },
  {
    title: 'Cuma Gün Bonusu',
    image: '/promotions/04.png',
  },
  {
    title: 'POKER Lobby',
    image: '/promotions/05.png',
  },
  {
    title: 'VIP Blackjack',
    image: '/promotions/06.png',
  },
  {
    title: 'Gates of Olympus 1000',
    image: '/promotions/07.png',
  },
  {
    title: 'Big Bass Splash',
    image: '/promotions/08.png',
  },
  {
    title: 'Sweet Bonanza',
    image: '/promotions/09.png',
  },
  {
    title: 'Telegram- Abone ol',
    image: '/promotions/10.png',
  }
]

export default function PromoBanners() {
  return (
    <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
      {promos.map((promo) => (
        <div
          key={promo.title}
          className="flex-shrink-0 w-[80px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[9px] font-medium text-[#1a2332] mt-[6px] leading-tight text-center line-clamp-2">
            {promo.title}
          </p>
        </div>
      ))}
    </div>
  )
}
