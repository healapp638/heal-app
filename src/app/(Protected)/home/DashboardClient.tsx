'use client'

import React from 'react'

export default function DashboardClient() {
  // const { data: user } = useAppQuery<any>({
  //   queryKey: [QUERY_KEYS.USER],
  //   url: 'admin/auth/me',
  //   options: {
  //     staleTime: Infinity,
  //   }
  // })

  return (
    <div>
      <h1 className="text-3xl font-bold text-black">
        Heal <span className="text-maincolor">Dashboard</span>
      </h1>
    </div>
  )
}
