"use client"
import React from "react"
import { useAppQuery } from "@/tanstack/useAppQuery";
import { ENDPOINTS } from "@/Endpoints";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { useParams } from "next/navigation";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { Button, Form, Input, Table } from "antd";
import { AppButton } from "@/components/ui";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";

export default function AddLessons() {
    const params = useParams();
    const phaseId = params?.id as string;

    const [form] = Form.useForm();
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const { data: listLessons } = useAppQuery<any>({
        queryKey: [MUTATION_KEYS.LIST_LESSONS],
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

    const { mutateAsync: addLessons, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_LESSONS],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_LESSONS],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            form.resetFields();
        }
    });
    const CreateLessons = async (values: any) => {
        await tryCatchWrapper(
            async () => {
                await addLessons({
                    url: ENDPOINTS.PRIVATE.CREATE_LESSONS,
                    method: "POST",
                    body: {
                        phase_id: phaseId,
                        ...values,
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

    const columns = [
          {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title:"Reading Title",
            dataIndex: "reading_title",
            key: "reading_title",
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
       
        {
            title:"Concept Title",
            dataIndex: "concept_title",
            key: "concept_title",
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
         {
            title: "Add Exercise",
            render: (_: any) => (
                <div>
                    <Button className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" >
                        Add Exercise
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
                Add <span className="text-maincolor">Lessons</span>
            </h1>
            <div className='bg-white border-maincolor border-[1.5px] rounded-lg p-6 my-5'>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete='off'
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                    onFinish={CreateLessons}
                >

                    <Form.Item
                        name="reading_title"
                        label={<span className='text-black font-semibold text-md'>Reading Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter reading title' },
                        ]}
                    >
                        <Input
                            placeholder="Reading Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>
                    <Form.Item
                        name="reading_description"
                        label={<span className='text-black font-semibold text-md'>Reading Description :</span>}
                        rules={[
                            { required: true, message: 'Please enter reading description' },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Reading Description"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item
                        name="concept_title"
                        label={<span className='text-black font-semibold text-md'>Concept Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter concept title' },
                        ]}
                    >
                        <Input
                            placeholder="Concept Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>
                    <Form.Item
                        name="concept_description"
                        label={<span className='text-black font-semibold text-md'>Concept Description :</span>}
                        rules={[
                            { required: true, message: 'Please enter concept description' },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Concept Description"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item
                        name="reflection"
                        label={<span className='text-black font-semibold text-md'>Reflection :</span>}
                        rules={[
                            { required: true, message: 'Please enter reflection' },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Reflection"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            Add Lessons
                        </AppButton>
                    </Form.Item>
                </Form>
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
        </div>
    )
}