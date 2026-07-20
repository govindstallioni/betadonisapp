'use client'

import { useState } from 'react'
import { PageShell, Card, SectionLabel } from '@/components/settings/SettingsUI'

interface LimitRow {
  key: string
  label: string
  desc: string
  unit: string
}

const depositLimits: LimitRow[] = [
  { key: 'daily', label: 'Günlük Yatırım Limiti', desc: 'Bir gün içinde yatırabileceğiniz tutar', unit: 'TRY' },
  { key: 'weekly', label: 'Haftalık Yatırım Limiti', desc: 'Bir hafta içinde yatırabileceğiniz tutar', unit: 'TRY' },
  { key: 'monthly', label: 'Aylık Yatırım Limiti', desc: 'Bir ay içinde yatırabileceğiniz tutar', unit: 'TRY' },
]

const lossLimits: LimitRow[] = [
  { key: 'lossDaily', label: 'Günlük Kayıp Limiti', desc: 'Bir günde kaybedebileceğiniz tutar', unit: 'TRY' },
  { key: 'session', label: 'Oturum Süresi', desc: 'Kesintisiz oyun oturumu süresi', unit: 'dk' },
]

function LimitInput({ row }: { row: LimitRow }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-[#f0f2f5] last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a2332] leading-tight">{row.label}</p>
        <p className="text-[10px] text-[#737B8C] mt-[2px]">{row.desc}</p>
      </div>
      <div className="flex items-center gap-1.5 bg-[#f5f7fa] rounded-lg px-2.5 h-[36px] border border-[#e0e5ec] w-[110px]">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Sınırsız"
          className="flex-1 min-w-0 text-[12px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
        />
        <span className="text-[10px] text-[#737B8C] font-medium flex-shrink-0">{row.unit}</span>
      </div>
    </div>
  )
}

export default function LimitlerPage() {
  const [showClose, setShowClose] = useState(false)

  return (
    <PageShell title="Limit Belirleme">
      <p className="text-[12px] text-[#4a5568] leading-relaxed pt-4">
        Sorumlu oyun için yatırım ve kayıp limitlerinizi belirleyin. Limitler kaydedildikten sonra artırılması 24 saat sürer.
      </p>

      <SectionLabel label="Yatırım Limitleri" />
      <Card>
        {depositLimits.map((row) => <LimitInput key={row.key} row={row} />)}
      </Card>

      <SectionLabel label="Kayıp & Oturum Limitleri" />
      <Card>
        {lossLimits.map((row) => <LimitInput key={row.key} row={row} />)}
      </Card>

      <button className="w-full mt-5 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors">
        Limitleri Kaydet
      </button>

      <SectionLabel label="Hesap Kapatma" />
      <Card>
        <div className="px-3 py-3.5">
          <p className="text-[13px] font-medium text-[#1a2332]">Hesabımı Kapat</p>
          <p className="text-[10px] text-[#737B8C] mt-1 mb-3">Belirli bir süre ara verin veya hesabınızı kalıcı olarak kapatın.</p>
          <button
            onClick={() => setShowClose(true)}
            className="w-full h-[42px] rounded-xl border border-[#e74c3c] text-[#e74c3c] text-[13px] font-semibold hover:bg-[#fef2f2] transition-colors"
          >
            Hesabı Kapat
          </button>
        </div>
      </Card>

      {showClose && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-8" onClick={() => setShowClose(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-[320px] w-full" onClick={(e) => e.stopPropagation()}>
            <p className="text-[15px] font-bold text-[#1a2332]">Hesabı Kapat</p>
            <p className="text-[12px] text-[#737B8C] mt-2">Hesabınızı kapatmadan önce müşteri hizmetleri sizinle iletişime geçecektir. Devam etmek istiyor musunuz?</p>
            <div className="flex gap-2.5 mt-5">
              <button onClick={() => setShowClose(false)} className="flex-1 h-[42px] rounded-xl border border-[#e8ecf1] text-[#1a2332] text-[13px] font-semibold">Vazgeç</button>
              <button onClick={() => setShowClose(false)} className="flex-1 h-[42px] rounded-xl bg-[#e74c3c] text-white text-[13px] font-semibold">Onayla</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
