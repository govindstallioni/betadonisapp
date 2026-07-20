'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import FavoriteStar from './FavoriteStar'

const SIMILAR = [
  { name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '/spotlight/1.png' },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/spotlight/2.png' },
  { name: 'Big Bass', provider: 'Pragmatic Play', image: '/spotlight/3.png' },
  { name: 'Book of Dead', provider: 'Play n GO', image: '/spotlight/4.png' },
  { name: 'Wolf Gold', provider: 'Pragmatic Play', image: '/spotlight/6.png' },
]

const gameHref = (name: string, img: string, provider: string) =>
  `/game?${new URLSearchParams({ name, img, provider }).toString()}`

export default function GameScreen() {
  const params = useSearchParams()
  const router = useRouter()
  const [launched, setLaunched] = useState<null | 'real' | 'demo'>(null)

  const name = params.get('name') || 'Oyun'
  const img = params.get('img') || '/spotlight/1.png'
  const provider = params.get('provider') || 'Pragmatic Play'

  return (
    <div className="max-w-[430px] mx-auto bg-[#eef2f7] min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-10 flex items-center gap-2">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h1 className="flex-1 text-center text-[15px] font-bold text-[#1a2332] truncate px-1">{name}</h1>
        <FavoriteStar
          size={20}
          inactiveStroke="#0E8FCF"
          activeColor="#0E8FCF"
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          item={{ type: 'game', id: `slot-${name}`, title: name, subtitle: provider, image: img, href: gameHref(name, img, provider) }}
        />
      </div>

      <div className="px-4 pt-4">
        {/* Game stage */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-sm">
          <img src={img} alt={name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25" />

          {launched ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0b1220]/85">
              <div className="w-9 h-9 rounded-full border-[3px] border-white/25 border-t-[#0E8FCF] animate-spin-slow" />
              <p className="text-white text-[12px] font-semibold">{launched === 'demo' ? 'Demo yükleniyor…' : 'Oyun yükleniyor…'}</p>
              <p className="text-white/50 text-[10px]">{provider}</p>
            </div>
          ) : (
            <>
              {/* Play button */}
              <button onClick={() => setLaunched('real')} className="absolute inset-0 flex items-center justify-center group">
                <span className="w-[64px] h-[64px] rounded-full bg-white/90 group-active:scale-95 transition-transform flex items-center justify-center shadow-lg">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="#0E8FCF"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </button>
              {/* Bottom info */}
              <div className="absolute left-3 bottom-3 right-3">
                <p className="text-white text-[16px] font-extrabold leading-tight drop-shadow">{name}</p>
                <p className="text-white/75 text-[11px] font-medium">{provider}</p>
              </div>
              <span className="absolute top-3 left-3 bg-[#0E8FCF] text-white text-[9px] font-bold px-2 py-[3px] rounded-full">POPÜLER</span>
            </>
          )}
        </div>

        {/* Play buttons */}
        <div className="flex gap-3 mt-4">
          <button onClick={() => setLaunched('real')} className="flex-1 py-[13px] bg-[#0E8FCF] text-white text-[13px] font-bold rounded-xl hover:bg-[#0a7ab5] transition-colors">
            Gerçek Oyna
          </button>
          <button onClick={() => setLaunched('demo')} className="flex-1 py-[13px] bg-white border border-[#0E8FCF] text-[#0E8FCF] text-[13px] font-bold rounded-xl hover:bg-[#f0f7ff] transition-colors">
            Demo Oyna
          </button>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl border border-[#e8ecf1] mt-4 overflow-hidden">
          <Info k="Sağlayıcı" v={provider} />
          <Info k="RTP" v="%96.5" />
          <Info k="Volatilite" v="Yüksek" />
          <Info k="Maks. Kazanç" v="5000x" />
          <Info k="Kategori" v="Video Slot" last />
        </div>

        {/* Similar games */}
        <p className="text-[13px] font-bold text-[#1a2332] mt-5 mb-2 px-1">Benzer Oyunlar</p>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {SIMILAR.filter(g => g.name !== name).map(g => (
            <Link key={g.name} href={gameHref(g.name, g.image, g.provider)} className="flex-shrink-0 w-[92px] active:opacity-70 transition-opacity">
              <div className="w-[92px] h-[92px] rounded-xl overflow-hidden border border-[#e8ecf1]">
                <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] font-semibold text-[#1a2332] mt-1.5 leading-tight line-clamp-1">{g.name}</p>
              <p className="text-[9px] text-[#737B8C] leading-tight truncate">{g.provider}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function Info({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${!last ? 'border-b border-[#f0f2f5]' : ''}`}>
      <span className="text-[12px] text-[#737B8C]">{k}</span>
      <span className="text-[12px] font-semibold text-[#1a2332]">{v}</span>
    </div>
  )
}
