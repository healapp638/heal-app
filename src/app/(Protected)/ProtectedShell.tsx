'use client'

import { ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import { lightTheme, darkTheme } from "@/theme/antdTheme"
import { useTheme } from "next-themes"
import PageTransition from '@/components/animations/PageTransition'
import ProtectedCard from '@/components/commonCard/ProtectedCard'

export default function ProtectedShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  return (
    <ConfigProvider
      locale={enUS}
      theme={theme === "dark" ? darkTheme : lightTheme}
      componentSize="middle"
    >
      <div className="min-h-screen  bg-cream! scroll-smooth relative">

        {/* Header */}

        {/* Children with Page Transition */}
        <PageTransition>
          <ProtectedCard>
            {children}
          </ProtectedCard>
        </PageTransition>
      </div>
    </ConfigProvider>
  )
}
