import Link from "next/link";
import { initiatives } from "@/lib/initiatives";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-24">
      <header className="mb-14 text-center rise">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-cyan-300/70">
          // initiatives control center
        </p>
        <h1 className="title-glow mt-4 text-5xl font-bold uppercase tracking-[0.12em] sm:text-7xl">
          Crescendo Initiatives
        </h1>
        <div className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initiatives.map((it, i) => (
          <Link
            key={it.slug}
            href={`/initiatives/${it.slug}`}
            className="tile rise group flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md"
            style={{ "--accent": it.color, animationDelay: `${150 + i * 90}ms` } as React.CSSProperties}
          >
            <div className="relative flex items-center justify-end font-mono text-xs">
              <span className="flex items-center gap-2 text-white/60">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: it.color }} />
                {it.status}
              </span>
            </div>
            <div className="relative">
              <h2 className="text-2xl font-semibold leading-tight">{it.title}</h2>
              <p className="mt-2 text-sm text-white/55">{it.tagline}</p>
            </div>
            <span className="relative font-mono text-xs uppercase tracking-widest text-white/40 transition group-hover:text-white">
              Open →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
