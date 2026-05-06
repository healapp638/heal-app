"use client"

import React from 'react'
import { useAppQuery } from '@/tanstack/useAppQuery'
import { useParams } from 'next/navigation'
import { ENDPOINTS } from '@/Endpoints'
import { MUTATION_KEYS } from '@/tanstack/keys'
import { Card, Col, Row, Avatar, Typography } from 'antd'
import { FILE_URL } from '@/utils/helper'
import { formattedDateOnly } from '@/utils/formatting/date'
import logger from '@/utils/logger'

const { Title, Text } = Typography;

interface UserDetailResult {
    _id: string;
    account_source: string;
    bringsYouHere: string;
    country: string;
    createdAt: string;
    dob: string;
    email: string;
    first_name: string;
    fullName: string;
    hearAboutUs: string;
    howFellingLately: string;
    isVerified: boolean;
    language: string;
    likeToFellMore: string;
    profilePic: string;
    startShowingOfYourSelf: string;
    status: number;
    timeYouCommit: string;
    updatedAt: string;
}


export default function UserDetail() {
    const params = useParams();
    const userId = params?.id as string;


    const { data: userData } = useAppQuery<UserDetailResult>({
        queryKey: [MUTATION_KEYS.USERS_DETAIL, userId],
        url: ENDPOINTS.PRIVATE.USERS_DETAIL,
        options: {
            staleTime: Infinity,
        },
        params: {
            user_id: userId,
        }
    })

    const userDataResult = userData?.data;
    logger.log("userDataResult", userDataResult)

    if (!userDataResult) return null;

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">
                    User <span className="text-maincolor">Profile</span>
                </h1>
            </div>

            <Row gutter={[24, 24]}>
                {/* Profile Header Card */}
                <Col span={24}>
                    <Card className="shadow-sm border-none! bg-white! overflow-hidden" styles={{ body: { padding: 0 } }}>
                        <div className="h-32 bg-linear-to-r from-maincolor to-secondary-light" />
                        <div className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-end gap-6">
                            <Avatar
                                size={140}
                                src={`${FILE_URL}${userDataResult.profilePic}`}
                                className="border-4 border-white shadow-lg bg-white!"
                            />
                            <div className="flex-1 pb-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <Title className="text-black!" level={2} style={{ margin: 0 }}>{userDataResult.fullName || "User"}</Title>
                                </div>
                                <Text type="secondary" className="text-lg text-black!">{userDataResult.email}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Details Section */}
                <Col xs={24} lg={10}>
                    <div className="bg-white! border-none! shadow-sm!">
                        <h1 className="text-2xl p-4 font-bold text-black">
                            Personal <span className="text-maincolor">Information</span>
                        </h1>
                        <div className="flex flex-col gap-4 px-4 py-2">
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">Email :</p>
                                <p className="text-gray-600">{userDataResult.email}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">Country :</p>
                                <p className="text-gray-600">{userDataResult.country || "N/A"}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">Language :</p>
                                <p className="text-gray-600">{userDataResult.language || "N/A"}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">Birth Date :</p>
                                <p className="text-gray-600">{formattedDateOnly(userDataResult.dob)}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">Account Source :</p>
                                <p className="text-gray-600">{userDataResult.account_source || "N/A"}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">Joined On :</p>
                                <p className="text-gray-600">{formattedDateOnly(userDataResult.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} lg={14}>
                     <div className="bg-white! border-none! shadow-sm!">
                        <h1 className="text-2xl p-4 font-bold text-black">
                            Onboarding <span className="text-maincolor">Insights</span>
                        </h1>
                        <div className="flex flex-col gap-4 px-4 py-2">
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">What brings you here?</p>
                                <p className="text-gray-600">{userDataResult.bringsYouHere || "Not specified"}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">How are you feeling lately?</p>
                                <p className="text-gray-600">{userDataResult.howFellingLately || "N/A"}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">What would you like to feel more?</p>
                                <p className="text-gray-600">{userDataResult.likeToFellMore || "N/A"}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">How you describe yourself?</p>
                                <p className="text-gray-600">{userDataResult.startShowingOfYourSelf || "N/A"}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">Time commitment</p>
                                <p className="text-gray-600">{userDataResult.timeYouCommit || "N/A"}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-medium text-black">Found us via</p>
                                <p className="text-gray-600">{userDataResult.hearAboutUs || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}