'use client'

import { useRouter } from 'next/navigation'
import { PageShell, Card, Row, SectionLabel } from '@/components/settings/SettingsUI'
import { openLiveSupport, isLiveSupportConfigured } from '@/components/LiveSupportWidget'

const iFaq = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 4.9.75c0 1.66-2.4 1.9-2.4 3.5" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
const iChat = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></svg>
const iMail = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
const iFlag = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>

export default function YardimPage() {
  const router = useRouter()

  return (
    <PageShell title="Yardım ve Destek">
      <SectionLabel label="Destek Kanalları" />
      <Card>
        <Row icon={iFaq} title="SSS" desc="Sık sorulan sorular" onClick={() => router.push('/yardim/sss')} />
        <Row
          icon={iChat}
          title="Canlı Destek"
          desc="Destek ekibimizle anında sohbet edin"
          onClick={() => { if (!openLiveSupport()) router.push('/hesap/mesajlar') }}
        />
        <Row icon={iMail} title="Bize Ulaşın" desc="Mesaj gönderin, size dönüş yapalım" onClick={() => router.push('/yardim/iletisim')} />
        <Row icon={iFlag} title="Şikayet" desc="Yaşadığınız bir sorunu bildirin" onClick={() => router.push('/yardim/sikayet')} last />
      </Card>

      <p className="text-[10px] text-[#94a3b8] px-1 mt-3 leading-relaxed">
        {isLiveSupportConfigured()
          ? 'Canlı Destek anlık sohbet penceresini açar.'
          : 'Canlı Destek, mesaj kutunuz üzerinden çalışır — bir talep gönderdiğinizde destek ekibimiz en kısa sürede size dönüş yapar.'}
      </p>
    </PageShell>
  )
}
