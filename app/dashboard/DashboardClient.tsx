"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  credits: number;
  plan: "FREE" | "STARTER" | "PRO";
}

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Workspace {
  _id: string;
  project: Project;
  updatedAt: string;
}

interface DashboardClientProps {
  user: User;
}

export default function DashboardClient({
  user,
}: DashboardClientProps) {
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function fetchWorkspaces() {
    try {
      setLoading(true);

      const response = await fetch("/api/workspaces");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch workspaces");
      }

      setWorkspaces(data.workspaces);
    } catch (error) {
      console.error("FETCH_WORKSPACES_ERROR:", error);
      setError("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  async function handleCreateProject(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      setName("");
      setDescription("");
      setShowModal(false);

      // Open the newly created workspace
      router.push(`/workspace/${data.workspace.id}`);
    } catch (error) {
      console.error("CREATE_PROJECT_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold">
              Forge
            </h1>

            <p className="mt-1 text-sm text-white/40">
              AI-powered app builder
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">
                {user.name}
              </p>

              <p className="text-xs text-white/40">
                {user.credits} credits
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Your projects
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Create and manage your AI-generated applications.
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setShowModal(true);
            }}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            + New Project
          </button>
        </div>

        {/* Error */}
        {error && !showModal && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          /* Empty state */
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl">
              ✦
            </div>

            <h3 className="text-lg font-medium">
              No projects yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-white/40">
              Create your first project and start building
              your application with AI.
            </p>

            <button
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
              className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Create your first project
            </button>
          </div>
        ) : (
          /* Projects */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <button
                key={workspace._id}
                onClick={() =>
                  router.push(
                    `/workspace/${workspace._id}`
                  )
                }
                className="group text-left"
              >
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition duration-200 hover:border-white/20 hover:bg-white/[0.05]">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                      ◇
                    </div>

                    <span className="text-xs text-white/30">
                      Open →
                    </span>
                  </div>

                  <h3 className="truncate font-medium">
                    {workspace.project.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm text-white/40">
                    {workspace.project.description ||
                      "No description"}
                  </p>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-xs text-white/30">
                      Updated{" "}
                      {new Date(
                        workspace.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Create Project Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Create new project
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Give your project a name and start building.
              </p>
            </div>

            <form
              onSubmit={handleCreateProject}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Project name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="My awesome app"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Description
                  <span className="ml-1 text-white/30">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="What are you building?"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "Creating..."
                    : "Create project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}