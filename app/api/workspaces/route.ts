import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

import Project from "@/lib/models/Project";
import Workspace from "@/lib/models/Workspace";

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Read request
    const body = await request.json();

    const name = body.name?.trim();
    const description = body.description?.trim() || "";

    if (!name) {
      return NextResponse.json(
        { message: "Project name is required" },
        { status: 400 }
      );
    }

    // 3. Connect database
    await connectDB();

    // 4. Create project
    const project = await Project.create({
      user: user._id,
      name,
      description,
    });

    // 5. Create workspace
    const workspace = await Workspace.create({
      project: project._id,
      user: user._id,
      files: [],
      messages: [],
    });

    return NextResponse.json(
      {
        message: "Workspace created successfully",

        project: {
          id: project._id.toString(),
          name: project.name,
          description: project.description,
        },

        workspace: {
          id: workspace._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_WORKSPACE_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to create workspace" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const workspaces = await Workspace.find({
      user: user._id,
    })
      .populate("project", "name description")
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      workspaces,
    });
  } catch (error) {
    console.error("GET_WORKSPACES_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}