import type { ReactNode } from "react";

/**
 * The questions people ask before they download, at the foot of the page. Each
 * row is a native <details> disclosure — no JavaScript, open one and it stays
 * open, and the chevron turns over. The column lines up with the letter above.
 */

const GITHUB = "https://github.com/boniattirodrigo/readcontrol-main";

/** Handed to an AI so a non-developer can have the code audited for them. */
const REVIEW_PROMPT =
  `Please review the source code of Read Control, an open-source macOS app, ` +
  `at ${GITHUB}. Is it safe to run? Look for anything that sends my data off ` +
  `my machine, hidden telemetry, unexpected network calls, or otherwise ` +
  `suspicious behaviour, and give me a plain-language verdict.`;

/** Chat links that open with the review prompt already typed in. */
const REVIEW_WITH = {
  chatgpt: `https://chatgpt.com/?q=${encodeURIComponent(REVIEW_PROMPT)}`,
  claude: `https://claude.ai/new?q=${encodeURIComponent(REVIEW_PROMPT)}`,
};

/** A link that matches the letter's understated underline-on-hover style. */
function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-fg underline decoration-line-strong underline-offset-2 transition-colors hover:decoration-fg-subtle motion-reduce:transition-none"
    >
      {children}
    </a>
  );
}

const QUESTIONS: { q: string; a: ReactNode }[] = [
  {
    q: "How much does the app cost?",
    a: (
      <>
        Nothing. Read Control is free and open-source — no account, no
        subscription, no trial. You can read every line of it on{" "}
        <Link href={GITHUB}>GitHub</Link>.
      </>
    ),
  },
  {
    q: "Which macOS versions are supported?",
    a: (
      // TODO: confirm the minimum macOS version and replace the bracket below.
      <>
        Read Control is a native macOS app. [Add the minimum supported version
        here — e.g. macOS 13 Ventura or later.]
      </>
    ),
  },
  {
    q: "Which browsers does the extension support?",
    a: (
      // TODO: confirm the supported browsers and replace the bracket below.
      <>
        Saving pages is done through a browser extension. [List the supported
        browsers here — e.g. Chrome, Edge, Firefox, and Safari.]
      </>
    ),
  },
  {
    q: "How do I know the app is safe to run?",
    a: (
      <>
        It&apos;s fully open-source, so you — or anyone — can audit exactly what
        it does on <Link href={GITHUB}>GitHub</Link>. Or have an AI read the code
        for you:{" "}
        <Link href={REVIEW_WITH.chatgpt}>review it with ChatGPT</Link> or{" "}
        <Link href={REVIEW_WITH.claude}>review it with Claude</Link>.
      </>
    ),
  },
  {
    q: "Can I install it on my iPhone?",
    a: <>Not for now.</>,
  },
  {
    q: "Is there a Windows or Linux version?",
    a: (
      <>
        Not yet. Read Control&apos;s engine is written in Rust, so we can reuse a
        good chunk of the logic and build other UIs on top for different
        operating systems.
      </>
    ),
  },
];

/** The chevron beside each question, turned over while the row is open. */
function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
    >
      <path
        d="m5 9 7 7 7-7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Faq() {
  return (
    <section className="pb-20 md:pb-26 lg:pb-32" id="faq">
      <div className="mx-auto w-full max-w-[40rem] px-6 pt-16 md:pt-20 lg:pt-24">
        <p className="text-xs font-semibold tracking-widest text-fg-subtle uppercase">
          Questions
        </p>

        <div className="mt-8">
          {QUESTIONS.map(({ q, a }) => (
            <details
              key={q}
              className="group border-b border-line first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-medium text-fg [&::-webkit-details-marker]:hidden">
                {q}
                <Chevron />
              </summary>
              <p className="pb-5 text-base leading-[1.7] text-fg-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
