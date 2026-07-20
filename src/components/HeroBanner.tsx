'use client'

import { useState } from 'react'

const banners = [
  {
    title: '',
    bg: 'url(/banners/123434.jpg) center/cover no-repeat',
    decorColor: 'transparent',
  },
  {
    title: "",
    bg: 'url(/banners/123435.jpg) center/cover no-repeat',
    decorColor: 'rgba(255,255,255,0.1)',
  },
  {
    title: '',
    bg: 'url(/banners/8_2729.png) center/cover no-repeat',
    decorColor: 'rgba(255,255,255,0.08)',
  },
  {
    title: '',
    bg: 'url(/banners/34545.png) center/cover no-repeat',
    decorColor: 'rgba(255,255,255,0.08)',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  return (
    <div>
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
        {banners.map((banner, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className="snap-start flex-shrink-0 w-[72%] h-[130px] rounded-2xl p-4 flex flex-col justify-end cursor-pointer relative overflow-hidden"
            style={{ background: banner.bg }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
              style={{ background: banner.decorColor }}
            />
            <div
              className="absolute top-6 -right-4 w-16 h-16 rounded-full"
              style={{ background: banner.decorColor }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full"
              style={{ background: banner.decorColor }}
            />
            <p className="text-[15px] font-bold text-white leading-[1.2] relative z-10 whitespace-pre-line drop-shadow-sm">
              {banner.title}
            </p>
          </div>
        ))}
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-[5px] mt-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-[18px] h-[5px] bg-pill-active'
                : 'w-[5px] h-[5px] bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
