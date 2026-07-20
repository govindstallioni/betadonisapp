'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const actionRoutes: Record<string, string> = {
  deposit:     '/kupon/deposit',
  search:      '/kupon/search',
  accumulator: '/kupon/accumulator',
  create:      '/kupon/create',
}

const actions = [
  {
    id: 'deposit',
    title: 'Para Yatır',
    desc: 'Bakiyeniz: 0 ₺',
    iconBg: '#27ae60',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
      </svg>
    ),
  },
  {
    id: 'search',
    title: 'Etkinlik Ara',
    desc: 'Sadece sizin için',
    iconBg: '#edf5ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
  {
    id: 'accumulator',
    title: 'Günün Kombinesi',
    desc: 'Günün en iyi teklifleri',
    iconBg: '#edf5ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#0E8FCF">
        <path d="M4 6h16v2H4zm4 5h8v2H8zm3 5h2v2h-2z"/>
      </svg>
    ),
  },
  {
    id: 'create',
    title: 'Kupon Oluştur',
    desc: 'Kuponunuzu oluşturun',
    iconBg: '#edf5ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
        <line x1="11" y1="18" x2="13" y2="18"/>
      </svg>
    ),
  },
  {
    id: 'load',
    title: 'Kupon Yükle',
    desc: 'Kuponunuzu yükleyin',
    iconBg: '#edf5ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
]

export default function KuponScreen() {
  const router = useRouter()
  const [loadSheetOpen, setLoadSheetOpen] = useState(false)
  const [code, setCode] = useState('')

  function handleAction(id: string) {
    if (id === 'load') { setLoadSheetOpen(true); return }
    if (actionRoutes[id]) router.push(actionRoutes[id])
  }

  return (
    <>
      <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">
        {/* Header */}
        <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
          <h1 className="text-[16px] font-bold text-[#1a2332] text-center">Kupon</h1>
        </div>

        {/* Empty state */}
        <div className="px-4 pt-5 pb-4 text-center">
          <p className="text-[15px] font-bold text-[#1a2332] leading-snug">Kuponunuz boş</p>
          <p className="text-[12px] text-[#737B8C] mt-[6px] leading-relaxed">
            Kuponunuza bir etkinlik ekleyin veya seçeneklerden birini seçin
          </p>
        </div>

        {/* Action list */}
        <div className="px-4 flex flex-col gap-[6px] pb-28">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="w-full flex items-center gap-3 bg-white rounded-xl px-4 py-[11px] border border-[#e8ecf1] shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: action.iconBg }}>
                {action.icon}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1a2332] leading-tight">{action.title}</p>
                <p className="text-[11px] text-[#737B8C] mt-[2px]">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setLoadSheetOpen(false)}
        className={`fixed inset-0 z-[70] transition-all duration-300 ${loadSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.45)' }}
      />

      {/* Load bet slip bottom sheet */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white transition-transform duration-300 ${loadSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ borderRadius: '20px 20px 0 0' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[10px] pb-[2px]">
          <div className="w-[36px] h-[4px] rounded-full bg-[#e2e8f0]"/>
        </div>

        {/* Title */}
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-[16px] font-bold text-[#0E8FCF]">Kupon Yükle</h3>
        </div>

        {/* Code input */}
        <div className="px-5 pt-2 pb-6">
          <input
            autoFocus={loadSheetOpen}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Kupon kodunu girin"
            className="w-full text-[14px] text-[#1a2332] placeholder-[#0E8FCF] border-b-2 border-[#0E8FCF] pb-[8px] outline-none bg-transparent"
          />
        </div>

        {/* Upload button */}
        <div className="px-5 pb-8">
          <button
            disabled={!code.trim()}
            className={`w-full py-[13px] rounded-xl text-[13px] font-bold transition-all ${
              code.trim()
                ? 'bg-[#0E8FCF] text-white'
                : 'bg-[#dce8f5] text-[#94a3b8] cursor-not-allowed'
            }`}
          >
            Yükle
          </button>
        </div>
      </div>
    </>
  )
}
