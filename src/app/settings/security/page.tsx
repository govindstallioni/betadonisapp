'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell, Card, Row, SectionLabel, Toggle } from '@/components/settings/SettingsUI'

const ic = {
  lock: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" /></svg>,
  key: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>,
  finger: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11c0 3-1 5-1 5" /><path d="M8 11a4 4 0 0 1 8 0c0 4-2 7-2 7" /><path d="M5 11a7 7 0 0 1 14 0c0 1.5-.3 3-.6 4" /></svg>,
  shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>,
}

export default function SecuritySettingsPage() {
  const router = useRouter()
  const [loginAlert, setLoginAlert] = useState(true)
  const [hideBalance, setHideBalance] = useState(false)
  const [autoLogout, setAutoLogout] = useState(true)
  const [suspicious, setSuspicious] = useState(true)

  return (
    <PageShell title="Güvenlik Ayarları">
      <SectionLabel label="Giriş Güvenliği" />
      <Card>
        <Row icon={ic.key} title="Şifre Değiştir" desc="Hesap şifrenizi güncelleyin" onClick={() => router.push('/settings/pin')} />
        <Row icon={ic.lock} title="Pin Kodu & Biyometri" desc="Uygulama kilidi" onClick={() => router.push('/settings/pin')} />
        <Row icon={ic.shield} title="İki Adımlı Doğrulama" desc="Etkinleştirilmedi" descColor="#e74c3c" onClick={() => router.push('/settings/2fa')} last />
      </Card>

      <SectionLabel label="Uyarılar" />
      <Card>
        <Row icon={ic.finger} title="Girişte bildirim al" desc="Yeni cihaz girişlerinde uyar" right={<Toggle value={loginAlert} onChange={setLoginAlert} />} />
        <Row icon={ic.shield} title="Şüpheli aktivite uyarıları" right={<Toggle value={suspicious} onChange={setSuspicious} />} />
        <Row icon={ic.lock} title="Bakiyeyi gizle" desc="Tutarları noktalarla göster" right={<Toggle value={hideBalance} onChange={setHideBalance} />} last />
      </Card>

      <SectionLabel label="Oturum" />
      <Card>
        <Row icon={ic.finger} title="Hareketsizlikte otomatik çıkış" desc="15 dk sonra oturumu kapat" right={<Toggle value={autoLogout} onChange={setAutoLogout} />} />
        <Row icon={ic.shield} title="Oturum Açma Geçmişi" desc="Cihaz ve konumları görüntüle" onClick={() => router.push('/settings/login-history')} last />
      </Card>
    </PageShell>
  )
}
