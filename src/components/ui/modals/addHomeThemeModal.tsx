"use client"

import React from "react"
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Form, Modal, Upload, message } from "antd";
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
    homeThemeId?: string;
    categoryID?: string
    onClose?: () => void;
}

interface CategoryDetail {
    imgUrl: string;

}

const AddHomeThemeModal = ({ openModal, setOpenModal, isUpdate, isView, categoryID, homeThemeId, onClose }: AddCategoryModalProps) => {

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
        queryKey: [MUTATION_KEYS.HOMETHEME_DETAIL, homeThemeId],
        url: `${ENDPOINTS.PRIVATE.HOMETHEME_DETAIL}`,
        params: {
            hometheme_id: homeThemeId,
        },
        options: {
            staleTime: Infinity,
            enabled: openModal && !!homeThemeId,
        },
    })
    const categoryDetailData = categoryDetail?.data

    const { mutateAsync: addHomeTheme, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.HOMETHEME_CREATE],
        invalidateQueryKeys: [MUTATION_KEYS.HOMETHEME_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const { mutateAsync: updateTheme, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.HOMETHEME_UPDATE],
        invalidateQueryKeys: [[MUTATION_KEYS.HOMETHEME_LIST], [MUTATION_KEYS.HOMETHEME_DETAIL, homeThemeId]],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const onFinish = async () => {
        if (isView) {
            handleCancel();
            return;
        }

        const body = {
            imgUrl: fileUrl,
            categoryTheme_id: categoryID,
            ...(isUpdate && { hometheme_id: homeThemeId }),
        };

        await tryCatchWrapper(
            async () => {
                if (isUpdate) {
                    await updateTheme({
                        url: ENDPOINTS.PRIVATE.HOMETHEME_UPDATE,
                        method: "POST",
                        body: body,
                    });
                } else {
                    await addHomeTheme({
                        url: ENDPOINTS.PRIVATE.HOMETHEME_CREATE,
                        method: "POST",
                        body: body,
                    });
                }
            },
            {
                errorMessage: `Failed to ${isUpdate ? 'update' : 'add'} theme`,
                showToast: true,
                onError() {
                    console.error(`Failed to ${isUpdate ? 'update' : 'add'} theme`);
                }
            }
        );
    }

    const { mutateAsync: addMediaFile } = useAppMutate({
        mutationKey: [MUTATION_KEYS.UPLOAD_FILE],
        showSuccessToast: false,
        showErrorToast: true,
        onSuccess(data: any) {
            setFileUrl(data[0])
            form.setFieldValue("imgUrl", data[0])
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
                onError() {
                    console.error('Failed to upload file');
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
        setFileList(newFileList);
        fileListRef.current = newFileList;
        if (newFileList.length === 0) {
            setFileUrl("");
            form.setFieldValue("imgUrl", "");
        }
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center text-gray-500">
            <FiPlus size={24} />
            <div className="mt-2 text-sm">Upload</div>
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
                    {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">Home Theme</span>
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
                                { required: true, message: 'Please enter theme image' },
                            ]}
                        >
                            <div className="flex justify-center items-center w-full">
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
                                    className="theme-upload-container"
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <AppButton
                                isLoading={isPending || isUpdating}
                                disabled={!isView && !fileUrl}
                                htmlType="submit"
                                className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!"
                                block
                            >
                                {isView ? "OK" : isUpdate ? "Update Home Theme" : "Add Home Theme"}
                            </AppButton>
                        </Form.Item>
                    </Form>

                </div>
                }

            </Modal>
        </>

    )
}
export default AddHomeThemeModal;