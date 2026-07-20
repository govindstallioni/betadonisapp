'use client'

import { useRouter } from 'next/navigation'

export function SettingsHeader({ title }: { title: string }) {
  const router = useRouter()
  return (
    <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-10">
      <div className="flex items-center">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">{title}</h1>
        <div className="w-8" />
      </div>
    </div>
  )
}

export function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`w-[40px] h-[22px] rounded-full flex items-center px-[2px] transition-colors flex-shrink-0 ${value ? 'bg-[#0E8FCF]' : 'bg-[#d0d5dd]'} ${disabled ? 'opacity-40' : ''}`}
    >
      <div className={`w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0'}`} />
    </button>
  )
}

export function SectionLabel({ label }: { label: string }) {
  return <p className="text-[12px] font-bold text-[#0E8FCF] px-1 pt-5 pb-2">{label}</p>
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">{children}</div>
}

export function Row({ title, desc, descColor, icon, onClick, right, last }: {
  title: string; desc?: string; descColor?: string; icon?: React.ReactNode; onClick?: () => void; right?: React.ReactNode; last?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3.5 ${onClick ? 'cursor-pointer hover:bg-[#f8fafc]' : ''} transition-colors ${!last ? 'border-b border-[#f0f2f5]' : ''}`}
    >
      {icon && (
        <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0 text-[#0E8FCF]">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a2332] leading-tight">{title}</p>
        {desc && <p className="text-[10px] mt-[2px] leading-tight" style={{ color: descColor || '#737B8C' }}>{desc}</p>}
      </div>
      {right ?? (onClick && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="m9 18 6-6-6-6" />
        </svg>
      ))}
    </div>
  )
}

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen pb-10">
      <SettingsHeader title={title} />
      <div className="px-4">{children}</div>
    </div>
  )
}
