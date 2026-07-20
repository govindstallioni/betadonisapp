'use client'

import { useFavorites, type FavItem } from './FavoritesProvider'

// Star that toggles an item in the global favorites store. Reflects the
// favorited state (filled) and stops card navigation when tapped.
export default function FavoriteStar({
  item,
  size = 14,
  inactiveStroke = '#737B8C',
  activeColor = '#0E8FCF',
  className = 'flex-shrink-0 flex items-center justify-center -m-1 p-1 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors',
}: {
  item: FavItem
  size?: number
  inactiveStroke?: string
  activeColor?: string
  className?: string
}) {
  const { isFav, toggle } = useFavorites()
  const active = isFav(item.type, item.id)

  // Rendered as a span (not a button element) because these stars live inside
  // Link cards; a button nested in an anchor is invalid HTML and breaks hydration.
  const activate = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(item)
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      aria-pressed={active}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') activate(e)
      }}
      className={`cursor-pointer ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? activeColor : 'none'}
        stroke={active ? activeColor : inactiveStroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </span>
  )
}
