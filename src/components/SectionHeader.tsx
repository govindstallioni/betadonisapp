interface SectionHeaderProps {
  title: string
  badge?: 'Sport' | 'Spor' | 'Casino' | 'Casino Oyunları' | 'Esports'
  showAll?: boolean
  count?: number
  gamesCount?: number
}

const badgeStyles = {
  Sport: { bg: '#e3f4eb', color: '#1a9d54' },
  Spor: { bg: '#e3f4eb', color: '#1a9d54' },
  Casino: { bg: '#ede9fe', color: '#7c3aed' },
  'Casino Oyunları': { bg: '#ede9fe', color: '#7c3aed' },
  Esports: { bg: '#fff3e0', color: '#e67e22' },
}

export default function SectionHeader({ title, badge, showAll, count, gamesCount }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-[12px]">
      <div className="flex items-center gap-[8px]">
        <h3 className="text-[15px] font-bold text-[#1a2332] leading-none">{title}</h3>
        {badge && (
          <span
            className="text-[9px] px-[8px] py-[3px] rounded-full font-bold leading-none uppercase tracking-wide"
            style={{
              backgroundColor: badgeStyles[badge].bg,
              color: badgeStyles[badge].color,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {showAll && (
        <button className="text-[11px] text-[#0E8FCF] font-semibold bg-white rounded-full px-[12px] py-[4px] hover:bg-[#f0f7ff] transition-colors flex items-center gap-[4px]">
          Tümü
          {count !== undefined && (
            <span className="text-[9px] bg-[#0E8FCF] text-white rounded-full px-[5px] py-[1px] leading-none font-bold">{count}</span>
          )}
        </button>
      )}
      {gamesCount && (
        <button className="text-[11px] text-[#0E8FCF] font-semibold hover:text-[#0a6fa0] transition-colors flex items-center gap-[2px]">
          {gamesCount} Oyun
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  )
}
