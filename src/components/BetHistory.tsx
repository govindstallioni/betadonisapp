import { useState } from 'react'

const filterTabs = [
  {
    label: '1 Ay',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'İndirim',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
]

const historyTypes = [
  {
    label: 'Bahis Geçmişi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    label: 'TOTO Geçmişi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
  },
  {
    label: 'Otomatik Bahis Geçmişi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Bekleyen Bahisler',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
]

export default function BetHistory() {
  const [activeFilter, setActiveFilter] = useState(0)
  const [showHistoryType, setShowHistoryType] = useState(false)
  const [activeHistoryType, setActiveHistoryType] = useState(0)
  const [showPeriod, setShowPeriod] = useState(false)
  const [activePeriod, setActivePeriod] = useState(0)
  const [showSale, setShowSale] = useState(false)

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <button
            onClick={() => setShowHistoryType(true)}
            className="flex items-center gap-[4px]"
          >
            <h1 className="text-[16px] font-bold text-[#1a2332]">{historyTypes[activeHistoryType].label}</h1>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-end gap-[12px]">
            <button>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
            <button>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Account info */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-[10px] text-[#0E8FCF] font-medium">Ana hesap</span>
            <div className="flex items-center gap-[4px] mt-[2px]">
              <span className="text-[22px] font-bold text-[#1a2332] leading-none">0 ₺</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          <button className="flex items-center gap-[6px] bg-[#27ae60] text-white rounded-lg px-4 py-[10px] hover:bg-[#219a52] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-[12px] font-medium">Para Yatır</span>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-[8px] mt-3">
          {filterTabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => {
                setActiveFilter(i)
                if (i === 0) setShowPeriod(true)
                if (i === 1) setShowSale(true)
              }}
              className={`flex-1 flex items-center justify-center gap-[6px] py-[8px] rounded-lg border transition-all ${
                activeFilter === i
                  ? 'border-[#0E8FCF] bg-[#edf5ff]'
                  : 'border-[#e8ecf1] bg-white'
              }`}
            >
              {tab.icon}
              <span className={`text-[11px] font-medium ${activeFilter === i ? 'text-[#0E8FCF]' : 'text-[#737B8C]'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center px-8 pt-16 pb-24">
        {/* Illustration */}
        <div className="w-[140px] h-[140px] relative mb-6">
          <svg viewBox="0 0 140 140" width="140" height="140">
            <rect x="30" y="40" width="80" height="70" rx="12" fill="#d4e8f7" opacity="0.5" />
            <rect x="35" y="35" width="70" height="65" rx="10" fill="#b8d9f0" opacity="0.7" />
            <line x1="52" y1="55" x2="52" y2="92" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
            <line x1="70" y1="55" x2="70" y2="92" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
            <line x1="88" y1="55" x2="88" y2="92" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
            <line x1="38" y1="65" x2="102" y2="65" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
            <line x1="38" y1="78" x2="102" y2="78" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
            <circle cx="70" cy="28" r="14" fill="#a8d4f0" />
            <circle cx="65" cy="25" r="2" fill="white" />
            <circle cx="75" cy="25" r="2" fill="white" />
            <path d="M63 32 Q70 37 77 32" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <ellipse cx="70" cy="18" rx="16" ry="6" fill="#0E8FCF" opacity="0.6" />
            <circle cx="70" cy="14" r="4" fill="#0E8FCF" opacity="0.4" />
            <path d="M50 50 Q40 40 35 55" stroke="#a8d4f0" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M90 50 Q100 40 105 55" stroke="#a8d4f0" strokeWidth="6" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <p className="text-[12px] text-[#737B8C] font-medium text-center leading-relaxed">
          Seçilen dönem için bahis bulunmamaktadır.{'\n'}Daha fazla tahmin yapın ve kazanın!
        </p>

        <button className="mt-4 bg-[#0E8FCF] text-white text-[12px] font-medium rounded-lg px-6 py-[10px] hover:bg-[#0a7ab5] transition-colors">
          Bahis Yap
        </button>
      </div>

      {/* Sale Full Screen */}
      {showSale && (
        <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-bg z-[65] flex flex-col">
          {/* Header */}
          <div className="bg-white px-4 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <button onClick={() => setShowSale(false)} className="w-8 h-8 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <h1 className="text-[16px] font-bold text-[#1a2332]">İndirim</h1>
              <div className="w-8" />
            </div>

            {/* Account info */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-[10px] text-[#0E8FCF] font-medium">Ana hesap</span>
                <div className="flex items-center gap-[4px] mt-[2px]">
                  <span className="text-[22px] font-bold text-[#1a2332] leading-none">0 ₺</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <button className="flex items-center gap-[6px] bg-[#27ae60] text-white rounded-lg px-4 py-[10px] hover:bg-[#219a52] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="text-[12px] font-medium">Para Yatır</span>
              </button>
            </div>
          </div>

          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-24">
            <div className="w-[140px] h-[140px] relative mb-6">
              <svg viewBox="0 0 140 140" width="140" height="140">
                <rect x="30" y="40" width="80" height="70" rx="12" fill="#d4e8f7" opacity="0.5" />
                <rect x="35" y="35" width="70" height="65" rx="10" fill="#b8d9f0" opacity="0.7" />
                <line x1="52" y1="55" x2="52" y2="92" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
                <line x1="70" y1="55" x2="70" y2="92" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
                <line x1="88" y1="55" x2="88" y2="92" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
                <line x1="38" y1="65" x2="102" y2="65" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
                <line x1="38" y1="78" x2="102" y2="78" stroke="#8fc4e3" strokeWidth="1" opacity="0.5" />
                <circle cx="70" cy="28" r="14" fill="#a8d4f0" />
                <circle cx="65" cy="25" r="2" fill="white" />
                <circle cx="75" cy="25" r="2" fill="white" />
                <path d="M63 32 Q70 37 77 32" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <ellipse cx="70" cy="18" rx="16" ry="6" fill="#0E8FCF" opacity="0.6" />
                <circle cx="70" cy="14" r="4" fill="#0E8FCF" opacity="0.4" />
                <path d="M50 50 Q40 40 35 55" stroke="#a8d4f0" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M90 50 Q100 40 105 55" stroke="#a8d4f0" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <p className="text-[12px] text-[#737B8C] font-medium text-center leading-relaxed">
              Seçilen dönem için bahis bulunmamaktadır.{'\n'}Daha fazla tahmin yapın ve kazanın!
            </p>

            <button className="mt-4 bg-[#0E8FCF] text-white text-[12px] font-medium rounded-lg px-6 py-[10px] hover:bg-[#0a7ab5] transition-colors">
              Bahis Yap
            </button>
          </div>
        </div>
      )}

      {/* History Type Bottom Sheet */}
      {showHistoryType && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70] transition-opacity"
            onClick={() => setShowHistoryType(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] animate-slide-up">
            <div className="bg-white rounded-t-2xl">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[#d0d5dd] rounded-full" />
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-bold text-[#1a2332] text-center pb-3">Geçmiş Türü</h3>

              {/* Options */}
              <div className="px-4">
                {historyTypes.map((type, i) => (
                  <button
                    key={type.label}
                    onClick={() => {
                      setActiveHistoryType(i)
                      setShowHistoryType(false)
                    }}
                    className={`w-full flex items-center gap-3 py-[14px] ${
                      i < historyTypes.length - 1 ? 'border-b border-[#f0f2f5]' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
                      {type.icon}
                    </div>
                    <span className={`text-[13px] font-medium flex-1 text-left ${
                      activeHistoryType === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'
                    }`}>
                      {type.label}
                    </span>
                    {/* Radio button */}
                    <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      activeHistoryType === i ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'
                    }`}>
                      {activeHistoryType === i && (
                        <div className="w-[12px] h-[12px] rounded-full bg-[#0E8FCF]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Hide history button */}
              <div className="px-4 pt-2 pb-8">
                <button className="w-full flex items-center gap-3 bg-[#f0f2f5] rounded-xl px-4 py-[12px]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                  <span className="text-[12px] font-medium text-[#737B8C] flex-1 text-left">Geçmişi Gizle</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Select Period Bottom Sheet */}
      {showPeriod && (
        <>
          <div
            className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70] transition-opacity"
            onClick={() => setShowPeriod(false)}
          />

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] animate-slide-up">
            <div className="bg-white rounded-t-2xl">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[#d0d5dd] rounded-full" />
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-bold text-[#1a2332] text-center pb-3">Dönem Seçin</h3>

              {/* Options */}
              <div className="px-4">
                {/* 1 Month */}
                <button
                  onClick={() => { setActivePeriod(0); setShowPeriod(false) }}
                  className="w-full flex items-center py-[14px] border-b border-[#f0f2f5]"
                >
                  <div className="flex-1 text-left">
                    <span className={`text-[13px] font-medium block ${activePeriod === 0 ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>1 Ay</span>
                    <span className="text-[10px] text-[#737B8C]">01.03.2026 - 30.03.2026</span>
                  </div>
                  <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    activePeriod === 0 ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'
                  }`}>
                    {activePeriod === 0 && (
                      <div className="w-[12px] h-[12px] rounded-full bg-[#0E8FCF]" />
                    )}
                  </div>
                </button>

                {/* Select period */}
                <button
                  onClick={() => { setActivePeriod(1); setShowPeriod(false) }}
                  className="w-full flex items-center py-[14px]"
                >
                  <div className="flex-1 text-left">
                    <span className={`text-[13px] font-medium block ${activePeriod === 1 ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>Dönem Seçin</span>
                    <span className="text-[10px] text-[#737B8C]">01.03.2026 - 30.03.2026 dönemi için</span>
                  </div>
                  <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    activePeriod === 1 ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'
                  }`}>
                    {activePeriod === 1 && (
                      <div className="w-[12px] h-[12px] rounded-full bg-[#0E8FCF]" />
                    )}
                  </div>
                </button>
              </div>

              {/* Request history by email */}
              <div className="px-4 pt-2 pb-8">
                <button className="w-full flex items-center gap-3 bg-[#f0f2f5] rounded-xl px-4 py-[12px]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  <div className="flex-1 text-left">
                    <span className="text-[12px] font-medium text-[#1a2332] block">Geçmişi e-posta ile talep edin</span>
                    <span className="text-[9px] text-[#737B8C]">01.01.2026 - 30.03.2026 dönemi için</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
