'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface AppNotification {
  id: number
  title: string
  body: string
  date: string
  unread: boolean
}

interface NotificationsContextValue {
  notifications: AppNotification[]
  unreadCount: number
  markRead: (id: number) => void
  // Extensibility point for whenever a real backend push arrives — prepends
  // a new unread notification (mirrors MessagesProvider.send's shape).
  addNotification: (title: string, body: string) => void
}

const initialNotifications: AppNotification[] = [
  { id: 1, title: 'Bonus hesabınıza yüklendi', body: '%100 özel kayıp bonusunuz hesabınıza tanımlandı.', date: '14.07.2026', unread: true },
  { id: 2, title: 'Yeni promosyon: Cuma Gün Bonusu', body: 'Bu Cuma yaptığınız yatırımlara özel bonus kazanın.', date: '12.07.2026', unread: true },
  { id: 3, title: 'Belgeleriniz onaylandı', body: 'Hesap doğrulama belgeleriniz başarıyla incelendi.', date: '10.07.2026', unread: false },
]

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: initialNotifications,
  unreadCount: 0,
  markRead: () => {},
  addNotification: () => {},
})

export function useNotifications() {
  return useContext(NotificationsContext)
}

const STORAGE_KEY = 'bta_notifications'

export default function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setNotifications(parsed)
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch {}
  }, [notifications, loaded])

  const markRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)))
  }, [])

  const addNotification = useCallback((title: string, body: string) => {
    setNotifications(prev => {
      const nextId = (prev.reduce((max, n) => Math.max(max, n.id), 0)) + 1
      const date = new Date()
      const d = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
      return [{ id: nextId, title, body, date: d, unread: true }, ...prev]
    })
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markRead, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}
