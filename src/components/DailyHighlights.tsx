import SectionHeader from './SectionHeader'

const highlights = [
  { name: 'Şampiyonlar Ligi', count: 12, emoji: '🏆' },
  { name: 'Avrupa Ligi', count: 8, emoji: '⚽' },
  { name: 'Türkiye Süper Ligi', count: 15, emoji: '🇹🇷' },
  { name: 'İtalya Serie A', count: 10, emoji: '🇮🇹' },
  { name: 'Fransa Ligi', count: 9, emoji: '🇫🇷' },
  { name: 'Dünya Kupası', count: 6, emoji: '🌍' },
]

export default function DailyHighlights() {
  return (
    <div>
      <SectionHeader title="Günün Öne Çıkanları" />
      <div className="grid grid-cols-3 gap-[8px]">
        {highlights.map((item) => (
          <button
            key={item.name}
            className="bg-white rounded-2xl py-[14px] px-[10px] flex flex-col items-center gap-[8px] border border-[#e8ecf1] hover:border-[#d0d7e0] transition-all active:scale-[0.97]"
          >
            <div className="w-[40px] h-[40px] rounded-full bg-[#f0f5fa] flex items-center justify-center">
              <span className="text-[20px] leading-none">{item.emoji}</span>
            </div>
            <div className="text-[11px] font-semibold text-[#374957] leading-tight text-center">{item.name}</div>
            <div className="text-[10px] text-[#0E8FCF] font-semibold bg-[#eef7fc] rounded-full px-[8px] py-[2px]">{item.count} maç</div>
          </button>
        ))}
      </div>
    </div>
  )
}
