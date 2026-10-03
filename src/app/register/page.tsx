'use client'

import { Suspense } from 'react'
import RegisterScreen from '@/components/RegisterScreen'

export default function RegisterPage() {
  // RegisterScreen reads ?method= (useSearchParams), which needs a Suspense
  // boundary for the static export.
  return (
    <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
      <RegisterScreen />
    </Suspense>
  )
}
