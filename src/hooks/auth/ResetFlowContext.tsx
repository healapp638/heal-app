'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface ResetFlowState {
  email?: string;
  token?: string;
  otp?: string;
  flow?: string;
}

interface ResetFlowContextValue {
  state: ResetFlowState;
  setState: Dispatch<SetStateAction<ResetFlowState>>;
}

const ResetFlowContext = createContext<ResetFlowContextValue | null>(null);

export function ResetFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ResetFlowState>({});

  return (
    <ResetFlowContext.Provider value={{ state, setState }}>
      {children}
    </ResetFlowContext.Provider>
  );
}

export function useResetFlowContext() {
  const ctx = useContext(ResetFlowContext);
  if (!ctx) {
    throw new Error('useResetFlow must be used within the (auth) route group, which provides ResetFlowProvider');
  }
  return ctx;
}
