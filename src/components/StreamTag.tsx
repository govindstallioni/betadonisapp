// Pre-match broadcast indicator — neutral blue "İZLE" pill with a monitor/play
// glyph. Deliberately NOT LiveTag: pre-match fixtures haven't started, so they
// must never carry the red pulsing "CANLI" treatment. This only says the match
// will be watchable, which is what `hasStream` actually means on a pre-match.
export default function StreamTag() {
  return (
    <div className="flex items-center gap-[3px] bg-[#e6f3fb] rounded-full px-[5px] py-[2px] flex-shrink-0">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
      <span className="text-[8px] text-[#0E8FCF] font-bold tracking-wide">İZLE</span>
    </div>
  )
}
