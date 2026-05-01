"use client"

import React from "react";
import { Form, Input, Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import AppButton from "../buttons/AppButton";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";

interface AddLessonsModalProps {
    openAddLessonsModal: boolean;
    setOpenAddLessonsModal: (open: boolean) => void;
    phaseId: string;
    onClose?: () => void;
    isUpdate?: boolean;
    isView?: boolean;
    lessonID?: string;
}

interface LessonDetail {
    reading_title: string;
    reading_description: string;
    concept_title: string;
    concept_description: string;
    reflection: string;
}

interface AddLessonsFormValues {
    reading_title: string;
    reading_description: string;
    concept_title: string;
    concept_description: string;
    reflection: string;
}

const AddLessonsModal = ({ openAddLessonsModal, setOpenAddLessonsModal, phaseId, onClose, isUpdate, isView, lessonID }: AddLessonsModalProps) => {


    const [form] = Form.useForm<AddLessonsFormValues>();
    const handleCancel = () => {
        form.resetFields();
        setOpenAddLessonsModal(false);
        if (onClose) onClose();
    }

    const { data: lessonDetail, isLoading: isLoadingLessonDetail } = useAppQuery<LessonDetail>({
        queryKey: [MUTATION_KEYS.LESSON_DETAIL, lessonID],
        url: `${ENDPOINTS.PRIVATE.LESSON_DETAIL}`,
        params: {
            exercise_details_id: lessonID,
            lang: "en"
        },
        options: {
            staleTime: Infinity,
            enabled: openAddLessonsModal && !!lessonID,
        },
    })
    const lessonDetailData = lessonDetail?.data
    React.useEffect(() => {
        if (lessonDetailData && (isUpdate || isView)) {
            form.setFieldsValue({
                reading_title: lessonDetailData?.reading_title,
                reading_description: lessonDetailData?.reading_description,
                concept_title: lessonDetailData?.concept_title,
                concept_description: lessonDetailData?.concept_description,
                reflection: lessonDetailData?.reflection,
            });
        }
    }, [lessonDetailData, isUpdate, isView, form]);


    const { mutateAsync: addLessons, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CREATE_LESSONS],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_LESSONS],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            form.resetFields();
            handleCancel();
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
                    handleCancel();
                }
            }
        );
    }

    const { mutateAsync: UpdateLesson, isPending: isUpdating } = useAppMutate({
        mutationKey: [MUTATION_KEYS.LESSON_UPDATE],
        invalidateQueryKeys: [[MUTATION_KEYS.LIST_LESSONS], [MUTATION_KEYS.LESSON_DETAIL]],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const UpdateLessons = async (values: any) => {

        await tryCatchWrapper(
            async () => {
                await UpdateLesson({
                    url: ENDPOINTS.PRIVATE.LESSON_UPDATE,
                    method: "POST",
                    body: {
                        lang: "en",
                        exercise_details_id: lessonID,
                        ...values,
                    },
                });
            },
            {
                errorMessage: 'Failed to update Lesson',
                showToast: true,
                onError() {
                    console.error('Failed to update Lesson');
                    handleCancel();
                }
            }
        );
    }


    return (
        <Modal
            open={openAddLessonsModal}
            onCancel={handleCancel}
            centered
            footer={false}
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
        >
            <h1 className="text-3xl font-bold text-center text-black">
                {isUpdate ? "Update" : isView ? "View" : "Add"} <span className="text-maincolor">Lessons</span>
            </h1>

            {isLoadingLessonDetail && (isUpdate || isView) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <div className='bg-white border-maincolor border-[1.5px] rounded-lg p-6 my-5'>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete='off'
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                    onFinish={isView ? handleCancel : isUpdate ? UpdateLessons : CreateLessons}
                >
                    <Form.Item
                        name="reading_title"
                        label={<span className='text-black font-semibold text-md'>Reading Title :</span>}
                        rules={[
                            { required: true, message: 'Please enter reading title' },
                        ]}
                    >
                        <Input
                            readOnly={isView}
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
                            readOnly={isView}
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
                            readOnly={isView}
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
                            readOnly={isView}
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
                            readOnly={isView}
                            placeholder="Reflection"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item>
                        <AppButton htmlType="submit" isLoading={isPending || isUpdating} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            {isView ? "Ok" : isUpdate ? "Update Lessons" : "Add Lessons"}
                        </AppButton>
                    </Form.Item>
                </Form>
            </div>}
        </Modal>
    );
};

export default AddLessonsModal;