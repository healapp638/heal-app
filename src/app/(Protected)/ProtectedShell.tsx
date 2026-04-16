'use client'

import { ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import { lightTheme, darkTheme } from "@/theme/antdTheme"
import { useTheme } from "next-themes"
import ProtectedHeader from './ProtectedHeader'
import PageTransition from '@/components/animations/PageTransition'

export default function ProtectedShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  return (
    <ConfigProvider
      locale={enUS}
      theme={theme === "dark" ? darkTheme : lightTheme}
      componentSize="middle"
    >
      <div className="min-h-screen transition-colors p-4">

        {/* Header */}
        <ProtectedHeader />

        {/* Children with Page Transition */}
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </ConfigProvider>
  )
}
