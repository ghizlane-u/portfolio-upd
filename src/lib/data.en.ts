// Traductions anglaises du contenu de data.ts (même structure, mêmes identifiants).
// Les technologies, logos et liens restent dans data.ts : ils ne se traduisent pas.

export const PROFILE_EN = {
  role: "Master's student (Bac+5) | Artificial Intelligence & Data",
  location: "Casablanca, Morocco",
  resumeSummary:
    "2nd-year Master's student in Immersive Technologies (Bac+5) at ENSAM Casablanca, specialised in immersive technologies and artificial intelligence. Experience in Full Stack development, design and integration of REST APIs, and in building solutions based on LLMs, AI agents and RAG architectures. Skilled in Python, Java, React/TypeScript and Docker, with a particular interest in generative AI, automation and intelligent assistants.",
  extraLine: "Languages: French (fluent), English (professional), Arabic (native).",
  languages: [
    { name: "French", level: "fluent" },
    { name: "English", level: "professional" },
    { name: "Arabic", level: "native" },
  ],
};

export const FOCUS_EN = [
  { t: "Agentic AI", d: "Agents, Python tools, LLMs" },
  { t: "Generative AI & RAG", d: "LangChain, embeddings, ChromaDB" },
  { t: "Machine & Deep Learning", d: "Computer vision, anomaly detection" },
];

export const NAV_EN = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Projects" },
  { id: "experience", label: "Journey" },
  { id: "contact", label: "Contact" },
];

export const SKILL_GROUPS_EN: Record<string, { label: string; short: string; rename?: Record<string, string> }> = {
  ml: {
    label: "Machine Learning & Generative AI",
    short: "AI",
    rename: {
      "Apprentissage supervisé": "Supervised learning",
      "Apprentissage non supervisé": "Unsupervised learning",
      "IA générative": "Generative AI",
      "Détection d'anomalies": "Anomaly detection",
    },
  },
  fullstack: { label: "Full Stack Development", short: "Full Stack" },
  cloud: { label: "Cloud, DevOps & MLOps", short: "Cloud" },
  data: {
    label: "Databases & security",
    short: "Data",
    rename: {
      "Bases de données vectorielles": "Vector databases",
      "Authentification et autorisation d'API": "API authentication & authorisation",
    },
  },
  auto: {
    label: "Automation & integration",
    short: "Automation",
    rename: { "Intégration d'API REST": "REST API integration" },
  },
  xr: {
    label: "Immersive & 3D",
    short: "Immersive",
    rename: { "Réalité virtuelle": "Virtual reality", "Réalité augmentée": "Augmented reality", "Modélisation 3D": "3D modelling" },
  },
  bi: { label: "BI & Data Visualization", short: "BI" },
};

export const EXPERIENCE_EN: Record<string, { title: string; place: string; period: string; bullets: string[] }> = {
  fstm: {
    title: "Final-year internship – Agentic AI & automation",
    place: "Computer Science Laboratory – FSTM",
    period: "April 2025 – June 2025",
    bullets: [
      "Collection, extraction and preparation of web data to power intelligent features.",
      "Experiments with LLM-based and computer vision solutions to classify and identify monuments.",
      "Design of automated workflows with Python and n8n for data processing.",
      "Integration of REST APIs and external services, notably for geolocation and the features of a Flutter mobile app.",
    ],
  },
  odoo: {
    title: "Internship – Odoo ERP software developer",
    place: "Stream Lean Industry 4.0",
    period: "May 2024 – August 2024",
    bullets: [
      "Development and customisation of Odoo modules to functional needs; requirements analysis and adaptation of ERP features.",
      "Integration of external APIs and management of data exchanges.",
      "Development of user interfaces with HTML/CSS and JavaScript; contribution to improving the user experience.",
    ],
  },
  arkx: {
    title: "Internship – MERN developer",
    place: "Ark-x Talent Factory",
    period: "January 2024 – May 2024",
    bullets: [
      "Front-end and back-end feature development with JavaScript, React.js, Node.js and Express.js.",
      "Integration and consumption of REST APIs and third-party services.",
      "Server-side data handling and database integration.",
      "Contribution to the design and evolution of application features in an Agile environment.",
    ],
  },
};

export const EDUCATION_EN: Record<string, { title: string; place: string }> = {
  master: { title: "Master's in Immersive Technologies", place: "ENSAM Casablanca" },
  licence: { title: "Bachelor's in Computer Science, Networks & Multimedia", place: "FST Mohammedia" },
  bac: { title: "International Baccalaureate – Physical Sciences", place: "Lycée Al Moatamid Ben Abbad" },
};

export const CATEGORIES_EN: Record<string, string> = {
  all: "All",
  ia: "Agentic & generative AI",
  ml: "Machine & Deep Learning",
  data: "Data & Industry 4.0",
  xr: "AR / VR / 3D",
  web: "Web",
};

export type ProjectTextEN = {
  title: string;
  kicker: string;
  status?: string;
  description: string;
  featuresTitle?: string;
  features: string[];
  note?: string;
};

export const PROJECTS_EN: Record<string, ProjectTextEN> = {
  coach: {
    title: "AI Career Coach Agent",
    kicker: "Agentic AI · RAG",
    status: "Developed project",
    description:
      "An intelligent assistant that supports candidates in their job search and employability, combining an LLM, a RAG pipeline and Python tools.",
    features: [
      "Automatic CV analysis and quality assessment",
      "Skill extraction and gap identification (Skill Gap Analysis)",
      "Matching the candidate's profile against job offers",
      "Salary estimation",
      "Personalised recommendations to improve the CV and skills",
      "Semantic search and document exploitation through RAG",
      "Smart tools: score_cv, estimer_salaire, matcher_jobs",
    ],
  },
  redrambler: {
    title: "Red Rambler — Smart tourism platform",
    kicker: "AI · n8n automation · Mobile",
    status: "Graduation project (PFE) completed",
    description: "An intelligent mobile app that makes discovering Marrakech easier: monuments, restaurants and activities, powered by n8n workflows and AI models (image recognition, agents).",
    features: [
      "Discovery of monuments, restaurants and tourist spots",
      "Geolocation and interactive maps",
      "Tourist information drawn from several APIs",
      "Automated data collection and processing through web scraping",
      "Image recognition and classification with OpenAI Vision and model fine-tuning",
      "Intelligent workflows and automation with n8n: webhooks, action routing, AI agents",
      "Favourites, QR code invitations and a rewards system",
      "Marketplace and community features",
      "Multilingual interface: French, Arabic, English, Italian, German and Spanish",
    ],
  },
  carrag: {
    title: "Contextual AI assistant for a car manual (MG ZS)",
    kicker: "Generative AI · RAG",
    description:
      "A proof of concept for a car manufacturer: a chatbot that relies on pages of an MG ZS manual (warning messages, their meaning and recommended actions) to guide the driver.",
    features: [
      "Loading the manual in HTML format",
      "Splitting the text into relevant chunks",
      "OpenAI embeddings and a Chroma vector store",
      "RAG chain: the model answers from the passages retrieved in the manual",
    ],
  },
  visionguard: {
    title: "Smart Nut Inspection — VisionGuard AI",
    kicker: "Deep Learning · Vision · AR",
    description: "An intelligent quality-control system that automatically detects anomalies and defects on metal nuts.",
    features: [
      "Image analysis of metal parts",
      "Anomaly detection and defect identification",
      "Classification of normal and defective parts",
      "Defect visualisation on a 3D model",
      "Inspection tracking interface with history and KPIs",
      "Augmented reality visualisation with Unity, showing defect information in the immersive experience",
    ],
  },
  reviews: {
    title: "Semantic analysis of customer reviews with embeddings",
    kicker: "Machine Learning · NLP",
    description:
      "Analysis of the Women's Clothing E-Commerce Reviews dataset: text embeddings reveal the themes and sentiments of customer reviews.",
    features: [
      "Data cleaning (removing empty reviews)",
      "Review embeddings with all-MiniLM-L6-v2",
      "2-dimensional projection with t-SNE",
      "Finding the 3 closest reviews by cosine similarity",
    ],
  },
  paris: {
    title: "AI travel guide — Paris",
    kicker: "Generative AI · OpenAI API",
    description:
      "A virtual guide to Paris for Peterman Reality Tours: the AI answers a series of predefined questions about the city's must-see landmarks.",
    features: [
      "System prompt: a concise, precise and engaging Parisian guide persona",
      "Conversation history sent back to the model with each question",
      "gpt-4o-mini model, temperature 0 and short answers",
    ],
  },
  plant: {
    title: "Smart Plant Monitor — Intelligent plant monitoring",
    kicker: "IoT · LLM · 3D",
    description: "A plant-monitoring solution that combines real-time data with AI assistance.",
    features: [
      "Monitoring of the plant's parameters",
      "Real-time data collection and visualisation",
      "LLM-assisted diagnosis",
      "Information presented in a 3D environment",
    ],
  },
  iiot: {
    title: "Industry 4.0 data chain — from station P01 to MES/ERP",
    kicker: "IIoT · Data Engineering",
    status: "Ongoing academic project",
    description:
      "An architecture (ISA-95 model) to collect, secure, analyse and leverage the data of station P01 (Front Magazine) of the FESTO CP Lab 406-1, all the way to MES and ERP systems.",
    featuresTitle: "Architecture goals",
    features: [
      "Expose station data through a standardised, secured OPC UA server",
      "Continuously collect and archive data (Edge computing, Node-RED)",
      "Compute performance indicators: availability, performance, quality, OEE",
      "Detect anomalies and predict failures with machine learning",
      "Integrate an MES (work orders, traceability, alarms) and an ERP (orders, stock, costs)",
      "Supervise through real-time and historical dashboards",
    ],
    note: "Achieved so far: OPC UA collection, MongoDB storage and a dashboard. The next steps (security, machine learning, MES, ERP) are goals.",
  },
  farming: {
    title: "Smart Farming VR — Intelligent and immersive agriculture",
    kicker: "IoT · AI · VR",
    status: "Completed project",
    description:
      "Combining the Internet of Things, intelligent analysis of agricultural data and virtual reality to improve crop monitoring.",
    features: [
      "Data acquisition from real IoT sensors",
      "Monitoring of agricultural parameters",
      "Visualisation of the collected data",
      "Using the data for agricultural analysis and monitoring",
      "Immersive experience to explore agricultural information in a virtual environment",
    ],
  },
  pharaon: {
    title: "An Eternal Journey to the Pharaonic Civilization in 3D",
    kicker: "3D · Immersive experience",
    description: "An immersive experience to explore the pharaonic civilisation through a three-dimensional environment.",
    features: [
      "Exploration of environments inspired by ancient Egypt",
      "Visual reconstruction of historical places and elements",
      "Navigation in a 3D space",
      "Immersive discovery of historical heritage",
    ],
  },
  arcade: {
    title: "VR Arcade",
    kicker: "Virtual reality · Interactive experience",
    description: "An interactive virtual reality experience built around an immersive gaming environment.",
    features: [
      "Interaction with a virtual environment",
      "Navigation and exploration in VR",
      "Interactive experiences designed for the user",
      "Immersion in a 3D digital universe",
    ],
  },
  training: {
    title: "VR Industrial Training — Industrial training in virtual reality",
    kicker: "VR · Industrial simulation",
    status: "Project concept",
    description:
      "A training application to learn how to assemble and connect an electrical control circuit in a virtual environment, without handling real equipment.",
    featuresTitle: "Envisioned operation",
    features: [
      "Presentation of electronic and electrical components",
      "Virtual handling and connection of circuit elements",
      "Verification of connections",
      "Simulation of power-up",
      "Activation and simulation of a robotic arm",
    ],
  },
  lunchtab: {
    title: "Lunch Tab — Meal ordering application",
    kicker: "Web · Customer journey & back-office",
    description: "A meal-ordering application with a customer journey (categories, basket, payment) and an admin back-office.",
    features: [
      "Clear, well-organised list of meal categories",
      "Intuitive navigation with filtering and sorting options",
      "Detailed descriptions of each category, with the types of dishes included",
      "Order summary: items, quantities, unit prices and subtotals",
      "Basket editing: add, remove or change items before payment",
      "Several secure payment methods",
      "Back-office: dashboard (metrics, recent activity, notifications, quick access)",
      "Back-office: viewing and processing orders (confirmation, cancellation, shipping)",
    ],
  },
  lane: {
    title: "Lane Detection",
    kicker: "Computer vision",
    status: "Technical work",
    description: "Detection of road lane lines in images through image processing.",
    features: ["Image processing with Python and OpenCV", "Edge and gradient detection", "Hough transform"],
  },
};

export const CERT_ISSUER_EN: Record<string, string> = {};
