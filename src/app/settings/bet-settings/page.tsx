'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BetSettingsPage() {
  const router = useRouter()
  const [oddsChange, setOddsChange] = useState(0)
  const [clearAfterBet, setClearAfterBet] = useState(true)
  const [removeFinished, setRemoveFinished] = useState(true)
  const [instantNotify, setInstantNotify] = useState(true)
  const [eventNotify, setEventNotify] = useState(true)
  const [favoriteNotify, setFavoriteNotify] = useState(false)
  const [emailNews, setEmailNews] = useState(false)
  const [smsOffers, setSmsOffers] = useState(false)
  const [phoneMarketing, setPhoneMarketing] = useState(false)
  const [theme, setTheme] = useState(0)
  const [language, setLanguage] = useState(0)

  const oddsOptions = [
    'Değişiklikleri onaylamamı iste',
    'Herhangi değişikliği kabul et',
    'Oranlar artarsa kabul et',
  ]

  const themes = ['Gündüz Modu', 'Koyu Mod', 'Gece Modu']
  const languages = ['Türkçe', 'İngilizce', 'Almanca', 'Rusça', 'İsveçce']

  function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        onClick={() => onChange(!value)}
        className={`w-[40px] h-[22px] rounded-full flex items-center px-[2px] transition-colors ${value ? 'bg-[#0E8FCF]' : 'bg-[#d0d5dd]'}`}
      >
        <div className={`w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0'}`} />
      </button>
    )
  }

  function SectionLabel({ label }: { label: string }) {
    return <p className="text-[12px] font-bold text-[#0E8FCF] px-1 pt-5 pb-2">{label}</p>
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen pb-8">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Bahis Ayarları</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4">
        {/* Oranlar değişince */}
        <SectionLabel label="Oranlar değişince" />
        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          {oddsOptions.map((opt, i) => (
            <button
              key={opt}
              onClick={() => setOddsChange(i)}
              className={`w-full flex items-center gap-3 px-3 py-3.5 text-left ${i < oddsOptions.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
            >
              <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${oddsChange === i ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                {oddsChange === i && <div className="w-[10px] h-[10px] rounded-full bg-[#0E8FCF]" />}
              </div>
              <span className={`text-[12px] font-medium ${oddsChange === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{opt}</span>
            </button>
          ))}
        </div>

        {/* Etkinlikler */}
        <SectionLabel label="Etkinlikler" />
        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-3.5 border-b border-[#f0f2f5]">
            <span className="text-[12px] font-medium text-[#1a2332] flex-1 pr-3">Bahisler yapıldığında anlık bildirimleri alın</span>
            <Toggle value={instantNotify} onChange={setInstantNotify} />
          </div>
          <div className="flex items-center justify-between px-3 py-3.5 border-b border-[#f0f2f5]">
            <span className="text-[12px] font-medium text-[#1a2332] flex-1 pr-3">Bahis yapıldıktan sonra bahis kuponunu temizle</span>
            <Toggle value={clearAfterBet} onChange={setClearAfterBet} />
          </div>
          <div className="flex items-center justify-between px-3 py-3.5">
            <span className="text-[12px] font-medium text-[#1a2332] flex-1 pr-3">Bitmiş etkinlikleri bahis kuponundan çıkar</span>
            <Toggle value={removeFinished} onChange={setRemoveFinished} />
          </div>
        </div>

        {/* Uygulama Ayarları */}
        <SectionLabel label="Uygulama Ayarları" />
        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-3.5 border-b border-[#f0f2f5]">
            <div>
              <span className="text-[12px] font-medium text-[#1a2332] block">Anlık Bildirimler</span>
              <span className="text-[9px] text-[#737B8C]">Maç etkinliği bildirimleri</span>
            </div>
            <Toggle value={eventNotify} onChange={setEventNotify} />
          </div>
          <div className="flex items-center justify-between px-3 py-3.5">
            <div>
              <span className="text-[12px] font-medium text-[#1a2332] block">Favori Oyunlar</span>
              <span className="text-[9px] text-[#737B8C]">Favori oyunlardaki etkinlikler hakkında bildirimler</span>
            </div>
            <Toggle value={favoriteNotify} onChange={setFavoriteNotify} />
          </div>
        </div>

        {/* Abonelikler */}
        <SectionLabel label="Abonelikleri Yönet" />
        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-3.5 border-b border-[#f0f2f5]">
            <div>
              <span className="text-[12px] font-medium text-[#1a2332] block">Etkinliklerle ilgili haberleri e-mail ile alın</span>
              <span className="text-[9px] text-[#737B8C]">Önemli etkinlik bonuslarda güncel kalın</span>
            </div>
            <Toggle value={emailNews} onChange={setEmailNews} />
          </div>
          <div className="flex items-center justify-between px-3 py-3.5 border-b border-[#f0f2f5]">
            <div>
              <span className="text-[12px] font-medium text-[#1a2332] block">Özel teklifleri SMS ile bilgi alın</span>
              <span className="text-[9px] text-[#737B8C]">Özel teklifleri kaçırmayın</span>
            </div>
            <Toggle value={smsOffers} onChange={setSmsOffers} />
          </div>
          <div className="flex items-center justify-between px-3 py-3.5">
            <div>
              <span className="text-[12px] font-medium text-[#1a2332] block">Telefonla pazarlama promosyon teklifleri alın</span>
            </div>
            <Toggle value={phoneMarketing} onChange={setPhoneMarketing} />
          </div>
        </div>

        {/* Info message */}
        <div className="mt-3 px-3 py-3 bg-[#edf5ff] rounded-xl border border-[#0E8FCF]/20">
          <p className="text-[10px] text-[#0E8FCF] leading-relaxed">
            E-mail adresiniz ve telefon numaranız etkinleştirildiğinde mesaj almaya başlayacaksınız.
          </p>
        </div>

        {/* Arkaplan */}
        <SectionLabel label="Arkaplan" />
        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden px-3 py-3">
          <p className="text-[11px] font-medium text-[#1a2332] mb-2">Tema Seçimi</p>
          <div className="flex gap-[6px]">
            {themes.map((t, i) => (
              <button
                key={t}
                onClick={() => setTheme(i)}
                className={`flex-1 py-[8px] rounded-lg text-[10px] font-medium transition-all ${
                  theme === i ? 'bg-[#0E8FCF] text-white' : 'bg-[#edf5ff] text-[#1a2332] border border-[#e8ecf1]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dil Seçimi */}
        <SectionLabel label="Dil Seçimi" />
        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          {languages.map((lang, i) => (
            <button
              key={lang}
              onClick={() => setLanguage(i)}
              className={`w-full flex items-center gap-3 px-3 py-3 text-left ${i < languages.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
            >
              <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${language === i ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                {language === i && <div className="w-[9px] h-[9px] rounded-full bg-[#0E8FCF]" />}
              </div>
              <span className={`text-[12px] font-medium ${language === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{lang}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
