"use client";
import { useContent } from "@/lib/content";

/** Bandeau défilant des domaines et technologies clés (animation CSS, pause au survol). */
export default function Marquee() {
  const { FOCUS, SKILL_GROUPS } = useContent();
  const items = [
    ...FOCUS.map((f) => f.t),
    ...SKILL_GROUPS.flatMap((g) => g.skills.slice(0, 2)),
  ];
  const loop = [...items, ...items];
  return (
    <div className="mq" aria-hidden>
      <div className="mq-track">
        {loop.map((t, i) => (
          <span key={i} className="mq-chip"><i />{t}</span>
        ))}
      </div>
    </div>
  );
}
