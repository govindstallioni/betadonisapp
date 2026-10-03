'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { OptionSheet } from '@/components/AuthWidgets'
import { adcForDeposit, adcRateFor, fmtAdc } from '@/data/adc'

// ── Online bank transfer deposit (v6.6 task 36) ─────────────────────────────
// onlinebankahavalesimenu.png → the method group (Yapı Kredi, Ziraat, Akbank,
// TEB) is declared in DepositScreen.
// tutarsec.png / onlinetutar.png → OnlineAmountSelect: the amount is picked
// from a dropdown, not typed.
// piframe.png → PaymentIframeModal: the payment form opens in an iframe popup.
//
// There is no payment gateway in this prototype. While PAYMENT_IFRAME_URL is
// empty the iframe shows a built-in mock gateway page (srcDoc) that never asks
// for card or internet-banking credentials. To go live, set PAYMENT_IFRAME_URL to the
// gateway's hosted-payment page; it receives ?ref=&amount=&bank= and must
// post { type: 'betadonis-payment', status: 'success' | 'cancel' } back to the
// parent window, which is checked against the URL's origin.

export const PAYMENT_IFRAME_URL: string = ''

// The exact choices the live site offers in its "Tutarı Seçiniz" dropdown
// (tutarsec.png) — an irregular list on purpose, so it is copied, not computed.
const AMOUNTS = [1088, 1250, 1500, 1518, 1550, 1798, 1845, 1850, 1992, 2000, 25000, 44300, 45000, 47300, 80000, 81000, 90000, 100000]

const fmt = (n: number) => n.toLocaleString('tr-TR')
/** The dropdown prints amounts the way the site does: "1088.00 TRY". */
const fmtOpt = (n: number) => `${n.toFixed(2)} TRY`

/** Dropdown for the deposit amount (tutarsec.png). */
export function OnlineAmountSelect({ amount, onChange, min, max }: {
  amount: string
  onChange: (v: string) => void
  min: number
  max: number
}) {
  const [open, setOpen] = useState(false)
  const options = useMemo(
    () => AMOUNTS.filter(v => v >= min && v <= max).map(v => ({ value: String(v), label: fmtOpt(v) })),
    [min, max],
  )
  const amt = Number(amount) || 0

  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] px-4 py-4">
      <label className="text-[11px] font-medium text-[#737B8C]">Tutar</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="w-full mt-1.5 flex items-center justify-between border-b-2 border-[#0E8FCF] pb-1.5 text-left"
      >
        <span className={`text-[22px] font-bold ${amt ? 'text-[#1a2332]' : 'text-[#c0c8d4]'}`}>
          {amt ? fmtOpt(amt) : 'Tutarı Seçiniz'}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <p className="text-[10px] text-[#737B8C] mt-2">Min {fmt(min)} ₺ · Max {fmt(max)} ₺</p>

      {amt >= min && amt <= max && (
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

      {open && <OptionSheet title="Tutarı Seçiniz" options={options} value={amount} onSelect={onChange} onClose={() => setOpen(false)} />}
    </div>
  )
}

// ── Payment iframe popup ────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

/** Wordmark colours for the bank tile inside the mock gateway page. */
function bankTile(bank: string): { bg: string; fg: string; text: string } {
  const b = bank.toLowerCase()
  if (b.includes('yapı')) return { bg: '#1e4fa1', fg: '#fff', text: 'YapıKredi' }
  if (b.includes('ziraat')) return { bg: '#e30613', fg: '#fff', text: 'ZİRAAT' }
  if (b.includes('akbank')) return { bg: '#e30613', fg: '#fff', text: 'AKBANK' }
  if (b.includes('teb')) return { bg: '#ececec', fg: '#2b2b2b', text: 'TEB' }
  return { bg: '#1273c7', fg: '#fff', text: bank }
}

/** Length of the "kalan süre" countdown on the payment page, in seconds. */
const PAY_SECONDS = 100

/** Built-in stand-in for the gateway's hosted payment page, laid out like the
 *  reference (piframe.png): bank tile, Hazır / İşlemde / Sonuçlandı steps,
 *  countdown ring, read-only bank + amount, VAZGEÇ / BAŞLAT.
 *
 *  The reference page asks for the customer's internet-banking login. That
 *  belongs on the provider's own hosted page and must never be collected by
 *  our code, so the mock leaves those two fields out and says so. */
function mockGatewayHtml(bank: string, amount: number, ref: string) {
  const t = bankTile(bank)
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f5f7fa;color:#1a2332;text-align:center}
.top{background:#fff;padding:14px 14px 16px}
.logo{border:3px solid #a9d8f5;border-radius:12px;padding:6px 6px 4px;background:#d6ecfa}
.logo .in{background:#fff;border-radius:8px;height:62px;display:flex;align-items:center;justify-content:center}
.tile{padding:8px 22px;border-radius:8px;font-weight:800;font-size:20px;letter-spacing:.5px}
.logo small{display:block;color:#fff;font-size:10px;letter-spacing:2px;font-weight:700;margin-top:4px}
.steps{display:flex;margin:12px 0 4px;gap:2px}.steps div{flex:1;font-size:12px;padding:8px 4px;background:#e9edf2;color:#737b8c;clip-path:polygon(0 0,88% 0,100% 50%,88% 100%,0 100%,8% 50%)}
.steps .on{background:#3aa3e3;color:#fff;font-weight:700}.steps .done{background:#bfe3f7;color:#1a2332}
.lead{font-size:13px;color:#737b8c;margin:10px 0 6px}
.ring{position:relative;width:78px;height:78px;margin:0 auto}.ring svg{transform:rotate(-90deg)}
.ring b{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:22px;line-height:1}.ring b i{font-size:11px;font-style:normal;color:#737b8c}
.pill{display:inline-block;background:#d0d5dc;color:#fff;border-radius:999px;padding:4px 22px;font-size:11px;font-weight:700;margin-top:8px}
.body{padding:14px}
.info{background:#d6ecfa;color:#1d79b8;border-radius:6px;padding:12px;font-size:12px;line-height:1.5;margin-bottom:12px}
.row{display:flex;align-items:center;gap:12px;background:#fff;border-radius:6px;padding:12px;margin-bottom:8px;font-weight:700;font-size:14px;color:#555;text-align:center}.row span:last-child{flex:1}
.demo{background:#fef3c7;color:#92400e;border-radius:6px;padding:10px;font-size:11px;line-height:1.5;margin:4px 0 12px;text-align:left}
.btns{display:flex;gap:12px}button{flex:1;border:0;border-radius:6px;padding:14px 8px;font-size:14px;font-weight:700;color:#fff;cursor:pointer}
.no{background:#ff5f7e}.go{background:#7cc52b}.go:disabled,.no:disabled{opacity:.5}
.sp{width:30px;height:30px;border:3px solid #3aa3e3;border-top-color:transparent;border-radius:50%;animation:s 1s linear infinite;margin:26px auto 10px}@keyframes s{to{transform:rotate(360deg)}}
.ok .c{width:64px;height:64px;border-radius:50%;background:#e8f5e9;margin:22px auto 10px;display:flex;align-items:center;justify-content:center}
</style></head><body>
<div class="top">
  <div class="logo"><div class="in"><span class="tile" style="background:${t.bg};color:${t.fg}">${esc(t.text)}</span></div><small>ONLİNE BANKA HAVALESİ</small></div>
  <div class="steps"><div class="on" id="s1">Hazır</div><div id="s2">İşlemde</div><div id="s3">Sonuçlandı</div></div>
  <p class="lead" id="lead">bu adımı tamamlamak için kalan süre</p>
  <div class="ring"><svg width="78" height="78"><circle cx="39" cy="39" r="34" fill="none" stroke="#e5e7eb" stroke-width="6"/><circle id="arc" cx="39" cy="39" r="34" fill="none" stroke="#7cc52b" stroke-width="6" stroke-linecap="round" stroke-dasharray="213.6" stroke-dashoffset="0"/></svg><b><span id="sec">${PAY_SECONDS}</span><i>sec</i></b></div>
  <span class="pill">Güvenli Ödeme</span>
</div>
<div class="body" id="app">
  <div class="info">*İnternet Bankacılığı, müşteri bilgilerinize girerek yatırım işleminize devam edebilirsiniz.</div>
  <div class="row"><span>🏦</span><span>${esc(bank)}</span></div>
  <div class="row"><span>₺</span><span>${esc(String(amount))}</span></div>
  <div class="demo"><b>Demo ödeme sayfası.</b> Gerçek ödemede internet bankacılığı girişi, ödeme sağlayıcısının kendi güvenli sayfasında yapılır. Bu demoda şifre ve kimlik bilgisi istenmez. Referans: ${esc(ref)}</div>
  <div class="btns"><button class="no" id="no" type="button">✕ VAZGEÇ</button><button class="go" id="go" type="button">BAŞLAT →</button></div>
</div>
<script>
var left=${PAY_SECONDS},total=${PAY_SECONDS},busy=false,over=false;
function send(s){parent.postMessage({type:'betadonis-payment',status:s,ref:${JSON.stringify(ref)}},'*')}
function step(n){['s1','s2','s3'].forEach(function(id,i){var e=document.getElementById(id);e.className=i+1<n?'done':i+1===n?'on':''})}
var tick=setInterval(function(){
  if(busy)return;left--;if(left<0)left=0;
  document.getElementById('sec').textContent=left;
  document.getElementById('arc').setAttribute('stroke-dashoffset',String(213.6*(1-left/total)));
  if(left===0&&!over){over=true;clearInterval(tick);
    document.getElementById('app').innerHTML='<p style="font-size:14px;color:#e74c3c;font-weight:700;margin-top:30px">Süre doldu. İşlem iptal edildi.</p>';
    setTimeout(function(){send('cancel')},1500)}
},1000);
document.getElementById('no').onclick=function(){clearInterval(tick);send('cancel')};
document.getElementById('go').onclick=function(){
  busy=true;step(2);document.getElementById('lead').textContent='işleminiz yapılıyor';
  document.getElementById('app').innerHTML='<div class="sp"></div><p style="font-size:13px;color:#737b8c">Ödeme işleniyor…</p>';
  setTimeout(function(){
    clearInterval(tick);step(3);document.getElementById('lead').textContent='işlem sonuçlandı';
    document.getElementById('app').innerHTML='<div class="ok"><div class="c"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><b style="font-size:16px">Ödeme alındı</b><p style="font-size:12px;color:#737b8c">Yönlendiriliyorsunuz…</p></div>';
    setTimeout(function(){send('success')},1000);
  },2000);
};
</script></body></html>`
}

export function PaymentIframeModal({ bank, amount, reference, onSuccess, onClose }: {
  bank: string
  amount: number
  reference: string
  onSuccess: () => void
  onClose: () => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const latest = useRef({ onSuccess, onClose })
  latest.current = { onSuccess, onClose }
  const [loaded, setLoaded] = useState(false)

  const src = PAYMENT_IFRAME_URL
    ? `${PAYMENT_IFRAME_URL}${PAYMENT_IFRAME_URL.includes('?') ? '&' : '?'}ref=${encodeURIComponent(reference)}&amount=${amount}&bank=${encodeURIComponent(bank)}`
    : null
  const srcDoc = useMemo(() => (src ? undefined : mockGatewayHtml(bank, amount, reference)), [src, bank, amount, reference])

  useEffect(() => {
    const expectedOrigin = PAYMENT_IFRAME_URL ? new URL(PAYMENT_IFRAME_URL).origin : null
    const onMessage = (e: MessageEvent) => {
      // Only the payment frame may speak, and a hosted gateway only from its own origin.
      if (e.source !== frame.current?.contentWindow) return
      if (expectedOrigin && e.origin !== expectedOrigin) return
      const d = e.data
      if (!d || d.type !== 'betadonis-payment') return
      if (d.status === 'success') latest.current.onSuccess()
      else if (d.status === 'cancel') latest.current.onClose()
    }
    window.addEventListener('message', onMessage)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') latest.current.onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('message', onMessage); window.removeEventListener('keydown', onKey) }
  }, [])

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/55" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ödeme"
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[430px] bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ height: 'min(640px, 92vh)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8ecf1] flex-shrink-0">
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[#1a2332] truncate">{bank}</p>
            <p className="text-[10px] text-[#737B8C]">Güvenli ödeme · {fmt(amount)} ₺</p>
          </div>
          <button onClick={onClose} aria-label="Kapat" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#737B8C]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="relative flex-1 bg-[#f5f7fa]">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-7 h-7 rounded-full border-[3px] border-[#0E8FCF] border-t-transparent animate-spin" />
            </div>
          )}
          <iframe
            ref={frame}
            title={`${bank} ödeme formu`}
            src={src ?? undefined}
            srcDoc={srcDoc}
            // No same-origin: the page can run and post forms but cannot touch our storage or cookies.
            sandbox="allow-scripts allow-forms allow-popups"
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  )
}
