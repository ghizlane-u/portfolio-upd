"use client";

/** Petit robot 3D stylisé (SVG) : tête nacrée, visière violette, yeux lumineux qui clignent. */
export default function Robot({ uid, mini = false, className = "" }: { uid: string; mini?: boolean; className?: string }) {
  const id = (n: string) => `${n}-${uid}`;
  return (
    <svg
      className={`robot ${className}`}
      viewBox={mini ? "18 14 164 164" : "0 0 200 235"}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id("hd")} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#efe6fa" />
          <stop offset="1" stopColor="#d8c6f0" />
        </radialGradient>
        <linearGradient id={id("vz")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#231a4d" />
          <stop offset="0.6" stopColor="#4b3590" />
          <stop offset="1" stopColor="#a87be0" />
        </linearGradient>
        <radialGradient id={id("ea")} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#f6eefe" />
          <stop offset="1" stopColor="#b79be8" />
        </radialGradient>
        <linearGradient id={id("bd")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f0fb" />
          <stop offset="1" stopColor="#e3d6f3" />
        </linearGradient>
        <filter id={id("gl")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {!mini && (
        <g className="rb-body">
          <ellipse cx="100" cy="222" rx="66" ry="44" fill={`url(#${id("bd")})`} />
          <ellipse cx="62" cy="190" rx="20" ry="30" fill={`url(#${id("bd")})`} opacity=".9" />
          <ellipse cx="138" cy="190" rx="20" ry="30" fill={`url(#${id("bd")})`} opacity=".9" />
          <circle cx="100" cy="196" r="6" fill="none" stroke="#c9b3ea" strokeWidth="2" />
        </g>
      )}

      <g className="rb-head">
        <ellipse cx="26" cy="100" rx="13" ry="25" fill={`url(#${id("ea")})`} />
        <ellipse cx="174" cy="100" rx="13" ry="25" fill={`url(#${id("ea")})`} />
        <ellipse cx="26" cy="100" rx="6" ry="14" fill="#fff" opacity=".35" />
        <ellipse cx="174" cy="100" rx="6" ry="14" fill="#fff" opacity=".35" />
        <circle cx="100" cy="96" r="72" fill={`url(#${id("hd")})`} />
        <rect x="42" y="58" width="116" height="80" rx="38" fill={`url(#${id("vz")})`} />
        <ellipse cx="74" cy="70" rx="26" ry="8" fill="#fff" opacity=".22" transform="rotate(-18 74 70)" />
        <g filter={`url(#${id("gl")})`}>
          <rect className="rb-eye" x="72" y="84" width="14" height="24" rx="7" fill="#fff" />
          <rect className="rb-eye" x="114" y="84" width="14" height="24" rx="7" fill="#fff" />
        </g>
        <path d="M89 120 Q100 129 111 120" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" opacity=".9" />
        <ellipse cx="68" cy="40" rx="24" ry="9" fill="#fff" opacity=".6" transform="rotate(-24 68 40)" />
      </g>
    </svg>
  );
}
