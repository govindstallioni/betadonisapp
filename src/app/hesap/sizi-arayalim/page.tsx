'use client'

import { PageShell } from '@/components/settings/SettingsUI'
import { useCallMe, CallMeSheet, CallMeLoginPrompt } from '@/components/CallMe'

// Hesabım › Sizi Arayalım — the account-menu entry sits under Bildirimler.
// Same launcher and login gate as the home-page card; only the framing differs.
export default function SiziArayalimPage() {
  const { formOpen, loginPrompt, launch, closeForm, closeLoginPrompt } = useCallMe()

  return (
    <PageShell title="Sizi Arayalım">
      <div className="mt-3 bg-white rounded-xl border border-[#e8ecf1] px-4 py-5 text-center">
        <div className="w-14 h-14 rounded-full bg-[#e6f3fb] flex items-center justify-center mx-auto">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <h2 className="text-[15px] font-bold text-[#1a2332] mt-3">Size özel bir görüşme planlayalım</h2>
        <p className="text-[11px] text-[#737B8C] mt-1.5 leading-relaxed">
          Detaylarınızı bırakın, müşteri temsilcimiz size uygun saatte ulaşsın.
        </p>
        <button
          onClick={launch}
          className="w-full h-[46px] mt-5 rounded-xl bg-[#0E8FCF] text-white text-[13px] font-bold active:scale-[0.99] transition-transform"
        >
          Formu Aç
        </button>
      </div>

      <ul className="mt-3 bg-white rounded-xl border border-[#e8ecf1] px-4 py-3 flex flex-col gap-2">
        {[
          'Talebiniz oluşturulduğunda size bir randevu numarası verilir.',
          'Seçtiğiniz saat aralığında sizi arıyoruz.',
          'Bilgileriniz KVKK kapsamında korunur, 3. taraflarla paylaşılmaz.',
        ].map(t => (
          <li key={t} className="flex items-start gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[#0E8FCF] mt-[6px] flex-shrink-0" />
            <span className="text-[11px] text-[#737B8C] leading-relaxed">{t}</span>
          </li>
        ))}
      </ul>

      {loginPrompt && <CallMeLoginPrompt onClose={closeLoginPrompt} />}
      {formOpen && <CallMeSheet onClose={closeForm} />}
    </PageShell>
  )
}
