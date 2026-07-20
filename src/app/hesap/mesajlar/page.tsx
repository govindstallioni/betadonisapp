'use client'

import { useState } from 'react'
import { PageShell } from '@/components/settings/SettingsUI'

interface Message {
  id: number
  from: string
  subject: string
  preview: string
  date: string
  unread: boolean
}

const initialMessages: Message[] = [
  { id: 1, from: 'Betadonis', subject: 'Hoş geldiniz!', preview: 'Betadonis ailesine katıldığınız için teşekkürler. İlk yatırımınıza özel bonusunuz hesabınıza tanımlanmıştır.', date: '14.07.2026', unread: true },
  { id: 2, from: 'Bonus Ekibi', subject: 'Kayıp bonusunuz hazır', preview: 'Bu haftaki kayıp bonusunuz hesabınıza yüklendi. Detaylar için Bonuslar sayfasını ziyaret edin.', date: '13.07.2026', unread: false },
  { id: 3, from: 'Destek', subject: 'Belge doğrulama', preview: 'Yüklediğiniz belgeler başarıyla doğrulanmıştır. Artık para çekme işlemi yapabilirsiniz.', date: '11.07.2026', unread: false },
]

export default function MesajlarPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [open, setOpen] = useState<Message | null>(null)
  const [compose, setCompose] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  const openMessage = (m: Message) => {
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, unread: false } : x)))
    setOpen(m)
  }

  const send = () => {
    setSent(true)
    setSubject(''); setBody('')
    setTimeout(() => { setSent(false); setCompose(false) }, 1500)
  }

  return (
    <PageShell title="Mesajlar">
      <div className="flex flex-col gap-2.5 mt-4">
        {messages.map((m) => (
          <button
            key={m.id}
            onClick={() => openMessage(m)}
            className="flex items-start gap-3 bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 text-left hover:shadow-sm transition-shadow"
          >
            <div className="w-9 h-9 rounded-full bg-[#edf5ff] flex items-center justify-center flex-shrink-0 text-[#0E8FCF] relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
              {m.unread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#e74c3c] border-2 border-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-[12px] ${m.unread ? 'font-bold' : 'font-semibold'} text-[#1a2332] truncate`}>{m.subject}</p>
                <span className="text-[9px] text-[#b0b8c4] flex-shrink-0 ml-2">{m.date}</span>
              </div>
              <p className="text-[10px] text-[#737B8C] mt-[2px] line-clamp-2">{m.preview}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => setCompose(true)}
        className="w-full mt-5 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Yeni Mesaj
      </button>

      {/* Read modal */}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50" onClick={() => setOpen(null)}>
          <div className="bg-white rounded-t-2xl w-full max-w-[430px] p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-[#737B8C]">{open.from} · {open.date}</p>
              <button onClick={() => setOpen(null)} className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <p className="text-[15px] font-bold text-[#1a2332]">{open.subject}</p>
            <p className="text-[12px] text-[#4a5568] leading-relaxed mt-2">{open.preview}</p>
          </div>
        </div>
      )}

      {/* Compose modal */}
      {compose && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50" onClick={() => setCompose(false)}>
          <div className="bg-white rounded-t-2xl w-full max-w-[430px] p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-bold text-[#1a2332]">Yeni Mesaj</p>
              <button onClick={() => setCompose(false)} className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Konu"
              className="w-full text-[13px] text-[#1a2332] bg-[#f5f7fa] rounded-xl px-3 h-[44px] border border-[#e0e5ec] outline-none placeholder-[#b0b8c4] mb-3"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Mesajınızı yazın..."
              rows={4}
              className="w-full text-[13px] text-[#1a2332] bg-[#f5f7fa] rounded-xl px-3 py-2.5 border border-[#e0e5ec] outline-none placeholder-[#b0b8c4] resize-none"
            />
            <button
              onClick={send}
              disabled={!subject || !body}
              className="w-full mt-3 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl disabled:opacity-40 transition-opacity"
            >
              {sent ? 'Gönderildi ✓' : 'Gönder'}
            </button>
          </div>
        </div>
      )}
    </PageShell>
  )
}
