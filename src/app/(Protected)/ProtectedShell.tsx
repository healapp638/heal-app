'use client'

import { ReactNode } from 'react'
import enUS from 'antd/locale/en_US'
import { ConfigProvider } from 'antd'
import { useTheme } from "next-themes"
import { lightTheme, darkTheme } from "@/theme/antdTheme"
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
