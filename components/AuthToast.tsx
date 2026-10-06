"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AuthToast() {
    const searchParams = useSearchParams();
    const toastShown = useRef(false);

    useEffect(() => {
        const reason = searchParams.get("reason");

        if (reason === "already-logged-in" && !toastShown.current) {
            toastShown.current = true;

            toast.info("You are already logged in", {
                id: "already-logged-in-toast",
                description: "You are already signed in to your account.",
                duration: 3000,
            });

            // Remove ?reason=already-logged-in from URL
            window.history.replaceState({}, "", "/");
        }
    }, [searchParams]);

    return null;
}