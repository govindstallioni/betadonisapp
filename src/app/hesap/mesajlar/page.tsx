'use client'

import { useState } from 'react'
import { PageShell } from '@/components/settings/SettingsUI'
import { useMessages, type Message } from '@/components/MessagesProvider'

export default function MesajlarPage() {
  const { messages, markRead, send: sendMessage, remove } = useMessages()
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent'>('inbox')
  const [open, setOpen] = useState<Message | null>(null)
  const [compose, setCompose] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  const visibleMessages = messages.filter(m => m.folder === activeFolder)

  const openMessage = (m: Message) => {
    markRead(m.id)
    setOpen(m)
  }

  const deleteMessage = (id: number) => {
    remove(id)
    if (open?.id === id) setOpen(null)
  }

  const send = () => {
    sendMessage(subject, body)
    setSent(true)
    setSubject(''); setBody('')
    setTimeout(() => { setSent(false); setCompose(false); setActiveFolder('sent') }, 1500)
  }

  return (
    <PageShell title="Mesajlar">
      {/* Inbox / Sent tabs */}
      <div className="flex bg-[#f1f5f9] rounded-full p-[3px] border border-[#e8ecf1] mt-4">
        {(['inbox', 'sent'] as const).map(f => (
          <button key={f} type="button" onClick={() => setActiveFolder(f)}
            className={`flex-1 text-[12px] font-semibold py-[7px] rounded-full transition-all ${activeFolder === f ? 'bg-[#0E8FCF] text-white' : 'text-[#1a2332]'}`}>
            {f === 'inbox' ? 'Gelen Kutusu' : 'Gönderilenler'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 mt-4">
        {visibleMessages.map((m) => (
          <div
            key={m.id}
            role="button"
            tabIndex={0}
            onClick={() => openMessage(m)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openMessage(m) }}
            className="flex items-start gap-3 bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 text-left hover:shadow-sm transition-shadow cursor-pointer"
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
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); deleteMessage(m.id) }}
              aria-label="Mesajı sil"
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#e74c3c] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
        {visibleMessages.length === 0 && (
          <p className="text-[12px] text-[#94a3b8] text-center py-8">
            {activeFolder === 'inbox' ? 'Gelen kutunuzda mesaj yok.' : 'Henüz mesaj göndermediniz.'}
          </p>
        )}
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
              <p className="text-[10px] text-[#737B8C]">{open.folder === 'sent' ? 'Kime' : 'Kimden'}: {open.from} · {open.date}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => deleteMessage(open.id)} aria-label="Mesajı sil" className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#e74c3c] transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <button onClick={() => setOpen(null)} className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
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
