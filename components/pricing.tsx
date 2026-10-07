"use client";

import { useState } from "react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const plans = [
    {
        name: "Free",
        price: "₹0",
        description: "Try Forge and start building.",
        credits: "10 credits / month",
        features: [
            "10 credits per month",
            "Live preview",
            "Export to ZIP",
        ],
        plan: "FREE",
    },
    {
        name: "Starter",
        price: "₹199",
        description: "For developers who build regularly.",
        credits: "100 credits / month",
        features: [
            "100 credits per month",
            "Image uploads",
            "Live preview",
            "Export to ZIP",
            "Faster AI response",
        ],
        plan: "STARTER",
    },
    {
        name: "Pro",
        price: "₹499",
        description: "For power users who ship fast.",
        credits: "300 credits / month",
        features: [
            "300 credits per month",
            "Image uploads",
            "Priority AI",
            "Live preview",
            "Export to ZIP",
            "Forge AI Agent",
        ],
        plan: "PRO",
    },
];

export default function Pricing() {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    async function handleSubscribe(
        plan: "STARTER" | "PRO"
    ) {
        try {
            setLoadingPlan(plan);

            // Load Razorpay Checkout script
            if (!window.Razorpay) {
                const script = document.createElement("script");

                script.src =
                    "https://checkout.razorpay.com/v1/checkout.js";

                script.onload = () => {
                    console.log("Razorpay loaded");
                };

                document.body.appendChild(script);

                await new Promise<void>((resolve, reject) => {
                    script.onload = () => resolve();
                    script.onerror = () =>
                        reject(
                            new Error(
                                "Failed to load Razorpay"
                            )
                        );
                });
            }

            // Create Razorpay subscription
            const response = await fetch(
                "/api/payments/create-subscription",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        plan,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to start subscription");
                return;
            }

            // Open Razorpay Checkout
            const options = {
                key: data.keyId,

                subscription_id: data.subscriptionId,

                name: "Forge",
                description: `${plan} Subscription`,

                handler: function (response: any) {
                    console.log(
                        "Payment successful:",
                        response
                    );

                    alert(
                        "Payment successful! Your subscription is being activated."
                    );

                    window.location.reload();
                },

                prefill: {
                    name: "",
                    email: "",
                },

                theme: {
                    color: "#ffffff",
                },

                modal: {
                    ondismiss: function () {
                        console.log(
                            "Razorpay Checkout closed"
                        );
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.open();
        } catch (error) {
            console.error(
                "SUBSCRIPTION_ERROR:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoadingPlan(null);
        }
    }

    return (
        <section
            id="pricing"
            className="relative bg-black px-6 py-32 text-white"
        >
            <div className="mx-auto max-w-6xl">

                {/* Heading */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/40">
                        Pricing
                    </p>

                    <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                        Build more with Forge.
                    </h2>

                    <p className="mt-5 text-white/50">
                        Start for free and upgrade when you need
                        more power.
                    </p>
                </div>

                {/* Plans */}
                <div className="grid gap-5 md:grid-cols-3">

                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col rounded-2xl border p-7 ${
                                plan.name === "Pro"
                                    ? "border-white/30 bg-white/[0.08]"
                                    : "border-white/10 bg-white/[0.03]"
                            }`}
                        >

                            {/* Pro badge */}
                            {plan.name === "Pro" && (
                                <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-black">
                                    Popular
                                </div>
                            )}

                            <h3 className="text-xl font-medium">
                                {plan.name}
                            </h3>

                            <p className="mt-2 min-h-[40px] text-sm text-white/40">
                                {plan.description}
                            </p>

                            {/* Price */}
                            <div className="mt-7">
                                <span className="text-4xl font-semibold">
                                    {plan.price}
                                </span>

                                {plan.name !== "Free" && (
                                    <span className="ml-1 text-sm text-white/40">
                                        / month
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 text-sm text-white/60">
                                {plan.credits}
                            </p>

                            {/* Button */}
                            <div className="mt-7">
                                {plan.plan === "FREE" ? (
                                    <button
                                        disabled
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white/50"
                                    >
                                        Free plan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            handleSubscribe(
                                                plan.plan as
                                                    | "STARTER"
                                                    | "PRO"
                                            )
                                        }
                                        disabled={
                                            loadingPlan ===
                                            plan.plan
                                        }
                                        className="w-full rounded-xl bg-white py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loadingPlan ===
                                        plan.plan
                                            ? "Loading..."
                                            : `Subscribe to ${plan.name}`}
                                    </button>
                                )}
                            </div>

                            {/* Features */}
                            <div className="mt-8 border-t border-white/10 pt-6">
                                <p className="mb-4 text-xs uppercase tracking-wider text-white/30">
                                    Includes
                                </p>

                                <ul className="space-y-3">
                                    {plan.features.map(
                                        (feature) => (
                                            <li
                                                key={feature}
                                                className="flex gap-2 text-sm text-white/60"
                                            >
                                                <span className="text-white">
                                                    ✓
                                                </span>

                                                {feature}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}