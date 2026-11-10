"use client";
import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(110, Math.floor((w * h) / 14000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // perspective grid
      const horizon = h * 0.55;
      ctx.lineWidth = 1;
      const off = (t * 0.00006) % 1;
      for (let i = 0; i < 18; i++) {
        const p = (i + off) / 18;
        const y = horizon + Math.pow(p, 2.2) * (h - horizon);
        ctx.strokeStyle = `rgba(34,211,238,${0.04 + p * 0.14})`;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      for (let i = -14; i <= 14; i++) {
        ctx.strokeStyle = "rgba(167,139,250,0.10)";
        ctx.beginPath();
        ctx.moveTo(w / 2 + i * 20, horizon);
        ctx.lineTo(w / 2 + i * w * 0.09, h);
        ctx.stroke();
      }
      // particles + links
      for (const p of pts) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140 && d > 0) { p.x += (dx / d) * 1.2; p.y += (dy / d) * 1.2; }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(103,232,249,${0.18 * (1 - d / 130)})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(165,243,252,0.8)";
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.4, 0, 7); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const move = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#03040a]" aria-hidden>
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#03040a_100%)]" />
    </div>
  );
}
