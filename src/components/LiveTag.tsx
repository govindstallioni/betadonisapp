// Live-match indicator — red "CANLI" pill with a play/live glyph and a pulsing
// dot. Sits next to the notification (bell) and favorite (star) icons on match
// card headers, matching the betadonis live indicator.
export default function LiveTag() {
  return (
    <div className="flex items-center gap-[3px] bg-[#fde8e8] rounded-full px-[5px] py-[2px] flex-shrink-0">
      <span className="w-[5px] h-[5px] rounded-full bg-[#e74c3c] animate-pulse-dot" />
      <svg width="8" height="8" viewBox="0 0 24 24" fill="#e74c3c">
        <path d="M8 5v14l11-7z" />
      </svg>
      <span className="text-[8px] text-[#e74c3c] font-bold tracking-wide">CANLI</span>
    </div>
  )
}
