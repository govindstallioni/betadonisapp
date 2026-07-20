'use client'

import { useRouter } from 'next/navigation'

// Bell icon that opens the notification-settings page. Used inside match/bet
// cards that are themselves links, so it stops the card navigation.
export default function NotifyBell({
  size = 12,
  stroke = '#737B8C',
  className = 'flex items-center justify-center -m-1 p-1 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors',
}: {
  size?: number
  stroke?: string
  className?: string
}) {
  const router = useRouter()

  // Rendered as a span (not a button element) because the bell lives inside
  // Link cards; a button nested in an anchor is invalid HTML and breaks hydration.
  const activate = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/settings/notifications')
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="Bildirim ayarları"
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') activate(e)
      }}
      className={`cursor-pointer ${className}`}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </span>
  )
}
