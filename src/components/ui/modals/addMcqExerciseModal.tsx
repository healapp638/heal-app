"use client"

import React from "react";
import { Form, Input, Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import { FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import AppButton from "../buttons/AppButton";
import logger from "@/utils/logger";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";

interface AddMcqExerciseModalProps {
    openAddMcqExerciseModal: boolean;
    setOpenAddMcqExerciseModal: (open: boolean) => void;
    phaseId: string;
    onClose?: () => void;
    isUpdate?: boolean;
    isView?: boolean;
    McqExerciseId?: string;
    selectedLanguage?: string;
    McqCount?: number;
}

interface McqExerciseDetail {
    title: string;
    description: string;
    mcq: string[];
}

interface AddMcqExerciseFormValues {
    title: string;
    description: string;
    mcq: string[];
}

const AddMcqExerciseModal = ({ openAddMcqExerciseModal, setOpenAddMcqExerciseModal, phaseId, onClose, isUpdate, isView, McqExerciseId, selectedLanguage, McqCount = 0 }: AddMcqExerciseModalProps) => {


    const [form] = Form.useForm<AddMcqExerciseFormValues>();
    const handleCancel = () => {
        form.resetFields();
        setOpenAddMcqExerciseModal(false);
        if (onClose) onClose();
    }


    const { data: mcqExerciseDetail, isLoading: isLoadingMcqExerciseDetail } = useAppQuery<McqExerciseDetail>({
        queryKey: [MUTATION_KEYS.MCQ_EXERCISE_DETAIL, McqExerciseId, selectedLanguage || "en"],
        url: `${ENDPOINTS.PRIVATE.MCQ_EXERCISE_DETAIL}`,
        params: {
            mcqexercise_id: McqExerciseId,
            lang: selectedLanguage || "en"
        },
        options: {
            staleTime: Infinity,
            enabled: openAddMcqExerciseModal && !!McqExerciseId,
        },
    })
    const mcqExerciseDetailData = mcqExerciseDetail?.data
    React.useEffect(() => {
        if (mcqExerciseDetailData && (isUpdate || isView) && openAddMcqExerciseModal) {
            const mappedMcq = mcqExerciseDetailData?.mcq?.map((item: any) => 
                typeof item === 'object' && item !== null ? item.option : item
            );
            form.setFieldsValue({
                title: mcqExerciseDetailData?.title || '',
                description: mcqExerciseDetailData?.description || '',
                mcq: mappedMcq && mappedMcq.length > 0 ? mappedMcq : [''],
            });
        }
    }, [mcqExerciseDetailData, isUpdate, isView, form, openAddMcqExerciseModal]);


    const { mutateAsync: AddMcqExercise, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.MCQ_EXERCISE_CREATE],
        invalidateQueryKeys: [MUTATION_KEYS.MCQ_EXERCISE_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            form.resetFields();
            handleCancel();
        }
    });
    const CreateMcqExercise = async (values: any) => {
        await tryCatchWrapper(
            async () => {
                await AddMcqExercise({
                    url: ENDPOINTS.PRIVATE.MCQ_EXERCISE_CREATE,
                    method: "POST",
                    body: {
                        phase_id: phaseId,
                        ...values,
                    },
                });
            },
            {
                errorMessage: 'Failed to add MCQ exercise',
                showToast: true,
                onError(error) {
                    logger.error('Failed to add MCQ exercise', error);
                    handleCancel();
                }
            }
        );
    }

    const { mutateAsync: UpdateMcq, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.MCQ_EXERCISE_UPDATE],
        invalidateQueryKeys: [[MUTATION_KEYS.MCQ_EXERCISE_LIST], [MUTATION_KEYS.MCQ_EXERCISE_DETAIL, McqExerciseId, selectedLanguage || "en"]],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const UpdateMcqExercise = async (values: any) => {

        await tryCatchWrapper(
            async () => {
                await UpdateMcq({
                    url: ENDPOINTS.PRIVATE.MCQ_EXERCISE_UPDATE,
                    method: "POST",
                    body: {
                        lang: selectedLanguage || "en",
                        mcqexercise_id: McqExerciseId,
                        ...values,
                    },
                });
            },
            {
                errorMessage: 'Failed to update MCQ exercise',
                showToast: true,
                onError(error) {
                    logger.error('Failed to update MCQ exercise', error);
                    handleCancel();
                }
            }
        );
    }

    return (
        <Modal
            open={openAddMcqExerciseModal}
            onCancel={handleCancel}
            centered
            footer={false}
            destroyOnHidden={true}
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
        >
            <h1 className="text-3xl font-bold text-center text-black">
                {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">Exercise</span>
            </h1>

            {isLoadingMcqExerciseDetail && (isUpdate || isView) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <div className='bg-white  rounded-lg p-6 my-5'>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete='off'
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                    onFinish={isView ? handleCancel : isUpdate ? UpdateMcqExercise : CreateMcqExercise}
                >
                    <Form.Item
                        name="title"
                        label={<span className='text-black font-semibold text-md'>Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter title' },
                        ]}
                        getValueFromEvent={(e) => {
                            const val = e.target.value;
                            return val ? val.charAt(0).toUpperCase() + val.slice(1) : val;
                        }}
                    >
                        <Input
                            readOnly={isView}
                            placeholder="Title"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                        />
                    </Form.Item>
                    {(McqCount === 0 || ((isView || isUpdate) && !!mcqExerciseDetailData?.description)) && <Form.Item
                        name="description"
                        label={<span className='text-black font-semibold text-md'>Description :</span>}
                    >
                        <Input.TextArea
                            readOnly={isView}
                            placeholder="Description"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>}
                    {!(McqCount === 0 || ((isView || isUpdate) && !!mcqExerciseDetailData?.description)) && <div className="mb-4">
                        <span className="text-black font-semibold text-md block mb-2">MCQ:</span>
                        <Form.List
                            name="mcq"
                            initialValue={['']}
                            rules={[
                                {
                                    validator: async (_, mcqs) => {
                                        if (!mcqs || mcqs.length < 1) {
                                            return Promise.reject(new Error('At least 1 MCQ is required'));
                                        }
                                        if (mcqs.length > 5) {
                                            return Promise.reject(new Error('Maximum 5 MCQs are allowed'));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Form.Item
                                            key={field.key}
                                            required={false}
                                            className="mb-2"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            whitespace: true,
                                                            message: "Please input MCQ or delete this field.",
                                                        },
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input
                                                        readOnly={isView}
                                                        placeholder={`MCQ ${index + 1}`}
                                                        className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2 flex-1"
                                                    />
                                                </Form.Item>
                                                {!isView && fields.length > 1 ? (
                                                    <div
                                                        className="bg-red-500 text-white flex justify-center items-center rounded-lg p-3 cursor-pointer"
                                                        onClick={() => remove(field.name)}
                                                    >
                                                        <FiTrash2 />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </Form.Item>
                                    ))}
                                    {!isView && fields.length < 5 && (
                                        <Form.Item className="mb-0 flex justify-center items-center">
                                            <AppButton
                                                onClick={() => add()}
                                                className="bg-maincolor! font-bold  text-white! hover:text-white! hover:opacity-100 rounded-lg border-transparent! border-none! outline-none! shadow-none! flex items-center justify-center gap-2"
                                            >
                                                <div className="flex justify-center items-center gap-1">
                                                    <FaPlus /> Add MCQ
                                                </div>
                                            </AppButton>
                                        </Form.Item>
                                    )}
                                    <Form.ErrorList errors={errors} />
                                </>
                            )}
                        </Form.List>
                    </div>}

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending || isUpdating} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            {isView ? "Ok" : isUpdate ? "Update Exercise" : "Add Exercise"}
                        </AppButton>
                    </Form.Item>
                </Form>
            </div>}
        </Modal>
    );
};

export default AddMcqExerciseModal;