import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <h1 className="text-3xl font-bold">
        Welcome, {user.name}
      </h1>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
        <p>
          Email: {user.email}
        </p>

        <p className="mt-2">
          Plan: {user.plan}
        </p>

        <p className="mt-2">
          Credits: {user.credits}
        </p>
      </div>
    </main>
  );
}