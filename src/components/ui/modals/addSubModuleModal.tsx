"use client"

import React from "react"
import { Form, Input, Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import AppButton from "../buttons/AppButton";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";

interface AddSubModuleModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    moduleId: string;
    onClose?: () => void;
    subModuleId?: string;
    isUpdate?: boolean;
    isView?: boolean;
}

interface SubModuleDetail {
    _id: string;
    moduleId: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const AddSubModuleModal = ({ openModal, setOpenModal, moduleId, onClose, subModuleId, isUpdate, isView }: AddSubModuleModalProps) => {
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        setOpenModal(false);
        if (onClose) onClose();
    }

    const { data: SubModuleDetail, isPending: isLoadingSubModuleDetail } = useAppQuery<SubModuleDetail>({
        queryKey: [MUTATION_KEYS.SUBMODULE_DETAIL, subModuleId],
        url: `${ENDPOINTS.PRIVATE.SUBMODULE_DETAIL}`,
        params: {
            subModuleId: subModuleId,
            lang: "en"
        },
        options: {
            staleTime: Infinity,
            enabled: openModal && !!subModuleId,
        },
    })
    const SubModuleData = SubModuleDetail?.data

    React.useEffect(() => {
        if (SubModuleData && (isUpdate || isView)) {
            form.setFieldsValue({
                title: SubModuleData?.title,
                description: SubModuleData?.description,
            });
        }
    }, [SubModuleData, isUpdate, isView, form]);

    const { mutateAsync: updateSubModule, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.SUBMODULE_UPDATE],
        invalidateQueryKeys: [[MUTATION_KEYS.LIST_SUB_MODULE], [MUTATION_KEYS.SUBMODULE_DETAIL]],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const UpdateSubModule = async (values: any) => {

        await tryCatchWrapper(
            async () => {
                await updateSubModule({
                    url: ENDPOINTS.PRIVATE.SUBMODULE_UPDATE,
                    method: "POST",
                    body: {
                        subModuleId: subModuleId,
                        title: values.title,
                        description: values.description,
                        lang: "en"
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


    const { mutateAsync: addsubModule, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_SUB_MODULE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_SUB_MODULE],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const CreateSubModule = async (values: any) => {
        await tryCatchWrapper(
            async () => {
                await addsubModule({
                    url: ENDPOINTS.PRIVATE.CREATE_SUB_MODULE,
                    method: "POST",
                    body: {
                        title: values.title,
                        description: values.description,
                        moduleId: moduleId
                    },
                });
            },
            {
                errorMessage: 'Failed to add sub module',
                showToast: true,
                onError() {
                    console.error('Failed to add theme');
                    handleCancel();
                }
            }
        );
    }

    return (
        <Modal
            open={openModal}
            onCancel={handleCancel}
            footer={false}
            centered
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
        >
            <h1 className="text-3xl font-bold text-center text-black">
                {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">SubModule</span>
            </h1>

            {(isLoadingSubModuleDetail && (isUpdate || isView)) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <div className='bg-white border-maincolor border-[1.5px] rounded-lg p-6 my-5'>
                <Form
                    form={form}
                    onFinish={isView ? handleCancel : isUpdate ? UpdateSubModule : CreateSubModule}
                    layout="vertical"
                    autoComplete='off'
                    requiredMark={false}
                    className='w-[95%] mx-auto!'
                >

                    <Form.Item
                        name="title"
                        label={<span className='text-black font-semibold text-md'>SubModule Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter sub module title' },
                        ]}
                    >
                        <Input
                            readOnly={isView}
                            placeholder="SubModule Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={<span className='text-black font-semibold text-md'>SubModule Description :</span>}
                        rules={[
                            { required: true, message: 'Please enter sub module description' },
                        ]}
                    >
                        <Input.TextArea
                            readOnly={isView}
                            placeholder="SubModule Description"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending || isUpdating} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            {isView ? "OK" : isUpdate ? "Update SubModule" : "Add SubModule"}
                        </AppButton>
                    </Form.Item>
                </Form>
            </div>}
        </Modal>
    )
}
export default AddSubModuleModal;