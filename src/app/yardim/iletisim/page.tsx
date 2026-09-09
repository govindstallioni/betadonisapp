'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function IletisimPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return
    setSent(true)
  }

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Bize Ulaşın</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 pb-4">
        {sent ? (
          <div className="flex flex-col items-center text-center pt-10">
            <span className="w-[60px] h-[60px] rounded-full bg-[#e8f7ef] flex items-center justify-center mb-4">
              <span className="w-[42px] h-[42px] rounded-full bg-[#27ae60] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
            </span>
            <p className="text-[15px] font-bold text-[#1a2332]">Mesajınız gönderildi</p>
            <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed">Ekibimiz en kısa sürede size dönüş yapacaktır.</p>
            <button onClick={() => router.push('/yardim')} className="mt-6 w-full h-[44px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold">
              Yardım ve Destek&apos;e Dön
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">Ad/Soyad</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad"
                className="w-full bg-white rounded-xl px-3 h-[44px] border border-[#e0e5ec] focus:border-[#0E8FCF] outline-none text-[13px] text-[#1a2332] placeholder-[#b0b8c4] transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">E-Posta</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta adresiniz"
                className="w-full bg-white rounded-xl px-3 h-[44px] border border-[#e0e5ec] focus:border-[#0E8FCF] outline-none text-[13px] text-[#1a2332] placeholder-[#b0b8c4] transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">Konu</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Mesaj konusu"
                className="w-full bg-white rounded-xl px-3 h-[44px] border border-[#e0e5ec] focus:border-[#0E8FCF] outline-none text-[13px] text-[#1a2332] placeholder-[#b0b8c4] transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">Mesaj</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mesajınızı yazın..." rows={5}
                className="w-full bg-white rounded-xl px-3 py-2.5 border border-[#e0e5ec] focus:border-[#0E8FCF] outline-none text-[13px] text-[#1a2332] placeholder-[#b0b8c4] resize-none transition-colors" />
            </div>
            <button type="submit" className="w-full mt-2 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors">
              Mesaj Gönder
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
