
import { NextResponse } from "next/server";
import  { NextRequest } from "next/server";

import crypto from "crypto";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hashToken } from "@/lib/token";
import { sendResetPasswordEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = forgotPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const email = result.data.email.toLowerCase();

        await connectDB();

        const user = await User.findOne({ email });

        // Don't reveal whether the email exists.
        if (!user) {
            return NextResponse.json({
                message:
                    "If an account exists with this email, you will receive a password reset link.",
            });
        }

        // Generate a secure random token.
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store only the hashed token.
        user.resetPasswordToken = hashToken(resetToken);

        // Token expires in 15 minutes.
        user.resetPasswordExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!appUrl) {
            throw new Error("NEXT_PUBLIC_APP_URL is not configured");
        }

        const resetUrl = new URL("/reset-password", appUrl);
        resetUrl.searchParams.set("token", resetToken);

        await sendResetPasswordEmail({
            email: user.email,
            resetUrl: resetUrl.toString(),
        });

        return NextResponse.json({
            message:
                "If an account exists with this email, you will receive a password reset link.",
        });
    } catch (error) {
        console.error("FORGOT_PASSWORD_ERROR:", error);

        return NextResponse.json(
            { message: "Something went wrong. Please try again later." },
            { status: 500 }
        );
    }
}
