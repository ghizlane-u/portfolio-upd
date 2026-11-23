// Source unique de vérité : tout le contenu vient du CV (CV_Benbella_Ghizlane.pdf).
// Rien d'autre n'est inventé. Les liens GitHub / LinkedIn ne figurent pas dans le CV :
// laissez-les vides tant que vous ne les avez pas, les boutons correspondants disparaissent.

export const PROFILE = {
  name: "Benbella Ghizlane",
  firstName: "Ghizlane",
  initials: "BG",
  role: "Étudiante Bac+5 | Artificial Intelligence & Data",
  heroRole: "IA & Data",
  email: "ghizlanebenbella8@gmail.com",
  phone: "06 74 90 38 07",
  phoneHref: "tel:+212674903807",
  location: "Casablanca, Maroc",
  resumeSummary:
    "Étudiante en 2e année de Master Technologies Immersives (Bac+5) à l'ENSAM Casablanca, spécialisée en technologies immersives et intelligence artificielle. Expérience en développement Full Stack, conception et intégration d'API REST, ainsi qu'en développement de solutions basées sur les LLM, les agents IA et les architectures RAG. Compétences en Python, Java, React/TypeScript et Docker, avec un intérêt particulier pour l'IA générative, l'automatisation et le développement d'assistants intelligents.",
  extraLine: "Langues : français (courant), anglais (professionnel), arabe (langue maternelle).",
  github: "",
  linkedin: "https://www.linkedin.com/in/ghizlane-benbella",
  validTill: "2027",
  languages: [
    { name: "Français", level: "courant" },
    { name: "Anglais", level: "professionnel" },
    { name: "Arabe", level: "langue maternelle" },
  ],
  softSkills: [
    "Méthodologie Agile",
    "Esprit d'analyse",
    "Adaptabilité",
    "Travail en équipe",
    "Résolution de problèmes",
    "Apprentissage rapide",
    "Communication",
    "Autonomie",
    "Curiosité technologique",
  ],
};

export type NavItem = { id: string; label: string };

// Domaines mis en avant sur l'accueil (issus du CV et de vos projets).
export const FOCUS = [
  { t: "IA agentique", d: "Agents, outils Python, LLM" },
  { t: "IA générative & RAG", d: "LangChain, embeddings, ChromaDB" },
  { t: "Machine & Deep Learning", d: "Vision par ordinateur, détection d'anomalies" },
];

export const NAV: NavItem[] = [
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "work", label: "Projets" },
  { id: "experience", label: "Parcours" },
  { id: "contact", label: "Contact" },
];

export type SkillFamily = { id: string; label: string; short: string; skills: string[] };

export const SKILL_GROUPS: SkillFamily[] = [
  {
    id: "ml",
    label: "Machine Learning & IA générative",
    short: "IA",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Scikit-learn",
      "Keras",
      "Apprentissage supervisé",
      "Apprentissage non supervisé",
      "Clustering",
      "NLP",
      "Computer Vision",
      "LLMs",
      "IA générative",
      "RAG",
      "LangChain",
      "Hugging Face",
      "Embeddings",
      "OpenAI API",
      "PyTorch",
      "CNN",
      "YOLO",
      "OpenCV",
      "Détection d'anomalies",
    ],
  },
  {
    id: "fullstack",
    label: "Développement Full Stack",
    short: "Full Stack",
    skills: [
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "React.js",
      "Node.js",
      "Express.js",
      "Angular",
      "Flutter",
      "C#",
      "HTML5",
      "CSS3",
      "API REST",
    ],
  },
  {
    id: "cloud",
    label: "Cloud, DevOps & MLOps",
    short: "Cloud",
    skills: ["Docker", "Kubernetes", "Cloud Computing"],
  },
  {
    id: "data",
    label: "Bases de données & sécurité",
    short: "Données",
    skills: [
      "SQL",
      "NoSQL",
      "MongoDB",
      "ChromaDB",
      "Pandas",
      "NumPy",
      "Bases de données vectorielles",
      "JWT",
      "OAuth2",
      "Authentification et autorisation d'API",
      "HTTPS/TLS",
    ],
  },
  {
    id: "auto",
    label: "Automatisation & intégration",
    short: "Automatisation",
    skills: ["n8n", "Node-RED", "MQTT", "OPC UA", "Python Automation", "Intégration d'API REST", "Postman", "Git", "GitHub", "GitLab"],
  },
  {
    id: "xr",
    label: "Immersif & 3D",
    short: "Immersif",
    skills: ["Unity", "Réalité virtuelle", "Réalité augmentée", "Modélisation 3D"],
  },
  {
    id: "bi",
    label: "BI & Data Visualization",
    short: "BI",
    skills: ["Power BI", "DAX", "Data Visualization", "Dashboards"],
  },
];

export type Experience = {
  id: string;
  title: string;
  place: string;
  period: string;
  startYear: number;
  bullets: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: "fstm",
    title: "Stage PFE – IA agentique & automatisation",
    place: "Laboratoire Informatique – FSTM",
    period: "Avril 2025 – Juin 2025",
    startYear: 2025,
    bullets: [
      "Collecte, extraction et préparation de données issues de sources web pour alimenter des fonctionnalités intelligentes.",
      "Expérimentation de solutions basées sur les LLM et la vision par ordinateur pour la classification et l'identification de monuments.",
      "Conception de workflows automatisés avec Python et n8n pour le traitement des données.",
      "Intégration d'API REST et de services externes, notamment pour la géolocalisation et les fonctionnalités d'une application mobile Flutter.",
    ],
  },
  {
    id: "odoo",
    title: "Stage développeuse logicielle ERP Odoo",
    place: "Stream Lean Industry 4.0",
    period: "Mai 2024 – Août 2024",
    startYear: 2024,
    bullets: [
      "Développement et personnalisation de modules Odoo selon les besoins fonctionnels ; analyse des besoins et adaptation des fonctionnalités de l'ERP.",
      "Intégration d'API externes et gestion des échanges de données.",
      "Développement d'interfaces utilisateur avec HTML/CSS et JavaScript ; participation à l'amélioration de l'expérience utilisateur.",
    ],
  },
  {
    id: "arkx",
    title: "Stage développeuse MERN",
    place: "Ark-x Talent Factory",
    period: "Janvier 2024 – Mai 2024",
    startYear: 2024,
    bullets: [
      "Développement des fonctionnalités front-end et back-end avec JavaScript, React.js, Node.js et Express.js.",
      "Intégration et consommation d'API REST et de services tiers.",
      "Manipulation de données côté serveur et intégration avec des bases de données.",
      "Participation à la conception et à l'évolution des fonctionnalités applicatives, en environnement Agile.",
    ],
  },
];

export type Education = { id: string; title: string; place: string; period: string; startYear: number };

export const EDUCATION: Education[] = [
  {
    id: "master",
    title: "Master Technologies Immersives",
    place: "ENSAM Casablanca",
    period: "2025 – 2027",
    startYear: 2025,
  },
  {
    id: "licence",
    title: "Licence Informatique, Réseaux et Multimédia",
    place: "FST Mohammedia",
    period: "2024 – 2025",
    startYear: 2024,
  },
  {
    id: "bac",
    title: "Baccalauréat international – Sciences Physiques",
    place: "Lycée Al Moatamid Ben Abbad",
    period: "2020 – 2021",
    startYear: 2020,
  },
];

export type Category = "ia" | "ml" | "data" | "xr" | "web";

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "ia", label: "IA agentique & générative" },
  { id: "ml", label: "Machine & Deep Learning" },
  { id: "data", label: "Data & Industrie 4.0" },
  { id: "xr", label: "AR / VR / 3D" },
  { id: "web", label: "Web" },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  category: Category;
  status?: string;
  year?: string;
  description: string;
  featuresTitle?: string;
  features: string[];
  note?: string;
  tech: string[];
  github: string;
  /** Chemin d'une vidéo de démonstration (public/videos/...). Une icône ▶ s'affiche si renseigné. */
  video?: string;
  featured?: boolean;
  cover: string;
};

export const PROJECTS: Project[] = [
  {
    id: "coach",
    index: "01",
    title: "Agent IA Coach de Carrière",
    kicker: "IA agentique · RAG",
    category: "ia",
    status: "Projet développé",
    year: "2026",
    featured: true,
    description:
      "Assistant intelligent qui accompagne les candidats dans leur recherche d'emploi et l'amélioration de leur employabilité, en combinant un LLM, un pipeline RAG et des outils Python.",
    features: [
      "Analyse automatique des CV et évaluation de leur qualité",
      "Extraction des compétences et identification des lacunes (Skill Gap Analysis)",
      "Comparaison entre le profil du candidat et les offres d'emploi",
      "Estimation des salaires",
      "Recommandations personnalisées pour améliorer le CV et les compétences",
      "Recherche sémantique et exploitation de documents grâce au RAG",
      "Outils intelligents : score_cv, estimer_salaire, matcher_jobs",
    ],
    tech: ["Python", "LangChain", "LLMs", "RAG", "all-MiniLM-L6-v2", "ChromaDB", "Streamlit", "NVIDIA NIM", "Devstral"],
    github: "",
    cover: "agent",
  },
  {
    id: "redrambler",
    index: "02",
    title: "Red Rambler — Plateforme de tourisme intelligente",
    kicker: "IA · Automatisation n8n · Mobile",
    category: "ia",
    status: "PFE réalisé",
    featured: true,
    description:
      "Application mobile intelligente qui facilite la découverte touristique de Marrakech : monuments, restaurants et activités, portée par des workflows n8n et des modèles d'IA (reconnaissance d'images, agents).",
    features: [
      "Découverte de monuments, restaurants et lieux touristiques",
      "Géolocalisation et cartes interactives",
      "Informations touristiques issues de plusieurs APIs",
      "Collecte et traitement automatisés de données par web scraping",
      "Reconnaissance et classification d'images avec OpenAI Vision et fine-tuning du modèle",
      "Workflows intelligents et automatisation avec n8n : webhooks, routage par action, agents IA",
      "Favoris, invitations par QR Code et système de récompenses",
      "Marketplace et fonctionnalités communautaires",
      "Interface multilingue : français, arabe, anglais, italien, allemand et espagnol",
    ],
    tech: ["Flutter", "Dart", "Appwrite", "Google Maps", "Google Places", "Amadeus", "Tripadvisor", "PredictHQ", "SerpAPI", "Python", "Selenium", "Crawl4AI", "OpenAI Vision", "Fine-tuning", "n8n"],
    github: "",
    cover: "tourism",
  },
  {
    id: "carrag",
    index: "03",
    title: "Assistant IA contextuel pour manuel automobile (MG ZS)",
    kicker: "IA générative · RAG",
    category: "ia",
    featured: true,
    description:
      "Preuve de concept pour un constructeur automobile : un chatbot qui s'appuie sur des pages du manuel d'un MG ZS (messages d'alerte, signification et actions recommandées) pour guider le conducteur.",
    features: [
      "Chargement du manuel au format HTML",
      "Découpage du texte en segments pertinents",
      "Embeddings OpenAI et base vectorielle Chroma",
      "Chaîne RAG : le modèle répond à partir des passages retrouvés dans le manuel",
    ],
    tech: ["Python", "LangChain", "OpenAI", "Embeddings", "ChromaDB", "RAG", "UnstructuredHTMLLoader"],
    github: "",
    cover: "dashboard",
  },
  {
    id: "visionguard",
    index: "04",
    title: "Smart Nut Inspection — VisionGuard AI",
    kicker: "Deep Learning · Vision · AR",
    category: "ml",
    featured: true,
    description:
      "Système intelligent de contrôle qualité capable de détecter automatiquement les anomalies et défauts sur des écrous métalliques.",
    features: [
      "Analyse d'images de pièces métalliques",
      "Détection d'anomalies et identification des défauts",
      "Classification des pièces normales et défectueuses",
      "Visualisation des défauts sur un modèle 3D",
      "Interface de suivi des inspections, historique et indicateurs KPI",
      "Visualisation en réalité augmentée avec Unity, avec affichage des informations de défauts dans l'expérience immersive",
    ],
    tech: ["Python", "OpenCV", "PyTorch", "CNN", "YOLO", "MVTec AD", "Streamlit", "Unity"],
    github: "",
    cover: "vision",
  },
  {
    id: "reviews",
    index: "05",
    title: "Analyse sémantique d'avis clients par embeddings",
    kicker: "Machine Learning · NLP",
    category: "ml",
    description:
      "Analyse du jeu de données Women's Clothing E-Commerce Reviews : les embeddings de texte servent à faire émerger les thèmes et les sentiments des avis clients.",
    features: [
      "Nettoyage des données (suppression des avis vides)",
      "Embeddings des avis avec all-MiniLM-L6-v2",
      "Projection en 2 dimensions avec t-SNE",
      "Recherche des 3 avis les plus proches par similarité cosinus",
    ],
    tech: ["Python", "Pandas", "NumPy", "sentence-transformers", "Scikit-learn", "ChromaDB"],
    github: "",
    cover: "scatter",
  },
  {
    id: "paris",
    index: "06",
    title: "Guide de voyage IA — Paris",
    kicker: "IA générative · API OpenAI",
    category: "ia",
    description:
      "Guide virtuel de Paris pour Peterman Reality Tours : l'IA répond à une série de questions prédéfinies sur les monuments et lieux incontournables de la ville.",
    features: [
      "Prompt système : persona de guide parisien concis, précis et engageant",
      "Historique de la conversation renvoyé au modèle à chaque question",
      "Modèle gpt-4o-mini, température 0 et réponses courtes",
    ],
    tech: ["Python", "OpenAI API", "gpt-4o-mini"],
    github: "",
    cover: "paris",
  },
  {
    id: "plant",
    index: "07",
    title: "Smart Plant Monitor — Surveillance intelligente de plantes",
    kicker: "IoT · LLM · 3D",
    category: "ia",
    description:
      "Solution de surveillance des plantes qui combine données en temps réel et assistance par intelligence artificielle.",
    features: [
      "Surveillance des paramètres de la plante",
      "Collecte et visualisation des données en temps réel",
      "Diagnostic assisté par LLM",
      "Présentation des informations dans un environnement 3D",
    ],
    tech: ["Python", "LangChain", "RAG", "ChromaDB", "Streamlit", "Unity (C#)", "DeepSeek-R1", "NVIDIA NIM", "Blynk IoT"],
    github: "",
    cover: "plant",
  },
  {
    id: "iiot",
    index: "08",
    title: "Chaîne de données Industrie 4.0 — du poste P01 au MES/ERP",
    kicker: "IIoT · Data Engineering",
    category: "data",
    status: "Projet académique en cours",
    description:
      "Architecture (modèle ISA-95) pour collecter, sécuriser, analyser et valoriser les données du poste P01 (Magazine Front) du FESTO CP Lab 406-1, jusqu'aux systèmes MES et ERP.",
    featuresTitle: "Objectifs de l'architecture",
    features: [
      "Exposer les données du poste via un serveur OPC UA standardisé et sécurisé",
      "Collecter et historiser les données en continu (Edge computing, Node-RED)",
      "Calculer les indicateurs de performance : disponibilité, performance, qualité, TRS/OEE",
      "Détecter des anomalies et prédire les pannes par apprentissage automatique",
      "Intégrer un MES (ordres de fabrication, traçabilité, alarmes) et un ERP (commandes, stocks, coûts)",
      "Superviser par des tableaux de bord temps réel et historiques",
    ],
    note: "Acquis à ce jour : collecte OPC UA, stockage MongoDB et dashboard. Les étapes suivantes (sécurité, machine learning, MES, ERP) sont des objectifs.",
    tech: ["Python", "SQL", "OPC UA", "MQTT", "Node-RED", "MongoDB", "Scikit-learn", "Docker", "Grafana", "Power BI"],
    github: "",
    cover: "pipeline",
  },
  {
    id: "farming",
    index: "09",
    title: "Smart Farming VR — Agriculture intelligente et immersive",
    kicker: "IoT · IA · VR",
    category: "xr",
    status: "Projet réalisé",
    description:
      "Association de l'Internet des objets, de l'analyse intelligente des données agricoles et de la réalité virtuelle pour améliorer le suivi des cultures.",
    features: [
      "Acquisition de données provenant de capteurs IoT réels",
      "Surveillance des paramètres agricoles",
      "Visualisation des données collectées",
      "Exploitation des données pour l'analyse et le suivi agricole",
      "Expérience immersive pour explorer les informations agricoles en environnement virtuel",
    ],
    tech: ["Capteurs IoT", "Blynk IoT", "Réalité virtuelle", "Visualisation 3D"],
    github: "",
    cover: "field",
  },
  {
    id: "pharaon",
    index: "10",
    title: "An Eternal Journey to the Pharaonic Civilization in 3D",
    kicker: "3D · Expérience immersive",
    category: "xr",
    description:
      "Expérience immersive pour explorer la civilisation pharaonique à travers un environnement tridimensionnel.",
    features: [
      "Exploration d'environnements inspirés de l'Égypte ancienne",
      "Reconstitution visuelle de lieux et d'éléments historiques",
      "Navigation dans un espace 3D",
      "Découverte immersive du patrimoine historique",
    ],
    tech: ["3D", "Expérience immersive"],
    github: "",
    cover: "pyramids",
  },
  {
    id: "arcade",
    index: "11",
    title: "VR Arcade",
    kicker: "Réalité virtuelle · Expérience interactive",
    category: "xr",
    description:
      "Expérience interactive en réalité virtuelle autour d'un environnement de jeu immersif.",
    features: [
      "Interaction avec un environnement virtuel",
      "Navigation et exploration en VR",
      "Expériences interactives destinées à l'utilisateur",
      "Immersion dans un univers numérique en 3D",
    ],
    tech: ["Réalité virtuelle", "3D"],
    github: "",
    cover: "arcade",
  },
  {
    id: "training",
    index: "12",
    title: "VR Industrial Training — Formation industrielle en réalité virtuelle",
    kicker: "VR · Simulation industrielle",
    category: "xr",
    status: "Concept de projet",
    description:
      "Application de formation permettant d'apprendre à assembler et connecter un circuit de commande électrique dans un environnement virtuel, sans manipuler d'équipement réel.",
    featuresTitle: "Fonctionnement envisagé",
    features: [
      "Présentation des composants électroniques et électriques",
      "Manipulation et connexion virtuelle des éléments du circuit",
      "Vérification des connexions",
      "Simulation de la mise sous tension",
      "Activation et simulation du fonctionnement d'un bras robotique",
    ],
    tech: ["Unity", "C#", "Modélisation 3D", "Réalité virtuelle", "Simulation de systèmes industriels"],
    github: "",
    cover: "circuit",
  },
  {
    id: "lunchtab",
    index: "13",
    title: "Lunch Tab — Application de commande de repas",
    kicker: "Web · Parcours client & back-office",
    category: "web",
    description:
      "Application de commande de repas avec un parcours client (catégories, panier, paiement) et un back-office d'administration.",
    features: [
      "Liste des catégories de repas, claire et organisée",
      "Navigation intuitive avec options de filtrage et de tri",
      "Descriptions détaillées de chaque catégorie, avec les types de plats inclus",
      "Récapitulatif de la commande : articles, quantités, prix unitaires et sous-totaux",
      "Modification du panier : ajout, suppression ou changement d'articles avant paiement",
      "Plusieurs modes de paiement sécurisés",
      "Back-office : tableau de bord (métriques, activités récentes, notifications, accès rapide)",
      "Back-office : visualisation et traitement des commandes (confirmation, annulation, expédition)",
    ],
    tech: [],
    github: "",
    cover: "storefront",
  },
  {
    id: "lane",
    index: "14",
    title: "Lane Detection — Détection de lignes de voie",
    kicker: "Vision par ordinateur",
    category: "ml",
    status: "Travail technique",
    description:
      "Détection des lignes de circulation sur des images, par traitement d'images.",
    features: [
      "Traitement d'images avec Python et OpenCV",
      "Détection de contours et gradients",
      "Transformée de Hough",
    ],
    tech: ["Python", "OpenCV", "Transformée de Hough"],
    github: "",
    cover: "road",
  },
];

export type Certification = { id: string; title: string; issuer: string; year: string };

export const CERTIFICATIONS: Certification[] = [
  { id: "c1", title: "Developing AI Systems with the OpenAI API", issuer: "DataCamp", year: "2026" },
  { id: "c2", title: "Developing Applications with LangChain", issuer: "DataCamp", year: "2026" },
  { id: "c3", title: "Prompt Engineering with the OpenAI API", issuer: "DataCamp", year: "2026" },
  { id: "c4", title: "Advanced Deep Learning with Keras", issuer: "DataCamp", year: "2026" },
  { id: "c5", title: "Development and Basic Concepts of Cloud Computing", issuer: "", year: "2026" },
  { id: "c6", title: "Python Essentials 1", issuer: "", year: "2026" },
  { id: "c7", title: "CCNA : Introduction to Networks", issuer: "Cisco", year: "2025" },
  { id: "c8", title: "Network Security", issuer: "Cisco", year: "2025" },
];

// Le CV ne mentionne aucun classement ni statistique : la section « Réalisations »
// est donc supprimée (aucun chiffre inventé).
export const ACHIEVEMENTS: never[] = [];
