'use client'

import { useState } from 'react'
import { PageShell } from '@/components/settings/SettingsUI'

type Session = { id: number; device: string; os: string; location: string; ip: string; time: string; current?: boolean }

const initialSessions: Session[] = [
  { id: 1, device: 'iPhone 15 Pro', os: 'iOS 18 · Safari', location: 'İstanbul, Türkiye', ip: '88.230.14.22', time: 'Şu an aktif', current: true },
  { id: 2, device: 'Chrome', os: 'Windows 11', location: 'Ankara, Türkiye', ip: '85.105.9.140', time: '2 saat önce' },
  { id: 3, device: 'Samsung Galaxy S23', os: 'Android 14', location: 'İzmir, Türkiye', ip: '78.180.33.7', time: 'Dün, 21:14' },
  { id: 4, device: 'Firefox', os: 'macOS', location: 'Bursa, Türkiye', ip: '95.70.128.55', time: '3 gün önce' },
]

function phone() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
}
function desktop() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
}

export default function LoginHistoryPage() {
  const [sessions, setSessions] = useState(initialSessions)

  const endSession = (id: number) => setSessions(prev => prev.filter(s => s.id !== id))
  const endOthers = () => setSessions(prev => prev.filter(s => s.current))

  const others = sessions.filter(s => !s.current).length

  return (
    <PageShell title="Oturum Açma Geçmişi">
      <p className="text-[11px] text-[#737B8C] px-1 pt-4 pb-2">
        Hesabınıza bağlı cihazlar. Tanımadığınız bir oturumu hemen kapatın.
      </p>

      <div className="flex flex-col gap-2.5 mt-1">
        {sessions.map(s => {
          const isMobile = /iPhone|Galaxy|Android/.test(s.device)
          return (
            <div key={s.id} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
                  {isMobile ? phone() : desktop()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-semibold text-[#1a2332] truncate">{s.device}</p>
                    {s.current && <span className="text-[8px] font-bold text-white bg-[#27ae60] rounded px-[5px] py-[1px] leading-none flex-shrink-0">BU CİHAZ</span>}
                  </div>
                  <p className="text-[10px] text-[#737B8C] mt-0.5">{s.os}</p>
                </div>
                {!s.current && (
                  <button onClick={() => endSession(s.id)} className="text-[11px] font-semibold text-[#e74c3c] flex-shrink-0">Kapat</button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 pl-12 text-[10px] text-[#737B8C]">
                <span>📍 {s.location}</span>
                <span>· {s.ip}</span>
                <span className="ml-auto">{s.time}</span>
              </div>
            </div>
          )
        })}
      </div>

      {others > 0 && (
        <button onClick={endOthers} className="w-full mt-4 py-[12px] bg-white border border-[#e74c3c]/40 text-[#e74c3c] text-[13px] font-semibold rounded-xl hover:bg-[#fde8e8] transition-colors">
          Diğer Tüm Oturumları Kapat ({others})
        </button>
      )}
    </PageShell>
  )
}
