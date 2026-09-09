'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fmtDateTime } from '@/data/coupons'

export interface Message {
  id: number
  from: string
  subject: string
  preview: string
  date: string
  unread: boolean
  folder: 'inbox' | 'sent'
}

interface MessagesContextValue {
  messages: Message[]
  unreadCount: number
  markRead: (id: number) => void
  send: (subject: string, body: string) => void
  remove: (id: number) => void
}

const initialMessages: Message[] = [
  { id: 1, from: 'Betadonis', subject: 'Hoş geldiniz!', preview: 'Betadonis ailesine katıldığınız için teşekkürler. İlk yatırımınıza özel bonusunuz hesabınıza tanımlanmıştır.', date: '14.07.2026 09:12', unread: true, folder: 'inbox' },
  { id: 2, from: 'Bonus Ekibi', subject: 'Kayıp bonusunuz hazır', preview: 'Bu haftaki kayıp bonusunuz hesabınıza yüklendi. Detaylar için Bonuslar sayfasını ziyaret edin.', date: '13.07.2026 18:47', unread: false, folder: 'inbox' },
  { id: 3, from: 'Destek', subject: 'Belge doğrulama', preview: 'Yüklediğiniz belgeler başarıyla doğrulanmıştır. Artık para çekme işlemi yapabilirsiniz.', date: '11.07.2026 11:05', unread: false, folder: 'inbox' },
  { id: 4, from: 'Destek', subject: 'Çekim işlemim ne zaman onaylanacak?', preview: 'Merhaba, dün oluşturduğum para çekim talebimin durumunu öğrenebilir miyim?', date: '10.07.2026 20:31', unread: false, folder: 'sent' },
]

const MessagesContext = createContext<MessagesContextValue>({
  messages: initialMessages,
  unreadCount: 0,
  markRead: () => {},
  send: () => {},
  remove: () => {},
})

export function useMessages() {
  return useContext(MessagesContext)
}

const STORAGE_KEY = 'bta_messages'

export default function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setMessages(parsed)
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages, loaded])

  const markRead = useCallback((id: number) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, unread: false } : m)))
  }, [])

  const send = useCallback((subject: string, body: string) => {
    setMessages(prev => [
      { id: Date.now(), from: 'Destek', subject, preview: body, date: fmtDateTime(Date.now()), unread: false, folder: 'sent' },
      ...prev,
    ])
  }, [])

  const remove = useCallback((id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  const unreadCount = messages.filter(m => m.folder === 'inbox' && m.unread).length

  return (
    <MessagesContext.Provider value={{ messages, unreadCount, markRead, send, remove }}>
      {children}
    </MessagesContext.Provider>
  )
}
