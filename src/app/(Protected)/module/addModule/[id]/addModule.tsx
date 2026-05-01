"use client"

import React from "react"
import { AppButton } from "@/components/ui";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Button, Table } from "antd";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/routerKeys";
import AddModuleModal from "@/components/ui/modals/addModuleModal";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import { ColumnsType } from "antd/es/table";

interface ModuleData {
    _id: string;
    title: string;
    slug: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ModuleResult {
    result: ModuleData[];
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

    const [openUpdateModal, setOpenUpdateModal] = React.useState(false)
    const [openViewModal, setOpenViewModal] = React.useState(false)

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
        queryKey: [MUTATION_KEYS.LIST_MODULE, pagination, themeId],
        url: ENDPOINTS.PRIVATE.LIST_MODULE,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: "en",
            themeId: themeId
        }
    })
    const ModuleListData = listModule?.data?.result;

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
        route.push(`${ROUTES.PRIVATE.SUBMODULE}/${moduleId}`)
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
        {
            title: "Add SubModule",
            render: (_: any, record: any) => (
                <div>
                    <Button onClick={() => { handleAddSubModule(record?._id) }} className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" >
                        Add SubModule
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
                    <Button icon={<FaEye size={20} />} onClick={() => { setOpenViewModal(true); setSelectedModule(record?._id) }} className="border-none!  bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiEdit size={20} />} onClick={() => { setOpenUpdateModal(true); setSelectedModule(record?._id) }} className="border-none! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} onClick={() => { setSelectedModule(record?._id); setOpenDeleteModule(true) }} className="border-none! text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                </div>
            ),
        },
    ]
    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Module</span>
                </h1>
                <AppButton onClick={() => { setOpenAddModal(true) }} className="bg-maincolor! w-26! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                    Add Module
                </AppButton>
            </div>

            <Table
                columns={columns}
                dataSource={ModuleListData}
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
            <AddModuleModal openModal={openViewModal} setOpenModal={setOpenViewModal} ThemeID={themeId} isView={true} moduleId={selectedModule} onClose={() => setSelectedModule("")} />
            <AddModuleModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} ThemeID={themeId} isUpdate={true} moduleId={selectedModule} onClose={() => setSelectedModule("")} />
            <DeleteModal title='Module' openDeleteModal={openDeleteModule} setopenDeleteModal={setOpenDeleteModule} handleDelete={handleDeleteModule} loading={isDeleting} />

        </div>
    )
}