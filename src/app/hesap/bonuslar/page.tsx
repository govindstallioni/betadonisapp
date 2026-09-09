'use client'

import { useState } from 'react'
import { PageShell } from '@/components/settings/SettingsUI'

interface Bonus {
  title: string
  amount: string
  desc: string
  progress: number   // 0-100 wagering
  remaining?: string // active: remaining wagering amount, e.g. "142,50 TRY"
  status: 'active' | 'past'
  result?: 'Kullanılarak kapanmış' | 'Süresi Doldu'
  date?: string       // past: when it was won/closed
  source?: 'Casino' | 'Ortak'
}

const bonuses: Bonus[] = [
  { title: 'Hoş Geldin Bonusu', amount: '250.00 TRY', desc: 'İlk yatırım bonusu · %100', progress: 45, remaining: '137,50 TRY', status: 'active' },
  { title: 'Spor Kayıp Bonusu', amount: '120.00 TRY', desc: 'Haftalık kayıp iadesi', progress: 10, remaining: '108,00 TRY', status: 'active' },
  { title: 'Casino Free Spin', amount: '50 Spin', desc: 'Slot oyunları için', progress: 100, status: 'past', result: 'Kullanılarak kapanmış', date: '11.03.2025', source: 'Casino' },
  { title: 'Doğum Günü Bonusu', amount: '75.00 TRY', desc: 'Kişiye özel', progress: 30, status: 'past', result: 'Süresi Doldu', date: '19.03.2025', source: 'Ortak' },
]

const DEMO_CODE = 'HOSGELDIN100'

export default function BonuslarPage() {
  const [tab, setTab] = useState<'active' | 'past'>('active')
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)
  const list = bonuses.filter((b) => b.status === tab)

  const claim = () => {
    if (!code.trim()) return
    setFeedback(code.trim().toUpperCase() === DEMO_CODE ? 'success' : 'error')
  }

  return (
    <PageShell title="Bonuslar">
      {/* Get Bonus Code */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] p-3.5 mt-4">
        <p className="text-[12px] font-semibold text-[#1a2332] mb-2">Bonus İçin Kod</p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setFeedback(null) }}
            placeholder="Kodunuzu girin"
            className="flex-1 min-w-0 text-[13px] text-[#1a2332] bg-[#f5f7fa] rounded-xl px-3 h-[42px] border border-[#e0e5ec] outline-none placeholder-[#b0b8c4]"
          />
        </div>
        <button
          onClick={claim}
          disabled={!code.trim()}
          className="w-full mt-2.5 h-[42px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-semibold hover:bg-[#0a7ab5] disabled:opacity-40 transition-colors"
        >
          Bonusunuzu Alın
        </button>

        {feedback === 'success' && (
          <div className="mt-3 px-3 py-2.5 bg-[#e8f7ef] border border-[#27ae60]/30 rounded-xl flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span className="text-[10px] text-[#1a7a43] font-medium flex-1">Bonus kodu başarıyla uygulandı!</span>
            <button onClick={() => setFeedback(null)} className="text-[#1a7a43]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}
        {feedback === 'error' && (
          <div className="mt-3 px-3 py-2.5 bg-[#fef2f2] border border-[#e74c3c]/30 rounded-xl flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e74c3c"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
            <span className="text-[10px] text-[#b91c1c] font-medium flex-1">Geçersiz bonus kodu.</span>
            <button onClick={() => setFeedback(null)} className="text-[#b91c1c]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-[#e8ecf1] p-1 mt-4">
        {(['active', 'past'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 h-[36px] rounded-lg text-[12px] font-semibold transition-colors ${tab === t ? 'bg-[#0E8FCF] text-white' : 'text-[#737B8C]'}`}
          >
            {t === 'active' ? 'Aktif Bonuslar' : 'Geçmiş Bonuslar'}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center pt-16 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="1.4"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /><path d="M12 8C12 5 10 3 8 3a2.5 2.5 0 0 0 0 5M12 8c0-3 2-5 4-5a2.5 2.5 0 0 1 0 5" /></svg>
          <p className="text-[13px] font-semibold text-[#1a2332] mt-3">Bonus bulunamadı</p>
          <p className="text-[11px] text-[#737B8C] mt-1">Bu kategoride bonusunuz bulunmuyor.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          {list.map((b) => (
            <div key={b.title} className="bg-white rounded-xl border border-[#e8ecf1] p-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-bold text-[#1a2332]">{b.title}</p>
                  <p className="text-[10px] text-[#737B8C] mt-[2px]">{b.desc}</p>
                </div>
                <span className="text-[13px] font-bold text-[#0E8FCF]">{b.amount}</span>
              </div>
              {b.status === 'active' ? (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-[#737B8C]">Kalan Çevrim Tutarı</span>
                    <span className="text-[9px] font-semibold text-[#0E8FCF]">{b.remaining}</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-[#eef1f5] overflow-hidden">
                    <div className="h-full rounded-full bg-[#0E8FCF]" style={{ width: `${b.progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-dashed border-[#eef1f5]">
                  <p className="text-[11px] text-[#1a2332] font-medium">{b.amount} <span className="text-[#94a3b8] font-normal">({b.date})</span></p>
                  <p className={`text-[10px] font-semibold mt-[3px] ${b.result === 'Kullanılarak kapanmış' ? 'text-[#27ae60]' : 'text-[#e74c3c]'}`}>
                    {b.result} <span className="text-[#94a3b8] font-medium">({b.source})</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
