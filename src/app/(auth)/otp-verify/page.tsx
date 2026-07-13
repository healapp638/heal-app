import React from 'react'
import type { Metadata } from 'next'
import OTPForm from './OTPForm'

// Must never be statically prerendered/CDN-cached, or an already-authenticated
// user can be served this page without src/proxy.ts running its redirect.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'OTP Verification ',
  description: 'Verify your identity with a one-time password (OTP) for secure login to Heal.',
  keywords: ['OTP verification', 'two-factor authentication', 'secure login'],
  robots: 'noindex, follow',
  openGraph: {
    title: 'OTP Verification',
    description: 'Complete two-factor authentication securely.',
    type: 'website',
  },
}

const OTPPage = () => {
  return <OTPForm />
}

export default OTPPage
