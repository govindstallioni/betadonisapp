'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from './NotificationsProvider'
import SlideUpBubble from './SlideUpBubble'

// Surfaces a freshly-pushed notification as a bottom-slide bubble
// (bildirimbalonu.PNG) rather than leaving it silently in the bell icon's
// list — the "push promotions to users" delivery surface. Tracks the
// highest notification id already shown so it only fires for NEW arrivals
// (via NotificationsProvider.addNotification), never the pre-seeded demo
// notifications already sitting there on a fresh install.
const LS_SEEN_ID = 'bta_notif_bubble_seen_id'

export default function NotificationBubble() {
  const { notifications } = useNotifications()
  const router = useRouter()
  const [shown, setShown] = useState<typeof notifications[number] | null>(null)

  useEffect(() => {
    if (notifications.length === 0) return
    const newest = notifications[0]
    let seenId = 0
    try { seenId = Number(localStorage.getItem(LS_SEEN_ID)) || 0 } catch {}

    if (seenId === 0) {
      // First load ever: baseline to the current newest without bubbling it.
      try { localStorage.setItem(LS_SEEN_ID, String(newest.id)) } catch {}
      return
    }
    if (newest.id > seenId) {
      setShown(newest)
      try { localStorage.setItem(LS_SEEN_ID, String(newest.id)) } catch {}
    }
  }, [notifications])

  const close = () => setShown(null)

  if (!shown) return null

  return (
    <SlideUpBubble onClose={close}>
      <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-[#d0d5dd] rounded-full" /></div>
      <div className="px-5 pt-2 pb-6">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#1a2332] leading-tight">{shown.title}</p>
            <p className="text-[11px] text-[#737B8C] mt-[4px] leading-relaxed">{shown.body}</p>
          </div>
        </div>
        <div className="flex gap-[10px] mt-5">
          <button onClick={close} className="flex-1 h-[42px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-bold">
            Kapat
          </button>
          <button
            onClick={() => { close(); router.push('/hesap/bildirimler') }}
            className="flex-1 h-[42px] rounded-full bg-[#0E8FCF] text-white text-[12px] font-bold"
          >
            Görüntüle
          </button>
        </div>
      </div>
    </SlideUpBubble>
  )
}
