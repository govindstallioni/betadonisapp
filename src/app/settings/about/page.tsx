'use client'

import { useState } from 'react'
import { PageShell, Card, Row, SectionLabel } from '@/components/settings/SettingsUI'

const doc = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
const shield = <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
const mail = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
const share = <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" /></svg>

export default function AboutPage() {
  const [showQR, setShowQR] = useState(false)

  const doShare = async () => {
    const data = { title: 'BetAdonis', text: 'BetAdonis - Spor Bahisleri & Casino', url: 'https://betadonis.com' }
    try {
      if (navigator.share) await navigator.share(data)
      else if (navigator.clipboard) { await navigator.clipboard.writeText(data.url); alert('Bağlantı kopyalandı') }
    } catch {}
  }

  return (
    <PageShell title="Uygulama Hakkında">
      {/* App identity */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <img src="/logo.png" alt="BetAdonis" className="h-[26px] object-contain" />
        <p className="text-[11px] text-[#737B8C] mt-2">Sürüm 1.0.0 · <span className="text-[#27ae60] font-semibold">Güncel</span></p>
        <p className="text-[10px] text-[#b0b8c4] mt-0.5">Yapı 2026.07.09</p>
      </div>

      <SectionLabel label="Paylaş" />
      <Card>
        <Row icon={share} title="Uygulamayı Paylaş" desc="Arkadaşlarınla paylaş" onClick={doShare} />
        <Row icon={doc} title="QR Kod ile Paylaş" desc="Kodu okutarak indir" onClick={() => setShowQR(true)} last />
      </Card>

      <SectionLabel label="Yasal" />
      <Card>
        <Row icon={doc} title="Kullanım Koşulları" onClick={() => {}} />
        <Row icon={shield} title="Gizlilik Politikası" onClick={() => {}} />
        <Row icon={doc} title="Lisanslar" onClick={() => {}} />
        <Row icon={shield} title="Sorumlu Oyun" desc="18+ · Kumar bağımlılık yapabilir" onClick={() => {}} last />
      </Card>

      <SectionLabel label="Destek" />
      <Card>
        <Row icon={mail} title="Bize Ulaşın" desc="destek@betadonis.com" onClick={() => {}} last />
      </Card>

      <p className="text-center text-[9px] text-[#b0b8c4] mt-5">© 2010-2026 BetAdonis. Tüm hakları saklıdır.</p>

      {/* QR modal */}
      {showQR && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-8" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center max-w-[300px] w-full" onClick={e => e.stopPropagation()}>
            <p className="text-[14px] font-bold text-[#1a2332] mb-1">BetAdonis'i İndir</p>
            <p className="text-[11px] text-[#737B8C] mb-4 text-center">Kamera ile QR kodu okutun</p>
            <div className="w-[180px] h-[180px] rounded-xl border border-[#e8ecf1] p-2 grid grid-cols-10 gap-[2px]">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className={`rounded-[1px] ${(i * 13 + (i % 7) + (i % 3)) % 3 === 0 ? 'bg-[#1a2332]' : 'bg-transparent'}`} />
              ))}
            </div>
            <button onClick={() => setShowQR(false)} className="w-full mt-5 py-[11px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl">Kapat</button>
          </div>
        </div>
      )}
    </PageShell>
  )
}
