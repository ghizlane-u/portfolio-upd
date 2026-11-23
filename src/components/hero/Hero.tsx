"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import { scrollToTarget } from "@/lib/scroll";
import LinkedInLink from "../ui/LinkedInLink";

export default function Hero() {
  const { PROFILE, FOCUS, ui } = useContent();
  const t = ui.hero;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const visible = useRef(true);

  // L'avatar (vidéo) est affiché directement : aucune photo n'est montrée avant lui.
  const start = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    try {
      await v.play();
    } catch {}
    // Le son ne démarre seul que si le navigateur le permet (visiteur déjà actif sur la page).
    const active = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive;
    if (active) {
      try {
        v.muted = false;
        await v.play();
        setSoundOn(true);
        setBlocked(false);
        return;
      } catch {
        v.muted = true;
        v.play().catch(() => {});
      }
    }
    setSoundOn(false);
    setBlocked(true);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 2) setReady(true);
    start();
  }, [start]);

  // Débloque le son à la première interaction.
  useEffect(() => {
    if (!blocked) return;
    const unlock = () => {
      const v = videoRef.current;
      if (!v || !visible.current) return;
      v.muted = false;
      v.play().then(() => {
        setSoundOn(true);
        setBlocked(false);
      }).catch(() => {});
    };
    const evts = ["pointerdown", "keydown", "touchend"] as const;
    evts.forEach((e) => window.addEventListener(e, unlock, { once: true }));
    return () => evts.forEach((e) => window.removeEventListener(e, unlock));
  }, [blocked]);

  // Pause (donc silence) quand moins de 35 % du hero est visible.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const v = videoRef.current;
        visible.current = e.intersectionRatio >= 0.35;
        if (!v) return;
        if (visible.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted || !soundOn) {
      v.muted = false;
      v.play().then(() => {
        setSoundOn(true);
        setBlocked(false);
      }).catch(() => {});
    } else {
      v.muted = true;
      setSoundOn(false);
    }
  };

  return (
    <section id="hero" ref={sectionRef} className="hero" aria-label={t.aria}>
      <div className="hgrid wrap">
        <div className="hl">
          <p className="name">{PROFILE.name}</p>
          <h1 className="title">
            <span className="rv-mask"><span>{t.title1}</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}>
              <span className="serif">{t.title2}</span>
            </span>
          </h1>
          <p className="focus rv" style={{ ["--i" as string]: 2 }}>
            <strong className="mono">{t.focusLabel}</strong> {t.focus}
          </p>
          <div className="ctas rv" style={{ ["--i" as string]: 3 }}>
            <button className="btn btn-primary" onClick={() => scrollToTarget("work")}>{t.projects}</button>
            <button className="btn btn-ghost" onClick={() => scrollToTarget("contact")}>{t.contact}</button>
            <LinkedInLink />
          </div>
        </div>

        <div className="stage">
          <div className="halo" aria-hidden />
          <span className="fchip c1 mono" aria-hidden>{FOCUS[0].t}</span>
          <span className="fchip c2 mono" aria-hidden>{FOCUS[1].t}</span>
          <span className="fchip c3 mono" aria-hidden>{FOCUS[2].t}</span>
          <video
            ref={videoRef}
            className={`vid ${ready ? "is-ready" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setReady(true)}
            onCanPlay={() => setReady(true)}
            aria-label={`${PROFILE.name} ${t.videoAria}`}
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
          {ready && (
            <button
              className={`snd ${blocked ? "is-ping" : ""}`}
              onClick={toggleSound}
              aria-label={soundOn ? t.soundOff : t.soundOn}
              aria-pressed={soundOn}
            >
              {soundOn ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <rect x="3" y="2" width="3.4" height="12" rx="1" />
                  <rect x="9.6" y="2" width="3.4" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M4 2.5v11a.5.5 0 0 0 .76.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5Z" />
                </svg>
              )}
            </button>
          )}
        </div>

        <ul className="hr" aria-label={t.expertise}>
          {FOCUS.map((f, i) => (
            <li key={f.t} className="rv" style={{ ["--i" as string]: i + 2 }}>
              <span className="mono">0{i + 1}</span>
              <strong>{f.t}</strong>
              <small>{f.d}</small>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .hero{position:relative;min-height:100svh;display:flex;align-items:center;padding-top:72px;overflow:clip;}
        .hgrid{position:relative;width:100%;display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;gap:20px}
        .stage{position:relative;order:-1;height:min(58svh,560px);aspect-ratio:768/960;display:grid;place-items:center}
        .vid{position:relative;z-index:1;mix-blend-mode:multiply;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .7s var(--ease);-webkit-mask-image:linear-gradient(to right,transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(to right,transparent,#000 14%,#000 86%,transparent)}
        .vid.is-ready{opacity:1}
        .halo{position:absolute;left:50%;top:50%;width:112%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,.55) 55%,transparent 72%);z-index:0}
        .halo::before{content:"";position:absolute;inset:6%;border-radius:50%;background:conic-gradient(from 0deg,rgba(237,194,211,.9),rgba(195,198,241,.9),rgba(100,133,186,.6),rgba(237,194,211,.9));filter:blur(38px);opacity:.75;animation:spin 22s linear infinite;z-index:-1}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fchip{position:absolute;z-index:3;height:36px;display:none;align-items:center;padding-inline:16px;border-radius:999px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.9),0 14px 34px rgba(108,87,208,.22);animation:flt 6s ease-in-out infinite}
        .fchip::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--grad);margin-right:9px}
        .c1{left:-6%;top:22%}.c2{right:-10%;top:42%;animation-delay:-2s}.c3{left:2%;bottom:14%;animation-delay:-4s}
        @keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @media (min-width:700px){.fchip{display:inline-flex}}
        .snd{position:absolute;z-index:4;right:4%;bottom:6%;width:46px;height:46px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;transition:transform .5s var(--ease)}
        .snd:hover{transform:scale(1.08)}
        .snd.is-ping::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:1.5px solid var(--wine);animation:ping 1.8s var(--ease) infinite}
        @keyframes ping{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.9);opacity:0}}
        .hl{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px}
        .name{font-family:var(--font-brand);font-weight:600;font-size:clamp(30px,3.6vw,54px);letter-spacing:-.035em;line-height:1.05;background:linear-gradient(100deg,#1d1a3b 30%,#6c57d0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
        .title{font-size:clamp(44px,6.6vw,104px);display:flex;flex-direction:column}
        .title .serif{font-size:.55em;letter-spacing:-.02em;color:var(--rose)}
        .focus{max-width:34ch;font-size:clamp(15px,1.25vw,18px);line-height:1.5;color:var(--ink-2)}
        .focus strong{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--wine);margin-right:6px}
        .ctas{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center;margin-top:6px}
        .hr{list-style:none;padding:0;margin:0;display:grid;gap:0;width:100%;max-width:460px}
        .hr li{display:grid;grid-template-columns:44px 1fr;gap:4px 10px;padding:18px 0;border-top:1px solid var(--line)}
        .hr li:last-child{border-bottom:1px solid var(--line)}
        .hr .mono{grid-row:span 2;font-family:var(--font-brand);font-size:15px;font-weight:500;color:var(--rose);padding-top:5px}
        .hr strong{font-family:var(--font-brand);font-weight:600;font-size:clamp(21px,1.9vw,28px);letter-spacing:-.03em;line-height:1.15}
        .hr small{font-family:var(--font-brand);font-size:clamp(14.5px,1.15vw,17px);color:var(--mute);line-height:1.4}
        @media (min-width:1050px){
            .hero{padding-top:0}
          .hgrid{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:32px}
          .stage{order:0;height:min(84svh,900px)}
          .title{font-size:clamp(40px,4.6vw,76px)}
          .hl{align-items:flex-start;text-align:left}
          .title{align-items:flex-start}
          .ctas{justify-content:flex-start}
          .hr{justify-self:end;max-width:400px}
        }
        @media (prefers-reduced-motion:reduce){.vid{transition:none}.halo::before,.fchip{animation:none}}
      `}</style>
    </section>
  );
}
