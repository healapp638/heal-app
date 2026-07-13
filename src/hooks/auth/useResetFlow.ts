'use client';

import { useCallback } from 'react';
import { useResetFlowContext } from './ResetFlowContext';

export const useResetFlow = () => {
  const { state, setState } = useResetFlowContext();

  const setResetEmail = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email, flow: 'reset' }));
  }, [setState]);

  const setResetToken = useCallback((token: string) => {
    setState((prev) => ({ ...prev, token }));
  }, [setState]);

  const setResetOTP = useCallback((otp: string) => {
    setState((prev) => ({ ...prev, otp }));
  }, [setState]);

  const getResetEmail = useCallback(() => state.email, [state.email]);
  const getResetToken = useCallback(() => state.token, [state.token]);
  const getResetOTP = useCallback(() => state.otp, [state.otp]);
  const getFlow = useCallback(() => state.flow, [state.flow]);

  const clearResetFlow = useCallback(() => {
    setState({});
  }, [setState]);

  return {
    setResetEmail,
    setResetToken,
    setResetOTP,
    getResetOTP,
    getResetEmail,
    getResetToken,
    getFlow,
    clearResetFlow,
    resetEmail: state.email,
    resetToken: state.token,
    resetOTP: state.otp,
    flow: state.flow,
  };
};
