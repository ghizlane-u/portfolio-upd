"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import LangToggle from "./ui/LangToggle";
import LinkedInLink from "./ui/LinkedInLink";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

export default function Navigation() {
  const { NAV, PROFILE, ui } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [ind, setInd] = useState({ left: 0, width: 0, show: false });
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = [...NAV.map((n) => n.id), "certifications"];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const hero = document.getElementById("hero");
    if (hero) {
      const ioHero = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), {
        rootMargin: "-45% 0px -50% 0px",
      });
      ioHero.observe(hero);
      return () => {
        io.disconnect();
        ioHero.disconnect();
      };
    }
    return () => io.disconnect();
  }, [NAV]);

  useLayoutEffect(() => {
    const el = linkRefs.current[active];
    if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth, show: true });
    else setInd((p) => ({ ...p, show: false }));
  }, [active, scrolled, NAV]);

  useEffect(() => {
    setScrollLocked(open);
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToTarget(id), open ? 250 : 0);
  };

  return (
    <>
      <div className="nav-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="nav-brand" onClick={go("top")} aria-label={`${PROFILE.name} — ${ui.brandAria}`}>
          <span className="nav-mark">{PROFILE.initials}</span>
          <span className="nav-name">{PROFILE.name}</span>
        </a>

        <nav className="nav-pill" aria-label={ui.mainNav}>
          <ul ref={listRef}>
            <span
              className="nav-ind"
              aria-hidden
              style={{ left: ind.left, width: ind.width, opacity: ind.show ? 1 : 0 }}
            />
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  ref={(el) => {
                    linkRefs.current[n.id] = el;
                  }}
                  className={active === n.id ? "is-active" : ""}
                  onClick={go(n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-right">
          <span className="nav-li"><LinkedInLink small /></span>
          <LangToggle />
          <button
            className="nav-menu"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {ui.menu}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button className="menu-close" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
          {ui.close}
        </button>
        <ul>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a href={`#${n.id}`} onClick={go(n.id)} tabIndex={open ? 0 : -1}>
                <span className="mono">0{i + 1}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .nav-progress{position:fixed;inset:0 0 auto 0;height:2px;background:var(--grad);transform-origin:left;z-index:60}
        .nav{position:fixed;top:14px;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding-inline:var(--gutter);pointer-events:none}
        .nav>*{pointer-events:auto}
        .nav-brand{display:flex;align-items:center;gap:12px}
        .nav-mark{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:14px;letter-spacing:-.02em;box-shadow:inset 0 0 0 1.5px var(--wine);transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .nav.is-scrolled .nav-mark{background:var(--grad);color:#fff}
        .nav-brand:hover .nav-mark{transform:rotate(360deg)}
        .nav-name{font-weight:600;letter-spacing:-.02em;transition:opacity .4s var(--ease),transform .4s var(--ease)}
        .nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px)}
        .nav-pill{position:absolute;left:50%;transform:translateX(-50%);display:none}
        .nav-pill ul{position:relative;display:flex;gap:2px;padding:5px;border-radius:999px;list-style:none;margin:0;transition:background .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
        .nav.is-scrolled .nav-pill ul{background:rgba(255,255,255,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px rgba(29,26,59,.06)}
        .nav-pill a{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;transition:color .4s var(--ease)}
        .nav-pill a.is-active{color:#fff}
        .nav-ind{position:absolute;top:5px;bottom:5px;border-radius:999px;background:var(--grad);transition:left .6s var(--ease),width .6s var(--ease),opacity .3s}
        .nav-right{display:flex;align-items:center;gap:8px}
        .nav-li{display:none}
        .nav-menu{height:40px;padding-inline:20px;border-radius:999px;font-weight:600;font-size:14px;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line)}
        .menu{position:fixed;inset:0;z-index:70;background:var(--paper);clip-path:circle(0% at calc(100% - 50px) 36px);transition:clip-path .9s var(--ease);visibility:hidden;padding:90px var(--gutter) 40px;display:flex;flex-direction:column}
        .menu.is-open{clip-path:circle(150% at calc(100% - 50px) 36px);visibility:visible}
        .menu-close{position:absolute;top:18px;right:var(--gutter);height:40px;padding-inline:20px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-weight:600;font-size:14px}
        .menu ul{list-style:none;margin:auto 0;padding:0}
        .menu li{overflow:hidden}
        .menu li a{display:flex;align-items:baseline;gap:16px;font-size:clamp(40px,12vw,72px);font-weight:700;letter-spacing:-.045em;line-height:1.15;transform:translateY(110%);transition:transform .9s var(--ease);transition-delay:calc(var(--i) * 70ms + 200ms)}
        .menu.is-open li a{transform:none}
        .menu li .mono{font-size:13px;font-weight:400;color:var(--mute);letter-spacing:.05em}
        @media (min-width:900px){.nav-pill{display:block}.nav-menu{display:none}.nav-li{display:block}}
      `}</style>
    </>
  );
}
