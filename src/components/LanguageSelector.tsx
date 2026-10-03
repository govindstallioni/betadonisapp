'use client'

import { useCallback, useEffect, useState } from 'react'
import Flag from './Flag'

// ── Language selector (v6.6 task 28, language2.png) ────────────────────────
// Five languages with flags, picked from a bottom-sheet popup. The choice is
// kept in localStorage and broadcast, so the footer button and the Settings
// "Dil Seçimi" row always show the same language. (The app copy itself is
// Turkish-only for now — this stores the preference.)

export const LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
] as const

export type LangCode = (typeof LANGUAGES)[number]['code']

const KEY = 'betadonis.lang'
const EVENT = 'betadonis:lang'

function read(): LangCode {
  try {
    const v = localStorage.getItem(KEY)
    if (LANGUAGES.some((l) => l.code === v)) return v as LangCode
  } catch {}
  return 'tr'
}

export function useLanguage() {
  const [code, setCode] = useState<LangCode>('tr')

  useEffect(() => {
    setCode(read())
    const sync = () => setCode(read())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const set = useCallback((next: LangCode) => {
    try { localStorage.setItem(KEY, next) } catch {}
    setCode(next)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return { code, lang: LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0], set }
}

export default function LanguageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { code, set } = useLanguage()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Dil Seçimi"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] bg-white rounded-t-2xl px-[16px] pt-[14px] pb-[24px]"
      >
        <div className="flex items-center justify-between mb-[10px]">
          <h2 className="text-[16px] font-semibold text-[#1a2332]">Dil Seçimi</h2>
          <button onClick={onClose} aria-label="Kapat" className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#737B8C]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <ul className="flex flex-col gap-[8px]">
          {LANGUAGES.map((l) => {
            const active = l.code === code
            return (
              <li key={l.code}>
                <button
                  onClick={() => { set(l.code); onClose() }}
                  aria-pressed={active}
                  className={`w-full h-[48px] px-[14px] rounded-xl border flex items-center gap-[12px] text-[14px] font-medium text-[#1a2332] ${active ? 'border-[#0E8FCF] bg-[#edf5ff]' : 'border-[#e8ecf1] bg-white'}`}
                >
                  <Flag emoji={l.flag} size={26} />
                  <span className="flex-1 text-left">{l.label}</span>
                  {active && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
