import React from "react";

/** Logos de marque (devicon « original », copiés dans public/logos). */
export const BRAND: Record<string, { file: string; tint: string }> = {
  Python: { file: "python", tint: "#3776ab" },
  Java: { file: "java", tint: "#e76f00" },
  JavaScript: { file: "javascript", tint: "#f7df1e" },
  TypeScript: { file: "typescript", tint: "#3178c6" },
  "React.js": { file: "react", tint: "#61dafb" },
  "Node.js": { file: "nodejs", tint: "#5fa04e" },
  "Express.js": { file: "express", tint: "#888888" },
  Angular: { file: "angular", tint: "#dd0031" },
  Flutter: { file: "flutter", tint: "#02569b" },
  "C#": { file: "csharp", tint: "#68217a" },
  "Unity (C#)": { file: "unity", tint: "#555555" },
  HTML5: { file: "html5", tint: "#e34f26" },
  CSS3: { file: "css3", tint: "#1572b6" },
  Docker: { file: "docker", tint: "#2496ed" },
  Kubernetes: { file: "kubernetes", tint: "#326ce5" },
  MongoDB: { file: "mongodb", tint: "#47a248" },
  Git: { file: "git", tint: "#f05032" },
  GitHub: { file: "github", tint: "#555555" },
  GitLab: { file: "gitlab", tint: "#fc6d26" },
  Postman: { file: "postman", tint: "#ff6c37" },
  "Scikit-learn": { file: "scikitlearn", tint: "#f89939" },
  Keras: { file: "keras", tint: "#d00000" },
  "Hugging Face": { file: "huggingface", tint: "#ffd21e" },
  n8n: { file: "n8n", tint: "#ea4b71" },
  Streamlit: { file: "streamlit", tint: "#ff4b4b" },
  Unity: { file: "unity", tint: "#555555" },
  PyTorch: { file: "pytorch", tint: "#ee4c2c" },
  OpenCV: { file: "opencv", tint: "#5c3ee8" },
  Pandas: { file: "pandas", tint: "#150458" },
  NumPy: { file: "numpy", tint: "#4dabcf" },
  "Node-RED": { file: "nodered", tint: "#8f0000" },
};

export function isBrand(name: string) {
  return name in BRAND;
}

type Concept =
  | "brain" | "layers" | "cluster" | "text" | "eye" | "chat" | "spark" | "search" | "chain"
  | "dots" | "key" | "shield" | "db" | "chart" | "flow" | "cloud" | "api" | "code" | "table";

const CONCEPT: Record<string, Concept> = {
  "Machine Learning": "brain",
  "Deep Learning": "layers",
  "Apprentissage supervisé": "brain",
  "Apprentissage non supervisé": "cluster",
  Clustering: "cluster",
  NLP: "text",
  "Computer Vision": "eye",
  LLMs: "chat",
  "IA générative": "spark",
  RAG: "search",
  LangChain: "chain",
  Embeddings: "dots",
  "OpenAI API": "api",
  "API REST": "api",
  "Intégration d'API REST": "api",
  SQL: "db",
  NoSQL: "db",
  ChromaDB: "db",
  "Bases de données vectorielles": "dots",
  JWT: "key",
  OAuth2: "key",
  "Authentification et autorisation d'API": "key",
  "HTTPS/TLS": "shield",
  "Cloud Computing": "cloud",
  "Python Automation": "flow",
  "Power BI": "chart",
  DAX: "code",
  "Data Visualization": "chart",
  Dashboards: "table",
  "NVIDIA NIM": "spark",
  "DeepSeek-R1": "chat",
  "Blynk IoT": "flow",
  CNN: "layers",
  YOLO: "eye",
  OpenCV_: "eye",
  "Détection d'anomalies": "cluster",
  MQTT: "flow",
  "OPC UA": "flow",
  "Réalité virtuelle": "eye",
  "Réalité augmentée": "eye",
  "Modélisation 3D": "layers",
  "OpenAI Vision": "eye",
  "all-MiniLM-L6-v2": "dots",
};

const P: Record<Concept, React.ReactNode> = {
  brain: <><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3h1V4H9Z" /><path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3 3 3 0 0 1-2 3v1a3 3 0 0 1-3 3h-1V4h1Z" /></>,
  layers: <><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  cluster: <><circle cx="7" cy="8" r="2.2" /><circle cx="16" cy="7" r="2.2" /><circle cx="12" cy="16" r="2.2" /><circle cx="18" cy="16" r="1.2" /></>,
  text: <><path d="M4 6h16M4 11h10M4 16h16M4 21h8" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 10h8" /></>,
  spark: <><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 6 6" /></>,
  chain: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  dots: <><circle cx="6" cy="6" r="1.6" /><circle cx="18" cy="8" r="1.6" /><circle cx="10" cy="14" r="1.6" /><circle cx="17" cy="18" r="1.6" /><path d="M6 6l12 2M6 6l4 8M18 8l-8 6M10 14l7 4" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M16 7l3 3" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  db: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>,
  flow: <><rect x="3" y="4" width="6" height="5" rx="1" /><rect x="15" y="15" width="6" height="5" rx="1" /><path d="M9 6.5h4a2 2 0 0 1 2 2V15" /></>,
  cloud: <><path d="M7 18a4 4 0 0 1-.6-7.9A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9H7Z" /></>,
  api: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></>,
  code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5" /></>,
  table: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 10v10" /></>,
};

export function conceptOf(name: string): Concept {
  return CONCEPT[name] ?? "code";
}

export default function TechLogo({ name, size = 40, className = "" }: { name: string; size?: number; className?: string }) {
  const brand = BRAND[name];
  if (brand) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/logos/${brand.file}.svg`} alt="" width={size} height={size} className={className} loading="lazy" decoding="async" />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {P[conceptOf(name)]}
    </svg>
  );
}
