'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell, Card, Row, SectionLabel, Toggle } from '@/components/settings/SettingsUI'
import { useSecurity, type SecurityKey, type ChecklistItem } from '@/components/SecurityProvider'

const ic = {
  lock: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" /></svg>,
  key: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>,
  finger: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11c0 3-1 5-1 5" /><path d="M8 11a4 4 0 0 1 8 0c0 4-2 7-2 7" /><path d="M5 11a7 7 0 0 1 14 0c0 1.5-.3 3-.6 4" /></svg>,
  shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>,
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 21c-.83 0-1.5-.67-1.5-1.5S11.17 19 12 19s1.5.67 1.5 1.5S12.83 22 12 22zm5-4H7V4h10v14z" /></svg>,
  question: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>,
  mail: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" /></svg>,
}

const ROW_ICONS: Record<SecurityKey, React.ReactNode> = {
  phone: ic.phone,
  password: ic.key,
  question: ic.question,
  twofa: ic.shield,
  profile: ic.user,
  blockEmail: ic.mail,
}

const OK = '#27ae60'
const BAD = '#e74c3c'

/** One checklist row: circular icon, title, coloured status line, and — for the
 *  items still missing — a plain-language line explaining why it matters. The
 *  reference only shows the status; the explanation is the client's ask that
 *  ours be "daha anlaşılabilir". */
function CheckRow({ item, onClick, right, last }: {
  item: ChecklistItem
  onClick?: () => void
  right?: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3.5 ${onClick ? 'cursor-pointer hover:bg-[#f8fafc]' : ''} transition-colors ${!last ? 'border-b border-[#f0f2f5]' : ''}`}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: item.done ? '#e8f5e9' : '#fdeceb', color: item.done ? OK : BAD }}
      >
        {ROW_ICONS[item.key]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a2332] leading-tight">{item.title}</p>
        <p className="flex items-center gap-1 mt-[3px]">
          <span
            className="w-[13px] h-[13px] rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: item.done ? OK : BAD }}
          >
            {item.done ? '✓' : '!'}
          </span>
          <span className="text-[10px] leading-tight truncate" style={{ color: item.done ? OK : BAD }}>
            {item.status}
          </span>
        </p>
        {!item.done && (
          <p className="text-[10px] text-[#737B8C] mt-[3px] leading-relaxed">{item.hint}</p>
        )}
      </div>

      {right ?? (onClick && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="m9 18 6-6-6-6" />
        </svg>
      ))}
    </div>
  )
}

export default function SecuritySettingsPage() {
  const router = useRouter()
  const { loaded, items, doneCount, total, secured, setBlockEmailLogin } = useSecurity()

  const [loginAlert, setLoginAlert] = useState(true)
  const [hideBalance, setHideBalance] = useState(false)
  const [autoLogout, setAutoLogout] = useState(true)
  const [suspicious, setSuspicious] = useState(true)

  const pct = total ? Math.round((doneCount / total) * 100) : 0

  return (
    <PageShell title="Güvenlik Ayarları">
      {/* Status card — text derives from the count, so it flips to the
          protected state once every item is satisfied. */}
      <div
        className="mt-4 rounded-xl border p-4 flex items-center gap-3"
        style={{
          backgroundColor: secured ? '#e8f5e9' : '#fdeceb',
          borderColor: secured ? 'rgba(39,174,96,0.3)' : 'rgba(231,76,60,0.3)',
        }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: secured ? OK : BAD }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            {secured
              ? <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              : <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />}
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#1a2332]">
            {secured ? 'Profil korunuyor' : 'Profil korunmuyor'}
          </p>
          <p className="text-[11px] text-[#737B8C] mt-0.5 leading-tight">
            {secured
              ? 'Tüm güvenlik öğeleri tamamlandı'
              : `Önemli güvenlik öğeleri eksik (${total - doneCount} adım kaldı)`}
          </p>
        </div>
      </div>

      <SectionLabel label="Güvenlik kontrol listesi" />
      <Card>
        {/* Progress header */}
        <div className="px-3.5 py-3.5 border-b border-[#f0f2f5]">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13px] font-bold text-[#1a2332]">Güvenliğinizi güçlendirin</p>
            <p className="text-[12px] font-bold text-[#0E8FCF] tabular-nums flex-shrink-0">{doneCount}/{total}</p>
          </div>
          <div className="h-[6px] rounded-full bg-[#eef1f5] overflow-hidden mt-2">
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{ width: `${pct}%`, backgroundColor: secured ? OK : '#0E8FCF' }}
            />
          </div>
          <p className="text-[10px] text-[#737B8C] mt-1.5 leading-relaxed">
            {secured
              ? 'Hesabınız için önerdiğimiz tüm adımları tamamladınız.'
              : 'Aşağıdaki eksik adımları tek tek tamamlayarak hesabınızı tam korumaya alın.'}
          </p>
        </div>

        {/* The six items. Until the provider has restored, the rows would show
            a misleading 0/6 — keep the card empty for that one frame. */}
        {loaded && items.map((item, i) => (
          <CheckRow
            key={item.key}
            item={item}
            last={i === items.length - 1}
            onClick={item.href ? () => router.push(item.href!) : undefined}
            right={item.toggle ? <Toggle value={item.done} onChange={setBlockEmailLogin} /> : undefined}
          />
        ))}
      </Card>

      <SectionLabel label="Giriş Güvenliği" />
      <Card>
        {/* Şifre ve 2FA satırları kontrol listesine taşındı — burada tekrar
            edilmiyor. */}
        <Row icon={ic.lock} title="Pin Kodu & Biyometri" desc="Uygulama kilidi" onClick={() => router.push('/settings/pin')} last />
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
