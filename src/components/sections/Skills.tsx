"use client";
import { useMemo, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import type { SkillFamily, Project } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

type Tile = { n: number; name: string; symbol: string; family: string; familyLabel: string };

function buildTiles(SKILL_GROUPS: SkillFamily[]): Tile[] {
  const used = new Set<string>();
  const tiles: Tile[] = [];
  let n = 1;
  for (const g of SKILL_GROUPS) {
    for (const name of g.skills) {
      const letters = name.replace(/[^A-Za-zÀ-ÿ0-9]/g, "");
      const first = letters[0].toUpperCase();
      let symbol = name === "C#" ? "C#" : "";
      for (let i = 1; i < letters.length; i++) {
        const c = first + letters[i].toLowerCase();
        if (!used.has(c)) { symbol = c; break; }
      }
      if (!symbol) symbol = first + String(n % 10);
      used.add(symbol);
      tiles.push({ n: n++, name, symbol, family: g.id, familyLabel: g.label });
    }
  }
  return tiles;
}

function projectsUsing(name: string, PROJECTS: Pick<Project, "tech" | "title">[]) {
  const k = name.toLowerCase();
  return PROJECTS.filter((p) => p.tech.some((t) => t.toLowerCase() === k)).map((p) => p.title);
}

export default function Skills() {
  const { SKILL_GROUPS, PROJECTS, ui } = useContent();
  const t = ui.skills;
  const tiles = useMemo(() => buildTiles(SKILL_GROUPS), [SKILL_GROUPS]);
  const [filter, setFilter] = useState<string>("all");
  const [selN, setSelN] = useState(1);
  const sel = tiles.find((x) => x.n === selN) ?? tiles[0];
  const gridRef = useRef<HTMLDivElement>(null);
  const seen = useInView(gridRef, 0.08);
  const used = projectsUsing(sel.name, PROJECTS);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-h">
      <div className="wrap">
        <span className="tag rv">{t.tag}</span>
        <h2 id="skills-h" className="h2" style={{ maxWidth: "12ch" }}>
          <span className="rv-mask"><span>{t.h1}</span></span>
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span className="serif">{t.h2}</span></span>
        </h2>

        <div className="chips rv" role="group" aria-label={t.filter}>
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>{t.all} · {tiles.length}</button>
          {SKILL_GROUPS.map((g) => (
            <button key={g.id} className={filter === g.id ? "on" : ""} onClick={() => setFilter(g.id)}>
              {g.short}
            </button>
          ))}
        </div>

        <div className="layout">
          <div ref={gridRef} className={`pt ${seen ? "is-in" : ""}`} role="list">
            {tiles.map((tile, i) => {
              const dim = filter !== "all" && tile.family !== filter;
              const rowD = Math.floor(i / 8), colD = i % 8;
              const rowM = Math.floor(i / 4), colM = i % 4;
              return (
                <button
                  key={tile.name}
                  role="listitem"
                  className={`tile ${dim ? "dim" : ""} ${sel.name === tile.name ? "sel" : ""}`}
                  style={{ ["--dd" as string]: `${(rowD + colD) * 40}ms`, ["--dm" as string]: `${(rowM + colM) * 40}ms` }}
                  onMouseEnter={() => setSelN(tile.n)}
                  onFocus={() => setSelN(tile.n)}
                  onClick={() => setSelN(tile.n)}
                  aria-label={`${tile.name}, ${tile.familyLabel}`}
                >
                  <span className="num mono">{tile.n}</span>
                  <span className="sym">{tile.symbol}</span>
                  <span className="nm">{tile.name}</span>
                </button>
              );
            })}
          </div>

          <aside className="insp card" aria-live="polite">
            <div className="glow" style={{ background: isBrand(sel.name) ? BRAND[sel.name].tint : "transparent" }} aria-hidden />
            <div className="logo" key={sel.name}>
              <TechLogo name={sel.name} size={150} />
            </div>
            <span className="mono fam">{sel.familyLabel}</span>
            <h3>{sel.name}</h3>
            <p className="used">
              {used.length ? <>{t.usedIn} {used.join(" · ")}</> : <>{t.fallback}</>}
            </p>
          </aside>
        </div>
      </div>

      <style>{`
        .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:40px}
        .chips button{height:38px;padding-inline:16px;border-radius:999px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);transition:background .4s var(--ease),color .4s var(--ease)}
        .chips button:hover{background:var(--soft)}
        .chips button.on{background:var(--grad);color:#fff}
        .skills .layout{display:grid;grid-template-columns:minmax(0,1fr);gap:28px;margin-top:28px;align-items:start}
        @media (min-width:1050px){.skills .layout{grid-template-columns:minmax(0,1fr) 320px}}
        .pt{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
        @media (min-width:700px){.pt{grid-template-columns:repeat(8,minmax(0,1fr))}}
        .tile{position:relative;aspect-ratio:1;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);display:flex;flex-direction:column;justify-content:space-between;padding:8px 9px 9px;text-align:left;overflow:hidden;opacity:0;transform:translateY(14px) scale(.96);transition:opacity .7s var(--ease),transform .7s var(--ease),background .35s var(--ease),color .35s var(--ease),box-shadow .35s;transition-delay:var(--dm)}
        @media (min-width:700px){.tile{transition-delay:var(--dd)}}
        .pt.is-in .tile{opacity:1;transform:none}
        .pt.is-in .tile.dim{opacity:.22}
        .tile:hover,.tile.sel{background:var(--grad);color:#fff;transition-delay:0s}
        .tile .num{font-size:9px;color:var(--mute)}
        .tile:hover .num,.tile.sel .num{color:#DCD8F6}
        .tile .sym{font-size:clamp(20px,2.4vw,30px);font-weight:700;letter-spacing:-.05em;line-height:1}
        .tile .nm{font-size:10px;line-height:1.15;color:var(--mute);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word}
        .tile:hover .nm,.tile.sel .nm{color:#ECE8FA}
        .insp{position:relative;padding:28px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;min-height:380px;overflow:hidden}
        @media (min-width:1050px){.insp{position:sticky;top:96px}}
        .insp .glow{position:absolute;top:30px;left:50%;width:190px;height:190px;margin-left:-95px;border-radius:50%;filter:blur(46px);opacity:.22;transition:background .5s}
        .insp .logo{position:relative;height:150px;display:grid;place-items:center;animation:pop .6s var(--ease);color:var(--ink)}
        @keyframes pop{0%{transform:scale(.6);opacity:0}100%{transform:none;opacity:1}}
        .insp .fam{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-top:18px}
        .insp h3{font-size:28px}
        .insp .used{font-size:14px;color:var(--ink-2);line-height:1.45;margin-top:6px}
      `}</style>
    </section>
  );
}
