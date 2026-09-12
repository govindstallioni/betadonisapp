import type { Metadata, Viewport } from 'next'
import ThemeProvider from '@/components/ThemeProvider'
import SplashGate from '@/components/SplashGate'
import FavoritesProvider from '@/components/FavoritesProvider'
import AuthProvider from '@/components/AuthProvider'
import BetSlipProvider from '@/components/BetSlipProvider'
import BetSlipModal from '@/components/BetSlipModal'
import PromoBubble from '@/components/PromoBubble'
import WheelGuestBubble from '@/components/WheelGuestBubble'
import WelcomeBubble from '@/components/WelcomeBubble'
import NotificationBubble from '@/components/NotificationBubble'
import SiteAddressBanner from '@/components/SiteAddressBanner'
import LiveSupportWidget from '@/components/LiveSupportWidget'
import MessagesProvider from '@/components/MessagesProvider'
import NotificationsProvider from '@/components/NotificationsProvider'
import AccountPanelProvider from '@/components/AccountPanelProvider'
import SecurityProvider from '@/components/SecurityProvider'
import AdcProvider from '@/components/AdcProvider'
import AccountPanel from '@/components/AccountPanel'
import './globals.css'

// Runs before first paint: applies saved theme and arms the launch splash
// (once per session) so first-time users never flash the home screen.
const preloadScript = `(function(){try{var d=document.documentElement;if(localStorage.getItem('theme')==='dark')d.classList.add('dark');if(!sessionStorage.getItem('bta_splash'))d.setAttribute('data-splash','on');}catch(e){}})();`

export const metadata: Metadata = {
  title: 'BetAdonis',
  description: 'BetAdonis - Sports Betting & Casino',
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadScript }} />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <LiveSupportWidget />
        <ThemeProvider>
          <SiteAddressBanner />
          <AuthProvider>
            <MessagesProvider>
              <NotificationsProvider>
                <FavoritesProvider>
                  <BetSlipProvider>
                    <AccountPanelProvider>
                      <SecurityProvider>
                        <AdcProvider>
                          <SplashGate>
                            {children}
                          </SplashGate>
                          <BetSlipModal />
                          <PromoBubble />
                          <WheelGuestBubble />
                          <WelcomeBubble />
                          <NotificationBubble />
                          <AccountPanel />
                        </AdcProvider>
                      </SecurityProvider>
                    </AccountPanelProvider>
                  </BetSlipProvider>
                </FavoritesProvider>
              </NotificationsProvider>
            </MessagesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
