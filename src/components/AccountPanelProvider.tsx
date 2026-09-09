'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface AccountPanelContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const AccountPanelContext = createContext<AccountPanelContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export function useAccountPanel() {
  return useContext(AccountPanelContext)
}

export default function AccountPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <AccountPanelContext.Provider value={{ isOpen, open, close }}>
      {children}
    </AccountPanelContext.Provider>
  )
}
