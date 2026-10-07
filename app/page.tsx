import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/Header";
import AuthToast from "@/components/AuthToast";
import Pricing from "@/components/pricing";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?reason=not-logged-in");
  }
  return (<>
    <AuthToast />
    <Header user={user} />
    <main className="min-h-screen bg-[#111111] text-white">
      {/* ================= HERO ================= */}
      <section className="relative mx-auto max-w-[1680px] overflow-hidden border-x border-white/[0.08] px-[30px]">
        <div className="relative h-[508px] overflow-hidden rounded-b-[30px]">
          {/* Background Video */}
          <video
            poster="https://dqpcjghenxt8u.cloudfront.net/page-assets/homepage-m4/m4-teaser-video-background-poster.webp"
            src="https://dqpcjghenxt8u.cloudfront.net/video/M4+Teaser+Sample+Loop.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Blue glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 0% 100%, rgba(45,76,113,0.85) 0%, transparent 55%)",
            }}
          />

          {/* Orange glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 100% 100%, rgba(121,51,37,0.75) 0%, transparent 50%)",
            }}
          />

          {/* Extra dark gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.2))",
            }}
          />

          {/* ================= HERO CONTENT ================= */}
          <div className="relative z-10 flex h-full flex-col items-center pt-[38px]">
            {/* Heading */}
            <h1 className="text-center text-[42px] font-light leading-[1.05] tracking-[-2.5px] text-[#eeeeea] md:text-[52px]">
              Secure your vibe-coded apps
            </h1>

            {/* NEW badge */}
            <div className="mt-7 flex items-center gap-2 text-[11px] text-white/80">
              <span className="rounded-full bg-[#dce0db] px-[6px] py-[2px] text-[9px] font-medium text-black">
                NEW
              </span>

              <span>
                Explore the new Retool app builder for free
              </span>
            </div>

            {/* ================= AI PROMPT BOX ================= */}
            <div className="mt-4 w-[485px] max-w-[90%]">
              <div className="rounded-[17px] border border-[#8d9ca4] bg-[#e8e9df] p-3 shadow-[0_0_0_2px_rgba(0,0,0,0.35)]">
                {/* Prompt */}
                <div className="min-h-[105px] text-[12px] leading-[1.5] text-[#66675f]">
                  Build an order management tool that tracks all orders from
                  the order management{" "}
                  <span className="text-[#596d77] underline">
                    @Retool Database
                  </span>{" "}
                  and flags an order if it is delayed by more than 3 days.
                </div>

                {/* Bottom controls */}
                <div className="flex items-center justify-between">
                  <button className="rounded-md border border-[#c5c8c1] bg-[#dedfd6] px-2 py-1 text-[10px] text-[#66675f]">
                    Starter prompts⌄
                  </button>

                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4b91d9] text-lg text-white shadow-sm transition hover:scale-105">
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* ================= FLOATING BUTTONS ================= */}
            <div className="mt-2 flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg bg-[#eeeeeb] px-3 py-2 text-[10px] text-[#555750] shadow-lg">
                <span className="flex -space-x-1">
                  <span className="h-4 w-4 rounded bg-black" />
                  <span className="h-4 w-4 rounded bg-orange-500" />
                  <span className="h-4 w-4 rounded bg-blue-500" />
                </span>

                Import code
                <span>⌄</span>
              </button>

              <button className="flex items-center gap-2 rounded-lg bg-[#eeeeeb] px-3 py-2 text-[10px] text-[#555750] shadow-lg">
                <span className="flex -space-x-1">
                  <span className="h-4 w-4 rounded-full bg-black" />
                  <span className="h-4 w-4 rounded-full bg-orange-500" />
                  <span className="h-4 w-4 rounded-full bg-blue-500" />
                </span>

                Build with AI agents
                <span>⌄</span>
              </button>
            </div>

            {/* ================= BOTTOM WATCH BUTTON ================= */}
            <button className="absolute bottom-[25px] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/90 px-4 py-2 text-[10px] text-white/90 backdrop-blur">
              <span>See what's new.</span>

              <span className="font-medium">
                Watch the film
              </span>

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eeeeea] text-[9px] text-black">
                ▶
              </span>
            </button>

            {/* Pause button */}
            <button className="absolute bottom-[24px] left-[30px] flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/20 text-[9px] text-white">
              ||
            </button>
          </div>
        </div>
      </section>

      {/* ================= LOGOS ================= */}
      <section className="mx-auto max-w-[1100px] px-8 py-[55px]">
        <div className="grid grid-cols-2 gap-y-9 md:grid-cols-4">
          {/* Row 1 */}
          <Logo name="DOORDASH" />
          <Logo name="OpenAI" />
          <Logo name="Pendo" />
          <Logo name="orangetheory" />

          {/* Row 2 */}
          <Logo name="stripe" />
          <Logo name="PHILIPS" />
          <Logo name="Pinterest" />
          <Logo name="ramp" />
        </div>
      </section>
      {/* Pricing */}
      <Pricing />
    </main>
  </>
  );
}

/* ================= LOGO COMPONENT ================= */

function Logo({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center text-center">
      <span className="text-[17px] font-semibold tracking-tight text-[#e5e5df]">
        {name}
      </span>
    </div>
  );
}