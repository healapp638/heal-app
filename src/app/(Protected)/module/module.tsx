"use client"

import React from 'react'
import { ROUTES } from '@/routerKeys';
import { FaEye } from "react-icons/fa";
import { ENDPOINTS } from '@/Endpoints';
import { FILE_URL } from '@/utils/helper';
import { AppButton } from '@/components/ui'
import { useRouter } from 'next/navigation';
import { Image, Select, Switch, Table } from 'antd';
import { MUTATION_KEYS } from '@/tanstack/keys';
import type { ColumnsType } from 'antd/es/table';
import { FiTrash2, FiEdit } from "react-icons/fi"
import { tryCatchWrapper } from '@/utils/tryCatchWrapper';
import { useAppMutate } from '@/tanstack/useAppMutate';
import { useAppQuery } from '@/tanstack/useAppQuery';
import AddThemeModal from '@/components/ui/modals/addThemeModal';
import DeleteModal from '@/components/ui/modals/DeleteModal';
import { FaPlus } from "react-icons/fa";
import IconButton from '@/components/ui/IconButton';

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

    const [selectedLanguage, setSelectedLanguage] = React.useState<string>('en');

    const LANGUAGE_OPTIONS = [
        { value: 'en', label: 'English' },
        { value: 'zh', label: 'Chinese' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'hi', label: 'Hindi' },
        { value: 'de', label: 'German' },
        { value: 'ru', label: 'Russian' },
        { value: 'pt', label: 'Portuguese' },
        { value: 'it', label: 'Italian' },
        { value: 'ro', label: 'Romanian' }
    ];
    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
    };

    const { data: listTheme } = useAppQuery<ThemeResponse>({
        queryKey: [MUTATION_KEYS.LIST_THEME, selectedLanguage, pagination],
        url: ENDPOINTS.PRIVATE.LIST_THEME,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: selectedLanguage
        }
    })
    const ThemeListData = listTheme?.data?.result;

    const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.DELETE_THEME],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_THEME],
        showSuccessToast: false,
        showErrorToast: true,

    });

    const handleStatusChangeClick = async (id: string, changeStatus: number) => {
        await tryCatchWrapper(
            async () => {
                await StatusChange({
                    url: ENDPOINTS.PRIVATE.DELETE_THEME,
                    method: "DELETE",
                    body: {
                        status: changeStatus,
                        themeId: id,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete theme',
                showToast: true,
                onError() {
                    console.error('Failed to delete theme');
                },
            }
        );
    }

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
                        status: 2,
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
                preview={false}
                draggable={false}
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
            title: "Status",
            key: 'status',
            render: (_: any, record: Theme) => {
                const changeStatus = record.status === 1 ? 3 : 1;
                return (
                    <div onClick={(e) => { e.stopPropagation();  }}>
                        <Switch
                            checked={record.status === 1}
                            loading={isStatusChangePending}
                            onChange={() => handleStatusChangeClick(record?._id, changeStatus)}
                        />
                    </div>
                )
            }
        },
        {
            title: "Actions",
            align: "center",
            render: (_: any, record: Theme) => (
                <div className="flex gap-2  justify-center">
                    <IconButton icon={<FaPlus size={20} />} onClick={(e) => { e.stopPropagation(); handleAddModule(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenViewModal(true); setSelectedTheme(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenUpdateModal(true); setSelectedTheme(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteModal(true); setSelectedTheme(record?._id) }} className="" />
                </div>
            ),
            width: 200,
        }
    ];

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4" >
                <h1 className="text-3xl font-bold text-black m-0!">
                    <span className="text-maincolor">Themes</span>
                </h1>
                <div className='flex justify-center gap-2'>
                    <Select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        options={LANGUAGE_OPTIONS}
                        className='w-32 bg-maincolor! font-bold text-white! border-none!'
                    />
                    <AppButton onClick={() => setOpenModal(true)} className="bg-maincolor! w-26! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Theme
                    </AppButton>
                </div>
            </div>
            <Table
                dataSource={ThemeListData}
                columns={columns}
                onRow={(record) => ({
                    onClick: () => handleAddModule(record?._id)
                })}
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
                className='cursor-pointer!'
            />
            <AddThemeModal openModal={openModal} setOpenModal={setOpenModal} onClose={() => setSelectedTheme("")} />
            <AddThemeModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} isUpdate={true} themeId={selectedTheme} onClose={() => { setSelectedTheme("") }} selectedLanguage={selectedLanguage} />
            <AddThemeModal openModal={openViewModal} setOpenModal={setOpenViewModal} isView={true} themeId={selectedTheme} onClose={() => setSelectedTheme("")} selectedLanguage={selectedLanguage} />
            <DeleteModal title='Theme' openDeleteModal={openDeleteModal} setopenDeleteModal={setOpenDeleteModal} handleDelete={handleDeleteTheme} loading={isDeleting} />
        </div>
    )
}
