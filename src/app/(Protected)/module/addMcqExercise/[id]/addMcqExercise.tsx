"use client"

import React from "react"
import { AppButton } from "@/components/ui";
import { ROUTES } from "@/routerKeys"
import { Breadcrumb, ConfigProvider, Select, Table } from "antd"
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { ENDPOINTS } from "@/Endpoints";
import { ColumnsType } from "antd/es/table";
import IconButton from "@/components/ui/IconButton";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import AddMcqExerciseModal from "@/components/ui/modals/addMcqExerciseModal";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { useAppMutate } from "@/tanstack/useAppMutate";

interface McqExerciseData {
    _id: string;
    title: string;
    description?: string;
    mcq: Array<any>;
    status: number;
}

interface McqExerciseResult {
    result: McqExerciseData[];
    phase_details: {
        title: string;
    };
    page: number;
    limit: number;
    total: number;
    totalCount?: number;
}

export default function AddMcqExercise() {

    const params = useParams();
    const phaseId = params?.id as string;
    const route = useRouter();
    const searchParams = useSearchParams();
    const themeTitle = searchParams.get("themeTitle")
    const themeId = searchParams.get("themeId")
    const moduleTitle = searchParams.get("moduleTitle")
    const moduleID = searchParams.get("moduleID")
    const subModuleTitle = searchParams.get("subModuleTitle")
    const subModuleId = searchParams.get("subModuleId")
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
    const [openDeleteMcqModal, setOpenDeleteMcqModal] = React.useState(false);
    const [openMcqUpdateModal, setOpenMcqUpdateModal] = React.useState(false);
    const [openMcqViewModal, setOpenMcqViewModal] = React.useState(false);
    const [openAddMcqExerciseModal, setOpenAddMcqExerciseModal] = React.useState(false);
    const [mcqID, setMcqID] = React.useState("");

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
        { value: 'ru', label: 'Russian' },
        { value: 'it', label: 'Italian' },
        { value: 'pt', label: 'Portuguese' },
    ];
    
    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
    };


    const { data: mcqExerciseList } = useAppQuery<McqExerciseResult>({
        queryKey: [MUTATION_KEYS.MCQ_EXERCISE_LIST, pagination, phaseId, selectedLanguage],
        url: ENDPOINTS.PRIVATE.MCQ_EXERCISE_LIST,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: selectedLanguage || "en",
            phase_id: phaseId
        }
    })
    const mcqExercises = mcqExerciseList?.data?.result
    const PhaseData = mcqExerciseList?.data?.phase_details;

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

    const { mutateAsync: DeleteMcq, isPending: isDeletingMcq } = useAppMutate({
        mutationKey: [MUTATION_KEYS.MCQ_EXERCISE_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.MCQ_EXERCISE_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeleteMcqModal(false);
            setMcqID("");
        }
    });

    const handleDeleteMcq = async () => {
        await tryCatchWrapper(
            async () => {
                await DeleteMcq({
                    url: ENDPOINTS.PRIVATE.MCQ_EXERCISE_DELETE,
                    method: "DELETE",
                    body: {
                        status: 2,
                        mcqexercise_id: mcqID,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete lesson',
                showToast: true,
                onError() {
                    console.error('Failed to delete lesson');
                    setOpenDeleteMcqModal(false)
                    setMcqID("")
                },
            }
        );
    }

    // const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
    //     mutationKey: [MUTATION_KEYS.MCQ_EXERCISE_DELETE],
    //     invalidateQueryKeys: [MUTATION_KEYS.MCQ_EXERCISE_LIST],
    //     showSuccessToast: false,
    //     showErrorToast: true,
    //     onSuccess: () => {
    //         setOpenDeleteMcqModal(false);
    //         setMcqID("");
    //     }
    // });

    // const handleStatusChangeClick = async (changeStatus: number, mcqId: string) => {
    //     await tryCatchWrapper(
    //         async () => {
    //             await StatusChange({
    //                 url: ENDPOINTS.PRIVATE.MCQ_EXERCISE_DELETE,
    //                 method: "DELETE",
    //                 body: {
    //                     status: changeStatus,
    //                     mcqexercise_id: mcqId,
    //                 },
    //             });
    //         },
    //         {
    //             errorMessage: 'Failed to change status of MCQ',
    //             showToast: true,
    //             onError() {
    //                 console.error('Failed to change status of MCQ');
    //                 setOpenDeleteMcqModal(false)
    //                 setMcqID("")
    //             },
    //         }
    //     );
    // }

    const columns: ColumnsType<McqExerciseData> = [
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
            render: (text: string) => {
                const words = text?.split(' ') || [];
                const truncatedText = words.length > 5 ? words.slice(0, 5).join(' ') + '...' : text;
                return <span className='font-medium text-black' title={text}>{truncatedText}</span>
            }
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text: string) => {
                const words = text?.split(' ') || [];
                const truncatedText = words.length > 5 ? words.slice(0, 5).join(' ') + '...' : text;
                return <span className='font-medium text-black' title={text}>{truncatedText || "N/A"}</span>
            }
        },
        {
            title: "Mcq Count",
            dataIndex: "mcq",
            key: "mcq",
            render: (mcq: Array<any>) => <span className='font-medium text-black'>{mcq?.length || "N/A"}</span>
        },
        // {
        //     title: "Status",
        //     key: 'status',
        //     render: (_: any, record: any) => {
        //         const changeStatus = record.status === 1 ? 3 : 1;
        //         return (
        //             <div onClick={(e) => { e.stopPropagation(); }}>
        //                 <Switch
        //                     checked={record.status === 1}
        //                     loading={isStatusChangePending}
        //                     onChange={() => handleStatusChangeClick(changeStatus, record?._id)}
        //                 />
        //             </div>
        //         )
        //     }
        // },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: "center",
            render: (_text: any, record: any) => (
                <div className="flex gap-2  justify-center">
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setMcqID(record?._id); setOpenMcqViewModal(true) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setMcqID(record?._id); setOpenMcqUpdateModal(true) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteMcqModal(true); setMcqID(record?._id) }} className="" />
                </div>
            ),
        },

    ]
    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
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
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.SUBMODULE}/${moduleID}?themeTitle=${themeTitle}&themeId=${themeId}`) }}>{subModuleTitle}</span>
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.ADDPHASES}/${subModuleId}?themeTitle=${themeTitle}&themeId=${themeId}&moduleTitle=${moduleTitle}&moduleID=${moduleID}`) }}>{PhaseData?.title}</span>
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold">Exercise</span>
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
                    <AppButton onClick={() => setOpenAddMcqExerciseModal(true)} className="bg-maincolor! w-36! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Exercise
                    </AppButton>
                </div>
            </div>
            <Table
                rowKey="_id"
                dataSource={mcqExercises}
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
                className="cursor-pointer"
                bordered
            />
            <AddMcqExerciseModal openAddMcqExerciseModal={openMcqUpdateModal} setOpenAddMcqExerciseModal={setOpenMcqUpdateModal} McqExerciseId={mcqID} selectedLanguage={selectedLanguage} phaseId={phaseId} McqCount={mcqExerciseList?.data?.totalCount} isUpdate />
            <AddMcqExerciseModal openAddMcqExerciseModal={openMcqViewModal} setOpenAddMcqExerciseModal={setOpenMcqViewModal} McqExerciseId={mcqID} selectedLanguage={selectedLanguage} phaseId={phaseId} McqCount={mcqExerciseList?.data?.totalCount} isView />

            <AddMcqExerciseModal openAddMcqExerciseModal={openAddMcqExerciseModal} setOpenAddMcqExerciseModal={setOpenAddMcqExerciseModal} McqExerciseId={mcqID} selectedLanguage={selectedLanguage} phaseId={phaseId} McqCount={mcqExerciseList?.data?.totalCount} />
            <DeleteModal title='Exercise' openDeleteModal={openDeleteMcqModal} setopenDeleteModal={setOpenDeleteMcqModal} handleDelete={handleDeleteMcq} loading={isDeletingMcq} />
        </div>
    )
}