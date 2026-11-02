import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

import Workspace from "@/lib/models/Workspace";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const workspace = await Workspace.findOne({
      _id: id,
      user: user._id,
    }).populate("project", "name description");

    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      workspace,
    });
  } catch (error) {
    console.error("GET_WORKSPACE_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch workspace" },
      { status: 500 }
    );
  }
}