export default function DailyWheel() {
  const segments = [
    { color: '#DC2626', label: '500₺' },
    { color: '#D97706', label: '100₺' },
    { color: '#059669', label: '250₺' },
    { color: '#2563EB', label: '50₺' },
    { color: '#7C3AED', label: '1000₺' },
    { color: '#DB2777', label: '75₺' },
    { color: '#DC2626', label: '200₺' },
    { color: '#D97706', label: '150₺' },
  ]

  return (
    <div>
      <div
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform"
        style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #0d1b2a 50%, #1a0533 100%)',
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

        <div className="relative z-10 flex gap-[16px] px-[20px] py-[20px]">
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

            {/* Outer metallic ring */}
            <div
              className="absolute inset-[2px] rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #b8860b, #ffd700, #b8860b, #ffd700, #b8860b, #ffd700, #b8860b)',
                padding: '3px',
              }}
            >
              <div className="w-full h-full rounded-full bg-[#1a0533]" />
            </div>

            {/* Spinning wheel */}
            <div
              className="absolute inset-[6px] rounded-full overflow-hidden"
              style={{ animation: 'spinWheel 12s linear infinite' }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {segments.map((seg, i) => {
                  const angle = (i * 360) / segments.length
                  const nextAngle = ((i + 1) * 360) / segments.length
                  const startRad = (angle - 90) * (Math.PI / 180)
                  const endRad = (nextAngle - 90) * (Math.PI / 180)
                  const x1 = 100 + 100 * Math.cos(startRad)
                  const y1 = 100 + 100 * Math.sin(startRad)
                  const x2 = 100 + 100 * Math.cos(endRad)
                  const y2 = 100 + 100 * Math.sin(endRad)
                  const midRad = ((angle + nextAngle) / 2 - 90) * (Math.PI / 180)
                  const textX = 100 + 62 * Math.cos(midRad)
                  const textY = 100 + 62 * Math.sin(midRad)
                  const textAngle = (angle + nextAngle) / 2

                  return (
                    <g key={i}>
                      <path
                        d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                        fill={seg.color}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="0.5"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        {seg.label}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Center hub */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full z-10 flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #ffd700, #b8860b)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
                border: '2px solid #ffd700',
              }}
            >
              <span className="text-[11px] font-black text-amber-900 drop-shadow-sm">₺</span>
            </div>

            {/* Pointer triangle */}
            <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 z-20">
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '16px solid #ffd700',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                }}
              />
            </div>
          </div>

          {/* Content - right side */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-[16px] font-black text-white leading-tight drop-shadow-md">
              🎡 ŞANS ÇARKI AKTİF! 💰
            </h3>
            <div className="flex flex-col gap-[5px] mt-[10px]">
              <span className="text-[12px] text-white font-semibold drop-shadow-sm">🔥 Gerçek para ödülleri</span>
              <span className="text-[12px] text-white font-semibold drop-shadow-sm">🔥 Çevrimsiz bonus</span>
              <span className="text-[12px] text-white font-semibold drop-shadow-sm">🔥 Tamamen çekilebilir kazanç</span>
            </div>
            <p className="text-[12px] text-white/80 font-semibold mt-[12px] drop-shadow-sm">
              Şans Çarkı'nda kazandığın ödüller
            </p>
            <div className="flex flex-col gap-[5px] mt-[6px]">
              <span className="text-[12px] text-white font-semibold drop-shadow-sm">✅ Çevrim şartı yok</span>
              <span className="text-[12px] text-white font-semibold drop-shadow-sm">✅ Bonus değil, çekilebilir bakiye</span>
              <span className="text-[12px] text-white font-semibold drop-shadow-sm">✅ Anında hesabına tanımlanır</span>
            </div>
          </div>
        </div>

        <style>{`
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
