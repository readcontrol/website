import Button from "@/components/Button";
import Faq from "@/components/Faq";
import Letter from "@/components/Letter";
import PromoVideo from "@/components/PromoVideo";
import { Apple } from "@/lib/content";

const GITHUB =
  "https://github.com/boniattirodrigo/readcontrol-main?utm_source=readcontrol.app";
const DOWNLOAD = "#download"; // placeholder until a build is published

/** Centred page gutter, shared by every section. */
const CONTAINER = "mx-auto w-full max-w-page px-6";
/** Small uppercase kicker above a heading. */
const EYEBROW =
  "text-xs font-semibold uppercase tracking-widest text-fg-subtle";

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <main id="top">
        {/* ---------- Hero ---------- */}
        <section className="relative pt-12 pb-6 md:pt-18 md:pb-8 lg:pt-26 lg:pb-10">
          <div
            className={`${CONTAINER} flex flex-col items-center gap-9 text-center md:gap-12 lg:gap-15`}
          >
            <div className="max-w-2xl">
              <p className={EYEBROW}>Free · open-source · local-first</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                The native macOS reading manager
              </h1>
              <p className="mx-auto mt-8 max-w-lg text-lg text-fg-muted md:text-xl">
                Save any webpage in your computer, read at anytime. No account needed. It’s totally free!
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button href={DOWNLOAD}>
                  <Apple size={17} />
                  Download for macOS
                </Button>
                <Button href={GITHUB} variant="ghost">
                  View on GitHub
                </Button>
              </div>
              <p className="mt-12 text-sm text-fg-subtle">
                See how it works in 2 minutes
              </p>
            </div>
          </div>

          {/* wider than the container so the video keeps its 900px cap, but
              still gutters to the same edge on small screens */}
          <div
            className="mx-auto mt-2 w-full max-w-[948px] scroll-mt-20 px-6"
            id="how"
          >
            <PromoVideo />
          </div>
        </section>

        {/* ---------- Letter ---------- */}
        <Letter />

        {/* ---------- FAQ ---------- */}
        <Faq />
      </main>
    </div>
  );
}
