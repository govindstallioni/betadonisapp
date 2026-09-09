'use client'

// Shared bottom-sheet shell for bubbles that should genuinely slide up from
// the bottom edge (bildirimbalonu.PNG) — reused by WelcomeBubble and
// NotificationBubble. Anchored to the bottom (unlike WheelPromoModal's
// centered card) and driven by the existing `animate-slide-up` keyframe.
export default function SlideUpBubble({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/50 z-[92]" />
      <div className="fixed inset-x-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[93] flex items-end justify-center pointer-events-none">
        <div
          onClick={e => e.stopPropagation()}
          className="pointer-events-auto relative w-full bg-white rounded-t-2xl overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.25)] animate-slide-up"
        >
          {children}
        </div>
      </div>
    </>
  )
}
