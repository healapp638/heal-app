"use client"

import React from "react"
import { Breadcrumb, ConfigProvider, Select, Switch, Table } from "antd"
import { ROUTES } from "@/routerKeys"
import { ENDPOINTS } from "@/Endpoints"
import { FaEye } from "react-icons/fa";
import { AppButton } from "@/components/ui"
import { ColumnsType } from "antd/es/table"
import { MUTATION_KEYS } from "@/tanstack/keys"
import { FiTrash2, FiEdit } from "react-icons/fi"
import { useAppQuery } from "@/tanstack/useAppQuery"
import { useAppMutate } from "@/tanstack/useAppMutate"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { tryCatchWrapper } from "@/utils/tryCatchWrapper"
import DeleteModal from "@/components/ui/modals/DeleteModal"
import AddSubModuleModal from "@/components/ui/modals/addSubModuleModal"
import { FaPlus } from "react-icons/fa";
import IconButton from "@/components/ui/IconButton"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface SubModuleData {
    _id: string;
    title: string;
    slug: string;
    status: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
interface ModuleDetail {
    title: string;
}

interface SubModuleResult {
    result: SubModuleData[];
    module_details: ModuleDetail;
    page: number;
    limit: number;
    total: number;
}

export default function AddSubModule() {

    const route = useRouter()
    const params = useParams();
    const searchParams = useSearchParams()
    const moduleId = params?.id as string;
    const themeTitle = searchParams.get("themeTitle")
    const themeId = searchParams.get("themeId")
    const [openAddSubModuleModal, setOpenAddSubModuleModal] = React.useState(false)
    const [openDeleteModule, setOpenDeleteModule] = React.useState(false)
    const [selectedSubModule, setSelectedSubModule] = React.useState("")
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
    const [openUpdateSubModuleModal, setOpenUpdateSubModuleModal] = React.useState(false)
    const [openViewSubModuleModal, setOpenViewSubModuleModal] = React.useState(false)
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });
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

    const { data: listsubModule } = useAppQuery<SubModuleResult>({
        queryKey: [MUTATION_KEYS.LIST_SUB_MODULE, selectedLanguage || "en", moduleId, pagination],
        url: ENDPOINTS.PRIVATE.LIST_SUB_MODULE,
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: selectedLanguage || "en",
            moduleId: moduleId
        }
    })
    const SubModuleListData = listsubModule?.data?.result;
    const moduleTitle = listsubModule?.data?.module_details;

    const { mutateAsync: DeleteSubModule, isPending: isDeleting } = useAppMutate({
        mutationKey: [MUTATION_KEYS.SUBMODULE_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_SUB_MODULE],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeleteModule(false);
            setSelectedSubModule("");
        }
    });

    const handleDeleteSubModule = async () => {
        await tryCatchWrapper(
            async () => {
                await DeleteSubModule({
                    url: ENDPOINTS.PRIVATE.SUBMODULE_DELETE,
                    method: "DELETE",
                    body: {
                        status: 2,
                        subModuleId: selectedSubModule,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete module',
                showToast: true,
                onError() {
                    console.error('Failed to delete theme');
                    setOpenDeleteModule(false)
                    setSelectedSubModule("")
                },
            }
        );
    }


    const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.SUBMODULE_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_SUB_MODULE],
        showSuccessToast: false,
        showErrorToast: true,

    });

    const handleStatusChangeClick = async (changeStatus: number, subModuleId: string) => {
        await tryCatchWrapper(
            async () => {
                await StatusChange({
                    url: ENDPOINTS.PRIVATE.SUBMODULE_DELETE,
                    method: "DELETE",
                    body: {
                        status: changeStatus,
                        subModuleId: subModuleId,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete module',
                showToast: true,
                onError() {
                    console.error('Failed to delete theme');
                    setOpenDeleteModule(false)
                    setSelectedSubModule("")
                },
            }
        );
    }


    const handleAddPhase = (subModuleId: string) => {
        route.push(`${ROUTES.PRIVATE.ADDPHASES}/${subModuleId}?themeId=${themeId}&moduleTitle=${moduleTitle?.title}&themeTitle=${themeTitle}&moduleID=${moduleId}`)
    };

    const getSerialNumber = React.useCallback((index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
    }, [pagination]);

    const columns: ColumnsType<SubModuleData> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
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
                            onChange={() => handleStatusChangeClick(changeStatus, record?._id)}
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
                    <IconButton icon={<FaPlus size={20} />} onClick={(e) => { e.stopPropagation(); handleAddPhase(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenViewSubModuleModal(true); setSelectedSubModule(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenUpdateSubModuleModal(true); setSelectedSubModule(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteModule(true); setSelectedSubModule(record?._id) }} className="" />
                </div>
            ),
        },
    ]

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                {/* <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">SubModule</span>
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
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(ROUTES.PRIVATE.MODULE) }}>{themeTitle || ''}</span>,
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.ADDMODULE}/${themeId}`) }} >{moduleTitle?.title || ''}</span>
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold">SubModule</span>
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
                    <AppButton onClick={() => { setOpenAddSubModuleModal(true) }} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add SubModule
                    </AppButton>
                </div>
            </div>

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={SubModuleListData}
                onRow={(record) => ({
                    onClick: () => handleAddPhase(record?._id)
                })}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: SubModuleListData?.length,
                    onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                }}
                className="cursor-pointer"
            />
            <AddSubModuleModal openModal={openAddSubModuleModal} setOpenModal={setOpenAddSubModuleModal} moduleId={moduleId} />
            <AddSubModuleModal openModal={openUpdateSubModuleModal} setOpenModal={setOpenUpdateSubModuleModal} moduleId={moduleId} subModuleId={selectedSubModule} isUpdate={true} selectedLanguage={selectedLanguage} />
            <AddSubModuleModal openModal={openViewSubModuleModal} setOpenModal={setOpenViewSubModuleModal} moduleId={moduleId} subModuleId={selectedSubModule} isView={true} selectedLanguage={selectedLanguage} />
            <DeleteModal title='SubModule' openDeleteModal={openDeleteModule} setopenDeleteModal={setOpenDeleteModule} handleDelete={handleDeleteSubModule} loading={isDeleting} />
        </div>
    )
}