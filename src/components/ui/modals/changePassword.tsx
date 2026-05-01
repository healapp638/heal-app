"use client"

import React from "react"
import { useAppMutate } from "@/tanstack/useAppMutate"
import { ENDPOINTS } from "@/Endpoints"
import { MUTATION_KEYS } from "@/tanstack/keys"
import { tryCatchWrapper } from "@/utils/tryCatchWrapper"
import { Form, Modal } from "antd"
import { RxCross2 } from "react-icons/rx"
import AppButton from "../buttons/AppButton"
import { PasswordFormItem } from "../forms/AppForm"


const ChangePasswordModal = ({ openModal, setOpenModal }: any) => {

    const [form] = Form.useForm();

    const handleCancel = () => {
        setOpenModal(false);
        form.resetFields();
    };

    const { mutateAsync: changePassword, isPending: isChangingPassword } = useAppMutate({
        mutationKey: [MUTATION_KEYS.ADMIN_CHANGE_PASSWORD],
        invalidateQueryKeys: [MUTATION_KEYS.ADMIN_DETAIL],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            form.resetFields();
            handleCancel();
        },
    });

    const onFinish = async (values: any) => {
        await tryCatchWrapper(
            async () => {
                await changePassword({
                    url: ENDPOINTS.PRIVATE.CHANGE_PASSWORD,
                    method: "POST",
                    body: {
                        old_password: values.old_password,
                        new_password: values.new_password,
                    }
                });
            },
            {
                errorMessage: 'Failed to change password',
                showToast: true,
                onError() {
                    console.error('Failed to change password');
                    handleCancel()
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
                Change <span className="text-maincolor">Password</span>
            </h1>
            <Form
                form={form}
                layout="vertical"
                autoComplete='off'
                onFinish={onFinish}
                requiredMark={false}
                className='w-[95%] mx-auto!'
            >
                <PasswordFormItem
                    name="old_password"
                    required
                    label="Old Password"
                />
                <PasswordFormItem
                    name="new_password"
                    required
                    label="New Password"
                />
                <PasswordFormItem
                    name="confirm_password"
                    required
                    label="Confirm Password"
                    dependencies={['new_password']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Confirm password does not match with new password'));
                            },
                        }),
                    ]}
                />
                <Form.Item>
                    <AppButton isLoading={isChangingPassword} htmlType="submit" className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                        Change Password
                    </AppButton>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ChangePasswordModal