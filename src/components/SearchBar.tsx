export default function SearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Aramak..."
        className="w-full h-[44px] bg-white rounded-full pl-[20px] pr-[48px] text-[14px] text-text-primary placeholder:text-[#b0b5c5] outline-none border border-[#e8eaef] shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:border-[#c0c6d4] focus:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200"
      />

      {/* Search icon - right side */}
      <div className="absolute right-[20px] top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#b0b5c5"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </div>
    </div>
  )
}
