'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TableCard } from './LiveCasinoScreen'
import { CATEGORY_SLUGS, tablesFor } from './liveCasinoData'

// Task 17: dedicated page per live-casino category (menu tab / "Tümü"),
// mirroring how /slots/[slug] already works for slots.
export default function LiveCasinoCategoryScreen() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = typeof params.category === 'string' ? params.category : Array.isArray(params.category) ? params.category[0] : ''
  const entry = CATEGORY_SLUGS.find(c => c.slug === slug)
  const title = entry?.label
  // Task 25: the Sağlayıcılar directory links here with ?provider=NAME.
  const providerFilter = searchParams.get('provider')
  const tables = title ? tablesFor(slug).filter(t => !providerFilter || t.provider === providerFilter) : []

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative">
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-[16px] font-bold text-[#1a2332] leading-tight">{providerFilter ?? (title === 'Tümü' ? 'Tüm Masalar' : (title ?? 'Kategori'))}</h1>
            {title && <p className="text-[10px] text-[#737B8C] leading-tight">{tables.length} masa</p>}
          </div>
          {/* Stays available on every category page, not just the live-casino home (task 17). */}
          <Link href="/favorites" aria-label="Favorilerim" className="w-8 h-8 flex items-center justify-center">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </Link>
        </div>
      </div>

      {!title ? (
        <div className="pt-10 text-center text-[13px] text-[#737B8C]">Kategori bulunamadı.</div>
      ) : tables.length === 0 ? (
        <div className="pt-10 text-center text-[13px] text-[#737B8C]">Bu kategoride henüz masa yok.</div>
      ) : (
        <div className="px-4 pt-4 pb-24">
          <div className="grid grid-cols-2 gap-[8px]">
            {tables.map((t, i) => <TableCard key={`${t.name}-${i}`} t={t} />)}
          </div>
        </div>
      )}
    </div>
  )
}
