'use client'

import { countryName } from '@/data/countries'

// ── "Bölgeye Göre" region filter ────────────────────────────────────────────
// Built for live betting (task 15) and reused by pre-match (task 24), so the
// activation logic is identical on both screens: multi-select countries, a
// "Tümü" row that clears the selection, a count badge on the trigger, and the
// same shared flag set. Rows show the country NAME beside its flag.

export type FlagOption = { flag: string; count: number }

/** Derives the region options from a fixture list — one row per distinct flag. */
export function flagOptionsFrom<T extends { flag: string }>(items: T[]): FlagOption[] {
  return [...new Set(items.map((m) => m.flag))].map((flag) => ({
    flag,
    count: items.filter((m) => m.flag === flag).length,
  }))
}

/** Globe button that opens the sheet, badged with the active country count. */
export function RegionButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Bölgeye Göre"
      className={`relative flex-shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all ${count > 0 ? 'bg-[#0E8FCF] shadow-sm' : 'bg-white border border-[#e8ecf1]'}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={count > 0 ? '#fff' : '#1a2332'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#e74c3c] text-white text-[8px] font-bold flex items-center justify-center">{count}</span>
      )}
    </button>
  )
}

function Check({ on }: { on: boolean }) {
  return (
    <span className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center flex-shrink-0 ${on ? 'bg-[#0E8FCF] border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
      {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
    </span>
  )
}

export function RegionSheet({
  open,
  options,
  selected,
  onToggle,
  onClear,
  onClose,
}: {
  open: boolean
  options: FlagOption[]
  selected: Set<string>
  onToggle: (flag: string) => void
  onClear: () => void
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[430px] bg-white rounded-t-2xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-[14px] font-bold text-[#1a2332]">Bölgeye Göre</h2>
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <button onClick={onClear} className="text-[11px] font-semibold text-[#0E8FCF]">Temizle</button>
            )}
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-4 pb-2">
          {/* "Tümü" clears every country filter */}
          <button onClick={onClear} className="w-full flex items-center gap-3 py-[10px] border-b border-[#f0f2f5]">
            <span className="text-[20px] w-[24px] text-center flex-shrink-0">🌐</span>
            <span className="flex-1 text-left text-[12px] text-[#1a2332] font-medium">Tümü</span>
            <Check on={selected.size === 0} />
          </button>

          {options.map(({ flag, count }) => {
            const active = selected.has(flag)
            return (
              <button
                key={flag}
                onClick={() => onToggle(flag)}
                className="w-full flex items-center gap-3 py-[10px] border-b border-[#f0f2f5]"
              >
                <span className="text-[20px] w-[24px] text-center flex-shrink-0">{flag}</span>
                <span className="flex-1 text-left text-[12px] text-[#1a2332] font-medium">{countryName(flag)}</span>
                <span className="text-[10px] text-[#94a3b8]">{count}</span>
                <Check on={active} />
              </button>
            )
          })}
        </div>

        <div className="p-4">
          <button onClick={onClose} className="w-full bg-[#0E8FCF] text-white text-[13px] font-bold rounded-full py-[12px]">
            {selected.size > 0 ? `Göster (${selected.size})` : 'Tümünü Göster'}
          </button>
        </div>
      </div>
    </div>
  )
}
