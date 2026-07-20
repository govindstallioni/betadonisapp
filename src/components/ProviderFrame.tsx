'use client'

import { useRouter } from 'next/navigation'

// ── Third-party provider embed ──────────────────────────────────────────────
// Sanal Bahis, Golden Race and Poker are served by an external provider inside
// an <iframe> on Betadonis. We have no provider URL, so when `src` is empty we
// render a styled placeholder that makes the integration point obvious.
// Supply the real embed URL via `src` (or wire it to an env var) to go live.

export default function ProviderFrame({
  title,
  provider,
  accent = '#0E8FCF',
  src = '',
  note,
}: {
  title: string
  provider: string
  accent?: string
  src?: string
  note?: string
}) {
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] flex items-center gap-2 flex-shrink-0">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h1 className="flex-1 text-center text-[15px] font-bold text-[#1a2332] truncate px-1">{title}</h1>
        <div className="w-8 h-8 flex-shrink-0" />
      </div>

      {src ? (
        // Live embed
        <iframe
          src={src}
          title={title}
          className="flex-1 w-full border-0"
          allow="autoplay; fullscreen; payment"
        />
      ) : (
        // Placeholder until the provider URL is supplied
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-24">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}18` }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <p className="text-[15px] font-bold text-[#1a2332]">{title}</p>
          <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed max-w-[280px]">
            {note ?? `${provider} içeriği harici sağlayıcıdan yüklenir. Bu ekran, sağlayıcının oyununu tam ekran olarak gösterecek şekilde hazırlandı.`}
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
