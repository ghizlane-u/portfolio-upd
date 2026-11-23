"use client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import { answer, type Action, type Reply } from "@/lib/chatbot";
import { useLang } from "@/lib/i18n";
import { scrollToTarget } from "@/lib/scroll";
import Robot from "./Robot";

type Msg = { id: number; role: "user" | "bot"; text: string; actions?: Action[]; chips?: string[]; fresh?: boolean };

const TXT = {
  fr: {
    open: "Ouvrir l'assistant",
    close: "Fermer l'assistant",
    hello: "Bonjour ! 👋",
    sub: "Comment puis-je vous aider ?",
    intro: "Je réponds à partir des informations du portfolio.",
    ph: "Posez-moi une question…",
    send: "Envoyer",
    teaser: "Posez-moi une question 👋",
    popTitle: "Une question ? Je suis là 👋",
    popText: "Je suis l'assistant du portfolio : demandez-moi ses projets, ses compétences ou comment la contacter.",
    popCta: "Discuter avec l'assistant",
    popClose: "Fermer cette invitation",
    typing: "L'assistant écrit",
    cards: [
      { t: "Projets", d: "IA, VR, Web, Industrie", q: "Quels sont ses projets ?", c: "violet", i: "◆" },
      { t: "Compétences", d: "Langages, IA, cloud", q: "Quelles compétences ?", c: "amber", i: "✦" },
      { t: "Parcours", d: "Études et stages", q: "Parle-moi de son parcours", c: "mint", i: "●" },
      { t: "Contact", d: "E-mail, LinkedIn", q: "Comment la contacter ?", c: "rose", i: "✉" },
    ],
  },
  en: {
    open: "Open the assistant",
    close: "Close the assistant",
    hello: "Hello! 👋",
    sub: "How can I help you today?",
    intro: "I answer from the information in this portfolio.",
    ph: "Ask me anything…",
    send: "Send",
    teaser: "Ask me anything 👋",
    popTitle: "Got a question? I'm here 👋",
    popText: "I'm the portfolio assistant: ask about her projects, skills or how to get in touch.",
    popCta: "Chat with the assistant",
    popClose: "Dismiss this invitation",
    typing: "The assistant is typing",
    cards: [
      { t: "Projects", d: "AI, VR, Web, Industry", q: "What are her projects?", c: "violet", i: "◆" },
      { t: "Skills", d: "Languages, AI, cloud", q: "What skills does she have?", c: "amber", i: "✦" },
      { t: "Journey", d: "Education & internships", q: "Tell me about her journey", c: "mint", i: "●" },
      { t: "Contact", d: "Email, LinkedIn", q: "How can I contact her?", c: "rose", i: "✉" },
    ],
  },
} as const;

/** Rend le texte avec liens cliquables (URL et e-mails). */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noreferrer">{p.replace(/^https?:\/\/(www\.)?/, "")}</a>
        ) : /@/.test(p) && /^[\w.+-]+@/.test(p) ? (
          <a key={i} href={`mailto:${p}`}>{p}</a>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** Message du robot : le texte s'écrit progressivement, puis les boutons apparaissent. */
function BotBubble({ m, onTick, onAction, onChip }: { m: Msg; onTick: () => void; onAction: (a: Action) => void; onChip: (c: string) => void }) {
  const [n, setN] = useState(m.fresh ? 0 : m.text.length);
  useEffect(() => {
    if (!m.fresh) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(m.text.length); return; }
    const id = setInterval(() => {
      setN((v) => {
        const next = Math.min(m.text.length, v + 3);
        if (next >= m.text.length) clearInterval(id);
        return next;
      });
      onTick();
    }, 16);
    return () => clearInterval(id);
  }, [m.fresh, m.text, onTick]);
  const done = n >= m.text.length;
  return (
    <div className="cb-row bot">
      <span className="cb-av"><Robot uid={`m${m.id}`} mini /></span>
      <div className="cb-col">
        <div className="cb-bub"><Linkified text={m.text.slice(0, n)} /></div>
        {done && m.actions && m.actions.length > 0 && (
          <div className="cb-acts">
            {m.actions.map((a) => (
              <button key={a.label} onClick={() => onAction(a)}>{a.label} <span aria-hidden>↗</span></button>
            ))}
          </div>
        )}
        {done && m.chips && m.chips.length > 0 && (
          <div className="cb-chips">
            {m.chips.map((c) => <button key={c} onClick={() => onChip(c)}>{c}</button>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const content = useContent();
  const { lang } = useLang();
  const t = TXT[lang];
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);

  const toBottom = useCallback(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Pop-up d'invitation : apparaît peu après l'arrivée sur le site pour signaler l'assistant.
  // Elle ne revient plus une fois que le visiteur a ouvert le chat ou fermé l'invitation (durant la visite).
  useEffect(() => {
    let used = false;
    try { used = sessionStorage.getItem("chat-used") === "1"; } catch {}
    if (used) return;
    const a = setTimeout(() => setTeaser(true), 2500);
    const b = setTimeout(() => setTeaser(false), 22000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  const dismissTeaser = useCallback(() => {
    setTeaser(false);
    try { sessionStorage.setItem("chat-used", "1"); } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    dismissTeaser();
    const f = setTimeout(() => field.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(f); window.removeEventListener("keydown", onKey); };
  }, [open, dismissTeaser]);

  useEffect(toBottom, [msgs, typing, toBottom]);

  const send = useCallback((raw: string) => {
    const q = raw.trim();
    if (!q || typing) return;
    setInput("");
    setMsgs((m) => [...m, { id: idRef.current++, role: "user", text: q }]);
    setTyping(true);
    const reply: Reply = answer(q, content, lang);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: idRef.current++, role: "bot", text: reply.text, actions: reply.actions, chips: reply.chips, fresh: true }]);
    }, 650 + Math.min(700, reply.text.length * 3));
  }, [content, lang, typing]);

  const doAction = (a: Action) => {
    if (a.project) window.dispatchEvent(new CustomEvent("open-project", { detail: a.project }));
    else if (a.target) scrollToTarget(a.target);
    if (window.innerWidth < 700) setOpen(false);
  };

  const empty = msgs.length === 0;

  return (
    <>
      <div className={`cb-fab-wrap ${open ? "is-open" : ""}`}>
        {teaser && !open && (
          <div className="cb-pop" role="dialog" aria-label={t.popTitle}>
            <button className="cb-pop-x" onClick={dismissTeaser} aria-label={t.popClose}>✕</button>
            <div className="cb-pop-top">
              <span className="cb-av"><Robot uid="pop" mini /></span>
              <strong>{t.popTitle}</strong>
            </div>
            <p>{t.popText}</p>
            <button className="cb-pop-cta" onClick={() => setOpen(true)}>{t.popCta} <span aria-hidden>↗</span></button>
          </div>
        )}
        <button className="cb-fab" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? t.close : t.open}>
          <span className="cb-ring" aria-hidden />
          {open ? <span className="cb-x" aria-hidden>✕</span> : <Robot uid="fab" mini />}
          {!open && <span className="cb-dot" aria-hidden />}
        </button>
      </div>

      <div className={`cb-panel ${open ? "on" : ""}`} role="dialog" aria-label={t.open} aria-hidden={!open}>
        <header className="cb-head">
          <span className="cb-brand">{content.PROFILE.firstName}<i>.ai</i></span>
          <button className="cb-close" onClick={() => setOpen(false)} aria-label={t.close}>✕</button>
        </header>

        <div className="cb-body" ref={list} aria-live="polite">
          {empty ? (
            <div className="cb-hero">
              <div className="cb-robotwrap">
                <Robot uid="hero" className="cb-bigrobot" />
                <span className="cb-voice" aria-hidden><b /><b /><b /><b /><b /></span>
                <span className="cb-spark s1" aria-hidden />
                <span className="cb-spark s2" aria-hidden />
              </div>
              <h3>{t.hello}</h3>
              <p className="cb-sub">{t.sub}</p>
              <p className="cb-intro">{t.intro}</p>
              <div className="cb-cards">
                {t.cards.map((c, i) => (
                  <button key={c.t} className={`cb-card ${c.c}`} style={{ ["--d" as string]: `${i * 70 + 200}ms` }} onClick={() => send(c.q)}>
                    <span className="ic" aria-hidden>{c.i}</span>
                    <strong>{c.t}</strong>
                    <small>{c.d}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="cb-msgs">
              {msgs.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="cb-row user"><div className="cb-bub">{m.text}</div></div>
                ) : (
                  <BotBubble key={m.id} m={m} onTick={toBottom} onAction={doAction} onChip={send} />
                ),
              )}
              {typing && (
                <div className="cb-row bot" role="status" aria-label={t.typing}>
                  <span className="cb-av"><Robot uid="typing" mini /></span>
                  <div className="cb-bub cb-dots"><i /><i /><i /></div>
                </div>
              )}
            </div>
          )}
        </div>

        <form className="cb-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input ref={field} value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.ph} aria-label={t.ph} maxLength={200} />
          <button type="submit" aria-label={t.send} disabled={!input.trim() || typing}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 17 17 7M8 7h9v9" /></svg>
          </button>
        </form>
      </div>

      <style>{`
        .cb-fab-wrap{position:fixed;right:clamp(14px,2vw,26px);bottom:clamp(14px,2vw,26px);z-index:76;display:flex;align-items:center;gap:12px;flex-direction:row-reverse}
        .cb-fab{position:relative;width:70px;height:70px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#fff,#eadffb);box-shadow:0 18px 44px rgba(108,87,208,.38),inset 0 0 0 1px rgba(255,255,255,.9);transition:transform .5s var(--ease)}
        .cb-fab:hover{transform:scale(1.07) rotate(-3deg)}
        .cb-fab .robot{width:54px;height:54px;animation:cbfloat 3.6s ease-in-out infinite}
        .cb-ring{position:absolute;inset:-5px;border-radius:50%;border:2px solid rgba(108,87,208,.55);animation:cbping 2.4s var(--ease) infinite;pointer-events:none}
        .cb-x{font-size:20px;color:var(--wine);font-weight:700}
        .is-open .cb-ring{display:none}
        .cb-dot{position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:#e5456f;box-shadow:0 0 0 3px #fff,0 4px 10px rgba(229,69,111,.5);animation:cbbeat 1.6s ease-in-out infinite}
        @keyframes cbbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
        .cb-pop{position:absolute;right:0;bottom:calc(100% + 14px);width:min(320px,calc(100vw - 28px));padding:16px 18px 16px;border-radius:24px 24px 6px 24px;background:rgba(255,255,255,.96);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 24px 60px rgba(76,56,160,.32),inset 0 0 0 1px rgba(108,87,208,.14);animation:cbpopup .8s var(--ease) both;transform-origin:100% 100%}
        .cb-pop-top{display:flex;align-items:center;gap:10px;padding-right:26px}
        .cb-pop-top strong{font-family:var(--font-brand);font-size:16px;letter-spacing:-.02em;color:#1d1a3b;line-height:1.2}
        .cb-pop p{margin:10px 0 0;font-size:13.5px;line-height:1.5;color:var(--ink-2)}
        .cb-pop-cta{margin-top:12px;height:40px;padding-inline:18px;border-radius:999px;font-size:13.5px;font-weight:600;color:#fff;background:linear-gradient(135deg,#6c57d0,#8f7be6);box-shadow:0 10px 22px rgba(108,87,208,.32);transition:transform .4s var(--ease)}
        .cb-pop-cta:hover{transform:translateY(-2px)}
        .cb-pop-x{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:12px;color:var(--ink-2);background:rgba(108,87,208,.08);transition:background .3s}
        .cb-pop-x:hover{background:rgba(108,87,208,.18)}
        @keyframes cbpopup{from{opacity:0;transform:translateY(16px) scale(.9)}to{opacity:1;transform:none}}
        .cb-teaser{position:relative;padding:12px 18px;border-radius:20px 20px 4px 20px;font-size:14px;font-weight:500;color:var(--ink);background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 14px 36px rgba(108,87,208,.25),inset 0 0 0 1px rgba(255,255,255,.9);animation:cbpop .7s var(--ease) both}
        @keyframes cbping{0%{transform:scale(.94);opacity:.8}100%{transform:scale(1.35);opacity:0}}
        @keyframes cbfloat{0%,100%{transform:translateY(1px)}50%{transform:translateY(-4px)}}
        @keyframes cbpop{from{opacity:0;transform:translateX(14px) scale(.92)}to{opacity:1;transform:none}}

        .cb-panel{position:fixed;z-index:75;right:clamp(10px,2vw,26px);bottom:calc(clamp(14px,2vw,26px) + 84px);width:min(396px,calc(100vw - 20px));height:min(660px,calc(100svh - 130px));display:flex;flex-direction:column;border-radius:34px;overflow:hidden;background:linear-gradient(180deg,#e6dcf9 0%,#f3edfc 42%,#fff 100%);box-shadow:0 40px 100px rgba(76,56,160,.35),inset 0 0 0 1px rgba(255,255,255,.85);transform-origin:100% 100%;opacity:0;transform:translateY(24px) scale(.9);pointer-events:none;visibility:hidden;transition:opacity .5s var(--ease),transform .6s var(--ease),visibility 0s .6s}
        .cb-panel.on{opacity:1;transform:none;pointer-events:auto;visibility:visible;transition:opacity .5s var(--ease),transform .6s var(--ease)}
        .cb-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 4px}
        .cb-brand{font-family:var(--font-brand);font-weight:600;font-size:26px;letter-spacing:-.03em;color:#6c57d0}
        .cb-brand i{font-style:normal}
        .cb-close{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:14px;color:var(--ink-2);background:rgba(255,255,255,.7);box-shadow:0 6px 16px rgba(108,87,208,.15);transition:transform .4s var(--ease),background .3s}
        .cb-close:hover{transform:rotate(90deg);background:#fff}
        .cb-body{flex:1;overflow-y:auto;padding:8px 18px 14px;scrollbar-width:thin;scrollbar-color:rgba(108,87,208,.3) transparent}

        .cb-hero{display:flex;flex-direction:column;align-items:center;text-align:center}
        .cb-robotwrap{position:relative;width:min(190px,46vw);margin-top:2px;animation:cbrise .9s var(--ease) both}
        .cb-bigrobot{display:block;width:100%;height:auto;animation:cbfloat 4s ease-in-out infinite;filter:drop-shadow(0 22px 22px rgba(108,87,208,.28))}
        .cb-voice{position:absolute;right:-22px;top:6px;width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;gap:3px;background:radial-gradient(circle at 30% 25%,#fff,#e4d6fa 70%);box-shadow:0 10px 24px rgba(108,87,208,.3),inset 0 0 0 1px rgba(255,255,255,.9);animation:cbfloat 3s ease-in-out infinite reverse}
        .cb-voice b{width:3px;height:10px;border-radius:3px;background:#7d63d8;animation:cbwave 1s ease-in-out infinite}
        .cb-voice b:nth-child(2){animation-delay:.12s}.cb-voice b:nth-child(3){animation-delay:.24s}.cb-voice b:nth-child(4){animation-delay:.36s}.cb-voice b:nth-child(5){animation-delay:.48s}
        @keyframes cbwave{0%,100%{height:6px}50%{height:22px}}
        .cb-spark{position:absolute;width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 14px 4px rgba(176,150,240,.8);animation:cbtw 2.6s ease-in-out infinite}
        .cb-spark.s1{right:-30px;top:70px}.cb-spark.s2{left:-14px;top:40px;animation-delay:-1.2s;width:6px;height:6px}
        @keyframes cbtw{0%,100%{opacity:.2;transform:scale(.6)}50%{opacity:1;transform:scale(1.1)}}
        @keyframes cbrise{from{opacity:0;transform:translateY(26px) scale(.9)}to{opacity:1;transform:none}}
        .cb-hero h3{margin-top:6px;font-family:var(--font-brand);font-weight:700;font-size:31px;letter-spacing:-.03em;color:#1d1a3b}
        .cb-sub{font-family:var(--font-brand);font-size:17px;margin-top:4px;color:var(--ink-2)}
        .cb-intro{font-size:12.5px;margin-top:6px;color:var(--mute)}
        .cb-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;margin-top:14px}
        .cb-card{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 14px;border-radius:20px;background:var(--c1);box-shadow:inset 0 0 0 1px rgba(255,255,255,.85),0 8px 20px rgba(108,87,208,.08);animation:cbrise .8s var(--ease) both;animation-delay:var(--d);transition:transform .45s var(--ease),box-shadow .45s var(--ease)}
        .cb-card:hover{transform:translateY(-4px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.9),0 16px 30px rgba(108,87,208,.2)}
        .cb-card .ic{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;font-size:14px;margin-bottom:5px;background:var(--c2);color:var(--c3)}
        .cb-card strong{font-family:var(--font-brand);font-size:14.5px;font-weight:600;color:#1d1a3b}
        .cb-card small{font-size:11.5px;color:var(--mute);line-height:1.3}
        .cb-card.violet{--c1:#efe9fc;--c2:#ddd2fa;--c3:#6c57d0}
        .cb-card.amber{--c1:#fbf3e4;--c2:#fbe5b0;--c3:#d49a12}
        .cb-card.mint{--c1:#e9f6ee;--c2:#c9ecd6;--c3:#2e9d62}
        .cb-card.rose{--c1:#fceaee;--c2:#f9cfd9;--c3:#d6567a}

        .cb-msgs{display:flex;flex-direction:column;gap:12px;padding-top:6px}
        .cb-row{display:flex;gap:8px;align-items:flex-end;animation:cbmsg .5s var(--ease) both}
        .cb-row.user{justify-content:flex-end}
        @keyframes cbmsg{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        .cb-av{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#fff;box-shadow:0 4px 12px rgba(108,87,208,.2)}
        .cb-av .robot{width:26px;height:26px}
        .cb-col{display:flex;flex-direction:column;gap:8px;min-width:0;max-width:calc(100% - 42px)}
        .cb-bub{padding:11px 15px;border-radius:20px;font-size:14px;line-height:1.5;white-space:pre-line;word-break:break-word}
        .cb-row.bot .cb-bub{background:#fff;color:#1d1a3b;border-bottom-left-radius:6px;box-shadow:0 6px 18px rgba(108,87,208,.1)}
        .cb-row.user .cb-bub{max-width:82%;background:linear-gradient(135deg,#6c57d0,#8f7be6);color:#fff;border-bottom-right-radius:6px;box-shadow:0 8px 20px rgba(108,87,208,.3)}
        .cb-bub a{color:#6c57d0;font-weight:600;text-decoration:underline;text-underline-offset:3px;word-break:break-all}
        .cb-acts,.cb-chips{display:flex;flex-wrap:wrap;gap:7px;animation:cbmsg .5s var(--ease) both}
        .cb-acts button{height:34px;padding-inline:14px;border-radius:999px;font-size:12.5px;font-weight:600;color:#fff;background:linear-gradient(135deg,#6c57d0,#8f7be6);box-shadow:0 8px 18px rgba(108,87,208,.3);transition:transform .4s var(--ease)}
        .cb-acts button:hover{transform:translateY(-2px)}
        .cb-chips button{padding:8px 13px;border-radius:999px;font-size:12px;color:#4b3da0;background:#efe9fc;box-shadow:inset 0 0 0 1px rgba(255,255,255,.9);transition:background .3s,transform .4s var(--ease)}
        .cb-chips button:hover{background:#e0d6fa;transform:translateY(-2px)}
        .cb-dots{display:inline-flex;gap:5px;align-items:center;padding:14px 16px}
        .cb-dots i{width:7px;height:7px;border-radius:50%;background:#8f7be6;animation:cbdot 1s ease-in-out infinite}
        .cb-dots i:nth-child(2){animation-delay:.15s}.cb-dots i:nth-child(3){animation-delay:.3s}
        @keyframes cbdot{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-5px);opacity:1}}

        .cb-input{display:flex;align-items:center;gap:8px;margin:6px 16px 16px;padding:6px 6px 6px 18px;border-radius:999px;background:#fff;box-shadow:0 12px 30px rgba(108,87,208,.18),inset 0 0 0 1px rgba(108,87,208,.08)}
        .cb-input input{flex:1;min-width:0;height:40px;border:0;outline:0;background:none;font:inherit;font-size:14.5px;color:#1d1a3b}
        .cb-input input::placeholder{color:#9a95bd}
        .cb-input button{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#6c57d0,#9a85e8);transition:transform .4s var(--ease),opacity .3s}
        .cb-input button:disabled{opacity:.45;cursor:default}
        .cb-input button:not(:disabled):hover{transform:scale(1.08) rotate(8deg)}

        .robot .rb-eye{transform-box:fill-box;transform-origin:center;animation:cbblink 5s infinite}
        .robot .rb-head{transform-box:fill-box;transform-origin:50% 90%;animation:cbtilt 6s ease-in-out infinite}
        @keyframes cbblink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
        @keyframes cbtilt{0%,100%{transform:rotate(0)}30%{transform:rotate(2.5deg)}70%{transform:rotate(-2.5deg)}}
        @media (max-width:520px){.cb-panel{right:8px;width:calc(100vw - 16px);bottom:calc(14px + 80px);height:min(640px,calc(100svh - 110px))}}
        @media (prefers-reduced-motion:reduce){.cb-fab .robot,.cb-bigrobot,.cb-voice,.cb-voice b,.cb-spark,.cb-ring,.cb-dot,.cb-pop,.robot .rb-eye,.robot .rb-head,.cb-card,.cb-robotwrap{animation:none}}
      `}</style>
    </>
  );
}
