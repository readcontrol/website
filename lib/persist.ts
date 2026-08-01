/**
 * The letter remembers what you did to it. Everything a reader can change —
 * the tag, the heart, the stars, the theme — is kept under these keys, so the
 * page comes back the way they left it.
 *
 * Storage throws when it is blocked (Safari private browsing, cookies off). A
 * letter that cannot remember is much better than a letter that will not
 * render, so both sides here swallow and carry on: the reader still gets the
 * interaction, it just does not outlive the visit.
 *
 * `KEY.theme` is also read by the inline script in app/layout.tsx, which runs
 * before React does and has to spell the key out. Change it in both places.
 */
export const KEY = {
  theme: "rc-theme",
  tag: "rc-letter-tag",
  favorite: "rc-letter-favorite",
  rating: "rc-letter-rating",
  filter: "rc-letter-filter",
} as const;

export function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // no storage: the choice still holds for this visit
  }
}
