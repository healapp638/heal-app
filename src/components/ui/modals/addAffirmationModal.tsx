"use client"

import { Form, Input, Modal } from "antd";
import React from "react"
import { RxCross2 } from "react-icons/rx";
import AppButton from "../buttons/AppButton";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { useAppQuery } from "@/tanstack/useAppQuery";

interface AddAffirmationModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    isView?: boolean;
    isUpdate?: boolean;
    AffiliationID?: string;
    selectedLanguage?: string
}

const AddAffirmationModal = ({ openModal, setOpenModal, isView, isUpdate, AffiliationID, selectedLanguage }: AddAffirmationModalProps) => {

    const [form] = Form.useForm();

    const handleCancel = () => {
        setOpenModal(false);
        form.resetFields();
    };

    const { mutateAsync: addAffirmation, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.ADD_AFFILIATION],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_AFFILIATION],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            handleCancel();
        }
    });
    const { mutateAsync: updateAffirmation, isPending: isUpdatePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.EDIT_AFFILIATION],
        invalidateQueryKeys: [[MUTATION_KEYS.LIST_AFFILIATION, selectedLanguage],[MUTATION_KEYS.DETAIL_AFFILIATION]],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            handleCancel();
        }
    });

    const CreateAffirmation = async (values: { affirmation: string }) => {
        await tryCatchWrapper(
            async () => {
                await addAffirmation({
                    url: ENDPOINTS.PRIVATE.ADD_AFFILIATION,
                    method: "POST",
                    body: {
                        ...values
                    },
                });
            },
            {
                errorMessage: 'Failed to add affirmation',
                showToast: true,
                onError() {
                    console.error('Failed to add affirmation');
                    handleCancel();
                }
            }
        );
    }
    const UpdateAffirmation = async (values: { affirmation: string }) => {
        await tryCatchWrapper(
            async () => {
                await updateAffirmation({
                    url: ENDPOINTS.PRIVATE.EDIT_AFFILIATION,
                    method: "PUT",
                    body: {
                        language: selectedLanguage,
                        affirmation_id: AffiliationID,
                        ...values
                    },
                });
            },
            {
                errorMessage: 'Failed to update affirmation',
                showToast: true,
                onError() {
                    console.error('Failed to update affirmation');
                    handleCancel();
                }
            }
        );
    }

    const { data: affirmationDetail, isLoading: isLoadingAffirmationDetail } = useAppQuery<any>({
        queryKey: [MUTATION_KEYS.DETAIL_AFFILIATION, AffiliationID, selectedLanguage || "en"],
        url: ENDPOINTS.PRIVATE.DETAIL_AFFILIATION,
        params: {
            affirmation_id: AffiliationID,
            language: selectedLanguage || "en"
        },
        options: {
            staleTime: Infinity,
            enabled: Boolean(openModal && (isUpdate || isView) && AffiliationID),
        },
    })
    const affirmationDetailData = affirmationDetail?.data
    React.useEffect(() => {
        if (affirmationDetailData && (isUpdate || isView) && openModal) {
            form.setFieldsValue({
                affirmation: affirmationDetailData?.affirmation
            });
        }
    }, [affirmationDetailData, isUpdate, isView, form, openModal]);

    return (
        <Modal
            centered
            footer={false}
            open={openModal}
            destroyOnHidden={true}
            onCancel={handleCancel}
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
        >
            <h1 className="text-3xl font-bold text-center text-black">
                {isView ? "View" : isUpdate ? "Update" : "Add"} <span className="text-maincolor">Affirmation</span>
            </h1>
            <div className='bg-white  rounded-lg p-6 my-5'>
                {isLoadingAffirmationDetail && (isUpdate || isView) ? <p className="text-maincolor! p-6 text-center">Loading...</p> : <Form
                    form={form}
                    layout="vertical"
                    autoComplete='off'
                    className='w-[95%] mx-auto!'
                    requiredMark={false}
                    onFinish={isView ? handleCancel : isUpdate ? UpdateAffirmation : CreateAffirmation}

                >
                    <Form.Item
                        name="affirmation"
                        label={<span className='text-black font-semibold text-md'>Affirmation :</span>}
                        rules={[
                            { required: true, message: 'Please enter affirmation' },
                        ]}
                    >
                        <Input.TextArea
                            readOnly={isView}
                            placeholder="affirmation"
                            className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item>
                        <AppButton isLoading={isPending || isUpdatePending} htmlType="submit" className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                            {isView ? "Ok" : isUpdate ? "Update Affirmation" : "Add Affirmation"}
                        </AppButton>
                    </Form.Item>
                </Form>}
            </div>
        </Modal>
    )
}

export default AddAffirmationModal;