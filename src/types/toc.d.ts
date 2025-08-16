import type { MarkdownHeading } from "astro";

export type RecursiveHeading =
  | {
      kind: "shadow";
      inner: RecursiveHeading[];
    }
  | (MarkdownHeading & {
      kind: "heading";
      inner: RecursiveHeading[];
    });
