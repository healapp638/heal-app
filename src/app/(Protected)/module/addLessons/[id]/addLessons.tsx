"use client"

import React from "react"
import { Breadcrumb, ConfigProvider, Select, Switch, Table } from "antd";
import { FaEye } from "react-icons/fa";
import { ROUTES } from "@/routerKeys";
import { ENDPOINTS } from "@/Endpoints";
import { ColumnsType } from "antd/es/table";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { useAppQuery } from "@/tanstack/useAppQuery";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import AddLessonsModal from "@/components/ui/modals/addLessonsModal";
import { FaPlus } from "react-icons/fa";
import IconButton from "@/components/ui/IconButton";
import { AppButton } from "@/components/ui";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface LessonData {
    _id: string;
    lesson_title: string;
    content: string;
    status: number;
    language_id: string;
    category_id: string;
    lesson_order: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
interface PhaseData {
    _id: string;
    title: string;
    status: number;
}

interface LessonResult {
    result: LessonData[];
    phaseDetails: PhaseData;
    page: number;
    limit: number;
    total: number;
    totalCount?: number;
}

export default function AddLessons() {

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

    const [openAddLessonsModal, setOpenAddLessonsModal] = React.useState(false);
    const [openDeleteLessonModal, setOpenDeleteLessonModal] = React.useState(false);
    const [lessonId, setLessonId] = React.useState<string>("");
    const [openUpdateLessonModal, setOpenUpdateLessonModal] = React.useState(false);
    const [openViewLessonModal, setOpenViewLessonModal] = React.useState(false);
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
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

    const { data: listLessons } = useAppQuery<LessonResult>({
        queryKey: [MUTATION_KEYS.LIST_LESSONS, pagination, phaseId, selectedLanguage],
        url: ENDPOINTS.PRIVATE.LIST_LESSONS,
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
    const listLessonsData = listLessons?.data?.result;
    const PhaseData = listLessons?.data?.phaseDetails;

    const handleAddExercise = (lessonId: string) => {
        route.push(`${ROUTES.PRIVATE.ADDEXERCISE}/${lessonId}?themeTitle=${themeTitle}&themeId=${themeId}&moduleTitle=${moduleTitle}&moduleID=${moduleID}&subModuleTitle=${subModuleTitle}&subModuleId=${subModuleId}&phaseTitle=${PhaseData?.title}&phaseId=${phaseId}`)
    };

    const { mutateAsync: DeleteLesson, isPending: isDeleting } = useAppMutate({
        mutationKey: [MUTATION_KEYS.LESSON_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_LESSONS],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeleteLessonModal(false);
            setLessonId("");
        }
    });

    const handleDeleteLesson = async () => {
        await tryCatchWrapper(
            async () => {
                await DeleteLesson({
                    url: ENDPOINTS.PRIVATE.LESSON_DELETE,
                    method: "DELETE",
                    body: {
                        status: 2,
                        exercise_details_id: lessonId,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete lesson',
                showToast: true,
                onError() {
                    console.error('Failed to delete lesson');
                    setOpenDeleteLessonModal(false)
                    setLessonId("")
                },
            }
        );
    }

    const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.LESSON_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_LESSONS],
        showSuccessToast: false,
        showErrorToast: true,
    });

    const handleStatusChangeClick = async (changeStatus: number, lessonId: string) => {
        await tryCatchWrapper(
            async () => {
                await StatusChange({
                    url: ENDPOINTS.PRIVATE.LESSON_DELETE,
                    method: "DELETE",
                    body: {
                        status: changeStatus,
                        exercise_details_id: lessonId,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete lesson',
                showToast: true,
                onError() {
                    console.error('Failed to delete lesson');
                    setOpenDeleteLessonModal(false)
                    setLessonId("")
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

    const columns: ColumnsType<LessonData> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: "Reading Title",
            dataIndex: "reading_title",
            key: "reading_title",
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },

        {
            title: "Concept Title",
            dataIndex: "concept_title",
            key: "concept_title",
            render: (text: string) => <span className='font-medium text-black'>{text || 'N/A'}</span>
        },
        // {
        //     title: "Add Exercise",
        //     render: (_: any, record: any) => (
        //         <div>
        //             <Button
        //                 loading={loadingExerciseId === record?._id}
        //                 onClick={() => handleAddExercise(record?._id)}
        //                 className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!"
        //             >
        //                 Add Exercise
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
                    <IconButton icon={<FaPlus size={20} />} onClick={(e) => { e.stopPropagation(); handleAddExercise(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenViewLessonModal(true); setLessonId(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenUpdateLessonModal(true); setLessonId(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteLessonModal(true); setLessonId(record?._id) }} className="" />
                </div>
            ),
        },

    ]

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                {/* <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Lessons</span>
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
                                    title: <span className="text-maincolor text-h2 font-bold cursor-pointer truncate max-w-[150px] inline-block align-bottom" onClick={() => { route.push(`${ROUTES.PRIVATE.ADDPHASES}/${subModuleId}?themeTitle=${themeTitle}&themeId=${themeId}&moduleTitle=${moduleTitle}&moduleID=${moduleID}`) }}>{PhaseData?.title}</span>
                                },
                                {
                                    title: <span className="text-maincolor text-h2 font-bold">Lessons</span>
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
                    {listLessons?.data && (listLessons?.data?.totalCount ?? 0) < 1 && <AppButton onClick={() => { setOpenAddLessonsModal(true) }} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Lessons
                    </AppButton>}
                </div>
            </div>
            <Table
                dataSource={listLessonsData}
                columns={columns}
                onRow={(record) => ({
                    onClick: () => handleAddExercise(record?._id)
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
                className="cursor-pointer"
                bordered
            />
            <AddLessonsModal phaseId={phaseId} openAddLessonsModal={openAddLessonsModal} setOpenAddLessonsModal={setOpenAddLessonsModal} />
            <DeleteModal title='Lesson' openDeleteModal={openDeleteLessonModal} setopenDeleteModal={setOpenDeleteLessonModal} handleDelete={handleDeleteLesson} loading={isDeleting} />
            <AddLessonsModal phaseId={phaseId} openAddLessonsModal={openViewLessonModal} setOpenAddLessonsModal={setOpenViewLessonModal} isView={true} lessonID={lessonId} selectedLanguage={selectedLanguage} />
            <AddLessonsModal phaseId={phaseId} openAddLessonsModal={openUpdateLessonModal} setOpenAddLessonsModal={setOpenUpdateLessonModal} isUpdate={true} lessonID={lessonId} selectedLanguage={selectedLanguage} />
        </div>
    )
}