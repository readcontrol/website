import type { ReactNode } from "react";
import type { AspectRatio } from "@/lib/content";

/**
 * The bordered, rounded frame every image and the promo video sit in. It always
 * renders the striped placeholder + label underneath, so a media file that is
 * still missing leaves something clean and self-describing on the page.
 */
export default function MediaFrame({
  ratio,
  label,
  children,
}: {
  ratio: AspectRatio;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-line bg-surface-2 shadow-2xl ${ratio}`}
    >
      <span className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,var(--color-surface-2)_0_12px,var(--color-surface)_12px_24px)] p-6 text-center text-sm tracking-wide text-fg-subtle">
        {label}
      </span>
      {children}
    </div>
  );
}
