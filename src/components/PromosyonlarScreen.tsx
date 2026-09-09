'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Promo = {
  title: string
  desc: string
  tag: string
  cat: 'spor' | 'casino' | 'genel'
  gradient: string
  icon: React.ReactNode
  rules: string[]
}

// ── Category icons — small circular glyphs matching this app's existing
// hand-rolled stroke-SVG idiom (DigerleriMenu.tsx/QuickFilters.tsx). ──
const iGift = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
    <path d="M12 8C12 5 10 3 8 3a2.5 2.5 0 0 0 0 5M12 8c0-3 2-5 4-5a2.5 2.5 0 0 1 0 5" />
  </svg>
)
const iBall = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5 8.4 10l1.4 4.2h4.4L15.6 10z" strokeLinejoin="round" />
    <path d="M12 3v4.5M12 20.5V16M4.5 8.5l3.9 1.5M19.5 8.5l-3.9 1.5M4.9 16l3.9-1.8M19.1 16l-3.9-1.8" strokeLinecap="round" />
  </svg>
)
const iChip = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.4" />
    <path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5" strokeLinecap="round" />
  </svg>
)
const iWheel = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" fill="white" />
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2" strokeLinecap="round" />
  </svg>
)

const promos: Promo[] = [
  {
    title: '%100 Hoş Geldin Bonusu', desc: 'İlk yatırımına 10.000 TL’ye kadar %100 bonus', tag: 'Yeni Üye', cat: 'genel',
    gradient: 'from-[#0E8FCF] to-[#2da8e6]', icon: iGift,
    rules: [
      'Bonus, sitemize ilk kez para yatıran üyelerimize özeldir.',
      'Bonustan faydalanabilmek için minimum yatırım tutarı 100 TL\'dir.',
      'Kazanılan bonus tutarının 5 katı çevrim şartını tamamlamanız gerekmektedir.',
      'Çevrim şartı tamamlanmadan yapılan para çekme talepleri bonus tutarını iptal eder.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    title: 'Spor %50 Kayıp Bonusu', desc: 'Haftalık spor kayıplarına %50 iade', tag: 'Spor', cat: 'spor',
    gradient: 'from-[#27ae60] to-[#2ecc71]', icon: iBall,
    rules: [
      'Bonus, her hafta pazartesi günü bir önceki haftanın net spor bahis kaybı üzerinden hesaplanır.',
      'Bonustan faydalanabilmek için haftalık minimum 500 TL bahis hacmi gereklidir.',
      'Kazanılan kayıp bonusu 3 kat çevrim şartına tabidir.',
      'Kayıp bonus tutarınızda herhangi bir üst sınır yoktur.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    title: 'Kombine Kazanç Katlama', desc: '5+ maçlı kombinelerde %75’e varan ek kazanç', tag: 'Spor', cat: 'spor',
    gradient: 'from-[#7c3aed] to-[#a855f7]', icon: iBall,
    rules: [
      'En az 5 maçlı kombine kuponlarda, seçim sayısına göre kazancınıza ek yüzde uygulanır.',
      '5 maçlı kombinelerde %25, 8+ maçlı kombinelerde %75\'e kadar ek kazanç sağlanır.',
      'Her seçimin oranı en az 1.30 olmalıdır.',
      'İptal edilen veya boş biten seçimler kombine ek kazancını geçersiz kılar.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    title: 'Casino %25 Çevrimsiz', desc: 'Slot yatırımlarına çevrimsiz %25 bonus', tag: 'Casino', cat: 'casino',
    gradient: 'from-[#c026d3] to-[#e11d97]', icon: iChip,
    rules: [
      'Tüm ödeme yatırım yöntemlerimizden yapacağınız yatırımlarınızda, anlık %25 çevrimsiz casino kayıp bonusundan faydalanabilirsiniz.',
      'Bonustan faydalanabilmek için minimum yatırım tutarı 100 TL\'dir.',
      'Bonus hakkını kazanabilmek için yatırdığınız tutarın tamamını 24 saat içerisinde kaybetmeniz gerekmektedir.',
      'Bakiyeniz 1 TL altına düştüğünde bonusunuz 30 dakika içerisinde hesabınıza otomatik olarak yüklenir.',
      'Bu bonusu çekebilmek için herhangi bir çevrim şartına gerek yoktur; bonusu nakit olarak anında çekebilirsiniz.',
      'Casino kayıp bonus kazancınızda herhangi bir çekim sınırı yoktur.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    title: 'Canlı Casino Cashback', desc: 'Her pazartesi %15 canlı casino iadesi', tag: 'Casino', cat: 'casino',
    gradient: 'from-[#e74c3c] to-[#f0743a]', icon: iChip,
    rules: [
      'Bir önceki haftanın net canlı casino kaybının %15\'i her pazartesi hesabınıza cashback olarak tanımlanır.',
      'Cashback için haftalık minimum 250 TL canlı casino bahis hacmi gereklidir.',
      'Kazanılan cashback tutarı 1 kat çevrim şartına tabidir.',
      'Cashback tutarı en fazla 5.000 TL ile sınırlıdır.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    title: 'Günlük Şans Çarkı', desc: 'Her gün ücretsiz çevir, nakit ödül kazan', tag: 'Genel', cat: 'genel',
    gradient: 'from-[#f59e0b] to-[#d97706]', icon: iWheel,
    rules: [
      'İlk para yatırma işlemini tamamlayan üyelerimiz Şans Çarkı hakkı kazanır.',
      'Çark, 14 gün boyunca günde 1 kez ücretsiz çevrilebilir.',
      'Kazanılan nakit ödüller anında hesabınıza yüklenir.',
      'Bir gün çark çevrilmezse o günkü hak yanmış sayılır, ertesi güne devretmez.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
]

const filters = [
  { id: 'all', label: 'Tümü' },
  { id: 'spor', label: 'Spor' },
  { id: 'casino', label: 'Casino' },
  { id: 'genel', label: 'Genel' },
] as const

export default function PromosyonlarScreen() {
  const router = useRouter()
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [openRules, setOpenRules] = useState<Promo | null>(null)

  const visible = promos.filter((p) => filter === 'all' || p.cat === filter)

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-10 flex items-center gap-2">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h1 className="flex-1 text-center text-[15px] font-bold text-[#1a2332] px-1">Promosyonlar</h1>
        <div className="w-8 h-8 flex-shrink-0" />
      </div>

      {/* Filter chips */}
      <div className="bg-white px-4 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-[#e8ecf1]">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              filter === f.id ? 'bg-[#0E8FCF] text-white' : 'bg-[#eef2f7] text-[#5b6472]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Promo cards */}
      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        {visible.map((p) => (
          <div key={p.title} className="rounded-2xl overflow-hidden border border-[#e8ecf1] bg-white">
            <div className={`bg-gradient-to-r ${p.gradient} px-4 py-5 relative`}>
              <span className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-[9px] font-bold px-2 py-[3px] rounded-full">{p.tag}</span>
              <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-2.5">{p.icon}</span>
              <p className="text-[16px] font-extrabold text-white leading-tight max-w-[75%] drop-shadow">{p.title}</p>
              <p className="text-[11px] text-white/85 mt-1.5 leading-snug max-w-[85%]">{p.desc}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="flex-1 text-[10px] text-[#737B8C]">Kampanya koşulları geçerlidir</span>
              <button onClick={() => setOpenRules(p)} className="px-3.5 py-1.5 rounded-full border border-[#0E8FCF] text-[#0E8FCF] text-[11px] font-bold active:scale-95 transition-transform flex-shrink-0">
                Daha fazla bilgi
              </button>
              <button onClick={() => router.push('/kupon/deposit')} className="px-4 py-1.5 rounded-full bg-[#0E8FCF] text-white text-[11px] font-bold active:scale-95 transition-transform flex-shrink-0">
                Para Yatır
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rules popup */}
      {openRules && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-6" onClick={() => setOpenRules(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[360px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#f0f2f5] flex-shrink-0">
              <p className="text-[14px] font-bold text-[#1a2332] pr-3">{openRules.title}</p>
              <button onClick={() => setOpenRules(null)} className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto flex flex-col gap-3">
              {openRules.rules.map((r, i) => (
                <p key={i} className="text-[12px] text-[#4a5568] leading-relaxed">
                  <span className="font-bold text-[#1a2332]">{i + 1}. </span>{r}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
