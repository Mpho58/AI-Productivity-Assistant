import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Mail, NotebookPen, CalendarCheck2, MessageSquare, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/email", label: "Email", icon: Mail },
  { to: "/meeting", label: "Meeting", icon: NotebookPen },
  { to: "/planner", label: "Planner", icon: CalendarCheck2 },
  { to: "/chat", label: "Chat", icon: MessageSquare },
] as const;

export function Shell({ children }: { children?: ReactNode }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-background bg-grain">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display italic text-2xl leading-none">WorkMate</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
              AI
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={
                    "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors " +
                    (active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary")
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="md:hidden border-t border-border/70 px-3 py-2 flex gap-1 overflow-x-auto">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = loc.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 " +
                  (active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary")
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children ?? <Outlet />}</main>
      <footer className="mx-auto max-w-6xl px-5 py-10 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
        <span>WorkMate AI · Productivity, automated responsibly.</span>
        <span className="font-mono">v1.0 · Lovable AI</span>
      </footer>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-3">
        {eyebrow}
      </div>
      <h1 className="font-display italic text-5xl md:text-6xl leading-[0.95] tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}
