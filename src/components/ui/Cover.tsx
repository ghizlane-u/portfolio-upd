import React from "react";

/**
 * Couvertures de projets : illustrations vectorielles originales, dessinées en code,
 * en niveaux de gris. Ce ne sont pas des captures d'écran des projets.
 */

const INK = "#5e4bc4";
const G1 = "#CB73A5";
const G2 = "#EDC2D3";
const G3 = "#E4E2F8";

const q = (n: number) => Math.round(n * 100) / 100;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function Bubble({ x, y, w, h, lines = 2, dark = false }: { x: number; y: number; w: number; h: number; lines?: number; dark?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={dark ? INK : "#FFFFFF"} stroke={INK} strokeOpacity={dark ? 0 : 0.5} />
      {Array.from({ length: lines }).map((_, i) => (
        <rect key={i} x={x + 10} y={y + 10 + i * 11} width={(w - 20) * (i === lines - 1 ? 0.6 : 1)} height={4} rx={2} fill={dark ? "#FFFFFF" : G2} />
      ))}
    </g>
  );
}

function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 C-7 -9 -12 -16 -12 -23 a12 12 0 1 1 24 0 c0 7 -5 14 -12 23z" fill={INK} />
      <circle cy={-23} r={4.5} fill="#FFFFFF" />
    </g>
  );
}

function Scene({ kind }: { kind: string }) {
  switch (kind) {
    case "agent": {
      const nodes: [number, number][] = [[88, 62], [312, 58], [76, 186], [326, 190], [200, 30], [200, 222]];
      return (
        <>
          <circle cx={200} cy={125} r={62} fill="none" stroke={INK} strokeOpacity={0.18} strokeDasharray="3 6" />
          {nodes.map(([x, y], i) => (
            <line key={i} x1={200} y1={125} x2={x} y2={y} stroke={INK} strokeOpacity={0.35} />
          ))}
          {nodes.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={15} fill="#FFFFFF" stroke={INK} strokeOpacity={0.6} />
              <rect x={x - 6} y={y - 2} width={12} height={4} rx={2} fill={INK} />
              <rect x={x - 6} y={y - 8} width={7 + (i % 3) * 2} height={3} rx={1.5} fill={G2} />
            </g>
          ))}
          <circle cx={200} cy={125} r={36} fill={INK} />
          <circle cx={190} cy={120} r={4} fill="#FFFFFF" />
          <circle cx={210} cy={120} r={4} fill="#FFFFFF" />
          <path d="M188 134 Q200 144 212 134" stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </>
      );
    }
    case "tourism":
      return (
        <>
          {[[30, 40, 70, 44], [120, 30, 50, 60], [300, 150, 70, 52], [40, 150, 60, 50], [250, 40, 60, 40]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={8} fill={G3} transform={`rotate(${i % 2 ? -5 : 6} ${x + w / 2} ${y + h / 2})`} />
          ))}
          <path d="M40 200 C110 120 150 214 214 142 S330 100 362 62" fill="none" stroke={INK} strokeWidth={2.4} strokeDasharray="2 8" strokeLinecap="round" />
          <Pin x={40} y={200} />
          <Pin x={214} y={142} />
          <Pin x={362} y={62} />
          <Bubble x={120} y={190} w={86} h={36} />
        </>
      );
    case "dashboard": {
      const ticks = Array.from({ length: 11 }).map((_, i) => {
        const a = Math.PI + (i / 10) * Math.PI;
        return [q(150 + Math.cos(a) * 78), q(175 + Math.sin(a) * 78), q(150 + Math.cos(a) * 66), q(175 + Math.sin(a) * 66)] as const;
      });
      const na = Math.PI + 0.72 * Math.PI;
      return (
        <>
          <path d="M60 175 A90 90 0 0 1 240 175" fill="none" stroke={INK} strokeWidth={3} />
          {ticks.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeOpacity={0.55} strokeWidth={2} />
          ))}
          <line x1={150} y1={175} x2={q(150 + Math.cos(na) * 58)} y2={q(175 + Math.sin(na) * 58)} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={150} cy={175} r={8} fill={INK} />
          <path d="M150 104 L138 126 H162 Z" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <rect x={148.6} y={111} width={2.8} height={8} rx={1.4} fill={INK} />
          <circle cx={150} cy={122.2} r={1.6} fill={INK} />
          <Bubble x={262} y={60} w={110} h={40} dark />
          <Bubble x={262} y={112} w={110} h={52} />
          <rect x={262} y={178} width={80} height={22} rx={11} fill="none" stroke={INK} strokeOpacity={0.4} />
        </>
      );
    }
    case "vision": {
      const hex = Array.from({ length: 6 }).map((_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${q(200 + Math.cos(a) * 62)},${q(125 + Math.sin(a) * 62)}`;
      });
      const L = (x: number, y: number, dx: number, dy: number) => `M${x} ${y + dy * 16} V${y} H${x + dx * 16}`;
      return (
        <>
          <polygon points={hex.join(" ")} fill="#FFFFFF" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
          <circle cx={200} cy={125} r={26} fill={G3} stroke={INK} strokeWidth={2} />
          <circle cx={200} cy={125} r={14} fill="#FFFFFF" stroke={INK} strokeOpacity={0.4} />
          <g fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round">
            <path d={L(120, 45, 1, 1)} />
            <path d={L(280, 45, -1, 1)} />
            <path d={L(120, 205, 1, -1)} />
            <path d={L(280, 205, -1, -1)} />
          </g>
          <line x1={110} y1={142} x2={290} y2={142} stroke={INK} strokeOpacity={0.3} strokeDasharray="4 4" />
          <rect x={226} y={92} width={30} height={22} rx={3} fill="none" stroke={INK} strokeWidth={2} strokeDasharray="4 3" />
          <rect x={226} y={80} width={44} height={10} rx={3} fill={INK} />
          <rect x={232} y={83.5} width={22} height={3} rx={1.5} fill="#FFFFFF" />
          <rect x={28} y={34} width={64} height={6} rx={3} fill={G2} />
          <rect x={28} y={46} width={40} height={6} rx={3} fill={G3} />
        </>
      );
    }
    case "scatter": {
      const r = rng(7);
      const cl: [number, number, string][] = [[125, 90, INK], [265, 85, G1], [205, 180, G2]];
      const pts = cl.flatMap(([cx, cy, f]) =>
        Array.from({ length: 24 }).map(() => {
          const a = r() * Math.PI * 2;
          const d = Math.sqrt(r()) * 44;
          return [q(cx + Math.cos(a) * d * 1.3), q(cy + Math.sin(a) * d), f] as const;
        }),
      );
      return (
        <>
          <path d="M26 224 H376 M26 224 V26" stroke={INK} strokeOpacity={0.25} fill="none" />
          {pts.map(([x, y, f], i) => (
            <circle key={i} cx={x} cy={y} r={3.6} fill={f} />
          ))}
          <circle cx={125} cy={90} r={9} fill="none" stroke={INK} strokeWidth={2} />
          {[[150, 108], [102, 76], [138, 70]].map(([x, y], i) => (
            <line key={i} x1={125} y1={90} x2={x} y2={y} stroke={INK} strokeWidth={1.4} />
          ))}
        </>
      );
    }
    case "paris":
      return (
        <>
          <line x1={20} y1={214} x2={380} y2={214} stroke={INK} strokeOpacity={0.4} />
          <path d="M148 214 C174 150 188 90 200 36 C212 90 226 150 252 214" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d="M172 214 Q200 168 228 214" fill="none" stroke={INK} strokeWidth={2.4} />
          <path d="M168 160 H232 M182 112 H218 M192 76 H208" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M168 160 L218 112 M232 160 L182 112 M182 112 L208 76 M218 112 L192 76 M158 190 L226 160 M242 190 L174 160" stroke={INK} strokeOpacity={0.45} strokeWidth={1.4} />
          <line x1={200} y1={36} x2={200} y2={22} stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
          <Bubble x={280} y={46} w={92} h={44} />
          <Bubble x={36} y={96} w={84} h={34} dark />
        </>
      );
    case "plant":
      return (
        <>
          <path d="M200 170 C200 130 180 100 150 84 M200 170 C200 120 222 96 256 90 M200 170 V70" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <ellipse cx={142} cy={80} rx={26} ry={11} transform="rotate(30 142 80)" fill={G1} />
          <ellipse cx={264} cy={86} rx={26} ry={11} transform="rotate(-24 264 86)" fill={G2} />
          <ellipse cx={200} cy={58} rx={11} ry={26} fill={INK} />
          <path d="M166 168 H234 L224 216 H176 Z" fill={INK} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={286} y={52 + i * 50} width={88} height={38} rx={9} fill="#FFFFFF" stroke={INK} strokeOpacity={0.5} />
              <rect x={296} y={64 + i * 50} width={[56, 38, 66][i]} height={5} rx={2.5} fill={INK} />
              <rect x={296} y={74 + i * 50} width={30} height={4} rx={2} fill={G2} />
            </g>
          ))}
          <polyline points="26,196 52,170 78,184 104,150 130,166" fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
        </>
      );
    case "pipeline": {
      const xs = [20, 86, 152, 218, 284];
      const labels = [28, 20, 26, 24, 22];
      return (
        <>
          {[60, 125, 190].map((y, i) => (
            <line key={i} x1={20} y1={y + 52} x2={380} y2={y + 52} stroke={INK} strokeOpacity={0.12} strokeDasharray="2 5" />
          ))}
          {xs.map((x, i) => (
            <g key={i}>
              <rect x={x} y={100} width={50} height={58} rx={12} fill={i === 0 ? INK : "#FFFFFF"} stroke={INK} strokeOpacity={i === 0 ? 0 : 0.55} />
              <rect x={x + 10} y={120} width={labels[i]} height={5} rx={2.5} fill={i === 0 ? "#FFFFFF" : INK} />
              <rect x={x + 10} y={131} width={labels[i] - 8} height={4} rx={2} fill={i === 0 ? "#C3C6F1" : G2} />
              {i < xs.length - 1 && <path d={`M${x + 53} 129 H${x + 63} m-4 -4 l4 4 l-4 4`} fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />}
            </g>
          ))}
          <rect x={352} y={100} width={30} height={58} rx={10} fill={G3} />
          <polyline points="30,70 70,48 110,60 150,34 190,46 230,26" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={30} y={196} width={90} height={8} rx={4} fill={G2} />
          <rect x={30} y={212} width={150} height={8} rx={4} fill={G3} />
        </>
      );
    }
    case "field":
      return (
        <>
          <path d="M200 78 L-20 250 M200 78 L50 250 M200 78 L125 250 M200 78 L200 250 M200 78 L275 250 M200 78 L350 250 M200 78 L420 250" stroke={INK} strokeOpacity={0.45} fill="none" />
          {[96, 112, 134, 166, 214].map((y, i) => (
            <line key={i} x1={0} y1={y} x2={400} y2={y} stroke={INK} strokeOpacity={0.3} />
          ))}
          <g>
            <rect x={150} y={18} width={100} height={44} rx={16} fill={INK} />
            <circle cx={180} cy={40} r={11} fill="#FFFFFF" />
            <circle cx={220} cy={40} r={11} fill="#FFFFFF" />
            <path d="M150 40 H134 M250 40 H266" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          </g>
          <circle cx={310} cy={168} r={6} fill={INK} />
          <circle cx={310} cy={168} r={16} fill="none" stroke={INK} strokeOpacity={0.4} />
          <circle cx={310} cy={168} r={28} fill="none" stroke={INK} strokeOpacity={0.2} />
        </>
      );
    case "pyramids":
      return (
        <>
          <circle cx={316} cy={58} r={24} fill={G3} />
          <path d="M20 205 Q90 188 160 205 T300 205 T400 200" fill="none" stroke={INK} strokeOpacity={0.3} />
          <polygon points="150,205 300,205 225,76" fill={G3} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <polygon points="225,76 300,205 238,205" fill={G2} />
          <polygon points="62,205 190,205 126,128" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <polygon points="126,128 190,205 138,205" fill={G3} />
          <polygon points="262,205 344,205 303,152" fill={G1} />
          <line x1={20} y1={205} x2={380} y2={205} stroke={INK} strokeWidth={2.2} />
        </>
      );
    case "arcade":
      return (
        <>
          <rect x={138} y={26} width={124} height={204} rx={12} fill="#FFFFFF" stroke={INK} strokeWidth={2.2} />
          <rect x={154} y={44} width={92} height={72} rx={6} fill={INK} />
          {[[170, 60], [190, 78], [212, 62], [226, 92], [176, 96]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={9} height={9} rx={2} fill="#FFFFFF" fillOpacity={0.9 - i * 0.12} />
          ))}
          <line x1={186} y1={176} x2={186} y2={154} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <circle cx={186} cy={150} r={9} fill={INK} />
          {[[218, 166], [238, 166], [228, 186]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={7.5} fill={i === 2 ? INK : G2} stroke={INK} />
          ))}
          <rect x={176} y={198} width={48} height={8} rx={4} fill={G3} />
          <g>
            <rect x={300} y={118} width={72} height={34} rx={14} fill={INK} />
            <circle cx={322} cy={135} r={7} fill="#FFFFFF" />
            <circle cx={350} cy={135} r={7} fill="#FFFFFF" />
          </g>
        </>
      );
    case "circuit":
      return (
        <>
          <g fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 66 H100 V108 H176" />
            <path d="M24 150 H70 L78 138 L92 162 L106 138 L120 162 L128 150 H176" />
            <path d="M24 204 H130 V226" strokeOpacity={0.5} />
          </g>
          {[[24, 66], [100, 108], [176, 108], [24, 150], [176, 150]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={5.5} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          ))}
          <rect x={190} y={92} width={52} height={74} rx={8} fill={INK} />
          <rect x={200} y={104} width={32} height={5} rx={2.5} fill="#FFFFFF" />
          <rect x={200} y={116} width={22} height={4} rx={2} fill="#C3C6F1" />
          <path d="M242 112 H256 M242 146 H256" stroke={INK} strokeWidth={2.4} />
          <g>
            <rect x={286} y={206} width={70} height={14} rx={4} fill={INK} />
            <path d="M321 206 V160 L362 132 L346 92" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M321 206 V160 L362 132 L346 92" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            {[[321, 160], [362, 132]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={8} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
            ))}
            <path d="M340 86 l12 0 M346 92 l-8 -8 M346 92 l8 -8" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          </g>
        </>
      );
    case "storefront":
      return (
        <>
          <rect x={24} y={24} width={352} height={22} rx={11} fill={G3} />
          <circle cx={42} cy={35} r={4} fill={INK} />
          {[50, 128, 206].map((x, i) => (
            <g key={i}>
              <rect x={x} y={62} width={68} height={100} rx={12} fill="#FFFFFF" stroke={INK} strokeOpacity={0.5} />
              <circle cx={x + 34} cy={96} r={20} fill={i === 1 ? INK : G3} stroke={INK} strokeOpacity={0.4} />
              <circle cx={x + 34} cy={96} r={9} fill="#FFFFFF" fillOpacity={i === 1 ? 0.9 : 0.8} />
              <rect x={x + 10} y={130} width={48} height={5} rx={2.5} fill={INK} />
              <rect x={x + 10} y={141} width={30} height={4} rx={2} fill={G2} />
            </g>
          ))}
          <g>
            <rect x={300} y={62} width={76} height={100} rx={10} fill="#FFFFFF" stroke={INK} strokeOpacity={0.5} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={312} y={76 + i * 14} width={i === 3 ? 30 : 52} height={4} rx={2} fill={i === 3 ? INK : G2} />
            ))}
            <rect x={312} y={140} width={52} height={12} rx={6} fill={INK} />
          </g>
          <path d="M120 196 H134 L146 224 H206 L216 200 H140" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={156} cy={236} r={5} fill={INK} />
          <circle cx={198} cy={236} r={5} fill={INK} />
        </>
      );
    case "road":
      return (
        <>
          <line x1={0} y1={76} x2={400} y2={76} stroke={INK} strokeOpacity={0.3} />
          <polygon points="188,76 212,76 372,250 28,250" fill={G3} />
          <line x1={186} y1={78} x2={50} y2={250} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={214} y1={78} x2={350} y2={250} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={200} y1={82} x2={200} y2={250} stroke="#FFFFFF" strokeWidth={4} strokeDasharray="14 12" />
          <path d="M290 30 q12 -22 24 0 t24 0 t24 0" fill="none" stroke={INK} strokeOpacity={0.5} strokeWidth={2} />
          <path d="M290 44 q12 18 24 0 t24 0 t24 0" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={2} />
          <rect x={26} y={30} width={70} height={6} rx={3} fill={G2} />
        </>
      );
    default:
      return null;
  }
}

export default function Cover({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="cover-svg">
      <Scene kind={kind} />
    </svg>
  );
}
