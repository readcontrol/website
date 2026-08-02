// ESLint 10 flat config for the ReadControl landing page (Next.js 16 + TS + React).
//
// Next.js 16 removed the built-in `next lint` command, so ESLint runs directly.
// eslint-config-next ships native flat configs:
//   - core-web-vitals: Next.js + React + react-hooks + jsx-a11y + import rules,
//     with Core Web Vitals rules escalated to errors.
//   - typescript: typescript-eslint's recommended rule set.
// Together these reproduce the classic `next/core-web-vitals` + `next/typescript`
// setup. Both bundles already ignore .next/, out/, build/, and next-env.d.ts.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Two rules flag patterns this project uses on purpose — keep them visible
    // as warnings instead of failing the build:
    //  - set-state-in-effect: client-persisted state (localStorage) is read in a
    //    useEffect after mount, so the server render and first client render
    //    agree (avoids hydration mismatch).
    //  - no-img-element: the site is a static export with no image optimizer
    //    (see next.config.ts), so plain <img> tags are intentional.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
];

export default config;
