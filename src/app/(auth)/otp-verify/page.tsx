import React from 'react'
import type { Metadata } from 'next'
import OTPForm from './OTPForm'

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
