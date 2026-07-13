import React from 'react'
import type { Metadata } from 'next'
import ForgotPasswordForm from './ForgotPasswordForm'

// Must never be statically prerendered/CDN-cached, or an already-authenticated
// user can be served this page without src/proxy.ts running its redirect.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Forgot Password ',
  description: 'Reset your Heal account password. Enter your email to receive a password reset link.',
  keywords: ['forgot password', 'reset password', 'password recovery'],
  robots: 'noindex, follow',
  openGraph: {
    title: 'Forgot Password',
    description: 'Reset your account password securely.',
    type: 'website',
  },
}

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />
}

export default ForgotPasswordPage
