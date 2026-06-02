'use client'

import React from 'react'
import { Col, Row } from 'antd'
import { ENDPOINTS } from '@/Endpoints';
import { MUTATION_KEYS } from '@/tanstack/keys';
import { useAppQuery } from '@/tanstack/useAppQuery';
import { FaUser, FaUserFriends, FaUserSlash } from "react-icons/fa";
import { RegistrationAreaChart, DonutChart, ThemeEngagementChart } from './DashboardCharts';

export default function DashboardClient() {
  const [activateButton, setActivateButton] = React.useState<string>("1M")
  const { data: DashboardData } = useAppQuery<any>({
    queryKey: [MUTATION_KEYS.ADMIN_DASHBOARD, activateButton],
    url: ENDPOINTS.PRIVATE.ADMIN_DASHBOARD,
    options: { staleTime: 0 },
    params: {
      past_day: activateButton
    }
  });

  const userSummary = DashboardData?.data;

  // Prepare data for the charts
  const signupData = userSummary?.dashboard || [];
  
  const feelingData = React.useMemo(() => {
    return userSummary?.user_summary?.journelPieChart?.map((item: any) => ({
      label: item.feeling,
      value: item.count
    })) || [];
  }, [userSummary]);

  const hearAboutUsData = React.useMemo(() => {
    return userSummary?.user_summary?.hearAboutUsPieChart?.map((item: any) => ({
      label: item.hearAboutUs || 'Direct / Other',
      value: item.count
    })) || [];
  }, [userSummary]);

  const themeData = userSummary?.user_summary?.userEngagementOnThemeChart || [];

  return (
    <div className='p-2 md:p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-bold text-black">
          Heal <span className="text-maincolor">Dashboard</span>
        </h1>
        <div className='flex justify-center gap-2 '>
          {
            ["1M", "6M", "1Y", "MAX"].map((item, index) => {
              const isActive = activateButton === item;
              return (
                <div 
                  key={index}
                  className={`px-4 py-2 rounded-lg font-bold cursor-pointer transition-all duration-200 border ${
                    isActive 
                      ? 'bg-maincolor text-white border-maincolor shadow-sm' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-maincolor hover:text-maincolor'
                  }`} 
                  onClick={() => setActivateButton(item)}
                >
                  {item}
                </div>
              )
            })
          }
        </div>
      </div>

      {userSummary && (
        <div className="space-y-6">
          {/* Row 1: Stat Cards */}
          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <div className='bg-maincolor! min-h-36 flex gap-4 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-maincolor!'>
                <div className="bg-maincolor! border-2 border-cream! p-4 rounded-xl h-fit mt-1">
                  <FaUser className='text-cream! text-3xl' />
                </div>
                <div>
                  <h3 className="text-cream font-bold text-sm opacity-95">Total Users</h3>
                  <h5 className="text-[32px] text-cream font-black mt-1">
                    {userSummary?.user_summary?.all_users?.toLocaleString() || 0}
                  </h5>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div className='bg-maincolor! min-h-36 flex gap-4 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-maincolor!'>
                <div className="bg-maincolor! border-2 border-cream! p-4 rounded-xl h-fit mt-1">
                  <FaUserFriends className='text-cream! text-3xl' />
                </div>
                <div>
                  <h3 className="text-cream font-bold text-sm opacity-95">Active Users</h3>
                  <h5 className="text-[32px] text-cream font-black mt-1">
                    {userSummary?.user_summary?.active_users?.toLocaleString() || 0}
                  </h5>
                </div>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className='bg-maincolor! min-h-36 flex gap-4 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-maincolor!'>
                <div className="bg-maincolor! border-2 border-cream! p-4 rounded-xl h-fit mt-1">
                  <FaUserSlash className='text-cream! text-3xl' />
                </div>
                <div>
                  <h3 className="text-cream font-bold text-sm opacity-95">Deactivated Users</h3>
                  <h5 className="text-[32px] text-cream font-black mt-1">
                    {userSummary?.user_summary?.deactivated_users?.toLocaleString() || 0}
                  </h5>
                </div>
              </div>
            </Col>
          </Row>

          {/* Row 2: Signup Trend & Theme Engagement */}
          <Row gutter={[20, 20]}>
            <Col xs={24} >
              <RegistrationAreaChart data={signupData} />
            </Col>
            <Col xs={24} >
              <ThemeEngagementChart data={themeData} />
            </Col>
          </Row>

          {/* Row 3: Feelings breakdown & Referral Sources */}
          <Row gutter={[20, 20]}>
            <Col xs={24} md={12}>
              <DonutChart 
                title="Journal Feelings Breakdown" 
                data={feelingData} 
                totalLabel="Entries"
              />
            </Col>
            <Col xs={24} md={12}>
              <DonutChart 
                title="Referral Channels (Hear About Us)" 
                data={hearAboutUsData} 
                totalLabel="Referrals"
              />
            </Col>
          </Row>
        </div>
      )}
    </div>
  )
}

