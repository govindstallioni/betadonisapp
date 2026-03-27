import { useState } from 'react'

const navItems = [
  {
    label: 'KEŞFET',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 2)">
          <polygon points="6.27 12.952 7.863 7.863 12.952 6.27 11.359 11.359" fill={active ? '#fff' : 'none'} stroke={active ? '#fff' : '#737B8C'} strokeWidth="1.5" />
          <circle cx="9.611" cy="9.611" r="9.611" fill="none" stroke={active ? '#fff' : '#737B8C'} strokeWidth="1.5" />
        </g>
      </svg>
    ),
  },
  {
    label: 'CANLI',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 128 128" fill={active ? '#fff' : '#737B8C'}>
        <path d="M64,48c-8.82,0-16,7.18-16,16s7.18,16,16,16s16-7.18,16-16S72.82,48,64,48z M64,72c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S68.41,72,64,72z M30.83,97.17c1.56,1.56,1.56,4.09,0,5.66c-0.78,0.78-1.8,1.17-2.83,1.17s-2.05-0.39-2.83-1.17C14.8,92.46,9.09,78.67,9.09,64s5.71-28.46,16.08-38.83c1.56-1.56,4.1-1.56,5.66,0c1.56,1.56,1.56,4.09,0,5.66C12.54,49.12,12.54,78.88,30.83,97.17z M44.83,44.83c-10.57,10.57-10.57,27.77,0,38.34c1.56,1.56,1.56,4.09,0,5.66C44.05,89.61,43.02,90,42,90s-2.05-0.39-2.83-1.17c-13.69-13.69-13.69-35.97,0-49.66c1.56-1.56,4.1-1.56,5.66,0C46.39,40.73,46.39,43.27,44.83,44.83z M118.91,64c0,14.67-5.71,28.46-16.08,38.83c-0.78,0.78-1.8,1.17-2.83,1.17s-2.05-0.39-2.83-1.17c-1.56-1.56-1.56-4.09,0-5.66c18.29-18.29,18.29-48.05,0-66.34c-1.56-1.56-1.56-4.09,0-5.66c1.56-1.56,4.1-1.56,5.66,0C113.2,35.54,118.91,49.33,118.91,64z M88.83,88.83C88.05,89.61,87.02,90,86,90s-2.05-0.39-2.83-1.17c-1.56-1.56-1.56-4.09,0-5.66c10.57-10.57,10.57-27.77,0-38.34c-1.56-1.56-1.56-4.09,0-5.66c1.56-1.56,4.1-1.56,5.66,0C102.52,52.86,102.52,75.14,88.83,88.83z" />
      </svg>
    ),
  },
  {
    label: 'KUPON',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 64 64" fill={active ? '#fff' : '#737B8C'}>
        <path d="M62.707,23.293l-22-22c-0.391-0.391-1.023-0.391-1.414,0l-38,38c-0.286,0.286-0.372,0.716-0.217,1.09S1.596,41,2,41h4v5c0,0.553,0.448,1,1,1h4v5c0,0.553,0.448,1,1,1h5v4c0,0.553,0.448,1,1,1h5v4c0,0.404,0.244,0.77,0.617,0.924C23.741,62.976,23.871,63,24,63c0.26,0,0.516-0.102,0.707-0.293l38-38C63.098,24.316,63.098,23.684,62.707,23.293z M24,56h-5v-4c0-0.553-0.448-1-1-1h-5v-5c0-0.553-0.448-1-1-1H8v-5c0-0.553-0.448-1-1-1H4.414L10,33.414L30.586,54L25,59.586V57C25,56.447,24.552,56,24,56z M32,52.586L11.414,32L40,3.414L60.586,24L32,52.586z" />
        <path d="M33.649 23.838c.548.547 1.278.848 2.056.848.778 0 1.509-.301 2.058-.849 1.133-1.135 1.132-2.98-.002-4.114l-1.798-1.798c-1.096-1.096-3.021-1.094-4.113-.001C31.302 18.472 31 19.202 31 19.98s.302 1.509.85 2.057L33.649 23.838zM48.038 25.635c.548.548 1.278.85 2.057.85.777 0 1.508-.302 2.056-.849.548-.548.851-1.278.85-2.058 0-.777-.302-1.508-.85-2.056l-1.8-1.8c-1.096-1.096-3.017-1.096-4.11 0-1.134 1.134-1.135 2.979-.001 4.114L48.038 25.635z" />
      </svg>
    ),
  },
  {
    label: 'Geçmiş',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 4.233 4.233">
        <g transform="matrix(.9291 0 0 .9291 -17.842 -2.3)">
          <path fill="none" stroke={active ? '#fff' : '#737B8C'} strokeLinecap="round" strokeLinejoin="round" d="M 20.024199,3.6070661 A 1.8520832,1.8520832 0 0 1 22.367615,3.1255956 1.8520832,1.8520832 0 0 1 23.230813,5.3568064 1.8520832,1.8520832 0 0 1 21.173521,6.5778561 1.8520832,1.8520832 0 0 1 19.628393,4.7513866" strokeWidth=".285" />
          <path fill="none" stroke={active ? '#fff' : '#737B8C'} strokeLinecap="round" strokeLinejoin="round" d="M21.393658 4.1139613v.877204h.783213M20.024199 2.9017046V3.6070661M20.729561 3.6070661H20.024199" strokeWidth=".285" />
        </g>
      </svg>
    ),
  },
  {
    label: 'Menü',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#fff' : '#737B8C'}>
        <path d="M8 3H6a2.99 2.99 0 0 0-2.119.881A2.99 2.99 0 0 0 3 6v2c0 .825.337 1.575.881 2.119A2.99 2.99 0 0 0 6 11h2a2.99 2.99 0 0 0 2.119-.881A2.99 2.99 0 0 0 11 8V6a2.99 2.99 0 0 0-.881-2.119A2.99 2.99 0 0 0 8 3zm10 0h-2a2.99 2.99 0 0 0-2.119.881A2.99 2.99 0 0 0 13 6v2c0 .825.337 1.575.881 2.119A2.99 2.99 0 0 0 16 11h2a2.99 2.99 0 0 0 2.119-.881A2.99 2.99 0 0 0 21 8V6a2.99 2.99 0 0 0-.881-2.119A2.99 2.99 0 0 0 18 3zM8 13H6a2.99 2.99 0 0 0-2.119.881A2.99 2.99 0 0 0 3 16v2c0 .825.337 1.575.881 2.119A2.99 2.99 0 0 0 6 21h2a2.99 2.99 0 0 0 2.119-.881A2.99 2.99 0 0 0 11 18v-2a2.99 2.99 0 0 0-.881-2.119A2.99 2.99 0 0 0 8 13zm10 0h-2a2.99 2.99 0 0 0-2.119.881A2.99 2.99 0 0 0 13 16v2c0 .825.337 1.575.881 2.119A2.99 2.99 0 0 0 16 21h2a2.99 2.99 0 0 0 2.119-.881A2.99 2.99 0 0 0 21 18v-2a2.99 2.99 0 0 0-.881-2.119A2.99 2.99 0 0 0 18 13z" />
      </svg>
    ),
  },
]

const menuItems = [
  {
    title: 'CANLI BAHİS',
    desc: 'Canlı etkinliklere bahis yapın',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 128 128" fill="#fff">
        <path d="M64,48c-8.82,0-16,7.18-16,16s7.18,16,16,16s16-7.18,16-16S72.82,48,64,48z M64,72c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S68.41,72,64,72z M30.83,97.17c1.56,1.56,1.56,4.09,0,5.66c-0.78,0.78-1.8,1.17-2.83,1.17s-2.05-0.39-2.83-1.17C14.8,92.46,9.09,78.67,9.09,64s5.71-28.46,16.08-38.83c1.56-1.56,4.1-1.56,5.66,0c1.56,1.56,1.56,4.09,0,5.66C12.54,49.12,12.54,78.88,30.83,97.17z M44.83,44.83c-10.57,10.57-10.57,27.77,0,38.34c1.56,1.56,1.56,4.09,0,5.66C44.05,89.61,43.02,90,42,90s-2.05-0.39-2.83-1.17c-13.69-13.69-13.69-35.97,0-49.66c1.56-1.56,4.1-1.56,5.66,0C46.39,40.73,46.39,43.27,44.83,44.83z" />
      </svg>
    ),
  },
  {
    title: 'MAÇ ÖNCESİ',
    desc: 'Yaklaşan etkinliklere bahis yapın',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    title: 'SANAL BAHİS',
    desc: 'En iyi Sanal bahis etkinlikleri',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z" />
      </svg>
    ),
  },
  {
    title: 'SLOTLAR',
    desc: 'En iyi slot oyunları',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
      </svg>
    ),
  },
  {
    title: 'CANLI CASİNO',
    desc: 'Kendinizi casinodaymış gibi hissedin',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
  },
  {
    title: 'CANLI OYUNLAR',
    desc: 'Size özel canlı oyunlar ile kazan',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z" />
      </svg>
    ),
  },
  {
    title: 'POKER',
    desc: 'Özel poker tavla okey canlı oyunlar',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: 'GOLDEN RACE',
    desc: 'Canlı oyunlar ile başla, hemen kazan.',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    ),
  },
  {
    title: 'ŞANS ÇARKI',
    desc: 'Ücretsiz çevirme hakkı ile her gün kazan!',
    color: '#0E8FCF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-9h10v2H7z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const [active, setActive] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (i: number) => {
    if (i === 4) {
      setMenuOpen(!menuOpen)
    } else {
      setMenuOpen(false)
      setActive(i)
    }
  }

  return (
    <>
      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[60] transition-all duration-300 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-white backdrop-blur-sm" />
        <div
          className={`relative h-full flex flex-col transition-transform duration-300 ${
            menuOpen ? 'translate-y-0' : 'translate-y-8'
          }`}
        >
          {/* Menu header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-[#0a1628] text-[18px] font-bold tracking-wide">MENÜ</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto px-4 pb-28">
            <div className="flex flex-col gap-2">
              {menuItems.map((item, i) => (
                <button
                  key={item.title}
                  className={`flex items-center gap-4 w-full p-3.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] active:scale-[0.98] transition-all duration-200`}
                  style={{
                    transitionDelay: menuOpen ? `${i * 30}ms` : '0ms',
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-[#0a1628] text-[13px] font-bold leading-tight">{item.title}</div>
                    <div className="text-[#0a1628]/50 text-[11px] mt-0.5 leading-tight">{item.desc}</div>
                  </div>
                  <svg className="ml-auto shrink-0 opacity-30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Customer service */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#0E8FCF]/20 border border-[#0E8FCF]/30 flex items-center gap-4"
              style={{
                transitionDelay: menuOpen ? `${menuItems.length * 30}ms` : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'all 200ms ease',
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#0E8FCF]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[#0a1628] text-[13px] font-bold leading-tight">Müşteri Hizmetleri</div>
                <div className="text-[#0a1628]/50 text-[11px] mt-0.5 leading-tight">Bizimle iletişime geçin, size yardımcı olalım.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
        <div className="bg-white shadow-[0_-2px_16px_rgba(0,0,0,0.08)] border-t border-[#e8ecf1]/60">
          <div className="flex items-end justify-around px-1 pt-1 pb-2">
            {navItems.map((item, i) => {
              const isCenter = i === 2
              const isActive = i === 4 ? menuOpen : i === active && !menuOpen
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(i)}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    isCenter ? 'relative -mt-5' : 'gap-[2px] pt-1'
                  }`}
                >
                  {isCenter ? (
                    <>
                      <div className="w-[52px] h-[52px] rounded-full bg-[#0E8FCF] flex items-center justify-center shadow-[0_4px_12px_rgba(14,143,207,0.4)]">
                        {item.icon(true)}
                      </div>
                      <span className="text-[9px] leading-none mt-[2px] text-[#0E8FCF] font-bold">
                        {item.label}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-[28px] h-[28px] flex items-center justify-center">
                        {item.icon(false)}
                      </div>
                      <span
                        className={`text-[9px] leading-none transition-all duration-300 ${
                          isActive ? 'text-[#0E8FCF] font-bold' : 'text-[#8e9bae] font-medium'
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
