import type { ReactNode } from "react";

/**
 * The pill link used for every call to action. Both variants are pure
 * utilities; the primary one is a top-lit convex gray with a reflection streak
 * (a ::before gradient) that sweeps across on hover.
 */
const BASE =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border font-medium transition active:translate-y-px";

const SIZES = {
  md: "px-5 py-2.5 text-base",
  sm: "px-4 py-2 text-sm",
};

const VARIANTS = {
  primary: [
    // gray pill on charcoal, ink pill on paper — the stops flip with the theme
    "relative isolate overflow-hidden border-line text-(color:--rc-btn-fg)",
    "bg-linear-[177deg] from-(--rc-btn-from) via-(--rc-btn-via) to-(--rc-btn-to)",
    "hover:from-(--rc-btn-from-hover) hover:via-(--rc-btn-via-hover) hover:to-(--rc-btn-to-hover)",
    "shadow-[inset_0_1px_2px_var(--rc-btn-inset),inset_0_-1px_3px_rgb(0_0_0/0.1),0_8px_22px_-10px_rgb(0_0_0/0.5)]",
    // the reflection: above the fill, below the label
    "before:absolute before:inset-0 before:-z-10 before:-translate-x-[10%]",
    "before:bg-linear-[118deg] before:from-transparent before:from-25%",
    "before:via-(--rc-btn-sheen) before:via-40% before:to-transparent before:to-60%",
    "before:transition-transform before:duration-700 hover:before:translate-x-[35%]",
    "motion-reduce:before:transition-none",
  ].join(" "),
  ghost: "border-line-strong hover:border-fg-subtle hover:bg-surface-2",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  children,
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  children: ReactNode;
}) {
  return (
    <a className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]}`} href={href}>
      {children}
    </a>
  );
}
