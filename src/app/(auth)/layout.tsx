'use client';

import { ReactNode, useEffect } from 'react';
import { PageTransition } from '@/components/animations';
import { ResetFlowProvider } from '@/hooks/auth/ResetFlowContext';

export default function AuthLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        // A page restored from bfcache never hits the network, so src/proxy.ts
        // never runs. Force a real navigation so an authenticated user gets
        // redirected away from the auth pages instead of seeing a stale snapshot.
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                window.location.reload();
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

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
