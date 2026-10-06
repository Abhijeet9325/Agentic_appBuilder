import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/db";
import Session from "@/lib/models/Session";

import { verifyRefreshToken } from "@/lib/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken =
      cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          message: "Refresh token not found",
        },
        {
          status: 400,
        }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);

    await connectDB();

    await Session.updateMany(
      {
        user: decoded.id,
        revoked: false,
      },
      {
        $set: {
          revoked: true,
        },
      }
    );

    const response = NextResponse.json({
      message: "Logged out from all devices successfully",
    });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("LOGOUT_ALL_ERROR:", error);

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