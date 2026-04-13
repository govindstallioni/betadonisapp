'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Section data ───────────────────────────────────────────────

const hesapItems = [
  { title: 'Hesaba Para Yatır', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /><path d="M12 14h4" /></svg> },
  { title: 'Hesabından Para Çek', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10M12 12l4-4M12 12l-4-4" /><rect x="2" y="14" width="20" height="8" rx="2" /></svg> },
]

const guvenlikItems = [
  { title: 'Pinkodu ve biyometri', desc: '', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" /></svg> },
  { title: 'Kimlik Doğrulayıcı', desc: 'Etkinleştirilmedi', descColor: '#e74c3c', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg> },
  { title: 'Güvenlik Ayarları', desc: '', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg> },
  { title: 'Oturum Açma Geçmişi', desc: '', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg> },
]

const uygulamaItems = [
  { title: 'Anlık Bildirimler', desc: 'Maç etkinliği bildirimleri', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg> },
  { title: 'Abonelikleri Yönet', desc: 'Telefon ve e-mail bağlayın', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg> },
  { title: 'Arkaplan', desc: 'Tema ve dil seçimi', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg> },
]

const ekstraItems = [
  { title: 'Proxy Ayarları', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg> },
]

const hakkindaItems = [
  { title: 'Uygulamayı Paylaş', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" /></svg> },
  { title: 'QR Kodu ile Paylaş', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2z" /></svg> },
  { title: 'Uygulama Sürümü', desc: 'Güncellendi', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#27ae60"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg> },
  { title: 'Önbelleği Temizle', desc: '96.1 MB', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#737B8C"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg> },
]

// ── Component ──────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return <p className="text-[12px] font-bold text-[#0E8FCF] px-1 pt-4 pb-2">{label}</p>
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">{children}</div>
}

function SettingsRow({ title, desc, descColor, icon, onClick, last }: { title: string; desc?: string; descColor?: string; icon: React.ReactNode; onClick?: () => void; last?: boolean }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3.5 text-left hover:bg-[#f8fafc] transition-colors ${!last ? 'border-b border-[#f0f2f5]' : ''}`}>
      <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a2332] leading-tight">{title}</p>
        {desc && <p className="text-[10px] mt-[2px] leading-tight" style={{ color: descColor || '#737B8C' }}>{desc}</p>}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  )
}

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen pb-8">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.push('/?menu=open')} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Ayarlar</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4">
        {/* Hesap Yönetimi */}
        <SectionLabel label="Hesap Yönetimi" />
        <SettingsCard>
          {hesapItems.map((item, i) => (
            <SettingsRow key={item.title} title={item.title} icon={item.icon} last={i === hesapItems.length - 1} />
          ))}
        </SettingsCard>

        {/* Güvenlik */}
        <SectionLabel label="Güvenlik" />
        <SettingsCard>
          {guvenlikItems.map((item, i) => (
            <SettingsRow key={item.title} title={item.title} desc={item.desc || undefined} descColor={item.descColor} icon={item.icon} last={i === guvenlikItems.length - 1} />
          ))}
        </SettingsCard>

        {/* Bahis Ayarları */}
        <SectionLabel label="Bahis Ayarları" />
        <SettingsCard>
          <SettingsRow
            title="Bahis Ayarları"
            desc="Oranlar, etkinlikler ve kupon ayarları"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>}
            onClick={() => router.push('/settings/bet-settings')}
            last
          />
        </SettingsCard>

        {/* Uygulama Ayarları */}
        <SectionLabel label="Uygulama Ayarları" />
        <SettingsCard>
          {uygulamaItems.map((item, i) => (
            <SettingsRow key={item.title} title={item.title} desc={item.desc} icon={item.icon} last={i === uygulamaItems.length - 1} />
          ))}
        </SettingsCard>

        {/* Ekstra */}
        <SectionLabel label="Ekstra" />
        <SettingsCard>
          {ekstraItems.map((item, i) => (
            <SettingsRow key={item.title} title={item.title} icon={item.icon} last={i === ekstraItems.length - 1} />
          ))}
        </SettingsCard>

        {/* Uygulama Hakkında */}
        <SectionLabel label="Uygulama Hakkında" />
        <SettingsCard>
          {hakkindaItems.map((item, i) => (
            <SettingsRow key={item.title} title={item.title} desc={item.desc} icon={item.icon} last={i === hakkindaItems.length - 1} />
          ))}
        </SettingsCard>
      </div>
    </div>
  )
}
