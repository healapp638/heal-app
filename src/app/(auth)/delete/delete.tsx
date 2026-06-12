"use client"

import React from "react"
import { Form, Input } from "antd"
import { AppButton } from "@/components/ui"
import AuthCard from "@/components/commonCard/AuthCard"
import { EmailFormItem } from "@/components/ui/forms/AppForm"
import { ENDPOINTS } from "@/Endpoints"
import { MUTATION_KEYS } from "@/tanstack/keys"
import { useAppMutate } from "@/tanstack/useAppMutate"
import { trimString } from "@/utils/helper"


export default function Delete() {

    const [emailForm] = Form.useForm();
    const [deleteForm] = Form.useForm();
    const [selectedEmail,setSelectedEmail] = React.useState("")
    const [timer, setTimer] = React.useState(0);

    React.useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

      const { mutateAsync: SendOTP } = useAppMutate({
        mutationKey: [MUTATION_KEYS.DELETE_ACCOUNT_OTP],
        onSuccess() {
            setTimer(60);
            setSelectedEmail("")
            emailForm.resetFields()
            deleteForm.resetFields()
        },
        onError() {
            emailForm.resetFields()
            deleteForm.resetFields()
        },
    });

    // // handle login
    const handleEmailOTP = async (values: {email: string }) => {
        setSelectedEmail(values.email)
        const user = {
            email: trimString(values.email),
        }
        SendOTP({
            url: ENDPOINTS.COMMON.DELETE_ACCOUNT_OTP,
            method: 'POST',
            body: user,
            skipLoader: true,
        })
    }

    // Login mutate
    const { mutateAsync: DeleteAccount, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.DELETE_ACCOUNT],
        onSuccess() {
            deleteForm.resetFields()
            setTimer(0);
        },
        onError() {
            deleteForm.resetFields()
        },
    });

    // // handle login
    const handleDelete = async (values: {otp: string }) => {
        const user = {
            email: selectedEmail,
            otp: trimString(values.otp),
        }
        DeleteAccount({
            url: ENDPOINTS.COMMON.DELETE_ACCOUNT,
            method: 'PUT',
            body: user,
            skipLoader: true,
        })
    }

    return (
        <AuthCard>
            <div className='my-6'>
                <p className='text-center text-black text-2xl font-semibold'>Delete Account</p>
                <p className='text-center text-black text-para mt-2'>Enter your email and password to delete account.</p>
            </div>
            <Form
                form={emailForm}
                layout='vertical'
                onFinish={handleEmailOTP}
                autoComplete='off'
                className='w-[95%] mx-auto!'
                disabled={timer > 0}
            >
                <EmailFormItem  name="email" disabled={timer > 0} />
                <AppButton 
                    htmlType="submit"  
                    disabled={timer > 0}
                    className={`bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none! ${timer > 0 && "bg-maincolor/10"}`}
                    block
                >
                    {timer > 0 ? `Send OTP (${timer}s)` : 'Send OTP'}
                </AppButton>
            </Form>
             <Form
                form={deleteForm}
                onFinish={handleDelete}
                layout='vertical'
                autoComplete='off'
                className='w-[95%] mx-auto!'
            >
               <Form.Item
                    label={<span className='text-black'>OTP Code</span>}
                    name="otp"
                    rules={[
                        { required: true, message: 'Please enter OTP' },
                        { len: 6, message: 'OTP must be 6 digits' },
                    ]}
                    extra={
                        timer > 0 ? (
                            <div className="text-center mt-2">
                                <span className="text-red-500 font-semibold text-sm">
                                    OTP is valid for: {timer} seconds
                                </span>
                            </div>
                        ) : null
                    }
                >
                    <Input
                        placeholder="000000"
                        maxLength={6}
                        className="tracking-widest text-black! bg-white! border-none! text-center"
                        autoComplete="one-time-code"
                        disabled={timer === 0}
                    />
                </Form.Item>

                <AppButton 
                    htmlType="submit" 
                    isLoading={isPending} 
                    disabled={timer === 0}
                    className={`bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none! ${timer > 0 && "bg-maincolor/10"}`}
                    block
                >
                    Delete Account
                </AppButton>
            </Form>
        </AuthCard>
    )
}