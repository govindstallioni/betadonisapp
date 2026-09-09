'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/settings/SettingsUI'
import { fmtDateTime } from '@/data/coupons'

type DocStatus = 'missing' | 'pending' | 'approved'

interface DocSlot {
  key: string
  title: string
}

const slots: DocSlot[] = [
  { key: 'id', title: 'Kimlik Kartı' },
  { key: 'address', title: 'İkametgah Belgesi' },
  { key: 'payment', title: 'Para Yatırma Belgesi' },
]

const statusMeta: Record<DocStatus, { label: string; color: string }> = {
  missing:  { label: 'Belge İstenmedi', color: '#8899aa' },
  pending:  { label: 'İnceleniyor',     color: '#f39c12' },
  approved: { label: 'Onaylı',          color: '#27ae60' },
}

interface HistoryRow {
  id: string
  status: DocStatus
  date: string
  type: string
  preview: string
}

const THUMB = '/promotions/01.png'

// Generic document icon used for every row (matches the reference, which
// reuses one icon glyph across all three document types).
function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function NoImageIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8899aa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

export default function BelgelerPage() {
  const [statuses, setStatuses] = useState<Record<string, DocStatus>>({
    id: 'approved', address: 'missing', payment: 'missing',
  })
  const [history, setHistory] = useState<HistoryRow[]>([
    { id: '#26770', status: 'approved', date: '09.08.2024 14:44', type: 'Kimlik Kartı', preview: '5Lions_Pragmatic...' },
  ])
  const [preview, setPreview] = useState(false)
  const nextId = useRef(26771)

  const upload = (slot: DocSlot) => {
    setStatuses(prev => ({ ...prev, [slot.key]: 'pending' }))
    const rowId = `#${nextId.current++}`
    setHistory(prev => [
      { id: rowId, status: 'pending', date: fmtDateTime(Date.now()), type: slot.title, preview: `${slot.key}_belge.jpg` },
      ...prev,
    ])
    setTimeout(() => {
      setStatuses(prev => ({ ...prev, [slot.key]: 'approved' }))
      setHistory(prev => prev.map(h => (h.id === rowId ? { ...h, status: 'approved' } : h)))
    }, 3000)
  }

  return (
    <PageShell title="Belge Yükleme">
      {/* Notice box 1 — what to send */}
      <div className="bg-[#edf5ff] rounded-xl border border-[#0E8FCF]/20 px-3.5 py-3 mt-4 flex gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="9" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        <div className="text-[11px] text-[#1a2332] leading-relaxed">
          <p>Bizler mümkün olan en kısa sürede para çekim işlemlerinizi yapacağız, ancak bize sunulan bilgilerin doğrulanması gerekir. Bu nedenle aşağıdaki dokümanların bir kopyasını bize yollamanız gerekmektedir:</p>
          <ul className="mt-1.5 list-disc pl-4 space-y-0.5">
            <li>Resmi fotoğraflı kimlik fotokopisi (pasaport, ehliyet, ...)</li>
            <li>İkametgahınızı belirleyen bir belgenin fotokopisi (gaz faturası, elektrik faturası, telefon faturası, ...)</li>
          </ul>
        </div>
      </div>

      {/* Notice box 2 — accepted formats */}
      <div className="bg-[#edf5ff] rounded-xl border border-[#0E8FCF]/20 px-3.5 py-3 mt-2.5 flex gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="9" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        <p className="text-[11px] text-[#1a2332] leading-relaxed">
          Buradan taranmış veya dijital belgeleri yükleyebilirsiniz. Şu tipdeki dökümanlar kabul edilir: gif, jpg, jpeg, png, tif, tiff, pdf. Gönderebileceğiniz maksimum dosya boyutu 5 MB&apos;dır.
        </p>
      </div>

      {/* Document rows */}
      <div className="flex flex-col gap-2.5 mt-4">
        {slots.map((slot) => {
          const st = statuses[slot.key]
          const meta = statusMeta[st]
          return (
            <div key={slot.key} className="bg-white rounded-xl border border-[#e8ecf1] p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0E8FCF] flex items-center justify-center flex-shrink-0">
                  <DocIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a2332] leading-tight">{slot.title}</p>
                  <p className="text-[10px] font-medium mt-[2px]" style={{ color: meta.color }}>{meta.label}</p>
                </div>
                <button
                  onClick={() => upload(slot)}
                  disabled={st !== 'missing'}
                  className={`flex-shrink-0 px-4 h-[34px] rounded-full text-[11px] font-semibold transition-colors ${
                    st === 'missing' ? 'bg-[#0E8FCF] text-white hover:bg-[#0a7ab5]' : 'bg-[#f0f2f5] text-[#8899aa] cursor-not-allowed'
                  }`}
                >
                  {st === 'approved' ? 'Pasif' : st === 'pending' ? 'İnceleniyor' : 'Belge Yükleme'}
                </button>
              </div>

              <div className="mt-3">
                {st === 'approved' ? (
                  <button onClick={() => setPreview(true)} className="w-[110px] h-[70px] rounded-lg overflow-hidden border border-[#e8ecf1]">
                    <img src={THUMB} alt={slot.title} className="w-full h-full object-cover" />
                  </button>
                ) : (
                  <div className="w-[110px] h-[70px] rounded-lg border border-dashed border-[#d0d5dd] bg-[#f8fafc] flex flex-col items-center justify-center gap-1">
                    <NoImageIcon />
                    <span className="text-[8px] text-[#94a3b8] font-medium leading-none">{meta.label}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Closing notice */}
      <div className="bg-[#edf5ff] rounded-xl border border-[#0E8FCF]/20 px-3.5 py-3 mt-4 flex gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="9" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        <p className="text-[11px] text-[#1a2332] leading-relaxed">
          Sitemize belge yüklemekle ilgili sorun yaşarsanız, lütfen <Link href="/hesap/mesajlar" className="text-[#0E8FCF] underline">çevrimiçi sohbete</Link> yazın veya <Link href="/hesap/mesajlar" className="text-[#0E8FCF] underline">mesaj gönderin</Link>.
        </p>
      </div>

      {/* Upload history */}
      <p className="text-[12px] font-bold text-[#0E8FCF] px-1 pt-5 pb-2">Yükleme Geçmişi</p>
      <div className="flex flex-col gap-2">
        {history.map((h) => {
          const meta = statusMeta[h.status]
          return (
            <div key={h.id} className="bg-white rounded-xl border border-[#e8ecf1] px-3.5 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1a2332]">{h.id}</span>
                <span className="text-[9px] font-bold px-2 py-[3px] rounded-full flex-shrink-0" style={{ color: meta.color, background: `${meta.color}20` }}>
                  {meta.label}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#737B8C]">{h.type} · {h.date}</span>
                <button onClick={() => setPreview(true)} className="text-[10px] text-[#0E8FCF] font-semibold underline truncate max-w-[120px]">
                  {h.preview}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-8" onClick={() => setPreview(false)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-[320px] w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f2f5]">
              <p className="text-[13px] font-bold text-[#1a2332]">Belge Önizleme</p>
              <button onClick={() => setPreview(false)} className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <img src={THUMB} alt="Belge önizleme" className="w-full h-auto" />
          </div>
        </div>
      )}
    </PageShell>
  )
}
