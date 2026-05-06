'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { Toaster } from 'react-hot-toast'
import enUS from 'antd/locale/en_US'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useTheme } from 'next-themes'
import { lightTheme, darkTheme } from '@/theme/antdTheme'
import AppThemeProvider from '@/providers/ThemeProvider'
// import CentralLoader from '@/components/ui/feedback/CentralLoader'
import { persistor, store } from '@/redux/store/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider>
      <AntdRegistry>
        <InnerProviders>{children}</InnerProviders>
      </AntdRegistry>
    </AppThemeProvider>
  )
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // To avoid hydration mismatch, we render the light theme on the server (or matching defaultTheme)
  // and only switch to stored preference after mount.
  const isDark =
    mounted &&
    (theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark'))

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            locale={enUS}
            componentSize="large"
            theme={isDark ? darkTheme : lightTheme}
          >
            <Toaster position="top-right" />
            {/* <CentralLoader /> */}
            {children}
          </ConfigProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}
