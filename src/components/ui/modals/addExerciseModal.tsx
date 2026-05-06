"use client"

import React from "react"
import { Form, Input, Modal } from "antd"
import { RxCross2 } from "react-icons/rx";
import AppButton from "../buttons/AppButton";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";

interface ExerciseResult {
    _id: string;
    title: string;
    description: string;
    exercise_details_id?: string;
    status: number | boolean;
    createdAt: string;
    updatedAt: string;
    content?: string;
    exercise_type?: string;
    language_id?: string;
    category_id?: string;
    exercise_order?: number;
    hint?: string;
    __v?: number;
}

interface AddExerciseModalProps {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    lessonId: string;
    isView?: boolean;
    isUpdate?: boolean;
    exerciseId?: string;
    onClose?: () => void;
    selectedLanguage?: string;
}

const AddExerciseModal = ({ openModal, setOpenModal, lessonId, isView, isUpdate, exerciseId, onClose, selectedLanguage }: AddExerciseModalProps) => {

    const [form] = Form.useForm();
    const handleCancel = () => {
        form.resetFields();
        setOpenModal(false);
        if (onClose) onClose();
    }

    const { mutateAsync: addExercise, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.EXERCISE_CREATE],
        invalidateQueryKeys: [MUTATION_KEYS.EXERCISE_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            handleCancel();
        }
    });

    const CreateExercise = async (values: any) => {
        await tryCatchWrapper(
            async () => {
                await addExercise({
                    url: ENDPOINTS.PRIVATE.EXERCISE_CREATE,
                    method: "POST",
                    body: {
                        exercise_details_id: lessonId,
                        ...values
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

    const { mutateAsync: updateExercise, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.EXERCISE_UPDATE],
        invalidateQueryKeys: [[MUTATION_KEYS.EXERCISE_LIST], [MUTATION_KEYS.EXERCISE_DETAIL, exerciseId, selectedLanguage || "en"]],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            handleCancel();
        }
    });

    const UpdateExercise = async (values: any) => {
        await tryCatchWrapper(
            async () => {
                await updateExercise({
                    url: ENDPOINTS.PRIVATE.EXERCISE_UPDATE,
                    method: "POST",
                    body: {
                        exercise_id: exerciseId,
                        lang: selectedLanguage||"en",
                        ...values
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

    const { data: exerciseDetail, isLoading: isLoadingExerciseDetail } = useAppQuery<ExerciseResult>({
        queryKey: [MUTATION_KEYS.EXERCISE_DETAIL, exerciseId,selectedLanguage||"en"],
        url: ENDPOINTS.PRIVATE.EXERCISE_DETAIL,
        params: {
            exercise_id: exerciseId,
            lang: selectedLanguage||"en"
        },
        options: {
            staleTime: Infinity,
            enabled: Boolean(openModal && (isUpdate || isView) && exerciseId),
        },
    })
    const exerciseDetailData = exerciseDetail?.data
    React.useEffect(() => {
        if (exerciseDetailData && (isUpdate || isView) && openModal) {
            form.setFieldsValue({
                title: exerciseDetailData?.title || 'N/A',
                description: exerciseDetailData?.description || 'N/A',
            });
        }
    }, [exerciseDetailData, isUpdate, isView, form, openModal]);


    return (
        <Modal
            open={openModal}
            onCancel={handleCancel}
            centered
            footer={false}
            destroyOnHidden={true}
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
        >
            <h1 className="text-3xl font-bold text-center text-black">
                {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">Exercise</span>
            </h1>
            {isLoadingExerciseDetail && (isUpdate || isView) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <div className='bg-white  rounded-lg p-6 my-5'>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete='off'
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                    onFinish={isView ? handleCancel : isUpdate ? UpdateExercise : CreateExercise}
                >
                    <Form.Item
                        name="title"
                        label={<span className='text-black font-semibold text-md'>Exercise Title :</span>}
                    >
                        <Input
                            readOnly={isView}
                            placeholder="Exercise Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={<span className='text-black font-semibold text-md'>Exercise Description :</span>}
                        rules={[
                            { required: true, message: 'Please enter exercise description' },
                        ]}
                    >
                        <Input.TextArea
                            readOnly={isView}
                            placeholder="Exercise Description"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending || isUpdating} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            {isView ? "Ok" : isUpdate ? "Update Exercise" : "Add Exercise"}
                        </AppButton>
                    </Form.Item>
                </Form>
            </div>}

        </Modal>
    )
}

export default AddExerciseModal