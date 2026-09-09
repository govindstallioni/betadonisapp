'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Shared "Şans seninle!" Lucky Wheel promo modal (cark1.png). Two variants:
// - "deposit": shown once right after a user's first deposit completes.
// - "guest": shown once to logged-out visitors as a teaser, while browsing.
// Same visual, different CTA — reuses PromoBubble.tsx's backdrop/card pattern.
export default function WheelPromoModal({ variant, onClose }: { variant: 'deposit' | 'guest'; onClose: () => void }) {
  const router = useRouter()

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/50 z-[92]" />

      <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[93] flex items-center justify-center px-6 pointer-events-none">
        <div
          onClick={e => e.stopPropagation()}
          className="pointer-events-auto relative w-full max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.35)] animate-winner-in"
        >
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div
            className="w-full py-7 flex flex-col items-center gap-2"
            style={{ background: 'linear-gradient(160deg, #2a0a4a 0%, #0d1b2a 55%, #1a0533 100%)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-[30px]"
              style={{ background: 'radial-gradient(circle at 35% 35%, #ffd700, #b8860b)', border: '3px solid #ffd700', boxShadow: '0 2px 14px rgba(0,0,0,0.5)' }}>
              🎡
            </div>
            <p className="text-[19px] font-black text-white">Şans seninle!</p>
          </div>

          <div className="px-5 pt-4 pb-5 text-center">
            {variant === 'deposit' ? (
              <>
                <p className="text-[13px] font-bold text-[#0E8FCF] leading-snug">
                  14 GÜN BOYUNCA HER GÜN 1 KEZ ŞANS ÇARKINI ÇEVİREBİLİRSİNİZ.
                </p>
                <p className="text-[11px] text-[#737B8C] mt-[8px] leading-relaxed">
                  Her gün 24 saat içinde çevirin. Kaçırırsanız hak yanar, ama her gün yeni bir fırsat sizi bekler!
                </p>
                <div className="flex flex-col gap-[10px] mt-4">
                  <button
                    onClick={() => { onClose(); router.push('/sans-carki') }}
                    className="w-full h-[42px] rounded-full bg-[#0E8FCF] text-white text-[13px] font-bold tracking-wide"
                  >
                    Çarkını Çevir
                  </button>
                  <button onClick={onClose} className="w-full h-[42px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[13px] font-bold tracking-wide">
                    Kapat
                  </button>
                </div>
                <p className="text-[10px] text-[#94a3b8] mt-4">Dönüş saatini Şans Çarkı sekmesinden kontrol edin.</p>
                <p className="text-[12px] font-semibold text-[#0E8FCF] mt-1">Bol şanslar!</p>
              </>
            ) : (
              <>
                <p className="text-[13px] font-bold text-[#0E8FCF] leading-snug">
                  KAYIT OLUN, İLK YATIRIMINIZLA 14 GÜN BOYUNCA HER GÜN ŞANS ÇARKI ÇEVİRİN.
                </p>
                <p className="text-[11px] text-[#737B8C] mt-[8px] leading-relaxed">
                  Her gün yeni bir ödül sizi bekliyor — nakit, ekstra gün veya tekrar çevirme hakkı!
                </p>
                <div className="flex flex-col gap-[10px] mt-4">
                  <Link href="/register" onClick={onClose} className="w-full h-[42px] rounded-full bg-[#0E8FCF] text-white text-[13px] font-bold tracking-wide flex items-center justify-center">
                    Kayıt Ol
                  </Link>
                  <button onClick={onClose} className="w-full h-[42px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[13px] font-bold tracking-wide">
                    Kapat
                  </button>
                </div>
                <p className="text-[12px] font-semibold text-[#0E8FCF] mt-4">Bol şanslar!</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
