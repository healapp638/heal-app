"use client"

import React from "react"
import { useAppQuery } from "@/tanstack/useAppQuery";
import { ENDPOINTS } from "@/Endpoints";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { useParams, useRouter } from "next/navigation";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { Button, Table } from "antd";
import { AppButton } from "@/components/ui";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import AddLessonsModal from "@/components/ui/modals/addLessonsModal";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import { ROUTES } from "@/routerKeys";
import { ColumnsType } from "antd/es/table";

interface LessonData {
    _id: string;
    lesson_title: string;
    content: string;
    status: boolean;
    language_id: string;
    category_id: string;
    lesson_order: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface LessonResult {
    result: LessonData[];
    page: number;
    limit: number;
    total: number;
}

export default function AddLessons() {

    const params = useParams();
    const phaseId = params?.id as string;
    const route = useRouter();

    const [openAddLessonsModal, setOpenAddLessonsModal] = React.useState(false);
    const [openDeleteLessonModal, setOpenDeleteLessonModal] = React.useState(false);
    const [lessonId, setLessonId] = React.useState<string>("");
    const [openUpdateLessonModal, setOpenUpdateLessonModal] = React.useState(false);
    const [openViewLessonModal, setOpenViewLessonModal] = React.useState(false);
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const { data: listLessons } = useAppQuery<LessonResult>({
        queryKey: [MUTATION_KEYS.LIST_LESSONS, pagination, phaseId],
        url: ENDPOINTS.PRIVATE.LIST_LESSONS,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: "en",
            phase_id: phaseId
        }
    })
    const listLessonsData = listLessons?.data?.result;

    const handleAddExercise = (lessonId: string) => {
        route.push(`${ROUTES.PRIVATE.ADDEXERCISE}/${lessonId}`)
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
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        {
            title: "Add Exercise",
            render: (_: any, record: any) => (
                <div>
                    <Button onClick={() => handleAddExercise(record?._id)} className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" >
                        Add Exercise
                    </Button>
                </div>
            )
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: "center",
            render: (_text: any, record: any) => (
                <div className="flex gap-2  justify-center">
                    <Button icon={<FaEye size={20} />} onClick={() => { setLessonId(record?._id); setOpenViewLessonModal(true) }} className="border-none! cursor-pointer! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiEdit size={20} />} onClick={() => { setLessonId(record?._id); setOpenUpdateLessonModal(true) }} className="border-none! cursor-pointer!  bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} onClick={() => { setLessonId(record?._id); setOpenDeleteLessonModal(true) }} className="border-none! cursor-pointer!  text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                </div>
            ),
        },

    ]

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Lessons</span>
                </h1>
                <AppButton onClick={() => { setOpenAddLessonsModal(true) }} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                    Add Lessons
                </AppButton>
            </div>
            <Table
                dataSource={listLessonsData}
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
            <AddLessonsModal phaseId={phaseId} openAddLessonsModal={openAddLessonsModal} setOpenAddLessonsModal={setOpenAddLessonsModal} />
            <DeleteModal title='Lesson' openDeleteModal={openDeleteLessonModal} setopenDeleteModal={setOpenDeleteLessonModal} handleDelete={handleDeleteLesson} loading={isDeleting} />
            <AddLessonsModal phaseId={phaseId} openAddLessonsModal={openViewLessonModal} setOpenAddLessonsModal={setOpenViewLessonModal} isView={true} lessonID={lessonId} />
            <AddLessonsModal phaseId={phaseId} openAddLessonsModal={openUpdateLessonModal} setOpenAddLessonsModal={setOpenUpdateLessonModal} isUpdate={true} lessonID={lessonId} />
        </div>
    )
}