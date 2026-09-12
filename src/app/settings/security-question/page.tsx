'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell, Card, SectionLabel } from '@/components/settings/SettingsUI'
import { useSecurity, SECURITY_QUESTIONS } from '@/components/SecurityProvider'

// The one checklist item from guvenlik1.PNG that had no destination in the app.
// Kept deliberately small: pick a question, type the answer, save.
export default function SecurityQuestionPage() {
  const router = useRouter()
  const { loaded, state, setSecurityQuestion } = useSecurity()

  const [question, setQuestion] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const [saved, setSaved] = useState(false)

  // Uncontrolled until the user edits, so the restored values show up without
  // an effect (the provider loads in one of its own).
  const q = question ?? state.securityQuestion
  const a = answer ?? state.securityAnswer

  const invalid = q === '' || a.trim().length < 2

  const save = () => {
    setTouched(true)
    if (invalid) return
    setSecurityQuestion(q, a.trim())
    setSaved(true)
    setTimeout(() => router.back(), 900)
  }

  return (
    <PageShell title="Güvenlik Sorusu">
      <div className="mt-4 bg-white rounded-xl border border-[#e8ecf1] px-4 py-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0 text-[#0E8FCF]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#1a2332] leading-tight">Neden gerekli?</p>
          <p className="text-[11px] text-[#737B8C] mt-1 leading-relaxed">
            Hesabınızda şüpheli bir işlem olduğunda ya da şifrenizi sıfırlamak istediğinizde,
            destek ekibimiz kimliğinizi bu soruyla doğrular. Cevabınızı kimseyle paylaşmayın.
          </p>
        </div>
      </div>

      <SectionLabel label="Sorunuzu seçin" />
      <Card>
        {SECURITY_QUESTIONS.map((item, i) => {
          const selected = q === item
          return (
            <button
              key={item}
              onClick={() => setQuestion(item)}
              className={`w-full flex items-center gap-3 px-3 py-3.5 text-left hover:bg-[#f8fafc] transition-colors ${i < SECURITY_QUESTIONS.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
            >
              <span
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}
              >
                {selected && <span className="w-[9px] h-[9px] rounded-full bg-[#0E8FCF]" />}
              </span>
              <span className="text-[13px] text-[#1a2332] flex-1">{item}</span>
            </button>
          )
        })}
      </Card>
      {touched && q === '' && <p className="text-[10px] text-[#e74c3c] px-1 mt-1.5">Lütfen bir soru seçin.</p>}

      <SectionLabel label="Cevabınız" />
      <input
        value={a}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Cevabınızı yazın"
        className={`w-full h-[46px] rounded-xl px-3.5 text-[13px] text-[#1a2332] bg-white border outline-none ${
          touched && a.trim().length < 2 ? 'border-[#e74c3c]' : 'border-[#e8ecf1] focus:border-[#0E8FCF]'
        }`}
      />
      {touched && a.trim().length < 2 && (
        <p className="text-[10px] text-[#e74c3c] px-1 mt-1.5">Cevabınızı girin (en az 2 karakter).</p>
      )}
      <p className="text-[10px] text-[#94a3b8] px-1 mt-2 leading-relaxed">
        Cevabınız yalnızca bu cihazda saklanır ve ekranda gizlenir.
      </p>

      <button
        onClick={save}
        disabled={!loaded}
        className="w-full h-[46px] mt-5 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold disabled:opacity-40 active:scale-[0.99] transition-transform"
      >
        {saved ? 'Kaydedildi ✓' : 'Kaydet'}
      </button>
    </PageShell>
  )
}
