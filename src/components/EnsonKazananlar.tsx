'use client'

import { useState, useEffect, useRef } from 'react'

type Tab = 'casino' | 'spor'

const casinoPool = [
  { game: 'Elite ONE Blackjack',       image: '/canli-casino/1.jpg',  amount: 0 },
  { game: 'Sweet Rush Bonanza',        image: '/canli-casino/2.jpg',  amount: 130.70 },
  { game: '40 Zodiac Wheel Bell Lin.', image: '/canli-casino/3.jpg',  amount: 600.00 },
  { game: 'Lucky Streak 3',            image: '/canli-casino/4.jpg',  amount: 0 },
  { game: '40 Shining Crown Bell Li.', image: '/canli-casino/5.jpg',  amount: 480.00 },
  { game: 'Royal Bonanza',             image: '/canli-casino/6.jpg',  amount: 180.00 },
  { game: 'Great 27',                  image: '/canli-casino/7.jpg',  amount: 0 },
  { game: 'Flaming Hot Extreme Be.',   image: '/canli-casino/8.jpg',  amount: 980.00 },
  { game: 'Starlight Princess 1000',   image: '/canli-casino/9.png',  amount: 0 },
  { game: 'Zombie Outbreak',           image: '/canli-casino/10.jpg', amount: 0 },
  { game: 'Gates of Olympus',          image: '/canli-casino/11.png', amount: 2450.00 },
  { game: 'Sweet Bonanza',             image: '/canli-casino/1.jpg',  amount: 375.50 },
]

const sporPool = [
  { game: 'Beşiktaş - Galatasaray',   image: '/events/1.png', amount: 840.00 },
  { game: 'Barcelona - Real Madrid',  image: '/events/2.png', amount: 0 },
  { game: 'Man City - Arsenal',       image: '/events/3.png', amount: 1250.00 },
  { game: 'PSG - Bayern Münih',       image: '/events/4.png', amount: 0 },
  { game: 'Fenerbahçe - Trabzonspor', image: '/events/5.png', amount: 320.00 },
  { game: 'Liverpool - Chelsea',      image: '/events/6.png', amount: 0 },
  { game: 'Inter - Juventus',         image: '/events/7.png', amount: 560.00 },
  { game: 'Dortmund - Leipzig',       image: '/events/1.png', amount: 0 },
  { game: 'Ajax - PSV',               image: '/events/2.png', amount: 190.00 },
  { game: 'Porto - Benfica',          image: '/events/3.png', amount: 0 },
]

const avatars = ['🧑', '👤', '🎮', '🏆', '⚽', '🎲', '👑', '🃏', '🎯', '🌟']

function formatAmount(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

let uidCounter = 0
type Winner = { id: number; game: string; image: string; amount: number; avatar: string }

function buildList(pool: typeof casinoPool, count: number): Winner[] {
  return shuffle(pool).slice(0, count).map(item => ({
    ...item,
    id: uidCounter++,
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
  }))
}

function randomWinner(pool: typeof casinoPool): Winner {
  const item = pool[Math.floor(Math.random() * pool.length)]
  // randomise amount slightly to feel live
  const amount = item.amount > 0 ? +(item.amount * (0.8 + Math.random() * 0.6)).toFixed(2) : 0
  return { ...item, amount, id: uidCounter++, avatar: avatars[Math.floor(Math.random() * avatars.length)] }
}

export default function EnsonKazananlar() {
  const [tab, setTab] = useState<Tab>('casino')
  const [expanded, setExpanded] = useState(false)
  const [casinoList, setCasinoList] = useState<Winner[]>(() => buildList(casinoPool, 10))
  const [sporList, setSporList]   = useState<Winner[]>(() => buildList(sporPool, 10))
  const [newId, setNewId] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const list       = tab === 'casino' ? casinoList : sporList
  const setList    = tab === 'casino' ? setCasinoList : setSporList
  const pool       = tab === 'casino' ? casinoPool : sporPool
  const displayCount = expanded ? 10 : 5

  // Live stream: every 2.5s prepend a new winner, drop the last one
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const newItem = randomWinner(pool)
      setNewId(newItem.id)
      setList(prev => [newItem, ...prev.slice(0, 9)])
      setTimeout(() => setNewId(null), 500)
    }, 2500)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [tab])

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-[#e8ecf0]">
      {/* Header */}
      <div className="px-[14px] pt-[14px] pb-[10px] border-b border-[#e8ecf0]">
        <h3 className="text-[14px] font-bold text-[#1a2332] mb-[10px]">Enson Kazananlar</h3>

        {/* Tabs */}
        <div className="flex gap-[6px]">
          <button
            onClick={() => setTab('casino')}
            className="flex-1 py-[7px] rounded-xl text-[11px] font-bold transition-colors"
            style={tab === 'casino'
              ? { background: '#0E8FCF', color: '#fff' }
              : { background: '#f1f5f9', color: '#64748b' }}
          >
            Casino
          </button>
          <button
            onClick={() => setTab('spor')}
            className="flex-1 py-[7px] rounded-xl text-[11px] font-bold transition-colors"
            style={tab === 'spor'
              ? { background: '#0E8FCF', color: '#fff' }
              : { background: '#f1f5f9', color: '#64748b' }}
          >
            Spor Bahisleri
          </button>
        </div>
      </div>

      {/* Winner rows */}
      <div className="flex flex-col">
        {list.slice(0, displayCount).map((w, i) => (
          <div
            key={w.id}
            className={`flex items-center gap-[10px] px-[14px] py-[9px] overflow-hidden${newId === w.id ? ' animate-slide-down-in bg-[rgba(14,143,207,0.06)]' : i % 2 === 0 ? ' bg-[#fafbfc]' : ' bg-white'}${i < displayCount - 1 ? ' border-b border-[#f1f5f9]' : ''}`}
          >
            {/* Game icon */}
            <div className="w-[32px] h-[32px] rounded-lg overflow-hidden flex-shrink-0 bg-[#f1f5f9]">
              <img
                src={w.image}
                alt={w.game}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>

            {/* Game name */}
            <span className="flex-1 text-[11px] font-medium text-[#1a2332] truncate">{w.game}</span>

            {/* Amount */}
            <span
              className="text-[11px] font-bold tabular-nums flex-shrink-0"
              style={{ color: w.amount > 0 ? '#16a34a' : '#94a3b8' }}
            >
              {w.amount > 0 ? `+${formatAmount(w.amount)}` : formatAmount(w.amount)} TRY
            </span>

            {/* Avatar */}
            <div
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 text-[13px]"
              style={{ background: '#e0f2fe' }}
            >
              {w.avatar}
            </div>
          </div>
        ))}
      </div>

      {/* Daha Fazla Gör */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-[11px] text-[11px] font-semibold text-[#0E8FCF] hover:bg-[#f0f7ff] transition-colors border-t border-[#e8ecf0]"
        >
          Daha Fazla Gör
        </button>
      )}
    </div>
  )
}
