import 'antd/dist/reset.css'
import '../styles/global.css'

import { ReactNode } from 'react'
import { Inter, Poppins, Roboto } from 'next/font/google'
import Script from 'next/script'
import Providers from './providers'   // <-- client wrapper
import InstallPrompt from '@/components/features/pwa/InstallPrompt'
import ServiceWorkerRegistration from '@/components/features/pwa/ServiceWorkerRegistration'
import VersionUpdateNotification from '@/components/features/version/VersionUpdateNotification'
import OnlineStatusManager from '@/components/features/pwa/OnlineStatusManager'
import TopLoadingBar from '@/components/ui/feedback/TopLoadingBar'
import WakeLockProvider from '@/components/providers/WakeLockProvider'
import SplashScreen from '@/components/ui/feedback/SplashScreen'
import { DEFAULT_LANGUAGE, SHOW_INSTALL_PROMPT, SHOW_VERSION_UPDATE_NOTIFICATION } from '@/config'

// ---------- SEO METADATA ----------
export const metadata = {
  metadataBase: new URL("https://www.sachtech.com"),
  title: {
    default: "SachTech | Software Development, SaaS, Mobile & Web Solutions",
    template: "%s | SachTech",
  },
  description:
    "SachTech provides expert software development, SaaS solutions, mobile apps, and enterprise web applications.",
  robots: "index, follow",
  alternates: { canonical: "https://www.sachtech.com" },
  openGraph: {
    title: "SachTech",
    description: "Software, SaaS, Web & Mobile App Development Experts",
    url: "https://www.sachtech.com",
    siteName: "SachTech",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SachTech",
    description: "Build modern digital solutions.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Heal",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

// ---------- FONTS ----------
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-roboto',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
      <head>

        {/* EXTERNAL ERROR SHIELD - Suppresses extension-injected SyntaxErrors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  var handleExternalError = function(msg) {
                    if (msg && (
                      msg.includes('input:not[type=hidden]') || 
                      (msg.includes('querySelector') && msg.includes('not a valid selector'))
                    )) {
                      console.warn('🛡️ Dev Shield: Suppressed external error:', msg);
                      return true;
                    }
                    return false;
                  };

                  var originalError = window.onerror;
                  window.onerror = function(m, s, l, c, e) {
                    if (handleExternalError(m)) return true;
                    if (originalError) return originalError.apply(window, arguments);
                  };

                  window.addEventListener('unhandledrejection', function(event) {
                    var m = event.reason ? (event.reason.message || event.reason.toString()) : '';
                    if (handleExternalError(m)) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }, true);
                }
              })();
            `
          }}
        />
        {/* JSON-LD STRUCTURED DATA */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SachTech",
              url: "https://www.sachtech.com",
            }),
          }}
        />
      </head>

      <body id="app" className={`${inter.variable} ${poppins.variable} ${roboto.variable}`}>
        <Providers>
          <ServiceWorkerRegistration />
          <OnlineStatusManager />
          <TopLoadingBar />
          <WakeLockProvider />
          {SHOW_INSTALL_PROMPT && <InstallPrompt />}
          <SplashScreen>
            {children}
          </SplashScreen>
          {SHOW_VERSION_UPDATE_NOTIFICATION && <VersionUpdateNotification />}
        </Providers>
      </body>
    </html>
  )
}
