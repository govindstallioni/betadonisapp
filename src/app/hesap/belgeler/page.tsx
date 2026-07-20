'use client'

import { useState } from 'react'
import { PageShell, SectionLabel } from '@/components/settings/SettingsUI'

type DocStatus = 'missing' | 'pending' | 'approved'

interface DocSlot {
  key: string
  title: string
  desc: string
}

const slots: DocSlot[] = [
  { key: 'id', title: 'Kimlik Belgesi', desc: 'Kimlik kartı, ehliyet veya pasaport' },
  { key: 'address', title: 'Adres Belgesi', desc: 'Son 3 aya ait fatura veya hesap özeti' },
  { key: 'payment', title: 'Ödeme Yöntemi', desc: 'Kart veya cüzdan sahipliği kanıtı' },
]

const statusMeta: Record<DocStatus, { label: string; cls: string }> = {
  missing: { label: 'Yüklenmedi', cls: 'bg-[#f0f2f5] text-[#737B8C]' },
  pending: { label: 'İnceleniyor', cls: 'bg-[#f59e0b]/10 text-[#d97706]' },
  approved: { label: 'Onaylandı', cls: 'bg-[#27ae60]/10 text-[#27ae60]' },
}

export default function BelgelerPage() {
  const [statuses, setStatuses] = useState<Record<string, DocStatus>>({
    id: 'approved', address: 'missing', payment: 'missing',
  })

  const upload = (key: string) => {
    setStatuses((prev) => ({ ...prev, [key]: 'pending' }))
  }

  return (
    <PageShell title="Belge Yükleme">
      <div className="bg-[#edf5ff] rounded-xl border border-[#0E8FCF]/20 px-3.5 py-3 mt-4 flex gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="9" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        <p className="text-[11px] text-[#1a2332] leading-relaxed">Para çekme işlemleri için hesap doğrulaması gereklidir. Belgeleriniz 24 saat içinde incelenir.</p>
      </div>

      <SectionLabel label="Belgeler" />
      <div className="flex flex-col gap-2.5">
        {slots.map((slot) => {
          const st = statuses[slot.key]
          const meta = statusMeta[st]
          return (
            <div key={slot.key} className="bg-white rounded-xl border border-[#e8ecf1] p-3.5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a2332]">{slot.title}</p>
                  <p className="text-[10px] text-[#737B8C] mt-[2px]">{slot.desc}</p>
                </div>
                <span className={`text-[9px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-2 ${meta.cls}`}>{meta.label}</span>
              </div>
              {st !== 'approved' && (
                <button
                  onClick={() => upload(slot.key)}
                  disabled={st === 'pending'}
                  className="w-full mt-3 h-[42px] rounded-xl border-2 border-dashed border-[#c0d4e8] text-[#0E8FCF] text-[12px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#f5faff] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  {st === 'pending' ? 'Yüklendi, inceleniyor' : 'Belge Yükle'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-[9px] text-[#b0b8c4] mt-4 leading-relaxed">Kabul edilen formatlar: JPG, PNG, PDF. Maksimum dosya boyutu 10 MB.</p>
    </PageShell>
  )
}
