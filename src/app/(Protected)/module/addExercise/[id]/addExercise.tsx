"use client"

import React from "react"
import { Breadcrumb, ConfigProvider, Select, Switch, Table } from "antd";
import { FaEye } from "react-icons/fa";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { ENDPOINTS } from "@/Endpoints";
import { AppButton } from "@/components/ui"
import { ColumnsType } from "antd/es/table";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { useAppMutate } from "@/tanstack/useAppMutate";
import logger from "@/utils/logger";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import AddExerciseModal from "@/components/ui/modals/addExerciseModal"
import IconButton from "@/components/ui/IconButton";
import { ROUTES } from "@/routerKeys";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface ExerciseData {
    _id: string;
    title: string;
    description: string;
    content: string;
    status: number;
    exercise_type: string;
    language_id: string;
    category_id: string;
    exercise_order: number;
    hint: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
interface LessonDetailData {
    reading_title: string;
}

interface ExerciseResult {
    result: ExerciseData[];
    exerciseDetails: LessonDetailData;
    page: number;
    limit: number;
    total: number;
}

export default function AddExercise() {

    const params = useParams();
    const route = useRouter();
    const searchParams = useSearchParams();
    const lessonId = params?.id as string;
    const themeTitle = searchParams.get("themeTitle");
    const themeId = searchParams.get("themeId");
    const moduleTitle = searchParams.get("moduleTitle");
    const moduleID = searchParams.get("moduleID");
    const subModuleTitle = searchParams.get("subModuleTitle");
    const subModuleId = searchParams.get("subModuleId");
    const phaseTitle = searchParams.get("phaseTitle");
    const phaseId = searchParams.get("phaseId");
    const [openModal, setOpenModal] = React.useState(false);
    const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
    const [openDeleteExerciseModal, setOpenDeleteExerciseModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [exerciseId, setExerciseId] = React.useState("");
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
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

    const { data: listExercises } = useAppQuery<ExerciseResult>({
        queryKey: [MUTATION_KEYS.EXERCISE_LIST, pagination, lessonId, selectedLanguage],
        url: ENDPOINTS.PRIVATE.EXERCISE_LIST,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: selectedLanguage || "en",
            exercise_details_id: lessonId
        }
    })
    const listExercisesData = listExercises?.data?.result;
    const exerciseDetailsData = listExercises?.data?.exerciseDetails;

    const { mutateAsync: DeleteExercise, isPending: isDeleting } = useAppMutate({
        mutationKey: [MUTATION_KEYS.EXERCISE_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.EXERCISE_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeleteExerciseModal(false);
            setExerciseId("");
        }
    });

    const handleDeleteExercise = async () => {
        await tryCatchWrapper(
            async () => {
                await DeleteExercise({
                    url: ENDPOINTS.PRIVATE.EXERCISE_DELETE,
                    method: "DELETE",
                    body: {
                        status: 2,
                        exercise_id: exerciseId,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete exercise',
                showToast: true,
                onError(error) {
                    logger.error('Failed to delete exercise', error);
                    setOpenDeleteExerciseModal(false)
                    setExerciseId("")
                },
            }
        );
    }

    const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.EXERCISE_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.EXERCISE_LIST],
        showSuccessToast: false,
        showErrorToast: true,
    });

    const handleStatusChangeClick = async (changeStatus: number, exerciseId: string) => {
        await tryCatchWrapper(
            async () => {
                await StatusChange({
                    url: ENDPOINTS.PRIVATE.EXERCISE_DELETE,
                    method: "DELETE",
                    body: {
                        status: changeStatus,
                        exercise_id: exerciseId,
                    },
                });
            },
            {
                errorMessage: 'Failed to change exercise status',
                showToast: true,
                onError(error) {
                    logger.error('Failed to change exercise status', error);
                    setOpenDeleteExerciseModal(false)
                    setExerciseId("")
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

    const columns: ColumnsType<ExerciseData> = [
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
            render: (text: string) => <span className='font-medium text-black'>{text || "N/A"}</span>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => {
                const words = text?.split(' ') || [];
                const truncatedText = words.length > 5 ? words.slice(0, 5).join(' ') + '...' : text;
                return <span className='font-medium text-black' title={text}>{truncatedText}</span>
            }
        },
        {
            title: "Status",
            key: 'status',
            render: (_: any, record: any) => {
                const changeStatus = record.status === 1 ? 3 : 1;
                return <Switch
                    checked={record.status === 1}
                    loading={isStatusChangePending}
                    onChange={(_checked) => {
                        handleStatusChangeClick(changeStatus, record._id);
                    }}
                />
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: "center",
            render: (_text: any, record: any) => (
                <div className="flex gap-2 justify-center">
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenViewModal(true); setExerciseId(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenUpdateModal(true); setExerciseId(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteExerciseModal(true); setExerciseId(record?._id) }} className="" />
                </div>
            ),
        },
    ]

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                {/* <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Exercises</span>
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
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.SUBMODULE}/${moduleID}?themeTitle=${themeTitle}&themeId=${themeId}`) }}>{subModuleTitle}</span>
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.ADDPHASES}/${subModuleId}?themeTitle=${themeTitle}&themeId=${themeId}&moduleTitle=${moduleTitle}&moduleID=${moduleID}`) }}>{phaseTitle}</span>
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.ADDLESSONS}/${lessonId}?themeTitle=${themeTitle}&themeId=${themeId}&moduleTitle=${moduleTitle}&moduleID=${moduleID}&subModuleTitle=${subModuleTitle}&subModuleId=${subModuleId}&phaseTitle=${phaseTitle}&phaseId=${phaseId}`) }}>{exerciseDetailsData?.reading_title}</span>
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
                        onOpenChange={(open) => setIsSelectOpen(open)}
                        className='w-32 bg-maincolor! font-bold text-white! border-none!'
                        suffixIcon={isSelectOpen ? <IoIosArrowUp className="text-white!" /> : <IoIosArrowDown className="text-white!" />}
                    />
                    <AppButton onClick={() => setOpenModal(true)} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Exercise
                    </AppButton>
                </div>
            </div>
            <Table
                rowKey="_id"
                dataSource={listExercisesData}
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
                className="cursor-pointer"
            />
            <AddExerciseModal openModal={openModal} setOpenModal={setOpenModal} lessonId={lessonId} onClose={() => setExerciseId("")} />
            <AddExerciseModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} lessonId={lessonId} isUpdate={true} exerciseId={exerciseId} onClose={() => setExerciseId("")} selectedLanguage={selectedLanguage} />
            <AddExerciseModal openModal={openViewModal} setOpenModal={setOpenViewModal} lessonId={lessonId} isView={true} exerciseId={exerciseId} onClose={() => setExerciseId("")} selectedLanguage={selectedLanguage} />
            <DeleteModal title='Exercise' openDeleteModal={openDeleteExerciseModal} setopenDeleteModal={setOpenDeleteExerciseModal} handleDelete={handleDeleteExercise} loading={isDeleting} />

        </div>
    )
}