"use client"

import React from "react"
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Form, Input, Modal, Upload } from "antd";
import { FiPlus } from "react-icons/fi"
import AppButton from "../buttons/AppButton";
import { RxCross2 } from "react-icons/rx";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { FILE_URL } from "@/utils/helper";


interface AddThemeModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    isUpdate?: boolean;
    isView?: boolean;
    themeId?: string;
    onClose?: () => void;
    selectedLanguage?:string;
}

interface ThemeDetail {
    title: string;
    description: string;
    imgUrl: string;
    
}

const AddThemeModal = ({ openModal, setOpenModal, isUpdate, isView, themeId, onClose ,selectedLanguage }: AddThemeModalProps) => {

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

    const { data: themeDetail, isPending: isLoadingThemeDetail } = useAppQuery<ThemeDetail>({
        queryKey: [MUTATION_KEYS.THEME_DETAIL, themeId, selectedLanguage || 'en'],
        url: `${ENDPOINTS.PRIVATE.THEME_DETAIL}`,
        params: {
            themeId: themeId,
            lang: selectedLanguage || 'en'
        },
        options: {
            staleTime: Infinity,
            enabled: openModal && !!themeId,
        },
    })
    const ThemeDetail = themeDetail?.data

    const { mutateAsync: addTheme, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_THEME],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_THEME],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const { mutateAsync: updateTheme, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.UPDATE_THEME, selectedLanguage || 'en'],
        invalidateQueryKeys: [[MUTATION_KEYS.LIST_THEME, selectedLanguage || 'en'], [MUTATION_KEYS.THEME_DETAIL, themeId, selectedLanguage || 'en']],
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
            description: values.description,
            imgUrl: fileUrl,
            ...(isUpdate && { themeId: themeId }),
            ...(isUpdate && { lang: selectedLanguage || 'en' })
        };

        await tryCatchWrapper(
            async () => {
                if (isUpdate) {
                    await updateTheme({
                        url: ENDPOINTS.PRIVATE.UPDATE_THEME,
                        method: "POST",
                        body: body,
                    });
                } else {
                    await addTheme({
                        url: ENDPOINTS.PRIVATE.CREATE_THEME,
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
        showSuccessToast: true,
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
                    handleCancel();
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

    React.useEffect(() => {
        if (!openModal) {
            form.resetFields();
            setFileList([]);
            setFileUrl("");
            fileListRef.current = [];
        }
    }, [openModal, form]);

    React.useEffect(() => {
        if (openModal && (isUpdate || isView) && ThemeDetail) {
            form.setFieldsValue({
                title: ThemeDetail?.title,
                description: ThemeDetail?.description,
                imgUrl: ThemeDetail?.imgUrl
            });
            if (ThemeDetail?.imgUrl) {
                setFileUrl(ThemeDetail.imgUrl);
                setFileList([
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: `${FILE_URL}${ThemeDetail.imgUrl}`,
                    },
                ]);
            }
        }
    }, [openModal, isView, isUpdate, ThemeDetail, form]);
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
                    {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">Theme</span>
                </h1>
                {(isLoadingThemeDetail && (isView || isUpdate)) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <div className='bg-white border-maincolor border-[1.5px] rounded-lg p-6 my-5'>
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
                                disabled={isView}
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
                                disabled={isView}
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
                                disabled={isView}
                                placeholder="Theme Description"
                                className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                                rows={3}
                            />
                        </Form.Item>
                        <Form.Item>
                            <AppButton isLoading={isPending || isUpdating} htmlType="submit" className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                                {isView ? "OK" : isUpdate ? "Update Theme" : "Add Theme"}
                            </AppButton>
                        </Form.Item>
                    </Form>

                </div>
                }

            </Modal>
        </>

    )
}
export default AddThemeModal;