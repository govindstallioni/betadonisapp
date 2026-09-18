import { WheelDisc, WheelPointer, WHEEL_CSS } from './WheelFace'

// Home teaser for Şans Çarkı — shows the same wheel face as /sans-carki.
export default function DailyWheel() {
  return (
    <div>
      <div
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #1e293b 45%, #0284c7 100%)',
        }}
      >
        {/* Decorative particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-yellow-400/40"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + i * 14}%`,
                animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex gap-[24px] px-[20px] py-[20px]">
          {/* Wheel - left side */}
          <div className="flex-shrink-0 flex items-center justify-center relative w-[130px] h-[130px]">
            {/* Outer ring glow */}
            <div
              className="absolute inset-[-8px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
                animation: 'pulseGlow 2s ease-in-out infinite',
              }}
            />

            {/* LED dots ring */}
            <div className="absolute inset-[-4px]">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[5px] h-[5px] rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 22.5}deg) translateY(-68px) translate(-50%, -50%)`,
                    background: i % 2 === 0 ? '#fbbf24' : '#ffffff',
                    boxShadow: i % 2 === 0
                      ? '0 0 6px #fbbf24, 0 0 12px #fbbf2466'
                      : '0 0 4px #ffffff88',
                    animation: `ledBlink 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 0.075}s`,
                  }}
                />
              ))}
            </div>

            {/* Spinning wheel */}
            <div className="absolute inset-0" style={{ animation: 'spinWheel 12s linear infinite' }}>
              <WheelDisc idPrefix="teaser" className="w-full h-full" sparkle={false} />
            </div>

            {/* Centre ÇEVİR */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full z-10 flex items-center justify-center text-white text-[9px] font-black tracking-[0.5px]"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(14,116,144,0.95) 0%, rgba(15,23,42,0.95) 85%)',
                border: '2px solid',
                borderColor: '#fef08a #ca8a04 #854d0e #fde047',
                textShadow: '0 0 6px rgba(255,255,255,0.9)',
              }}
            >
              ÇEVİR
            </div>

            {/* Pointer */}
            <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 z-20 w-[20px] h-[24px]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>
              <WheelPointer idPrefix="teaser" />
            </div>
          </div>

          {/* Content - right side */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-[11px] font-medium text-white leading-tight drop-shadow-md">
              🎡 ŞANS ÇARKI AKTİF! 💰
            </h3>
            <div className="flex flex-col gap-[5px] mt-[10px]">
              <span className="text-[9px] text-white font-medium drop-shadow-sm">🔥 Gerçek para ödülleri</span>
              <span className="text-[9px] text-white font-medium drop-shadow-sm">🔥 Çevrimsiz bonus</span>
              <span className="text-[9px] text-white font-medium drop-shadow-sm">🔥 Tamamen çekilebilir kazanç</span>
            </div>
            <p className="text-[9px] text-white/80 font-medium mt-[12px] drop-shadow-sm">
              Şans Çarkı'nda kazandığın ödüller
            </p>
            <div className="flex flex-col gap-[5px] mt-[6px]">
              <span className="text-[9px] text-white font-medium drop-shadow-sm">✅ Çevrim şartı yok</span>
              <span className="text-[9px] text-white font-medium drop-shadow-sm">✅ Bonus değil, çekilebilir bakiye</span>
              <span className="text-[9px] text-white font-medium drop-shadow-sm">✅ Anında hesabına tanımlanır</span>
            </div>
          </div>
        </div>

        <style>{WHEEL_CSS + `
          @keyframes spinWheel {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes ledBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          @keyframes twinkle {
            0% { opacity: 0.2; transform: scale(1); }
            100% { opacity: 0.8; transform: scale(1.5); }
          }
        `}</style>
      </div>
    </div>
  )
}
