'use client'

// Full-screen provider play view launched from a lobby (Poker table, Golden
// Race race, …). Same iframe/placeholder convention as ProviderFrame, but
// `onBack` returns to the lobby instead of navigating the router.
export default function ProviderPlay({
  title,
  subtitle,
  accent = '#0E8FCF',
  src = '',
  onBack,
}: {
  title: string
  subtitle?: string
  accent?: string
  src?: string
  onBack: () => void
}) {
  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen flex flex-col">
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] flex items-center gap-2 flex-shrink-0">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div className="flex-1 min-w-0 text-center">
          <h1 className="text-[14px] font-bold text-[#1a2332] truncate">{title}</h1>
          {subtitle && <p className="text-[9px] text-[#737B8C] truncate">{subtitle}</p>}
        </div>
        <div className="w-8 h-8 flex-shrink-0" />
      </div>

      {src ? (
        <iframe src={src} title={title} className="flex-1 w-full border-0 mb-[64px]" allow="autoplay; fullscreen; payment" />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-28">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}18` }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <p className="text-[15px] font-bold text-[#1a2332]">{title}</p>
          {subtitle && <p className="text-[11px] text-[#737B8C] mt-[2px]">{subtitle}</p>}
          <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed max-w-[280px]">
            Bu içerik harici sağlayıcıdan tam ekran iframe olarak yüklenir. Sağlayıcı bağlantısı tanımlandığında masa burada açılır.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#fff7ed] border border-[#f59e0b]/30 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            <span className="text-[10px] font-semibold text-[#b45309]">Sağlayıcı bağlantısı bekleniyor</span>
          </div>
        </div>
      )}
    </div>
  )
}
