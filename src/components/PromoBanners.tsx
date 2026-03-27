const promos = [
  {
    title: 'Cuma Gün Bonusu',
    image: '/banners/123434.jpg',
  },
  {
    title: 'Spor Kayıp Bonusu',
    image: '/banners/123435.jpg',
  },
  {
    title: 'Özel Kayıp Bonusu',
    image: '/banners/34545.png',
  },
  {
    title: 'Poker Lobby',
    image: '/banners/8_2729.png',
  },
]

export default function PromoBanners() {
  return (
    <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
      {promos.map((promo) => (
        <div
          key={promo.title}
          className="flex-shrink-0 w-[100px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[12px] font-semibold text-gray-800 mt-[6px] leading-tight text-center line-clamp-2">
            {promo.title}
          </p>
        </div>
      ))}
    </div>
  )
}
