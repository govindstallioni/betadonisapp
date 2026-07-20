'use client'

import { useState } from 'react'
import { PageShell } from '@/components/settings/SettingsUI'

interface Bonus {
  title: string
  amount: string
  desc: string
  progress: number // 0-100 wagering
  status: 'active' | 'past'
  result?: 'Tamamlandı' | 'Süresi Doldu'
}

const bonuses: Bonus[] = [
  { title: 'Hoş Geldin Bonusu', amount: '250.00 TRY', desc: 'İlk yatırım bonusu · %100', progress: 45, status: 'active' },
  { title: 'Spor Kayıp Bonusu', amount: '120.00 TRY', desc: 'Haftalık kayıp iadesi', progress: 10, status: 'active' },
  { title: 'Casino Free Spin', amount: '50 Spin', desc: 'Slot oyunları için', progress: 100, status: 'past', result: 'Tamamlandı' },
  { title: 'Doğum Günü Bonusu', amount: '75.00 TRY', desc: 'Kişiye özel', progress: 30, status: 'past', result: 'Süresi Doldu' },
]

export default function BonuslarPage() {
  const [tab, setTab] = useState<'active' | 'past'>('active')
  const list = bonuses.filter((b) => b.status === tab)

  return (
    <PageShell title="Bonuslar">
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
                    <span className="text-[9px] text-[#737B8C]">Çevrim İlerlemesi</span>
                    <span className="text-[9px] font-semibold text-[#0E8FCF]">%{b.progress}</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-[#eef1f5] overflow-hidden">
                    <div className="h-full rounded-full bg-[#0E8FCF]" style={{ width: `${b.progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${b.result === 'Tamamlandı' ? 'bg-[#27ae60]/10 text-[#27ae60]' : 'bg-[#e74c3c]/10 text-[#e74c3c]'}`}>
                    {b.result}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
