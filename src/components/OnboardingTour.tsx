'use client'

import { useEffect, useState } from 'react'

// One-time, 4-step "how it works" tour — shown the first time a user opens
// either Canlı Bahis or Maç Öncesi (shared flag, matches the client's own
// "on first entering live betting or pre-match" phrasing). Reuses
// WheelPromoModal.tsx's centered-card shell so it feels native to our design
// rather than pasting in 1xBet's own screenshots/copy.
const LS_SEEN = 'bta_onboarding_seen'

const steps = [
  {
    icon: (
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 512 512" fill="#fff">
          <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493 978.146 978.146 0 0 1-6.805-1.777l-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906zM66.144 273.414l53.756-46.518 49.539 22.599.559.255 19.718 77.287-20.433 38.529-69.86-.915c-18.348-26.36-30.214-57.546-33.279-91.237zm276.575 92.151-20.434-38.529 19.752-77.416 49.997-22.781 53.822 46.575c-3.065 33.691-14.932 64.877-33.277 91.236l-69.86.915z" />
        </svg>
        <span className="absolute -top-1 -right-1 flex items-center gap-[3px] bg-[#e74c3c] rounded-full px-[6px] py-[2px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white animate-pulse-dot" />
        </span>
      </div>
    ),
    title: 'Canlı Maçları Anında Takip Edin',
    desc: 'Spor kategorisine göre filtreleyin, favori liglerinizi seçin ve maçları canlı skorlarla takip edin.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 8l-4 4 4 4" /><path d="M17 8l4 4-4 4" /><line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
    title: 'Pazarlar Arasında Kaydırarak Geçin',
    desc: 'Maç Sonucu, Alt/Üst, Çifte Şans, Handikap ve Kornerler dahil tüm bahis pazarlarına tek dokunuşla ulaşın.',
  },
  {
    icon: (
      <div className="flex items-center gap-2">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>
    ),
    title: 'Favorilerinizi ve Bölgenizi Seçin',
    desc: 'Yıldız ikonuyla favori maçlarınızı işaretleyin, bölge ikonuyla ülkeye göre filtreleyin.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2z" />
        <path d="M13 5v14" strokeDasharray="2 2" />
      </svg>
    ),
    title: 'Kuponunuzu Oluşturun',
    desc: 'Beğendiğiniz oranlara dokunun, kuponunuz otomatik oluşsun — dilediğiniz zaman Kuponlarım sekmesinden takip edin.',
  },
]

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    try {
      if (!localStorage.getItem(LS_SEEN)) setVisible(true)
    } catch {}
  }, [])

  const finish = () => {
    setVisible(false)
    try { localStorage.setItem(LS_SEEN, '1') } catch {}
  }

  if (!visible) return null

  const isLast = step === steps.length - 1
  const s = steps[step]

  return (
    <>
      <div onClick={finish} className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/50 z-[92]" />

      <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[93] flex items-center justify-center px-6 pointer-events-none">
        <div
          onClick={e => e.stopPropagation()}
          className="pointer-events-auto relative w-full max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.35)] animate-winner-in"
        >
          <button
            onClick={finish}
            aria-label="Kapat"
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Hero */}
          <div
            className="w-full py-8 flex flex-col items-center gap-3"
            style={{ background: 'linear-gradient(160deg, #0E8FCF 0%, #0a5a85 100%)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/15 border border-white/25">
              {s.icon}
            </div>
            <div className="flex items-center gap-[6px]">
              {steps.map((_, i) => (
                <span key={i} className={`h-[6px] rounded-full transition-all ${i === step ? 'w-[16px] bg-white' : 'w-[6px] bg-white/40'}`} />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pt-4 pb-5 text-center">
            <p className="text-[15px] font-bold text-[#1a2332] leading-snug">{s.title}</p>
            <p className="text-[12px] text-[#737B8C] mt-[8px] leading-relaxed">{s.desc}</p>

            <div className="flex items-center gap-2.5 mt-5">
              <button onClick={finish} className="text-[12px] font-semibold text-[#737B8C] px-2 py-2">
                Geç
              </button>
              <button
                onClick={() => (isLast ? finish() : setStep(step + 1))}
                className="flex-1 h-[42px] rounded-full bg-[#0E8FCF] text-white text-[13px] font-bold tracking-wide"
              >
                {isLast ? 'Başla' : 'Devam et'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
