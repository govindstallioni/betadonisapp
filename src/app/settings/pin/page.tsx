'use client'

import { useState } from 'react'
import { PageShell, Card, Row, SectionLabel, Toggle } from '@/components/settings/SettingsUI'

const ic = {
  pin: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" /></svg>,
  finger: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11c0 3-1 5-1 5" /><path d="M8 11a4 4 0 0 1 8 0c0 4-2 7-2 7" /><path d="M5 11a7 7 0 0 1 14 0c0 1.5-.3 3-.6 4" /></svg>,
}

export default function PinPage() {
  const [pinEnabled, setPinEnabled] = useState(false)
  const [biometric, setBiometric] = useState(false)
  const [pin, setPin] = useState<string[]>(['', '', '', ''])

  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    setPin(prev => prev.map((d, idx) => (idx === i ? v : d)))
    if (v && i < 3) {
      const next = document.getElementById(`pin-${i + 1}`) as HTMLInputElement | null
      next?.focus()
    }
  }

  return (
    <PageShell title="Pin Kodu & Biyometri">
      <SectionLabel label="Uygulama Kilidi" />
      <Card>
        <Row icon={ic.pin} title="PIN Kodu" desc="Uygulamayı açarken PIN iste" right={<Toggle value={pinEnabled} onChange={setPinEnabled} />} last={!pinEnabled} />
        {pinEnabled && (
          <div className="px-4 py-4 border-t border-[#f0f2f5]">
            <p className="text-[11px] text-[#737B8C] mb-3">4 haneli PIN kodunuzu belirleyin</p>
            <div className="flex gap-3 justify-center">
              {pin.map((d, i) => (
                <input
                  key={i}
                  id={`pin-${i}`}
                  value={d}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={e => setDigit(i, e.target.value)}
                  className="w-[52px] h-[56px] rounded-xl border-2 border-[#e0e5ec] bg-white text-center text-[22px] font-bold text-[#1a2332] outline-none focus:border-[#0E8FCF] transition-colors"
                />
              ))}
            </div>
            <button
              disabled={pin.some(d => !d)}
              className="w-full mt-4 py-[11px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl disabled:opacity-40 hover:bg-[#0a7ab5] transition-colors"
            >
              PIN Kodunu Kaydet
            </button>
          </div>
        )}
      </Card>

      <SectionLabel label="Biyometri" />
      <Card>
        <Row icon={ic.finger} title="Biyometrik Giriş" desc="Parmak izi / Face ID ile aç" right={<Toggle value={biometric} onChange={setBiometric} disabled={!pinEnabled} />} last />
      </Card>
      {!pinEnabled && <p className="text-[10px] text-[#737B8C] px-1 pt-2">Biyometriyi kullanmak için önce PIN kodunu etkinleştirin.</p>}
    </PageShell>
  )
}
