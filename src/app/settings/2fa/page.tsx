'use client'

import { useState } from 'react'
import { PageShell } from '@/components/settings/SettingsUI'

export default function TwoFactorPage() {
  const [enabled, setEnabled] = useState(false)
  const [setup, setSetup] = useState(false)
  const [code, setCode] = useState('')

  const verify = () => {
    if (code.length === 6) {
      setEnabled(true)
      setSetup(false)
      setCode('')
    }
  }

  return (
    <PageShell title="İki Adımlı Doğrulama">
      {/* Status */}
      <div className={`mt-5 rounded-xl border p-4 flex items-center gap-3 ${enabled ? 'bg-[#e8f5e9] border-[#27ae60]/30' : 'bg-white border-[#e8ecf1]'}`}>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-[#27ae60]' : 'bg-[#edf5ff]'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={enabled ? 'white' : '#0E8FCF'}><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-[#1a2332]">{enabled ? 'Etkin' : 'Etkinleştirilmedi'}</p>
          <p className="text-[11px] text-[#737B8C] mt-0.5">{enabled ? 'Hesabınız 2FA ile korunuyor' : 'Hesabınıza ekstra güvenlik katmanı ekleyin'}</p>
        </div>
      </div>

      {!enabled && !setup && (
        <button onClick={() => setSetup(true)} className="w-full mt-4 py-[13px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors">
          İki Adımlı Doğrulamayı Etkinleştir
        </button>
      )}

      {enabled && (
        <button onClick={() => setEnabled(false)} className="w-full mt-4 py-[13px] bg-white border border-[#e74c3c]/40 text-[#e74c3c] text-[13px] font-semibold rounded-xl hover:bg-[#fde8e8] transition-colors">
          Doğrulamayı Kapat
        </button>
      )}

      {setup && (
        <div className="mt-4 bg-white rounded-xl border border-[#e8ecf1] p-4">
          <Step n={1} title="Doğrulama uygulamasını indirin" desc="Google Authenticator veya benzeri bir uygulama kullanın." />
          <Step n={2} title="QR kodu tarayın" desc="Aşağıdaki kodu uygulamanızla okutun." />
          {/* Faux QR */}
          <div className="my-3 flex justify-center">
            <div className="w-[140px] h-[140px] rounded-xl border border-[#e8ecf1] p-2 grid grid-cols-8 gap-[2px]">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={`rounded-[1px] ${(i * 7 + (i % 5) + (i % 3)) % 3 === 0 ? 'bg-[#1a2332]' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-center text-[#737B8C] mb-3">Kurulum anahtarı: <span className="font-bold text-[#1a2332] tracking-wider">JBSW Y3DP EHPK 3PXP</span></p>
          <Step n={3} title="6 haneli kodu girin" desc="Uygulamanızda görünen kodu yazın." />
          <input
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            placeholder="000000"
            className="w-full mt-2 text-center tracking-[0.5em] text-[20px] font-bold text-[#1a2332] bg-[#f1f5f9] rounded-xl py-3 outline-none focus:ring-2 focus:ring-[#0E8FCF]/40 placeholder-[#c0c8d4]"
          />
          <button onClick={verify} disabled={code.length !== 6} className="w-full mt-3 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl disabled:opacity-40 hover:bg-[#0a7ab5] transition-colors">
            Doğrula ve Etkinleştir
          </button>
        </div>
      )}
    </PageShell>
  )
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-3 py-2">
      <div className="w-6 h-6 rounded-full bg-[#0E8FCF] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">{n}</div>
      <div>
        <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">{title}</p>
        <p className="text-[10px] text-[#737B8C] mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
