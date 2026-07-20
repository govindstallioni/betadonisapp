import type { Metadata, Viewport } from 'next'
import ThemeProvider from '@/components/ThemeProvider'
<<<<<<< HEAD
import SplashGate from '@/components/SplashGate'
import FavoritesProvider from '@/components/FavoritesProvider'
import AuthProvider from '@/components/AuthProvider'
import BetSlipProvider from '@/components/BetSlipProvider'
import BetSlipModal from '@/components/BetSlipModal'
import './globals.css'

// Runs before first paint: applies saved theme and arms the launch splash
// (once per session) so first-time users never flash the home screen.
const preloadScript = `(function(){try{var d=document.documentElement;if(localStorage.getItem('theme')==='dark')d.classList.add('dark');if(!sessionStorage.getItem('bta_splash'))d.setAttribute('data-splash','on');}catch(e){}})();`

=======
import './globals.css'

>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
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
<<<<<<< HEAD
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadScript }} />
=======
    <html lang="tr">
      <head>
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
<<<<<<< HEAD
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
=======
          {children}
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
        </ThemeProvider>
      </body>
    </html>
  )
}
