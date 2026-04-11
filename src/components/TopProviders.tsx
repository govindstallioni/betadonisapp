export default function TopProviders() {
  return (
    <div>
      <div className="rounded-xl overflow-hidden cursor-pointer hover:scale-[1.005] active:scale-[0.99] transition-transform relative h-[95px]">
        <img src="/providers/01.png" alt="Pragmatic Play" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <img src="/providers/pragmatic.png" alt="Pragmatic Play" className="absolute top-2.5 right-3 h-[14px] object-contain brightness-0 invert drop-shadow-lg" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2.5">
          <span className="text-[14px] font-medium text-white leading-none drop-shadow-lg block">Pragmatic</span>
          <span className="text-[9px] font-medium text-white/90 mt-0.5 block drop-shadow-lg">Ayın Sağlayıcısı</span>
        </div>
      </div>
    </div>
  )
}
