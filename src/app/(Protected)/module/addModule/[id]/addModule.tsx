"use client"

import React from "react"
import { Breadcrumb, ConfigProvider, Select, Switch, Table } from "antd";
import { ROUTES } from "@/routerKeys";
import { FaEye } from "react-icons/fa";
import { ENDPOINTS } from "@/Endpoints";
import { ColumnsType } from "antd/es/table";
import { AppButton } from "@/components/ui";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { useAppQuery } from "@/tanstack/useAppQuery";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useParams, useRouter } from "next/navigation";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import AddModuleModal from "@/components/ui/modals/addModuleModal";
import { FaPlus } from "react-icons/fa";
import IconButton from "@/components/ui/IconButton";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface ModuleData {
    _id: string;
    title: string;
    slug: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ThemeData {
    title: string;
}

interface ModuleResult {
    result: ModuleData[];
    them_details: ThemeData;
    page: number;
    limit: number;
    total: number;
}
export default function AddModule() {

    const route = useRouter()
    const params = useParams();
    const themeId = params?.id as string;
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });
    const [openAddModal, setOpenAddModal] = React.useState(false);
    const [openDeleteModule, setOpenDeleteModule] = React.useState(false);
    const [selectedModule, setSelectedModule] = React.useState<string>("");
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
    const [openUpdateModal, setOpenUpdateModal] = React.useState(false)
    const [openViewModal, setOpenViewModal] = React.useState(false)

    const [selectedLanguage, setSelectedLanguage] = React.useState<string>('en');

    const LANGUAGE_OPTIONS = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'ru', label: 'Russian' },
        { value: 'it', label: 'Italian' },
        { value: 'pt', label: 'Portuguese' },
    ];

    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
    };


    const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.DELETE_MODULE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_MODULE],
        showSuccessToast: false,
        showErrorToast: true,
    });

    const handleStatusChangeClick = async (moduleId: string, changeStatus: number) => {
        await tryCatchWrapper(
            async () => {
                await StatusChange({
                    url: ENDPOINTS.PRIVATE.DELETE_MODULE,
                    method: "DELETE",
                    body: {
                        status: changeStatus,
                        moduleId: moduleId,
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


    const { mutateAsync: DeleteModule, isPending: isDeleting } = useAppMutate({
        mutationKey: [MUTATION_KEYS.DELETE_MODULE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_MODULE],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeleteModule(false);
            setSelectedModule("");
        }
    });

    const handleDeleteModule = async () => {
        await tryCatchWrapper(
            async () => {
                await DeleteModule({
                    url: ENDPOINTS.PRIVATE.DELETE_MODULE,
                    method: "DELETE",
                    body: {
                        status: 2,
                        moduleId: selectedModule,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete module',
                showToast: true,
                onError() {
                    console.error('Failed to delete theme');
                    setOpenDeleteModule(false)
                    setSelectedModule("")
                },
            }
        );
    }

    const { data: listModule } = useAppQuery<ModuleResult>({
        queryKey: [MUTATION_KEYS.LIST_MODULE, pagination, themeId, selectedLanguage],
        url: ENDPOINTS.PRIVATE.LIST_MODULE,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: selectedLanguage || "en",
            themeId: themeId
        }
    })
    const ModuleListData = listModule?.data?.result;
    const ThemeData = listModule?.data?.them_details;
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

    const handleAddSubModule = (moduleId: string) => {
        route.push(`${ROUTES.PRIVATE.SUBMODULE}/${moduleId}?themeId=${themeId}&themeTitle=${ThemeData?.title}`)
    };
    
    const columns: ColumnsType<ModuleData> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: 'Module Name',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        // {
        //     title: "Add SubModule",
        //     render: (_: any, record: any) => (
        //         <div>
        //             <Button
        //                 loading={loadingSubModuleId === record?._id}
        //                 onClick={() => { handleAddSubModule(record?._id) }}
        //                 className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!"
        //             >
        //                 Add SubModule
        //             </Button>
        //         </div>
        //     )
        // },
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
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: "center",
            render: (_text: any, record: any) => (
                <div className="flex gap-2  justify-center">
                    <IconButton icon={<FaPlus size={20} />} onClick={(e) => { e.stopPropagation(); handleAddSubModule(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenViewModal(true); setSelectedModule(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenUpdateModal(true); setSelectedModule(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteModule(true); setSelectedModule(record?._id) }} className="" />
                </div>
            ),
        },
    ]
    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                {/* <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Module</span>
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
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(ROUTES.PRIVATE.MODULE) }}>{ThemeData?.title || ''}</span>,
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold">Module</span>
                                },
                            ]}
                            separator={<span className="text-h2 text-black-200 font-bold">/</span>}
                        />
                    </div>
                </ConfigProvider>
                <div className='flex justify-center gap-2'>
                    <Select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        options={LANGUAGE_OPTIONS}
                        onDropdownVisibleChange={(open) => setIsSelectOpen(open)}
                        className='w-32 bg-maincolor! font-bold text-white! border-none!'
                        suffixIcon={isSelectOpen ? <IoIosArrowUp className="text-white!" /> : <IoIosArrowDown className="text-white!" />}
                    />
                    <AppButton onClick={() => { setOpenAddModal(true) }} className="bg-maincolor! w-26! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Module
                    </AppButton>
                </div>
            </div>

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={ModuleListData}
                onRow={(record) => ({
                    onClick: () => handleAddSubModule(record?._id)
                })}
                className='cursor-pointer'
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
            />

            <AddModuleModal openModal={openAddModal} setOpenModal={setOpenAddModal} ThemeID={themeId} onClose={() => setSelectedModule("")} />
            <AddModuleModal openModal={openViewModal} setOpenModal={setOpenViewModal} ThemeID={themeId} isView={true} moduleId={selectedModule} onClose={() => setSelectedModule("")} selectedLanguage={selectedLanguage} />
            <AddModuleModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} ThemeID={themeId} isUpdate={true} moduleId={selectedModule} onClose={() => setSelectedModule("")} selectedLanguage={selectedLanguage} />
            <DeleteModal title='Module' openDeleteModal={openDeleteModule} setopenDeleteModal={setOpenDeleteModule} handleDelete={handleDeleteModule} loading={isDeleting} />

        </div>
    )
}