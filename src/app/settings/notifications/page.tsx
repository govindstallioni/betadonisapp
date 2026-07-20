'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-[46px] h-[26px] rounded-full flex items-center px-[3px] transition-colors flex-shrink-0 ${value ? 'bg-[#0E8FCF]' : 'bg-[#dbe3ee]'}`}
    >
      <div className={`w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[20px]' : 'translate-x-0'}`} />
    </button>
  )
}

// Same event set repeats per delivery section (as on betadonis / 1xBet)
const EVENTS = [
  { key: 'skor', label: 'Skor' },
  { key: 'korner', label: 'Kornerler' },
  { key: 'penalti', label: 'Penaltı' },
  { key: 'kirmizi', label: 'Kırmızı kartlar' },
  { key: 'sari', label: 'Sarı kartlar' },
  { key: 'degisiklik', label: 'Oyuncu değişiklikleri' },
]

const SECTIONS = [
  { key: 'anlik', label: 'Anlık iletiler' },
  { key: 'periyot', label: 'Periyot bilgisi' },
  { key: 'mac', label: 'Maç bilgisi' },
]

const STORAGE_KEY = 'bta_notif_prefs'
const ALL_KEYS = SECTIONS.flatMap(s => EVENTS.map(e => `${s.key}.${e.key}`))

function buildDefaults(): Record<string, boolean> {
  return Object.fromEntries(ALL_KEYS.map(k => [k, false]))
}

export default function NotificationSettingsPage() {
  const router = useRouter()
  const [prefs, setPrefs] = useState<Record<string, boolean>>(buildDefaults)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved && typeof saved === 'object') setPrefs({ ...buildDefaults(), ...saved })
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)) } catch {}
  }, [prefs, loaded])

  const allOn = ALL_KEYS.every(k => prefs[k])
  const setAll = (v: boolean) => setPrefs(Object.fromEntries(ALL_KEYS.map(k => [k, v])))
  const setOne = (k: string, v: boolean) => setPrefs(p => ({ ...p, [k]: v }))

  return (
    <div className="max-w-[430px] mx-auto bg-[#eef2f7] min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold text-[#2b3a55]">Bildirimler</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Hepsini seçmek */}
        <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[15px] font-medium text-[#2b3a55]">Hepsini seçmek</span>
          <Toggle value={allOn} onChange={setAll} />
        </div>

        {/* Delivery sections */}
        {SECTIONS.map(sec => (
          <div key={sec.key} className="mt-5">
            <p className="text-[14px] font-semibold text-[#8a97ac] px-1 pb-2">{sec.label}</p>
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {EVENTS.map((ev, i) => {
                const k = `${sec.key}.${ev.key}`
                return (
                  <div key={ev.key} className={`flex items-center justify-between px-4 py-3.5 ${i < EVENTS.length - 1 ? 'border-b border-[#eef2f7]' : ''}`}>
                    <span className="text-[15px] font-medium text-[#2b3a55]">{ev.label}</span>
                    <Toggle value={!!prefs[k]} onChange={v => setOne(k, v)} />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
