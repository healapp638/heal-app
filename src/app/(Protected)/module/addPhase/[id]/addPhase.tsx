"use client"
import { AppButton } from "@/components/ui";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Button, Form, Input, Table } from "antd";
import { useParams } from "next/navigation";
import React from "react"
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { ROUTES } from "@/routerKeys";
import { useRouter } from "next/navigation";

export default function AddPhase() {
    const params = useParams();
    const subModuleId = params?.id as string;
    const route = useRouter();
    const [form] = Form.useForm();
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const { data: listPhase } = useAppQuery<any>({
        queryKey: [MUTATION_KEYS.LIST_PHASE],
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

    const { mutateAsync: addPhases, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_PHASE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_PHASE],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            form.resetFields();
        }
    });
    const CreatePhases = async (values: any) => {
        await tryCatchWrapper(
            async () => {
                await addPhases({
                    url: ENDPOINTS.PRIVATE.CREATE_PHASE,
                    method: "POST",
                    body: {
                        subModuleId: subModuleId,
                        title: values.title,
                        points: values.points,
                    },
                });
            },
            {
                errorMessage: 'Failed to add phase',
                showToast: true,
                onError() {
                    console.error('Failed to add phase');
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


    const handleAddLesson = (phaseId: string) => {
        route.push(`${ROUTES.PRIVATE.ADDLESSONS}/${phaseId}`)
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
                Add <span className="text-maincolor">Phase</span>
            </h1>
            <div className='bg-white border-maincolor border-[1.5px] rounded-lg p-6 my-5'>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete='off'
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                    onFinish={CreatePhases}
                >

                    <Form.Item
                        name="title"
                        label={<span className='text-black font-semibold text-md'>Phase Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter phase title' },
                        ]}
                    >
                        <Input
                            placeholder="Phase Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>
                    <Form.Item
                        name="points"
                        label={<span className='text-black font-semibold text-md'>Phase Points :</span>}
                        rules={[
                            { required: true, message: 'Please enter phase points' },
                        ]}
                    >
                        <Input
                            min="1"
                            type="number"
                            placeholder="Phase Points"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            Add Phase
                        </AppButton>
                    </Form.Item>
                </Form>
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

        </div>
    )
}