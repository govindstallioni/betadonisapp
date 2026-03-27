import SectionHeader from './SectionHeader'

const tournaments = [
  { flag: '/flags/turkey.png', league: 'Türkiye. Süper Lig', matches: 6, hasLive: true, hasStream: true },
  { flag: '/flags/turkey.png', league: 'Türkiye. 1. Lig', matches: 4, hasLive: true, hasStream: false },
  { flag: '/flags/turkey.png', league: 'Türkiye. Süper Lig', matches: 5, hasLive: true, hasStream: true },
  { flag: '/flags/turkey.png', league: 'Türkiye. 2. Lig', matches: 3, hasLive: true, hasStream: true },
  { flag: '/flags/turkey.png', league: 'Türkiye. Kadınlar Ligi', matches: 8, hasLive: false, hasStream: true },
  { flag: '/flags/turkey.png', league: 'Türkiye. U21 Ligi', matches: 5, hasLive: true, hasStream: false },
]

// Split into chunks of 3
const chunks: (typeof tournaments)[] = []
for (let i = 0; i < tournaments.length; i += 3) {
  chunks.push(tournaments.slice(i, i + 3))
}

export default function TopTournaments() {
  return (
    <div>
      <SectionHeader title="CANLI Turnuvalar" badge="Spor" showAll />
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {chunks.map((chunk, ci) => (
          <div
            key={ci}
            className="flex-shrink-0 w-[90%] bg-white rounded-2xl overflow-hidden border border-[#e8ecf1]"
          >
            {chunk.map((t, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-[14px] py-[11px] ${
                  i < chunk.length - 1 ? 'border-b border-[#f0f2f5]' : ''
                }`}
              >
                {/* Left: flag + league */}
                <div className="flex items-center gap-[10px] flex-1 min-w-0">
                  <img src={t.flag} alt="" className="w-[20px] h-[20px] rounded-full object-cover flex-shrink-0" />
                  <span className="text-[12px] text-[#374957] font-medium truncate">{t.league}</span>
                  {t.hasStream && (
                    <div className="flex items-center gap-[3px] bg-[#eef7fc] rounded-full px-[6px] py-[2px] flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#0E8FCF">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="text-[9px] text-[#0E8FCF] font-semibold">CANLI</span>
                    </div>
                  )}
                </div>

                {/* Center: icons */}
                <div className="flex items-center gap-[6px] flex-shrink-0 mx-[10px]">
                  {/* Sport + Fire icon */}
                  <div className="relative flex-shrink-0 w-[20px] h-[20px]">
                    <svg width="16" height="16" viewBox="0 0 512 512" fill="#374957" className="absolute bottom-0 left-0">
                      <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z" />
                    </svg>
                    <svg width="10" height="10" viewBox="0 0 32 32" fill="none" className="absolute top-0 right-0">
                      <path fill="#FF6723" d="M26 19.3399C26 25.4393 20.9491 30.3451 14.8501 29.981C8.58145 29.6067 4.2892 23.5781 5.09774 17.2765C5.58685 13.4429 7.38361 10.1555 9.34008 7.6065C9.67947 7.16144 10.0288 10.7422 10.3782 10.3477C10.7276 9.94307 13.9717 4.32923 15.0997 2.35679C15.3093 1.99265 15.7884 1.88139 16.1278 2.14438C18.3937 3.85382 26 10.2769 26 19.3399Z" />
                      <path fill="#FFB02E" d="M23 21.8512C23 25.893 19.4812 29.142 15.2011 28.9952C10.5815 28.8386 7.41254 24.6109 8.09159 20.256C9.06903 14.0124 15.4789 10 15.4789 10C15.4789 10 23 14.7072 23 21.8512Z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-[#374957] font-bold bg-[#eef1f5] rounded-full w-[20px] h-[20px] flex items-center justify-center">{t.matches}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>

              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
