'use client';

import { ReactNode } from 'react';
import { PageTransition } from '@/components/animations';
import { ResetFlowProvider } from '@/hooks/auth/ResetFlowContext';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        // <div className="min-h-screen bg-cream! scroll-smooth relative backgroundImage">
        <div className="min-h-screen bg-white scroll-smooth relative ">
            <ResetFlowProvider>
                <PageTransition>
                    {children}
                </PageTransition>
            </ResetFlowProvider>
        </div>
    );
}
