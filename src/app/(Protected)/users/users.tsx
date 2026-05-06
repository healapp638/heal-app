"use client"

import React from "react"
import { Image, Switch, Table } from "antd"
import { ENDPOINTS } from "@/Endpoints"
import { ColumnsType } from "antd/es/table"
import { MUTATION_KEYS } from "@/tanstack/keys"
import { useAppQuery } from "@/tanstack/useAppQuery"
import { FaEye } from "react-icons/fa";
import { FILE_URL } from "@/utils/helper"
import { useAppMutate } from "@/tanstack/useAppMutate"
import { tryCatchWrapper } from "@/utils/tryCatchWrapper"
import { FiTrash2 } from "react-icons/fi"
import IconButton from "@/components/ui/IconButton"
// import DeleteModal from "@/components/ui/modals/DeleteModal"

interface UserData {
    _id: string;
    fullName: string;
    email: string;
    country: string;
    language: string;
    account_source: string;
    status: number;
    isVerified: boolean;
    createdAt: string;
    profilePic: string;
    bringsYouHere?: string;
    howFellingLately?: string;
    likeToFellMore?: string;
    timeYouCommit?: string;
    hearAboutUs?: string;
}

export default function Users() {

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    // const [SelectedUserId,setSelectedUserId]=React.useState<string>("")
    // const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const { data: userList } = useAppQuery<any>({
        queryKey: [MUTATION_KEYS.USERS_LIST, pagination],
        url: ENDPOINTS.PRIVATE.USERS_LIST,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize
        }
    })
    const UserListData = userList?.data?.result;

    const { mutateAsync: statusUpdate, isPending: statusUpdateLoading } = useAppMutate({
        mutationKey: [MUTATION_KEYS.USERS_STATUS],
        invalidateQueryKeys: [MUTATION_KEYS.USERS_LIST],
        showSuccessToast: true,
        showErrorToast: true,
    });

    const [statusUserId, setStatusUserId] = React.useState<string | null>(null);

    const handleStatusChangeClick = async (record: UserData, checked: boolean) => {
        setStatusUserId(record._id);
        await tryCatchWrapper(
            async () => {
                await statusUpdate({
                    url: ENDPOINTS.PRIVATE.USERS_STATUS,
                    method: "PUT",
                    body: {
                        user_id: record._id,
                        status: checked ? 1 : 3,
                    },
                });
            },
            {
                errorMessage: 'Failed to update user status',
                showToast: true,
            }
        );
        setStatusUserId(null);
    };

    const getSerialNumber = React.useCallback((index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
    }, [pagination]);

    // Handle pagination change
    const handleTableChange = (newPagination: any) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };

    const columns: ColumnsType<UserData> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: "Profile Pic",
            dataIndex: "profilePic",
            key: "profilePic",
            render: (imgUrl: string) => (
                <Image
                    src={`${FILE_URL}${imgUrl}`}
                    alt="profile"
                    height={50}
                    preview={true}
                    draggable={false}
                    width={50}
                    className="rounded-full object-cover border border-maincolor!"
                />
            )
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: string) => <span className='text-black font-semibold'>{text || "N/A"}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <span className='text-gray-600'>{text}</span>,
        },
        {
            title: "Status",
            key: 'status',
            render: (_: any, record: UserData) => {
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                            loading={statusUserId === record._id ? statusUpdateLoading : false}
                            checked={record.status === 1}
                            onChange={(checked) => handleStatusChangeClick(record, checked)}
                        />
                    </div>
                )
            }
        },
        {
            title: "Actions",
            align: "center",
            render: (_: any, _record: UserData) => (
                <div className="flex gap-2  justify-center">
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation();   }} className="" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation();   }} className="" />
                </div>
            ),
            width: 200,
        }
    ]

    return (
        <div className='p-2 md:p-6'>
            <h1 className="text-3xl font-bold text-black">
                Users <span className="text-maincolor">List</span>
            </h1>
            <Table
                rowKey="_id"
                dataSource={UserListData}
                columns={columns}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    showSizeChanger: false,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    onChange: (page, pageSize) => {
                        setPagination({
                            current: page,
                            pageSize: pageSize || pagination.pageSize,
                        });
                    },
                }}
                className="cursor-pointer"
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
                bordered
            />
            {/* <DeleteModal title='User' openDeleteModal={openDeleteModal} setopenDeleteModal={setOpenDeleteModal} handleDelete={handleDeleteTheme} loading={isDeleting} /> */}

        </div>
    )
}