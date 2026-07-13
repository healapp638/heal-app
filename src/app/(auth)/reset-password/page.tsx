import React from 'react'
import type { Metadata } from 'next'
import ResetPasswordForm from './ResetPasswordForm'

// Must never be statically prerendered/CDN-cached, or an already-authenticated
// user can be served this page without src/proxy.ts running its redirect.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Create a new password for your Heal account. Keep your account secure with a strong password.',
  keywords: ['reset password', 'create password', 'account security'],
  robots: 'noindex, follow',
  openGraph: {
    title: 'Reset Password',
    description: 'Secure your account with a new password.',
    type: 'website',
  },
}

const ResetPasswordPage = () => {
  return <ResetPasswordForm />
}

export default ResetPasswordPage
