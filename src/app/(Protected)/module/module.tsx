"use client"

import React from 'react'
import { AppButton } from '@/components/ui'
import { Button, Form, Image, Input, Table, Upload } from 'antd';
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { tryCatchWrapper } from '@/utils/tryCatchWrapper';
import { ENDPOINTS } from '@/Endpoints';
import { MUTATION_KEYS } from '@/tanstack/keys';
import logger from '@/utils/logger';
import { useAppMutate } from '@/tanstack/useAppMutate';
import { useAppQuery } from '@/tanstack/useAppQuery';
import { FILE_URL } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routerKeys';

export interface Theme {
    _id: string;
    imgUrl: string;
    title: string;
    description: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

export interface ThemeResponse {
    result: Theme[];
}

export default function Module() {

    const route = useRouter()
    const [fileList, setFileList] = React.useState<any[]>([]);
    const [fileUrl, setFileUrl] = React.useState<string>("");
    const fileListRef = React.useRef<any[]>([]);
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const { data: listTheme } = useAppQuery<ThemeResponse>({
        queryKey: [MUTATION_KEYS.LIST_THEME],
        url: ENDPOINTS.PRIVATE.LIST_THEME,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
        }
    })
    const ThemeListData = listTheme?.data?.result;

    const { mutateAsync: DeleteTheme } = useAppMutate({
        mutationKey: [MUTATION_KEYS.DELETE_THEME],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_THEME],
        showSuccessToast: true,
        showErrorToast: true,
    });
    const { mutateAsync: addTheme } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_THEME],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_THEME],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess(data: any) {
            setFileUrl(data[0])
        },
    });
    
    const AddTheme = async (values: any) => {

        await tryCatchWrapper(
            async () => {
                await addTheme({
                    url: ENDPOINTS.PRIVATE.CREATE_THEME,
                    method: "POST",
                    body: {
                        title: values.title,
                        description: values.description,
                        imgUrl: fileUrl,
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

    const { mutateAsync: addMediaFile } = useAppMutate({
        mutationKey: [MUTATION_KEYS.UPLOAD_FILE],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess(data: any) {
            logger.log("Category added successfully", data[0]);
            setFileUrl(data[0])
        },
    });

    const handleAddFile = async (fileObj: any) => {
        const formData = new FormData();
        const actualFile = fileObj.originFileObj || fileObj;
        formData.append("file", actualFile);

        await tryCatchWrapper(
            async () => {
                await addMediaFile({
                    url: ENDPOINTS.COMMON.UPLOAD_FILE,
                    method: "POST",
                    body: formData,
                });
            },
            {
                errorMessage: 'Failed to upload file',
                showToast: true,
                onError() {
                    // Optionally handle error state here
                    console.error('Failed to upload file');
                }
            }
        );
    }

    const handleDeleteTheme = async (id: string) => {
        await tryCatchWrapper(
            async () => {
                await DeleteTheme({
                    url: ENDPOINTS.PRIVATE.DELETE_THEME,
                    method: "DELETE",
                    body: {
                        themeId: id,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete theme',
                showToast: true,
                onError() {
                    console.error('Failed to delete theme');
                }
            }
        );
    }

    const customRequest = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            // Find the full object from the fileList state (using ref to ensure latest)
            const fullFileObject = fileListRef.current.find(f => f.uid === file.uid) || { originFileObj: file, uid: file.uid, name: file.name };

            await handleAddFile(fullFileObject);
            onSuccess("ok");
        } catch (err) {
            onError(err);
        }
    };

    const handleChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
        fileListRef.current = newFileList;
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center text-gray-500">
            <FiPlus size={24} />
            <div className="mt-2 text-sm">Upload</div>
        </div>
    );

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

    const handleAddModule = (themeId: string) => {
        route.push(`${ROUTES.PRIVATE.ADDMODULE}/${themeId}`)
    }

    const columns = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: Theme, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: "Theme Image",
            dataIndex: "imgUrl",
            key: "imgUrl",
            render: (imgUrl: string) => <Image src={`${FILE_URL}${imgUrl}`} alt="image" width={100} height={100} className='rounded-lg' preview={false} draggable={false} />,
        },
        {
            title: "Theme Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        {
            title: "Add Module",
            dataIndex: "add_module",
            key: "add_module",
            render: (_: any, record: Theme) => (
                <div>
                    <Button onClick={() => handleAddModule(record?._id)} className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" >
                        Add Module
                    </Button>
                </div>
            )
        },
        {
            title: "Actions",
            render: (_: any, record: Theme) => (
                <div className="flex gap-2">
                    <Button icon={<FaEye size={20} />} className="border-0 bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiEdit size={20} />} className="border-0 bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} onClick={() => handleDeleteTheme(record?._id)} className="border-0 text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                </div>
            ),
        }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-black">
                Add <span className="text-maincolor">Themes</span>
            </h1>
            <div className='bg-white border-maincolor border-[1.5px] rounded-lg p-6 my-5'>
                <Form
                    layout="vertical"
                    onFinish={AddTheme}
                    autoComplete='off'
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                >
                    <Form.Item
                        name="imgUrl"
                        rules={[
                            { required: true, message: 'Please enter theme image' },
                        ]}
                        className='flex justify-center'
                    >
                        <Upload
                            name="imgUrl"
                            listType="picture-card"
                            accept="image/*"
                            fileList={fileList}
                            onChange={handleChange}
                            customRequest={customRequest}
                            maxCount={1}
                            className='flex justify-center w-fit rounded-lg p-2'
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label={<span className='text-black font-semibold text-md'>Theme Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter theme title' },
                        ]}
                    >
                        <Input
                            placeholder="Theme Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={<span className='text-black font-semibold text-md'>Theme Description :</span>}
                        rules={[
                            { required: true, message: 'Please enter theme description' },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Theme Description"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item>
                        <AppButton htmlType="submit" className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            Add Theme
                        </AppButton>
                    </Form.Item>
                </Form>

            </div>
            <div>
                <Table
                    dataSource={ThemeListData}
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
        </div>
    )
}
