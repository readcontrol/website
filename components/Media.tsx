"use client";

/**
 * A media frame that shows a labelled dashed placeholder until its real image
 * exists. When the file is missing the <img> 404s and we hide it, leaving just
 * the clean placeholder; once the user drops the real file in, it loads and
 * covers the placeholder with proper alt text.
 */
export default function Media({
  src,
  alt,
  ratio,
  label,
}: {
  src: string;
  alt: string;
  ratio: "ratio-16-9" | "ratio-4-3";
  label: string;
}) {
  return (
    <div className={`media ${ratio}`} data-label={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
