import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/db";
import Session from "@/lib/models/Session";

import {
  verifyRefreshToken,
  generateAccessToken,
} from "@/lib/jwt";

import { hashToken } from "@/lib/token";

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

    const refreshTokenHash = hashToken(refreshToken);

    await connectDB();

    const session = await Session.findOne({
      user: decoded.id,
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return NextResponse.json(
        {
          message: "Session is invalid or revoked",
        },
        {
          status: 401,
        }
      );
    }

    if (session.expiresAt < new Date()) {
      session.revoked = true;
      await session.save();

      return NextResponse.json(
        {
          message: "Session expired",
        },
        {
          status: 401,
        }
      );
    }

    const newAccessToken = generateAccessToken(
      decoded.id
    );

    const response = NextResponse.json({
      message: "Access token refreshed",
    });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("REFRESH_ERROR:", error);

    return NextResponse.json(
      {
        message: "Invalid refresh token",
      },
      {
        status: 401,
      }
    );
  }
}