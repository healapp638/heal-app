'use client'

import { useState, useEffect } from 'react'
import { ROUTES } from '@/routerKeys'
import { useRouter } from 'next/navigation'
import { Form, Modal } from 'antd'
import { useAppMutate } from '@/tanstack/useAppMutate'
import { tryCatchWrapper } from '@/utils/tryCatchWrapper'
import { ENDPOINTS } from '@/Endpoints'
import { MUTATION_KEYS } from '@/tanstack/keys'
import { PasswordFormItem, ConfirmPasswordFormItem } from '@/components/ui/forms/AppForm'
import logger from '@/utils/logger'
import { AppButton } from '@/components/ui'
import { useResetFlow } from '@/hooks/auth/useResetFlow'
import AuthCard from '@/components/commonCard/AuthCard'

export default function ResetPasswordForm() {
  const router = useRouter()
  const { resetToken, clearResetFlow } = useResetFlow()
  const [token, setToken] = useState<string | null>(null)

  // reset mutate
  const { mutateAsync: resetPasswordMutate, isPending } = useAppMutate({
    mutationKey: [MUTATION_KEYS.RESET_PASSWORD],
    onSuccess(_data: any) {
      logger.success('Password reset successfully')

      // Clear reset flow state
      clearResetFlow()

      Modal.success({
        title: 'Password Reset Successful',
        content: 'Your password has been reset. Redirecting to login...',
        onOk() {
          router.push(ROUTES.WELCOME.WELCOME)
        },
      })

      // fallback redirect in case user doesn't click OK
      setTimeout(() => router.push(ROUTES.WELCOME.WELCOME), 1500)
    },
    onError(error: any) {
      // Clear reset flow state
      clearResetFlow()

      Modal.success({
        title: 'Password Reset Successful',
        content: 'Your password has been reset. Redirecting to login...',
        onOk() {
          router.push(ROUTES.WELCOME.WELCOME)
        },
      })

      // fallback redirect in case user doesn't click OK
      setTimeout(() => router.push(ROUTES.WELCOME.WELCOME), 1500)
      logger.error('Failed to reset password', error)
    },
  })

  // handle reset password 
  const handleResetPassword = async (values: {
    password: string
    confirmPassword: string
  }) => {
    if (!token) {
      logger.error('Invalid reset link', 'No token provided')
      return
    }

    logger.log('Password reset initiated')

    await tryCatchWrapper(
      () =>
        resetPasswordMutate({
          url: ENDPOINTS.AUTH.RESET_PASSWORD,
          method: 'POST',
          body: {
            token,
            password: values.password,
          },
        }),
      {
        errorMessage: 'Failed to reset password',
        showToast: true,
        onError(error) {
          logger.error('Password reset error:', error)
        },
      }
    )
  }

  // useEffect to get token from hook state
  useEffect(() => {
    // Get token from hook state
    if (resetToken) {
      setToken(resetToken)
    }
  }, [resetToken])

  // if no token, show invalid reset link
  // if (!token) {
  //   return (
  //     <div className="authCard">
  //       <div className="space-y-4 text-center">
  //         <div className="text-lg font-semibold text-red-600">Invalid Reset Link</div>
  //         <p className="text-muted-foreground">
  //           The password reset link is invalid or has expired. Please request a new one.
  //         </p>

  //         <Divider />

  //         <Link
  //           href={ROUTES.AUTH.FORGOT_PASSWORD}
  //           className="inline-block text-primary hover:text-primary/80 font-medium"
  //         >
  //           Request New Reset Link
  //         </Link>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <AuthCard>
            <Form
                layout='vertical'
                onFinish={handleResetPassword}
                requiredMark={false}
                autoComplete='off'
                className='w-full text-center'
            >   
                <PasswordFormItem
                    name="password"
                    required
                    label="New Password"
                />
                <ConfirmPasswordFormItem
                    name="confirmPassword"
                    passwordFieldName="password"
                    required
                    label="Confirmed Password"
                />
                <AppButton isLoading={isPending} ghost={true} htmlType="submit"className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 w-full rounded-lg  border-transparent! border-none! outline-none!  shadow-none!">
                    Submit
                </AppButton>
            </Form>
        </AuthCard>
  )
}
