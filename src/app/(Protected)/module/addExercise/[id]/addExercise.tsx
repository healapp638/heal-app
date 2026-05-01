"use client"

import { AppButton } from "@/components/ui"
import AddExerciseModal from "@/components/ui/modals/addExerciseModal"
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { Button, Table } from "antd";
import { useParams } from "next/navigation";
import React from "react"
import DeleteModal from "@/components/ui/modals/DeleteModal";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { ColumnsType } from "antd/es/table";

interface ExerciseData {
    _id: string;
    title: string;
    description: string;
    content: string;
    status: boolean;
    exercise_type: string;
    language_id: string;
    category_id: string;
    exercise_order: number;
    hint: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ExerciseResult {
    result: ExerciseData[];
    page: number;
    limit: number;
    total: number;
}

export default function AddExercise() {

    const params = useParams();
    const lessonId = params?.id as string;
    const [openModal, setOpenModal] = React.useState(false);
    const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
    const [openDeleteExerciseModal, setOpenDeleteExerciseModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [exerciseId, setExerciseId] = React.useState("");
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const { data: listExercises } = useAppQuery<ExerciseResult>({
        queryKey: [MUTATION_KEYS.EXERCISE_LIST, pagination, lessonId],
        url: ENDPOINTS.PRIVATE.EXERCISE_LIST,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: "en",
            exercise_details_id: lessonId
        }
    })
    const listExercisesData = listExercises?.data?.result;


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
                            exercise_id: exerciseId,
                        },
                    });
                },
                {
                    errorMessage: 'Failed to delete exercise',
                    showToast: true,
                    onError() {
                        console.error('Failed to delete exercise');
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

    const columns:ColumnsType<ExerciseData> = [
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
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: "center",
            render: (_text: any, record: any) => (
                <div className="flex gap-2 justify-center">
                    <Button icon={<FaEye size={20} />} onClick={() => { setOpenViewModal(true); setExerciseId(record._id) }} className="border-none! cursor-pointer! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiEdit size={20} />} onClick={() => { setOpenUpdateModal(true); setExerciseId(record._id) }} className="border-none! cursor-pointer! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} onClick={() => { setOpenDeleteExerciseModal(true); setExerciseId(record._id) }} className="border-none! cursor-pointer! text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                </div>
            ),
        },
    ]

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Exercises</span>
                </h1>
                <AppButton onClick={() => setOpenModal(true)} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                    Add Exercise
                </AppButton>
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
            />
            <AddExerciseModal openModal={openModal} setOpenModal={setOpenModal} lessonId={lessonId} onClose={() => setExerciseId("")} />
            <AddExerciseModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} lessonId={lessonId} isUpdate={true} exerciseId={exerciseId} onClose={() => setExerciseId("")} />
            <AddExerciseModal openModal={openViewModal} setOpenModal={setOpenViewModal} lessonId={lessonId} isView={true} exerciseId={exerciseId} onClose={() => setExerciseId("")} />
            <DeleteModal title='Exercise' openDeleteModal={openDeleteExerciseModal} setopenDeleteModal={setOpenDeleteExerciseModal} handleDelete={handleDeleteExercise} loading={isDeleting} />


        </div>
    )
}