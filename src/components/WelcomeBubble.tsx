'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import SlideUpBubble from './SlideUpBubble'

// Post-registration welcome bubble (bildirimbalonu.PNG), sliding up from the
// bottom once — RegisterScreen.tsx's BottomButton sets this one-shot flag
// right before logging the new user in.
const LS_PENDING = 'bta_welcome_bubble_pending'

export default function WelcomeBubble() {
  const { loaded, isLoggedIn } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!loaded || !isLoggedIn) return
    try {
      if (localStorage.getItem(LS_PENDING)) {
        setOpen(true)
        localStorage.removeItem(LS_PENDING)
      }
    } catch {}
  }, [loaded, isLoggedIn])

  const close = () => setOpen(false)

  if (!open) return null

  return (
    <SlideUpBubble onClose={close}>
      <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-[#d0d5dd] rounded-full" /></div>
      <div className="px-5 pt-2 pb-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-3 text-[28px]">🎉</div>
        <p className="text-[17px] font-bold text-[#1a2332]">Hoş geldiniz!</p>
        <p className="text-[12px] text-[#737B8C] mt-[6px] leading-relaxed px-2">
          Betadonis ailesine katıldığınız için teşekkürler. İlk yatırımınıza özel bonusunuz hesabınıza tanımlanmıştır.
        </p>
        <div className="flex flex-col gap-[10px] mt-5">
          <button
            onClick={() => { close(); router.push('/kupon/deposit') }}
            className="w-full h-[44px] rounded-full bg-[#0E8FCF] text-white text-[13px] font-bold tracking-wide"
          >
            Para Yatır
          </button>
          <button onClick={close} className="w-full h-[44px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[13px] font-bold tracking-wide">
            Kapat
          </button>
        </div>
      </div>
    </SlideUpBubble>
  )
}
