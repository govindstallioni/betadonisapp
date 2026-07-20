'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Each tab navigates to its section route.
const tabs = [
  { label: 'TREND', id: 'top', icon: '/icons/top.svg', href: '/' },
  { label: 'Sporlar', id: 'sporlar', icon: '/icons/sporlar.svg', href: '/?view=sports' },
  { label: 'Sanal Bahis', id: 'sanalbahis', icon: '/icons/vr-glasses-blue.svg', href: '/sanal-bahis' },
  { label: 'Canlı Casino', id: 'casino', icon: '/icons/casino.svg', href: '/live-casino' },
  { label: 'Slotlar', id: 'slotlar', icon: '/icons/slotlar.svg', href: '/slots' },
  { label: 'Diğerleri', id: 'digerleri', icon: '/icons/digerleri.svg', href: '/digerleri' },
]

export default function CategoryTabs() {
  const [active, setActive] = useState('top')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Keep the highlighted tab in sync with the URL (e.g. /?view=sports → Sporlar).
  useEffect(() => {
    setActive(searchParams.get('view') === 'sports' ? 'sporlar' : 'top')
  }, [searchParams])

  const handleClick = (tab: typeof tabs[number]) => {
    setActive(tab.id)
    router.push(tab.href)
  }

  return (
    <div className="flex items-end justify-between overflow-x-auto scrollbar-hide px-[10px] py-[10px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab)}
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
