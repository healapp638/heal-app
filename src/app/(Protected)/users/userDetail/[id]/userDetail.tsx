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
    feelThatWay?: string;
    helpFeelBetter?: string;
    stopFeelBetter?: string;
    goalStartWith?: string;
    // Gamification properties
    total_earned_points?: number;
    total_points?: number;
    currentLevel?: number;
    completedPercentage?: number;
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
                        <div className="px-8 pb-8 -mt-1 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
                            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-end  lg:gap-6">
                                <Avatar
                                    size={140}
                                    src={`${FILE_URL}${userDataResult.profilePic}`}
                                    className="border-4 border-white shadow-lg bg-white!"
                                />
                                <div className="pb-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Title className="text-black!" level={2} style={{ margin: 0 }}>{userDataResult.fullName || "User"}</Title>
                                    </div>
                                    <Text type="secondary" className="text-lg text-black!">{userDataResult.email}</Text>
                                </div>
                            </div>

                            {/* Gamification Progress Box */}
                            <div className="w-full md:w-80 bg-gray-50/70 p-4 rounded-xl border border-gray-100 flex flex-col gap-2 shadow-inner">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Level</span>
                                        <span className="bg-maincolor/10 text-maincolor border border-maincolor/20 text-sm font-black px-2.5 py-0.5 rounded-full">
                                            {userDataResult.currentLevel ?? 1}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-black!">{userDataResult.total_earned_points ?? 0}</span>
                                        <span className="text-xs text-gray-400"> / {userDataResult.total_points ?? 0} XP</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200/80 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-maincolor h-full rounded-full transition-all duration-500"
                                        style={{ width: `${userDataResult.completedPercentage ?? 0}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                                    <span>Progress</span>
                                    <span className="text-maincolor">{userDataResult.completedPercentage ?? 0}% Completed</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Details Section */}
                <Col xs={24} lg={10}>
                    <div className="bg-white! border-none! shadow-sm!  h-124! overflow-y-scroll!">
                        <h1 className="text-2xl p-4 font-bold text-black">
                            Personal <span className="text-maincolor">Information</span>
                        </h1>
                        <div className="flex flex-col gap-4 px-4 py-2">
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <p className="font-medium text-black">Email :</p>
                                <p className="text-gray-600">{userDataResult.email}</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <p className="font-medium text-black">Country :</p>
                                <p className="text-gray-600">{userDataResult.country || "N/A"}</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <p className="font-medium text-black">Language :</p>
                                <p className="text-gray-600">{userDataResult.language || "N/A"}</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <p className="font-medium text-black">Birth Date :</p>
                                <p className="text-gray-600">{formattedDateOnly(userDataResult.dob)}</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <p className="font-medium text-black">Account Source :</p>
                                <p className="text-gray-600">{userDataResult.account_source || "N/A"}</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <p className="font-medium text-black">Joined On :</p>
                                <p className="text-gray-600">{formattedDateOnly(userDataResult.createdAt)}</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full border-t border-gray-100 pt-3">
                                <p className="font-semibold text-black">Current Level :</p>
                                <p className="text-gray-600 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-100">Level {userDataResult.currentLevel ?? 1}</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <p className="font-semibold text-black">Points Progress :</p>
                                <p className="text-gray-600 font-medium">
                                    <span className="font-bold text-maincolor">{userDataResult.total_earned_points ?? 0}</span> / {userDataResult.total_points ?? 0} XP ({userDataResult.completedPercentage ?? 0}%)
                                </p>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} lg={14}>
                    <div className="bg-white! border-none! shadow-sm! h-124! overflow-y-scroll!">
                        <h1 className="text-2xl p-4 font-bold text-black">
                            Onboarding <span className="text-maincolor">Insights</span>
                        </h1>
                        <div className="flex flex-col gap-4 px-4 py-2">
                            {userDataResult.fullName && userDataResult.fullName.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">What do you want to be called?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.fullName}</p>
                                </div>
                            )}
                            {userDataResult.hearAboutUs && userDataResult.hearAboutUs.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">Where did you hear about us?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.hearAboutUs}</p>
                                </div>
                            )}
                            {userDataResult.howFellingLately && userDataResult.howFellingLately.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">How have you been feeling lately?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.howFellingLately}</p>
                                </div>
                            )}
                            {userDataResult.bringsYouHere && userDataResult.bringsYouHere.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">What brings you here?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.bringsYouHere}</p>
                                </div>
                            )}

                            {userDataResult.feelThatWay && userDataResult.feelThatWay.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">What's making you feel that way?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.feelThatWay}</p>
                                </div>
                            )}
                            {userDataResult.likeToFellMore && userDataResult.likeToFellMore.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">What would you like to feel more?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.likeToFellMore}</p>
                                </div>
                            )}
                            {userDataResult.helpFeelBetter && userDataResult.helpFeelBetter.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">What helps you feel better?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.helpFeelBetter}</p>
                                </div>
                            )}
                            {userDataResult.stopFeelBetter && userDataResult.stopFeelBetter.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">What usually stops you from feeling better?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.stopFeelBetter}</p>
                                </div>
                            )}
                            {userDataResult.startShowingOfYourSelf && userDataResult.startShowingOfYourSelf.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">How you describe yourself?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.startShowingOfYourSelf}</p>
                                </div>
                            )}
                            {userDataResult.timeYouCommit && userDataResult.timeYouCommit.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">How much would you like to dedicate to yourself?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.timeYouCommit}</p>
                                </div>
                            )}
                            {userDataResult.goalStartWith && userDataResult.goalStartWith.trim() !== "" && (
                                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-2">
                                    <p className="font-medium text-black shrink-0">What goal do you want to start with?</p>
                                    <p className="text-gray-600 text-left md:text-right md:pl-4">{userDataResult.goalStartWith}</p>
                                </div>
                            )}

                            {!(
                                (userDataResult.bringsYouHere && userDataResult.bringsYouHere.trim() !== "") ||
                                (userDataResult.howFellingLately && userDataResult.howFellingLately.trim() !== "") ||
                                (userDataResult.feelThatWay && userDataResult.feelThatWay.trim() !== "") ||
                                (userDataResult.likeToFellMore && userDataResult.likeToFellMore.trim() !== "") ||
                                (userDataResult.helpFeelBetter && userDataResult.helpFeelBetter.trim() !== "") ||
                                (userDataResult.stopFeelBetter && userDataResult.stopFeelBetter.trim() !== "") ||
                                (userDataResult.startShowingOfYourSelf && userDataResult.startShowingOfYourSelf.trim() !== "") ||
                                (userDataResult.timeYouCommit && userDataResult.timeYouCommit.trim() !== "") ||
                                (userDataResult.goalStartWith && userDataResult.goalStartWith.trim() !== "") ||
                                (userDataResult.hearAboutUs && userDataResult.hearAboutUs.trim() !== "")
                            ) && (
                                    <p className="text-gray-400 text-center py-4">No onboarding insights available</p>
                                )}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}