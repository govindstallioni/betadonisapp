'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QA { q: string; a: string }

// "Kayıt İşlemleri" content is verbatim from betadonis.com/tr/affiliates/about's
// real SSS widget. The other categories are written to match that tone/style —
// the real site's tab-switch content wasn't extractable in this session.
const categories: { label: string; items: QA[] }[] = [
  {
    label: 'Kayıt İşlemleri',
    items: [
      { q: 'Nasıl Betadonis hesabı açarım?', a: 'Betadonis.com hesabı açmak için şu yollardan birini izleyebilirsiniz: 1) Kayıt linkine tıklayabilirsiniz. 2) Ana sayfada sağ menüde ya da üst menüde yer alan "Hemen Üye Ol" butonunu tıklayabilirsiniz.\n\nİki şekilde de kayıt formuna yönlendirilirsiniz. Burada seçeceğiniz kullanıcı adı ve para birimi daha sonra değiştirilemez. Bilgilerinizi girmeden önce 18 yaşından büyük olduğunuzdan ve "Kurallar ve Şartlar"ı kabul ettiğinizden emin olunuz. Kullanıcı adı ve şifrenizle Betadonis.com hesabınıza hemen ulaşabilirsiniz.' },
      { q: 'Neden hesap açamıyorum?', a: 'Lütfen info@betadonis.com adresimizden veya Canlı Destek hattımızdan müşteri hizmetleri ile iletişime geçerek bilgi alınız.' },
      { q: 'Oyun oynamak için neden hesap açmam gerekli?', a: 'Betadonis.com da yer alan kuralları kabul ettiğinizi ve 18 yaşından büyük olduğunuzu göstermek için kayıt olmalısınız.' },
      { q: 'Neden kişisel bilgilerim gerekli?', a: 'Kimlik, yaş ve adres bilgilerinizin doğrulanması ve finansal işlemler için kişisel bilgilerinize ihtiyaç duyulmaktadır.' },
      { q: 'Kişisel bilgilerim güvende mi?', a: 'Betadonis.com kişisel bilgilerinizin güvenliği için en güncel veri şifreleme yazılımlarını kullanmaktadır.' },
      { q: 'Hesap açmak için para yatırmak zorunda mıyım?', a: 'Hayır, casinoda eğlence için oynayabilirsiniz.' },
      { q: 'Birden fazla hesabım olabilir mi?', a: 'Güvenliğiniz nedeniyle birden fazla hesap açamaz ve kullanamazsınız. Yeni bir hesap açılması durumunda eski hesabınızı kapattırmak için müşteri hizmetlerinden operatörümüze mesaj atarak destek alabilirsiniz.' },
      { q: 'Herhangi bir yaş sınırı var mı?', a: 'Betadonis.com da oynamak için 18 yaşından büyük olmalısınız.' },
    ],
  },
  {
    label: 'Hesabım',
    items: [
      { q: 'Profil bilgilerimi nasıl güncellerim?', a: 'Hesabım > Profil Bilgileri bölümünden e-posta, telefon ve adres bilgilerinizi güncelleyebilirsiniz. Kimlik bilgileriniz güvenlik nedeniyle değiştirilemez.' },
      { q: 'Şifremi unuttum, ne yapmalıyım?', a: 'Giriş ekranındaki "Şifrenizi mi unuttunuz?" bağlantısına tıklayarak şifre sıfırlama işlemini başlatabilirsiniz.' },
      { q: 'Hesabımı nasıl kapatabilirim?', a: 'Hesabım > Limit Belirleme bölümünden "Hesabımı Kapat" seçeneği ile geçici veya kalıcı olarak hesabınızı kapatabilirsiniz.' },
    ],
  },
  {
    label: 'Finans',
    items: [
      { q: 'Bakiyemi nereden görebilirim?', a: 'Ana sayfanın üst kısmında yer alan bakiye alanından anlık bakiyenizi görüntüleyebilirsiniz.' },
      { q: 'Bonus bakiyem ile gerçek bakiyem arasındaki fark nedir?', a: 'Bonus bakiyesi, çevrim şartlarını tamamladıktan sonra çekilebilir bakiyeye dönüşür.' },
      { q: 'Finansal işlem geçmişimi nereden takip ederim?', a: 'Hareketlerim sayfasından tüm para yatırma ve çekme işlemlerinizi inceleyebilirsiniz.' },
    ],
  },
  {
    label: 'Para Yatırma',
    items: [
      { q: 'Hangi yöntemlerle para yatırabilirim?', a: 'Banka havalesi, kredi kartı ve kripto para dahil çeşitli yöntemlerle anında para yatırabilirsiniz.' },
      { q: 'Minimum yatırım tutarı nedir?', a: 'Yatırım limitleri kullandığınız yönteme göre değişiklik gösterir, ilgili sayfada belirtilmektedir.' },
      { q: 'Yatırdığım para hesabıma ne zaman yansır?', a: 'Çoğu yöntemde yatırımlar anında hesabınıza yansır.' },
    ],
  },
  {
    label: 'Para Çekme',
    items: [
      { q: 'Para çekme talebim ne kadar sürede onaylanır?', a: 'Hesap doğrulamanız tamamlandıysa talepleriniz genellikle 24 saat içinde işleme alınır.' },
      { q: 'Neden para çekme talebim reddedildi?', a: 'Belge doğrulama eksikliği veya tamamlanmamış çevrim şartları talebinizi geciktirebilir, detaylar için destek ekibimizle iletişime geçin.' },
      { q: 'Para çekme limiti var mı?', a: 'Evet, hesap seviyenize göre günlük/haftalık çekim limitleri uygulanır.' },
    ],
  },
  {
    label: 'Güvenlik',
    items: [
      { q: 'Hesabımın güvenliğini nasıl artırabilirim?', a: 'Güçlü bir şifre kullanın ve mümkünse iki adımlı doğrulamayı (2FA) etkinleştirin.' },
      { q: 'Şüpheli bir giriş fark edersem ne yapmalıyım?', a: 'Hesabım > Giriş Geçmişi bölümünden son girişlerinizi kontrol edin ve şüpheli durumda şifrenizi hemen değiştirin.' },
      { q: 'Verilerim üçüncü taraflarla paylaşılıyor mu?', a: 'Hayır, kişisel verileriniz yasal zorunluluk dışında paylaşılmaz.' },
    ],
  },
  {
    label: 'Teknik Sorular',
    items: [
      { q: 'Uygulama neden yavaş açılıyor?', a: 'İnternet bağlantınızı kontrol edin ve uygulamayı güncel sürüme yükseltin.' },
      { q: 'Bir hata mesajı alıyorum, ne yapmalıyım?', a: 'Sayfayı yenileyin; sorun devam ederse ekran görüntüsü ile destek ekibimize ulaşın.' },
      { q: 'Uygulamayı hangi cihazlarda kullanabilirim?', a: 'Betadonis, güncel bir tarayıcısı olan tüm mobil ve masaüstü cihazlarda sorunsuz çalışır.' },
    ],
  },
  {
    label: 'Spor Bahisleri',
    items: [
      { q: 'Canlı bahis nasıl oynanır?', a: 'Canlı sekmesinden devam eden maçları seçip anlık oranlarla bahis yapabilirsiniz.' },
      { q: 'Sistem bahsi nedir?', a: 'Sistem bahsi, seçtiğiniz maçların farklı kombinasyonlarına ayrı ayrı bahis yapmanızı sağlar.' },
      { q: 'Bir bahsi iptal edebilir miyim?', a: 'Maç başlamadan önce kuponunuzdan seçimi kaldırabilirsiniz; onaylanmış bahisler iptal edilemez.' },
    ],
  },
  {
    label: 'Bonuslar',
    items: [
      { q: 'Bonus kodumu nereden kullanabilirim?', a: 'Bonuslar sayfasındaki "Bonus İçin Kod" alanına kodunuzu girerek bonusunuzu talep edebilirsiniz.' },
      { q: 'Çevrim şartı nedir?', a: 'Bonus tutarının çekilebilir hale gelmesi için tamamlanması gereken belirli bir bahis hacmidir.' },
      { q: 'Bonuslarımı nereden takip ederim?', a: 'Bonuslar sayfasındaki Aktif/Geçmiş Bonuslar sekmelerinden tüm bonus geçmişinizi görebilirsiniz.' },
    ],
  },
  {
    label: 'Casino',
    items: [
      { q: 'Casino oyunları adil mi?', a: 'Tüm oyunlar, bağımsız denetim kuruluşları tarafından test edilen rastgele sayı üreteçleri ile çalışır.' },
      { q: 'Canlı casino ile slot oyunları arasındaki fark nedir?', a: 'Canlı casino gerçek krupiyelerle oynanırken slotlar tamamen otomatik rastgele sonuçlarla çalışır.' },
      { q: 'Demo modda oyun oynayabilir miyim?', a: 'Bazı slot oyunları giriş yapmadan demo modda denenebilir.' },
    ],
  },
  {
    label: 'Ortaklık Programı',
    items: [
      { q: 'Ortaklık programına nasıl katılırım?', a: 'Ortaklık sayfasındaki "Bize Katılın" butonuna tıklayarak başvurunuzu oluşturabilirsiniz.' },
      { q: 'Komisyonlarım ne zaman ödenir?', a: 'Komisyonlar her ay hesap özetinize göre bir sonraki ayın başında hesabınıza yansıtılır.' },
      { q: 'Referans linkimi nereden bulabilirim?', a: 'Ortak panelinize giriş yaptıktan sonra size özel referans linkinizi görebilirsiniz.' },
    ],
  },
]

export default function SssPage() {
  const router = useRouter()
  const [activeCat, setActiveCat] = useState(0)
  const [openQ, setOpenQ] = useState<number | null>(null)

  const cat = categories[activeCat]

  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen">
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Sık Sorulan Sorular</h1>
          <div className="w-8" />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide mt-3 -mx-4 px-4 pb-1">
          {categories.map((c, i) => (
            <button key={c.label} onClick={() => { setActiveCat(i); setOpenQ(null) }}
              className={`flex-shrink-0 px-[14px] py-[7px] rounded-full text-[11px] font-semibold transition-all ${
                activeCat === i ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332] border border-[#e8ecf1]'
              }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-2.5">
        {cat.items.map((item, i) => {
          const open = openQ === i
          return (
            <div key={item.q} className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
              <button onClick={() => setOpenQ(open ? null : i)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="text-[12px] font-semibold text-[#1a2332] flex-1">{item.q}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round"
                  style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {open && (
                <p className="px-4 pb-3.5 text-[12px] text-[#4a5568] leading-relaxed whitespace-pre-line border-t border-[#f0f2f5] pt-3">
                  {item.a}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
