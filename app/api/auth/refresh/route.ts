import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken =
      cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          message: "Refresh token missing",
        },
        {
          status: 401,
        }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);

    await connectDB();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }

    const newAccessToken = generateAccessToken(
      user._id.toString()
    );

    const response = NextResponse.json({
      message: "Access token refreshed",
    });

    response.cookies.set(
      "accessToken",
      newAccessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 15,
        path: "/",
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        message: "Invalid or expired refresh token",
      },
      {
        status: 401,
      }
    );
  }
}
