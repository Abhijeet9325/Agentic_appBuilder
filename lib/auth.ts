import "server-only";
import { cookies } from "next/headers";
import User from "./models/User";
import { connectDB } from "@/lib/db";
import { verifyAccessToken } from "@/lib/jwt";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    const decoded = verifyAccessToken(accessToken);

    await connectDB();

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}