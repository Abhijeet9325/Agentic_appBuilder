"use client";

import { useState } from "react";

interface User {
    name: string;
    email: string;
    credits: number;
    plan: "FREE" | "STARTER" | "PRO";
}

interface HeaderProps {
    user: User;
}

const Header = ({ user }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    async function handleLogout() {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    async function handleLogoutAll() {
        try {
            const response = await fetch("/api/auth/logout-all", {
                method: "POST",
            });

            if (response.ok) {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Logout all error:", error);
        }
    }

    // Get first name
    const firstName = user.name.split(" ")[0];

    // Get first letter
    const firstLetter = firstName.charAt(0).toUpperCase();

    return (
        <header className="relative z-[100] h-16 w-full">
            <nav className="mx-auto flex h-[52px] max-w-[1680px] items-center justify-between border-x border-white/[0.08] bg-black px-6">

                {/* ================= LOGO ================= */}
                <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center">
                        <div className="grid grid-cols-2 gap-[2px]">
                            <span className="h-[5px] w-[5px] bg-white" />
                            <span className="h-[5px] w-[5px] bg-white/70" />
                            <span className="h-[5px] w-[5px] bg-white/70" />
                            <span className="h-[5px] w-[5px] bg-white" />
                        </div>
                    </div>

                    <span className="text-[17px] font-medium tracking-tight">
                        Forge
                    </span>
                </div>

                {/* ================= ACCOUNT ================= */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 backdrop-blur-md transition hover:bg-white/10"
                    >
                        {/* Dynamic first letter */}
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
                            {firstLetter}
                        </div>

                        {/* Dynamic first name */}
                        <span>{firstName}</span>

                        <span className="text-white/50">
                            {isOpen ? "⌃" : "⌄"}
                        </span>
                    </button>

                    {/* ================= DROPDOWN ================= */}
                    {isOpen && (
                        <div className="absolute right-0 top-full z-[999] mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#181818] p-1 shadow-2xl">

                            {/* User */}
                            <div className="border-b border-white/10 px-3 py-3">
                                <p className="text-sm font-medium text-white">
                                    {user.name}
                                </p>

                                <p className="mt-1 text-[11px] text-white/40">
                                    {user.plan} Plan
                                </p>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full rounded-lg px-3 py-2.5 text-left text-xs text-white/70 transition hover:bg-white/5 hover:text-white"
                            >
                                Logout
                            </button>

                            {/* Logout All */}
                            <button
                                onClick={handleLogoutAll}
                                className="w-full rounded-lg px-3 py-2.5 text-left text-xs text-red-400 transition hover:bg-red-500/10"
                            >
                                Logout all devices
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;