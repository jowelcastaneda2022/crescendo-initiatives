import type { Block } from "@/lib/initiatives";

const card = "rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md";

export default function BlockList({ blocks, color }: { blocks: Block[]; color: string }) {
  return (
    <>
      {blocks.map((b) => (
        <section key={b.title} className={`${card} rise mt-6`}>
          <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: color }}>{b.title}</h2>
          {b.intro && <p className="mt-3 text-sm leading-relaxed text-white/70">{b.intro}</p>}
          {b.type === "table" && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 font-mono text-xs uppercase tracking-widest text-white/40">
                    {b.columns.map((c) => <th key={c} className="py-2 pr-4 font-normal">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((r) => (
                    <tr key={r[0]} className="border-b border-white/5 align-top last:border-0">
                      {r.map((c, k) => <td key={k} className={`py-2.5 pr-4 ${k === 0 ? "font-medium text-white" : "text-white/70"}`}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {b.type === "list" && (
            <ul className="mt-4 space-y-3">
              {b.items.map((o) => (
                <li key={o} className="flex gap-3 text-sm text-white/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                  {o}
                </li>
              ))}
            </ul>
          )}
          {b.type === "steps" && (
            <>
              {b.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.image.src} alt={b.image.alt} className="mt-4 w-full rounded-xl bg-white" />
              )}
              <ol className="mt-5 space-y-4">
                {b.steps.map((st, n) => (
                  <li key={st.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-sm" style={{ borderColor: color, color: color }}>{n + 1}</span>
                    <div>
                      <p className="font-medium">{st.title}</p>
                      <p className="text-sm text-white/60">{st.detail}</p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/35">{st.lane}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
      ))}
    </>
  );
}
