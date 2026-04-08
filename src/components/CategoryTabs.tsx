'use client'

import { useState } from 'react'

const tabs = [
  { label: 'TOP', id: 'top', icon: '/icons/top.svg' },
  { label: 'Sporlar', id: 'sporlar', icon: '/icons/sporlar.svg' },
  { label: 'Sanal Bahis', id: 'sanalbahis', icon: '/icons/digerleri.svg' },
  { label: 'Casino', id: 'casino', icon: '/icons/casino.svg' },
  { label: 'Slotlar', id: 'slotlar', icon: '/icons/slotlar.svg' },
  { label: 'Digerleri', id: 'digerleri', icon: '/icons/espor.svg' },
]

export default function CategoryTabs() {
  const [active, setActive] = useState('top')

  return (
    <div className="flex items-end justify-between overflow-x-auto scrollbar-hide px-[10px] py-[10px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className="flex flex-col items-center gap-[5px] min-w-[52px] transition-all duration-200"
        >
          <img
            src={tab.icon}
            alt={tab.label}
            className="w-[24px] h-[24px] object-contain"
          />
          <span
            className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
              tab.id === active ? 'text-[#0E8FCF]' : 'text-[#1a2332]'
            }`}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
