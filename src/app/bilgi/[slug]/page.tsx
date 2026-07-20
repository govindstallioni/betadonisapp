'use client'

import { useParams } from 'next/navigation'
import { PageShell } from '@/components/settings/SettingsUI'

interface Section {
  heading?: string
  body: string
}

interface Doc {
  title: string
  intro: string
  sections: Section[]
}

const docs: Record<string, Doc> = {
  hakkinda: {
    title: 'Betadonis Hakkında',
    intro: 'Betadonis, spor bahisleri ve casino oyunlarını güvenli ve lisanslı bir ortamda bir araya getiren online eğlence platformudur.',
    sections: [
      { heading: 'Biz Kimiz', body: 'Yüksek oranlar, geniş etkinlik yelpazesi ve 7/24 müşteri desteği ile oyuncularımıza kesintisiz bir deneyim sunuyoruz.' },
      { heading: 'Lisans', body: 'Faaliyetlerimiz uluslararası oyun lisansı kapsamında yürütülmekte olup tüm işlemler denetime tabidir.' },
      { heading: 'Güvenlik', body: 'Kullanıcı verileri ve finansal işlemler uçtan uca şifreleme ile korunmaktadır.' },
    ],
  },
  sartlar: {
    title: 'Şartlar ve Koşullar',
    intro: 'Bu platformu kullanarak aşağıdaki şart ve koşulları kabul etmiş sayılırsınız.',
    sections: [
      { heading: 'Üyelik', body: 'Yalnızca 18 yaşını doldurmuş kişiler üye olabilir. Her kullanıcı yalnızca bir hesap açabilir.' },
      { heading: 'Bahis Kuralları', body: 'Kabul edilen bahisler, ilgili etkinliğin resmi sonucuna göre değerlendirilir. Hatalı oranlar geçersiz sayılabilir.' },
      { heading: 'Para Çekme', body: 'Para çekme talepleri, hesap doğrulaması tamamlandıktan sonra işleme alınır.' },
    ],
  },
  'sorumlu-oyun': {
    title: 'Sorumlu Oyun',
    intro: 'Oyun bir eğlence aracıdır, gelir kaynağı değildir. Kontrolü elden bırakmamak için sorumlu oyun ilkelerini benimsiyoruz.',
    sections: [
      { heading: '18+ Uyarısı', body: 'Kumar bağımlılık yapabilir. 18 yaşından küçüklerin oyun oynaması kesinlikle yasaktır.' },
      { heading: 'Limit Belirleme', body: 'Yatırım, kayıp ve oturum sürelerinize limit koyarak oyununuzu kontrol altında tutabilirsiniz.' },
      { heading: 'Yardım', body: 'Oyun alışkanlıklarınız konusunda endişeleniyorsanız hesabınıza mola verebilir veya kapatabilirsiniz.' },
    ],
  },
  'hesap-dogrulama': {
    title: 'Hesap Doğrulama',
    intro: 'Hesabınızın güvenliği ve para çekme işlemleriniz için kimlik doğrulaması gereklidir.',
    sections: [
      { heading: 'Gerekli Belgeler', body: 'Kimlik kartı veya pasaport, adres belgesi ve ödeme yöntemi kanıtı yüklemeniz gerekir.' },
      { heading: 'Süreç', body: 'Yüklenen belgeler genellikle 24 saat içinde incelenir ve sonuç size bildirilir.' },
      { heading: 'Neden Gerekli', body: 'Doğrulama, hesabınızı yetkisiz erişime karşı korur ve yasal yükümlülüklerimizi karşılar.' },
    ],
  },
  gizlilik: {
    title: 'Gizlilik Politikası',
    intro: 'Kişisel verilerinizin gizliliği bizim için önceliklidir. Bu politika verilerinizi nasıl işlediğimizi açıklar.',
    sections: [
      { heading: 'Toplanan Veriler', body: 'Yalnızca hizmeti sunmak için gerekli olan kimlik, iletişim ve işlem bilgileri toplanır.' },
      { heading: 'Kullanım', body: 'Verileriniz hesabınızı yönetmek, işlemleri gerçekleştirmek ve yasal gereklilikleri karşılamak için kullanılır.' },
      { heading: 'Paylaşım', body: 'Verileriniz yasal zorunluluk dışında üçüncü taraflarla paylaşılmaz.' },
    ],
  },
  vip: {
    title: 'VIP Statü',
    intro: 'Sadık oyuncularımıza özel ayrıcalıklar sunan VIP programımıza katılın.',
    sections: [
      { heading: 'Avantajlar', body: 'Kişisel hesap yöneticisi, daha yüksek çekim limitleri ve özel bonuslar VIP üyelerimizi bekliyor.' },
      { heading: 'Seviyeler', body: 'Bronz, Gümüş, Altın ve Platin seviyeleri ile oynadıkça ayrıcalıklarınız artar.' },
      { heading: 'Nasıl Katılırım', body: 'VIP statüsü, oyun aktivitenize göre davet usulü ile verilir.' },
    ],
  },
  bonuslar: {
    title: 'Bonuslar',
    intro: 'Betadonis, hem yeni hem de mevcut oyunculara zengin bonus fırsatları sunar.',
    sections: [
      { heading: 'Hoş Geldin Bonusu', body: 'İlk yatırımınıza özel yatırım bonusu ile bakiyenizi katlayın.' },
      { heading: 'Kayıp Bonusu', body: 'Belirli dönemlerde yaşadığınız kayıpların bir kısmı bonus olarak iade edilir.' },
      { heading: 'Çevrim Şartları', body: 'Her bonusun kendine ait çevrim şartları vardır; bonus kurallarını mutlaka inceleyin.' },
    ],
  },
  ortaklik: {
    title: 'Ortaklık',
    intro: 'Finansal ekosistemin ortağı olun ve yönlendirdiğiniz oyuncularla gelir elde edin.',
    sections: [
      { heading: 'Nasıl Çalışır', body: 'Size özel bağlantınız üzerinden kayıt olan oyuncuların aktivitesinden komisyon kazanırsınız.' },
      { heading: 'Kazanç', body: 'Gelir paylaşımı modeli ile pasif gelir elde edebilir, performansınıza göre oranlarınızı artırabilirsiniz.' },
      { heading: 'Başvuru', body: 'Ortaklık programına başvurmak için müşteri hizmetleri ile iletişime geçin.' },
    ],
  },
}

export default function BilgiPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const doc = docs[slug]

  if (!doc) {
    return (
      <PageShell title="Bilgi">
        <div className="pt-10 text-center text-[13px] text-[#737B8C]">Sayfa bulunamadı.</div>
      </PageShell>
    )
  }

  return (
    <PageShell title={doc.title}>
      <p className="text-[12px] text-[#4a5568] leading-relaxed pt-4">{doc.intro}</p>
      {doc.sections.map((s) => (
        <div key={s.heading || s.body} className="mt-5">
          {s.heading && <p className="text-[12px] font-bold text-[#0E8FCF] mb-1.5">{s.heading}</p>}
          <p className="text-[12px] text-[#4a5568] leading-relaxed">{s.body}</p>
        </div>
      ))}
      <p className="text-center text-[9px] text-[#b0b8c4] mt-8">© 2010-2026 BetAdonis. Tüm hakları saklıdır.</p>
    </PageShell>
  )
}
