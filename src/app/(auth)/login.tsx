'use client'

import React from 'react'
import { Form } from 'antd'
import Link from 'next/link'
import { ROUTES } from '@/routerKeys'
import { ENDPOINTS } from '@/Endpoints'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppButton } from '@/components/ui'
import { useAppCache } from '@/tanstack/useAppCache'
import { setAuthAction } from '@/actions/authActions'
import { useAppMutate } from '@/tanstack/useAppMutate'
import AuthCard from '@/components/commonCard/AuthCard'
import { MUTATION_KEYS, QUERY_KEYS } from '@/tanstack/keys'
import { formatEmail, trimString } from '@/utils/formatting/string'
import { storeRefresh, storeToken } from '@/redux/features/auth/authSlice'
import { EmailFormItem, PasswordFormItem } from '@/components/ui/forms/AppForm'

export default function Login() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { setCache } = useAppCache()
    const [loading, setLoading] = React.useState(false);

    // Login mutate
    const { mutateAsync: loginMutate } = useAppMutate({
        mutationKey: [MUTATION_KEYS.LOGIN],
        async onSuccess(data: any) {
            dispatch(storeToken(data?.access_token))
            dispatch(storeRefresh(data?.refresh_token))
            // Store user info in TanStack Query cache using reusable hook
            setCache([QUERY_KEYS.USER], data)
            await setAuthAction(data?.access_token) // Set auth cookie for middleware
            setLoading(false)
            router.push(ROUTES.PRIVATE.HOME)
        },
        onError() {
            setLoading(false)
        },
    });

    // handle login
    const handleLogin = async (values: { email: string; password: string }) => {
        setLoading(true)
        const user = {
            password: trimString(values.password),
            email: formatEmail(values.email),
        }

        loginMutate({
            url: ENDPOINTS.AUTH.LOGIN,
            method: 'POST',
            body: user,
            skipLoader: true,
        })
    }

    return (
        <AuthCard>
            <div className='my-6'>
                <p className='text-center text-black text-2xl font-semibold'>Let&apos;s Get Started!</p>
                <p className='text-center text-black text-para mt-2'>Please enter the email address & password to login into your account.</p>
            </div>
            <Form
                layout='vertical'
                onFinish={handleLogin}
                autoComplete='off'
                className='w-[95%] login-form'
            >
                <EmailFormItem name="email" />

                <PasswordFormItem
                    name="password"
                    required
                    extra={
                        <div className='text-end'>
                            <Link
                                href={ROUTES.AUTH.FORGOT_PASSWORD}
                                className='text-maincolor! text-sm cursor-pointer italic'
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    }
                />
                <AppButton htmlType="submit" isLoading={loading} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                    Login
                </AppButton>
            </Form>
        </AuthCard>
    )
}
