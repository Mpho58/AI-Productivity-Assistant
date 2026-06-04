import { marked } from "marked";
import { useMemo } from "react";

marked.setOptions({ gfm: true, breaks: true });

export function Markdown({ text }: { text: string }) {
  const html = useMemo(() => marked.parse(text) as string, [text]);
  return (
    <div
      className="prose-workmate text-foreground"
      // marked output, server-generated text, sanitized prompts on backend
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
