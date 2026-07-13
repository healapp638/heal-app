"use client"

import React from "react"
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import logger from "@/utils/logger";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Form, Input, Modal, Spin, Upload, message } from "antd";
import { FiPlus } from "react-icons/fi"
import AppButton from "../buttons/AppButton";
import { RxCross2 } from "react-icons/rx";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { FILE_URL } from "@/utils/helper";


interface AddCategoryModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    isUpdate?: boolean;
    isView?: boolean;
    categoryId?: string;
    onClose?: () => void;
    selectedLanguage?: string;
}

interface CategoryDetail {
    title: string;
    imgUrl: string;

}

const AddCategoryModal = ({ openModal, setOpenModal, isUpdate, isView, categoryId, onClose, selectedLanguage }: AddCategoryModalProps) => {

    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<any[]>([]);
    const [fileUrl, setFileUrl] = React.useState<string>("");
    const fileListRef = React.useRef<any[]>([]);

    const handleCancel = () => {
        form.resetFields();
        setOpenModal(false);
        setFileList([]);
        setFileUrl("");
        fileListRef.current = [];
        if (onClose) onClose();
    }

    const { data: categoryDetail, isPending: isLoadingCategoryDetail } = useAppQuery<CategoryDetail>({
        queryKey: [MUTATION_KEYS.CATEGORY_DETAIL, categoryId, selectedLanguage || 'en'],
        url: `${ENDPOINTS.PRIVATE.CATEGORY_DETAIL}`,
        params: {
            themeCategoryId: categoryId,
            lang: selectedLanguage || 'en'
        },
        options: {
            staleTime: Infinity,
            enabled: openModal && !!categoryId,
        },
    })
    const categoryDetailData = categoryDetail?.data

    const { mutateAsync: addCategoryTheme, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CATEGORY_CREATE],
        invalidateQueryKeys: [MUTATION_KEYS.CATEGORY_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const { mutateAsync: updateTheme, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CATEGORY_UPDATE],
        invalidateQueryKeys: [[MUTATION_KEYS.CATEGORY_LIST], [MUTATION_KEYS.CATEGORY_DETAIL, categoryId, selectedLanguage || 'en']],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const onFinish = async (values: any) => {
        if (isView) {
            handleCancel();
            return;
        }

        const body = {
            title: values.title,
            imgUrl: fileUrl,
            ...(isUpdate && { themeCategoryId: categoryId }),
            ...(isUpdate && { lang: selectedLanguage || 'en' })
        };

        await tryCatchWrapper(
            async () => {
                if (isUpdate) {
                    await updateTheme({
                        url: ENDPOINTS.PRIVATE.CATEGORY_UPDATE,
                        method: "POST",
                        body: body,
                    });
                } else {
                    await addCategoryTheme({
                        url: ENDPOINTS.PRIVATE.CATEGORY_CREATE,
                        method: "POST",
                        body: body,
                    });
                }
            },
            {
                errorMessage: `Failed to ${isUpdate ? 'update' : 'add'} category theme`,
                showToast: true,
                onError(error) {
                    logger.error(`Failed to ${isUpdate ? 'update' : 'add'} category theme`, error);
                }
            }
        );
    }

    const { mutateAsync: addMediaFile, isPending: fileuploadLoading } = useAppMutate({
        mutationKey: [MUTATION_KEYS.UPLOAD_FILE, isUpdate ? 'update' : isView ? 'view' : 'add'],
        showSuccessToast: false,
        showErrorToast: true,
        onSuccess(data: any) {
            setFileUrl(data[0])
            form.setFieldValue("imgUrl", data[0])
        },
        onError() {
            setFileList([]);
            setFileUrl("");
            form.setFieldValue("imgUrl", "");
            fileListRef.current = [];
        },
    });


    const handleAddFile = async (fileObj: any) => {
        const formData = new FormData();
        const actualFile = fileObj.originFileObj || fileObj;
        formData.append("file", actualFile);

        return await tryCatchWrapper(
            async () => {
                const res = await addMediaFile({
                    url: ENDPOINTS.COMMON.UPLOAD_FILE,
                    method: "POST",
                    body: formData,
                });
                if (res.status < 200 || res.status >= 300) {
                    throw new Error(res.message || "Upload failed");
                }
                return res;
            },
            {
                errorMessage: 'Failed to upload file',
                showToast: true,
                onError(error) {
                    logger.error('Failed to upload file', error);
                    setFileList([]);
                    setFileUrl("");
                    form.setFieldValue("imgUrl", "");
                    fileListRef.current = [];
                }
            }
        );
    }

    const beforeUpload = (file: any) => {
        const isHeic = file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic');
        if (isHeic) {
            message.error('HEIC images are not allowed. Please upload JPG, PNG, or WEBP.');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    const customRequest = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            // Find the full object from the fileList state (using ref to ensure latest)
            const fullFileObject = fileListRef.current.find(f => f.uid === file.uid) || { originFileObj: file, uid: file.uid, name: file.name };
            const result = await handleAddFile(fullFileObject);
            if (!result) {
                onError(new Error("Upload failed"));
                return;
            }
            onSuccess("ok");
        } catch (err) {
            onError(err);
        }
    };

    const handleChange = ({ fileList: newFileList }: any) => {
        const filteredList = newFileList.filter((file: any) => file.status !== 'error');
        setFileList(filteredList);
        fileListRef.current = filteredList;
        if (filteredList.length === 0) {
            setFileUrl("");
            form.setFieldValue("imgUrl", "");
        }
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center text-black!">
            {fileuploadLoading ? <Spin /> : <FiPlus size={24} />}
            <div className="mt-2 text-black! text-sm">{fileuploadLoading ? "Uploading..." : "Upload"}</div>
        </div>
    );

    React.useEffect(() => {
        if (!openModal) {
            form.resetFields();
            setFileList([]);
            setFileUrl("");
            fileListRef.current = [];
        }
    }, [openModal, form]);

    React.useEffect(() => {
        if (openModal && (isUpdate || isView) && categoryDetailData) {
            form.setFieldsValue({
                title: categoryDetailData?.title,
                imgUrl: categoryDetailData?.imgUrl
            });
            if (categoryDetailData?.imgUrl) {
                setFileUrl(categoryDetailData.imgUrl);
                setFileList([
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: `${FILE_URL}${categoryDetailData.imgUrl}`,
                    },
                ]);
            }
        }
    }, [openModal, isView, isUpdate, categoryDetailData, form]);

    return (
        <>
            <Modal
                open={openModal}
                onCancel={handleCancel}
                footer={false}
                centered
                destroyOnHidden={true}
                closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
            >
                <h1 className="text-3xl font-bold text-center text-black">
                    {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">Category</span>
                </h1>
                {(isLoadingCategoryDetail && (isView || isUpdate)) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <div className='bg-white rounded-lg p-6 my-5'>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete='off'
                        className='w-[95%] mx-auto!'
                        requiredMark={false}
                    >
                        <Form.Item
                            name="imgUrl"
                            rules={[
                                { required: true, message: 'Please enter category theme image' },
                            ]}
                            className='flex justify-center items-center'
                        >
                            <Upload
                                name="imgUrl"
                                listType="picture-card"
                                accept="image/*"
                                fileList={fileList}
                                onChange={handleChange}
                                customRequest={customRequest}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                                disabled={isView}
                                className='flex justify-center w-fit rounded-lg p-2'
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            name="title"
                            label={<span className='text-black font-semibold text-md'>Category Theme Title :</span>}
                            rules={[
                                { required: true, message: 'Please enter category theme title' },
                            ]}
                            getValueFromEvent={(e) => {
                                const val = e.target.value;
                                return val ? val.charAt(0).toUpperCase() + val.slice(1) : val;
                            }}
                        >
                            <Input
                                disabled={isView}
                                placeholder="Category Theme Title"
                                className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            />
                        </Form.Item>
                        <Form.Item>
                            <AppButton 
                                isLoading={isPending || isUpdating} 
                                disabled={!isView && !fileUrl}
                                htmlType="submit" 
                                className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" 
                                block
                            >
                                {isView ? "OK" : isUpdate ? "Update Category" : "Add Category"}
                            </AppButton>
                        </Form.Item>
                    </Form>

                </div>
                }

            </Modal>
        </>

    )
}
export default AddCategoryModal;