import WavingFlag from "@/components/WavingFlag";
import PromoVideo from "@/components/PromoVideo";
import Media from "@/components/Media";
import {
  Bookmark,
  Check,
  FEATURES,
  EXTRAS,
  NON_FEATURES,
} from "@/lib/content";

const GITHUB = "https://github.com/boniattirodrigo/readcontrol-main";
const DOWNLOAD = "#download"; // placeholder until a build is published

export default function Home() {
  return (
    <>
      {/* ---------- Nav ---------- */}
      <header className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#top">
            <Bookmark size={20} />
            Read Control
          </a>
          <nav className="nav-actions">
            <a className="btn btn-ghost btn-sm" href={GITHUB}>
              GitHub
            </a>
            <a className="btn btn-primary btn-sm" href={DOWNLOAD}>
              Download
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ---------- Hero ---------- */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Local-first · macOS</p>
              <h1>
                Save the web.
                <br />
                Read it later.
              </h1>
              <p className="hero-lede">
                Clip any page to a clean Markdown file you own — then read it in a
                calm native app.
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href={DOWNLOAD}>
                  <Bookmark size={17} />
                  Download for macOS
                </a>
                <a className="btn btn-ghost" href="#how">
                  See how it works
                </a>
              </div>
              <p className="hero-note">Free · open source · no account needed</p>
            </div>
            <div className="flag-stage">
              <WavingFlag />
            </div>
          </div>
        </section>

        {/* ---------- Trust strip ---------- */}
        <div className="strip">
          <div className="container strip-inner">
            {NON_FEATURES.map((n) => (
              <span key={n}>
                <Check size={15} />
                <b>{n}</b>
              </span>
            ))}
          </div>
        </div>

        {/* ---------- Video ---------- */}
        <section className="section" id="how">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Watch</p>
              <h2>See it in 60 seconds</h2>
              <p>Save from the browser, read in the app.</p>
            </div>
            <div className="video-wrap">
              <PromoVideo />
            </div>
          </div>
        </section>

        {/* ---------- Feature rows ---------- */}
        <section className="section" id="features" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Features</p>
              <h2>Everything, on your disk</h2>
            </div>

            {FEATURES.map((f, i) => (
              <article
                key={f.title}
                className={`feature-row${i % 2 === 1 ? " reverse" : ""}`}
              >
                <div className="feature-media">
                  <Media
                    src={f.image}
                    alt={f.title}
                    ratio={f.ratio}
                    label={`Image — ${f.image}`}
                  />
                </div>
                <div className="feature-copy">
                  <p className="eyebrow">{f.eyebrow}</p>
                  <h3>{f.title}</h3>
                  <p className="lead">{f.lead}</p>
                  <ul className="feature-list">
                    {f.bullets.map((b) => (
                      <li key={b}>
                        <Check />
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
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">And more</p>
              <h2>Small touches that add up</h2>
            </div>
            <div className="grid-features">
              {EXTRAS.map((e) => (
                <div className="card" key={e.title}>
                  <span className="ico">
                    <Bookmark size={18} />
                  </span>
                  <h4>{e.title}</h4>
                  <p>{e.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="cta" id="download">
          <div className="container">
            <h2>Your reading list, on your terms.</h2>
            <p>
              Plain files. No accounts. No servers. Save a page and it&apos;s
              yours to keep.
            </p>
            <div className="cta-actions">
              <a className="btn btn-primary" href={DOWNLOAD}>
                <Bookmark size={17} />
                Download for macOS
              </a>
              <a className="btn btn-ghost" href={GITHUB}>
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="brand" style={{ color: "var(--text-secondary)" }}>
            <Bookmark size={16} />
            Read Control
          </span>
          <div className="footer-links">
            <a href={GITHUB}>GitHub</a>
            <a href="#features">Features</a>
            <a href="#how">Video</a>
            <a href={DOWNLOAD}>Download</a>
          </div>
          <span>© {new Date().getFullYear()} Rodrigo Boniatti</span>
        </div>
      </footer>
    </>
  );
}
