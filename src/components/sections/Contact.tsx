"use client";
import { Fragment, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import LinkedInLink from "../ui/LinkedInLink";
import { scrollToTarget } from "@/lib/scroll";

function Hop({ text }: { text: string }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const hop = (i: number) => {
    const el = refs.current[i];
    if (!el || el.classList.contains("hop")) return;
    el.classList.add("hop");
    setTimeout(() => el.classList.remove("hop"), 600);
  };
  let k = 0;
  return (
    <>
      {text.split(" ").map((word, wi, arr) => (
        <Fragment key={wi}>
          <span className="w" aria-hidden>
            {Array.from(word).map((ch) => {
              const i = k++;
              return (
                <span key={i} ref={(el) => { refs.current[i] = el; }} className="ch" onMouseEnter={() => hop(i)}>
                  {ch}
                </span>
              );
            })}
          </span>
          {wi < arr.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export default function Contact() {
  const { PROFILE, ui } = useContent();
  const t = ui.contact;
  const [copied, setCopied] = useState(false);
  const phoneHref = PROFILE.phoneHref;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-h">
      <div className="wrap">
        <span className="tag rv">{t.tag}</span>

        <div className="ccols">
          <div className="cleft">
            <h2 id="contact-h" className="cbig" aria-label={`${t.l1} ${t.l2}`}>
              <span className="line"><Hop text={t.l1} /></span>
              <span className="line serif"><Hop text={t.l2} /></span>
            </h2>
            <div className="badge" aria-hidden>
              <svg viewBox="0 0 200 200">
                <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
                <text fontSize="15"><textPath href="#circ" textLength="480" lengthAdjust="spacing">{t.hello}</textPath></text>
              </svg>
              <span>👋</span>
            </div>
          </div>

          <div className="ccard">
            <div className="crow">
              <span className="clb mono">{t.labels[0]}</span>
              <div className="mailline">
                <a className="mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                <button className="cpy" onClick={copy}>{copied ? t.copied : t.copy}</button>
              </div>
              <span className="sr" role="status">{copied ? t.copiedSr : ""}</span>
            </div>
            <div className="crow">
              <span className="clb mono">{t.labels[1]}</span>
              <a className="val" href={phoneHref}>{PROFILE.phone}</a>
            </div>
            {PROFILE.linkedin && (
              <div className="crow">
                <span className="clb mono">{t.labels[2]}</span>
                <div className="lirow">
                  <LinkedInLink small />
                  <a className="val" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
                </div>
              </div>
            )}
            <div className="crow">
              <span className="clb mono">{t.labels[3]}</span>
              <span className="val">{PROFILE.location}</span>
            </div>
            <div className="crow">
              <a className="btn btn-primary" href={t.pdfHref} download>{t.pdf} ↓</a>
            </div>
          </div>
        </div>

        <footer className="foot">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <button onClick={() => scrollToTarget("top")}>{t.top}</button>
        </footer>
      </div>
      <style>{`
        .contact{overflow-x:clip}
        .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
        .ccols{display:grid;grid-template-columns:minmax(0,1fr);gap:48px;margin-top:36px;align-items:center}
        @media (min-width:1000px){.ccols{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:64px}}
        .cbig{font-size:clamp(36px,5.4vw,86px);line-height:1;letter-spacing:-.05em}
        .cbig .line{display:block}
        .cbig .serif{letter-spacing:-.03em;color:var(--rose)}
        .w{display:inline-block;white-space:nowrap}
        .ch{display:inline-block;transition:transform .5s var(--ease)}
        .ch.hop{animation:hop .6s var(--ease)}
        @keyframes hop{0%{transform:none}35%{transform:translateY(-.16em)}100%{transform:none}}
        .badge{position:relative;width:130px;height:130px;margin-top:40px}
        .badge svg{width:100%;height:100%;animation:spin 18s linear infinite;fill:var(--wine)}
        .badge span{position:absolute;inset:0;display:grid;place-items:center;font-size:30px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ccard{padding:6px clamp(20px,3vw,34px);border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 30px 80px rgba(108,87,208,.1)}
        .crow{display:grid;gap:8px;padding:20px 0;border-top:1px solid var(--line)}
        .crow:first-child{border-top:0}
        .clb{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
        .mailline{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px}
        .mail{font-size:clamp(18px,2vw,26px);font-weight:600;letter-spacing:-.03em;color:var(--wine);word-break:break-all}
        .mail:hover{text-decoration:underline;text-underline-offset:5px}
        .cpy{flex:none;height:32px;padding-inline:14px;border-radius:999px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(108,87,208,.3);color:var(--wine);transition:background .4s,color .4s}
        .cpy:hover{background:var(--grad);color:#fff}
        .val{font-size:clamp(17px,1.5vw,20px);font-weight:500;color:var(--ink)}
        a.val:hover{color:var(--wine);text-decoration:underline;text-underline-offset:4px}
        .lirow{display:flex;align-items:center;gap:12px}
        .foot{display:flex;flex-wrap:wrap;gap:16px 32px;justify-content:space-between;margin-top:clamp(70px,10vh,120px);padding-top:26px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
        .foot button:hover{color:var(--wine)}
        @media (prefers-reduced-motion:reduce){.badge svg{animation:none}}
      `}</style>
    </section>
  );
}
