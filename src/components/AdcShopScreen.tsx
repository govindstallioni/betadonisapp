'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SlideUpBubble from './SlideUpBubble'
import { useAuth } from './AuthProvider'
import { useAdc } from './AdcProvider'
import {
  ADC_SHOP, ADC_CATEGORIES, shopItem, codeStatus, daysLeft, fmtAdc,
  CODE_LIFETIME_DAYS, CODE_MIN_ODDS, MIN_ADC_USAGE,
  type AdcShopItem, type AdcCode, type AdcCodeStatus, type AdcTx,
} from '@/data/adc'

// ── Adonis Coin mağazası (task 27) ──────────────────────────────────────────
// Layout follows the client's references (1xpromo1–3.PNG): Mağaza / Kodlarım
// tabs, the points header with a redeem call to action, then category rows of
// reward cards; a tapped card opens a detail sheet with the buy button.
//
// Two deliberate departures from those screenshots, both because the written
// brief (coin.html) overrules them:
//   • No "Oyunlar" category. The reference fills it with DOTA 21 and Heroes of
//     the Storm; the brief's scope rule is sports only.
//   • Four code filters instead of five. The reference has an "Etkin değil"
//     pill; our codes are active the moment they are bought, so there is no
//     inactive state to filter for.

const ICONS: Record<AdcShopItem['icon'], React.ReactNode> = {
  futbol: <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2.2 3.1 2.2-1.2 3.6h-3.8L8.9 6.4 12 4.2zM5.2 9.3l3 .1 1.2 3.6-3.1 2.3-2.1-2.3.9-3.7zm2.5 9.1L8.8 15h6.4l1.1 3.4A7.8 7.8 0 0 1 12 19.8c-1.6 0-3.1-.5-4.3-1.4zm11.2-3.1L15.8 13 17 9.4l3-.1.9 3.7-2.1 2.3z" /></svg>,
  basketbol: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"><circle cx="12" cy="12" r="9.2" /><path d="M12 2.8v18.4M2.8 12h18.4M5.5 5.5c3.6 3.6 3.6 9.4 0 13M18.5 5.5c-3.6 3.6-3.6 9.4 0 13" /></svg>,
  tenis: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"><circle cx="12" cy="12" r="9.2" /><path d="M4.3 6.4c3.2 2 5.1 5.5 5.1 9.3 0 1.9-.5 3.7-1.3 5.3M19.7 6.4c-3.2 2-5.1 5.5-5.1 9.3 0 1.9.5 3.7 1.3 5.3" /></svg>,
  hokey: <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M4 4h2.2l4.3 12.2h4.6L19.8 4H22l-5.4 15H9.4L4 4zm-1 16.4h18V22H3v-1.6z" /></svg>,
  espor: <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M17.5 6h-11A4.5 4.5 0 0 0 2 10.5v3A4.5 4.5 0 0 0 6.5 18c1.3 0 2.1-.6 2.8-1.3l.7-.7h4l.7.7c.7.7 1.5 1.3 2.8 1.3a4.5 4.5 0 0 0 4.5-4.5v-3A4.5 4.5 0 0 0 17.5 6zM9 13H7.5v1.5h-1.5V13H4.5v-1.5H6V10h1.5v1.5H9V13zm6.2.8a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2zm2.6-2.6a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z" /></svg>,
  kombine: <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z" /></svg>,
  yildiz: <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="m12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6 12 2z" /></svg>,
  kupa: <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M19 4h-2V2H7v2H5a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4 5 5 0 0 0 4 2.9V19H8v2h8v-2h-3v-4.1A5 5 0 0 0 17 12a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2zM5 8V6h2v3.8A2 2 0 0 1 5 8zm14 0a2 2 0 0 1-2 1.8V6h2v2z" /></svg>,
}

const fmtDate = (ts: number) => {
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`
}

function Header({ onInfo }: { onInfo: () => void }) {
  const router = useRouter()
  return (
    <div className="bg-white px-2 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-20">
      <div className="flex items-center">
        <button onClick={() => router.back()} aria-label="Geri" className="w-9 h-9 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h1 className="flex-1 text-center text-[15px] font-bold text-[#1a2332]">Adonis Coin Kodları</h1>
        <button onClick={onInfo} aria-label="Bilgi" className="w-9 h-9 flex items-center justify-center">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.9"><circle cx="12" cy="12" r="9.2" /><path d="M12 11v5M12 8h.01" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  )
}

/** Reward artwork: our own gradient + glyph rather than the reference's stock
 *  photography. */
function CardArt({ item, className, children }: { item: AdcShopItem; className?: string; children?: React.ReactNode }) {
  return (
    <div
      className={`relative flex items-end overflow-hidden ${className || ''}`}
      style={{ background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})` }}
    >
      <div className="absolute -right-3 -top-2 opacity-25 scale-[2.6] origin-top-right">{ICONS[item.icon]}</div>
      {children}
    </div>
  )
}

function ShopCard({ item, onOpen }: { item: AdcShopItem; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="w-[132px] flex-shrink-0 text-left active:scale-[0.98] transition-transform">
      <CardArt item={item} className="h-[86px] rounded-xl p-2.5" />
      <p className="text-[11px] font-semibold text-[#1a2332] mt-1.5 leading-tight line-clamp-2">{item.name}</p>
      <p className="text-[10px] font-bold text-[#0E8FCF] mt-[2px] tabular-nums">{fmtAdc(item.cost)} ADC</p>
    </button>
  )
}

/** Detail + buy sheet — the reference's item screen (1xpromo1.PNG). */
function ItemSheet({ item, onClose }: { item: AdcShopItem; onClose: () => void }) {
  const { loaded, isLoggedIn } = useAuth()
  const { available, redeem } = useAdc()
  const [issued, setIssued] = useState<AdcCode | null>(null)
  const [loginPrompt, setLoginPrompt] = useState(false)

  const affordable = available >= item.cost

  const buy = () => {
    if (!loaded) return
    if (!isLoggedIn) { setLoginPrompt(true); return }
    if (!affordable) return
    const code = redeem(item.id)
    if (code) setIssued(code)
  }

  if (loginPrompt) {
    return (
      <SlideUpBubble onClose={onClose}>
        <div className="px-5 pt-6 pb-7 text-center">
          <p className="text-[15px] font-bold text-[#1a2332]">Devam etmek için giriş yap</p>
          <p className="text-[11px] text-[#737B8C] mt-1.5 leading-relaxed">
            Adonis Coin kodlarını satın alabilmek için hesabınıza giriş yapmanız gerekiyor.
          </p>
          <div className="flex gap-2.5 mt-4">
            <Link href="/login" className="flex-1 h-[42px] rounded-xl border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-bold flex items-center justify-center">Giriş Yap</Link>
            <Link href="/register" className="flex-1 h-[42px] rounded-xl bg-[#0E8FCF] text-white text-[12px] font-bold flex items-center justify-center">Kayıt Ol</Link>
          </div>
          <button onClick={onClose} className="w-full mt-2.5 h-[36px] text-[11px] font-semibold text-[#94a3b8]">Vazgeç</button>
        </div>
      </SlideUpBubble>
    )
  }

  if (issued) {
    return (
      <SlideUpBubble onClose={onClose}>
        <div className="px-5 pt-6 pb-7 text-center">
          <div className="w-16 h-16 rounded-full bg-[#eafaf1] flex items-center justify-center mx-auto mb-3">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h2 className="text-[16px] font-bold text-[#1a2332]">Kodunuz Hazır</h2>
          <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed">{item.name} · {item.value} ₺ değerinde</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#edf5ff] rounded-full px-5 py-2.5">
            <span className="text-[15px] font-bold text-[#0E8FCF] tracking-wider tabular-nums">{issued.code}</span>
          </div>
          <p className="text-[10px] text-[#94a3b8] mt-3 leading-relaxed">
            {fmtDate(issued.expiresAt)} tarihine kadar geçerli · tek kullanımlık · min. {CODE_MIN_ODDS.toFixed(2)} oran
          </p>
          <button onClick={onClose} className="w-full h-[46px] mt-5 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold">Tamam</button>
        </div>
      </SlideUpBubble>
    )
  }

  return (
    <SlideUpBubble onClose={onClose}>
      <CardArt item={item} className="h-[150px] px-5 pb-4">
        <h2 className="relative text-[22px] font-bold text-white drop-shadow">{item.name}</h2>
      </CardArt>

      <div className="px-5 pt-4 pb-6">
        <p className="text-[10px] font-bold text-[#0E8FCF] tracking-wide">
          KOD BAŞINA BAHİS / {fmtAdc(item.cost)} ADC
        </p>
        <p className="text-[12px] text-[#1a2332] mt-1.5 leading-relaxed">{item.desc}</p>

        <div className="mt-4 bg-[#f8fafc] rounded-xl border border-[#e8ecf1] px-3.5 py-3 flex flex-col gap-2">
          <Row k="Promosyon hesabı" v={`${fmtAdc(available)} ADC`} strong />
          <Row k="Fiyat" v={`${fmtAdc(item.cost)} ADC`} />
          <Row k="Kod değeri" v={`${item.value} ₺`} />
          <Row k="Geçerlilik" v={`${CODE_LIFETIME_DAYS} gün`} />
          <Row k="Minimum oran" v={CODE_MIN_ODDS.toFixed(2)} />
          <Row k="Spor dalı" v={item.sport} />
          {item.minLegs && <Row k="Minimum seçim" v={`${item.minLegs}`} />}
        </div>

        <button
          onClick={buy}
          disabled={loaded && isLoggedIn && !affordable}
          className="w-full h-[46px] mt-4 rounded-xl bg-[#27ae60] text-white text-[13px] font-bold disabled:opacity-40 active:scale-[0.99] transition-transform"
        >
          {fmtAdc(item.cost)} ADC için satın al
        </button>
        {loaded && isLoggedIn && !affordable && (
          <p className="text-[10px] text-[#e74c3c] text-center mt-2">
            {fmtAdc(item.cost - available)} ADC daha gerekiyor.
          </p>
        )}
        <p className="text-[10px] text-[#94a3b8] text-center mt-2.5 leading-relaxed">
          Kodlar tek kullanımlıktır ve yalnızca spor bahislerinde geçerlidir.
        </p>
      </div>
    </SlideUpBubble>
  )
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] text-[#737B8C]">{k}</span>
      <span className={`tabular-nums ${strong ? 'text-[14px] font-bold text-[#0E8FCF]' : 'text-[12px] font-semibold text-[#1a2332]'}`}>{v}</span>
    </div>
  )
}

const FILTERS: { label: string; match: (s: AdcCodeStatus) => boolean }[] = [
  { label: 'Hepsi', match: () => true },
  { label: 'Aktif', match: s => s === 'active' },
  { label: 'Kullanılan', match: s => s === 'used' },
  { label: 'Süresi geçmiş', match: s => s === 'expired' },
]

const STATUS_COLOR: Record<AdcCodeStatus, string> = {
  active: '#27ae60',
  used: '#737B8C',
  expired: '#e74c3c',
}

function CodesTab({ onOpen }: { onOpen: (item: AdcShopItem) => void }) {
  const { loaded, codes } = useAdc()
  const [filter, setFilter] = useState(0)

  const visible = codes.filter(c => FILTERS[filter].match(codeStatus(c)))

  return (
    <>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pt-3 pb-1">
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setFilter(i)}
            className={`flex-shrink-0 px-3 h-[28px] rounded-full text-[11px] font-semibold transition-colors ${
              filter === i ? 'bg-[#0E8FCF] text-white' : 'bg-white text-[#1a2332] border border-[#e8ecf1]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loaded && visible.length === 0 ? (
        <div className="px-4 pt-12 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#dbe6f0] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#8fa6bd"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
          </div>
          <p className="text-[12px] text-[#737B8C] mt-3">Adonis Coin kodlarınız burada görünecek</p>
        </div>
      ) : (
        <div className="px-4 pt-3 flex flex-col gap-2">
          {visible.map(c => {
            const st = codeStatus(c)
            return (
              <div key={c.code} className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${shopItem(c.itemId)?.gradient[0] || '#0E8FCF'}, ${shopItem(c.itemId)?.gradient[1] || '#075985'})` }}
                >
                  <span className="text-white text-[13px] font-bold">₳</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#1a2332] leading-tight truncate">{c.name}</p>
                  <p className="text-[13px] font-bold text-[#0E8FCF] tracking-wider tabular-nums mt-[1px]">{c.code}</p>
                  <p className="text-[10px] mt-[2px]" style={{ color: STATUS_COLOR[st] }}>
                    {st === 'active' && `Aktif · ${daysLeft(c)} gün kaldı`}
                    {st === 'used' && `Kullanıldı · ${fmtDate(c.usedAt!)}`}
                    {st === 'expired' && `Süresi geçti · ${fmtDate(c.expiresAt)}`}
                  </p>
                </div>
                <span className="text-[12px] font-bold text-[#1a2332] tabular-nums flex-shrink-0">{c.value} ₺</span>
              </div>
            )
          })}
        </div>
      )}

      {/* "Önerilerimiz" — the reference puts a short suggestion list under the
          codes list, which doubles as a way back into the shop. */}
      <p className="text-[12px] font-bold text-[#0E8FCF] px-5 pt-6 pb-2">Önerilerimiz</p>
      <div className="px-4 flex flex-col gap-2">
        {ADC_SHOP.slice(0, 3).map(item => (
          <button
            key={item.id}
            onClick={() => onOpen(item)}
            className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
          >
            <CardArt item={item} className="w-11 h-11 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">{item.name}</p>
              <p className="text-[10px] text-[#737B8C] mt-[2px] leading-tight line-clamp-2">{item.desc}</p>
            </div>
            <span className="text-[11px] font-bold text-[#0E8FCF] tabular-nums flex-shrink-0">{fmtAdc(item.cost)} ADC</span>
          </button>
        ))}
      </div>
    </>
  )
}

function InfoSheet({ onClose }: { onClose: () => void }) {
  return (
    <SlideUpBubble onClose={onClose}>
      <div className="px-5 pt-5 pb-6">
        <h2 className="text-[16px] font-bold text-[#1a2332]">Adonis Coin nasıl çalışır?</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {[
            'ADC yalnızca para yatırarak kazanılır. Kayıt bonusu yoktur.',
            'Yatırdığınız tutar büyüdükçe 100 ₺ başına kazandığınız ADC artar.',
            'Puanlar önce “bekleyen” olarak eklenir. En az 100 ₺ ve 1.50 oranlı bir bahis yaptığınızda kullanılabilir hale gelir.',
            `Biriken ADC yalnızca spor bahis kodlarına harcanır. En az ${MIN_ADC_USAGE} ADC gerekir.`,
            `Kodlar tek kullanımlıktır, ${CODE_LIFETIME_DAYS} gün geçerlidir ve min. ${CODE_MIN_ODDS.toFixed(2)} oran şartı vardır.`,
            'Casino, çark, bonus bakiyesi veya nakit iade için kullanılamaz.',
          ].map(t => (
            <li key={t} className="flex items-start gap-2">
              <span className="w-[5px] h-[5px] rounded-full bg-[#0E8FCF] mt-[6px] flex-shrink-0" />
              <span className="text-[11px] text-[#737B8C] leading-relaxed">{t}</span>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="w-full h-[44px] mt-5 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold">Anladım</button>
      </div>
    </SlideUpBubble>
  )
}


// ── Geçmiş (task 27, item 8) ────────────────────────────────────────────────
// AdcProvider has been recording every movement since the feature shipped —
// deposits accruing points, a qualifying bet releasing them, a purchase
// spending them — and nothing rendered it. This is that ledger, not new state.
const TX_META: Record<AdcTx['type'], { label: string; color: string; bg: string }> = {
  deposit: { label: 'Yatırımdan kazanıldı', color: '#9a6212', bg: 'rgba(243,156,18,0.12)' },
  confirm: { label: 'Bahisle onaylandı', color: '#1c7a52', bg: 'rgba(39,174,96,0.12)' },
  spend: { label: 'Kod satın alındı', color: '#b8341f', bg: 'rgba(231,76,60,0.11)' },
}

/** "12 Eylül 2026" — the day heading the ledger groups under. */
const TR_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
function dayKey(ts: number) {
  const d = new Date(ts)
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
const fmtTime = (ts: number) => {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function HistoryTab() {
  const { loaded, transactions, available, pending } = useAdc()

  // Earned counts only what actually landed as points; "confirm" moves points
  // from pending to available rather than creating any, so counting it here
  // would double every deposit.
  const earned = transactions.filter(t => t.type === 'deposit').reduce((a, t) => a + t.amount, 0)
  const spent = transactions.filter(t => t.type === 'spend').reduce((a, t) => a + Math.abs(t.amount), 0)

  // Group by day, newest first. AdcProvider unshifts, so the store is already
  // in order — but sorting here costs nothing and keeps the day headings right
  // if a row ever arrives out of sequence.
  const groups: { day: string; rows: AdcTx[] }[] = []
  for (const t of [...transactions].sort((x, y) => y.at - x.at)) {
    const k = dayKey(t.at)
    const last = groups[groups.length - 1]
    if (last && last.day === k) last.rows.push(t)
    else groups.push({ day: k, rows: [t] })
  }

  if (loaded && transactions.length === 0) {
    return (
      <div className="px-4 pt-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#e3ebf3] flex items-center justify-center mb-3">
          <span className="text-[24px] font-bold text-[#94a3b8]">₳</span>
        </div>
        <p className="text-[14px] font-bold text-[#1a2332]">Henüz hareket yok</p>
        <p className="text-[11px] text-[#737B8C] mt-1.5 leading-relaxed max-w-[280px]">
          Para yatırdığınızda Adonis Coin kazanmaya başlarsınız. Kazandığınız puanlar burada listelenir.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4">
      {/* Summary — these three must visibly reconcile with the header balance. */}
      <div className="grid grid-cols-3 gap-[1px] bg-[#e3ebf3] border border-[#e3ebf3] rounded-xl overflow-hidden">
        {[
          { k: 'Kazanılan', v: `+${fmtAdc(earned)}`, c: '#1c7a52' },
          { k: 'Harcanan', v: `−${fmtAdc(spent)}`, c: '#b8341f' },
          { k: 'Bakiye', v: fmtAdc(available + pending), c: '#1a2332' },
        ].map(x => (
          <div key={x.k} className="bg-white px-2 py-3 text-center">
            <p className="text-[15px] font-bold tabular-nums" style={{ color: x.c }}>{x.v}</p>
            <p className="text-[10px] text-[#737B8C] mt-[2px]">{x.k}</p>
          </div>
        ))}
      </div>
      {pending > 0 && (
        <p className="text-[10px] text-[#737B8C] text-center mt-2">
          Bakiyenin {fmtAdc(pending)} ADC kadarı henüz beklemede.
        </p>
      )}

      {groups.map(g => (
        <div key={g.day} className="mt-4">
          <p className="text-[11px] font-bold text-[#737B8C] px-1 pb-1.5">{g.day}</p>
          <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
            {g.rows.map((t, i) => {
              const m = TX_META[t.type]
              return (
                <div key={t.id} className={`flex items-center gap-3 px-3.5 py-3 ${i < g.rows.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
                    style={{ background: m.bg, color: m.color }}>₳</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">{m.label}</p>
                    <p className="text-[10px] text-[#737B8C] truncate mt-[1px]">{t.note} · {fmtTime(t.at)}</p>
                  </div>
                  <span className="text-[13px] font-bold tabular-nums flex-shrink-0"
                    style={{ color: t.amount >= 0 ? '#1c7a52' : '#b8341f' }}>
                    {t.amount >= 0 ? '+' : '−'}{fmtAdc(Math.abs(t.amount))}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdcShopScreen() {
  const { loaded, available, pending } = useAdc()
  const [tab, setTab] = useState<'shop' | 'codes' | 'history'>('shop')
  const [openItem, setOpenItem] = useState<AdcShopItem | null>(null)
  const [info, setInfo] = useState(false)

  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen pb-28">
      <Header onInfo={() => setInfo(true)} />

      {/* Mağaza / Kodlarım */}
      <div className="px-4 pt-3">
        <div className="flex bg-[#e3ebf3] rounded-lg p-[3px]">
          {([['shop', 'Mağaza'], ['codes', 'Kodlarım'], ['history', 'Geçmiş']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 h-[30px] rounded-md text-[12px] font-semibold transition-colors ${
                tab === key ? 'bg-[#0E8FCF] text-white' : 'text-[#1a2332]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Points header */}
      <div className="px-4 pt-3.5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-[#737B8C]">Promosyon hesabı</p>
            <p className="text-[26px] font-bold text-[#1a2332] leading-tight tabular-nums">
              {loaded ? fmtAdc(available) : '0'} <span className="text-[15px]">ADC PUAN</span>
            </p>
          </div>
          {tab === 'codes' && (
            <button onClick={() => setTab('shop')} className="flex-shrink-0 h-[32px] px-4 rounded-lg bg-[#0E8FCF] text-white text-[12px] font-semibold">
              Talep et
            </button>
          )}
        </div>
        {loaded && pending > 0 && (
          <div className="mt-2.5 flex items-start gap-2.5 rounded-xl bg-[#fff6e5] border border-[#f39c12]/25 px-3 py-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f39c12" className="flex-shrink-0 mt-[1px]"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
            <p className="text-[10px] text-[#8a6212] leading-relaxed">
              <span className="font-bold">{fmtAdc(pending)} ADC</span> bekliyor. En az 100 ₺ tutarında ve 1.50 oranlı
              bir bahis yaptığınızda kullanılabilir hale gelecek.
            </p>
          </div>
        )}
      </div>

      {tab === 'history' ? (
        <HistoryTab />
      ) : tab === 'shop' ? (
        <div className="pt-4">
          {ADC_CATEGORIES.map(cat => {
            const items = ADC_SHOP.filter(i => i.category === cat)
            if (items.length === 0) return null
            return (
              <div key={cat} className="mb-4">
                <p className="text-[12px] font-bold text-[#0E8FCF] px-5 pb-2">{cat}</p>
                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-4">
                  {items.map(item => (
                    <ShopCard key={item.id} item={item} onOpen={() => setOpenItem(item)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <CodesTab onOpen={item => setOpenItem(item)} />
      )}

      {openItem && <ItemSheet item={openItem} onClose={() => setOpenItem(null)} />}
      {info && <InfoSheet onClose={() => setInfo(false)} />}
    </div>
  )
}
