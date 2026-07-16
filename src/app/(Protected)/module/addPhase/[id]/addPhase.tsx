"use client"

import React from "react"
import { Breadcrumb, ConfigProvider, Select, Switch, Table } from "antd";
import { ROUTES } from "@/routerKeys";
import { ENDPOINTS } from "@/Endpoints";
import { FaEye } from "react-icons/fa";
import { AppButton } from "@/components/ui";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { useAppQuery } from "@/tanstack/useAppQuery";
import { useAppMutate } from "@/tanstack/useAppMutate";
import logger from "@/utils/logger";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import AddPhaseModal from "@/components/ui/modals/addPhaseModal";
import { FaPlus } from "react-icons/fa";
import IconButton from "@/components/ui/IconButton";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface PhaseData {
    _id: string;
    title: string;
    points: number;
    status: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
interface subModuleData {
    _id: string;
    title: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface PhaseResult {
    result: PhaseData[];
    sub_module_details: subModuleData;
    page: number;
    limit: number;
    total: number;
}

export default function AddPhase() {

    const params = useParams();
    const subModuleId = params?.id as string;
    const route = useRouter();
    const searchParams = useSearchParams();
    const moduleTitle = searchParams.get("moduleTitle")
    const moduleID = searchParams.get("moduleID")
    const themeId = searchParams.get("themeId")
    const themeTitle = searchParams.get("themeTitle")
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);

    const [openAddPhaseModal, setOpenAddPhaseModal] = React.useState(false);
    const [openDeletePhaseModal, setOpenDeletePhaseModal] = React.useState(false);
    const [openPhaseUpdateModal, setOpenPhaseUpdateModal] = React.useState(false);
    const [openPhaseViewModal, setOpenPhaseViewModal] = React.useState(false);
    const [selectPhase, setSelectPhase] = React.useState("");

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>('en');


    const LANGUAGE_OPTIONS = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' },
        { value: 'pt', label: 'Portuguese' },
    ];
    
    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
    };

    const { data: listPhase } = useAppQuery<PhaseResult>({
        queryKey: [MUTATION_KEYS.LIST_PHASE, pagination, subModuleId, selectedLanguage],
        url: ENDPOINTS.PRIVATE.LIST_PHASE,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: selectedLanguage || "en",
            subModuleId: subModuleId
        }
    })
    const PhaseListData = listPhase?.data?.result;
    const SubModuleData = listPhase?.data?.sub_module_details;

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

    const handleAddLesson = (phaseId: string) => {
        route.push(`${ROUTES.PRIVATE.ADDMCQEXERCISE}/${phaseId}?themeTitle=${themeTitle}&themeId=${themeId}&moduleTitle=${moduleTitle}&moduleID=${moduleID}&subModuleTitle=${SubModuleData?.title}&subModuleId=${subModuleId}`)
    };

    const { mutateAsync: DeletePhase, isPending: isDeleting } = useAppMutate({
        mutationKey: [MUTATION_KEYS.PHASE_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_PHASE],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeletePhaseModal(false);
            setSelectPhase("");
        }
    });

    const handleDeletePhase = async () => {
        await tryCatchWrapper(
            async () => {
                await DeletePhase({
                    url: ENDPOINTS.PRIVATE.PHASE_DELETE,
                    method: "DELETE",
                    body: {
                        status: 2,
                        phaseId: selectPhase,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete phase',
                showToast: true,
                onError(error) {
                    logger.error('Failed to delete phase', error);
                    setOpenDeletePhaseModal(false)
                    setSelectPhase("")
                },
            }
        );
    }

    const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.PHASE_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_PHASE],
        showSuccessToast: false,
        showErrorToast: true,
    });

    const handleStatusChangeClick = async (changeStatus: number, phaseId: string) => {
        await tryCatchWrapper(
            async () => {
                await StatusChange({
                    url: ENDPOINTS.PRIVATE.PHASE_DELETE,
                    method: "DELETE",
                    body: {
                        status: changeStatus,
                        phaseId: phaseId,
                    },
                });
            },
            {
                errorMessage: 'Failed to change phase status',
                showToast: true,
                onError(error) {
                    logger.error('Failed to change phase status', error);
                },
            }
        );
    }

    const columns: ColumnsType<PhaseData> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        {
            title: 'Points',
            dataIndex: 'points',
            key: 'points',
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        // {
        //     title: "Add Lesson",
        //     render: (_: any, record: any) => (
        //         <div>
        //             <Button
        //                 loading={loadingLessonId === record?._id}
        //                 onClick={() => { handleAddLesson(record?._id) }}
        //                 className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!"
        //             >
        //                 Add Lesson
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
                    <IconButton icon={<FaPlus size={20} />} onClick={(e) => { e.stopPropagation();handleAddLesson(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenPhaseViewModal(true); setSelectPhase(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenPhaseUpdateModal(true); setSelectPhase(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeletePhaseModal(true); setSelectPhase(record?._id) }} className="" />
                </div>
            ),
        },
    ]

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                {/* <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Phase</span>
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
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.ADDMODULE}/${themeId}`) }} >{moduleTitle || ''}</span>
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.SUBMODULE}/${moduleID}?themeTitle=${themeTitle}&themeId=${themeId}`) }} title={SubModuleData?.title}>{SubModuleData?.title}</span>
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold">Phase</span>
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
                        onOpenChange={(open) => setIsSelectOpen(open)}
                        className='w-32 bg-maincolor! font-bold text-white! border-none!'
                        suffixIcon={isSelectOpen ? <IoIosArrowUp className="text-white!" /> : <IoIosArrowDown className="text-white!" />}
                    />
                    <AppButton onClick={() => { setOpenAddPhaseModal(true) }} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Phases
                    </AppButton>
                </div>
            </div>

            <Table
                rowKey="_id"
                dataSource={PhaseListData}
                columns={columns}
                onRow={(record) => ({
                    onClick: () => handleAddLesson(record?._id)
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
                className="cursor-pointer"
            />
            <AddPhaseModal openAddPhaseModal={openAddPhaseModal} setOpenAddPhaseModal={setOpenAddPhaseModal} subModuleId={subModuleId} />
            <DeleteModal title='Phase' openDeleteModal={openDeletePhaseModal} setopenDeleteModal={setOpenDeletePhaseModal} handleDelete={handleDeletePhase} loading={isDeleting} />
            <AddPhaseModal openAddPhaseModal={openPhaseUpdateModal} setOpenAddPhaseModal={setOpenPhaseUpdateModal} subModuleId={subModuleId} isUpdate={true} phaseID={selectPhase} selectedLanguage={selectedLanguage} />
            <AddPhaseModal openAddPhaseModal={openPhaseViewModal} setOpenAddPhaseModal={setOpenPhaseViewModal} subModuleId={subModuleId} isView={true} phaseID={selectPhase} selectedLanguage={selectedLanguage} />

        </div>
    )
}