'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Real content sourced from betadonis.com/tr/affiliates/about ────────────
const advantages = [
  'Cömert bir komisyon planına kesinlikle sizler kadar bizler de değer veriyoruz.',
  'Betadonis’i tanıtırken müşteri devamlılığını arttırmak için tasarlanmış benzersiz bir ürün sunmaktasınız.',
  'İşbirliği dürüstlük gerektirir. Ay sonundaki toplam gelirinizden herhangi bir ek maaliyet kesilmemektedir.',
  'Betadonis avrupa vatandaşları için vergiden muaf kazancı sağlayan lisansa sahiptir.',
  'Sadakat programımız oyuncu tecrübesinin bir parçası ve şimdiye kadar yapılmış en iyi sistemidir.',
  'Destek bizim için bir maliyet değil, oyuncularımız ile iyi ilişkiler içerisinde olmak için bir fırsattır.',
]

const tiers = [
  { range: '0€ - 10.000€', rate: '%25' },
  { range: '10.000€ - 20.000€', rate: '%30' },
  { range: '20.000€ - 30.000€', rate: '%35' },
  { range: '30.000€ - ∞', rate: '%40' },
]

const iCheck = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-[2px]">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function OrtaklikScreen() {
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative pb-10">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Ortaklık</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Hero */}
      <div className="mx-4 mt-4 rounded-2xl p-5 text-center text-white" style={{ background: 'linear-gradient(135deg,#0c3060,#0E8FCF)' }}>
        <p className="text-[17px] font-extrabold leading-snug">
          Lider Betadonis Ortaklık Programımızın sunduğu avantajların tadını çıkarın!
        </p>
        <p className="text-[12px] text-white/85 mt-2 leading-relaxed">
          Betadonis Ortaklık Programına katılın ve sitemizdeki oyuncular aracılığı ile para kazanın.
        </p>
        <div className="flex gap-[10px] mt-4">
          <Link href="/ortaklik/login" className="flex-1 h-[42px] rounded-full bg-white/15 border border-white/40 text-white text-[12px] font-bold flex items-center justify-center">
            Ortak Olarak Giriş
          </Link>
          <Link href="/ortaklik/register" className="flex-1 h-[42px] rounded-full bg-white text-[#0E8FCF] text-[12px] font-bold flex items-center justify-center">
            Bize Katılın
          </Link>
        </div>
      </div>

      {/* Avantajlar */}
      <p className="text-[12px] font-bold text-[#0E8FCF] px-5 pt-6 pb-2">Avantajlar</p>
      <div className="mx-4 bg-white rounded-xl border border-[#e8ecf1] px-4 py-3.5 flex flex-col gap-3">
        {advantages.map((a) => (
          <div key={a} className="flex items-start gap-2.5">
            {iCheck}
            <p className="text-[12px] text-[#4a5568] leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      {/* Komisyon Yapısı */}
      <p className="text-[12px] font-bold text-[#0E8FCF] px-5 pt-6 pb-2">Komisyon Yapısı</p>
      <div className="mx-4 bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
        <div className="flex items-center px-4 py-2.5 bg-[#f8fafc] border-b border-[#e8ecf1]">
          <span className="flex-1 text-[10px] font-bold text-[#737B8C] uppercase tracking-wide">Betadonis Kazanç</span>
          <span className="text-[10px] font-bold text-[#737B8C] uppercase tracking-wide">Gelir Payı</span>
        </div>
        {tiers.map((t, i) => (
          <div key={t.range} className={`flex items-center px-4 py-3 ${i < tiers.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}>
            <span className="flex-1 text-[12px] font-medium text-[#1a2332]">{t.range}</span>
            <span className="text-[13px] font-extrabold text-[#0E8FCF]">{t.rate}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[#737B8C] px-5 mt-3 leading-relaxed">
        Ek masrafsız hayat boyu komisyon demek cebinizde daha fazla para demektir. Her ay negatif bakiyeniz sıfırlanır, bir sonraki aylara yansıtılmaz. Arkanıza yaslanın ve kazanmaya başlayın.
      </p>
      <div className="px-4 mt-4">
        <Link href="/ortaklik/register" className="block w-full h-[46px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold flex items-center justify-center">
          Bize Katılın
        </Link>
      </div>

      {/* Kayıtlı Ofis / İletişim */}
      <div className="mx-4 mt-6 bg-[#f8fafc] rounded-xl border border-[#eef1f5] px-4 py-3.5">
        <p className="text-[10px] font-bold text-[#0E8FCF] uppercase tracking-wide mb-1.5">Kayıtlı Ofis</p>
        <p className="text-[11px] text-[#737B8C] leading-relaxed">
          Allcomponent N.V., E-Commerce Park Vredenberg, Willemstad, Curaçao — Curaçao Ticaret Odası, sicil no. 136053.
        </p>
        <p className="text-[10px] font-bold text-[#0E8FCF] uppercase tracking-wide mt-3 mb-1.5">İletişim</p>
        <p className="text-[11px] text-[#737B8C] leading-relaxed">info@betadonis.com · betadonis.affiliates@gmail.com</p>
      </div>
    </div>
  )
}
