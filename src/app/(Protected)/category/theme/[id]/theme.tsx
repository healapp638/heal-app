"use client"

import React from "react"
import { AppButton } from "@/components/ui"
import { Breadcrumb, ConfigProvider, Image, Switch, Table } from "antd"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { ColumnsType } from "antd/es/table";
import IconButton from "@/components/ui/IconButton";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { ENDPOINTS } from "@/Endpoints";
import { FILE_URL } from "@/utils/helper";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { useAppMutate } from "@/tanstack/useAppMutate";
import AddHomeThemeModal from "@/components/ui/modals/addHomeThemeModal";
import { ROUTES } from "@/routerKeys"

interface HomeThemeList {
    _id: string;
    imgUrl: string;
    status: number;
}
interface HomeThemeListResponse {
    result: HomeThemeList[];
}

const HomeTheme = () => {
    const route = useRouter()
    const params = useParams();
    const searchParams = useSearchParams()
    const categoryId = params?.id as string;
    const categoryName = searchParams.get("categoryName")
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });
    const [openAddModal, setOpenAddModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [selectedHomeTheme, setSelectedHomeTheme] = React.useState("");


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

    const { data: listHomeTheme } = useAppQuery<HomeThemeListResponse>({
        queryKey: [MUTATION_KEYS.HOMETHEME_LIST, categoryId, pagination],
        url: ENDPOINTS.PRIVATE.HOMETHEME_LIST,
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            categoryTheme_id: categoryId
        }
    })
    const homeThemeList = listHomeTheme?.data?.result


    const { mutateAsync: DeleteHomeTheme, isPending: isDeleting } = useAppMutate({
        mutationKey: [MUTATION_KEYS.HOMETHEME_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.HOMETHEME_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeleteModal(false);
            setSelectedHomeTheme("");
        }
    });

    const handleDeleteHomeTheme = async () => {
        await tryCatchWrapper(
            async () => {
                await DeleteHomeTheme({
                    url: ENDPOINTS.PRIVATE.HOMETHEME_DELETE,
                    method: "DELETE",
                    body: {
                        status: 2,
                        hometheme_id: selectedHomeTheme,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete category',
                showToast: true,
                onError() {
                    console.error('Failed to delete category');
                    setSelectedHomeTheme("")
                },
            }
        );
    }


    const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.HOMETHEME_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.HOMETHEME_LIST],
        showSuccessToast: false,
        showErrorToast: true,
    });

    const handleStatusChangeClick = async (categoryId: string, changeStatus: number) => {
        await tryCatchWrapper(
            async () => {
                await StatusChange({
                    url: ENDPOINTS.PRIVATE.HOMETHEME_DELETE,
                    method: "DELETE",
                    body: {
                        status: changeStatus,
                        hometheme_id: categoryId,
                    },
                });
            },
            {
                errorMessage: 'Failed to change status',
                showToast: true,
                onError() {
                    console.error('Failed to change status');
                },
            }
        );
    }

    const columns: ColumnsType<HomeThemeList> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: "HomeTheme Pic",
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
            title: "Status",
            key: 'status',
            render: (_: any, record: any) => {
                const changeStatus = record.status === 1 ? 3 : 1;
                return (
                    <div onClick={(e) => { e.stopPropagation(); }}>
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
            render: (_: any, record: any) => (
                <div className="flex gap-2  justify-center">
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenViewModal(true); setSelectedHomeTheme(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenUpdateModal(true); setSelectedHomeTheme(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteModal(true); setSelectedHomeTheme(record?._id) }} className="" />
                </div>
            ),
            width: 200,
        }
    ];


    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4" >
                {/* <h1 className="text-3xl font-bold text-black m-0!">
                    Add <span className="text-maincolor">Home Theme</span>
                </h1> */}
                <ConfigProvider
                    theme={{
                        components: {
                            Breadcrumb: {
                                itemColor: 'black', // Custom color for breadcrumb items
                                separatorColor: 'black', // Custom color for separator
                            },
                        },
                    }}
                >
                    <div className="mb-4">
                        <Breadcrumb
                            items={[
                                {
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(ROUTES.PRIVATE.CATEGORY) }}>{categoryName}</span>,
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold">Home Theme</span>
                                },
                            ]}
                            separator={<span className="text-h2 text-black-200 font-bold">/</span>}
                        />
                    </div>
                </ConfigProvider>
                <div className='flex justify-center gap-2'>
                    <AppButton onClick={() => { setOpenAddModal(true) }} className="bg-maincolor! w-36! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Home Theme
                    </AppButton>
                </div>
            </div>
            <Table
                dataSource={homeThemeList}
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
                className='cursor-pointer!'
            />
            <AddHomeThemeModal openModal={openAddModal} setOpenModal={setOpenAddModal} homeThemeId={selectedHomeTheme} categoryID={categoryId} />
            <AddHomeThemeModal openModal={openViewModal} setOpenModal={setOpenViewModal} homeThemeId={selectedHomeTheme} isView={true} />
            <AddHomeThemeModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} homeThemeId={selectedHomeTheme} isUpdate={true} />
            <DeleteModal title='HomeTheme' openDeleteModal={openDeleteModal} setopenDeleteModal={setOpenDeleteModal} handleDelete={handleDeleteHomeTheme} loading={isDeleting} />
        </div>
    )
}

export default HomeTheme