import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

/** Render trusted owner-authored Markdown (from the Sheet) to HTML. */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  return marked.parse(md, { async: false }) as string;
}
