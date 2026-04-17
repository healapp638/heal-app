'use client';

import { ReactNode } from 'react';
import { PageTransition } from '@/components/animations';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-cream! scroll-smooth relative backgroundImage">
            <PageTransition>
                {children}
            </PageTransition>
        </div>
    );
}
