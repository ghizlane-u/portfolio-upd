"use client";
import { useContent } from "@/lib/content";

export default function Certifications() {
  const { CERTIFICATIONS, ui } = useContent();
  const t = ui.certs;
  return (
    <section id="certifications" className="certs" aria-labelledby="certs-h">
      <div className="wrap cgrid section">
        <div className="sticky">
          <span className="tag rv">{t.tag}</span>
          <h2 id="certs-h" className="h2" style={{ maxWidth: "9ch" }}>
            <span className="rv-mask"><span>{t.h1}</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span className="serif">{t.h2}</span></span>
          </h2>
          <p className="mono count rv" style={{ ["--i" as string]: 2 }}>{t.count(CERTIFICATIONS.length)}</p>
        </div>
        <ol className="list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.id} className="rv" style={{ ["--i" as string]: i % 4 }}>
              <div tabIndex={0} className="row">
                <span className="n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="t">
                  <strong>{c.title}</strong>
                  <small>{[c.issuer, c.year].filter(Boolean).join(" · ")}</small>
                </span>
                <span className="ar" aria-hidden>↗</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .certs{background:var(--card);border-block:1px solid var(--line)}
        .cgrid{display:grid;grid-template-columns:minmax(0,1fr);gap:48px}
        @media (min-width:1000px){.cgrid{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:80px}.certs .sticky{position:sticky;top:110px;align-self:start}}
        .certs .count{margin-top:28px;font-size:12px;color:var(--mute);letter-spacing:.06em;text-transform:uppercase}
        .certs .list{list-style:none;padding:0;margin:0}
        .certs .row{position:relative;display:grid;grid-template-columns:44px minmax(0,1fr) 24px;align-items:center;gap:12px;padding:22px 16px;border-top:1px solid var(--line);overflow:hidden;isolation:isolate;transition:color .45s var(--ease)}
        .certs li:last-child .row{border-bottom:1px solid var(--line)}
        .certs .row::before{content:"";position:absolute;inset:0;background:var(--grad);transform:scaleX(0);transform-origin:left;transition:transform .7s var(--ease);z-index:-1}
        .certs .row:hover,.certs .row:focus-visible{color:#fff}
        .certs .row:hover::before,.certs .row:focus-visible::before{transform:scaleX(1)}
        .certs .n{font-size:12px;color:var(--mute);transition:color .45s}
        .certs .row:hover .n,.certs .row:focus-visible .n{color:#DCD8F6}
        .certs .t{display:flex;flex-direction:column;gap:3px}
        .certs .t strong{font-size:clamp(17px,1.7vw,22px);font-weight:600;letter-spacing:-.03em;line-height:1.2}
        .certs .t small{font-size:13px;color:var(--mute);transition:color .45s}
        .certs .row:hover small,.certs .row:focus-visible small{color:#ECE8FA}
        .certs .ar{opacity:0;transform:translate(-10px,6px);transition:opacity .4s var(--ease),transform .5s var(--ease)}
        .certs .row:hover .ar,.certs .row:focus-visible .ar{opacity:1;transform:none}
      `}</style>
    </section>
  );
}
