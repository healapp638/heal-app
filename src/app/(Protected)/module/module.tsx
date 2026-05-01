"use client"

import React from 'react'
import { AppButton } from '@/components/ui'
import { Button, Image, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { tryCatchWrapper } from '@/utils/tryCatchWrapper';
import { ENDPOINTS } from '@/Endpoints';
import { MUTATION_KEYS } from '@/tanstack/keys';
import { useAppMutate } from '@/tanstack/useAppMutate';
import { useAppQuery } from '@/tanstack/useAppQuery';
import { FILE_URL } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routerKeys';
import AddThemeModal from '@/components/ui/modals/addThemeModal';
import DeleteModal from '@/components/ui/modals/DeleteModal';

export interface Theme {
    _id: string;
    imgUrl: string;
    title: string;
    description: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

export interface ThemeResponse {
    result: Theme[];
}

export default function Module() {

    const route = useRouter()
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });
    const [openModal, setOpenModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [selectedTheme, setSelectedTheme] = React.useState("");

    const { data: listTheme } = useAppQuery<ThemeResponse>({
        queryKey: [MUTATION_KEYS.LIST_THEME],
        url: ENDPOINTS.PRIVATE.LIST_THEME,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
        }
    })
    const ThemeListData = listTheme?.data?.result;

    const { mutateAsync: DeleteTheme, isPending: isDeleting } = useAppMutate({
        mutationKey: [MUTATION_KEYS.DELETE_THEME],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_THEME],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeleteModal(false);
            setSelectedTheme("");
        }
    });

    const handleDeleteTheme = async () => {
        await tryCatchWrapper(
            async () => {
                await DeleteTheme({
                    url: ENDPOINTS.PRIVATE.DELETE_THEME,
                    method: "DELETE",
                    body: {
                        themeId: selectedTheme,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete theme',
                showToast: true,
                onError() {
                    console.error('Failed to delete theme');
                    setSelectedTheme("")
                },
            }
        );
    }

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

    const handleAddModule = (themeId: string) => {
        route.push(`${ROUTES.PRIVATE.ADDMODULE}/${themeId}`)
    }

    const columns: ColumnsType<Theme> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: Theme, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: "Theme Image",
            dataIndex: "imgUrl",
            key: "imgUrl",
            render: (imgUrl: string) => <Image
                src={`${FILE_URL}${imgUrl}`}
                alt="image"
                height={72}
                width={72}
                className="w-18 h-18 rounded-lg object-cover"
            />
        },
        {
            title: "Theme Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        {
            title: "Add Module",
            dataIndex: "add_module",
            key: "add_module",
            render: (_: any, record: Theme) => (
                <div>
                    <Button onClick={() => handleAddModule(record?._id)} className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" >
                        Add Module
                    </Button>
                </div>
            )
        },
        {
            title: "Actions",
            align: "center",
            render: (_: any, record: Theme) => (
                <div className="flex gap-2  justify-center">
                    <Button icon={<FaEye size={20} />} onClick={() => { setOpenViewModal(true); setSelectedTheme(record?._id) }} className="border-none! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiEdit size={20} />} onClick={() => { setOpenUpdateModal(true); setSelectedTheme(record?._id) }} className="border-none! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} onClick={() => { setOpenDeleteModal(true); setSelectedTheme(record?._id) }} className="border-none! text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                </div>
            ),
        }
    ];

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4" >
                <h1 className="text-3xl font-bold text-black m-0!">
                    Add <span className="text-maincolor">Themes</span>
                </h1>
                <AppButton onClick={() => setOpenModal(true)} className="bg-maincolor! w-26! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                    Add Theme
                </AppButton>
            </div>
            <Table
                dataSource={ThemeListData}
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
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
                bordered
            />
            <AddThemeModal openModal={openModal} setOpenModal={setOpenModal} onClose={() => setSelectedTheme("")} />
            <AddThemeModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} isUpdate={true} themeId={selectedTheme} onClose={() => setSelectedTheme("")} />
            <AddThemeModal openModal={openViewModal} setOpenModal={setOpenViewModal} isView={true} themeId={selectedTheme} onClose={() => setSelectedTheme("")} />
            <DeleteModal title='Theme' openDeleteModal={openDeleteModal} setopenDeleteModal={setOpenDeleteModal} handleDelete={handleDeleteTheme} loading={isDeleting} />
        </div>
    )
}
