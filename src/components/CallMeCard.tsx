'use client'

import { useCallMe, CallMeSheet, CallMeLoginPrompt } from './CallMe'

// Home-page entry point for "Sizi Arayalım". Rendered inline between the home
// modules rather than as a floating button: the layout already mounts four
// bubble components, and LiveSupportWidget adds a third-party floating
// launcher of its own once its script URL is configured.
export default function CallMeCard() {
  const { formOpen, loginPrompt, launch, closeForm, closeLoginPrompt } = useCallMe()

  return (
    <>
      <button
        onClick={launch}
        className="w-full flex items-center gap-3 bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 text-left active:scale-[0.99] transition-transform"
      >
        <span className="w-11 h-11 rounded-full bg-[#0E8FCF] flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] font-bold text-[#1a2332]">Sizi Arayalım</span>
          <span className="block text-[10px] text-[#737B8C] mt-[2px] truncate">
            Numaranızı bırakın, müşteri temsilcimiz sizi arasın
          </span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {loginPrompt && <CallMeLoginPrompt onClose={closeLoginPrompt} />}
      {formOpen && <CallMeSheet onClose={closeForm} />}
    </>
  )
}
