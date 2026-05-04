'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const historyTypes = [
  { label: 'Bahis Geçmişi' },
  { label: 'TOTO Geçmişi' },
  { label: 'Otomatik Bahis Geçmişi' },
  { label: 'Bekleyen Bahisler' },
]

const periods = ['1 Ay', '3 Ay', '6 Ay', 'Bu Yıl']

function Mascot() {
  return (
    <svg viewBox="0 0 160 160" width="160" height="160">
      {/* Calendar body */}
      <rect x="30" y="70" width="100" height="75" rx="10" fill="#c5dff0"/>
      <rect x="30" y="70" width="100" height="22" rx="10" fill="#8bb8d8"/>
      <rect x="30" y="81" width="100" height="11" fill="#8bb8d8"/>
      {/* Calendar grid lines */}
      <line x1="55" y1="103" x2="55" y2="135" stroke="#a8ccdf" strokeWidth="1"/>
      <line x1="80" y1="103" x2="80" y2="135" stroke="#a8ccdf" strokeWidth="1"/>
      <line x1="105" y1="103" x2="105" y2="135" stroke="#a8ccdf" strokeWidth="1"/>
      <line x1="38" y1="112" x2="122" y2="112" stroke="#a8ccdf" strokeWidth="1"/>
      <line x1="38" y1="124" x2="122" y2="124" stroke="#a8ccdf" strokeWidth="1"/>
      {/* Calendar dots */}
      {[45,67,92,117].map((x,i) => [103,115,127].map((y,j) => (
        <circle key={`${i}-${j}`} cx={x} cy={y} r="3" fill="#8bb8d8" opacity="0.7"/>
      )))}
      {/* Body/head */}
      <circle cx="80" cy="55" r="28" fill="#5b9fc4"/>
      {/* Hat brim */}
      <ellipse cx="80" cy="33" rx="30" ry="6" fill="#4a8db5"/>
      {/* Hat top */}
      <rect x="60" y="16" width="40" height="20" rx="4" fill="#4a8db5"/>
      {/* Hat band */}
      <rect x="60" y="30" width="40" height="5" rx="1" fill="#3a7da5"/>
      {/* Sunglasses */}
      <rect x="58" y="52" width="20" height="12" rx="5" fill="#3a7da5" opacity="0.9"/>
      <rect x="82" y="52" width="20" height="12" rx="5" fill="#3a7da5" opacity="0.9"/>
      <line x1="78" y1="57" x2="82" y2="57" stroke="#3a7da5" strokeWidth="2"/>
      <line x1="55" y1="57" x2="58" y2="57" stroke="#3a7da5" strokeWidth="2"/>
      <line x1="102" y1="57" x2="106" y2="57" stroke="#3a7da5" strokeWidth="2"/>
      {/* Smile */}
      <path d="M68 72 Q80 80 92 72" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Tentacles */}
      <path d="M52 75 Q30 65 28 80 Q26 95 35 90" stroke="#5b9fc4" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M108 75 Q130 65 132 80 Q134 95 125 90" stroke="#5b9fc4" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M52 85 Q20 80 22 100" stroke="#5b9fc4" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M108 85 Q140 80 138 100" stroke="#5b9fc4" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

export default function BetHistory() {
  const router = useRouter()
  const [activeHistoryType, setActiveHistoryType] = useState(0)
  const [showHistoryType, setShowHistoryType] = useState(false)
  const [showPeriod, setShowPeriod] = useState(false)
  const [activePeriod, setActivePeriod] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [filterPeriod, setFilterPeriod] = useState(0)        // 0=1 month, 1=select
  const [filterStatus, setFilterStatus] = useState('Tümü')
  const [filterType, setFilterType] = useState('Tümü')

  const betStatuses = ['Tümü','Kabul Edildi','Kaybetti','Kazandı','Ödendi','Kaldırıldı','Satıldı','Engellendi']
  const betTypes    = ['Tümü','Tekli Bahis','Kombine','Sistem','Zincir','Multibet','Koşullu Bahis','Anti-Kombine','Lucky','Patent']

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen relative">

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-[#e8ecf1]">
        {/* Title row */}
        <div className="flex items-center justify-between mb-2">
          <div className="w-8"/>
          <button onClick={() => setShowHistoryType(true)} className="flex items-center gap-[4px]">
            <span className="text-[16px] font-bold text-[#1a2332]">
              {historyTypes[activeHistoryType].label}
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="4" rx="1"/>
              <rect x="2" y="10" width="20" height="4" rx="1"/>
              <rect x="2" y="17" width="20" height="4" rx="1"/>
            </svg>
          </button>
        </div>

        {/* Balance */}
        <div className="text-center mb-3">
          <p className="text-[10px] text-[#737B8C] font-medium">Ana hesap</p>
          <button onClick={() => setShowAccount(true)} className="flex items-center gap-[3px] justify-center mt-[1px] mx-auto">
            <span className="text-[18px] font-bold text-[#1a2332] leading-none">0 ₺</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>

        {/* 3 Action cards */}
        <div className="flex gap-[6px]">
          <button onClick={() => router.push('/kupon/deposit')} className="flex-1 flex flex-col items-center gap-[4px] rounded-xl py-[9px] px-2 bg-[#e8f5e9]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="18" height="13" rx="2" fill="#27ae60" opacity="0.3"/>
              <rect x="4" y="4" width="18" height="13" rx="2" fill="#27ae60" opacity="0.6"/>
              <circle cx="19" cy="5" r="5" fill="#27ae60"/>
              <line x1="19" y1="3" x2="19" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="17" y1="5" x2="21" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] font-semibold text-[#27ae60]">Para Yatır</span>
          </button>

          <button className="flex-1 flex flex-col items-center gap-[4px] rounded-xl py-[9px] px-2 bg-[#f1f5f9]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <span className="text-[10px] font-semibold text-[#0E8FCF]">İndirim</span>
          </button>

          <button onClick={() => setShowFilters(true)}
            className="flex-1 flex flex-col items-center gap-[4px] rounded-xl py-[9px] px-2 bg-[#f1f5f9]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span className="text-[10px] font-semibold text-[#0E8FCF]">Filtrele</span>
          </button>
        </div>
      </div>

      {/* ── Empty state ── */}
      <div className="flex flex-col items-center justify-center px-8 pt-10 pb-28">
        <Mascot />
        <p className="text-[12px] text-[#737B8C] font-medium text-center leading-relaxed mt-3 mb-4">
          Seçilen dönem için bahis bulunmamaktadır.{'\n'}Daha fazla tahmin yapın ve kazanın!
        </p>
        <button onClick={() => router.push('/')} className="bg-[#0E8FCF] text-white text-[12px] font-semibold rounded-xl px-7 py-[10px]">
          Bahis Yap
        </button>
      </div>

      {/* ── Account Selection Bottom Sheet ── */}
      {showAccount && (
        <>
          <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70]"
            onClick={() => setShowAccount(false)}/>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#d0d5dd] rounded-full"/>
            </div>
            <h3 className="text-[15px] font-bold text-[#1a2332] text-center py-3 border-b border-[#f0f2f5]">
              Hesap Seçin
            </h3>
            <div className="px-4">
              {/* Make a deposit */}
              <button className="w-full flex items-center gap-3 py-[14px] border-b border-[#f0f2f5]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#27ae60] flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-[#1a2332]">Para Yatır</span>
              </button>
              {/* Add account */}
              <button className="w-full flex items-center gap-3 py-[14px] border-b border-[#f0f2f5]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#27ae60] flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-[#1a2332]">Hesap Ekle</span>
              </button>
              {/* Main account */}
              <button className="w-full flex items-center gap-3 py-[14px]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#edf5ff] border border-[#bce0f5] flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] text-[#0E8FCF] font-medium">Ana hesap</p>
                  <p className="text-[13px] font-bold text-[#1a2332]">0 ₺</p>
                </div>
                <div className="w-[22px] h-[22px] rounded-full border-2 border-[#0E8FCF] flex items-center justify-center flex-shrink-0">
                  <div className="w-[12px] h-[12px] rounded-full bg-[#0E8FCF]"/>
                </div>
              </button>
            </div>
            <div className="pb-8"/>
          </div>
        </>
      )}

      {/* ── History Type Bottom Sheet ── */}
      {showHistoryType && (
        <>
          <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70]"
            onClick={() => setShowHistoryType(false)}/>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#d0d5dd] rounded-full"/>
            </div>
            <h3 className="text-[15px] font-bold text-[#1a2332] text-center pb-3">Geçmiş Türü</h3>
            <div className="px-4">
              {historyTypes.map((type, i) => (
                <button key={type.label} onClick={() => { setActiveHistoryType(i); setShowHistoryType(false) }}
                  className={`w-full flex items-center justify-between py-[14px] ${i < historyTypes.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}>
                  <span className={`text-[13px] font-medium ${activeHistoryType === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>
                    {type.label}
                  </span>
                  <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${activeHistoryType === i ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                    {activeHistoryType === i && <div className="w-[10px] h-[10px] rounded-full bg-[#0E8FCF]"/>}
                  </div>
                </button>
              ))}
            </div>
            <div className="px-4 pt-2 pb-8">
              <button className="w-full flex items-center gap-3 bg-[#f0f2f5] rounded-xl px-4 py-[12px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <span className="text-[12px] font-medium text-[#737B8C] flex-1 text-left">Geçmişi Gizle</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Filters Bottom Sheet ── */}
      {showFilters && (
        <>
          <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/40 z-[70]"
            onClick={() => setShowFilters(false)}/>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white rounded-t-2xl animate-slide-up"
            style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-[#d0d5dd] rounded-full"/>
            </div>
            <h3 className="text-[16px] font-bold text-[#1a2332] text-center py-3 flex-shrink-0">Filtreler</h3>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">

              {/* Period */}
              <p className="text-[11px] font-semibold text-[#737B8C] mb-[10px]">Dönem</p>
              <div className="flex gap-[8px] mb-3">
                <button type="button" onClick={() => setFilterPeriod(0)}
                  className={`px-[16px] py-[8px] rounded-full text-[12px] font-semibold transition-all ${filterPeriod === 0 ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332] border border-[#e8ecf1]'}`}>
                  1 ay
                </button>
                <button type="button" onClick={() => setFilterPeriod(1)}
                  className={`flex items-center gap-[5px] px-[16px] py-[8px] rounded-full text-[12px] font-semibold transition-all ${filterPeriod === 1 ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332] border border-[#e8ecf1]'}`}>
                  Dönem Seçin
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
              </div>
              <button className="w-full py-[12px] rounded-xl bg-[#dce8f5] text-[#0E8FCF] text-[12px] font-semibold mb-5">
                E-posta ile geçmiş talep edin
              </button>

              {/* Bet status */}
              <p className="text-[11px] font-semibold text-[#737B8C] mb-[10px]">Bahis durumu</p>
              <div className="flex flex-wrap gap-[8px] mb-5">
                {betStatuses.map(s => (
                  <button key={s} type="button" onClick={() => setFilterStatus(s)}
                    className={`px-[14px] py-[7px] rounded-full text-[11px] font-semibold transition-all ${filterStatus === s ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332] border border-[#e8ecf1]'}`}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Bet type */}
              <p className="text-[11px] font-semibold text-[#737B8C] mb-[10px]">Bahis türü</p>
              <div className="flex flex-wrap gap-[8px]">
                {betTypes.map(t => (
                  <button key={t} type="button" onClick={() => setFilterType(t)}
                    className={`px-[14px] py-[7px] rounded-full text-[11px] font-semibold transition-all ${filterType === t ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332] border border-[#e8ecf1]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-[8px] px-4 py-4 border-t border-[#f0f2f5] flex-shrink-0">
              <button type="button"
                onClick={() => { setFilterPeriod(0); setFilterStatus('Tümü'); setFilterType('Tümü') }}
                className="flex-1 py-[12px] rounded-xl text-[13px] font-semibold text-[#94a3b8] bg-[#f1f5f9] border border-[#e8ecf1]">
                Sıfırla
              </button>
              <button type="button" onClick={() => setShowFilters(false)}
                className="flex-1 py-[12px] rounded-xl text-[13px] font-semibold text-white bg-[#0E8FCF]">
                Uygula
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
