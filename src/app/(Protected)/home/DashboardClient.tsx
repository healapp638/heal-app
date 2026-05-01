'use client'

import React from 'react'
import { Col, Row } from 'antd'
import { useAppQuery } from '@/tanstack/useAppQuery';
import { MUTATION_KEYS } from '@/tanstack/keys';
import { ENDPOINTS } from '@/Endpoints';
import { FaUser,FaUserFriends } from "react-icons/fa";


export default function DashboardClient() {

  const { data: DashboardData } = useAppQuery<any>({
    queryKey: [MUTATION_KEYS.ADMIN_DASHBOARD],
    url: ENDPOINTS.PRIVATE.ADMIN_DASHBOARD,
    options: { staleTime: 0 },
  });
  const userSummary = DashboardData?.data

  return (
    <div className='p-2 md:p-6'>
      <h1 className="text-3xl font-bold text-black">
        Heal <span className="text-maincolor">Dashboard</span>
      </h1>
      {userSummary && <Row gutter={[20, 20]}>
        <Col xs={24} md={24} lg={8} xl={8}>
          <div className='bg-maincolor! min-h-42 flex gap-4 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-maincolor!'>
            <div className="bg-maincolor! border-2 border-cream! p-4 rounded-xl h-fit mt-1">
              <FaUser className='text-cream! text-3xl' />
            </div>
            <div className="">
              <h3 className="text-cream font-bold ">Total Users</h3>
              <h5 className="text-[32px] text-cream font-bold ">{userSummary?.user_summary?.all_users?.toLocaleString() || 0}</h5>
            </div>
          </div>
        </Col>
        <Col xs={24} md={24} lg={8} xl={8}>
          <div className='bg-maincolor! min-h-42 flex gap-4 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-maincolor!'>
            <div className="bg-maincolor! border-2 border-cream! p-4 rounded-xl h-fit mt-1">
              <FaUserFriends className='text-cream! text-3xl' />
            </div>
            <div className="">
              <h3 className="text-cream font-bold ">Active Users</h3>
              <h5 className="text-[32px] text-cream font-bold ">{userSummary?.user_summary?.active_users?.toLocaleString() || 0}</h5>
            </div>
          </div>
        </Col>

      </Row>}
    </div>
  )
}
