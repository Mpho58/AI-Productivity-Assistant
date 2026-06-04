import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { useMemo } from "react";

marked.setOptions({ gfm: true, breaks: true });

export function Markdown({ text }: { text: string }) {
  const html = useMemo(() => {
    const rendered = marked.parse(text) as string;
    return DOMPurify.sanitize(rendered, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
      FORBID_ATTR: ["style", "onerror", "onload", "onclick"],
    });
  }, [text]);
  return (
    <div
      className="prose-workmate text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
