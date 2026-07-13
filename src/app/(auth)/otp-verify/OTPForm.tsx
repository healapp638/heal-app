"use client"

import React from 'react'
import { Form, Input } from 'antd'
import logger from '@/utils/logger'
import { ROUTES } from '@/routerKeys'
import { ENDPOINTS } from '@/Endpoints'
import { useRouter } from 'next/navigation'
import { AppButton } from '@/components/ui'
import { MUTATION_KEYS } from '@/tanstack/keys'
import AuthCard from '@/components/commonCard/AuthCard'
import { useAppMutate } from '@/tanstack/useAppMutate'
import { formatEmail, trimString } from '@/utils/helper'
import { tryCatchWrapper } from '@/utils/tryCatchWrapper'
import { useResetFlow } from '@/hooks/auth/useResetFlow'

const OTPForm = () => {

    const router = useRouter()
    const [form] = Form.useForm()
    const { resetEmail, getResetEmail, setResetOTP } = useResetFlow()

    React.useEffect(() => {
        if (!resetEmail) {
            router.push(ROUTES.AUTH.FORGOT_PASSWORD);
        }
    }, [resetEmail, router]);


    // verify otp mutate
    const { mutateAsync: verifyOTPMutate, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.VERIFY_OTP],
        onSuccess(data: any) {
            if (data) {
                const otp = form.getFieldValue('otp');
                if (otp) {
                    setResetOTP(otp);
                }
                router.push(ROUTES.AUTH.RESET_PASSWORD)
            }
        },
        onError() {
            router.push(ROUTES.AUTH.VERIFY_OTP)
        },
    })

    // handle verify otp
    const handleVerifyOTP = async (values: { otp: string }) => {
        const email = getResetEmail();
        if (!email) {
            logger.error('No reset email found in state');
            router.push(ROUTES.AUTH.FORGOT_PASSWORD);
            return;
        }
        await tryCatchWrapper(
            () =>
                verifyOTPMutate({
                    url: ENDPOINTS.AUTH.VERIFY_OTP,
                    method: 'POST',
                    body: { email: formatEmail(email), otp: trimString(values.otp) },
                }),
            {
                errorMessage: 'Invalid OTP',
                showToast: true,
                onError() {
                    logger.error('OTP verification failed');
                },
            }
        )
    }
    

    // Auto detect OTP
    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!('OTPCredential' in window)) return;

        const abortController = new AbortController();

        const detectOTP = async () => {
            try {
                const otp: any = await navigator.credentials.get({
                    otp: { transport: ['sms'] },
                    signal: abortController.signal,
                });
                logger.info('OTP auto-detected', otp);
                if (otp && 'code' in otp) {
                    form.setFieldsValue({ otp: otp.code });
                }
            } catch (err: any) {
                if (err?.name !== 'AbortError') {
                    logger.warn('OTP auto-detection failed', err);
                }
            }
        };

        detectOTP();
        return () => abortController.abort();
    }, [form]);

    // resend otp mutate
    const { mutateAsync: resendOTPMutate } = useAppMutate({
        mutationKey: [MUTATION_KEYS.SEND_OTP],
        onSuccess() {
            logger.success('OTP sent successfully');
        },
        onError(error: any) {
            logger.error('Failed to send OTP', error);
        },
    })

    // handle resend otp
    const handleResendOTP = async () => {
        const email = getResetEmail();
        if (!email) {
            logger.error('No reset email found in state');
            router.push(ROUTES.AUTH.FORGOT_PASSWORD);
            return;
        }
        await tryCatchWrapper(
            () =>
                resendOTPMutate({
                    url: ENDPOINTS.AUTH.SEND_OTP,
                    method: 'POST',
                    body: { email: formatEmail(email) },
                }),
            {
                errorMessage: 'Failed to send OTP',
                showToast: true,
                onError() {
                    logger.error('Failed to send OTP');
                },
            }
        )
    }

    return (
        <AuthCard>
            <div className="my-6">
                <p className='text-center text-black text-2xl font-semibold'>Verify OTP</p>
                <p className='text-center text-black text-para mt-2'>Enter the 6-digit code sent to your email.</p>
            </div>
            <Form
                layout="vertical"
                onFinish={handleVerifyOTP}
                form={form}
                className='w-full otp-page'
            >
                <Form.Item
                    label={<span className='text-black'>OTP Code</span>}
                    name="otp"
                    rules={[
                        { required: true, message: 'Please enter OTP' },
                        { len: 6, message: 'OTP must be 6 digits' },
                    ]}
                    extra={[
                        <div key="resend-otp" className='flex justify-between items-center'>
                            <p className='italic text-black text-sm'>
                                Didn&apos;t receive the code?
                            </p>
                            <p onClick={handleResendOTP} className='text-maincolor cursor-pointer pr-1 italic' >Resend</p>
                        </div>
                    ]}
                >
                    <Input
                        placeholder="000000"
                        maxLength={6}
                        className="tracking-widest text-black! bg-white! border-none! text-center"
                        autoComplete="one-time-code"
                    />
                </Form.Item>

                <AppButton type="primary" htmlType="submit" isLoading={isPending} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                    Verify OTP
                </AppButton>
            </Form>
        </AuthCard>
    )
}
export default OTPForm