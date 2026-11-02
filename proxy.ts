
import { NextRequest, NextResponse } from "next/server";

import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "@/lib/jwt";

import { connectDB } from "@/lib/db";
import Session from "@/lib/models/Session";
import { hashToken } from "@/lib/token";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. Check whether the access token is valid
  if (accessToken) {
    try {
      verifyAccessToken(accessToken);

      // Access token is valid. Continue.
      return NextResponse.next();
    } catch {
      // Access token expired or invalid.
      // Try the refresh token.
    }
  }

  // 2. Check whether the refresh token exists
  if (!refreshToken) {
    return redirectToLogin(request);
  }

  try {
    // 3. Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // 4. Connect to MongoDB
    await connectDB();

    // 5. Check the refresh token's session
    const session = await Session.findOne({
      user: decoded.id,
      refreshTokenHash: hashToken(refreshToken),
      revoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return redirectToLogin(request);
    }

    // 6. Generate a new access token
    const newAccessToken = generateAccessToken(decoded.id);

    // 7. Update the request cookie for downstream Server Components
    request.cookies.set("accessToken", newAccessToken);

    const response = NextResponse.next({
      request,
    });

    // 8. Set the new cookie in the browser
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("PROXY_REFRESH_ERROR:", error);

    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/login?reason=not-logged-in", request.url)
  );

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/workspace/:path*"],
};
