'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell, Toggle } from '@/components/settings/SettingsUI'

interface NotifEvent {
  id: number
  home: string
  away: string
  league: string
  time: string
  live: boolean
}

const initialEvents: NotifEvent[] = [
  { id: 1, home: 'Galatasaray', away: 'Fenerbahçe', league: 'Süper Lig', time: 'Bugün 21:45', live: true },
  { id: 2, home: 'Real Madrid', away: 'Barcelona', league: 'La Liga', time: 'Yarın 22:00', live: false },
  { id: 3, home: 'Man. City', away: 'Liverpool', league: 'Premier Lig', time: '16.07 20:00', live: false },
  { id: 4, home: 'Bayern', away: 'Dortmund', league: 'Bundesliga', time: '17.07 19:30', live: false },
]

export default function BildirimlerPage() {
  const router = useRouter()
  const [events, setEvents] = useState(initialEvents)
  const [on, setOn] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true })

  const toggle = (id: number, v: boolean) => setOn((prev) => ({ ...prev, [id]: v }))
  const active = events.filter((e) => on[e.id])

  return (
    <PageShell title="Bildirimler">
      <div className="bg-[#edf5ff] rounded-xl border border-[#0E8FCF]/20 px-3.5 py-3 mt-4 flex gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" className="flex-shrink-0 mt-0.5"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
        <p className="text-[11px] text-[#1a2332] leading-relaxed">Bildirimlerini açtığınız etkinlikleri buradan görün. Maç başında ve gol anlarında haberdar olun.</p>
      </div>

      <div className="flex items-center justify-between px-1 pt-5 pb-2">
        <p className="text-[12px] font-bold text-[#0E8FCF]">Takip Edilen Etkinlikler ({active.length})</p>
        <button onClick={() => router.push('/settings/notifications')} className="text-[11px] text-[#0E8FCF] font-semibold">Ayarlar</button>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center pt-14 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="1.4"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          <p className="text-[13px] font-semibold text-[#1a2332] mt-3">Bildirim yok</p>
          <p className="text-[11px] text-[#737B8C] mt-1">Henüz bir etkinlik için bildirim açmadınız.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {events.map((e) => (
            <div key={e.id} className="flex items-center gap-3 bg-white rounded-xl border border-[#e8ecf1] px-3 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[12px] font-semibold text-[#1a2332] truncate">{e.home} - {e.away}</p>
                  {e.live && <span className="text-[8px] font-bold text-white bg-[#e74c3c] rounded px-1 py-[1px] flex-shrink-0">CANLI</span>}
                </div>
                <p className="text-[9px] text-[#737B8C] mt-[2px]">{e.league} · {e.time}</p>
              </div>
              <Toggle value={!!on[e.id]} onChange={(v) => toggle(e.id, v)} />
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
