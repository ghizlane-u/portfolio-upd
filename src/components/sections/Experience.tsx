"use client";
import { useMemo, useRef } from "react";
import { useContent } from "@/lib/content";
import { useScrollProgress } from "@/lib/hooks";

type Stop = { id: string; kind: string; period: string; title: string; place: string; detail?: string; order: number };

export default function Experience() {
  const { EDUCATION, EXPERIENCE, ui } = useContent();
  const t = ui.exp;
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref);

  const stops = useMemo<Stop[]>(() => {
    const order: Record<string, number> = { bac: 2020, arkx: 2024.0, odoo: 2024.4, licence: 2024.7, fstm: 2025.3, master: 2025.7 };
    const edu = EDUCATION.map((e) => ({ id: e.id, kind: t.edu, period: e.period, title: e.title, place: e.place, order: order[e.id] }));
    const exp = EXPERIENCE.map((e) => ({
      id: e.id, kind: t.job, period: e.period, title: e.title, place: e.place, detail: e.bullets[0], order: order[e.id],
    }));
    return [...edu, ...exp].sort((a, b) => a.order - b.order);
  }, [EDUCATION, EXPERIENCE, t]);

  const n = stops.length + 1; // + carte finale
  return (
    <section id="experience" className="section exp" aria-labelledby="exp-h">
      <div className="wrap">
        <span className="tag rv">{t.tag}</span>
        <h2 id="exp-h" className="h2" style={{ maxWidth: "11ch" }}>
          <span className="rv-mask"><span>{t.h1}</span></span>
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span className="serif">{t.h2}</span></span>
        </h2>

        <div className="path" ref={ref}>
          <div className="spine-bg" aria-hidden />
          <div className="spine-fill" aria-hidden style={{ transform: `scaleY(${p})` }} />
          <ol>
            {stops.map((s, i) => {
              const lit = p * n >= i + 0.6;
              return (
                <li key={s.id} className={lit ? "lit" : ""}>
                  <span className="dot" aria-hidden />
                  <time className="mono">{s.period}</time>
                  <div className="card stop">
                    <span className="mono kind">{s.kind}</span>
                    <h3>{s.title}</h3>
                    <p className="pl">{s.place}</p>
                    {s.detail && <p className="dt">{s.detail}</p>}
                  </div>
                </li>
              );
            })}
            <li className={p * n >= n - 0.4 ? "lit" : ""}>
              <span className="dot" aria-hidden />
              <time className="mono">{t.next}</time>
              <div className="stop next"><h3>{t.team}</h3></div>
            </li>
          </ol>
        </div>
      </div>
      <style>{`
        .path{position:relative;margin-top:72px;padding-left:34px;max-width:860px}
        .spine-bg,.spine-fill{position:absolute;left:5px;top:8px;bottom:8px;width:2px;border-radius:2px}
        .spine-bg{background:var(--line)}
        .spine-fill{background:var(--grad);transform-origin:top;will-change:transform}
        .path ol{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:34px}
        .path li{position:relative;display:grid;gap:10px;opacity:.38;transition:opacity .6s var(--ease)}
        .path li.lit{opacity:1}
        .dot{position:absolute;left:-34px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:background .5s var(--ease),box-shadow .5s var(--ease),transform .5s var(--ease)}
        .path li.lit .dot{background:var(--grad);box-shadow:inset 0 0 0 2px var(--wine),0 0 0 5px rgba(29,26,59,.08);transform:scale(1.1)}
        .path time{font-size:13px;letter-spacing:.04em;color:var(--mute)}
        .stop{padding:24px 26px;display:grid;gap:8px}
        .stop .kind{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
        .stop h3{font-size:clamp(20px,2.2vw,28px);letter-spacing:-.035em;line-height:1.1}
        .stop .pl{font-weight:500;color:var(--ink-2)}
        .stop .dt{font-size:14px;line-height:1.55;color:var(--mute)}
        .stop.next{border:1.5px dashed rgba(29,26,59,.3);border-radius:26px;padding:28px 26px}
      `}</style>
    </section>
  );
}
