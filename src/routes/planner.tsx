import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell, PageHeader } from "@/components/Shell";
import { FieldLabel, PrimaryButton, ResultPanel } from "@/components/ResultPanel";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner · WorkMate AI" },
      {
        name: "description",
        content:
          "Drop in your tasks. Get a prioritized, timeboxed daily or weekly plan with realistic focus blocks.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<"day" | "week">("day");
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tasks.trim().length < 5) {
      setErr("Add at least one task.");
      return;
    }
    setLoading(true);
    setErr(null);
    setOut("");
    try {
      const res = await run({ data: { tasks, horizon, hoursPerDay } });
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
        eyebrow="03 · AI Task Planner"
        title="A plan you'll actually follow."
        description="List what's on your plate. WorkMate prioritizes with the Eisenhower matrix and builds a timeboxed schedule that respects your focus hours."
      />

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-5 space-y-5">
          <div>
            <FieldLabel>Tasks (one per line)</FieldLabel>
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={12}
              maxLength={5000}
              placeholder={"Finish Q3 board deck — due Thursday\nReview hiring loop for senior engineer\nReply to legal on data-processing addendum\n1:1s with team\nDeep work: rewrite onboarding flow"}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none font-mono"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Horizon</FieldLabel>
              <div className="flex gap-1.5">
                {(["day", "week"] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHorizon(h)}
                    className={
                      "flex-1 px-3 py-2 rounded-md text-xs font-medium capitalize border transition-colors " +
                      (horizon === h
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background border-border hover:border-foreground/40")
                    }
                  >
                    {h === "day" ? "Today" : "This week"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Focus hours / day · {hoursPerDay}h</FieldLabel>
              <input
                type="range"
                min={1}
                max={12}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>
          </div>

          <PrimaryButton type="submit" loading={loading}>
            Build my plan
          </PrimaryButton>
        </form>

        <ResultPanel
          loading={loading}
          error={err}
          content={out}
          emptyHint="Your prioritized plan and timeboxed schedule will appear here."
        />
      </div>
    </Shell>
  );
}
