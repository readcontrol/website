import Button from "@/components/Button";
import PromoVideo from "@/components/PromoVideo";
import Media from "@/components/Media";
import { Bookmark, Check, FEATURES, EXTRAS } from "@/lib/content";

const GITHUB = "https://github.com/boniattirodrigo/readcontrol-main";
const DOWNLOAD = "#download"; // placeholder until a build is published

/** Centred page gutter, shared by every section. */
const CONTAINER = "mx-auto w-full max-w-page px-6";
/** Small uppercase kicker above a heading. */
const EYEBROW =
  "text-xs font-semibold uppercase tracking-widest text-fg-subtle";
/** Section heading, centred over an optional eyebrow. */
const SECTION_HEAD = "mx-auto mb-9 max-w-xl text-center md:mb-12 lg:mb-15";
const H2 = "mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl";

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      {/* ---------- Nav ---------- */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/70 backdrop-blur-md backdrop-saturate-150">
        <div className={`${CONTAINER} flex h-15 items-center justify-between gap-4`}>
          <a className="flex items-center gap-2.5 font-semibold" href="#top">
            <Bookmark size={20} />
            Read Control
          </a>
          <nav className="flex items-center gap-2.5">
            <Button href={GITHUB} variant="ghost" size="sm">
              GitHub
            </Button>
            <Button href={DOWNLOAD} size="sm">
              Download
            </Button>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ---------- Hero ---------- */}
        <section className="relative pt-12 pb-10 md:pt-18 md:pb-14 lg:pt-26 lg:pb-18">
          <div
            className={`${CONTAINER} flex flex-col items-center gap-9 text-center md:gap-12 lg:gap-15`}
          >
            <div className="max-w-2xl">
              <p className={EYEBROW}>Free · open-source · local-first</p>
              <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                The native macOS reading manager
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-lg text-fg-muted md:text-xl">
                Save any webpage to your machine, no account needed, read at any
                time.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button href={DOWNLOAD}>
                  <Bookmark size={17} />
                  Download for macOS
                </Button>
                <Button href="#how" variant="ghost">
                  See how it works
                </Button>
              </div>
              <p className="mt-4 text-sm text-fg-subtle">
                See how it works in 2 minutes
              </p>
            </div>
          </div>

          {/* wider than the container so the video keeps its 900px cap, but
              still gutters to the same edge on small screens */}
          <div className="mx-auto mt-8 w-full max-w-[948px] px-6">
            <PromoVideo />
          </div>
        </section>

        {/* ---------- Feature rows ---------- */}
        <section className="pb-14 md:pb-20 lg:pb-26" id="features">
          <div className={CONTAINER}>
            <div className={SECTION_HEAD}>
              <p className={EYEBROW}>Features</p>
              <h2 className={H2}>Everything, on your disk</h2>
            </div>

            {FEATURES.map((f, i) => (
              <article
                key={f.title}
                // rule between rows only — the heading above is the
                // container's real first child, so `not-first:` won't do
                className={`grid items-center gap-6 py-8 md:grid-cols-2 md:gap-8 md:py-11 lg:gap-18 lg:py-14 ${
                  i > 0 ? "border-t border-white/10" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "md:order-2" : undefined}>
                  <Media
                    src={f.image}
                    alt={f.title}
                    ratio={f.ratio}
                    label={`Image — ${f.image}`}
                  />
                </div>
                <div>
                  <p className={EYEBROW}>{f.eyebrow}</p>
                  <h3 className="text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-lg text-fg-muted">{f.lead}</p>
                  <ul className="mt-5 grid gap-3">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <Check className="mt-1 shrink-0 text-cream-dim" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Extras grid ---------- */}
        <section className="pb-14 md:pb-20 lg:pb-26">
          <div className={CONTAINER}>
            <div className={SECTION_HEAD}>
              <p className={EYEBROW}>And more</p>
              <h2 className={H2}>Small touches that add up</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EXTRAS.map((e) => (
                <div
                  key={e.title}
                  className="rounded-xl border border-white/10 bg-surface-2 p-6 transition hover:-translate-y-0.5 hover:border-white/15"
                >
                  <Bookmark size={18} className="text-cream-dim" />
                  <h4 className="mt-3 mb-1.5 font-semibold">{e.title}</h4>
                  <p className="text-sm text-fg-muted">{e.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="py-16 text-center md:py-22 lg:py-30" id="download">
          <div className={CONTAINER}>
            <h2 className="text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Your reading list, on your terms.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-fg-muted">
              Plain files. No accounts. No servers. Save a page and it&apos;s
              yours to keep.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={DOWNLOAD}>
                <Bookmark size={17} />
                Download for macOS
              </Button>
              <Button href={GITHUB} variant="ghost">
                View on GitHub
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/10 py-10 text-sm text-fg-subtle">
        <div
          className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4`}
        >
          <span className="flex items-center gap-2.5 font-semibold text-fg-muted">
            <Bookmark size={16} />
            Read Control
          </span>
          <div className="flex flex-wrap gap-5">
            <a className="hover:text-fg" href={GITHUB}>
              GitHub
            </a>
            <a className="hover:text-fg" href="#features">
              Features
            </a>
            <a className="hover:text-fg" href="#how">
              Video
            </a>
            <a className="hover:text-fg" href={DOWNLOAD}>
              Download
            </a>
          </div>
          <span>© {new Date().getFullYear()} Rodrigo Boniatti</span>
        </div>
      </footer>
    </div>
  );
}
