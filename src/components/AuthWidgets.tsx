'use client'

import { useEffect, useState } from 'react'
import Flag from '@/components/Flag'
import { docs } from '@/app/bilgi/[slug]/BilgiClient'
import { passwordRules } from '@/components/authValidation'

// ── Shared building blocks for login / register / forgot-password ──────────
// (v6.6 tasks 30–31). Keeping them here means every auth screen shows the same
// warning bubble, option picker, legal popup and password-requirements panel.

const chevronDown = (open = false) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

// ── Warning / success notification bubble ──────────────────────────────────
export type Notice = { kind: 'error' | 'warn' | 'success'; text: string; id: number } | null

export function useNotice() {
  const [notice, setNotice] = useState<Notice>(null)
  const show = (kind: 'error' | 'warn' | 'success', text: string) => setNotice({ kind, text, id: Date.now() })
  const hide = () => setNotice(null)
  return { notice, show, hide }
}

const NOTICE_STYLE = {
  error: { bg: '#fef2f2', border: 'rgba(231,76,60,0.35)', fg: '#b91c1c', icon: '#e74c3c' },
  warn: { bg: '#fef3c7', border: 'rgba(245,158,11,0.35)', fg: '#92400e', icon: '#f59e0b' },
  success: { bg: '#ecfdf5', border: 'rgba(39,174,96,0.35)', fg: '#166534', icon: '#27ae60' },
}

export function NoticeBubble({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [notice, onClose])

  if (!notice) return null
  const s = NOTICE_STYLE[notice.kind]
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-3 z-[1100] pointer-events-none">
      <div
        role="alert"
        className="pointer-events-auto flex items-center gap-2 rounded-xl px-3 py-[10px] shadow-lg border"
        style={{ background: s.bg, borderColor: s.border, color: s.fg }}
      >
        {notice.kind === 'success'
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill={s.icon}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z" /></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill={s.icon}><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>}
        <span className="text-[11px] font-medium flex-1">{notice.text}</span>
        <button onClick={onClose} aria-label="Kapat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  )
}

// ── Bottom-sheet shell ─────────────────────────────────────────────────────
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] max-h-[80vh] flex flex-col bg-white rounded-t-2xl"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
          <h2 className="text-[15px] font-semibold text-[#1a2332]">{title}</h2>
          <button onClick={onClose} aria-label="Kapat" className="w-8 h-8 rounded-full flex items-center justify-center text-[#737B8C]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto px-4 pb-6">{children}</div>
      </div>
    </div>
  )
}

// ── Option picker (phone code, currency, bonus, country) ───────────────────
export interface Option { value: string; label: string; flag?: string; hint?: string }

export function OptionSheet({ title, options, value, onSelect, onClose }: {
  title: string; options: Option[]; value: string; onSelect: (v: string) => void; onClose: () => void
}) {
  return (
    <Sheet title={title} onClose={onClose}>
      <ul className="flex flex-col gap-[8px] pt-1">
        {options.map((o) => {
          const active = o.value === value
          return (
            <li key={o.value}>
              <button
                onClick={() => { onSelect(o.value); onClose() }}
                aria-pressed={active}
                className={`w-full min-h-[46px] px-[14px] rounded-xl border flex items-center gap-[12px] text-[13px] font-medium text-[#1a2332] text-left ${active ? 'border-[#0E8FCF] bg-[#edf5ff]' : 'border-[#e8ecf1] bg-white'}`}
              >
                {o.flag && <Flag emoji={o.flag} size={24} />}
                <span className="flex-1">{o.label}</span>
                {o.hint && <span className="text-[11px] text-[#737B8C]">{o.hint}</span>}
                {active && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>}
              </button>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}

// ── Legal popup (Şartlar ve Koşullar / Müşteri Sözleşmesi / Gizlilik) ──────
export function LegalModal({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  if (!slug) return null
  const doc = docs[slug]
  if (!doc) return null
  return (
    <Sheet title={doc.title} onClose={onClose}>
      <p className="text-[12px] text-[#4a5568] leading-relaxed pt-1">{doc.intro}</p>
      {doc.sections.map((s) => (
        <div key={s.heading || s.body} className="mt-4">
          {s.heading && <p className="text-[12px] font-bold text-[#0E8FCF] mb-1">{s.heading}</p>}
          <p className="text-[12px] text-[#4a5568] leading-relaxed">{s.body}</p>
        </div>
      ))}
      <button onClick={onClose} className="w-full mt-6 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl">
        Anladım
      </button>
    </Sheet>
  )
}

// ── Field components (with error state) ────────────────────────────────────
const borderFor = (error?: string) =>
  error
    ? 'border-[#e74c3c] shadow-[0_0_0_3px_rgba(231,76,60,0.1)]'
    : 'border-[#e8ecf1] focus-within:border-[#0E8FCF] focus-within:shadow-[0_0_0_3px_rgba(14,143,207,0.1)]'

export function FieldError({ error }: { error?: string }) {
  if (!error) return null
  return (
    <p role="alert" className="flex items-start gap-1 mt-1 px-1 text-[10px] leading-snug text-[#e74c3c]">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mt-[1px]"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
      {error}
    </p>
  )
}

export function TextField({ label, placeholder, required, type = 'text', value, onChange, onBlur, error, inputMode, maxLength, autoComplete }: {
  label?: string; placeholder: string; required?: boolean; type?: string; value: string
  onChange: (v: string) => void; onBlur?: () => void; error?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'; maxLength?: number; autoComplete?: string
}) {
  return (
    <div className="mt-2.5">
      <div className={`bg-white rounded-xl px-3 py-[2px] border transition-all ${borderFor(error)}`}>
        {label && <span className="text-[9px] text-[#737B8C] font-medium block pt-[6px]">{label}{required && ' *'}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className={`w-full text-[12px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4] ${label ? 'pb-[6px]' : 'py-[10px]'}`}
        />
      </div>
      <FieldError error={error} />
    </div>
  )
}

export function PasswordField({ label, placeholder, value, onChange, onBlur, error, autoComplete }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; onBlur?: () => void; error?: string; autoComplete?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="mt-2.5">
      <div className={`flex items-center bg-white rounded-xl px-3 py-[2px] border transition-all ${borderFor(error)}`}>
        <div className="flex-1 py-[6px]">
          <span className="text-[9px] text-[#737B8C] font-medium block">{label} *</span>
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            className="w-full text-[12px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
          />
        </div>
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'} className="flex-shrink-0 p-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {show ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
          </svg>
        </button>
      </div>
      <FieldError error={error} />
    </div>
  )
}

// A tappable field that opens an OptionSheet.
export function SelectField({ label, title, options, value, onChange, required, error }: {
  label: string; title?: string; options: Option[]; value: string; onChange: (v: string) => void; required?: boolean; error?: string
}) {
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.value === value)
  return (
    <div className="mt-2.5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`w-full flex items-center bg-white rounded-xl px-3 py-[2px] border text-left transition-colors ${error ? 'border-[#e74c3c]' : 'border-[#e8ecf1] hover:border-[#0E8FCF]'}`}
      >
        <div className="flex-1 py-[6px] min-w-0">
          <span className="text-[9px] text-[#0E8FCF] font-medium block">{label}{required && ' *'}</span>
          <span className="text-[12px] text-[#1a2332] font-medium flex items-center gap-1.5">
            {current?.flag && <Flag emoji={current.flag} size={16} />}
            {current?.label || 'Seçiniz'}
          </span>
        </div>
        {chevronDown()}
      </button>
      <FieldError error={error} />
      {open && <OptionSheet title={title || label} options={options} value={value} onSelect={onChange} onClose={() => setOpen(false)} />}
    </div>
  )
}

// Phone-code button next to the number input.
export function CodeSelect({ options, value, onChange }: { options: Option[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.value === value)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-[2px] border border-[#e8ecf1] hover:border-[#0E8FCF] transition-colors">
        <div className="py-[6px]">
          <span className="text-[9px] text-[#0E8FCF] font-medium block text-left">Kod *</span>
          <div className="flex items-center gap-1.5">
            {current?.flag && <Flag emoji={current.flag} size={18} />}
            <span className="text-[12px] text-[#1a2332] font-medium">{current?.value}</span>
            {chevronDown()}
          </div>
        </div>
      </button>
      {open && <OptionSheet title="Ülke Kodu" options={options} value={value} onSelect={onChange} onClose={() => setOpen(false)} />}
    </>
  )
}

export function CheckboxField({ label, checked, onChange, error }: { label: React.ReactNode; checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div className="mt-2.5">
      <button type="button" onClick={() => onChange(!checked)} role="checkbox" aria-checked={checked} className="flex items-start gap-2.5 text-left">
        <div className={`w-[18px] h-[18px] rounded-[4px] flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${checked ? 'bg-[#0E8FCF]' : `border-[1.5px] bg-white ${error ? 'border-[#e74c3c]' : 'border-[#c0c8d4]'}`}`}>
          {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
        </div>
        <span className="text-[10px] text-[#1a2332] leading-relaxed">{label}</span>
      </button>
      <FieldError error={error} />
    </div>
  )
}

// ── Password requirements (clickable, live) ────────────────────────────────
export function PasswordRules({ password }: { password: string }) {
  const [open, setOpen] = useState(false)
  const rules = passwordRules(password)
  const done = rules.filter((r) => r.ok).length
  return (
    <div className="mt-2.5 bg-[#edf5ff] rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center gap-2.5 px-3 py-[10px]">
        <div className="w-6 h-6 rounded-full bg-[#0E8FCF] flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v-4M12 8h.01" /></svg>
        </div>
        <span className="text-[11px] text-[#1a2332] font-medium flex-1 text-left">Şifre gereksinimleri</span>
        {password && <span className="text-[10px] font-semibold text-[#0E8FCF]">{done}/{rules.length}</span>}
        {chevronDown(open)}
      </button>
      {open && (
        <ul className="px-3 pb-3 flex flex-col gap-[6px]">
          {rules.map((r) => (
            <li key={r.key} className="flex items-center gap-2 text-[10px]" style={{ color: password ? (r.ok ? '#16a34a' : '#e74c3c') : '#4a5568' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                {password && !r.ok ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="m5 12 5 5 9-10" />}
              </svg>
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
