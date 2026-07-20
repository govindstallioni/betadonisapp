'use client'

import { useState } from 'react'
import { PageShell, Card, SectionLabel } from '@/components/settings/SettingsUI'
import { useAuth } from '@/components/AuthProvider'

function Field({ label, value, editable }: { label: string; value: string; editable?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-[#f0f2f5] last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#737B8C]">{label}</p>
        <p className="text-[13px] font-medium text-[#1a2332] mt-[1px] truncate">{value}</p>
      </div>
      {editable && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      )}
    </div>
  )
}

function PasswordInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">{label}</label>
      <div className="flex items-center gap-2.5 bg-white rounded-xl px-3 h-[44px] border border-[#e0e5ec]">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="flex-1 text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
        />
        <button onClick={() => setShow(!show)} className="p-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0b8c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function ProfilPage() {
  const { username } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setCurrent(''); setNext(''); setConfirm('')
  }

  return (
    <PageShell title="Profil Bilgileri">
      <SectionLabel label="Hesap Bilgileri" />
      <Card>
        <Field label="Kullanıcı Adı" value={username || 'kullanici'} />
        <Field label="E-posta" value="kullanici@betadonis.com" editable />
        <Field label="Telefon" value="+90 5** *** ** 21" editable />
        <Field label="Üyelik Tarihi" value="14.07.2026" />
      </Card>

      <SectionLabel label="Şifre Yenileme" />
      <div className="bg-white rounded-xl border border-[#e8ecf1] p-3.5 flex flex-col gap-3">
        <PasswordInput label="Mevcut Şifre" value={current} onChange={setCurrent} />
        <PasswordInput label="Yeni Şifre" value={next} onChange={setNext} />
        <PasswordInput label="Yeni Şifre (Tekrar)" value={confirm} onChange={setConfirm} />
      </div>

      <button
        onClick={save}
        className="w-full mt-5 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors"
      >
        {saved ? 'Kaydedildi ✓' : 'Bilgileri Güncelle'}
      </button>
    </PageShell>
  )
}
