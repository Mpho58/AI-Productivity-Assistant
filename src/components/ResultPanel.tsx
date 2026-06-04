import { useState } from "react";
import { Loader2, Copy, Check } from "lucide-react";
import { Markdown } from "./Markdown";

export function ResultPanel({
  loading,
  error,
  content,
  emptyHint,
}: {
  loading: boolean;
  error: string | null;
  content: string;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card min-h-[400px] flex flex-col">
      <div className="flex items-center justify-between px-4 h-11 border-b border-border">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Output
        </span>
        {content && !loading && (
          <button
            type="button"
            onClick={copy}
            className="text-xs font-medium inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <div className="flex-1 p-5 overflow-auto">
        {loading && (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <span className="font-mono text-xs uppercase tracking-widest">Thinking…</span>
          </div>
        )}
        {!loading && error && (
          <div className="text-sm text-destructive bg-destructive/5 border border-destructive/30 rounded-md p-3">
            {error}
          </div>
        )}
        {!loading && !error && !content && (
          <div className="h-full min-h-[300px] flex items-center justify-center text-center text-muted-foreground text-sm max-w-sm mx-auto">
            {emptyHint}
          </div>
        )}
        {!loading && !error && content && <Markdown text={content} />}
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground block mb-1.5">
      {children}
    </label>
  );
}

export function PrimaryButton({
  loading,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground text-background px-4 py-2.5 text-sm font-semibold hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
