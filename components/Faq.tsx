import type { ReactNode } from "react";

/**
 * The questions people ask before they download, at the foot of the page. Each
 * row is a native <details> disclosure — no JavaScript, open one and it stays
 * open, and the chevron turns over. The column lines up with the letter above.
 */

const GITHUB =
  "https://github.com/readcontrol/root?utm_source=readcontrol.app";

/** Handed to an AI so a non-developer can have the code audited for them. */
const REVIEW_PROMPT =
  `Please review the source code of ReadControl, an open-source macOS app, ` +
  `at ${GITHUB}. Is it safe to run? Look for anything that sends my data off ` +
  `my machine, unexpected network calls, or otherwise ` +
  `suspicious behaviour, and give me a plain-language verdict.`;

/** Chat link that opens with the review prompt already typed in. */
const REVIEW_WITH = {
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
        Nothing. ReadControl is free and open-source, no account, no
        subscription, no trial. You can read every line of it on{" "}
        <Link href={GITHUB}>GitHub</Link>.
      </>
    ),
  },
  {
    q: "Which macOS versions are supported?",
    a: <>ReadControl requires macOS 14 Sonoma or later.</>,
  },
  {
    q: "Which browsers does the extension support?",
    a: (
      <>
        The browser extension works on Chrome 120+, Edge 120+, and Firefox
        115+. Safari is not supported yet.
      </>
    ),
  },
  {
    q: "How do I know the app is safe to run?",
    a: (
      <>
        It&apos;s fully open-source, so you can audit exactly what it does on{" "}
        <Link href={GITHUB}>GitHub</Link>. Ask{" "}
        <Link href={REVIEW_WITH.claude}>Claude</Link> for a review. Keep in mind
        this project is still in beta.
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
        Not yet. ReadControl&apos;s engine is written in Rust, so we can reuse a
        good chunk of the logic and build other UIs on top for different
        operating systems.
      </>
    ),
  },
  {
    q: "I found a bug, where do I report?",
    a: (
      <>
        DM <Link href="https://x.com/boniattirodrigo?utm_source=readcontrol.app">@boniattirodrigo</Link> on X.
      </>
    ),
  },
  {
    q: "Does the app collect any of my data?",
    a: (
      <>
        No. ReadControl doesn&apos;t collect any of your data, no analytics, no
        accounts, no tracking. Everything you save stays on your Mac. The only
        network request it makes is checking for a new version.
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
      <div className="mx-auto w-full max-w-[40rem] px-6 pt-4 md:pt-6 lg:pt-10">
        <p className="text-xs font-semibold tracking-widest text-fg-subtle uppercase">
          Questions
        </p>

        <div className="mt-4">
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
