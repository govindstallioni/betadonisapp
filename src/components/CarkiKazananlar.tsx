'use client'

import { useState, useEffect, useRef } from 'react'

type Tab = 'enson' | 'enyuksek'
type Winner = {
  uid: number
  displayId: string
  username: string
  amount: number
  avatarColor: string
  secondsAgo: number
}

let _uid = 0
const nextUid = () => ++_uid

const usernamePool = [
  'f***zi', 'a***n', 'm***t', 'h***e', 'b***k',
  's***r', 'y***z', 'e***s', 'o***n', 'g***l',
  'k***a', 'c***u', 't***i', 'r***m', 'd***p',
  'n***u', 'p***a', 'z***k', 'v***o', 'j***i',
]

const amountPool = [150, 300, 500, 750, 1200, 1850, 2400, 3100, 4200, 5300, 7500, 12000, 18500, 25000]

const avatarColors = [
  '#6366f1', '#0E8FCF', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
  '#f97316', '#06b6d4',
]

function randomEntry(secondsAgo = 0): Winner {
  const username = usernamePool[Math.floor(Math.random() * usernamePool.length)]
  return {
    uid: nextUid(),
    displayId: String(Math.floor(1000 + Math.random() * 8999)),
    username,
    amount: amountPool[Math.floor(Math.random() * amountPool.length)],
    avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
    secondsAgo,
  }
}

function buildList(count: number): Winner[] {
  return Array.from({ length: count }, (_, i) => randomEntry(i * 20))
}

function formatAmount(n: number) {
  return n.toLocaleString('tr-TR')
}

function timeLabel(s: number) {
  if (s < 5)  return 'şimdi'
  if (s < 60) return `${s} sn önce`
  const m = Math.floor(s / 60)
  return `${m} dk önce`
}

const rankMeta = [
  { emoji: '🥇', ring: '#FFD700', glow: 'rgba(255,215,0,0.5)' },
  { emoji: '🥈', ring: '#C0C0C0', glow: 'rgba(192,192,192,0.5)' },
  { emoji: '🥉', ring: '#CD7F32', glow: 'rgba(205,127,50,0.5)' },
]

function WheelSVG({ size, opacity = 1 }: { size: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <circle cx="12" cy="12" r="10" stroke="#0E8FCF" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="3"  fill="#0E8FCF"/>
      {[0, 45, 90, 135].map(d => (
        <line key={d} x1="12" y1="2" x2="12" y2="9"
          stroke="#0E8FCF" strokeWidth="1.6"
          transform={`rotate(${d} 12 12)`}/>
      ))}
    </svg>
  )
}

export default function CarkiKazananlar() {
  const [tab, setTab]             = useState<Tab>('enson')
  const [expanded, setExpanded]   = useState(false)
  const [ensonList, setEnsonList] = useState<Winner[]>(() => buildList(10))
  const [enYuksekList]            = useState<Winner[]>(() =>
    buildList(10).sort((a, b) => b.amount - a.amount)
  )
  const [flashId, setFlashId]     = useState<number | null>(null)
  const [totalToday]              = useState(() => 120 + Math.floor(Math.random() * 80))
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const displayCount = expanded ? 10 : 4
  const list = tab === 'enson' ? ensonList : enYuksekList

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setEnsonList(prev => prev.map(w => ({ ...w, secondsAgo: w.secondsAgo + 1 })))
    }, 1000)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [])

  useEffect(() => {
    if (tab !== 'enson') return
    const iv = setInterval(() => {
      const entry = randomEntry(0)
      setFlashId(entry.uid)
      setEnsonList(prev => [entry, ...prev.slice(0, 9)])
      setTimeout(() => setFlashId(null), 1100)
    }, 2500)
    return () => clearInterval(iv)
  }, [tab])

  return (
    <div className="rounded-2xl overflow-hidden border border-[#d1e8f7]"
      style={{ boxShadow: '0 6px 32px rgba(14,143,207,0.12), 0 1px 4px rgba(0,0,0,0.06)' }}>

      {/* ── Header ── */}
      <div className="relative px-[14px] pt-[14px] pb-[13px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#071428 0%,#0d2a5a 45%,#0E8FCF 100%)' }}>

        {/* Decorative spinning wheel */}
        <div className="absolute right-[-10px] top-[-10px] opacity-[0.08] animate-spin-slow pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="white"/>
            <circle cx="12" cy="12" r="3" fill="#071428"/>
            {[0,30,60,90,120,150].map(d => (
              <line key={d} x1="12" y1="2" x2="12" y2="7"
                stroke="#071428" strokeWidth="1.4"
                transform={`rotate(${d} 12 12)`}/>
            ))}
          </svg>
        </div>

        {/* Title + stat */}
        <div className="flex items-start justify-between mb-[12px]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}>
              <WheelSVG size={17} opacity={0.95}/>
            </div>
            <div>
              <p className="text-[14px] font-extrabold text-white leading-tight tracking-wide">
                Şans Çarkı
              </p>
              <p className="text-[10px] text-white/60 leading-none mt-[1px]">Günlük Kazananlar</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-[4px]">
            <div className="flex items-center gap-[5px] bg-white/10 rounded-full px-[8px] py-[3px]">
              <span className="w-[5px] h-[5px] rounded-full bg-[#4ade80] animate-pulse"/>
              <span className="text-[9px] font-bold text-[#4ade80] tracking-widest">CANLI</span>
            </div>
            <span className="text-[9px] text-white/50">
              <span className="text-white/80 font-bold">{totalToday}</span> kazananlar bugün
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-[5px] p-[3px] rounded-[12px]"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          {(['enson','enyuksek'] as Tab[]).map(t => (
            <button key={t}
              onClick={() => { setTab(t); setExpanded(false) }}
              className="flex-1 py-[8px] rounded-[10px] text-[11px] font-bold transition-all duration-250 leading-none"
              style={tab === t
                ? { background: '#fff', color: '#0d2a5a', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }
                : { background: 'transparent', color: 'rgba(255,255,255,0.6)' }}
            >
              {t === 'enson' ? 'Enson Kazananlar' : 'En Yüksek Kazananlar'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Column labels ── */}
      <div className="flex items-center gap-[10px] px-[12px] py-[6px] border-b border-[#e8f0fa] bg-[#f2f7fd]">
        <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest w-[28px] flex-shrink-0">#</span>
        <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest w-[38px] flex-shrink-0"/>
        <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest flex-1">Kullanıcı</span>
        <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest w-[56px] text-center flex-shrink-0">ID</span>
        <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest w-[82px] text-right flex-shrink-0">Kazanç</span>
      </div>

      {/* ── Rows ── */}
      <div className="flex flex-col bg-white divide-y divide-[#eef3fb]">
        {list.slice(0, displayCount).map((w, i) => {
          const isNew  = flashId === w.uid
          const isTop3 = tab === 'enyuksek' && i < 3
          const isBig  = w.amount >= 5000
          const rank   = isTop3 ? rankMeta[i] : null

          return (
            <div key={w.uid}
              className={`relative flex items-center gap-[10px] px-[12px] py-[11px] transition-all${isNew ? ' animate-winner-in animate-winner-flash' : i % 2 === 0 ? ' bg-[#fafcff]' : ' bg-white'}`}
            >
              {/* New-entry left bar */}
              {isNew && (
                <span className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full bg-[#0E8FCF]"/>
              )}

              {/* Rank / row number */}
              <div className="w-[28px] flex-shrink-0 flex flex-col items-center gap-[2px]">
                {rank ? (
                  <span className="text-[16px] leading-none">{rank.emoji}</span>
                ) : (
                  <span className="text-[10px] font-bold tabular-nums"
                    style={{ color: isNew ? '#0E8FCF' : '#cbd5e1' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
                {isNew && (
                  <span className="text-[7px] font-extrabold text-white bg-[#0E8FCF] rounded-full px-[4px] py-[1px] leading-none tracking-wide">
                    YENİ
                  </span>
                )}
              </div>

              {/* Avatar with optional ring */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[14px] font-extrabold text-white"
                  style={{
                    background: w.avatarColor,
                    boxShadow: rank
                      ? `0 0 0 2.5px ${rank.ring}, 0 0 10px ${rank.glow}`
                      : isNew ? '0 0 0 2px #0E8FCF' : 'none',
                  }}
                >
                  {w.username[0].toUpperCase()}
                </div>
                {isBig && (
                  <span className="absolute -top-[4px] -right-[4px] text-[10px] leading-none">🔥</span>
                )}
              </div>

              {/* Username */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#1a2332] leading-tight truncate">
                  {w.username}
                </p>
                {tab === 'enson' && (
                  <span className="text-[9px] text-[#94a3b8]">{timeLabel(w.secondsAgo)}</span>
                )}
              </div>

              {/* ID column */}
              <div className="w-[56px] flex-shrink-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#0E8FCF] tabular-nums">
                  #{w.displayId}
                </span>
              </div>

              {/* Amount */}
              <div className={`w-[82px] flex-shrink-0 flex flex-col items-end gap-[2px]${isNew ? ' animate-amount-pop' : ''}`}>
                <div
                  className="flex items-baseline gap-[2px] rounded-full px-[9px] py-[4px]"
                  style={{
                    background: isBig
                      ? 'linear-gradient(135deg,rgba(22,163,74,0.14),rgba(16,185,129,0.10))'
                      : 'rgba(22,163,74,0.07)',
                    border: isBig ? '1px solid rgba(22,163,74,0.2)' : '1px solid transparent',
                  }}
                >
                  <span className="text-[8px] font-extrabold text-[#16a34a]">₺</span>
                  <span className="text-[13px] font-extrabold text-[#15803d] tabular-nums leading-none">
                    {formatAmount(w.amount)}
                  </span>
                </div>
                {isBig && (
                  <span className="text-[8px] font-bold text-[#f59e0b] flex items-center gap-[2px]">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
                    </svg>
                    Büyük Kazanç
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Daha Fazla Gör ── */}
      {!expanded && (
        <button onClick={() => setExpanded(true)}
          className="w-full py-[12px] flex items-center justify-center gap-[6px] text-[11px] font-bold text-[#0E8FCF] bg-white hover:bg-[#f0f7ff] active:bg-[#e0f0ff] transition-colors border-t border-[#e3edf8]"
        >
          Daha Fazla Gör
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      )}
    </div>
  )
}
