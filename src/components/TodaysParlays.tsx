'use client'

import Link from 'next/link'
import SectionHeader from './SectionHeader'
import { liveAccumulators, prematchAccumulators, SportIcon, type Accumulator } from './accumulatorData'

function ParlayCard({ item, href }: { item: Accumulator; href: string }) {
  return (
    <Link href={href} className="flex-shrink-0 w-[190px] bg-white rounded-xl border border-[#e8ecf1] shadow-sm px-3 py-[10px] block">
      <div className="flex items-center gap-[3px] mb-[6px]">
        {item.sports.map((s, i) => <SportIcon key={i} emoji={s} />)}
      </div>
      <p className="text-[11px] font-bold text-[#1a2332] truncate">{item.name}</p>
      <div className="flex items-center justify-between mt-[6px]">
        <span className="text-[10px] text-[#737B8C]">Etkinlikler: <span className="font-medium text-[#1a2332]">{item.events}</span></span>
        <span className="text-[11px] font-bold text-[#0E8FCF] tabular-nums">{item.odds.toFixed(3)}</span>
      </div>
    </Link>
  )
}

export default function TodaysParlays() {
  return (
    <>
      <div className="px-4 pt-1">
        <SectionHeader title="Bugünün Canlı Kombinesi" badge="Spor" showAll href="/kupon/accumulator?tab=live" count={liveAccumulators.length} />
      </div>
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
        {liveAccumulators.map((item) => <ParlayCard key={item.id} item={item} href="/kupon/accumulator?tab=live" />)}
      </div>

      <div className="px-4 pt-1">
        <SectionHeader title="Bugünün Maç Öncesi Kombinesi" badge="Spor" showAll href="/kupon/accumulator?tab=prematch" count={prematchAccumulators.length} />
      </div>
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-4 pb-4">
        {prematchAccumulators.map((item) => <ParlayCard key={item.id} item={item} href="/kupon/accumulator?tab=prematch" />)}
      </div>
    </>
  )
}
