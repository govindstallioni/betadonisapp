'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const accountNumber = '1612620843'

const paymentSections = [
  {
    title: 'ÖNERİLEN',
    methods: [
      { id: 1, name: 'Halk Bank' },
      { id: 2, name: 'Hızlı Banka Havale-EFT-FAST 7/24', badge: 'cashback 10%' },
      { id: 3, name: 'Instant QR' },
      { id: 4, name: 'Vakıf Bank' },
      { id: 5, name: 'YapıKredi' },
      { id: 6, name: 'Tether on Tron' },
      { id: 7, name: 'TRON' },
    ],
  },
  {
    title: 'BANKA TRANSFERİ',
    methods: [
      { id: 8,  name: 'Halk Bank' },
      { id: 9,  name: 'Hızlı Banka Havale-EFT-FAST 7/24', badge: 'cashback 10%' },
      { id: 10, name: 'VIP Havale' },
      { id: 11, name: 'Türkiye İş Bankası' },
      { id: 12, name: 'Enpara' },
      { id: 13, name: 'Trink Para Havale EFT 7/24' },
      { id: 14, name: 'Garanti BBVA' },
      { id: 15, name: 'Ziraat Bankası' },
      { id: 16, name: 'Akbank' },
    ],
  },
  {
    title: 'KRİPTO PARA',
    methods: [
      { id: 17, name: 'Bitcoin' },
      { id: 18, name: 'Ethereum' },
      { id: 19, name: 'USDT (TRC20)' },
      { id: 20, name: 'USDT (ERC20)' },
    ],
  },
  {
    title: 'E-CÜZDAN',
    methods: [
      { id: 21, name: 'Papara' },
      { id: 22, name: 'PayFix' },
      { id: 23, name: 'CMT' },
    ],
  },
]

export default function DepositScreen() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  function copyAccount() {
    navigator.clipboard?.writeText(accountNumber).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] flex items-center">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Hesaba Para Yatır</h1>
        <button className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </div>

      <div className="px-4 pt-4 pb-28 flex flex-col gap-[12px]">

        {/* Account number */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-extrabold text-[#1a2332] tracking-wide">
            HESAP {accountNumber}
          </span>
          <button onClick={copyAccount} className="flex items-center justify-center">
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>
        </div>

        {/* Payment type filter */}
        <button className="self-start px-[14px] py-[8px] rounded-lg bg-[#0E8FCF] text-white text-[11px] font-semibold">
          Ödeme sistemi türleri
        </button>

        {/* Promo banner */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#071428 0%,#0c2a5a 60%,#0E8FCF 100%)' }}>
          <div className="flex items-center justify-center gap-3 px-4 py-[14px]">
            <div>
              <p className="text-[12px] font-extrabold text-white tracking-wide text-center">BETADONİS İLE İŞ BİRLİĞİ YAP</p>
              <p className="text-[11px] font-bold text-[#0E8FCF] text-center mt-[2px]">ELBETTE!</p>
            </div>
            <div className="w-[34px] h-[34px] rounded-full bg-[#0E8FCF] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Info text */}
        <div className="bg-white rounded-xl px-4 py-3 border border-[#e8ecf1]">
          <p className="text-[11px] text-[#737B8C] leading-relaxed">
            Ödemeniz <span className="font-bold text-[#1a2332]">12 SAAT</span> içinde alınmazsa, lütfen taleplerinizi{' '}
            <span className="text-[#0E8FCF] font-medium">odemeler@betadonis.com</span>{' '}
            adresine gönderin.
          </p>
        </div>

        {/* Payment sections */}
        {paymentSections.map(section => (
          <div key={section.title} className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
            <div className="px-4 py-[10px] bg-[#f4f7fb] border-b border-[#e8ecf1]">
              <span className="text-[10px] font-bold text-[#737B8C] tracking-wider">{section.title}</span>
            </div>
            <div className="grid grid-cols-3">
              {section.methods.map((method, i) => (
                <button
                  key={method.id}
                  className={`flex flex-col overflow-hidden border-[#f0f2f5] ${
                    i % 3 !== 2 ? 'border-r' : ''
                  } ${i < section.methods.length - (section.methods.length % 3 || 3) ? 'border-b' : ''}`}
                >
                  {/* Placeholder logo area */}
                  <div className="relative bg-[#f8fafc] flex items-center justify-center h-[72px]">
                    {method.badge && (
                      <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-[8px] font-bold px-[6px] py-[2px] rounded-bl-lg">
                        {method.badge}
                      </span>
                    )}
                    {/* Placeholder icon */}
                    <div className="flex flex-col items-center gap-[4px]">
                      <div className="w-[36px] h-[28px] rounded-[6px] bg-[#e2e8f0]"/>
                      <div className="w-[24px] h-[6px] rounded-full bg-[#e8ecf1]"/>
                    </div>
                  </div>
                  {/* Label */}
                  <div className="bg-[#0E8FCF] px-[6px] py-[7px]">
                    <p className="text-[9px] font-semibold text-white text-center leading-tight line-clamp-2">
                      {method.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
