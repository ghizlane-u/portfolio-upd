"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import LinkedInLink from "../ui/LinkedInLink";

type Phase = "idle" | "scan" | "done";
const SCAN_MS = 2600;

function Barcode({ name }: { name: string }) {
  // Barres déterministes à partir du nom (décoratif).
  const bars = Array.from(name.replace(/\s/g, "")).flatMap((ch, i) => {
    const c = ch.charCodeAt(0);
    return [1 + (c % 3), 1 + ((c >> 2) % 2), 1 + ((c + i) % 3)];
  });
  return (
    <div className="barcode" aria-hidden>
      {bars.map((w, i) => (
        <span key={i} style={{ width: w * 1.6, opacity: i % 2 ? 0 : 1 }} />
      ))}
    </div>
  );
}

function IdCard({ onScanned }: { onScanned: () => void }) {
  const { PROFILE, EDUCATION, PROJECTS, CERTIFICATIONS, ui } = useContent();
  const t = ui.about;
  const [flipped, setFlipped] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const started = useRef(false);
  const pivot = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const st = useRef({ angle: 0, vel: 0, lastX: 0, t: 0, visible: false });

  // Scan du badge : se lance quand la carte est bien visible, puis révèle les infos à côté.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        if (prefersReducedMotion()) {
          setPhase("done");
          onScanned();
          return;
        }
        setPhase("scan");
        timer = setTimeout(() => {
          setPhase("done");
          onScanned();
        }, SCAN_MS);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [onScanned]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const s = st.current;
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (s.visible = e.isIntersecting));
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      if (!s.visible) return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.vel += Math.max(-40, Math.min(40, dx)) * 0.012;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      if (s.visible) {
        s.t += dt;
        const target = Math.sin(s.t * 0.9) * 1.6; // balancement au repos
        const acc = -22 * (s.angle - target) - 2.6 * s.vel; // ressort amorti
        s.vel += acc * dt;
        s.angle += s.vel * dt * 60 * 0.4;
        s.angle = Math.max(-28, Math.min(28, s.angle));
        if (pivot.current) pivot.current.style.transform = `rotate(${s.angle}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const lines = [
    PROFILE.role,
    `${EDUCATION[0].title} — ${EDUCATION[0].place}`,
    ...t.cardLines({ projects: PROJECTS.length, certs: CERTIFICATIONS.length, langs: PROFILE.languages.map((l) => l.name).join(", ") }),
  ];

  return (
    <div className="lan" ref={wrap}>
      <div className="pivot" ref={pivot}>
        <div className="strap" aria-hidden>
          <div className="strap-text mono">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>{PROFILE.name.toUpperCase()} · {ui.hero.title1.toUpperCase()} · </span>
            ))}
          </div>
        </div>
        <div className="clip" aria-hidden />
        <div
          className={`flip ${flipped ? "is-flipped" : ""} ${phase === "scan" ? "scanning" : ""}`}
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
        >
          <button
            className="flip-in"
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
            aria-label={t.id.flip}
          >
            <div className="face front">
              <div className="band mono">{t.id.band}</div>
              <div className="ph-ring">
                <img className="ph" src="/portrait-bust.webp" alt={PROFILE.name} width={128} height={156} />
              </div>
              <div className="who">
                <strong>{PROFILE.name}</strong>
                <span>{PROFILE.heroRole}</span>
              </div>
              <dl className="rows mono">
                <div><dt>{t.id.job}</dt><dd>{t.id.student}</dd></div>
                <div><dt>{t.id.dept}</dt><dd>{ui.hero.title1}</dd></div>
                <div><dt>{t.id.valid}</dt><dd>{PROFILE.validTill}</dd></div>
              </dl>
              <div className="idfoot">
                <Barcode name={PROFILE.name} />
                <div className="holo" aria-hidden />
              </div>
            </div>
            <div className="face back">
              <div className="band mono">{t.id.back}</div>
              <ul>
                {lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="sig serif">{PROFILE.name}</p>
              <p className="found mono">{t.id.found} · {PROFILE.email}</p>
            </div>
          </button>
          <div className={`scan ${phase}`} aria-hidden>
            <span className="c tl" /><span className="c tr" /><span className="c bl" /><span className="c br" />
            {phase === "scan" && <span className="beam" />}
          </div>
          <div className={`chip mono ${phase}`} role="status" aria-live="polite">
            {phase === "scan" && <><i className="pulse" />{t.scanning}</>}
            {phase === "done" && <>✓ {t.verified}</>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { PROFILE, EXPERIENCE, EDUCATION, ui } = useContent();
  const t = ui.about;
  const [scanned, setScanned] = useState(false);
  const onScanned = useCallback(() => setScanned(true), []);
  const current = EXPERIENCE[0];
  const values = [
    PROFILE.location,
    `${EDUCATION[0].title}, ${EDUCATION[0].place}`,
    `${current.title} — ${current.place}`,
    PROFILE.email,
  ];
  const k = (n: number) => ({ ["--k" as string]: n });
  return (
    <section id="about" className={`section about ${scanned ? "scanned" : ""}`} aria-labelledby="about-h">
      <div className="wrap">
        <span className="tag rv">{t.tag}</span>
        <div className="grid">
          <div className="left">
            <h2 id="about-h" className="h2 sd" style={{ maxWidth: "11ch", ...k(0) }}>
              <span>{t.hi}</span>
              <span className="serif" style={{ display: "block" }}>{PROFILE.firstName}.</span>
            </h2>
            <p className="lead sd" style={k(1)}>{PROFILE.resumeSummary}</p>
            <p className="sub sd" style={k(2)}>{PROFILE.extraLine}</p>
            <div className="btns sd" style={k(3)}>
              <button className="btn btn-primary" onClick={() => scrollToTarget("work")}>{ui.hero.projects}</button>
              {PROFILE.github && <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
              <LinkedInLink />
            </div>
          </div>

          <IdCard onScanned={onScanned} />

          <aside className="right" aria-label={t.keyInfo}>
            <div>
              <span className="tag sd" style={k(1)}>{t.brief}</span>
              <dl className="facts">
                {t.facts.map((label, i) => (
                  <div key={label} className="sd" style={k(i + 2)}>
                    <dt className="mono">{label}</dt>
                    <dd>{values[i]}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <blockquote className="quote serif sd" style={k(7)}>{t.quote}</blockquote>
          </aside>
        </div>
      </div>

      <style>{`
        .about{overflow:clip}
        .about .grid{display:grid;grid-template-columns:minmax(0,1fr);gap:56px;align-items:stretch;margin-top:28px}
        .about .lan{order:-1;margin-top:calc(clamp(60px,10vh,120px) + 12px)}
        .sd{opacity:0;transform:translateY(18px);transition:opacity .9s var(--ease),transform .9s var(--ease);transition-delay:calc(var(--k,0) * 110ms)}
        .scanned .sd{opacity:1;transform:none}
        .about .tag.sd{margin-bottom:12px}
        @media (min-width:1050px){.about .grid{grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:48px}.about .lan{order:0;margin-top:0}}
        .about .lead{font-size:clamp(16px,1.35vw,19px);line-height:1.6;color:var(--ink-2);margin-top:28px;max-width:52ch}
        .about .sub{margin-top:14px;color:var(--mute);font-size:15px;max-width:52ch}
        .about .btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
        .about .right{display:flex;flex-direction:column;justify-content:space-between;gap:36px;padding-top:6px}
        .facts>div{padding-block:16px;border-top:1px solid var(--line)}
        .facts>div:last-child{border-bottom:1px solid var(--line)}
        .facts dt{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-bottom:6px}
        .facts dd{font-size:17px;letter-spacing:-.01em;line-height:1.35;word-break:break-word}
        .quote{font-size:clamp(22px,2vw,28px);line-height:1.25;color:var(--ink-2)}

        /* Carte d'identité */
        .lan{position:relative;display:flex;justify-content:center;min-height:520px}
        .pivot{position:absolute;top:calc(-1 * clamp(60px,10vh,120px));left:50%;margin-left:-150px;width:300px;transform-origin:50% 0;will-change:transform}
        .strap{position:relative;left:135px;width:30px;height:calc(56px + clamp(60px,10vh,120px));background:var(--grad);overflow:hidden;border-radius:0 0 4px 4px}
        .strap-text{position:absolute;inset:0;writing-mode:vertical-rl;font-size:9px;letter-spacing:.2em;color:#fff;white-space:nowrap;animation:strap 14s linear infinite;line-height:30px}
        @keyframes strap{to{transform:translateY(-50%)}}
        .clip{position:relative;left:128px;width:44px;height:20px;border-radius:4px 4px 8px 8px;background:#c9c7c2;box-shadow:inset 0 0 0 1px rgba(29,26,59,.25),0 3px 6px rgba(29,26,59,.18);margin-top:-2px;z-index:2}
        .flip{position:relative;perspective:1400px;margin-top:-4px}
        .flip.scanning .face.front{box-shadow:inset 0 0 0 1px var(--line),0 24px 60px rgba(108,87,208,.28),0 0 0 3px rgba(188,95,151,.4)}
        .scan{position:absolute;inset:0;border-radius:24px;pointer-events:none;opacity:0;z-index:4;overflow:hidden;transition:opacity .8s var(--ease)}
        .scan.scan{opacity:1}
        .scan .c{position:absolute;width:26px;height:26px;border:2.5px solid var(--wine)}
        .scan .tl{top:10px;left:10px;border-right:0;border-bottom:0;border-radius:8px 0 0 0}
        .scan .tr{top:10px;right:10px;border-left:0;border-bottom:0;border-radius:0 8px 0 0}
        .scan .bl{bottom:10px;left:10px;border-right:0;border-top:0;border-radius:0 0 0 8px}
        .scan .br{bottom:10px;right:10px;border-left:0;border-top:0;border-radius:0 0 8px 0}
        .scan .beam{position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,transparent,var(--rose),var(--wine),var(--rose),transparent);box-shadow:0 0 22px 8px rgba(188,95,151,.55),0 -34px 40px 6px rgba(220,216,246,.45);animation:beam ${SCAN_MS}ms ease-in-out both}
        @keyframes beam{0%{top:0;opacity:0}8%{opacity:1}50%{top:calc(100% - 3px)}92%{opacity:1}100%{top:0;opacity:0}}
        .chip{position:absolute;left:50%;bottom:-46px;transform:translate(-50%,6px);display:inline-flex;align-items:center;gap:8px;height:30px;padding-inline:14px;border-radius:999px;background:var(--blush);color:var(--wine);font-size:11px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;opacity:0;transition:opacity .5s var(--ease),transform .5s var(--ease)}
        .chip.scan,.chip.done{opacity:1;transform:translate(-50%,0)}
        .chip.done{background:var(--grad);color:#fff}
        .chip .pulse{width:7px;height:7px;border-radius:50%;background:var(--grad);animation:blink .7s ease-in-out infinite alternate}
        @keyframes blink{to{opacity:.25}}
        .flip-in{display:block;position:relative;width:300px;height:404px;transform-style:preserve-3d;transition:transform .9s var(--ease);text-align:left}
        .flip.is-flipped .flip-in{transform:rotateY(180deg)}
        .face{position:absolute;inset:0;border-radius:24px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 24px 60px rgba(29,26,59,.14);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;display:flex;flex-direction:column;align-items:center}
        .face.back{transform:rotateY(180deg);align-items:stretch}
        .band{flex:none;width:100%;background:var(--grad);color:#fff;text-align:center;font-size:11px;letter-spacing:.3em;padding:12px 0;text-transform:uppercase}
        .ph-ring{flex:none;margin-top:14px;padding:3px;border-radius:26px;background:linear-gradient(135deg,#d4d2cd,#8a8882)}
        .ph-ring{box-shadow:0 0 0 7px rgba(29,26,59,.04)}
        .ph{display:block;width:128px;height:156px;object-fit:cover;border-radius:23px;transition:transform .8s var(--ease)}
        .ph-ring{overflow:hidden}
        .flip:hover .ph{transform:scale(1.06)}
        .who{flex:none;margin-top:12px;text-align:center;display:flex;flex-direction:column;gap:2px}
        .who strong{font-size:19px;letter-spacing:-.03em}
        .who span{font-size:13px;color:var(--mute)}
        .rows{flex:none;width:100%;padding:8px 24px 0;font-size:11px}
        .rows>div{display:flex;justify-content:space-between;padding-block:4px;border-top:1px solid var(--line)}
        .rows dt{color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
        .idfoot{margin-top:auto;width:100%;display:flex;justify-content:space-between;align-items:flex-end;padding:0 24px 14px;flex:none}
        .barcode{display:flex;align-items:stretch;gap:1.5px;height:30px}
        .barcode span{background:var(--grad);display:block}
        .holo{width:30px;height:30px;border-radius:50%;background:conic-gradient(#d9d7d2,#9c9a95,#efede8,#7f7d78,#d9d7d2);box-shadow:inset 0 0 0 1px rgba(29,26,59,.15)}
        .back ul{list-style:none;padding:20px 24px 0;display:flex;flex-direction:column;gap:12px;font-size:13px;line-height:1.4;color:var(--ink-2)}
        .back li{padding-bottom:12px;border-bottom:1px solid var(--line)}
        .sig{margin:auto 24px 6px;font-size:30px}
        .found{margin:0 24px 20px;font-size:10px;color:var(--mute);word-break:break-all}
        @media (prefers-reduced-motion:reduce){.strap-text,.scan .beam,.chip .pulse{animation:none}.sd{transition:none}}
      `}</style>
    </section>
  );
}
