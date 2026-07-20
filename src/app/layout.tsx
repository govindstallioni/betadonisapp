import type { Metadata, Viewport } from 'next'
import ThemeProvider from '@/components/ThemeProvider'
import SplashGate from '@/components/SplashGate'
import FavoritesProvider from '@/components/FavoritesProvider'
import AuthProvider from '@/components/AuthProvider'
import BetSlipProvider from '@/components/BetSlipProvider'
import BetSlipModal from '@/components/BetSlipModal'
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
      <body>
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              <BetSlipProvider>
                <SplashGate>
                  {children}
                </SplashGate>
                <BetSlipModal />
              </BetSlipProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
