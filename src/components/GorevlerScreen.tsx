'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { useAdc } from './AdcProvider'
import SlideUpBubble from './SlideUpBubble'
import { fmtAdc } from '@/data/adc'
import {
  INVITE_STATUS_LABEL, QUESTS, REFERRAL_REWARD, SOCIAL_PLATFORMS, SOCIAL_REVIEW_MS,
  currentStreak, dayStr, periodKey, questProgress, referralCode,
  type Quest, type QuestTab, type SocialPlatform, type SubmissionStatus,
} from '@/data/adcQuests'

// ── Görevler (ADC v2.1 — revize-coin.html §5–§6, work3 task 8) ──────────────
// Günlük / Haftalık / Başarı quests with progress bars, the social-media share
// form (screenshot required, manual review) and friend invites.
//
// Prototype note: there is no admin panel or referral backend, so reviews and
// friends' sign-ups/deposits are simulated in AdcProvider after a short delay.

type Tab = QuestTab | 'social' | 'invite'
const TABS: { key: Tab; label: string }[] = [
  { key: 'daily', label: 'Günlük' },
  { key: 'weekly', label: 'Haftalık' },
  { key: 'achievement', label: 'Başarı' },
  { key: 'social', label: 'Sosyal' },
  { key: 'invite', label: 'Davet' },
]

const STREAK_STEPS = [3, 7, 14, 30]

const fmtNum = (n: number) => n.toLocaleString('tr-TR')
const fmtWhen = (ts: number) => {
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function QuestCard({ q }: { q: Quest }) {
  const { activity, claims, claimQuest } = useAdc()
  const progress = questProgress(q, activity)
  const claimed = claims[q.id] === periodKey(q.resets)
  const done = progress >= q.target
  const pct = Math.min(100, Math.round((progress / q.target) * 100))
  const shown = Math.min(progress, q.target)

  return (
    <div className={`bg-white rounded-xl border px-3.5 py-3 ${claimed ? 'border-[#27ae60]/35' : 'border-[#e8ecf1]'}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-bold text-[#1a2332] leading-tight">{q.title}</p>
            {q.badge && <span className="text-[8px] font-bold text-[#0E8FCF] bg-[#edf5ff] rounded px-1.5 py-[2px] flex-shrink-0">{q.badge}</span>}
          </div>
          <p className="text-[11px] text-[#737B8C] mt-[2px]">{q.desc}</p>
        </div>
        <span className="text-[14px] font-extrabold text-[#0E8FCF] tabular-nums flex-shrink-0">+{fmtNum(q.reward)}</span>
      </div>

      <div className="flex items-center gap-3 mt-2.5">
        <div className="flex-1">
          <div className="h-[6px] rounded-full bg-[#e8eef5] overflow-hidden">
            <div className={`h-full rounded-full transition-all ${done ? 'bg-[#27ae60]' : 'bg-[#0E8FCF]'}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-[#737B8C] mt-1 tabular-nums">
            {fmtNum(shown)}{q.unit === '₺' ? '₺' : ''} / {fmtNum(q.target)}{q.unit === '₺' ? '₺' : q.unit ? ` ${q.unit}` : ''}
          </p>
        </div>
        {claimed ? (
          <span className="h-[30px] px-3 rounded-lg bg-[#e8f5e9] text-[#1c7a52] text-[11px] font-bold flex items-center flex-shrink-0">✓ TAMAM</span>
        ) : done ? (
          <button onClick={() => claimQuest(q.id)} className="h-[30px] px-3 rounded-lg bg-[#27ae60] text-white text-[11px] font-bold flex-shrink-0 active:scale-95 transition-transform">
            Ödülü Al
          </button>
        ) : (
          <span className="h-[30px] px-3 rounded-lg bg-[#f1f5f9] text-[#737B8C] text-[11px] font-semibold flex items-center flex-shrink-0">Devam ediyor</span>
        )}
      </div>
    </div>
  )
}

const STATUS_META: Record<SubmissionStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'İnceleniyor', color: '#b7791f', bg: 'rgba(243,156,18,0.14)' },
  approved: { label: 'Onaylandı', color: '#1c7a52', bg: 'rgba(39,174,96,0.13)' },
  rejected: { label: 'Reddedildi', color: '#b8341f', bg: 'rgba(231,76,60,0.12)' },
}

function ShareForm({ initial, onClose }: { initial: SocialPlatform; onClose: () => void }) {
  const { submitSocial } = useAdc()
  const [platform, setPlatform] = useState<SocialPlatform>(initial)
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [note, setNote] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Preview only — the image is never stored (see SocialSubmission).
  useEffect(() => {
    if (!file) { setPreview(''); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const meta = SOCIAL_PLATFORMS.find(p => p.id === platform)!

  const submit = () => {
    setError('')
    if (!file) { setError('Ekran görüntüsü zorunludur.'); return }
    if (!file.type.startsWith('image/')) { setError('Lütfen bir görsel dosyası seçin.'); return }
    if (link && !/^https?:\/\//i.test(link.trim())) { setError('Link http:// veya https:// ile başlamalı.'); return }
    if (!agree) { setError('Kuralları kabul etmeniz gerekiyor.'); return }
    const err = submitSocial({ platform, link, note, file: { name: file.name, size: file.size, lastModified: file.lastModified } })
    if (err) { setError(err); return }
    setSent(true)
  }

  if (sent) {
    return (
      <SlideUpBubble onClose={onClose}>
        <div className="px-5 pt-6 pb-7 text-center">
          <div className="w-14 h-14 rounded-full bg-[#fff6e5] flex items-center justify-center mx-auto mb-3 text-[26px]" aria-hidden="true">⏳</div>
          <p className="text-[16px] font-bold text-[#1a2332]">Başvurunuz alındı</p>
          <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed">
            Paylaşımınız yönetici tarafından manuel olarak incelenecek. Onaylanınca <b>+{meta.reward} ADC</b> hesabınıza yüklenir.
          </p>
          <button onClick={onClose} className="w-full h-[44px] mt-5 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold">Tamam</button>
        </div>
      </SlideUpBubble>
    )
  }

  return (
    <SlideUpBubble onClose={onClose}>
      <div className="max-h-[85vh] overflow-y-auto px-5 pt-5 pb-6">
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-bold text-[#1a2332]">Sosyal Medya Paylaşımı</p>
          <button onClick={onClose} aria-label="Kapat" className="w-7 h-7 rounded-full bg-[#f1f5f9] flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <p className="text-[11px] text-[#737B8C] mt-1">{meta.name}’da paylaş · <b className="text-[#0E8FCF]">+{meta.reward} ADC</b> kazan</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {SOCIAL_PLATFORMS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              aria-pressed={platform === p.id}
              className={`px-3 h-[30px] rounded-full text-[11px] font-bold border ${platform === p.id ? 'text-white border-transparent' : 'bg-white text-[#1a2332] border-[#e8ecf1]'}`}
              style={platform === p.id ? { background: p.color } : undefined}
            >
              {p.name} · +{p.reward}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-[#737B8C] mt-2">Görev: {meta.task} · paylaşımda <b>#AdonisCoin</b> etiketi olmalı.</p>

        <label className="block text-[11px] font-semibold text-[#1a2332] mt-4 mb-1">🔗 Paylaşım Linki (opsiyonel)</label>
        <input
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="https://…"
          inputMode="url"
          className="w-full h-[42px] rounded-lg border border-[#e0e5ec] bg-[#f8fafc] px-3 text-[13px] text-[#1a2332] outline-none focus:border-[#0E8FCF]"
        />

        <label className="block text-[11px] font-semibold text-[#1a2332] mt-3 mb-1">📸 Ekran Görüntüsü (zorunlu)</label>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setError('') }} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-lg border-2 border-dashed border-[#c9d6e3] bg-[#f8fafc] px-3 py-4 flex items-center gap-3 text-left"
        >
          {preview ? (
            <img src={preview} alt="Seçilen ekran görüntüsü" className="w-14 h-14 rounded-md object-cover flex-shrink-0" />
          ) : (
            <span className="w-14 h-14 rounded-md bg-[#e8eef5] flex items-center justify-center flex-shrink-0 text-[22px]" aria-hidden="true">🖼️</span>
          )}
          <span className="min-w-0">
            <span className="block text-[12px] font-semibold text-[#1a2332] truncate">{file ? file.name : 'Dosya seç'}</span>
            <span className="block text-[10px] text-[#737B8C]">{file ? `${Math.max(1, Math.round(file.size / 1024))} KB · değiştirmek için dokunun` : 'PNG veya JPG'}</span>
          </span>
        </button>

        <label className="block text-[11px] font-semibold text-[#1a2332] mt-3 mb-1">📝 Açıklama (opsiyonel)</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          maxLength={200}
          className="w-full rounded-lg border border-[#e0e5ec] bg-[#f8fafc] px-3 py-2 text-[13px] text-[#1a2332] outline-none focus:border-[#0E8FCF] resize-none"
        />

        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input type="checkbox" checked={agree} onChange={e => { setAgree(e.target.checked); setError('') }} className="w-4 h-4 accent-[#0E8FCF]" />
          <span className="text-[11px] text-[#1a2332]">Kuralları okudum, kabul ediyorum</span>
        </label>

        {error && <p className="text-[11px] text-[#e74c3c] font-semibold mt-2">{error}</p>}

        <button onClick={submit} className="w-full h-[46px] mt-4 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-extrabold tracking-wide">
          GÖNDER → +{meta.reward} ADC
        </button>
        <p className="text-[10px] text-[#94a3b8] text-center mt-2 leading-relaxed">
          Başvurular yönetici tarafından manuel incelenir (ortalama 5–30 dk).
        </p>
      </div>
    </SlideUpBubble>
  )
}

function SocialTab() {
  const { social } = useAdc()
  const [form, setForm] = useState<SocialPlatform | null>(null)
  const today = dayStr(new Date())

  return (
    <>
      <div className="flex flex-col gap-2">
        {SOCIAL_PLATFORMS.map(p => {
          const used = social.some(x => x.platform === p.id && x.status !== 'rejected' && dayStr(new Date(x.createdAt)) === today)
          return (
            <div key={p.id} className="bg-white rounded-xl border border-[#e8ecf1] px-3.5 py-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[13px] font-extrabold flex-shrink-0" style={{ background: p.color }}>
                {p.name[0]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#1a2332]">{p.name} <span className="text-[#0E8FCF]">+{p.reward}</span></p>
                <p className="text-[11px] text-[#737B8C] truncate">{p.task} · günde 1</p>
              </div>
              <button
                onClick={() => setForm(p.id)}
                disabled={used}
                className="h-[32px] px-3.5 rounded-lg bg-[#0E8FCF] text-white text-[11px] font-bold flex-shrink-0 disabled:bg-[#e8eef5] disabled:text-[#737B8C]"
              >
                {used ? 'Bugün gönderildi' : 'Paylaş'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-3 rounded-xl bg-[#edf5ff] border border-[#0E8FCF]/20 px-3.5 py-3">
        <p className="text-[11px] font-bold text-[#1a2332]">Doğrulama kuralları</p>
        <ul className="mt-1.5 text-[10px] text-[#4a5568] leading-relaxed list-disc pl-4">
          <li>Her platform için günde 1 başvuru · ekran görüntüsü zorunlu</li>
          <li>Aynı görsel tekrar gönderilirse reddedilir · eski tarihli paylaşımlar kabul edilmez</li>
          <li>Hesap yaşı en az 7 gün olmalı · ADC yönetici onayından sonra yüklenir</li>
        </ul>
      </div>

      <p className="text-[12px] font-bold text-[#1a2332] mt-5 mb-2">Başvurularım</p>
      {social.length === 0 ? (
        <p className="text-[11px] text-[#737B8C] bg-white rounded-xl border border-[#e8ecf1] px-3.5 py-4 text-center">Henüz başvuru yok.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {social.map(x => {
            const p = SOCIAL_PLATFORMS.find(pl => pl.id === x.platform)!
            const m = STATUS_META[x.status]
            return (
              <div key={x.id} className="bg-white rounded-xl border border-[#e8ecf1] px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-bold text-[#1a2332] truncate">{p.name} · <span className="text-[#737B8C] font-medium">#{x.id}</span></p>
                  <span className="text-[10px] font-bold px-2 py-[3px] rounded-full flex-shrink-0" style={{ color: m.color, background: m.bg }}>{m.label}</span>
                </div>
                <p className="text-[10px] text-[#737B8C] mt-1 truncate">📸 {x.fileName}{x.link ? ` · 🔗 ${x.link}` : ''} · {fmtWhen(x.createdAt)}</p>
                {x.status === 'approved' && <p className="text-[11px] font-bold text-[#1c7a52] mt-1">+{x.reward} ADC yüklendi</p>}
                {x.status === 'pending' && (
                  <p className="text-[10px] text-[#b7791f] mt-1">Yönetici incelemesi bekleniyor{Date.now() - x.createdAt < SOCIAL_REVIEW_MS ? '…' : ''}</p>
                )}
                {x.status === 'rejected' && x.adminNote && <p className="text-[10px] text-[#b8341f] mt-1">Red nedeni: {x.adminNote}</p>}
              </div>
            )
          })}
        </div>
      )}

      {form && <ShareForm initial={form} onClose={() => setForm(null)} />}
    </>
  )
}

function InviteTab() {
  const { username } = useAuth()
  const { invites, addInvite } = useAdc()
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')
  useEffect(() => { setOrigin(window.location.origin) }, [])

  const code = referralCode(username)
  const link = `${origin}/register/?ref=${encodeURIComponent(code)}`
  const earned = invites.filter(i => i.status === 'deposited').length * REFERRAL_REWARD

  const copy = async () => {
    try { await navigator.clipboard.writeText(link) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  const share = async () => {
    const nav = navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> }
    if (nav.share) {
      try { await nav.share({ title: 'Betadonis', text: `Betadonis’e katıl! Davet kodum: ${code}`, url: link }) } catch {}
    } else copy()
  }
  const invite = () => {
    if (name.trim().length < 2) return
    addInvite(name)
    setName('')
  }

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-[#0E8FCF] to-[#1d4ed8] px-4 py-4 text-white">
        <p className="text-[12px] font-semibold text-white/85">Arkadaşını davet et</p>
        <p className="text-[20px] font-extrabold leading-tight mt-0.5">Her ilk yatırımda +{REFERRAL_REWARD} ADC</p>
        <p className="text-[11px] text-white/80 mt-1">Davet ettiğin arkadaşın kayıt olup ilk yatırımını yaptığında ADC hesabına yüklenir. Sınır yok.</p>
        <div className="mt-3 rounded-xl bg-white/15 px-3 py-2.5 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/75">Davet kodun</p>
            <p className="text-[16px] font-extrabold tracking-wider">{code}</p>
          </div>
          <button onClick={copy} className="h-[32px] px-3 rounded-lg bg-white text-[#0E8FCF] text-[11px] font-bold flex-shrink-0">{copied ? 'Kopyalandı ✓' : 'Linki Kopyala'}</button>
          <button onClick={share} className="h-[32px] px-3 rounded-lg bg-white/20 text-white text-[11px] font-bold flex-shrink-0">Paylaş</button>
        </div>
      </div>

      <div className="mt-3 bg-white rounded-xl border border-[#e8ecf1] px-3.5 py-3">
        <p className="text-[12px] font-bold text-[#1a2332]">Davet gönder</p>
        <div className="flex gap-2 mt-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') invite() }}
            placeholder="Arkadaşının adı"
            className="flex-1 min-w-0 h-[40px] rounded-lg border border-[#e0e5ec] bg-[#f8fafc] px-3 text-[13px] text-[#1a2332] outline-none focus:border-[#0E8FCF]"
          />
          <button onClick={invite} disabled={name.trim().length < 2} className="h-[40px] px-4 rounded-lg bg-[#0E8FCF] text-white text-[12px] font-bold flex-shrink-0 disabled:opacity-40">Davet Et</button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 mb-2">
        <p className="text-[12px] font-bold text-[#1a2332]">Davetlerim ({invites.length})</p>
        <p className="text-[11px] font-bold text-[#1c7a52]">Kazanılan: +{fmtNum(earned)} ADC</p>
      </div>
      {invites.length === 0 ? (
        <p className="text-[11px] text-[#737B8C] bg-white rounded-xl border border-[#e8ecf1] px-3.5 py-4 text-center">Henüz davet yok.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {invites.map(i => (
            <div key={i.id} className="bg-white rounded-xl border border-[#e8ecf1] px-3.5 py-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#edf5ff] text-[#0E8FCF] font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                {i.name.charAt(0).toLocaleUpperCase('tr-TR')}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#1a2332] truncate">{i.name}</p>
                <p className="text-[10px] text-[#737B8C]">{INVITE_STATUS_LABEL[i.status]} · {fmtWhen(i.createdAt)}</p>
              </div>
              {i.status === 'deposited'
                ? <span className="text-[12px] font-bold text-[#1c7a52] flex-shrink-0">+{REFERRAL_REWARD} ADC</span>
                : <span className="text-[10px] font-semibold text-[#b7791f] flex-shrink-0">Bekliyor</span>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default function GorevlerScreen() {
  const router = useRouter()
  const { loaded, isLoggedIn } = useAuth()
  const { available, activity, claims } = useAdc()
  const [tab, setTab] = useState<Tab>('daily')

  const streak = currentStreak(activity.loginDays)
  const nextStep = STREAK_STEPS.find(n => n > streak)
  const claimable = QUESTS.filter(q => claims[q.id] !== periodKey(q.resets) && questProgress(q, activity) >= q.target)
  const countFor = (t: Tab) => claimable.filter(q => q.tab === t).length

  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen pb-28">
      <div className="bg-white px-2 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => router.back()} aria-label="Geri" className="w-9 h-9 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="flex-1 text-center text-[15px] font-bold text-[#1a2332]">🎯 Görevler</h1>
          <Link href="/adonis-coin" className="h-[28px] px-2.5 mr-1 rounded-full bg-[#edf5ff] text-[#0E8FCF] text-[11px] font-bold flex items-center tabular-nums">
            {fmtAdc(available)} ADC
          </Link>
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide px-2 pt-3">
          {TABS.map(t => {
            const n = countFor(t.key)
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                aria-pressed={tab === t.key}
                className={`relative flex-shrink-0 px-3.5 h-[32px] rounded-full text-[12px] font-bold transition-colors ${tab === t.key ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332]'}`}
              >
                {t.label}
                {n > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#e74c3c] text-white text-[9px] flex items-center justify-center">{n}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4">
        {!loaded ? null : !isLoggedIn ? (
          <div className="bg-white rounded-xl border border-[#e8ecf1] px-5 py-6 text-center">
            <p className="text-[14px] font-bold text-[#1a2332]">Görevler üyelere özel</p>
            <p className="text-[11px] text-[#737B8C] mt-1">Görev tamamlamak ve ADC kazanmak için giriş yapın.</p>
            <div className="flex gap-2.5 mt-4">
              <Link href="/login" className="flex-1 h-[42px] rounded-xl border-2 border-[#0E8FCF] text-[#0E8FCF] text-[12px] font-bold flex items-center justify-center">Giriş Yap</Link>
              <Link href="/register" className="flex-1 h-[42px] rounded-xl bg-[#0E8FCF] text-white text-[12px] font-bold flex items-center justify-center">Kayıt Ol</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Streak */}
            <div className="rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] px-3.5 py-3 mb-3 flex items-center gap-3 text-white">
              <span className="text-[26px]" aria-hidden="true">🔥</span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-extrabold">Seriniz {streak} gün</p>
                <p className="text-[10px] text-white/85">
                  {nextStep ? `${nextStep - streak} gün daha giriş yap, ${nextStep} gün serisini tamamla.` : '30 gün serisi tamam — VIP avantajların aktif!'} Seri bozulursa sıfırlanır.
                </p>
              </div>
            </div>

            {tab === 'social' ? <SocialTab />
              : tab === 'invite' ? <InviteTab />
              : (
                <div className="flex flex-col gap-2">
                  {QUESTS.filter(q => q.tab === tab).map(q => <QuestCard key={q.id} q={q} />)}
                  <p className="text-[10px] text-[#94a3b8] text-center mt-1">
                    {tab === 'daily' ? 'Günlük görevler her gün 00:00’da sıfırlanır.'
                      : tab === 'weekly' ? 'Haftalık görevler pazartesi 00:00’da, aylık görev ayın 1’inde sıfırlanır.'
                      : 'Bonus parayla veya ADC koduyla oynanan bahisler görevlere sayılmaz.'}
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  )
}
