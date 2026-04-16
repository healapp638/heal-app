'use client'

import { ReactNode } from 'react'
import React from 'react'
import { AppLogo, ThemeSwitcher } from '@/components/ui'
import { SHOW_THEME_SWITCHER } from '@/config'
export default function CommonLayout({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen p-4">
      <div className="bg-card p-1 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <AppLogo />
          {SHOW_THEME_SWITCHER && <ThemeSwitcher />}
        </div>
      </div>
      {/* Optional: Admin header/nav */}
      {children}
    </div>
  )
}
