'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const timeOptions = ['1 saat', '2 saat', '4 saat', '6 saat', '12 saat', '24 saat']
const betTypeOptions = ['2\'li Kombine', '3\'lü Kombine', '4\'lü Kombine', '5\'li Kombine', '6\'lı Kombine', '7\'li Kombine']

const sportOptions = [
  { label: 'Tümü', icon: null },
  { label: 'Futbol', icon: <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor"><path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493l-6.805-1.777-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906z"/></svg> },
  { label: 'Basketbol', icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor"><path d="M30.06 15c.3 0 .6 0 .9 0a14.82 14.82 0 0 0-3.68-8.82l-5.72 5.72A13 13 0 0 0 30.06 15zM20.17 10.41l5.72-5.72A14.82 14.82 0 0 0 17.07 1c0 .31 0 .62 0 .93A13 13 0 0 0 20.17 10.41zM11.84 18.74L14.58 16 4.68 6.11A14.82 14.82 0 0 0 1 15.05c.32 0 .65 0 1 0A15 15 0 0 1 11.84 18.74zM30.06 17a15 15 0 0 1-9.89-3.73L17.42 16l9.89 9.9a15 15 0 0 0 3.69-9c-.3 0-.61.05-.91.05zM2 17c-.32 0-.64 0-1 0A15 15 0 0 0 4.68 25.9l5.74-5.74A13 13 0 0 0 2 17zM25.89 27.32L16 17.42l-2.74 2.74A15 15 0 0 1 17 30c0 .33 0 .66 0 1A14.82 14.82 0 0 0 25.89 27.32zM11.84 21.58L6.1 27.32A15 15 0 0 0 14.94 31c0-.32.05-.64.05-1A13 13 0 0 0 11.84 21.58zM6.1 4.69L16 14.58l2.75-2.75A15 15 0 0 1 15 1.94c0-.31 0-.63.05-.94A15 15 0 0 0 6.1 4.69z"/></svg> },
  { label: 'E-Spor', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 10 18.5 10s1.5.67 1.5 1.5S19.33 12 18.5 12z"/></svg> },
  { label: 'Kriket', icon: <svg width="14" height="14" viewBox="0 0 100 100" fill="currentColor"><path d="M18.75 971.112c-4.167 4.167-4.167 8.333-4.167 8.333l41.667 41.667 6.25-2.083 16.667 16.666c1.318 1.318 2.109 2.084 3.776 2.084.52 0 1.172 0 1.823-.651.65-.652.65-1.302.65-1.823 0-1.667-.907-2.601-2.083-3.776l-16.666-16.667 2.083-6.25-41.667-41.667s-4.166 0-8.333 4.167zm14.583 37.5a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5z" transform="translate(0 -952.362)"/></svg> },
  { label: 'Tenis', icon: <svg width="14" height="14" viewBox="0 0 100 100" fill="currentColor"><path d="M9.2 98c1.9 0 3.7-.8 5.1-2.1l22.2-22.2c.9-1.3.8-3-.4-4.1l-5.6-5.6c-1.1-1.1-2.8-1.2-4.1-.4L4.1 85.7C2.8 87 2 88.8 2 90.8c0 1.9.8 3.7 2.1 5.1C5.5 97.2 7.3 98 9.2 98zM90.9 9.1c-11-11-30.8-9-44.2 4.4-7.3 7.3-11.5 16.8-11.5 26 0 4.5-1 8.4-2.8 11.8l-5 9.3c1.4 0 2.7.5 3.7 1.5l5.6 5.6c1.3 1.3 1.8 3.2 1.4 4.9l9.3-5c3.4-1.8 7.4-2.8 11.8-2.8 4.6 0 9.3-1.1 13.8-3 4.5-2 8.6-4.8 12.3-8.5C99.9 39.8 101.9 20 90.9 9.1z"/></svg> },
  { label: 'Buz Hokeyi', icon: <svg width="14" height="14" viewBox="0 0 48 48" fill="currentColor"><ellipse cx="23.756" cy="42.595" rx="5.351" ry="1.531"/><path d="M23.13 24.54c-.82 1.35-1.34 2.2-1.54 2.48C16.56 18.87 9.53 6.41 7.41 2.64A1.27 1.27 0 0 1 9.62 1.39C11.85 5.24 19.38 18.25 23.13 24.54zM40.094.907a1.274 1.274 0 0 0-1.715.479C35.536 6.3 24.079 26.1 22.821 27.884a15.575 15.575 0 0 1-5.158 4.778l1.222 4.015A16.792 16.792 0 0 0 21.9 33.922c3.254-3.947 15.74-26.03 18.691-31.277A1.27 1.27 0 0 0 40.094.907z"/></svg> },
]

const outcomeOptions = [
  'Tümü', 'Maç/Periyot Sonucu', 'Toplam', 'Takım/Oyuncu Toplamı', 'Handikap',
]

type Sheet = 'time' | 'bettype' | null

export default function CreateBetSlipScreen() {
  const router = useRouter()
  const [stake, setStake] = useState('2.5')
  const [winnings, setWinnings] = useState('25')
  const [time, setTime] = useState('')
  const [betType, setBetType] = useState('')
  const [sheet, setSheet] = useState<Sheet>(null)
  const [activeSport, setActiveSport] = useState('Tümü')
  const [activeOutcome, setActiveOutcome] = useState('Tümü')

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

      <div className="px-4 pt-3 flex-1 flex flex-col gap-[14px] pb-6">

        {/* Form card */}
        <div className="bg-white rounded-xl px-4 py-4 border border-[#e8ecf1] shadow-sm flex flex-col gap-[18px]">

          {/* Stake */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-[10px] font-medium text-[#737B8C]">Bahis Miktarı</label>
            <input type="number" value={stake} onChange={e => setStake(e.target.value)}
              className="text-[14px] font-medium text-[#1a2332] border-b border-[#c8d8e8] pb-[5px] outline-none bg-transparent" placeholder="0.00"/>
          </div>

          {/* Desired winnings */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-[10px] font-medium text-[#737B8C]">İstenen Kazanç</label>
            <input type="number" value={winnings} onChange={e => setWinnings(e.target.value)}
              className="text-[14px] font-medium text-[#1a2332] border-b border-[#c8d8e8] pb-[5px] outline-none bg-transparent" placeholder="0.00"/>
          </div>

          {/* Time */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-[10px] font-medium text-[#737B8C]">Başlangıca kadar süre</label>
            <button onClick={() => setSheet('time')}
              className="flex items-center justify-between border-b border-[#c8d8e8] pb-[5px] w-full text-left">
              <span className={`text-[14px] font-medium ${time ? 'text-[#1a2332]' : 'text-[#94a3b8]'}`}>
                {time || 'Seçin'}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>

          {/* Bet slip type — only after time selected */}
          {time && (
            <div className="flex flex-col gap-[4px]">
              <label className="text-[10px] font-medium text-[#737B8C]">Kupon türü</label>
              <button onClick={() => setSheet('bettype')}
                className="flex items-center justify-between border-b border-[#c8d8e8] pb-[5px] w-full text-left">
                <span className={`text-[14px] font-medium ${betType ? 'text-[#1a2332]' : 'text-[#94a3b8]'}`}>
                  {betType || 'Seçin'}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Select sports — only after time selected */}
        {time && (
          <div>
            <p className="text-[12px] font-semibold text-[#737B8C] mb-[10px]">Spor Seçin</p>
            <div className="flex flex-wrap gap-[8px]">
              {sportOptions.map(s => {
                const active = activeSport === s.label
                return (
                  <button key={s.label} onClick={() => setActiveSport(s.label)}
                    className={`flex items-center gap-[6px] px-[14px] py-[8px] rounded-full border text-[12px] font-medium transition-all ${
                      active ? 'bg-[#0E8FCF] border-[#0E8FCF] text-white' : 'bg-white border-[#e8ecf1] text-[#1a2332]'
                    }`}>
                    {s.icon && (
                      <span className={active ? 'text-white' : 'text-[#0E8FCF]'}>
                        {s.icon}
                      </span>
                    )}
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Select outcomes — only after time selected */}
        {time && (
          <div>
            <p className="text-[12px] font-semibold text-[#737B8C] mb-[10px]">Sonuç Seçin</p>
            <div className="flex flex-wrap gap-[8px]">
              {outcomeOptions.map(o => {
                const active = activeOutcome === o
                return (
                  <button key={o} onClick={() => setActiveOutcome(o)}
                    className={`px-[14px] py-[8px] rounded-full border text-[12px] font-medium transition-all ${
                      active ? 'bg-[#0E8FCF] border-[#0E8FCF] text-white' : 'bg-white border-[#e8ecf1] text-[#1a2332]'
                    }`}>
                    {o}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create button */}
      <div className="px-4 pt-4 pb-[80px]">
        <button disabled={!isValid}
          className={`w-full py-[12px] rounded-xl text-[13px] font-bold transition-all ${
            isValid ? 'bg-[#0E8FCF] text-white shadow-md' : 'bg-[#dce8f5] text-[#94a3b8] cursor-not-allowed'
          }`}>
          Oluştur
        </button>
      </div>

      {/* Backdrop */}
      <div onClick={() => setSheet(null)}
        className={`fixed inset-0 z-[70] transition-all duration-300 ${sheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.4)' }}/>

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white transition-transform duration-300 ${sheet ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ borderRadius: '20px 20px 0 0' }}>
        <div className="flex justify-center pt-[10px] pb-[4px]">
          <div className="w-[36px] h-[4px] rounded-full bg-[#e2e8f0]"/>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0f2f5]">
          <h3 className="text-[14px] font-bold text-[#1a2332]">
            {sheet === 'time' ? 'Süre Seçin' : 'Kupon Türü Seçin'}
          </h3>
          <button onClick={() => setSheet(null)} className="w-7 h-7 rounded-full bg-[#f1f5f9] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-col pb-8">
          {(sheet === 'time' ? timeOptions : betTypeOptions).map(opt => {
            const current = sheet === 'time' ? time : betType
            const setter  = sheet === 'time' ? setTime : setBetType
            return (
              <button key={opt} onClick={() => { setter(opt); setSheet(null) }}
                className={`flex items-center justify-between px-5 py-[13px] border-b border-[#f0f2f5] transition-colors ${current === opt ? 'bg-[#edf5ff]' : 'hover:bg-[#f8fafc]'}`}>
                <span className={`text-[13px] font-medium ${current === opt ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{opt}</span>
                {current === opt && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
