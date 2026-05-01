"use client"

import React from "react"
import { AppButton } from "@/components/ui"
import { ENDPOINTS } from "@/Endpoints"
import { MUTATION_KEYS } from "@/tanstack/keys"
import { useAppQuery } from "@/tanstack/useAppQuery"
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { Button, Table } from "antd"
import { useParams, useRouter } from "next/navigation"
import { ROUTES } from "@/routerKeys"
import AddSubModuleModal from "@/components/ui/modals/addSubModuleModal"
import DeleteModal from "@/components/ui/modals/DeleteModal"
import { tryCatchWrapper } from "@/utils/tryCatchWrapper"
import { useAppMutate } from "@/tanstack/useAppMutate"
import { ColumnsType } from "antd/es/table"

interface SubModuleData {
    _id: string;
    title: string;
    slug: string;
    status: boolean;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface SubModuleResult {
    result: SubModuleData[];
    page: number;
    limit: number;
    total: number;
}

export default function AddSubModule() {

    const route = useRouter()
    const params = useParams();
    const moduleId = params?.id as string;
    const [openAddSubModuleModal, setOpenAddSubModuleModal] = React.useState(false)
    const [openDeleteModule, setOpenDeleteModule] = React.useState(false)
    const [selectedSubModule, setSelectedSubModule] = React.useState("")
    const [openUpdateSubModuleModal, setOpenUpdateSubModuleModal] = React.useState(false)
    const [openViewSubModuleModal, setOpenViewSubModuleModal] = React.useState(false)

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const { data: listsubModule } = useAppQuery<SubModuleResult>({
        queryKey: [MUTATION_KEYS.LIST_SUB_MODULE],
        url: ENDPOINTS.PRIVATE.LIST_SUB_MODULE,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: "en",
            moduleId: moduleId
        }
    })
    const SubModuleListData = listsubModule?.data?.result;

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


    const handleAddPhase = (subModuleId: string) => {
        route.push(`${ROUTES.PRIVATE.ADDPHASES}/${subModuleId}`)
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
            title: "Add Phase",
            render: (_: any, record: any) => (
                <div>
                    <Button onClick={() => { handleAddPhase(record?._id) }} className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" >
                        Add Phase
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
                    <Button icon={<FaEye size={20} />} onClick={() => { setOpenViewSubModuleModal(true); setSelectedSubModule(record?._id) }} className="border-none! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiEdit size={20} />} onClick={() => { setOpenUpdateSubModuleModal(true); setSelectedSubModule(record?._id) }} className="border-none! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} onClick={() => { setOpenDeleteModule(true); setSelectedSubModule(record?._id) }} className="border-none! text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                </div>
            ),
        },
    ]

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">SubModule</span>
                </h1>
                <AppButton onClick={() => { setOpenAddSubModuleModal(true) }} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                    Add SubModule
                </AppButton>
            </div>

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={SubModuleListData}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: SubModuleListData?.length,
                    onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                }}
            />
            <AddSubModuleModal openModal={openAddSubModuleModal} setOpenModal={setOpenAddSubModuleModal} moduleId={moduleId} />
            <AddSubModuleModal openModal={openUpdateSubModuleModal} setOpenModal={setOpenUpdateSubModuleModal} moduleId={moduleId} subModuleId={selectedSubModule} isUpdate={true} />
            <AddSubModuleModal openModal={openViewSubModuleModal} setOpenModal={setOpenViewSubModuleModal} moduleId={moduleId} subModuleId={selectedSubModule} isView={true} />
            <DeleteModal title='SubModule' openDeleteModal={openDeleteModule} setopenDeleteModal={setOpenDeleteModule} handleDelete={handleDeleteSubModule} loading={isDeleting} />
        </div>
    )
}