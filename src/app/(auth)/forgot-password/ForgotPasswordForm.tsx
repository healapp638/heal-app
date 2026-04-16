'use client';

import React from 'react';
import { Form } from 'antd';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/routerKeys';
import { ENDPOINTS } from '@/Endpoints';
import { MUTATION_KEYS } from '@/tanstack/keys';
import { useAppMutate } from '@/tanstack/useAppMutate';
import { tryCatchWrapper } from '@/utils/tryCatchWrapper';
import logger from '@/utils/logger';

import { EmailFormItem } from '@/components/ui/forms/AppForm';
import { AppButton } from '@/components/ui';
import { useResetFlow } from '@/hooks/auth/useResetFlow';
import { formatEmail } from '@/utils/formatting/string';
import AuthCard from '@/components/commonCard/AuthCard';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { setResetEmail } = useResetFlow();

  // forgot password mutate
  const { mutateAsync: forgotPasswordMutate } = useAppMutate({
    mutationKey: [MUTATION_KEYS.FORGOT_PASSWORD],

    onSuccess(data: any) {
      logger.success('Password reset link sent to email', {
        email: data?.email,
      });

      // Store email in hook state and navigate to OTP
      const resetEmail = data?.email || '';
      setResetEmail(resetEmail);
      router.push(ROUTES.AUTH.VERIFY_OTP);
    },

    onError(error: unknown) {
      // Email stored from form submission, navigate to OTP for testing
      router.push(ROUTES.AUTH.VERIFY_OTP);
      if (error instanceof Error) {
        logger.error('Failed to send reset link', error);
      } else {
        logger.warn('Failed to send reset link', error);
      }
    },
  });

  // handle forgot password
  const handleForgotPassword = async (values: { email: string }) => {
    setResetEmail(values.email);
    logger.info('Forgot password request initiated', {
      email: values.email,
    });

    await tryCatchWrapper(
      () =>
        forgotPasswordMutate({
          url: ENDPOINTS.AUTH.FORGOT_PASSWORD,
          method: 'POST',
          body: { email: formatEmail(values.email) },
        }),
      {
        errorMessage: 'Failed to process forgot password request',
        showToast: true,
        onError(error) {
          if (error instanceof Error) {
            logger.error('Forgot password request failed', error);
          } else {
            logger.warn('Forgot password request failed', error);
          }
        },
      }
    );
  };

  return (
     <AuthCard>
            <div className='my-6'>
                <p className='text-center text-black text-2xl font-semibold'>Forgot Password</p>
                <p className='text-center text-black text-para mt-2'>Enter your Email to reset your account password.</p>
            </div>
            <Form
                layout='vertical'
                autoComplete='off'
                onFinish={handleForgotPassword}
                className='w-[95%] mx-auto!'
            >
                <EmailFormItem name="email" />
             
                <AppButton htmlType="submit"  className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                    Continue
                </AppButton>
            </Form>
        </AuthCard>
  );
}
