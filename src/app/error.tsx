"use client";

import { useEffect } from "react";
import Link from "next/link";
import logger from "@/utils/logger";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error("Unhandled render error", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="authCard text-center max-w-xl w-full">
                <p className="text-primary text-sm font-semibold mb-2">
                    SOMETHING WENT WRONG
                </p>

                <h1 className="blackText mb-3">
                    An unexpected error occurred
                </h1>

                <p className="text-sm text-muted-foreground mb-8">
                    Please try again. If the problem keeps happening, contact support.
                </p>

                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                    >
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-card transition"
                    >
                        Go to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
