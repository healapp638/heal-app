'use client'

import React from 'react'
import { useAppQuery } from '@/tanstack/useAppQuery'
import { QUERY_KEYS } from '@/tanstack/keys'

export default function DashboardClient() {
  const { data: user } = useAppQuery<any>({
    queryKey: [QUERY_KEYS.USER],
    url: 'admin/auth/me',
    options: {
      staleTime: Infinity,
    }
  })

  return (
    <div>
      <h1 className="font-poppins font-bold text-4xl">
        Hey
      </h1>
      <div className="p-4 bg-background ">
        Should change in dark mode
      </div>

      <p className="font-inter font-light ">
        Welcome back, {user?.name || 'User'} 👋
      </p>

      {user ? (
        <div className="mb-4 blackText">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name}</p>
        </div>
      ) : (
        <p className="text-red-500">User not found in state.</p>
      )}

    </div>
  )
}
