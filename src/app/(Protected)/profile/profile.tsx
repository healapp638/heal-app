"use client"

import React from "react"
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { FILE_URL } from "@/utils/helper";
import { Avatar, Space } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import { CiLock } from "react-icons/ci";

import { AppButton } from "@/components/ui";
import EditProfileModal from "@/components/ui/modals/EditProfileModal";
import ChangePasswordModal from "@/components/ui/modals/changePassword";

interface AdminDetail {
    first_name: string;
    last_name: string;
    profile_pic: string;
    full_name: string;
    email: string;
}

const Profile = () => {

    const [openEditProfileModal, setOpenEditProfileModal] = React.useState(false)
    const [openChangePasswordModal, setOpenChangePasswordModal] = React.useState(false)

    const { data: adminDetail } = useAppQuery<AdminDetail>({
        queryKey: [MUTATION_KEYS.ADMIN_DETAIL],
        url: ENDPOINTS.PRIVATE.ADMIN_DETAIL,
        options: { staleTime: 0 },
    });
    const AdminDetail = adminDetail?.data

    return (
        <div className='p-2 md:p-6'>
            <div>
                <h1 className="text-3xl font-bold text-black">
                    Admin <span className="text-maincolor">Profile</span>
                </h1>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                {/* Header Banner */}
                <div className="h-40 bg-linear-to-r from-maincolor to-cream relative">
                    <div className="absolute -bottom-16 left-8 p-1 bg-cream rounded-full shadow-2xl">
                        {AdminDetail?.profile_pic ? (
                            <Avatar
                                size={120}
                                src={FILE_URL + AdminDetail?.profile_pic}
                                className="border-4 border-black"
                            />
                        ) : (
                            <Avatar
                                size={120}
                                icon={<UserOutlined />}
                                className="bg-gray-800 border-4 border-black text-maincolor text-5xl flex items-center justify-center"
                            />
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div className="pt-20 pb-10 px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl font-black text-maincolor tracking-tight leading-none mb-2">
                                {AdminDetail?.full_name}
                            </h2>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-maincolor text-lg flex items-center gap-2">
                                    <MailOutlined className="text-black!" /> {AdminDetail?.email}
                                </span>
                            </div>
                        </div>

                        <Space size="middle" className="mb-1 md:flex-row flex-col">
                            <AppButton onClick={() => { setOpenEditProfileModal(true) }} prefixIcon={<BiSolidEditAlt className="text-2xl!" />} className="maincolor! w-42! cursor-pointer! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! bg-maincolor! shadow-none!" block>
                                Edit Profile
                            </AppButton>
                            <AppButton onClick={() => { setOpenChangePasswordModal(true) }} prefixIcon={<CiLock className="text-2xl!" />} className="maincolor! w-48! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer! bg-maincolor! shadow-none!" block>
                                Change Password
                            </AppButton>
                        </Space>
                    </div>

                </div>
            </div>
            <EditProfileModal openModal={openEditProfileModal} setOpenModal={setOpenEditProfileModal} />
            <ChangePasswordModal openModal={openChangePasswordModal} setOpenModal={setOpenChangePasswordModal} />
        </div>
    )
}

export default Profile