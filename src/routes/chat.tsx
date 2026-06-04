import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Shell, PageHeader } from "@/components/Shell";
import { Markdown } from "@/components/Markdown";
import { chat } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Workplace Chatbot · WorkMate AI" },
      {
        name: "description",
        content:
          "An interactive AI assistant for everyday workplace questions — brainstorming, writing, research, and quick answers.",
      },
      { property: "og:title", content: "Workplace Chatbot · WorkMate AI" },
      {
        property: "og:description",
        content: "Interactive AI assistant for workplace questions, brainstorming, and quick answers.",
      },
      { property: "og:url", content: "https://focus-fuel-automator.lovable.app/chat" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Workplace Chatbot",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: "Interactive AI workplace assistant for brainstorming, writing, and quick answers.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prep 3 sharp questions for a 1:1 with my manager",
  "Explain OKRs vs KPIs in two short paragraphs",
  "Draft a polite decline to a meeting invite that has no agenda",
  "Summarize the pros and cons of async standups",
];

function ChatPage() {
  const run = useServerFn(chat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setErr(null);
    try {
      const res = await run({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <PageHeader
        eyebrow="04 · Workplace Chatbot"
        title="Ask. Refine. Ship."
        description="A real-time assistant that remembers the thread. Use it to brainstorm, rewrite, research, and plan — without leaving the page."
      />

      <div className="rounded-xl border border-border bg-card flex flex-col h-[70vh] min-h-[520px]">
        <div className="flex items-center justify-between px-4 h-12 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              WorkMate Assistant
            </span>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setErr(null);
              }}
              className="text-xs inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New chat
            </button>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <p className="font-display italic text-3xl mb-2">How can I help?</p>
              <p className="text-sm text-muted-foreground mb-6">
                Try one of these, or ask anything work-related.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-left text-sm rounded-md border border-border bg-background hover:bg-secondary px-3 py-2.5 leading-snug transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={
                "flex " + (m.role === "user" ? "justify-end" : "justify-start")
              }
            >
              <div
                className={
                  "max-w-[85%] rounded-xl px-4 py-3 text-sm " +
                  (m.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground border border-border")
                }
              >
                {m.role === "assistant" ? <Markdown text={m.content} /> : m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-secondary border border-border px-4 py-3 text-sm inline-flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                Thinking…
              </div>
            </div>
          )}

          {err && (
            <div className="text-sm text-destructive bg-destructive/5 border border-destructive/30 rounded-md p-3">
              {err}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3 flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={8000}
            placeholder="Message WorkMate… (Shift+Enter for newline)"
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 max-h-40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Shell>
  );
}
