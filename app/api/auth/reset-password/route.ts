
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Session from "@/lib/models/Session";
import { hashToken } from "@/lib/token";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    await connectDB();

    // Hash the original token received from the user.
    const hashedToken = hashToken(token);

    // Hash the new password.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Find a user with a valid, unexpired reset token.
    // findOneAndUpdate makes token consumption atomic.
    const user = await User.findOneAndUpdate(
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetPasswordToken: 1,
          resetPasswordExpires: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // Revoke all existing user sessions.
    await Session.updateMany(
      {
        user: user._id,
        revoked: false,
      },
      {
        $set: {
          revoked: true,
        },
      }
    );

    return NextResponse.json({
      message: "Password reset successful. Please log in again.",
    });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
