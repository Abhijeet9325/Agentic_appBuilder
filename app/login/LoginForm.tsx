"use client";
import { toast } from "sonner";
import { FormEvent, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {

    const searchParams = useSearchParams();
    const router = useRouter();

    const toastShown = useRef(false);

useEffect(() => {
    const reason = searchParams.get("reason");

    if (reason === "not-logged-in" && !toastShown.current) {
        toastShown.current = true;

        toast.error("You are not logged in", {
            id: "not-logged-in-toast",
            description: "Please log in to continue.",
            duration: 3000,
        });

        window.history.replaceState({}, "", "/login");
    }
}, [searchParams]);



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            // Login successful
            router.replace("/");
        } catch (error) {
            console.error("LOGIN_ERROR:", error);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
            <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8">
                <h1 className="mb-2 text-2xl font-semibold">
                    Welcome back
                </h1>

                <p className="mb-6 text-sm text-white/50">
                    Login to continue building.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
                        required
                    />

                    {error && (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-white py-3 font-medium text-black disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-white/50">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="text-white hover:underline"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </main>
    );
}