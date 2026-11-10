import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlockList from "@/components/BlockList";
import { getInitiative, initiatives } from "@/lib/initiatives";

export function generateStaticParams() {
  return initiatives.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const it = getInitiative((await params).slug);
  return { title: it ? `${it.title} | Crescendo Initiatives` : "Not found" };
}

const card = "rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md";

export default function InitiativePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <InitiativeContent params={params} />
    </Suspense>
  );
}

async function InitiativeContent({ params }: { params: Promise<{ slug: string }> }) {
  const it = getInitiative((await params).slug);
  if (!it) notFound();
  if (it.children) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12" style={{ "--accent": it.color } as React.CSSProperties}>
        <Link href="/" className="rise font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white">
          ← Back to dashboard
        </Link>
        <header className="rise mt-8" style={{ animationDelay: "80ms" }}>
          <span className="rounded-full border px-3 py-1 font-mono text-xs" style={{ borderColor: it.color, color: it.color }}>{it.status}</span>
          <h1 className="mt-4 text-4xl font-bold sm:text-6xl" style={{ textShadow: `0 0 40px ${it.color}66` }}>{it.title}</h1>
          <p className="mt-3 text-lg text-white/60">{it.tagline}</p>
          <div className="mt-6 h-px w-40" style={{ background: `linear-gradient(90deg, ${it.color}, transparent)` }} />
        </header>
        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          {it.children.map((c, i) => (
            <Link
              key={c.slug}
              href={`/initiatives/${it.slug}/${c.slug}`}
              className="tile rise group flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md"
              style={{ "--accent": it.color, animationDelay: `${160 + i * 90}ms` } as React.CSSProperties}
            >
              <div className="relative">
                <h2 className="text-2xl font-semibold leading-tight">{c.title}</h2>
                <p className="mt-2 text-sm text-white/55">{c.tagline}</p>
              </div>
              <span className="relative font-mono text-xs uppercase tracking-widest text-white/40 transition group-hover:text-white">Open →</span>
            </Link>
          ))}
        </section>
      </main>
    );
  }
  const idx = initiatives.indexOf(it);
  const next = initiatives[(idx + 1) % initiatives.length];

  return (
    <main
      className="mx-auto w-full max-w-5xl flex-1 px-6 py-12"
      style={{ "--accent": it.color } as React.CSSProperties}
    >
      <Link href="/" className="rise font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white">
        ← Back to dashboard
      </Link>

      <header className="rise mt-8" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="rounded-full border px-3 py-1" style={{ borderColor: it.color, color: it.color }}>
            {it.status}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold sm:text-6xl" style={{ textShadow: `0 0 40px ${it.color}66` }}>
          {it.title}
        </h1>
        <p className="mt-3 text-lg text-white/60">{it.tagline}</p>
        <div className="mt-6 h-px w-40" style={{ background: `linear-gradient(90deg, ${it.color}, transparent)` }} />
      </header>

      <section className={`${card} rise mt-10`} style={{ animationDelay: "160ms" }}>
        <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>Overview</h2>
        <p className="mt-3 leading-relaxed text-white/80">{it.overview}</p>
      </section>

      {it.why && (
        <section className={`${card} rise mt-6`} style={{ animationDelay: "200ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>Why</h2>
          <p className="mt-3 leading-relaxed text-white/80">{it.why}</p>
        </section>
      )}

      {it.finishLine && (
        <section className={`${card} rise mt-6`} style={{ animationDelay: "200ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>Finish line</h2>
          <p className="mt-3 leading-relaxed text-white/80">{it.finishLine}</p>
        </section>
      )}

      {it.howItWorks && (
        <section className={`${card} rise mt-6`} style={{ animationDelay: "200ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>How it works</h2>
          <p className="mt-3 leading-relaxed text-white/80">{it.howItWorks}</p>
        </section>
      )}

      <section className="rise mt-6 grid gap-4 sm:grid-cols-3" style={{ animationDelay: "240ms" }}>
        {it.highlights.map((h) => (
          <div key={h.label} className={card}>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">{h.label}</p>
            <p className="mt-2 text-xl font-semibold" style={{ color: it.color }}>{h.value}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {it.objectives.length > 0 && (
        <section className={`${card} rise`} style={{ animationDelay: "320ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>Objectives</h2>
          <ul className="mt-4 space-y-3">
            {it.objectives.map((o) => (
              <li key={o} className="flex gap-3 text-white/80">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: it.color }} />
                {o}
              </li>
            ))}
          </ul>
        </section>
        )}

        {it.roadmap && (
        <section className={`${card} rise`} style={{ animationDelay: "400ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>Roadmap</h2>
          <ol className="mt-4 space-y-4">
            {it.roadmap?.map((r) => (
              <li key={r.phase} className="flex gap-3">
                <span
                  className="mt-1 h-3 w-3 shrink-0 rounded-full border"
                  style={{ borderColor: it.color, background: r.done ? it.color : "transparent", boxShadow: r.done ? `0 0 10px ${it.color}` : "none" }}
                />
                <div>
                  <p className="font-medium">{r.phase}</p>
                  <p className="text-sm text-white/55">{r.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        )}
        {it.prerequisites && (
        <section className={`${card} rise`} style={{ animationDelay: "400ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>Prerequisites</h2>
          <ul className="mt-4 space-y-3">
            {it.prerequisites.map((o) => (
              <li key={o} className="flex gap-3 text-white/80">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: it.color }} />
                {o}
              </li>
            ))}
          </ul>
        </section>
        )}
      </div>

      {it.workflow && (
        <section className={`${card} rise mt-6`} style={{ animationDelay: "420ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>High-level workflow</h2>
          <ol className="mt-5 space-y-5">
            {it.workflow.map((w) => (
              <li key={w.step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-sm" style={{ borderColor: it.color, color: it.color }}>{w.step}</span>
                <div className="min-w-0">
                  <p className="font-medium">{w.title}</p>
                  <p className="text-sm text-white/60">{w.detail}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {w.tickets.map((t) => (
                      <span key={t.id} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-white/70">
                        {t.id} · {t.label} ·{" "}
                        <span style={{ color: t.status === "Done" ? "#34d399" : "rgba(255,255,255,.5)" }}>{t.status}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {it.architecture && (
        <section className={`${card} rise mt-6`} style={{ animationDelay: "440ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>{it.architecture.title ?? "Architecture"}</h2>
          {it.architecture.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={it.architecture.image} alt={it.architecture.alt ?? ""} className="mx-auto mt-4 w-full max-w-2xl rounded-xl border border-white/10" />
          )}
          <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-white/75">
            {it.architecture.flow.join("\n")}
          </pre>
        </section>
      )}

      {it.blocks && <BlockList blocks={it.blocks} color={it.color} />}

      {(it.inScope || it.outOfScope) && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[["In scope", it.inScope, it.color], ["Out of scope", it.outOfScope, "#94a3b8"]].map(([label, list, c]) =>
            list ? (
              <section key={label as string} className={`${card} rise`} style={{ animationDelay: "460ms" }}>
                <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: c as string }}>{label as string}</h2>
                <ul className="mt-4 space-y-3">
                  {(list as string[]).map((o) => (
                    <li key={o} className="flex gap-3 text-sm text-white/80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c as string }} />
                      {o}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null,
          )}
        </div>
      )}

      {it.docs && (
        <section className={`${card} rise mt-6`} style={{ animationDelay: "470ms" }}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>Docs</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75">{it.docs}</p>
        </section>
      )}

      <section className={`${card} rise mt-6`} style={{ animationDelay: "480ms" }}>
        <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: it.color }}>Tech & Tools</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {it.stack.map((s) => (
            <span key={s} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-white/75">{s}</span>
          ))}
        </div>
      </section>

      <Link href={`/initiatives/${next.slug}`} className="mt-10 block text-right font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white">
        Next: {next.title} →
      </Link>
    </main>
  );
}
