"use client"

import React from "react"
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Form, Input, Modal } from "antd"
import AppButton from "../buttons/AppButton";
import { RxCross2 } from "react-icons/rx";
import { useAppQuery } from "@/tanstack/useAppQuery";


interface AddModuleModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    ThemeID: string;
    isView?: boolean;
    isUpdate?: boolean;
    moduleId?: string;
    selectedLanguage?:string;
    onClose?: () => void;
}

interface ModuleDetail {
    title: string;
}

const AddModuleModal = ({ openModal, setOpenModal, ThemeID, isView, isUpdate, moduleId, onClose , selectedLanguage }: AddModuleModalProps) => {

    const [form] = Form.useForm();
    const handleCancel = () => {
        form.resetFields();
        setOpenModal(false);
        if (onClose) onClose();
    }
    const { data: ModuleDetail, isPending: isLoadingModuleDetail } = useAppQuery<ModuleDetail>({
        queryKey: [MUTATION_KEYS.DETAIL_MODULE, moduleId,selectedLanguage || "en"],
        url: `${ENDPOINTS.PRIVATE.DETAIL_MODULE}`,
        params: {
            moduleId: moduleId,
            lang: selectedLanguage||"en"
        },
        options: {
            staleTime: Infinity,
            enabled: openModal && !!moduleId,
        },
    })
    const moduleData = ModuleDetail?.data

    const { mutateAsync: addModule, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_MODULE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_MODULE],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const { mutateAsync: updateModule, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.UPDATE_MODULE],
        invalidateQueryKeys: [[MUTATION_KEYS.LIST_MODULE], [MUTATION_KEYS.DETAIL_MODULE, moduleId, selectedLanguage || "en"]],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const UpdateModule = async (values: any) => {

        await tryCatchWrapper(
            async () => {
                await updateModule({
                    url: ENDPOINTS.PRIVATE.UPDATE_MODULE,
                    method: "POST",
                    body: {
                        moduleId: moduleId,
                        title: values.title,
                        lang: selectedLanguage || "en"
                    },
                });
            },
            {
                errorMessage: 'Failed to add theme',
                showToast: true,
                onError() {
                    console.error('Failed to add theme');
                    handleCancel();
                }
            }
        );
    }


    const AddModule = async (values: any) => {

        await tryCatchWrapper(
            async () => {
                await addModule({
                    url: ENDPOINTS.PRIVATE.CREATE_MODULE,
                    method: "POST",
                    body: {
                        themeId: ThemeID,
                        title: values.title,
                    },
                });
            },
            {
                errorMessage: 'Failed to add theme',
                showToast: true,
                onError() {
                    console.error('Failed to add theme');
                    handleCancel();
                }
            }
        );
    }

    React.useEffect(() => {
        if ((isUpdate || isView) && !!moduleId && openModal) {
            form.setFieldsValue({
                title: moduleData?.title,
            });
        }
    }, [isUpdate, isView, moduleId, moduleData, form, openModal])


    return (
        <Modal
            open={openModal}
            onCancel={handleCancel}
            centered
            footer={false}
            destroyOnClose
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}

        >
            <h1 className="text-3xl font-bold text-center text-black">
                {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">Module</span>
            </h1>
            {(isLoadingModuleDetail && (isView || isUpdate)) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <div className='bg-white rounded-lg p-6 my-5'>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete='off'
                    onFinish={isView ? handleCancel : isUpdate ? UpdateModule : AddModule}
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
                            readOnly={isView}
                            placeholder="Module Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending || isUpdating} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            {isView ? "OK" : isUpdate ? "Update Module" : "Add Module"}
                        </AppButton>
                    </Form.Item>
                </Form>
            </div>
            }
        </Modal>
    )
}

export default AddModuleModal