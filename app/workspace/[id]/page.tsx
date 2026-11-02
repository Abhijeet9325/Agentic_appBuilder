import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Workspace from "@/lib/models/Workspace";

interface WorkspacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkspacePage({
  params,
}: WorkspacePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?reason=not-logged-in");
  }

  const { id } = await params;

  await connectDB();

const workspace = await Workspace.findOne({
  _id: id,
  user: user._id,
}).populate<{
  project: {
    name: string;
    description: string;
  };
}>("project", "name description");

  if (!workspace) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <h1 className="font-semibold">
          {workspace.project.name}
        </h1>

        <p className="text-sm text-white/40">
          {workspace.project.description}
        </p>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Chat */}
        <section className="w-[350px] border-r border-white/10 p-5">
          <h2 className="font-medium">
            AI Assistant
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Chat with the AI to build your application.
          </p>
        </section>

        {/* Editor */}
        <section className="flex-1 p-5">
          <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm text-white/40">
              Code editor will come here.
            </p>
          </div>
        </section>

        {/* Preview */}
        <section className="w-[400px] border-l border-white/10 p-5">
          <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm text-white/40">
              Live preview will come here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}