'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const categories = ['Ödeme İşlemleri', 'Bonuslar', 'Hesap Doğrulama', 'Bahis/Oyun Sonucu', 'Teknik Sorun', 'Diğer']

export default function SikayetPage() {
  const router = useRouter()
  const [category, setCategory] = useState(categories[0])
  const [description, setDescription] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    setSent(true)
  }

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Şikayet</h1>
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
            <p className="text-[15px] font-bold text-[#1a2332]">Şikayetiniz alındı</p>
            <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed">Şikayetiniz incelenerek en kısa sürede tarafınıza dönüş yapılacaktır.</p>
            <button onClick={() => router.push('/yardim')} className="mt-6 w-full h-[44px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold">
              Yardım ve Destek&apos;e Dön
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <p className="text-[12px] text-[#737B8C] leading-relaxed mb-1">
              Yaşadığınız sorunu bize bildirin, ekibimiz en kısa sürede inceleyecektir.
            </p>
            <div>
              <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">Şikayet Konusu</label>
              <div className="flex flex-wrap gap-[8px]">
                {categories.map((c) => (
                  <button key={c} type="button" onClick={() => setCategory(c)}
                    className={`px-[14px] py-[8px] rounded-full text-[12px] font-semibold transition-all ${category === c ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332] border border-[#e8ecf1]'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#737B8C] mb-1 block">Açıklama</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Yaşadığınız sorunu detaylı olarak açıklayın..." rows={6}
                className="w-full bg-white rounded-xl px-3 py-2.5 border border-[#e0e5ec] focus:border-[#0E8FCF] outline-none text-[13px] text-[#1a2332] placeholder-[#b0b8c4] resize-none transition-colors" />
            </div>
            <button type="submit" className="w-full mt-2 py-[12px] bg-[#e74c3c] text-white text-[13px] font-semibold rounded-xl hover:bg-[#c0392b] transition-colors">
              Şikayeti Gönder
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
