import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell, PageHeader } from "@/components/Shell";
import { FieldLabel, PrimaryButton, ResultPanel } from "@/components/ResultPanel";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator · WorkMate AI" },
      {
        name: "description",
        content:
          "Generate professional emails in any tone, adapted to your audience — clients, managers, teammates and more.",
      },
      { property: "og:title", content: "Smart Email Generator · WorkMate AI" },
      {
        property: "og:description",
        content: "Draft professional emails in any tone, tuned for clients, managers, or teammates.",
      },
      { property: "og:url", content: "https://focus-fuel-automator.lovable.app/email" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Smart Email Generator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: "AI-powered email drafting tool that adapts tone to your audience.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: EmailPage,
});

const AUDIENCES = ["client", "manager", "team", "vendor", "candidate"] as const;
const TONES = ["formal", "informal", "persuasive", "apologetic", "concise"] as const;

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("client");
  const [tone, setTone] = useState<(typeof TONES)[number]>("formal");
  const [sender, setSender] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (purpose.trim().length < 3) {
      setErr("Tell me a bit more about the email.");
      return;
    }
    setLoading(true);
    setErr(null);
    setOut("");
    try {
      const res = await run({ data: { purpose, audience, tone, sender: sender || undefined } });
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
        eyebrow="01 · Smart Email Generator"
        title="Write the email, faster."
        description="Describe what the email is about. Choose audience and tone. WorkMate drafts a ready-to-send message you can copy in one click."
      />

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-border bg-card p-5">
          <div>
            <FieldLabel>What is the email about?</FieldLabel>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={6}
              maxLength={2000}
              placeholder="e.g. Follow up with Acme after our demo on Tuesday. Confirm next steps, propose a pricing call next week, and attach the proposal."
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none"
            />
            <div className="text-[11px] font-mono text-muted-foreground mt-1 text-right">
              {purpose.length}/2000
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Audience</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {AUDIENCES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAudience(a)}
                    className={
                      "px-2.5 py-1.5 rounded-md text-xs font-medium capitalize border transition-colors " +
                      (audience === a
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background border-border hover:border-foreground/40")
                    }
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Tone</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={
                      "px-2.5 py-1.5 rounded-md text-xs font-medium capitalize border transition-colors " +
                      (tone === t
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-background border-border hover:border-foreground/40")
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <FieldLabel>Signed by (optional)</FieldLabel>
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              maxLength={120}
              placeholder="e.g. Priya, Head of Sales"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <PrimaryButton type="submit" loading={loading}>
            Generate email
          </PrimaryButton>
        </form>

        <ResultPanel
          loading={loading}
          error={err}
          content={out}
          emptyHint="Your drafted email will appear here. Fill in the brief and click Generate."
        />
      </div>
    </Shell>
  );
}
