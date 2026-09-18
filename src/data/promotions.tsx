// ── Promotions ──────────────────────────────────────────────────────────────
// Shared by the Promosyonlar page and the home PromoBanners row, which links
// each bonus tile to /promosyonlar?promo=<id> (work3 task 9).

export type Promo = {
  /** URL id: /promosyonlar?promo=<id> scrolls to this card and opens its rules. */
  id: string
  title: string
  desc: string
  tag: string
  cat: 'spor' | 'casino' | 'genel'
  gradient: string
  icon: React.ReactNode
  rules: string[]
  /** Banner art (same file as the home PromoBanners tile), shown behind the title. */
  image?: string
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

export const promos: Promo[] = [
  // ── Home PromoBanners bonuses (work3 task 9) — ids are linked from there ──
  {
    id: 'ozel-kayip-100', title: '%100 Özel Kayıp Bonusu', desc: 'Günlük spor kayıplarına %100 özel iade', tag: 'Spor', cat: 'spor',
    gradient: 'from-[#0E8FCF] to-[#2da8e6]', icon: iBall, image: '/promotions/01.png',
    rules: [
      'Bonus, gün içinde spor bahislerinde kaybedilen net tutarın %100’ü oranında tanımlanır.',
      'Bonustan faydalanabilmek için gün içinde minimum 250 TL yatırım yapılmış olmalıdır.',
      'Kayıp bonusu en fazla 2.500 TL olarak hesabınıza yüklenir.',
      'Bonus tutarı 5 kat çevrim şartına tabidir ve yalnızca spor bahislerinde kullanılabilir.',
      'Talep, kayıp oluştuktan sonra 24 saat içinde canlı destek üzerinden iletilmelidir.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    id: 'casino-kayip-20', title: '%20 Casino Kayıp Bonusu', desc: 'Casino kayıplarına anlık %20 iade', tag: 'Casino', cat: 'casino',
    gradient: 'from-[#c026d3] to-[#e11d97]', icon: iChip, image: '/promotions/02.png',
    rules: [
      'Casino ve canlı casino oyunlarında oluşan net kayıplarınıza %20 bonus tanımlanır.',
      'Bonustan faydalanabilmek için minimum yatırım tutarı 100 TL’dir.',
      'Bakiyeniz 1 TL altına düştüğünde bonus talebinizi canlı destek üzerinden iletebilirsiniz.',
      'Kayıp bonusu 1 kat çevrim şartına tabidir.',
      'Aynı yatırım için başka bir bonus alınmışsa kayıp bonusu tanımlanmaz.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    id: 'kripto-25', title: '%25 Kripto Bonusu', desc: 'Kripto para yatırımlarına ekstra %25 bonus', tag: 'Genel', cat: 'genel',
    gradient: 'from-[#f59e0b] to-[#d97706]', icon: iGift, image: '/promotions/03.png',
    rules: [
      'Kripto para (USDT, BTC, ETH, TRX) ile yapılan her yatırımda %25 bonus tanımlanır.',
      'Bonustan faydalanabilmek için minimum yatırım tutarı 500 TL karşılığıdır.',
      'Tek seferde kazanılabilecek maksimum bonus tutarı 5.000 TL’dir.',
      'Bonus tutarı 8 kat çevrim şartına tabidir; spor ve casino oyunlarında çevrilebilir.',
      'Kripto bonusu diğer yatırım bonuslarıyla birleştirilemez.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    id: 'cuma-gun', title: 'Cuma Gün Bonusu', desc: 'Her cuma yatırımına %50 ek bonus', tag: 'Genel', cat: 'genel',
    gradient: 'from-[#7c3aed] to-[#a855f7]', icon: iGift, image: '/promotions/04.png',
    rules: [
      'Bonus, yalnızca cuma günleri 00:00 - 23:59 arasında yapılan ilk yatırıma tanımlanır.',
      'Bonustan faydalanabilmek için minimum yatırım tutarı 200 TL’dir.',
      'Yatırım tutarının %50’si, en fazla 3.000 TL olacak şekilde bonus olarak yüklenir.',
      'Bonus tutarı 6 kat çevrim şartına tabidir.',
      'Talep, yatırım sonrası bakiye kullanılmadan canlı destek üzerinden iletilmelidir.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    id: 'telegram', title: 'Telegram’a Abone Ol', desc: 'Kanala özel promosyon kodları ve freespinler', tag: 'Genel', cat: 'genel',
    gradient: 'from-[#26a5e4] to-[#0E8FCF]', icon: iGift, image: '/promotions/10.png',
    rules: [
      'Resmi Betadonis Telegram kanalına abone olan üyelerimiz kanala özel promosyon kodlarından faydalanabilir.',
      'Kodlar kanalda duyurulur ve belirtilen süre içinde kullanılmalıdır.',
      'Her kod üye başına yalnızca bir kez kullanılabilir.',
      'Kodla kazanılan bonus ve freespin kazançları 3 kat çevrim şartına tabidir.',
      'Betadonis, herhangi bir üye hakkında şüpheli bir durum oluştuğunda promosyona katılımını veya uygunluğunu reddetme hakkına sahiptir.',
    ],
  },
  {
    id: 'hosgeldin-100', title: '%100 Hoş Geldin Bonusu', desc: 'İlk yatırımına 10.000 TL’ye kadar %100 bonus', tag: 'Yeni Üye', cat: 'genel',
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
    id: 'spor-kayip-50', title: 'Spor %50 Kayıp Bonusu', desc: 'Haftalık spor kayıplarına %50 iade', tag: 'Spor', cat: 'spor',
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
    id: 'kombine-katlama', title: 'Kombine Kazanç Katlama', desc: '5+ maçlı kombinelerde %75’e varan ek kazanç', tag: 'Spor', cat: 'spor',
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
    id: 'casino-25-cevrimsiz', title: 'Casino %25 Çevrimsiz', desc: 'Slot yatırımlarına çevrimsiz %25 bonus', tag: 'Casino', cat: 'casino',
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
    id: 'canli-casino-cashback', title: 'Canlı Casino Cashback', desc: 'Her pazartesi %15 canlı casino iadesi', tag: 'Casino', cat: 'casino',
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
    id: 'sans-carki', title: 'Günlük Şans Çarkı', desc: 'Her gün ücretsiz çevir, nakit ödül kazan', tag: 'Genel', cat: 'genel',
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
