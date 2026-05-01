'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const timeOptions = ['1 saat', '2 saat', '4 saat', '6 saat', '12 saat', '24 saat']

export default function CreateBetSlipScreen() {
  const router = useRouter()
  const [stake, setStake] = useState('2.5')
  const [winnings, setWinnings] = useState('25')
  const [time, setTime] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)

  const isValid = stake && winnings && time

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen flex flex-col">

      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-[#e8ecf1] flex items-center">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Kupon Oluştur</h1>
        <div className="w-8"/>
      </div>

      {/* Form card */}
      <div className="px-4 pt-3 flex-1">
        <div className="bg-white rounded-xl px-4 py-4 border border-[#e8ecf1] shadow-sm flex flex-col gap-[18px]">

          {/* Stake */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-[10px] font-medium text-[#737B8C]">Bahis Miktarı</label>
            <input
              type="number"
              value={stake}
              onChange={e => setStake(e.target.value)}
              className="text-[14px] font-medium text-[#1a2332] border-b border-[#c8d8e8] pb-[5px] outline-none bg-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Desired winnings */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-[10px] font-medium text-[#737B8C]">İstenen Kazanç</label>
            <input
              type="number"
              value={winnings}
              onChange={e => setWinnings(e.target.value)}
              className="text-[14px] font-medium text-[#1a2332] border-b border-[#c8d8e8] pb-[5px] outline-none bg-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Time picker trigger */}
          <div className="flex flex-col gap-[4px]">
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center justify-between border-b border-[#c8d8e8] pb-[5px] w-full text-left"
            >
              <span className={`text-[14px] ${time ? 'font-medium text-[#1a2332]' : 'text-[#0E8FCF]'}`}>
                {time || 'Etkinlik başlangıcına kadar süre seçin'}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Create button */}
      <div className="px-4 py-4">
        <button
          disabled={!isValid}
          className={`w-full py-[12px] rounded-xl text-[13px] font-bold transition-all ${
            isValid
              ? 'bg-[#0E8FCF] text-white shadow-md hover:bg-[#0c7ab5]'
              : 'bg-[#dce8f5] text-[#94a3b8] cursor-not-allowed'
          }`}
        >
          Oluştur
        </button>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setSheetOpen(false)}
        className={`fixed inset-0 z-[70] transition-all duration-300 ${sheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.4)' }}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white transition-transform duration-300 ${sheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ borderRadius: '20px 20px 0 0' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[10px] pb-[4px]">
          <div className="w-[36px] h-[4px] rounded-full bg-[#e2e8f0]"/>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0f2f5]">
          <h3 className="text-[14px] font-bold text-[#1a2332]">Süre Seçin</h3>
          <button onClick={() => setSheetOpen(false)} className="w-7 h-7 rounded-full bg-[#f1f5f9] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col pb-8">
          {timeOptions.map(opt => (
            <button
              key={opt}
              onClick={() => { setTime(opt); setSheetOpen(false) }}
              className={`flex items-center justify-between px-5 py-[13px] border-b border-[#f0f2f5] transition-colors ${
                time === opt ? 'bg-[#edf5ff]' : 'hover:bg-[#f8fafc]'
              }`}
            >
              <span className={`text-[13px] font-medium ${time === opt ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>
                {opt}
              </span>
              {time === opt && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
