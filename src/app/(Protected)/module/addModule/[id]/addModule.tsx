"use client"
import { AppButton } from "@/components/ui";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Button, Form, Input, Table } from "antd";
import { useParams, useRouter } from "next/navigation";
import React from "react"
import { ROUTES } from "@/routerKeys";

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
    const { mutateAsync: addModule, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_MODULE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_MODULE],
        showSuccessToast: true,
        showErrorToast: true,
    });

    const { data: listModule } = useAppQuery<ModuleResult>({
        queryKey: [MUTATION_KEYS.LIST_MODULE],
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

    const AddModule = async (values: any) => {

        await tryCatchWrapper(
            async () => {
                await addModule({
                    url: ENDPOINTS.PRIVATE.CREATE_MODULE,
                    method: "POST",
                    body: {
                        themeId: themeId,
                        title: values.title,
                    },
                });
            },
            {
                errorMessage: 'Failed to add theme',
                showToast: true,
                onError() {
                    console.error('Failed to add theme');
                }
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

    const handleAddSubModule = (moduleId: string) => {
        route.push(`${ROUTES.PRIVATE.SUBMODULE}/${moduleId}`)
    };

    const columns = [
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
            render: (_text: any, _record: any) => (
                <div className="flex gap-2">
                    <Button icon={<FaEye size={20} />} className="border-0 bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiEdit size={20} />} className="border-0 bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} className="border-0 text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                </div>
            ),
        },
    ]
    return (
        <div>
            <h1 className="text-3xl font-bold text-black">
                Add <span className="text-maincolor">Module</span>
            </h1>
            <div className='bg-white border-maincolor border-[1.5px] rounded-lg p-6 my-5'>
                <Form
                    layout="vertical"
                    autoComplete='off'
                    onFinish={AddModule}
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                >

                    <Form.Item
                        name="title"
                        label={<span className='text-black font-semibold text-md'>Module Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter module title' },
                        ]}
                    >
                        <Input
                            placeholder="Module Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            Add Module
                        </AppButton>
                    </Form.Item>
                </Form>
            </div>
            <Table
                dataSource={ModuleListData}
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
            />
        </div>
    )
}