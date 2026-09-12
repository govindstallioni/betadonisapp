'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell, Card, SectionLabel, Toggle } from '@/components/settings/SettingsUI'
import { useAuth } from '@/components/AuthProvider'
import { useSecurity, REQUIRED_PROFILE_FIELDS, formatPhone, phoneDigits } from '@/components/SecurityProvider'

/** Read-only identity data — not editable for compliance reasons. */
function StaticField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-[#f0f2f5] last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#737B8C]">{label}</p>
        <p className="text-[13px] font-medium text-[#1a2332] mt-[1px] truncate">{value}</p>
      </div>
    </div>
  )
}

/** An editable, persisted profile field. Tapping the row turns the value into
 *  an input; Enter or blur commits. Required fields left empty are flagged in
 *  red — this is the "doldurmadığı alanlar için uyarı" the task asks for. */
function EditField({ label, field, type = 'text' }: { label: string; field: string; type?: 'text' | 'tel' }) {
  const { state, setProfileField } = useSecurity()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const raw = state.profile[field] ?? ''
  const required = REQUIRED_PROFILE_FIELDS.includes(field)
  const empty = raw.trim() === ''
  // A half-typed phone number is "invalid", not "empty" — the checklist judges
  // it by the same 05XXXXXXXXX rule, and the two screens must never disagree.
  const invalid = type === 'tel' ? !/^05\d{9}$/.test(phoneDigits(raw)) : empty
  const display = type === 'tel' && !empty ? `+90 ${formatPhone(raw)}` : raw
  const placeholder = empty ? 'Doldurulmadı' : 'Numara eksik'

  const open = () => { setDraft(raw); setEditing(true) }
  const commit = () => {
    setProfileField(field, type === 'tel' ? phoneDigits(draft) : draft.trim())
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-[#f0f2f5] last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#737B8C]">
          {label}
          {required && <span className="text-[#e74c3c]"> *</span>}
        </p>
        {editing ? (
          <input
            autoFocus
            type={type}
            inputMode={type === 'tel' ? 'numeric' : undefined}
            value={type === 'tel' ? formatPhone(draft) : draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') setEditing(false)
            }}
            placeholder={type === 'tel' ? '05XX XXX XX XX' : label}
            className="w-full text-[13px] font-medium text-[#1a2332] bg-transparent outline-none mt-[1px] border-b border-[#0E8FCF]"
          />
        ) : (
          <p
            onClick={open}
            className="text-[13px] font-medium mt-[1px] truncate cursor-pointer"
            style={{ color: invalid ? '#e74c3c' : '#1a2332' }}
          >
            {invalid ? placeholder : display}
          </p>
        )}
      </div>
      {!editing && (
        <button onClick={open} aria-label={`${label} düzenle`} className="flex-shrink-0 p-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}
    </div>
  )
}

/** A field whose value lives elsewhere — tapping it navigates there. */
function LinkField({ label, value, href, missing }: { label: string; value: string; href: string; missing?: boolean }) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(href)}
      className="flex items-center gap-3 px-3 py-3 border-b border-[#f0f2f5] last:border-b-0 cursor-pointer hover:bg-[#f8fafc] transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#737B8C]">{label}</p>
        <p className="text-[13px] font-medium mt-[1px] truncate" style={{ color: missing ? '#e74c3c' : '#1a2332' }}>{value}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="m9 18 6-6-6-6" />
      </svg>
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
  const { loaded, state, doneCount, total, secured, recordPasswordChange } = useSecurity()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saved, setSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [newsSms, setNewsSms] = useState(true)

  const missingRequired = REQUIRED_PROFILE_FIELDS.filter(f => (state.profile[f] || '').trim() === '')
  const questionSet = state.securityQuestion !== '' && state.securityAnswer.trim() !== ''

  // Field edits persist as you make them; this button only handles the password
  // form, which is what actually resets the checklist's 90-day clock.
  const save = () => {
    setPwError('')
    if (!current && !next && !confirm) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }
    if (next.length < 6) { setPwError('Yeni şifre en az 6 karakter olmalı.'); return }
    if (next !== confirm) { setPwError('Yeni şifreler eşleşmiyor.'); return }
    recordPasswordChange()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setCurrent(''); setNext(''); setConfirm('')
  }

  return (
    <PageShell title="Profil Bilgileri">
      {/* Completion nudge — mirrors the security checklist so the two never
          tell the user different things. */}
      {loaded && !secured && (
        <div className="mt-4 rounded-xl border border-[#0E8FCF]/25 bg-[#eaf5fc] px-3.5 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[12px] font-bold text-[#1a2332]">Profilinizi tamamlayın</p>
            <p className="text-[11px] font-bold text-[#0E8FCF] tabular-nums flex-shrink-0">{doneCount}/{total}</p>
          </div>
          <p className="text-[10px] text-[#737B8C] mt-1 leading-relaxed">
            {missingRequired.length > 0
              ? `Eksik alanlar: ${missingRequired.join(', ')}. Yıldızlı (*) alanları doldurduğunuzda güvenlik puanınız yükselir.`
              : 'Zorunlu alanlar tamam. Kalan güvenlik adımlarını Güvenlik Ayarları sayfasından tamamlayabilirsiniz.'}
          </p>
        </div>
      )}

      <SectionLabel label="Kişisel Bilgiler" />
      <Card>
        <StaticField label="Ad Soyad" value={`${state.profile['Ad']} ${state.profile['Soyad']}`.trim()} />
        <StaticField label="Doğum Tarihi" value="12.05.1990" />
        <StaticField label="T.C. Kimlik No" value="1** *** *** 45" />
        <StaticField label="Uyruk" value="Türkiye" />
        <StaticField label="Para Birimi" value="Türk Lirası (TRY)" />
      </Card>
      <p className="text-[10px] text-[#94a3b8] px-1 mt-2 leading-relaxed">
        Güvenlik nedeniyle kimlik bilgileriniz değiştirilemez. Güncelleme için Canlı Destek ile iletişime geçin.
      </p>

      <SectionLabel label="Hesap Bilgileri" />
      <Card>
        <EditField label="Unvan" field="Unvan" />
        <EditField label="Ad" field="Ad" />
        <EditField label="Soyad" field="Soyad" />
        <StaticField label="Kullanıcı Adı" value={username || 'kullanici'} />
        <EditField label="E-posta" field="E-posta" />
        <EditField label="Telefon" field="Telefon" type="tel" />
        <LinkField
          label="Güvenlik Sorusu"
          href="/settings/security-question"
          missing={!questionSet}
          value={questionSet ? state.securityQuestion : 'Seçim yapılmadı'}
        />
        <LinkField
          label="Güvenlik Cevabı"
          href="/settings/security-question"
          missing={!questionSet}
          value={questionSet ? '••••••' : 'Girilmedi'}
        />
        <EditField label="Dil" field="Dil" />
        <EditField label="Adres" field="Adres" />
        <EditField label="Ek Adres" field="Ek Adres" />
        <EditField label="Posta Kutusu" field="Posta Kutusu" />
        <EditField label="Ülke" field="Ülke" />
        <EditField label="Şehir" field="Şehir" />
        <StaticField label="Üyelik Tarihi" value="14.07.2026" />
      </Card>

      <SectionLabel label="Tercihler" />
      <Card>
        <EditField label="Bonusların Kullanım Yeri" field="Bonusların Kullanım Yeri" />
        <EditField label="Engellenmiş Bonuslar" field="Engellenmiş Bonuslar" />
        <EditField label="Canlı İzleme Tipi" field="Canlı İzleme Tipi" />
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#1a2332]">Haber / SMS Bildirimleri</p>
            <p className="text-[10px] text-[#737B8C] mt-[1px]">Kampanya ve duyuruları e-posta veya SMS ile al</p>
          </div>
          <Toggle value={newsSms} onChange={setNewsSms} />
        </div>
      </Card>

      <SectionLabel label="Şifre Yenileme" />
      <div className="bg-white rounded-xl border border-[#e8ecf1] p-3.5 flex flex-col gap-3">
        <PasswordInput label="Mevcut Şifre" value={current} onChange={setCurrent} />
        <PasswordInput label="Yeni Şifre" value={next} onChange={setNext} />
        <PasswordInput label="Yeni Şifre (Tekrar)" value={confirm} onChange={setConfirm} />
        {pwError && <p className="text-[10px] text-[#e74c3c]">{pwError}</p>}
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
