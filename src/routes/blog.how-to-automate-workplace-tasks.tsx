import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/Shell";
import { Mail, NotebookPen, CalendarCheck2, MessageSquare, ArrowRight } from "lucide-react";

const CANONICAL = "https://focus-fuel-automator.lovable.app/blog/how-to-automate-workplace-tasks";

export const Route = createFileRoute("/blog/how-to-automate-workplace-tasks")({
  head: () => ({
    meta: [
      { title: "How to Automate Your Workplace Tasks With AI (2026 Guide)" },
      {
        name: "description",
        content:
          "A practical, tool-by-tool guide to automating routine workplace tasks with AI — email drafting, meeting summaries, task planning, and chat. Save 5–8 hours a week.",
      },
      { property: "og:title", content: "How to Automate Your Workplace Tasks With AI" },
      {
        property: "og:description",
        content:
          "A practical guide to AI productivity tools that handle email, meetings, and task planning so you can focus on real work.",
      },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to Automate Your Workplace Tasks With AI",
          description:
            "A practical, tool-by-tool guide to automating routine workplace tasks with AI productivity tools.",
          author: { "@type": "Organization", name: "WorkMate AI" },
          publisher: { "@type": "Organization", name: "WorkMate AI" },
          datePublished: "2026-06-04",
          dateModified: "2026-06-04",
          mainEntityOfPage: CANONICAL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to automate your workplace tasks with AI",
          step: [
            { "@type": "HowToStep", name: "Audit your week", text: "Track repeating tasks for 3 days to spot what AI can take over." },
            { "@type": "HowToStep", name: "Automate email drafting", text: "Use an AI email generator to draft replies in your tone." },
            { "@type": "HowToStep", name: "Summarize meetings", text: "Convert raw notes into decisions, action items, and deadlines." },
            { "@type": "HowToStep", name: "Plan your day", text: "Let an AI planner prioritize tasks into a timeboxed schedule." },
            { "@type": "HowToStep", name: "Use a workplace chatbot", text: "Ask an assistant for quick answers, rewrites, and brainstorming." },
          ],
        }),
      },
    ],
  }),
  component: BlogPost,
});

function ToolCard({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: "/email" | "/meeting" | "/planner" | "/chat";
  icon: typeof Mail;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-border bg-card p-5 flex items-start gap-4 hover:border-foreground/40 transition-colors"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}

function BlogPost() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Guide · 8 min read"
        title="How to automate your workplace tasks with AI."
        description="A practical, no-fluff playbook for using AI productivity tools to take over the routine work that fills your calendar — email, meetings, planning, and quick questions."
      />

      <article className="prose prose-invert max-w-3xl mx-auto">
        <section className="text-base leading-relaxed text-foreground/90 space-y-4">
          <p>
            The average knowledge worker loses{" "}
            <strong>more than 8 hours a week</strong> to repetitive admin: drafting the
            same kind of emails, writing meeting recaps, rebuilding to-do lists, and
            answering questions a colleague has already answered. That work isn't
            valuable, but it's expensive — it crowds out the thinking that actually
            moves projects forward.
          </p>
          <p>
            AI productivity tools have finally matured to the point where you can hand
            most of it off. This guide walks through the five steps we recommend, with
            the exact category of tool to use at each step.
          </p>
        </section>

        <h2 className="mt-12 font-display italic text-3xl">Step 1 — Audit your week</h2>
        <p className="text-foreground/90 leading-relaxed">
          Before automating anything, spend three working days writing down every
          repeating task that takes more than five minutes. Look for patterns:
          status updates, intro emails, weekly planning, meeting recaps,
          re-explaining the same project context. Those are your candidates.
        </p>
        <ul className="list-disc pl-6 text-foreground/90 space-y-1.5 marker:text-accent">
          <li>Anything you write from a template → email automation.</li>
          <li>Anything that turns a transcript into a list → meeting summarizer.</li>
          <li>Anything that starts with "what should I work on today?" → AI planner.</li>
          <li>Anything you'd normally ask a coworker → workplace chatbot.</li>
        </ul>

        <h2 className="mt-12 font-display italic text-3xl">
          Step 2 — Automate email drafting
        </h2>
        <p className="text-foreground/90 leading-relaxed">
          Email is the single highest-leverage thing to automate. A good AI email
          generator takes a one-line brief ("decline politely, suggest next month")
          plus the tone you want and produces a ready-to-send draft in seconds.
          The trick is to be specific about audience and tone — a draft to your
          manager reads nothing like one to a vendor.
        </p>
        <p className="text-foreground/90 leading-relaxed">
          Time saved per week: <strong>2–3 hours</strong> for most managers.
        </p>

        <h2 className="mt-12 font-display italic text-3xl">
          Step 3 — Summarize every meeting
        </h2>
        <p className="text-foreground/90 leading-relaxed">
          Meeting notes are usually written by the most senior person in the room,
          and they're usually written badly. A meeting summarizer takes raw notes
          or a transcript and pulls out four things: decisions made, action items
          with owners, deadlines, and open questions. That structured output is
          what you actually paste into Slack or a project doc.
        </p>

        <h2 className="mt-12 font-display italic text-3xl">
          Step 4 — Plan your day in one paste
        </h2>
        <p className="text-foreground/90 leading-relaxed">
          Drop a flat list of everything on your plate into an AI task planner.
          A good one applies the Eisenhower matrix (urgent × important), respects
          your focus hours, and produces a timeboxed schedule — not just a
          prioritized list. The big win is realism: it won't try to cram 11 hours
          of deep work into a 6-hour day.
        </p>

        <h2 className="mt-12 font-display italic text-3xl">
          Step 5 — Add a workplace chatbot
        </h2>
        <p className="text-foreground/90 leading-relaxed">
          The last 20% of automation is the random questions: "what's a good
          subject line for this?", "rewrite this paragraph to be shorter", "what
          should I ask in a 1:1 with a new report?". A general workplace
          assistant handles all of these without context-switching to a separate
          app.
        </p>

        <h2 className="mt-12 font-display italic text-3xl">
          Try it now — WorkMate's four tools
        </h2>
        <p className="text-foreground/90 leading-relaxed">
          WorkMate AI bundles the four tools above into a single workspace, with
          engineered prompts tuned for ready-to-use output. Each one is free to
          try with no signup.
        </p>

        <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
          <ToolCard
            to="/email"
            icon={Mail}
            title="Smart Email Generator"
            desc="Draft professional emails in any tone for clients, managers, or teammates."
          />
          <ToolCard
            to="/meeting"
            icon={NotebookPen}
            title="Meeting Notes Summarizer"
            desc="Turn raw notes into decisions, action items, and deadlines."
          />
          <ToolCard
            to="/planner"
            icon={CalendarCheck2}
            title="AI Task Planner"
            desc="Prioritized daily or weekly plans with realistic focus blocks."
          />
          <ToolCard
            to="/chat"
            icon={MessageSquare}
            title="Workplace Chatbot"
            desc="An interactive assistant for workplace questions and brainstorming."
          />
        </div>

        <h2 className="mt-12 font-display italic text-3xl">A note on responsible use</h2>
        <p className="text-foreground/90 leading-relaxed">
          Automation works best when there's still a human in the loop. Review
          drafts before sending, double-check action items against the source
          transcript, and never paste confidential customer data into a tool
          unless your organization has approved it. AI is a force multiplier, not
          a replacement for judgment.
        </p>

        <p className="text-foreground/90 leading-relaxed mt-8">
          Pick one workflow above, automate it this week, and measure the time
          back. Most teams find they save a full workday in the first month.
        </p>
      </article>
    </Shell>
  );
}
