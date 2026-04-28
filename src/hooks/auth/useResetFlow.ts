import { useState, useCallback } from 'react';

let resetFlowState: { email?: string; token?: string; otp?: string; flow?: string } = {};

export const useResetFlow = () => {
  const [, setRefresh] = useState({});

  const setResetEmail = useCallback((email: string) => {
    resetFlowState.email = email;
    resetFlowState.flow = 'reset';
    setRefresh({});
  }, []);

  const setResetToken = useCallback((token: string) => {
    resetFlowState.token = token;
    setRefresh({});
  }, []);


  const setResetOTP = useCallback((otp: string) => {
    resetFlowState.otp = otp;
    setRefresh({});
  }, []);

  const getResetEmail = useCallback(() => resetFlowState.email, []);
  const getResetToken = useCallback(() => resetFlowState.token, []);
  const getResetOTP = useCallback(() => resetFlowState.otp, []);
  const getFlow = useCallback(() => resetFlowState.flow, []);

  const clearResetFlow = useCallback(() => {
    resetFlowState = {};
    setRefresh({});
  }, []);

  return {
    setResetEmail,
    setResetToken,
    setResetOTP,
    getResetOTP,
    getResetEmail,
    getResetToken,
    getFlow,
    clearResetFlow,
    resetEmail: resetFlowState.email,
    resetToken: resetFlowState.token,
    resetOTP: resetFlowState.otp,
    flow: resetFlowState.flow,
  };
};
