'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type FavType = 'event' | 'league' | 'game'

export interface FavItem {
  type: FavType
  id: string
  title: string
  subtitle?: string
  image?: string
  emoji?: string
  href: string
  // Optional event display extras
  logo1?: string
  logo2?: string
  score1?: number
  score2?: number
  isLive?: boolean
}

interface FavContextValue {
  items: FavItem[]
  isFav: (type: FavType, id: string) => boolean
  toggle: (item: FavItem) => void
  remove: (type: FavType, id: string) => void
  clear: (type?: FavType) => void
  count: (type?: FavType) => number
}

const FavoritesContext = createContext<FavContextValue>({
  items: [],
  isFav: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
  count: () => 0,
})

export function useFavorites() {
  return useContext(FavoritesContext)
}

const STORAGE_KEY = 'bta_favorites'
const key = (type: FavType, id: string) => `${type}:${id}`

export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load once on mount (client-only → no hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
    setLoaded(true)
  }, [])

  // Persist on change (after the initial load)
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, loaded])

  const isFav = useCallback(
    (type: FavType, id: string) => items.some(i => i.type === type && i.id === id),
    [items]
  )

  const toggle = useCallback((item: FavItem) => {
    setItems(prev => {
      const exists = prev.some(i => key(i.type, i.id) === key(item.type, item.id))
      return exists
        ? prev.filter(i => key(i.type, i.id) !== key(item.type, item.id))
        : [item, ...prev]
    })
  }, [])

  const remove = useCallback((type: FavType, id: string) => {
    setItems(prev => prev.filter(i => key(i.type, i.id) !== key(type, id)))
  }, [])

  const clear = useCallback((type?: FavType) => {
    setItems(prev => (type ? prev.filter(i => i.type !== type) : []))
  }, [])

  const count = useCallback(
    (type?: FavType) => (type ? items.filter(i => i.type === type).length : items.length),
    [items]
  )

  return (
    <FavoritesContext.Provider value={{ items, isFav, toggle, remove, clear, count }}>
      {children}
    </FavoritesContext.Provider>
  )
}
