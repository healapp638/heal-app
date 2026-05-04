"use client"

import React from "react"
import { Form, Input, Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import AppButton from "../buttons/AppButton";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { ENDPOINTS } from "@/Endpoints";
import { useAppQuery } from "@/tanstack/useAppQuery";


interface AddPhaseProps {
    openAddPhaseModal: boolean;
    setOpenAddPhaseModal: (open: boolean) => void;
    subModuleId: string;
    onClose?: () => void;
    isUpdate?: boolean;
    isView?: boolean;
    selectedLanguage?:string;
    phaseID?: string;
}

interface PhaseDetail {
    _id: string;
    title: string;
    points: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const AddPhaseModal = ({ openAddPhaseModal, setOpenAddPhaseModal, subModuleId, onClose, isUpdate, isView, phaseID ,selectedLanguage}: AddPhaseProps) => {


    const [form] = Form.useForm();
    const handleCancel = () => {
        form.resetFields();
        setOpenAddPhaseModal(false);
        if (onClose) onClose();
    }

    const { data: PhaseDetail, isPending: isLoadingPhaseDetail } = useAppQuery<PhaseDetail>({
        queryKey: [MUTATION_KEYS.PHASE_DETAIL, phaseID, selectedLanguage || "en"],
        url: `${ENDPOINTS.PRIVATE.PHASE_DETAIL}`,
        params: {
            phaseId: phaseID,
            lang: selectedLanguage||"en"
        },
        options: {
            staleTime: Infinity,
            enabled: openAddPhaseModal && !!phaseID,
        },
    })
    const PhaseData = PhaseDetail?.data

    React.useEffect(() => {
        if (PhaseData && (isUpdate || isView) && openAddPhaseModal) {
            form.setFieldsValue({
                title: PhaseData?.title,
                points: PhaseData?.points,
            });
        }
    }, [PhaseData, isUpdate, isView, form, openAddPhaseModal]);

    const { mutateAsync: addPhases, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_PHASE],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_PHASE],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            handleCancel();
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
                    handleCancel();
                }
            }
        );
    }

    const { mutateAsync: UpdatePhases, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.PHASE_UPDATE],
        invalidateQueryKeys: [[MUTATION_KEYS.LIST_PHASE], [MUTATION_KEYS.PHASE_DETAIL, phaseID, selectedLanguage || "en"]],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const UpdatePhase = async (values: any) => {

        await tryCatchWrapper(
            async () => {
                await UpdatePhases({
                    url: ENDPOINTS.PRIVATE.PHASE_UPDATE,
                    method: "POST",
                    body: {
                        phaseId: phaseID,
                        title: values.title,
                        points: values.points,
                        lang: selectedLanguage||"en"
                    },
                });
            },
            {
                errorMessage: 'Failed to update phase',
                showToast: true,
                onError() {
                    console.error('Failed to update phase');
                    handleCancel();
                }
            }
        );
    }


    return (
        <Modal
            open={openAddPhaseModal}
            onCancel={handleCancel}
            footer={false}
            centered
            destroyOnHidden={true}
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
        >
            <h1 className="text-3xl font-bold text-center text-black">
                {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">Phase</span>
            </h1>

            {(isLoadingPhaseDetail && (isUpdate || isView)) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <div className='bg-white border-maincolor border-[1.5px] rounded-lg p-6 my-5'>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete='off'
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                    onFinish={isView ? handleCancel : isUpdate ? UpdatePhase : CreatePhases}
                >

                    <Form.Item
                        name="title"
                        label={<span className='text-black font-semibold text-md'>Phase Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter phase title' },
                        ]}
                    >
                        <Input
                            readOnly={isView}
                            placeholder="Phase Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>
                    {/* <Form.Item
                        name="points"
                        label={<span className='text-black font-semibold text-md'>Phase Points :</span>}
                        rules={[
                            { required: true, message: 'Please enter phase points' },
                        ]}
                    >
                        <Input
                            readOnly={isView}
                            min="1"
                            type="number"
                            placeholder="Phase Points"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item> */}
                    <Form.Item
                        name="points"
                        label={<span className='text-black font-semibold text-md'>Phase Points :</span>}
                        rules={[
                            { required: true, message: 'Please enter phase points' },
                            {
                                pattern: /^[0-9]+$/,
                                message: 'Only numbers are allowed',
                            },
                        ]}
                    >
                        <Input
                            readOnly={isView}
                            placeholder="Phase Points"
                            inputMode="numeric"
                            maxLength={5}
                            min={1}
                            onKeyDown={(e) => {
                                // Block invalid keys
                                if (
                                    ["e", "E", "+", "-", "."].includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                // Allow only digits
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                form.setFieldsValue({ points: value });
                            }}
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending || isUpdating} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            {isView ? "Ok" : isUpdate ? "Update Phase" : "Add Phase"}
                        </AppButton>
                    </Form.Item>
                </Form>
            </div>}
        </Modal>
    )
}

export default AddPhaseModal