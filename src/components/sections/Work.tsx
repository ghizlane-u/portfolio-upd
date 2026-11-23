"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContent, type LocalProject } from "@/lib/content";
import type { Category } from "@/lib/data";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";
import { imageFor, videoFor } from "@/lib/media";
import type { AiDetails } from "@/lib/ai-details";
import ProjectVisual from "../ui/ProjectVisual";
import TechLogo, { isBrand } from "../ui/TechLogo";

type T = ReturnType<typeof useContent>["ui"]["work"];

function VideoModal({ project, t, onClose }: { project: LocalProject; t: T; onClose: () => void }) {
  const [failed, setFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setScrollLocked(true);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="vm" role="dialog" aria-modal="true" aria-label={`${t.videoTitle} : ${project.title}`} onClick={onClose}>
      <div className="vm-box" onClick={(e) => e.stopPropagation()}>
        <div className="vm-head">
          <span className="mono">{project.index} — {t.videoTitle}</span>
          <button ref={closeRef} className="vm-x" onClick={onClose} aria-label={t.closeVideo}>✕</button>
        </div>
        <h3>{project.title}</h3>
        {failed ? (
          <div className="vm-empty">
            <p>{t.videoFail}</p>
            <a className="btn btn-ghost" href={project.video} target="_blank" rel="noreferrer">{t.videoOpen} ↗</a>
          </div>
        ) : (
          <video
            className="vm-video"
            src={project.video}
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={videoFor(project.id)?.poster}
            onError={() => setFailed(true)}
            // Son lu mais pas d'image : le codec vidéo (souvent H.265/HEVC) n'est pas pris en charge.
            onLoadedMetadata={(e) => { if (e.currentTarget.videoWidth === 0) setFailed(true); }}
          />
        )}
      </div>
    </div>
  );
}

function Lightbox({ src, alt, close, onClose }: { src: string; alt: string; close: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setScrollLocked(true);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  // Portail : la fenêtre passe au-dessus de la barre de navigation, quelles que soient les animations du slide.
  return createPortal(
    <div className="vm" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <div className="vm-box lb-box" onClick={(e) => e.stopPropagation()}>
        <div className="vm-head">
          <span className="mono">{alt}</span>
          <button ref={closeRef} className="vm-x" onClick={onClose} aria-label={close}>✕</button>
        </div>
        <div className="lb-scroll">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="lb-img" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function AiPanel({ ai }: { ai: AiDetails }) {
  const [zoom, setZoom] = useState<AiDetails["figures"][number] | null>(null);
  return (
    <section className="ai" aria-label={ai.title}>
      <div className="ai-head">
        <span className="mono k">{ai.title}</span>
        <p>{ai.intro}</p>
      </div>
      <ul className="ai-pts">
        {ai.points.map((x, i) => (
          <li key={x.t}>
            <span className="mono ai-n">{String(i + 1).padStart(2, "0")}</span>
            <strong>{x.t}</strong>
            <p>{x.d}</p>
          </li>
        ))}
      </ul>
      <div className="ai-figs">
        {ai.figures.map((f) => (
          <figure key={f.src}>
            <button className="ai-fig" onClick={() => setZoom(f)} aria-label={`${ai.zoom} : ${f.caption}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.alt} width={f.w} height={f.h} loading="lazy" decoding="async" draggable={false} />
              <span className="ai-zoom mono" aria-hidden>⤢ {ai.zoom}</span>
            </button>
            <figcaption className="mono">{f.caption}</figcaption>
          </figure>
        ))}
      </div>
      {zoom && <Lightbox src={zoom.src} alt={zoom.alt} close={ai.close} onClose={() => setZoom(null)} />}
    </section>
  );
}

function Slide({ p, t, total, onVideo }: { p: LocalProject; t: T; total: number; onVideo: (p: LocalProject) => void }) {
  // Vidéo : champ `video` de data.ts, sinon vidéo détectée au lancement (public/videos/<id>.mp4, voir media.generated.json).
  const videoSrc = p.video ?? videoFor(p.id)?.src;
  const shown = p.tech.slice(0, 7);
  const rest = p.tech.slice(7);
  return (
    <article className="sl" aria-roledescription="slide" aria-label={`${p.index} / ${String(total).padStart(2, "0")} — ${p.title}`}>
      <div className="sl-vis">
        <span className="gnum" aria-hidden>{p.index}</span>
        <ProjectVisual id={p.id} cover={p.cover} title={p.title} />
        {p.status && <span className="st mono">{p.status}</span>}
        {videoSrc && (
          <button className="play" onClick={() => onVideo({ ...p, video: videoSrc })} aria-label={`${t.watchAria} ${p.title}`}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M4 2.5v11a.5.5 0 0 0 .76.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5Z" />
            </svg>
            <span>{t.watch}</span>
          </button>
        )}
      </div>

      <div className="sl-body">
        <span className="mono k">{p.kicker}{p.year ? ` · ${p.year}` : ""}</span>
        <h3>{p.title}</h3>

        <ol className="story">
          <li style={{ ["--s" as string]: 0 }}>
            <span className="lb mono">01 · {t.lead}</span>
            <p>{p.lead}</p>
          </li>
          <li style={{ ["--s" as string]: 1 }}>
            <span className="lb mono">02 · {t.shift}</span>
            <div className="shift">
              <span className="from">{p.from}</span>
              <i aria-hidden>→</i>
              <strong className="to">{p.to}</strong>
            </div>
          </li>
          <li className="out" style={{ ["--s" as string]: 2 }}>
            <span className="lb mono">03 · {t.outcome}</span>
            <p>{p.outcome}</p>
          </li>
        </ol>

        <details className="fx">
          <summary>
            <span>{p.featuresTitle ?? t.features}</span>
            <span className="mono fxn">{p.features.length}</span>
            <span className="fxpl" aria-hidden>+</span>
          </summary>
          <p className="desc">{p.description}</p>
          <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
          {p.note && <p className="note">{p.note}</p>}
        </details>

        {p.tech.length > 0 && (
          <div className="tc" aria-label={t.tech}>
            {shown.map((x) => (
              <span key={x}>{isBrand(x) && <TechLogo name={x} size={14} />}{x}</span>
            ))}
            {rest.length > 0 && <span title={rest.join(", ")}>+{rest.length}</span>}
          </div>
        )}
        {p.github && <a className="btn btn-ghost gh" href={p.github} target="_blank" rel="noreferrer">{t.github} ↗</a>}
      </div>

      {p.ai && <AiPanel ai={p.ai} />}
    </article>
  );
}

export default function Work() {
  const { PROJECTS, CATEGORIES, ui } = useContent();
  const t = ui.work;
  const [filter, setFilter] = useState<Category | "all">("all");
  const [video, setVideo] = useState<LocalProject | null>(null);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const rail = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number; on: boolean }>({ x: 0, y: 0, on: false });

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: PROJECTS.length };
    PROJECTS.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, [PROJECTS]);
  const list = PROJECTS.filter((p) => filter === "all" || p.category === filter);
  const n = list.length;
  const cur = list[Math.min(idx, n - 1)];

  // Navigation circulaire : après le dernier projet, on revient au premier.
  const go = useCallback((to: number, d?: 1 | -1) => {
    if (n === 0) return;
    const next = ((to % n) + n) % n;
    setDir(d ?? (to > idx ? 1 : -1));
    setIdx(next);
  }, [n, idx]);
  const next = () => go(idx + 1, 1);
  const prev = () => go(idx - 1, -1);

  // Ouvre un projet demandé depuis l'assistant (filtre « Tout » + saut vers ce projet).
  const pending = useRef<string | null>(null);
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      pending.current = id;
      setFilter("all");
      setDir(1);
      setIdx(Math.max(0, PROJECTS.findIndex((p) => p.id === id)));
      scrollToTarget("work");
    };
    window.addEventListener("open-project", onOpen);
    return () => window.removeEventListener("open-project", onOpen);
  }, [PROJECTS]);

  useEffect(() => {
    if (pending.current) {
      const id = pending.current;
      pending.current = null;
      setIdx(Math.max(0, PROJECTS.findIndex((p) => p.id === id)));
      return;
    }
    setIdx(0);
    setDir(1);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Précharge les images des projets voisins : le changement de slide est instantané.
  useEffect(() => {
    if (n < 2) return;
    [list[(idx + 1) % n], list[(idx - 1 + n) % n]].forEach((p) => {
      const src = p && imageFor(p.id);
      if (src) new Image().src = src;
    });
  }, [idx, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Garde la miniature active centrée dans la bande de navigation.
  useEffect(() => {
    const r = rail.current;
    const el = r?.children[idx] as HTMLElement | undefined;
    if (!r || !el) return;
    r.scrollTo({ left: el.offsetLeft - r.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [idx, filter]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  };
  const isInteractive = (el: EventTarget) => !!(el as HTMLElement).closest("button,a,summary,video,details");
  const onPointerDown = (e: React.PointerEvent) => {
    if (isInteractive(e.target)) return;
    swipe.current = { x: e.clientX, y: e.clientY, on: true };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!swipe.current.on) return;
    swipe.current.on = false;
    const dx = e.clientX - swipe.current.x;
    const dy = e.clientY - swipe.current.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
  };

  const pad2 = (v: number) => String(v).padStart(2, "0");
  const short = (title: string) => title.split(/ — | – |:/)[0];

  return (
    <section id="work" className="section work" aria-labelledby="work-h">
      <div className="wrap">
        <span className="tag rv">{t.tag}</span>
        <h2 id="work-h" className="h2" style={{ maxWidth: "12ch" }}>
          <span className="rv-mask"><span>{t.h1}</span></span>
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span className="serif">{t.h2}</span></span>
        </h2>
        <p className="intro rv" style={{ ["--i" as string]: 2 }}>{t.intro(PROJECTS.length)}</p>

        <div className="bar rv" style={{ ["--i" as string]: 3 }}>
          <div className="fl" role="group" aria-label={t.filter}>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={filter === c.id ? "on" : ""} onClick={() => setFilter(c.id)} aria-pressed={filter === c.id}>
                {c.label} <span className="mono">{counts[c.id] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="ctl">
            <span className="cnt mono" aria-live="polite">{pad2(Math.min(idx, n - 1) + 1)} <em>/ {pad2(n)}</em></span>
            <button className="arr" onClick={prev} aria-label={t.prev}>←</button>
            <button className="arr" onClick={next} aria-label={t.next}>→</button>
          </div>
        </div>

        <div
          className="stg"
          data-dir={dir}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={t.tag}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current.on = false)}
        >
          <button className="sbtn sprev" onClick={prev} aria-label={t.prev}>←</button>
          <button className="sbtn snext" onClick={next} aria-label={t.next}>→</button>
          {cur && <Slide key={`${filter}-${cur.id}`} p={cur} t={t} total={n} onVideo={setVideo} />}
        </div>

        <div className="rail" ref={rail} role="tablist" aria-label={t.tag}>
          {list.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === idx}
              className={`th ${i === idx ? "on" : ""}`}
              onClick={() => go(i)}
            >
              <span className="mono">{p.index}</span>
              <span className="tt">{short(p.title)}</span>
            </button>
          ))}
        </div>
        <div className="prog">
          <div className="prog-bar" aria-hidden><span style={{ width: `${((Math.min(idx, n - 1) + 1) / Math.max(1, n)) * 100}%` }} /></div>
          <span className="hint mono">{t.hint}</span>
        </div>
      </div>

      {video && <VideoModal project={video} t={t} onClose={() => setVideo(null)} />}

      <style>{`
        .work{background:linear-gradient(to bottom,transparent,rgba(220,216,246,.28) 30%,rgba(220,216,246,.28) 70%,transparent);overflow:clip}
        .work .intro{margin-top:26px;max-width:62ch;font-size:clamp(16px,1.3vw,18px);line-height:1.55;color:var(--ink-2)}
        .bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;margin-top:36px}
        .fl{display:flex;flex-wrap:wrap;gap:8px}
        .fl button{display:inline-flex;gap:8px;align-items:center;height:40px;padding-inline:16px;border-radius:999px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);transition:background .4s var(--ease),color .4s var(--ease)}
        .fl button:hover{background:var(--blush)}
        .fl button.on{background:var(--grad);color:#fff}
        .fl .mono{font-size:11px;opacity:.6}
        .ctl{display:flex;align-items:center;gap:10px}
        .cnt{font-size:15px;font-weight:600;color:var(--wine);margin-right:6px;min-width:64px;text-align:right}
        .cnt em{font-style:normal;color:var(--faint);font-weight:400}
        .arr{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:18px;color:var(--wine);box-shadow:inset 0 0 0 1px rgba(108,87,208,.35);transition:background .4s var(--ease),color .4s var(--ease),opacity .3s,transform .5s var(--ease)}
        .arr:hover:not(:disabled){background:var(--grad);color:#fff;transform:scale(1.06)}
        .arr:disabled{opacity:.3;cursor:default}

        .stg{position:relative;margin-top:32px;outline:none;touch-action:pan-y;user-select:none;-webkit-user-select:none}
        .sl{display:grid;grid-template-columns:minmax(0,1fr);border-radius:30px;overflow:hidden;background:var(--card);box-shadow:inset 0 0 0 1px rgba(108,87,208,.18),0 36px 90px rgba(108,87,208,.16);animation:slR .8s var(--ease) both}
        .stg[data-dir="-1"] .sl{animation-name:slL}
        @keyframes slR{from{opacity:0;transform:translateX(70px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes slL{from{opacity:0;transform:translateX(-70px) scale(.97)}to{opacity:1;transform:none}}
        @media (min-width:900px){.sl{grid-template-columns:minmax(0,6fr) minmax(0,5fr)}}
        .sl-body .k,.sl-body h3,.story li,.fx,.tc,.gh{animation:up .8s var(--ease) both}
        .sl-body h3{animation-delay:.08s}
        .story li{animation-delay:calc(.18s + var(--s,0) * .1s)}
        .fx{animation-delay:.5s}.tc{animation-delay:.58s}.gh{animation-delay:.62s}
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .sbtn{position:absolute;top:50%;z-index:6;width:54px;height:54px;margin-top:-27px;border-radius:50%;display:none;place-items:center;font-size:20px;background:rgba(255,255,255,.95);color:var(--wine);box-shadow:0 10px 30px rgba(108,87,208,.25),inset 0 0 0 1px rgba(108,87,208,.2);transition:background .4s var(--ease),color .4s var(--ease),transform .5s var(--ease)}
        .sbtn:hover{background:var(--grad);color:#fff;transform:scale(1.08)}
        .sprev{left:-27px}.snext{right:-27px}
        @media (min-width:1100px){.sbtn{display:grid}}
        .rail{display:flex;gap:10px;overflow-x:auto;position:relative;padding:26px 2px 6px;scrollbar-width:none}
        .rail::-webkit-scrollbar{display:none}
        .th{flex:none;display:inline-flex;align-items:center;gap:10px;height:46px;padding-inline:16px 20px;border-radius:999px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);font-size:13.5px;font-weight:500;white-space:nowrap;transition:background .45s var(--ease),color .45s var(--ease),transform .5s var(--ease),box-shadow .45s}
        .th .mono{font-size:11px;color:var(--rose);transition:color .4s}
        .th:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1px rgba(108,87,208,.35)}
        .th.on{background:var(--grad);color:#fff;box-shadow:0 12px 28px rgba(108,87,208,.3)}
        .th.on .mono{color:var(--blush)}
        .prog{display:flex;align-items:center;gap:20px;margin-top:18px}
        .sl-vis{position:relative;overflow:hidden;aspect-ratio:4/3;background:radial-gradient(120% 90% at 18% 8%,#f7edf8,#c3c6f1 58%,#edc2d3)}
        @media (min-width:900px){.sl-vis{aspect-ratio:auto;min-height:520px}}
        .sl-vis::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(108,87,208,.16) 1.1px,transparent 1.3px);background-size:16px 16px;z-index:0}
        .gnum{position:absolute;left:22px;bottom:-6px;z-index:0;font-weight:800;font-size:clamp(110px,14vw,190px);line-height:1;letter-spacing:-.07em;color:transparent;-webkit-text-stroke:1.5px rgba(108,87,208,.28)}
        .pv{position:absolute;inset:0;z-index:1}
        .pv-art{position:absolute;inset:0;display:grid;place-items:center;padding:7%;transition:opacity .5s}
        .pv[data-photo="1"] .pv-art{opacity:0}
        .pv-bg{position:absolute;inset:-8%;width:116%;height:116%;object-fit:cover;filter:blur(26px) saturate(1.1);opacity:.9;transition:opacity .6s var(--ease)}
        .pv-img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:opacity .6s var(--ease);animation:zoomOut 1.2s var(--ease) both}
        @keyframes zoomOut{from{transform:scale(1.06)}to{transform:none}}
        .cover-svg{display:block;width:100%;height:auto;max-height:100%;filter:drop-shadow(0 18px 30px rgba(108,87,208,.22));transition:transform 1.2s var(--ease)}
                .st{position:absolute;z-index:2;left:16px;top:16px;height:28px;display:inline-flex;align-items:center;padding-inline:12px;border-radius:999px;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);color:var(--wine);box-shadow:inset 0 0 0 1px rgba(108,87,208,.18);font-size:10px;letter-spacing:.06em;text-transform:uppercase}
        .play{position:absolute;z-index:2;right:16px;bottom:16px;height:42px;padding-inline:16px 18px;border-radius:999px;display:inline-flex;align-items:center;gap:9px;background:var(--grad);color:#fff;font-size:13px;font-weight:600;transition:transform .5s var(--ease),background .4s}
        .play:hover{transform:scale(1.05);background:var(--ink)}

        .sl-body{display:flex;flex-direction:column;gap:16px;padding:clamp(22px,2.8vw,40px)}
        .k{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--rose)}
        .sl-body h3{font-size:clamp(24px,2.6vw,38px);line-height:1.06}
        .story{list-style:none;margin:6px 0 0;padding:0 0 0 22px;display:grid;gap:18px;position:relative}
        .story::before{content:"";position:absolute;left:5px;top:8px;bottom:8px;width:1.5px;background:linear-gradient(var(--blush),var(--rose))}
        .story li{position:relative}
        .story li::before{content:"";position:absolute;left:-22px;top:3px;width:11px;height:11px;border-radius:50%;background:var(--card);box-shadow:inset 0 0 0 2px var(--rose)}
        .story li.out::before{background:var(--grad);box-shadow:none}
        .lb{display:block;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-bottom:6px}
        .story p{font-size:15px;line-height:1.55;color:var(--ink-2)}
        .shift{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;font-size:14.5px}
        .shift .from{padding:6px 12px;border-radius:999px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);color:var(--mute);text-decoration:line-through;text-decoration-color:rgba(188,95,151,.5)}
        .shift i{font-style:normal;color:var(--wine);font-weight:700}
        .shift .to{padding:6px 14px;border-radius:999px;background:var(--grad);color:#fff;font-weight:600;letter-spacing:-.01em}
        .story li.out p{padding:12px 14px;border-radius:14px;background:rgba(220,216,246,.4);color:var(--ink);font-weight:500}

        .fx{border-top:1px solid var(--line);padding-top:2px}
        .fx summary{list-style:none;display:flex;align-items:center;gap:10px;padding-block:10px;cursor:pointer;font-weight:600;font-size:14px}
        .fx summary::-webkit-details-marker{display:none}
        .fx .fxn{font-size:11px;color:var(--mute);font-weight:400}
        .fx .fxpl{margin-left:auto;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--line);transition:transform .5s var(--ease),background .4s,color .4s}
        .fx[open] .fxpl{transform:rotate(45deg);background:var(--grad);color:#fff}
        .fx .desc{font-size:14px;line-height:1.5;color:var(--mute);margin:2px 0 10px}
        .fx ul{list-style:none;padding:0 0 6px;display:grid;gap:8px;font-size:13.5px;line-height:1.45;color:var(--ink-2)}
        .fx li{padding-left:14px;position:relative}
        .fx li::before{content:"";position:absolute;left:0;top:.62em;width:5px;height:5px;border-radius:50%;background:var(--rose)}
        .note{font-size:13px;line-height:1.5;color:var(--mute);padding:10px 12px;border-radius:12px;background:var(--paper)}
        .tc{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}
        .tc span{display:inline-flex;align-items:center;gap:6px;height:28px;padding-inline:11px;border-radius:999px;font-size:11.5px;font-weight:500;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line)}
        .gh{align-self:flex-start;height:40px;font-size:14px}

        .prog-bar{flex:1;height:3px;border-radius:3px;background:rgba(108,87,208,.14);overflow:hidden}
        .prog-bar span{display:block;height:100%;background:var(--grad);border-radius:3px;transition:width .6s var(--ease)}
        .hint{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);white-space:nowrap}
        @media (max-width:640px){.hint{display:none}.cnt{min-width:0}}


        .ai{grid-column:1/-1;display:grid;gap:22px;padding:clamp(22px,2.8vw,40px);border-top:1px solid var(--line);background:linear-gradient(180deg,rgba(220,216,246,.32),rgba(255,255,255,0) 70%);animation:up .8s var(--ease) .3s both}
        .ai-head{display:grid;gap:10px;max-width:74ch}
        .ai-head .k{font-size:12px}
        .ai-head p{font-size:clamp(15px,1.25vw,17px);line-height:1.55;color:var(--ink-2)}
        .ai-pts{list-style:none;margin:0;padding:0;display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}
        @media (min-width:700px){.ai-pts{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media (min-width:1100px){.ai-pts{grid-template-columns:repeat(4,minmax(0,1fr))}}
        .ai-pts li{display:grid;gap:6px;align-content:start;padding:16px 18px;border-radius:20px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
        .ai-n{font-size:11px;color:var(--rose)}
        .ai-pts strong{font-size:15px;letter-spacing:-.01em;color:var(--ink)}
        .ai-pts p{font-size:13.5px;line-height:1.5;color:var(--mute)}
        .ai-figs{display:grid;gap:16px;grid-template-columns:minmax(0,1fr)}
        @media (min-width:900px){.ai-figs{grid-template-columns:repeat(2,minmax(0,1fr))}}
        .ai-figs figure{margin:0;display:grid;gap:8px}
        .ai-fig{position:relative;display:block;width:100%;border-radius:18px;overflow:hidden;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 18px 44px rgba(108,87,208,.14);cursor:zoom-in;transition:transform .5s var(--ease),box-shadow .5s var(--ease)}
        .ai-fig:hover{transform:translateY(-3px);box-shadow:inset 0 0 0 1px rgba(108,87,208,.35),0 26px 56px rgba(108,87,208,.22)}
        .ai-fig img{display:block;width:100%;height:auto}
        .ai-zoom{position:absolute;right:12px;bottom:12px;padding:7px 12px;border-radius:999px;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:var(--grad);opacity:.95}
        .ai-figs figcaption{font-size:11px;letter-spacing:.04em;color:var(--mute);line-height:1.4}
        .lb-box{width:min(1280px,100%)}
        .lb-scroll{overflow:auto;max-height:78svh;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
        .lb-img{display:block;width:100%;min-width:min(100%,900px);height:auto}

        .vm{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:var(--gutter);background:rgba(244,239,250,.86);backdrop-filter:blur(14px);animation:vmin .5s var(--ease)}
        @keyframes vmin{from{opacity:0}to{opacity:1}}
        .vm-box{width:min(960px,100%);max-height:100%;display:flex;flex-direction:column;gap:14px;padding:22px;border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 40px 100px rgba(108,87,208,.22)}
        .vm-head{display:flex;align-items:center;justify-content:space-between}
        .vm-head .mono{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .vm-x{width:38px;height:38px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;transition:background .4s,color .4s}
        .vm-x:hover{background:var(--grad);color:#fff}
        .vm-box h3{font-size:clamp(18px,2vw,26px);line-height:1.1}
        .vm-video{width:100%;max-height:68svh;border-radius:18px;background:#000}
        .vm-empty{display:grid;gap:16px;justify-items:center;place-items:center;min-height:240px;border-radius:18px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);color:var(--mute);text-align:center;padding:24px}
        @media (prefers-reduced-motion:reduce){.vm{animation:none}.sl,.pv-img,.sl-body *,.ai{animation:none!important}}
      `}</style>
    </section>
  );
}
