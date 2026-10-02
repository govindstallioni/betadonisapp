'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  HOMEPAGE_BLOCKS, DEFAULT_ORDER, blockDef, loadHomepageLayout, saveHomepageLayout,
  type HomepageLayout,
} from '@/data/homepageLayout'

// ── Giriş Sayfası Düzeni (task 2) ────────────────────────────────────────────
// Reorder + show/hide the homepage block areas. Drag-and-drop on a touch
// screen tends to fight with vertical scrolling, so reordering here is done
// with up/down buttons instead — same end result, far more reliable on
// mobile, and the brief itself allows either a Settings screen or an
// on-page gesture, "whichever is easier."

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={value}
      className={`w-[40px] h-[22px] rounded-full flex items-center px-[2px] transition-colors flex-shrink-0 ${value ? 'bg-[#0E8FCF]' : 'bg-[#d0d5dd]'}`}
    >
      <div className={`w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0'}`} />
    </button>
  )
}

export default function HomepageLayoutScreen() {
  const router = useRouter()
  const [layout, setLayout] = useState<HomepageLayout>({ order: DEFAULT_ORDER, hidden: [] })
  const [saved, setSaved] = useState(false)

  useEffect(() => { setLayout(loadHomepageLayout()) }, [])

  const update = (next: HomepageLayout) => {
    setLayout(next)
    saveHomepageLayout(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const move = (id: string, dir: -1 | 1) => {
    const i = layout.order.indexOf(id)
    const j = i + dir
    if (j < 0 || j >= layout.order.length) return
    const order = [...layout.order]
    ;[order[i], order[j]] = [order[j], order[i]]
    update({ ...layout, order })
  }

  const toggleHidden = (id: string) => {
    const hidden = layout.hidden.includes(id) ? layout.hidden.filter(x => x !== id) : [...layout.hidden, id]
    update({ ...layout, hidden })
  }

  const resetDefault = () => update({ order: [...DEFAULT_ORDER], hidden: [] })

  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen pb-10">
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-30">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Giriş Sayfası Düzeni</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4 pt-4">
        <p className="text-[11px] text-[#737B8C] leading-relaxed px-1 pb-3">
          Ana sayfadaki bölümleri yukarı/aşağı oklarıyla yeniden sıralayın veya anahtarıyla açıp kapatın. Değişiklikler otomatik olarak kaydedilir.
        </p>

        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          {layout.order.map((id, i) => {
            const def = blockDef(id)
            if (!def) return null
            const hidden = layout.hidden.includes(id)
            return (
              <div key={id} className={`flex items-center gap-2.5 px-3 py-3 ${i < layout.order.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}>
                <div className="flex flex-col -my-1 flex-shrink-0">
                  <button
                    onClick={() => move(id, -1)}
                    disabled={i === 0}
                    aria-label={`${def.label} öğesini yukarı taşı`}
                    className="w-6 h-5 flex items-center justify-center disabled:opacity-25"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                  </button>
                  <button
                    onClick={() => move(id, 1)}
                    disabled={i === layout.order.length - 1}
                    aria-label={`${def.label} öğesini aşağı taşı`}
                    className="w-6 h-5 flex items-center justify-center disabled:opacity-25"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                </div>

                <span className="w-7 h-7 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#737B8C]">
                  {i + 1}
                </span>

                <p className={`flex-1 min-w-0 text-[13px] font-medium leading-tight ${hidden ? 'text-[#c0c8d4]' : 'text-[#1a2332]'}`}>
                  {def.label}
                  {!def.showInSports && (
                    <span className="block text-[9px] text-[#94a3b8] font-normal mt-[1px]">Sporlar görünümünde gizli</span>
                  )}
                </p>

                <Toggle value={!hidden} onChange={() => toggleHidden(id)} />
              </div>
            )
          })}
        </div>

        <button
          onClick={resetDefault}
          className="w-full mt-4 py-[12px] rounded-xl border border-[#e8ecf1] bg-white text-[12px] font-semibold text-[#737B8C] active:scale-[0.99] transition-transform"
        >
          Varsayılan Düzene Sıfırla
        </button>
      </div>

      {saved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-[#1a2332] text-white text-[12px] font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          Kaydedildi
        </div>
      )}
    </div>
  )
}
