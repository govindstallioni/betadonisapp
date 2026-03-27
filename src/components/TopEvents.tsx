import SectionHeader from './SectionHeader'

const events = [
  { title: 'ŞAMPİYONLAR LİGİ', image: '/events/event1.png' },
  { title: 'Avrupa Ligi', image: '/events/event2.jpg' },
  { title: 'Türkiye Süper Ligi', image: '/events/event1.png' },
  { title: 'İtalya Serie A', image: '/events/event1.png' },
  { title: 'Fransa Ligi', image: '/events/event1.png' },
  { title: 'Dünya Kupası', image: '/events/event1.png' },
]

export default function TopEvents() {
  return (
    <div>
      <SectionHeader title="Günün Öne Çıkanları" />
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide -mx-4 pl-4 pr-4 snap-x snap-mandatory scroll-pl-4">
        {events.map((event, i) => (
          <div
            key={i}
            className="snap-start shrink-0 flex flex-col gap-[6px] cursor-pointer"
            style={{ width: 'calc((100% - 16px) / 3)' }}
          >
            <div className="w-full aspect-square rounded-[10px] overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] font-semibold text-[#1a2332] leading-tight">
              {event.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
