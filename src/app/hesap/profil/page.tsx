'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell, Card, SectionLabel, Toggle } from '@/components/settings/SettingsUI'
import { useAuth } from '@/components/AuthProvider'
import { useSecurity, REQUIRED_PROFILE_FIELDS, formatPhone, phoneDigits } from '@/components/SecurityProvider'
import Flag from '@/components/Flag'
import { useVerification, type VerifyKind } from '@/components/verificationStore'
import { useAdc, PROFILE_CLAIM_KEY } from '@/components/AdcProvider'
import { PROFILE_REWARD } from '@/data/adcQuests'
import { CURRENCY_LABELS, findAccount } from '@/components/authStore'
import { validateEmail } from '@/components/authValidation'

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

const errIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mt-[1px]"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
)
const lockIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
)

function FieldMessage({ error }: { error?: string }) {
  if (!error) return null
  return (
    <p role="alert" className="flex items-start gap-1 mt-1 text-[10px] leading-snug text-[#e74c3c]">{errIcon}{error}</p>
  )
}

/** Verified / unverified status line under an e-mail or phone value. */
function VerifyStatus({ verified, kind }: { verified: boolean; kind: VerifyKind }) {
  const noun = kind === 'email' ? 'E-posta' : 'Telefon'
  return verified ? (
    <p className="flex items-center gap-1 mt-1 text-[10px] font-medium text-[#16a34a]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z" /></svg>
      {noun} doğrulandı
    </p>
  ) : (
    <p className="flex items-center gap-1 mt-1 text-[10px] font-medium text-[#b45309]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
      {noun} doğrulanmadı
    </p>
  )
}

/** An editable, persisted profile field. Tapping the row turns the value into
 *  an input; Enter or blur commits. Required fields left empty are flagged in
 *  red — this is the "doldurmadığı alanlar için uyarı" the task asks for.
 *  E-posta / Telefon (`verify`) are format-checked and carry a verified or
 *  unverified status with a Doğrula shortcut (tasks 32–33). */
function EditField({ label, field, type = 'text', verify }: { label: string; field: string; type?: 'text' | 'tel'; verify?: VerifyKind }) {
  const { state, setProfileField } = useSecurity()
  const router = useRouter()
  const { isVerified } = useVerification()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const raw = state.profile[field] ?? ''
  const required = REQUIRED_PROFILE_FIELDS.includes(field)
  const empty = raw.trim() === ''
  // A half-typed phone number is "invalid", not "empty" — the checklist judges
  // it by the same 05XXXXXXXXX rule, and the two screens must never disagree.
  const phoneBad = type === 'tel' && !/^05\d{9}$/.test(phoneDigits(raw))
  const mailBad = verify === 'email' && !empty && !!validateEmail(raw)
  const invalid = type === 'tel' ? phoneBad : empty || mailBad
  const display = type === 'tel' && !empty ? `+90 ${formatPhone(raw)}` : raw
  const placeholder = empty ? 'Doldurulmadı' : mailBad ? 'Geçersiz e-posta' : 'Numara eksik'

  const verified = verify ? isVerified(verify, raw) : false
  const showStatus = !!verify && !invalid && !editing

  const open = () => { setDraft(raw); setError(''); setEditing(true) }
  const commit = () => {
    const value = type === 'tel' ? phoneDigits(draft) : draft.trim()
    // Reject a malformed value instead of storing it: keep what was there and say why.
    if (verify === 'email' && value && validateEmail(value)) {
      setError(validateEmail(value)); setEditing(false); return
    }
    if (type === 'tel' && value && !/^05\d{9}$/.test(value)) {
      setError('Telefon numarası 05XX XXX XX XX biçiminde 11 haneli olmalı.'); setEditing(false); return
    }
    setError('')
    setProfileField(field, value)
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
            className={`text-[13px] font-medium mt-[1px] truncate cursor-pointer ${invalid ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}
          >
            {invalid ? placeholder : display}
          </p>
        )}
        {showStatus && verify && <VerifyStatus verified={verified} kind={verify} />}
        <FieldMessage error={error} />
      </div>
      {showStatus && verify && !verified && (
        <button onClick={() => router.push(`/hesap/dogrulama?type=${verify}`)} className="flex-shrink-0 text-[10px] font-semibold text-white bg-[#0E8FCF] rounded-full px-3 py-[5px]">
          Doğrula
        </button>
      )}
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

// ── Save-once identity fields (task 33) ─────────────────────────────────────
// Ad, Soyad and Doğum Tarihi can be filled in once. Saving asks for a
// confirmation, then locks the field; from then on only Canlı Destek can
// change it. Kullanıcı Adı and Para Birimi arrive locked from registration.

const NAME_RE = /^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû][A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû '\-]{1,39}$/

function validateName(label: string, v: string): string {
  if (!v.trim()) return `${label} gerekli.`
  if (!NAME_RE.test(v.trim())) return `${label} yalnızca harf içermeli (2-40 karakter).`
  return ''
}

function isoToday(offsetYears = 0): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + offsetYears)
  return d.toISOString().slice(0, 10)
}

function validateBirthDate(iso: string): string {
  if (!iso) return 'Doğum tarihi gerekli.'
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return 'Geçerli bir tarih girin.'
  if (iso > isoToday(-18)) return '18 yaşından küçükler üye olamaz.'
  if (iso < isoToday(-110)) return 'Geçerli bir doğum tarihi girin.'
  return ''
}

const fmtDate = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split('-').reverse().join('.') : iso)

function LockBadge() {
  return (
    <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold text-[#737B8C] bg-[#f1f5f9] rounded-full px-2 py-[3px]">
      {lockIcon}
      Kilitli
    </span>
  )
}

/** A read-only identity value (username, currency) with a lock badge. */
function LockedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-[#f0f2f5] last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#737B8C]">{label}</p>
        <p className="text-[13px] font-medium text-[#1a2332] mt-[1px] truncate">{value}</p>
      </div>
      <LockBadge />
    </div>
  )
}

function OnceField({ label, field, kind }: { label: string; field: string; kind: 'name' | 'date' }) {
  const { state, saveAndLockField } = useSecurity()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)

  const raw = state.profile[field] ?? ''
  const locked = state.locked.includes(field)
  const required = REQUIRED_PROFILE_FIELDS.includes(field)
  const empty = raw.trim() === ''
  const shown = kind === 'date' ? fmtDate(raw) : raw

  const validate = (v: string) => (kind === 'date' ? validateBirthDate(v) : validateName(label, v))
  const start = () => { setDraft(raw); setError(''); setEditing(true) }
  const submit = () => {
    const err = validate(draft)
    if (err) { setError(err); return }
    setError('')
    setConfirming(true)
  }
  const confirm = () => {
    saveAndLockField(field, draft.trim())
    setConfirming(false)
    setEditing(false)
  }

  if (locked) return <LockedRow label={label} value={shown} />

  return (
    <div className="px-3 py-3 border-b border-[#f0f2f5] last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#737B8C]">
            {label}
            {required && <span className="text-[#e74c3c]"> *</span>}
          </p>
          {editing ? (
            <input
              autoFocus
              type={kind === 'date' ? 'date' : 'text'}
              value={draft}
              max={kind === 'date' ? isoToday(-18) : undefined}
              min={kind === 'date' ? isoToday(-110) : undefined}
              maxLength={kind === 'name' ? 40 : undefined}
              onChange={e => { setDraft(e.target.value); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setEditing(false) }}
              placeholder={label}
              aria-invalid={!!error}
              className={`w-full text-[13px] font-medium text-[#1a2332] bg-transparent outline-none mt-[1px] border-b ${error ? 'border-[#e74c3c]' : 'border-[#0E8FCF]'}`}
            />
          ) : (
            <p onClick={start} className={`text-[13px] font-medium mt-[1px] truncate cursor-pointer ${empty ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>
              {empty ? 'Doldurulmadı' : shown}
            </p>
          )}
        </div>
        {!editing && (
          <button onClick={start} aria-label={`${label} gir`} className="flex-shrink-0 p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </div>
      <FieldMessage error={error} />
      {editing && (
        <div className="flex items-center gap-2 mt-2">
          <button onClick={submit} className="flex-1 py-[8px] bg-[#0E8FCF] text-white text-[12px] font-semibold rounded-lg">Kaydet</button>
          <button onClick={() => setEditing(false)} className="flex-1 py-[8px] bg-[#f1f5f9] text-[#1a2332] text-[12px] font-semibold rounded-lg">İptal</button>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50" onClick={() => setConfirming(false)}>
          <div role="dialog" aria-modal="true" aria-label="Kaydetmeyi onayla" onClick={e => e.stopPropagation()} className="w-full max-w-[430px] bg-white rounded-t-2xl px-5 pt-5 pb-6">
            <div className="flex items-center gap-2 text-[#b45309]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
              <h2 className="text-[15px] font-bold text-[#1a2332]">Bu bilgi kilitlenecek</h2>
            </div>
            <p className="text-[12px] text-[#4a5568] leading-relaxed mt-2">
              <span className="font-semibold">{label}</span>: <span className="font-semibold">{kind === 'date' ? fmtDate(draft) : draft.trim()}</span>
            </p>
            <p className="text-[12px] text-[#737B8C] leading-relaxed mt-2">
              Kaydettikten sonra bu bilgiyi kendiniz değiştiremezsiniz. Güncelleme için Canlı Destek ile iletişime geçmeniz gerekir. Bilgiyi doğru girdiğinizden emin olun.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button onClick={() => setConfirming(false)} className="flex-1 py-[11px] bg-[#f1f5f9] text-[#1a2332] text-[13px] font-semibold rounded-xl">Vazgeç</button>
              <button onClick={confirm} className="flex-1 py-[11px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl">Kaydet ve Kilitle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── 25 ADC profile reward (task 33) ─────────────────────────────────────────
function RewardCard({ steps, claimed, justEarned }: { steps: { key: string; label: string; done: boolean }[]; claimed: boolean; justEarned: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const done = steps.filter(s => s.done).length
  const pct = Math.round((done / steps.length) * 100)

  return (
    <div className={`mt-4 rounded-xl border px-3.5 py-3 ${claimed ? 'border-[#27ae60]/30 bg-[#ecfdf5]' : 'border-[#f5b301]/40 bg-[#fffbeb]'}`}>
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center text-white text-[11px] font-extrabold shadow-sm flex-shrink-0">ADC</span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-[#1a2332] leading-tight">
            {claimed ? `${PROFILE_REWARD} Adonis Coin hesabınıza eklendi` : `Profilini tamamla, ${PROFILE_REWARD} Adonis Coin kazan`}
          </p>
          <p className="text-[10px] text-[#737B8C] mt-[2px] leading-snug">
            {claimed
              ? 'Profil bilgilerinizi eksiksiz tamamladığınız için teşekkürler.'
              : 'Tüm profil bilgilerini doğru ve eksiksiz girip e-posta ile telefonunu doğrulayınca ödül otomatik olarak ADC hesabına yatırılır.'}
          </p>
        </div>
      </div>

      {justEarned && (
        <p role="status" className="mt-2 text-[11px] font-semibold text-[#166534]">🎉 Tebrikler! +{PROFILE_REWARD} ADC hesabınıza eklendi.</p>
      )}

      {!claimed && (
        <>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-[6px] rounded-full bg-[#f1e7c4] overflow-hidden">
              <div className="h-full rounded-full bg-[#f59e0b] transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] font-bold text-[#b45309] tabular-nums">{done}/{steps.length}</span>
          </div>
          <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="mt-2 text-[10px] font-semibold text-[#0E8FCF]">
            {open ? 'Adımları gizle' : 'Adımları göster'}
          </button>
          {open && (
            <ol className="mt-2 flex flex-col gap-[6px]">
              {steps.map((s, i) => (
                <li key={s.key} className={`flex items-center gap-2 text-[11px] ${s.done ? 'text-[#16a34a]' : 'text-[#4a5568]'}`}>
                  <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${s.done ? 'bg-[#16a34a] text-white' : 'bg-white border border-[#d0d5dd] text-[#737B8C]'}`}>
                    {s.done ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg> : i + 1}
                  </span>
                  <span className={s.done ? 'line-through opacity-70' : ''}>{s.label}</span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
      {claimed && (
        <button onClick={() => router.push('/adonis-coin')} className="mt-2 text-[11px] font-semibold text-[#0E8FCF]">ADC hesabıma git →</button>
      )}
    </div>
  )
}

// ── Dropdown fields (work3 task 14) ─────────────────────────────────────────
// Dil / Ülke / Bonus preferences / Canlı İzleme Tipi are fixed-choice fields on
// Betadonis, so they are picked from a list — styled like the security-question
// options — rather than typed. Values keep the strings DEFAULT_PROFILE uses.

type Option = { value: string; flag?: string }

const LANGUAGES: Option[] = [
  { value: 'Türkçe', flag: '🇹🇷' }, { value: 'English', flag: '🇬🇧' }, { value: 'Deutsch', flag: '🇩🇪' },
  { value: 'Français', flag: '🇫🇷' }, { value: 'Русский', flag: '🇷🇺' }, { value: 'Azərbaycanca', flag: '🇦🇿' },
]
const COUNTRIES: Option[] = [
  { value: 'Türkiye', flag: '🇹🇷' }, { value: 'Almanya', flag: '🇩🇪' }, { value: 'Azerbaycan', flag: '🇦🇿' },
  { value: 'Kuzey Kıbrıs', flag: '🇨🇾' }, { value: 'Hollanda', flag: '🇳🇱' }, { value: 'Belçika', flag: '🇧🇪' },
  { value: 'Fransa', flag: '🇫🇷' }, { value: 'Avusturya', flag: '🇦🇹' }, { value: 'İngiltere', flag: '🇬🇧' },
  { value: 'Diğer', flag: '🌍' },
]
const BONUS_USAGE: Option[] = [
  { value: 'İkisi de (Spor + Casino)' }, { value: 'Sadece Spor' }, { value: 'Sadece Casino' }, { value: 'Bonus Kullanmak İstemiyorum' },
]
const BLOCKABLE_BONUSES: Option[] = [
  { value: 'Hoş Geldin Bonusu' }, { value: 'Kayıp Bonusu' }, { value: 'Kripto Bonusu' },
  { value: 'Cuma Gün Bonusu' }, { value: 'Freespin' }, { value: 'Cashback' },
]
const TITLES: Option[] = [{ value: 'Bay' }, { value: 'Bayan' }]
const LIVE_VIEW: Option[] = [
  { value: 'Her Zaman Göster' }, { value: 'Sadece Canlı Yayın' }, { value: 'Sadece Animasyon (Saha)' }, { value: 'Gösterme' },
]

/** Fixed-choice profile field: the row opens a dropdown list of options.
 *  `multi` fields store a comma-separated list, with `emptyLabel` for none. */
function SelectField({ label, field, options, multi = false, emptyLabel = 'Yok' }: {
  label: string; field: string; options: Option[]; multi?: boolean; emptyLabel?: string
}) {
  const { state, setProfileField } = useSecurity()
  const [open, setOpen] = useState(false)

  const raw = state.profile[field] ?? ''
  const required = REQUIRED_PROFILE_FIELDS.includes(field)
  const selected = multi ? raw.split(',').map(v => v.trim()).filter(v => v && v !== emptyLabel) : [raw]
  const missing = !multi && raw.trim() === ''
  const current = options.find(o => o.value === raw)
  const display = multi ? (selected.length ? selected.join(', ') : emptyLabel) : raw || 'Seçim yapılmadı'

  const pick = (value: string) => {
    if (!multi) { setProfileField(field, value); setOpen(false); return }
    const next = selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]
    // keep the option order stable rather than click order
    const ordered = options.map(o => o.value).filter(v => next.includes(v))
    setProfileField(field, ordered.length ? ordered.join(', ') : emptyLabel)
  }

  return (
    <div className="border-b border-[#f0f2f5] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-3 py-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#737B8C]">
            {label}
            {required && <span className="text-[#e74c3c]"> *</span>}
          </p>
          <p className={`text-[13px] font-medium mt-[1px] truncate flex items-center gap-[6px] ${missing ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>
            {current?.flag && <Flag emoji={current.flag} size={16} />}
            {display}
          </p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div role="listbox" aria-label={label} aria-multiselectable={multi || undefined} className="mx-3 mb-3 rounded-xl border border-[#e8ecf1] overflow-hidden">
          {options.map((o, i) => {
            const on = selected.includes(o.value)
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => pick(o.value)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-[#f8fafc] transition-colors ${i < options.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
              >
                {multi ? (
                  <span className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center flex-shrink-0 ${on ? 'bg-[#0E8FCF] border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                    {on && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                  </span>
                ) : (
                  <span className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${on ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                    {on && <span className="w-[9px] h-[9px] rounded-full bg-[#0E8FCF]" />}
                  </span>
                )}
                {o.flag && <Flag emoji={o.flag} size={18} />}
                <span className="text-[13px] text-[#1a2332] flex-1">{o.value}</span>
              </button>
            )
          })}
          {multi && selected.length > 0 && (
            <button type="button" onClick={() => setProfileField(field, emptyLabel)} className="w-full py-2.5 text-[12px] font-semibold text-[#0E8FCF] border-t border-[#f0f2f5]">
              Tümünü kaldır
            </button>
          )}
        </div>
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
        <p className={`text-[13px] font-medium mt-[1px] truncate ${missing ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>{value}</p>
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
  const { isVerified } = useVerification()
  const adc = useAdc()
  const [currencyLabel, setCurrencyLabel] = useState(CURRENCY_LABELS.TRY)
  const [justEarned, setJustEarned] = useState(false)
  const wasClaimed = useRef<boolean | null>(null)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saved, setSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [newsSms, setNewsSms] = useState(true)

  // Currency is chosen at registration and never editable afterwards.
  useEffect(() => {
    if (!username) return
    findAccount(username).then(acc => {
      if (acc?.currency && CURRENCY_LABELS[acc.currency]) setCurrencyLabel(CURRENCY_LABELS[acc.currency])
    })
  }, [username])

  // ── 25 ADC profile reward ──
  const profile = state.profile
  const emailOk = !!profile['E-posta']?.trim() && !validateEmail(profile['E-posta'])
  const phoneOk = /^05\d{9}$/.test(phoneDigits(profile['Telefon'] || ''))
  const rewardSteps = [
    { key: 'unvan', label: 'Unvanınızı seçin (Bay / Bayan)', done: !!profile['Unvan']?.trim() },
    { key: 'ad', label: 'Adınızı kaydedin', done: state.locked.includes('Ad') },
    { key: 'soyad', label: 'Soyadınızı kaydedin', done: state.locked.includes('Soyad') },
    { key: 'dob', label: 'Doğum tarihinizi kaydedin', done: state.locked.includes('Doğum Tarihi') },
    { key: 'email', label: 'E-posta adresinizi doğrulayın', done: emailOk && isVerified('email', profile['E-posta'] || '') },
    { key: 'phone', label: 'Telefon numaranızı doğrulayın', done: phoneOk && isVerified('phone', profile['Telefon'] || '') },
    { key: 'address', label: 'Adres, şehir ve ülke bilgilerini doldurun', done: ['Adres', 'Şehir', 'Ülke'].every(f => (profile[f] || '').trim() !== '') },
  ]
  const allDone = rewardSteps.every(st => st.done)
  const claimed = !!adc.claims[PROFILE_CLAIM_KEY]

  // Credit once everything is complete. The provider guards against a repeat.
  useEffect(() => {
    if (!loaded || !adc.loaded) return
    if (wasClaimed.current === null) wasClaimed.current = claimed
    if (allDone && !claimed) adc.claimProfileReward()
    if (claimed && wasClaimed.current === false) {
      wasClaimed.current = true
      setJustEarned(true)
      const t = setTimeout(() => setJustEarned(false), 6000)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, adc.loaded, allDone, claimed])

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
      {loaded && adc.loaded && <RewardCard steps={rewardSteps} claimed={claimed} justEarned={justEarned} />}

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
        <SelectField label="Unvan" field="Unvan" options={TITLES} />
        <OnceField label="Ad" field="Ad" kind="name" />
        <OnceField label="Soyad" field="Soyad" kind="name" />
        <OnceField label="Doğum Tarihi" field="Doğum Tarihi" kind="date" />
        <LockedRow label="Kullanıcı Adı" value={username || 'kullanici'} />
        <LockedRow label="Para Birimi" value={currencyLabel} />
        <StaticField label="T.C. Kimlik No" value="1** *** *** 45" />
        <StaticField label="Uyruk" value="Türkiye" />
      </Card>
      <p className="text-[10px] text-[#94a3b8] px-1 mt-2 leading-relaxed">
        Ad, Soyad, Doğum Tarihi, Kullanıcı Adı ve Para Birimi kaydedildikten sonra değiştirilemez. Güncelleme için Canlı Destek ile iletişime geçin.
      </p>

      <SectionLabel label="Hesap Bilgileri" />
      <Card>
        <EditField label="E-posta" field="E-posta" verify="email" />
        <EditField label="Telefon" field="Telefon" type="tel" verify="phone" />
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
        <SelectField label="Dil" field="Dil" options={LANGUAGES} />
        <EditField label="Adres" field="Adres" />
        <EditField label="Ek Adres" field="Ek Adres" />
        <EditField label="Posta Kutusu" field="Posta Kutusu" />
        <SelectField label="Ülke" field="Ülke" options={COUNTRIES} />
        <EditField label="Şehir" field="Şehir" />
        <StaticField label="Üyelik Tarihi" value="14.07.2026" />
      </Card>

      <SectionLabel label="Tercihler" />
      <Card>
        <SelectField label="Bonusların Kullanım Yeri" field="Bonusların Kullanım Yeri" options={BONUS_USAGE} />
        <SelectField label="Engellenmiş Bonuslar" field="Engellenmiş Bonuslar" options={BLOCKABLE_BONUSES} multi />
        <SelectField label="Canlı İzleme Tipi" field="Canlı İzleme Tipi" options={LIVE_VIEW} />
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
