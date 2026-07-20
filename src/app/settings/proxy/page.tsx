'use client'

import { useState } from 'react'
import { PageShell, Card, Row, SectionLabel, Toggle } from '@/components/settings/SettingsUI'

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="px-3 py-2.5 border-b border-[#f0f2f5]">
      <label className="text-[10px] font-medium text-[#737B8C] block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]"
      />
    </div>
  )
}

export default function ProxyPage() {
  const [enabled, setEnabled] = useState(false)
  const [type, setType] = useState('HTTP')
  const [host, setHost] = useState('')
  const [port, setPort] = useState('')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [test, setTest] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle')

  const runTest = () => {
    if (!host || !port) { setTest('fail'); return }
    setTest('testing')
    // Simulate a connection test result deterministically
    setTimeout(() => setTest(host.includes('.') ? 'ok' : 'fail'), 900)
  }

  return (
    <PageShell title="Proxy Ayarları">
      <SectionLabel label="Bağlantı" />
      <Card>
        <Row
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>}
          title="Proxy Kullan"
          desc="Bağlantıyı bir proxy üzerinden yönlendir"
          right={<Toggle value={enabled} onChange={setEnabled} />}
          last
        />
      </Card>

      {enabled && (
        <>
          <SectionLabel label="Proxy Bilgileri" />
          <Card>
            <div className="px-3 py-2.5 border-b border-[#f0f2f5] flex items-center justify-between">
              <label className="text-[12px] font-medium text-[#1a2332]">Tür</label>
              <select value={type} onChange={e => setType(e.target.value)} className="text-[12px] font-medium text-[#1a2332] bg-[#edf5ff] border border-[#e8ecf1] rounded-lg px-[10px] py-[6px] outline-none">
                {['HTTP', 'HTTPS', 'SOCKS4', 'SOCKS5'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Field label="Sunucu (Host)" value={host} onChange={v => { setHost(v); setTest('idle') }} placeholder="ör. 127.0.0.1" />
            <Field label="Port" value={port} onChange={v => { setPort(v.replace(/\D/g, '')); setTest('idle') }} placeholder="ör. 8080" type="text" />
            <Field label="Kullanıcı Adı (opsiyonel)" value={user} onChange={setUser} placeholder="Kullanıcı adı" />
            <div className="px-3 py-2.5">
              <label className="text-[10px] font-medium text-[#737B8C] block mb-1">Şifre (opsiyonel)</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Şifre" className="w-full text-[13px] text-[#1a2332] bg-transparent outline-none placeholder-[#b0b8c4]" />
            </div>
          </Card>

          {test !== 'idle' && (
            <div className={`mt-3 rounded-xl px-3 py-2.5 text-[12px] font-medium ${
              test === 'testing' ? 'bg-[#edf5ff] text-[#0E8FCF]' : test === 'ok' ? 'bg-[#e8f5e9] text-[#27ae60]' : 'bg-[#fde8e8] text-[#e74c3c]'
            }`}>
              {test === 'testing' ? 'Bağlantı test ediliyor…' : test === 'ok' ? '✓ Bağlantı başarılı' : '✕ Bağlantı kurulamadı. Bilgileri kontrol edin.'}
            </div>
          )}

          <div className="flex gap-3 mt-3">
            <button onClick={runTest} className="flex-1 py-[12px] bg-white border border-[#0E8FCF] text-[#0E8FCF] text-[13px] font-semibold rounded-xl hover:bg-[#f0f7ff] transition-colors">
              Bağlantıyı Test Et
            </button>
            <button className="flex-1 py-[12px] bg-[#0E8FCF] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors">
              Kaydet
            </button>
          </div>
        </>
      )}
    </PageShell>
  )
}
