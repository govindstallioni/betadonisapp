'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const days = Array.from({ length: 31 }, (_, i) => i + 1)
const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const years = Array.from({ length: 60 }, (_, i) => 2008 - i)

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div className="mt-2.5">
      <div className="bg-white rounded-xl px-3 py-[2px] border border-[#e8ecf1] focus-within:border-[#0E8FCF] focus-within:shadow-[0_0_0_3px_rgba(14,143,207,0.1)] transition-all">
        <span className="text-[9px] text-[#737B8C] font-medium block pt-[6px]">{label} *</span>
        <input type={type} placeholder={placeholder} className="w-full text-[12px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4] pb-[6px]" />
      </div>
    </div>
  )
}

function StaticDropdown({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full flex items-center bg-white rounded-xl px-3 py-[2px] mt-2.5 border border-[#e8ecf1]">
      <div className="flex-1 py-[6px]">
        <span className="text-[9px] text-[#0E8FCF] font-medium block">{label} *</span>
        <span className="text-[12px] text-[#1a2332] font-medium">{value}</span>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
    </div>
  )
}

export default function OrtaklikRegisterScreen() {
  const router = useRouter()
  const [title, setTitle] = useState<'Bay' | 'Bayan'>('Bay')
  const [submitted, setSubmitted] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col items-center justify-center px-8 text-center">
        <span className="w-[60px] h-[60px] rounded-full bg-[#e8f7ef] flex items-center justify-center mb-4">
          <span className="w-[42px] h-[42px] rounded-full bg-[#27ae60] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
        </span>
        <p className="text-[15px] font-bold text-[#1a2332]">Başvurunuz alındı</p>
        <p className="text-[12px] text-[#737B8C] mt-2 leading-relaxed">Ortaklık başvurunuz incelendikten sonra sizinle iletişime geçilecektir.</p>
        <Link href="/ortaklik" className="mt-6 w-full h-[44px] rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold flex items-center justify-center">
          Ortaklık Sayfasına Dön
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative flex flex-col">
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Ortak Ol</h1>
          <div className="w-8" />
        </div>
      </div>

      <form onSubmit={submit} className="flex-1 px-5 pt-4 pb-6 overflow-y-auto">
        <p className="text-[12px] text-[#737B8C] leading-relaxed mb-3">Hesabınızı oluşturun</p>

        {/* Ünvan */}
        <div className="flex gap-[10px]">
          {(['Bay', 'Bayan'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTitle(t)}
              className={`flex-1 h-[38px] rounded-xl text-[12px] font-semibold border transition-colors ${title === t ? 'bg-[#0E8FCF] border-[#0E8FCF] text-white' : 'bg-white border-[#e8ecf1] text-[#1a2332]'}`}>
              {t}
            </button>
          ))}
        </div>

        <Field label="Ad" placeholder="Adınız" />
        <Field label="Soyad" placeholder="Soyadınız" />

        {/* Doğum Tarihi */}
        <div className="mt-2.5">
          <span className="text-[9px] text-[#737B8C] font-medium block mb-1">Doğum Tarihi *</span>
          <div className="flex gap-[8px]">
            {[{ label: 'Gün', items: days }, { label: 'Ay', items: months }, { label: 'Yıl', items: years }].map((f) => (
              <select key={f.label} defaultValue="" className="flex-1 min-w-0 bg-white rounded-xl px-2.5 py-[10px] border border-[#e8ecf1] text-[11px] text-[#1a2332] outline-none">
                <option value="" disabled>{f.label}</option>
                {f.items.map((it) => <option key={it} value={it}>{it}</option>)}
              </select>
            ))}
          </div>
        </div>

        <Field label="Adres" placeholder="Adresiniz" />
        <StaticDropdown label="Ülke" value="Türkiye" />
        <Field label="Şehir" placeholder="Şehriniz" />
        <Field label="Telefon" placeholder="+90 5xx xxx xx xx" type="tel" />
        <Field label="E-Posta" placeholder="E-posta adresiniz" type="email" />
        <Field label="Kullanıcı Adı" placeholder="Kullanıcı adınız" />
        <Field label="Şifre" placeholder="Şifreniz" type="password" />
        <p className="text-[10px] text-[#94a3b8] mt-1.5">Şifreniz büyük harf içermelidir; minimum uzunluğu 6 olmalıdır.</p>

        <button type="submit" className="w-full mt-5 py-[12px] bg-[#27ae60] text-white text-[13px] font-semibold rounded-xl hover:bg-[#219a52] transition-colors">
          Başvuruyu Gönder
        </button>

        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="text-[11px] text-[#737B8C]">Zaten ortak mısınız?</span>
          <Link href="/ortaklik/login" className="text-[11px] text-[#0E8FCF] font-semibold">Giriş Yap</Link>
        </div>
      </form>
    </div>
  )
}
