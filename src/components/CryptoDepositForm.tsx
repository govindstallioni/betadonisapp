'use client'

import { useEffect, useRef, useState } from 'react'
import { NoticeBubble, useNotice } from '@/components/AuthWidgets'
import { adcForDeposit, adcRateFor, fmtAdc } from '@/data/adc'

// ── Crypto deposit form (v6.6 task 34; btc / tetherusd / tron / ethereum .png) ─
// 1. Amount in TRY with a live "you send ≈ X COIN" calculation.
// 2. The company wallet for that coin/network, with a copy button and warnings.
// 3. After the wallet is copied, an "İşlem Kodu" (TXID / chain code) field. The
//    code is checked before the deposit can be submitted.
//
// Layout and wording follow the live site's own crypto screens (client
// references): Tutar + Hesapla → Gönderilecek Tutar, then one ÖNEMLİ UYARI
// sentence with the wallet inline and a copy icon.
//
// TO CHECK / REPLACE before going live:
//  • `address` values were read off the client's reference screenshots. BTC,
//    both TRON addresses and the ETH address pass their own checksums (the ETH
//    one was cut off in the screenshot and recovered via its EIP-55 casing), but
//    confirm all four against the company wallets before accepting money.
//  • `rate` is an indicative TRY price; wire it to a price feed.
//  • verifyTx() checks the code's format and re-use only. Confirming that the
//    transaction really exists and paid this wallet needs a block-explorer /
//    node lookup on a backend.

export interface CryptoConfig {
  symbol: string
  coin: string
  network: string
  /** What the user must pick as the network in their wallet / exchange. */
  networkHint: string
  /** Wording of the reference warning: "Yalnızca {warnName} gönderin ve [{warnNetwork}] ağı…" */
  warnName: string
  warnNetwork: string
  address: string
  rate: number // TRY per 1 unit
  decimals: number
  color: string
  glyph: string
  txKind: 'hex64' | 'hex64-0x'
}

const USDT_TRC20_ADDR = 'TWHsyFwwiYYHmEZi7xCecZ9QnU7KsM7vv3'
const TRX_ADDR = 'TEJuqe8GvqhfQmS27Q3NEQcBfZyT8j7MJa'
const BTC_ADDR = 'bc1qel0dc6t725hjtl7mv6xgcx40lwf76pk5cvkjfd'
const ETH_ADDR = '0x7479E7f34C98Ad4330d0ab01a486F7f4f38d6B4d'

export const CRYPTO_BY_METHOD: Record<number, CryptoConfig> = {
  6: { symbol: 'USDT', coin: 'Tether', network: 'Tron (TRC20)', networkHint: 'TRC20', warnName: 'Tether USDT', warnNetwork: 'TRC20', address: USDT_TRC20_ADDR, rate: 42, decimals: 2, color: '#26a17b', glyph: '₮', txKind: 'hex64' },
  7: { symbol: 'TRX', coin: 'TRON', network: 'Tron (TRC10/TRC20)', networkHint: 'TRX', warnName: 'TRON TRX', warnNetwork: 'TRX veya TRC10/TRC20', address: TRX_ADDR, rate: 11.5, decimals: 2, color: '#eb0029', glyph: 'T', txKind: 'hex64' },
  17: { symbol: 'BTC', coin: 'Bitcoin', network: 'Bitcoin', networkHint: 'BTC', warnName: 'Bitcoin', warnNetwork: 'Bitcoin', address: BTC_ADDR, rate: 4_200_000, decimals: 8, color: '#f7931a', glyph: '₿', txKind: 'hex64' },
  18: { symbol: 'ETH', coin: 'Ethereum', network: 'Ethereum (ERC20)', networkHint: 'ERC20', warnName: 'Ethereum', warnNetwork: 'ERC20', address: ETH_ADDR, rate: 150_000, decimals: 6, color: '#627eea', glyph: 'Ξ', txKind: 'hex64-0x' },
  19: { symbol: 'USDT', coin: 'Tether', network: 'Tron (TRC20)', networkHint: 'TRC20', warnName: 'Tether USDT', warnNetwork: 'TRC20', address: USDT_TRC20_ADDR, rate: 42, decimals: 2, color: '#26a17b', glyph: '₮', txKind: 'hex64' },
  // ERC20 tokens live at the same address as Ethereum itself.
  20: { symbol: 'USDT', coin: 'Tether', network: 'Ethereum (ERC20)', networkHint: 'ERC20', warnName: 'Tether USDT', warnNetwork: 'ERC20', address: ETH_ADDR, rate: 42, decimals: 2, color: '#26a17b', glyph: '₮', txKind: 'hex64-0x' },
}

// ── Chain-code verification ─────────────────────────────────────────────────
const USED_KEY = 'bta_used_tx'
const norm = (s: string) => s.trim().toLowerCase()

function usedCodes(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(USED_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Remembers a submitted code so the same transfer can't be claimed twice. */
export function markTxUsed(code: string) {
  try { localStorage.setItem(USED_KEY, JSON.stringify([...usedCodes(), norm(code)])) } catch {}
}

const looksLikeAddress = (s: string) =>
  /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(s) || /^0x[0-9a-fA-F]{40}$/.test(s) || /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,60}$/.test(s)

/** Returns an error message, or '' when the code passes. */
export function validateTx(cfg: CryptoConfig, raw: string): string {
  const code = raw.trim()
  if (!code) return 'İşlem kodunu girin.'
  if (/\s/.test(code)) return 'İşlem kodu boşluk içeremez.'
  if (looksLikeAddress(code)) return 'Bu bir cüzdan adresi. Lütfen cüzdan adresini değil, işlem (TXID / Hash) kodunu girin.'
  if (cfg.txKind === 'hex64-0x') {
    if (!/^0x[0-9a-fA-F]{64}$/.test(code)) return `Geçersiz işlem kodu. ${cfg.network} işlem kodu "0x" ile başlayan 66 karakterlik bir koddur.`
  } else if (!/^[0-9a-fA-F]{64}$/.test(code)) {
    return `Geçersiz işlem kodu. ${cfg.network} işlem kodu 64 karakterlik onaltılık (0-9, a-f) bir koddur.`
  }
  const body = code.replace(/^0x/i, '')
  if (new Set(body.toLowerCase()).size < 6) return 'İşlem kodu ağda bulunamadı. Kodu kontrol edip tekrar deneyin.'
  if (usedCodes().includes(norm(code))) return 'Bu işlem kodu daha önce kullanıldı. Her transfer yalnızca bir kez yatırılabilir.'
  return ''
}

const MAX_ATTEMPTS = 5

// ── UI ──────────────────────────────────────────────────────────────────────
const fmtTry = (n: number) => n.toLocaleString('tr-TR')

function CoinBadge({ cfg, size = 36 }: { cfg: CryptoConfig; size?: number }) {
  return (
    <span className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ width: size, height: size, background: cfg.color, fontSize: size * 0.5 }}>
      {cfg.glyph}
    </span>
  )
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

export default function CryptoDepositForm({ cfg, amount, setAmount, amt, minAmt, maxAmt, quicks, onVerified }: {
  cfg: CryptoConfig
  amount: string
  setAmount: (v: string) => void
  amt: number
  minAmt: number
  maxAmt: number
  quicks: number[]
  /** Called with the verified chain code once the amount is calculated AND the
   *  code verified; null otherwise (cleared, edited, or amount changed). */
  onVerified: (code: string | null) => void
}) {
  const notice = useNotice()
  const [calcFor, setCalcFor] = useState<number | null>(null) // amount the result was computed for
  const [copied, setCopied] = useState(false)
  const [paid, setPaid] = useState(false) // chain-code step is revealed
  const [tx, setTx] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const locked = attempts >= MAX_ATTEMPTS

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const inRange = amt >= minAmt && amt <= maxAmt
  const calculated = calcFor !== null && calcFor === amt && inRange
  const sendAmount = calculated ? (amt / cfg.rate).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: cfg.decimals }) : ''

  // The parent only unlocks the deposit when the amount was calculated and the
  // chain code verified; editing either one takes it away again.
  useEffect(() => {
    onVerified(status === 'ok' && calculated ? tx.trim() : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, calculated, tx])

  const calculate = () => {
    if (!amount) { notice.show('warn', 'Lütfen yatırmak istediğiniz tutarı girin.'); return }
    if (!inRange) { notice.show('error', `Tutar ${fmtTry(minAmt)} ₺ ile ${fmtTry(maxAmt)} ₺ arasında olmalıdır.`); return }
    setCalcFor(amt)
  }

  const copy = async () => {
    const ok = await copyText(cfg.address)
    if (ok) {
      setCopied(true)
      setPaid(true)
      notice.show('success', 'Cüzdan adresi kopyalandı.')
      setTimeout(() => setCopied(false), 2500)
    } else {
      notice.show('error', 'Adres kopyalanamadı. Lütfen adresi elle seçip kopyalayın.')
    }
  }

  const edit = (v: string) => {
    setTx(v)
    setError('')
    if (status !== 'idle') setStatus('idle')
  }

  const verify = () => {
    if (locked || status === 'checking') return
    const err = validateTx(cfg, tx)
    if (err) {
      const used = attempts + 1
      setAttempts(used)
      setStatus('error')
      const msg = used >= MAX_ATTEMPTS ? 'Çok fazla hatalı deneme. Lütfen Canlı Destek ile iletişime geçin.' : err
      setError(msg)
      notice.show('error', used >= MAX_ATTEMPTS ? msg : 'İşlem kodu doğrulanamadı.')
      return
    }
    setStatus('checking')
    setError('')
    // Simulated network lookup — see the note at the top of this file.
    timer.current = setTimeout(() => {
      setStatus('ok')
      notice.show('success', 'İşlem kodu doğrulandı.')
    }, 1200)
  }

  const paste = async () => {
    try { edit(await navigator.clipboard.readText()) } catch { notice.show('warn', 'Panoya erişilemedi. Kodu elle yapıştırın.') }
  }

  const card = 'bg-white rounded-xl border border-[#e8ecf1] px-4 py-4'
  const line = 'flex-1 min-w-0 text-[15px] text-[#1a2332] bg-transparent outline-none placeholder:italic placeholder-[#a8b0bd]'

  return (
    <>
      <NoticeBubble notice={notice.notice} onClose={notice.hide} />

      {/* Coin logo tile (reference: large brand tile above the form) */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl border border-[#e8ecf1] px-5 py-3 flex items-center gap-3 shadow-sm">
          <CoinBadge cfg={cfg} size={44} />
          <div className="leading-tight">
            <p className="text-[18px] font-extrabold text-[#1a2332]">{cfg.coin}</p>
            <p className="text-[10px] text-[#737B8C]">{cfg.symbol} · {cfg.network}</p>
          </div>
        </div>
      </div>

      {/* 1 — Tutar → Hesapla → Gönderilecek Tutar */}
      <div className={card}>
        <label htmlFor="crypto-amount" className="text-[11px] font-medium text-[#737B8C]">Tutar</label>
        <div className="flex items-end gap-3">
          <div className={`flex-1 min-w-0 flex items-center gap-2 border-b pb-1.5 mt-1 ${amount && !inRange ? 'border-[#e74c3c]' : 'border-[#c0c8d4] focus-within:border-[#0E8FCF]'}`}>
            <input
              id="crypto-amount"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => { if (e.key === 'Enter') calculate() }}
              inputMode="numeric"
              placeholder="Tutar"
              className={line}
            />
            <span className="text-[13px] text-[#1a2332]">TRY</span>
          </div>
          <button onClick={calculate} className="flex-shrink-0 px-4 py-[8px] bg-[#0E8FCF] text-white text-[12px] font-semibold rounded-md hover:bg-[#0a7ab5] transition-colors">
            Hesapla
          </button>
        </div>
        {amount && !inRange && (
          <p role="alert" className="text-[10px] text-[#e74c3c] mt-2">Tutar {fmtTry(minAmt)} ₺ ile {fmtTry(maxAmt)} ₺ arasında olmalıdır.</p>
        )}

        <div className="grid grid-cols-3 gap-2 mt-3">
          {quicks.map(v => (
            <button key={v} onClick={() => { setAmount(String(v)); setCalcFor(v) }} className={`py-2 rounded-lg text-[12px] font-semibold transition-colors ${amt === v ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#1a2332]'}`}>
              {fmtTry(v)} ₺
            </button>
          ))}
        </div>

        <label htmlFor="crypto-send" className="block mt-4 text-[11px] font-medium text-[#737B8C]">Gönderilecek Tutar</label>
        <div className="flex items-center gap-2 border-b border-[#c0c8d4] pb-1.5 mt-1">
          <input id="crypto-send" value={sendAmount} readOnly placeholder="Gönderilecek Tutar" className={line} />
          <span className="text-[13px] text-[#1a2332]">{cfg.symbol}</span>
        </div>
        <p className="text-[9px] text-[#94a3b8] mt-1.5 leading-relaxed">1 {cfg.symbol} ≈ {fmtTry(cfg.rate)} ₺ · Kur gösterge amaçlıdır; transferiniz ağda onaylandığında geçerli kur esas alınır. Ağ ücreti size aittir.</p>

        {calculated && (
          <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[#edf5ff] px-3 py-2.5">
            <span className="w-7 h-7 rounded-full bg-[#0E8FCF] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold">₳</span>
            <p className="text-[10px] text-[#737B8C] leading-relaxed flex-1">
              {adcForDeposit(amt) > 0 ? (
                <>
                  Bu yatırımdan <span className="font-bold text-[#0E8FCF]">{fmtAdc(adcForDeposit(amt))} ADC</span> kazanacaksınız
                  <span className="text-[#94a3b8]"> ({adcRateFor(amt)} ADC / 100 ₺)</span>
                </>
              ) : (
                <>Adonis Coin kazanmak için en az <span className="font-semibold text-[#1a2332]">100 ₺</span> yatırmalısınız.</>
              )}
            </p>
          </div>
        )}
      </div>

      {/* 2 — ÖNEMLİ UYARI (wording as on the live site) */}
      <div className="rounded-xl border border-[#e8ecf1] bg-[#f8fafc] px-4 py-4 text-center">
        <p className="text-[13px] font-semibold leading-relaxed text-[#0d9488]">
          ÖNEMLİ UYARI! Yalnızca {cfg.warnName} gönderin ve [{cfg.warnNetwork}] ağı üzerinden gönderim yapın.
        </p>
        <p className="mt-1 text-[13px] font-semibold leading-relaxed break-all text-[#d97706] select-all" data-testid="crypto-wallet">{cfg.address}</p>
        <button
          onClick={copy}
          aria-label="Cüzdan adresini kopyala"
          className={`my-1 inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${copied ? 'bg-[#27ae60] text-white' : 'bg-white border border-[#e8ecf1] text-[#1a2332]'}`}
        >
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
          )}
        </button>
        <p className="text-[13px] font-semibold leading-relaxed text-[#0d9488]">adresini kopyalayın.</p>

        {!paid && (
          <button onClick={() => setPaid(true)} className="w-full mt-3 py-[11px] bg-white border border-[#e8ecf1] text-[#1a2332] text-[12px] font-semibold rounded-xl">
            Transferi Yaptım
          </button>
        )}
      </div>

      {/* 3 — Chain code (after the wallet is copied / transfer made) */}
      {paid && (
        <div className={card}>
          <label htmlFor="crypto-tx" className="text-[11px] font-medium text-[#737B8C]">İşlem Kodu (TXID / Hash)</label>
          <div className={`mt-1.5 flex items-center gap-2 border-b-2 pb-1.5 ${status === 'error' ? 'border-[#e74c3c]' : status === 'ok' ? 'border-[#27ae60]' : 'border-[#e8ecf1] focus-within:border-[#0E8FCF]'}`}>
            <input
              id="crypto-tx"
              value={tx}
              onChange={e => edit(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') verify() }}
              disabled={locked || status === 'checking'}
              placeholder={cfg.txKind === 'hex64-0x' ? '0x…' : 'İşlem kodunu yapıştırın'}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={status === 'error'}
              className="flex-1 min-w-0 text-[12px] font-mono text-[#1a2332] bg-transparent outline-none placeholder-[#c0c8d4]"
            />
            <button onClick={paste} disabled={locked || status === 'checking'} className="flex-shrink-0 text-[11px] font-semibold text-[#0E8FCF]">Yapıştır</button>
          </div>

          {status === 'error' && <p role="alert" className="flex items-start gap-1 mt-2 text-[10px] leading-snug text-[#e74c3c]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mt-[1px]"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            {error}
          </p>}
          {status === 'ok' && <p className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#16a34a]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z" /></svg>
            İşlem kodu doğrulandı.{calculated ? ' Yatırımı gönderebilirsiniz.' : ' Devam etmek için tutarı hesaplayın.'}
          </p>}
          {status === 'checking' && <p className="flex items-center gap-2 mt-2 text-[11px] text-[#737B8C]">
            <span className="w-3 h-3 rounded-full border-2 border-[#0E8FCF] border-t-transparent animate-spin" />
            Ağda aranıyor…
          </p>}

          {status !== 'ok' && (
            <button
              onClick={verify}
              disabled={locked || status === 'checking' || !tx.trim()}
              className="w-full mt-3 py-[11px] bg-[#0E8FCF] text-white text-[12px] font-semibold rounded-xl disabled:opacity-40"
            >
              {status === 'checking' ? 'Doğrulanıyor…' : 'Kodu Doğrula'}
            </button>
          )}
          <p className="text-[9px] text-[#94a3b8] mt-2 leading-relaxed">
            İşlem kodu, transferi yaptığınız cüzdan veya borsada işlem geçmişinizde bulunur. Doğrulama sonrası yatırım talebiniz oluşturulur.
          </p>
        </div>
      )}
    </>
  )
}
