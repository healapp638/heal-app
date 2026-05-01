"use client"
import { AppButton } from "@/components/ui";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Button, Table } from "antd";
import { useParams } from "next/navigation";
import React from "react"
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { ROUTES } from "@/routerKeys";
import { useRouter } from "next/navigation";
import AddPhaseModal from "@/components/ui/modals/addPhaseModal";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import { ColumnsType } from "antd/es/table";

interface PhaseData {
    _id: string;
    title: string;
    points: number;
    status: boolean;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface PhaseResult {
    result: PhaseData[];
    page: number;
    limit: number;
    total: number;
}

export default function AddPhase() {

    const params = useParams();
    const subModuleId = params?.id as string;
    const route = useRouter();
    const [openAddPhaseModal, setOpenAddPhaseModal] = React.useState(false);
    const [openDeletePhaseModal, setOpenDeletePhaseModal] = React.useState(false);
    const [openPhaseUpdateModal, setOpenPhaseUpdateModal] = React.useState(false);
    const [openPhaseViewModal, setOpenPhaseViewModal] = React.useState(false);
    const [selectPhase, setSelectPhase] = React.useState("");

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const { data: listPhase } = useAppQuery<PhaseResult>({
        queryKey: [MUTATION_KEYS.LIST_PHASE, pagination, subModuleId],
        url: ENDPOINTS.PRIVATE.LIST_PHASE,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: "en",
            subModuleId: subModuleId
        }
    })
    const PhaseListData = listPhase?.data?.result;


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
        route.push(`${ROUTES.PRIVATE.ADDLESSONS}/${phaseId}`)
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
                        phaseId: selectPhase,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete module',
                showToast: true,
                onError() {
                    console.error('Failed to delete theme');
                    setOpenDeletePhaseModal(false)
                    setSelectPhase("")
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
        {
            title: "Add Lesson",
            render: (_: any, record: any) => (
                <div>
                    <Button onClick={() => { handleAddLesson(record?._id) }} className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" >
                        Add Lesson
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
                    <Button icon={<FaEye size={20} />} onClick={() => { setSelectPhase(record?._id); setOpenPhaseViewModal(true) }} className="border-none! cursor-pointer! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiEdit size={20} />} onClick={() => { setSelectPhase(record?._id); setOpenPhaseUpdateModal(true) }} className="border-none! cursor-pointer! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} onClick={() => { setSelectPhase(record?._id); setOpenDeletePhaseModal(true) }} className="border-none! cursor-pointer! text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                </div>
            ),
        },
    ]

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Phase</span>
                </h1>
                <AppButton onClick={() => { setOpenAddPhaseModal(true) }} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                    Add Phases
                </AppButton>
            </div>

            <Table
                dataSource={PhaseListData}
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
            <AddPhaseModal openAddPhaseModal={openAddPhaseModal} setOpenAddPhaseModal={setOpenAddPhaseModal} subModuleId={subModuleId} />
            <DeleteModal title='Phase' openDeleteModal={openDeletePhaseModal} setopenDeleteModal={setOpenDeletePhaseModal} handleDelete={handleDeletePhase} loading={isDeleting} />
            <AddPhaseModal openAddPhaseModal={openPhaseUpdateModal} setOpenAddPhaseModal={setOpenPhaseUpdateModal} subModuleId={subModuleId} isUpdate={true} phaseID={selectPhase} />
            <AddPhaseModal openAddPhaseModal={openPhaseViewModal} setOpenAddPhaseModal={setOpenPhaseViewModal} subModuleId={subModuleId} isView={true} phaseID={selectPhase} />

        </div>
    )
}