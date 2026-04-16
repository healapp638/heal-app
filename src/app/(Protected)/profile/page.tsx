import { Metadata } from 'next'
import ProfileClient from './ProfileClient'

export const metadata: Metadata = {
  title: 'Profile | Your App Name',
  description: 'Manage your profile settings and personal information. Update your details, change your avatar, and customize your account preferences.',
  keywords: ['profile', 'user profile', 'account settings', 'personal information', 'user dashboard'],
  openGraph: {
    title: 'Profile | Your App Name',
    description: 'Manage your profile settings and personal information',
    type: 'profile',
    url: '/profile',
  },
  twitter: {
    card: 'summary',
    title: 'Profile | Your App Name',
    description: 'Manage your profile settings and personal information',
  },
  robots: {
    index: false, // Profile pages should not be indexed
    follow: true,
  },
}

export default function ProfilePage() {
  return <ProfileClient />
}