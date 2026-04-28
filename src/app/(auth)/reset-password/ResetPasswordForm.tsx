"use client"

import React from "react";
import { Form } from "antd";
import logger from "@/utils/logger";
import { ROUTES } from "@/routerKeys";
import { ENDPOINTS } from "@/Endpoints";
import { useRouter } from "next/navigation";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import AuthCard from "@/components/commonCard/AuthCard";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { formatEmail } from "@/utils/helper";
import { ConfirmPasswordFormItem, PasswordFormItem } from "@/components/ui/forms/AppForm";
import { useResetFlow } from "@/hooks/auth/useResetFlow";
import { AppButton } from "@/components/ui";

const ResetPasswordForm = () => {

  const router = useRouter();
  const [form] = Form.useForm();
  const { getResetEmail, getResetOTP, clearResetFlow} = useResetFlow();


  const { mutateAsync: resetPasswordMutate, isPending } = useAppMutate({
    mutationKey: [MUTATION_KEYS.RESET_PASSWORD],
    onSuccess() {
      clearResetFlow();
      router.push(ROUTES.WELCOME.WELCOME);
    },
    onError(error: any) {
      logger.error('Password reset failed', error);
    },
  });

  const handleResetPassword = async (values: {
    newpassword: string;
    confirmpassword: string
  }) => {
    // Validate passwords match
    if (values.newpassword !== values.confirmpassword) {
      form.setFields([
        {
          name: 'confirmpassword',
          errors: ['Passwords do not match'],
        },
      ]);
      return;
    }

    // Get all required data from reset flow
    const email = getResetEmail();
    const otp = getResetOTP();

    await tryCatchWrapper(
      () =>
        resetPasswordMutate({
          url: ENDPOINTS.AUTH.RESET_PASSWORD,
          method: 'POST',
          body: {
            email: formatEmail(email),
            otp: otp,
            new_password: values.newpassword
          },
        }),
      {
        errorMessage: 'Failed to reset password',
        showToast: true,
        onError(error) {
          if (error instanceof Error) {
            logger.error('Reset password failed', error);
          }
        },
      }
    );
  };

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
          name="newpassword"
          required
          label="New Password"
        />
        <ConfirmPasswordFormItem
          name="confirmpassword"
          passwordFieldName="newpassword"
          required
          label="Confirmed Password"
        />
        <AppButton isLoading={isPending} ghost={true} htmlType="submit" className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 w-full rounded-lg  border-transparent! border-none! outline-none!  shadow-none!">
          Submit
        </AppButton>
      </Form>
    </AuthCard>
  )
}
export default ResetPasswordForm