import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, CalendarCheck2, MessageSquare, ArrowUpRight, Shield, Zap, Brain } from "lucide-react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMate AI — Your AI workplace assistant" },
      {
        name: "description",
        content:
          "An AI productivity suite that drafts emails, summarizes meetings, plans your day, and answers workplace questions — powered by Lovable AI.",
      },
      { property: "og:title", content: "WorkMate AI — Your AI workplace assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meeting notes, plan your week, and chat with a workplace assistant.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    to: "/email",
    icon: Mail,
    label: "Smart Email Generator",
    desc: "Context-aware emails in any tone, adapted to client, manager, or team.",
    n: "01",
  },
  {
    to: "/meeting",
    icon: NotebookPen,
    label: "Meeting Summarizer",
    desc: "Turn messy notes into decisions, action items, and deadlines.",
    n: "02",
  },
  {
    to: "/planner",
    icon: CalendarCheck2,
    label: "AI Task Planner",
    desc: "Eisenhower-prioritized day or week, timeboxed and realistic.",
    n: "03",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    label: "Workplace Chatbot",
    desc: "An interactive assistant for quick questions and brainstorming.",
    n: "04",
  },
] as const;

function Home() {
  return (
    <Shell>
      <section className="pt-6 pb-16 border-b border-border">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-5">
          Productivity, automated
        </div>
        <h1 className="font-display italic text-6xl md:text-8xl leading-[0.9] tracking-tight max-w-4xl">
          Do the work that
          <br />
          actually matters.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
          WorkMate is an AI suite for the everyday workplace —{" "}
          <span className="text-foreground">draft</span>,{" "}
          <span className="text-foreground">summarize</span>,{" "}
          <span className="text-foreground">plan</span>, and{" "}
          <span className="text-foreground">decide</span> in minutes, not hours.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-5 py-3 text-sm font-semibold hover:bg-foreground/90"
          >
            Start with the assistant
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-secondary"
          >
            Try Email Generator
          </Link>
        </div>
      </section>

      <section className="py-14">
        <div className="grid md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="group bg-card p-7 hover:bg-secondary transition-colors flex flex-col gap-4 min-h-[200px]"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground tracking-widest">
                    {f.n}
                  </span>
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div className="mt-auto">
                  <h2 className="font-display italic text-3xl leading-tight mb-1.5">
                    {f.label}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                    {f.desc}
                  </p>
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-foreground inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowUpRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-12 border-t border-border grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Brain,
            title: "Engineered prompts",
            body: "Each tool ships with a tuned system prompt — outputs follow a consistent, ready-to-use structure.",
          },
          {
            icon: Zap,
            title: "Built for speed",
            body: "One screen per task, copy-ready Markdown output, no setup required.",
          },
          {
            icon: Shield,
            title: "Responsible by default",
            body: "Refuses unsafe requests, doesn't fabricate owners or dates, and asks before assuming.",
          },
        ].map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="flex gap-4">
              <Icon className="h-5 w-5 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </div>
            </div>
          );
        })}
      </section>
    </Shell>
  );
}
