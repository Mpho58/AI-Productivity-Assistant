import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(system: string, user: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to your Lovable workspace.");
  if (!res.ok) {
    const t = await res.text();
    console.error("AI gateway error:", res.status, t);
    throw new Error("The AI service returned an error. Please try again.");
  }
  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string) ?? "";
}

// Email Generator
export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      purpose: z.string().min(3).max(2000),
      audience: z.enum(["client", "manager", "team", "vendor", "candidate"]),
      tone: z.enum(["formal", "informal", "persuasive", "apologetic", "concise"]),
      sender: z.string().max(120).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are an expert business communication writer. Produce ready-to-send emails.
Return ONLY the email in this exact format:
Subject: <subject line>

<email body>

— Do not add preamble or explanations.
— Keep paragraphs short and skimmable.
— Match the requested tone precisely.
— Be culturally neutral and professional. Never include sensitive personal data you weren't given.`;
    const user = `Write an email for the following.
Audience: ${data.audience}
Tone: ${data.tone}
${data.sender ? `Signed by: ${data.sender}` : ""}
Purpose / context:
${data.purpose}`;
    const content = await callAI(system, user);
    return { content };
  });

// Meeting Notes Summarizer
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(20).max(20000) }))
  .handler(async ({ data }) => {
    const system = `You are an executive assistant that turns raw meeting notes into structured, accurate summaries.
Return Markdown with these exact sections (omit a section only if truly empty):
## Summary
A 2-4 sentence overview.
## Key Decisions
- bullet list
## Action Items
- [ ] Owner — Task — Deadline (if known)
## Deadlines
- Date — what is due
## Open Questions
- bullet list
Be faithful to the source; do not invent owners, dates, or decisions.`;
    const content = await callAI(system, `Meeting notes:\n\n${data.notes}`);
    return { content };
  });

// Task Planner
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(5).max(5000),
      horizon: z.enum(["day", "week"]),
      hoursPerDay: z.number().min(1).max(16).default(8),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are a productivity coach using the Eisenhower matrix and timeboxing.
Given a raw list of tasks, produce a realistic ${data.horizon === "day" ? "single-day" : "5-day weekly"} plan.
Return Markdown with:
## Prioritization (Eisenhower)
A compact table: Task | Urgency | Importance | Quadrant (Do / Schedule / Delegate / Drop)
## ${data.horizon === "day" ? "Today's Schedule" : "Weekly Schedule"}
Time-blocked plan assuming ${data.hoursPerDay} focused hours/day, including breaks and one buffer block.
## Optimization Tips
3-5 concrete suggestions (batching, deep work blocks, meeting hygiene, etc.) tailored to these tasks.
Be realistic; do not overpack the schedule.`;
    const content = await callAI(system, `Tasks:\n${data.tasks}`);
    return { content };
  });

// Chatbot
export const chat = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().min(1).max(8000),
          }),
        )
        .min(1)
        .max(40),
    }),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY is not configured");
    const system = `You are WorkMate, a helpful workplace AI assistant.
- Be concise, practical, and friendly.
- Use Markdown (lists, bold) when it aids clarity.
- If a request is ambiguous, ask ONE focused clarifying question.
- Decline requests that are unethical, illegal, or involve confidential data you weren't given.
- Never fabricate facts; say when you don't know.`;
    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });
    if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to your Lovable workspace.");
    if (!res.ok) throw new Error("The AI service returned an error.");
    const json = await res.json();
    return { content: (json.choices?.[0]?.message?.content as string) ?? "" };
  });
