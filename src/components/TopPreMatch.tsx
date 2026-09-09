'use client'

import { useEffect, useRef, useCallback } from 'react'
import SectionHeader from './SectionHeader'
import PreMatchCard from './PreMatchCard'
import { preMatches } from '@/data/prematchData'

export default function TopPreMatch() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isUserScrolling = useRef(false)

  const scrollToNext = useCallback(() => {
    const el = scrollRef.current
    if (!el || isUserScrolling.current) return

    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 10 : 0
    if (!cardWidth) return

    const maxScroll = el.scrollWidth - el.clientWidth
    const nextScroll = el.scrollLeft + cardWidth

    if (nextScroll >= maxScroll + 10) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      el.scrollTo({ left: nextScroll, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const start = () => {
      timerRef.current = setInterval(scrollToNext, 4000)
    }
    start()

    const el = scrollRef.current
    let touchTimeout: ReturnType<typeof setTimeout>

    const onTouchStart = () => {
      isUserScrolling.current = true
      if (timerRef.current) clearInterval(timerRef.current)
    }
    const onTouchEnd = () => {
      clearTimeout(touchTimeout)
      touchTimeout = setTimeout(() => {
        isUserScrolling.current = false
        if (timerRef.current) clearInterval(timerRef.current)
        start()
      }, 3000)
    }

    el?.addEventListener('touchstart', onTouchStart, { passive: true })
    el?.addEventListener('touchend', onTouchEnd, { passive: true })
    el?.addEventListener('mousedown', onTouchStart)
    el?.addEventListener('mouseup', onTouchEnd)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      clearTimeout(touchTimeout)
      el?.removeEventListener('touchstart', onTouchStart)
      el?.removeEventListener('touchend', onTouchEnd)
      el?.removeEventListener('mousedown', onTouchStart)
      el?.removeEventListener('mouseup', onTouchEnd)
    }
  }, [scrollToNext])

  return (
    <div>
      <SectionHeader title="En iyi Maç Öncesi" badge="Spor" showAll href="/prematch" count={preMatches.length} />
      <div ref={scrollRef} className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4 scroll-smooth">
        {preMatches.map((match) => (
          <PreMatchCard key={match.id} match={match} className="flex-shrink-0 w-[85%]" />
        ))}
      </div>
    </div>
  )
}
