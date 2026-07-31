"use client";

import { useEffect, useRef } from "react";

import { KEY, read, write } from "@/lib/persist";

/**
 * The tag in the letter, which is a real tag: click the word and type your
 * own, up to eight characters, the way you would in the app. Whatever you
 * name it is kept, and it is here again next time.
 *
 * It is the word itself that is editable — not a field dressed up as one — so
 * it keeps the sentence's type, sits on its baseline, and grows and shrinks
 * with whatever you type. No border, no box, no fixed width.
 */

const MAX = 8;

function selectAll(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function caretToEnd(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

/** How many characters the next insertion may add. */
function room(el: HTMLElement) {
  const sel = window.getSelection();
  const replacing = sel && !sel.isCollapsed ? sel.toString().length : 0;
  return MAX - ((el.textContent?.length ?? 0) - replacing);
}

export default function TagInput() {
  // the first click replaces the sample word; later clicks place the caret
  const untouched = useRef(true);
  const word = useRef<HTMLSpanElement>(null);

  // The word is uncontrolled — React writes it once and the reader owns it
  // after that — so a saved tag is restored straight into the DOM, after
  // hydration. An empty saved tag would leave nothing to click, so the sample
  // word stands in for it.
  useEffect(() => {
    const saved = read(KEY.tag);
    if (saved && word.current) {
      word.current.textContent = saved.slice(0, MAX);
      untouched.current = false; // their word, not the sample: keep the caret
    }
  }, []);

  return (
    <span className="whitespace-nowrap">
      <span aria-hidden="true" className="text-fg-subtle">
        #
      </span>
      <span
        ref={word}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        tabIndex={0}
        spellCheck={false}
        aria-label={`Tag name, up to ${MAX} characters`}
        onFocus={(e) => {
          if (untouched.current) selectAll(e.currentTarget);
        }}
        onBeforeInput={(e) => {
          untouched.current = false;
          const inserted = (e.nativeEvent as InputEvent).data ?? "";
          // deletions are always fine; insertions have to fit
          if (inserted && inserted.length > room(e.currentTarget)) {
            e.preventDefault();
          }
        }}
        onInput={(e) => {
          // net for browsers that will not let beforeinput be cancelled
          const el = e.currentTarget;
          let text = el.textContent ?? "";
          if (text.length > MAX) {
            text = text.slice(0, MAX);
            el.textContent = text;
            caretToEnd(el);
          }
          // every edit lands here, whatever route it took in
          write(KEY.tag, text);
        }}
        onPaste={(e) => {
          e.preventDefault();
          const free = room(e.currentTarget);
          const text = e.clipboardData
            .getData("text/plain")
            .replace(/\s+/g, "")
            .slice(0, Math.max(free, 0));
          if (text) document.execCommand("insertText", false, text);
        }}
        onKeyDown={(e) => {
          // one line, and a way out
          if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className="inline-block min-w-[2ch] cursor-text rounded-[0.2em] px-[0.1em] caret-current outline-none transition-colors duration-300 hover:bg-fg/12 focus:bg-fg/12 motion-reduce:transition-none"
      >
        tag
      </span>
    </span>
  );
}
