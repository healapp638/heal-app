"use client"

import React from "react"
import { Form, Input } from "antd"
import { AppButton } from "@/components/ui"
import AuthCard from "@/components/commonCard/AuthCard"
import { EmailFormItem } from "@/components/ui/forms/AppForm"


export default function Delete() {

    const [form] = Form.useForm();

    // Login mutate
    // const { mutateAsync: DeleteAccount, isPending } = useAppMutate({
    //     mutationKey: [MUTATION_KEYS.DELETE_ACCOUNT],
    //     onSuccess(data: any) {
    //         form.resetFields()
    //     },
    //     onError() {
    //         form.resetFields()
    //     },
    // });

    // // handle login
    // const handleDelete = async (values: { email: string; password: string }) => {
    //     const user = {
    //         password: trimString(values.password),
    //         email: formatEmail(values.email),
    //     }
    //     DeleteAccount({
    //         url: ENDPOINTS.COMMON.DELETE_ACCOUNT,
    //         method: 'PUT',
    //         body: user,
    //         skipLoader: true,
    //     })
    // }

    return (
        <AuthCard>
            <div className='my-6'>
                <p className='text-center text-black text-2xl font-semibold'>Delete Account</p>
                <p className='text-center text-black text-para mt-2'>Enter your email and password to delete account.</p>
            </div>
            <Form
                form={form}
                layout='vertical'
                autoComplete='off'
                className='w-[95%] mx-auto!'
            >
                <EmailFormItem name="email" />
                <AppButton htmlType="submit"  className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                    Send OTP
                </AppButton>
            </Form>
             <Form
                form={form}
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
                    
                >
                    <Input
                        placeholder="000000"
                        maxLength={6}
                        className="tracking-widest text-black! bg-white! border-none! text-center"
                        autoComplete="one-time-code"
                    />
                </Form.Item>

                <AppButton htmlType="submit"  className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                    Delete Account
                </AppButton>
            </Form>
        </AuthCard>
    )
}