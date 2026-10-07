import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { razorpay } from "@/lib/razorpay";

const subscriptionSchema = z.object({
    plan: z.enum(["STARTER", "PRO"]),
});

export async function POST(request: NextRequest) {
    try {
        // 1. Check logged-in user
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "You must be logged in" },
                { status: 401 }
            );
        }

        // 2. Validate requested plan
        const body = await request.json();

        const result = subscriptionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid subscription plan" },
                { status: 400 }
            );
        }

        const { plan } = result.data;

        // 3. Select Razorpay plan ID
        const planId =
            plan === "STARTER"
                ? process.env.RAZORPAY_STARTER_PLAN_ID
                : process.env.RAZORPAY_PRO_PLAN_ID;

        if (!planId) {
            console.error("RAZORPAY_PLAN_ID_MISSING");

            return NextResponse.json(
                { message: "Razorpay plan is not configured" },
                { status: 500 }
            );
        }

        // 4. Connect MongoDB
        await connectDB();

        // 5. Prevent duplicate active subscription
        if (
            user.razorpaySubscriptionId &&
            user.subscriptionStatus === "ACTIVE"
        ) {
            return NextResponse.json(
                {
                    message:
                        "You already have an active subscription",
                },
                { status: 400 }
            );
        }

        // 6. Create Razorpay subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: 12,
            customer_notify: 1,
            notes: {
                userId: user._id.toString(),
                email: user.email,
                plan,
            },
        });

        // 7. Save subscription ID in MongoDB
        await User.findByIdAndUpdate(user._id, {
            razorpaySubscriptionId: subscription.id,
            subscriptionStatus: "PENDING",
        });

        // 8. Send safe data to frontend
        return NextResponse.json({
            subscriptionId: subscription.id,
            plan,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("CREATE_SUBSCRIPTION_ERROR:", error);

        return NextResponse.json(
            { message: "Failed to create subscription" },
            { status: 500 }
        );
    }
}