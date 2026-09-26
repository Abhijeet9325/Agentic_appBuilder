import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold">
        {"<forge>"}
      </h1>

      <p className="mt-4 text-white/50">
        AI-powered React app builder
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-lg border border-white/10 px-5 py-3"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-lg bg-white px-5 py-3 text-black"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}