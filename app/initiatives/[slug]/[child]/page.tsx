import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInitiative, initiatives } from "@/lib/initiatives";

export function generateStaticParams() {
  return initiatives.flatMap((i) => (i.children ?? []).map((c) => ({ slug: i.slug, child: c.slug })));
}

type P = { params: Promise<{ slug: string; child: string }> };

export default function ChildPage({ params }: P) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <ChildContent params={params} />
    </Suspense>
  );
}

async function ChildContent({ params }: P) {
  const { slug, child } = await params;
  const it = getInitiative(slug);
  const c = it?.children?.find((x) => x.slug === child);
  if (!it || !c) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Link href={`/initiatives/${it.slug}`} className="rise font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white">
        ← Back to {it.title}
      </Link>
      <header className="rise mt-8" style={{ animationDelay: "80ms" }}>
        <p className="font-mono text-xs" style={{ color: it.color }}>{it.title}</p>
        <h1 className="mt-4 text-4xl font-bold sm:text-6xl" style={{ textShadow: `0 0 40px ${it.color}66` }}>{c.title}</h1>
        <p className="mt-3 text-lg text-white/60">{c.tagline}</p>
        <div className="mt-6 h-px w-40" style={{ background: `linear-gradient(90deg, ${it.color}, transparent)` }} />
      </header>
      <section className="rise mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md" style={{ animationDelay: "160ms" }}>
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">Details coming soon</p>
      </section>
    </main>
  );
}
