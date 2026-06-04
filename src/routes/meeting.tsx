import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell, PageHeader } from "@/components/Shell";
import { FieldLabel, PrimaryButton, ResultPanel } from "@/components/ResultPanel";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer · WorkMate AI" },
      {
        name: "description",
        content:
          "Paste meeting notes or a transcript. WorkMate extracts decisions, action items, deadlines and open questions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer · WorkMate AI" },
      {
        property: "og:description",
        content: "Turn raw meeting notes into decisions, action items, and deadlines.",
      },
      { property: "og:url", content: "https://focus-fuel-automator.lovable.app/meeting" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Meeting Notes Summarizer",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: "AI tool that extracts decisions, action items, and deadlines from meeting notes.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: MeetingPage,
});

const SAMPLE = `Q3 Planning Sync — Aug 14
Attendees: Priya (PM), Marco (Eng), Anna (Design), Dev (Sales)

- Marco said the new billing API is blocked on legal review; expects sign-off by Aug 21
- Anna will deliver high-fi mockups for onboarding by next Tuesday
- Dev raised that 3 enterprise prospects need SSO before signing — Priya to scope by end of week
- Decision: ship v2 onboarding behind feature flag; full launch deferred to Sep 5
- Open question: do we need a separate pricing tier for SSO?
- Action: Marco to set up legal review checklist
- Anna out next Friday
`;

function MeetingPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim().length < 20) {
      setErr("Paste at least a few sentences of notes.");
      return;
    }
    setLoading(true);
    setErr(null);
    setOut("");
    try {
      const res = await run({ data: { notes } });
      setOut(res.content);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <PageHeader
        eyebrow="02 · Meeting Summarizer"
        title="Notes in. Clarity out."
        description="Paste raw meeting notes or a transcript. Get a structured summary with decisions, action items, deadlines, and open questions."
      />

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <FieldLabel>Meeting notes</FieldLabel>
            <button
              type="button"
              onClick={() => setNotes(SAMPLE)}
              className="text-[11px] font-mono uppercase tracking-widest text-accent hover:underline"
            >
              Load sample
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={18}
            maxLength={20000}
            placeholder="Paste notes, bullet points, or a transcript here…"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none font-mono"
          />
          <div className="text-[11px] font-mono text-muted-foreground mt-1 text-right">
            {notes.length}/20000
          </div>
          <div className="mt-4">
            <PrimaryButton type="submit" loading={loading}>
              Summarize meeting
            </PrimaryButton>
          </div>
        </form>

        <ResultPanel
          loading={loading}
          error={err}
          content={out}
          emptyHint="Your structured summary will appear here with key decisions, action items, deadlines, and open questions."
        />
      </div>
    </Shell>
  );
}
