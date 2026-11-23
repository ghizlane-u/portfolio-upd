// Histoire de chaque projet : lead (contexte) → transformation (de → vers) → outcome (résultat).
// Rédigé à partir des descriptions du CV : aucun chiffre ni résultat inventé.
// Pour modifier un texte, changez simplement la phrase correspondante (fr ou en).

export type Story = { lead: string; from: string; to: string; outcome: string };

export const STORIES: Record<string, { fr: Story; en: Story }> = {
  coach: {
    fr: {
      lead: "Les candidats manquent de retours objectifs sur leur CV et sur l'écart avec les offres visées.",
      from: "CV sans retour précis",
      to: "Plan d'amélioration personnalisé",
      outcome: "Un agent qui note le CV, repère les compétences manquantes, le compare aux offres, estime le salaire et recommande quoi améliorer.",
    },
    en: {
      lead: "Job seekers rarely get objective feedback on their CV or on the gap with the roles they target.",
      from: "A CV with no clear feedback",
      to: "A personalised improvement plan",
      outcome: "An agent that scores the CV, spots missing skills, matches it against job offers, estimates salary and recommends what to improve.",
    },
  },
  redrambler: {
    fr: {
      lead: "Découvrir Marrakech oblige à croiser cartes, avis et sources dispersées.",
      from: "Informations éparpillées",
      to: "Une app mobile unique et multilingue",
      outcome: "Une application qui rassemble monuments, restaurants et activités, reconnaît des images (OpenAI Vision, fine-tuning), automatise ses réponses avec des workflows n8n, et propose favoris, QR codes et récompenses en 6 langues.",
    },
    en: {
      lead: "Discovering Marrakech means piecing together maps, reviews and scattered sources.",
      from: "Scattered information",
      to: "One multilingual mobile app",
      outcome: "An app that brings together monuments, restaurants and activities, recognises images (OpenAI Vision, fine-tuning), automates its answers with n8n workflows, and offers favourites, QR codes and rewards in 6 languages.",
    },
  },
  carrag: {
    fr: {
      lead: "Face à un message d'alerte, le conducteur doit fouiller un long manuel.",
      from: "Manuel à chercher page par page",
      to: "Réponse directe, appuyée sur le manuel",
      outcome: "Une preuve de concept où le chatbot explique l'alerte et l'action recommandée à partir des passages retrouvés du manuel du MG ZS.",
    },
    en: {
      lead: "Faced with a warning message, drivers have to dig through a long manual.",
      from: "A manual to search page by page",
      to: "A direct answer grounded in the manual",
      outcome: "A proof of concept where the chatbot explains the warning and the recommended action using passages retrieved from the MG ZS manual.",
    },
  },
  visionguard: {
    fr: {
      lead: "Le contrôle visuel des pièces métalliques est lent et dépend du regard humain.",
      from: "Inspection manuelle",
      to: "Détection automatique des défauts",
      outcome: "Un système qui analyse les images d'écrous, classe les pièces normales et défectueuses, localise les défauts sur un modèle 3D, suit les inspections par KPI et les affiche en réalité augmentée (Unity).",
    },
    en: {
      lead: "Visual inspection of metal parts is slow and depends on the human eye.",
      from: "Manual inspection",
      to: "Automatic defect detection",
      outcome: "A system that analyses nut images, classifies normal and defective parts, locates defects on a 3D model, tracks inspections with KPIs and shows them in augmented reality (Unity).",
    },
  },
  reviews: {
    fr: {
      lead: "Un grand nombre d'avis clients en texte libre est difficile à exploiter.",
      from: "Avis en texte brut",
      to: "Thèmes et avis proches visibles",
      outcome: "Les avis sont transformés en embeddings (all-MiniLM-L6-v2), projetés en 2D avec t-SNE, et les 3 plus proches sont retrouvés par similarité cosinus.",
    },
    en: {
      lead: "A large volume of free-text customer reviews is hard to make sense of.",
      from: "Raw review text",
      to: "Themes and similar reviews made visible",
      outcome: "Reviews become embeddings (all-MiniLM-L6-v2), are projected to 2D with t-SNE, and the 3 closest ones are found by cosine similarity.",
    },
  },
  paris: {
    fr: {
      lead: "Un guide touristique doit répondre vite, avec un ton cohérent.",
      from: "Questions sans guide",
      to: "Un guide virtuel de Paris",
      outcome: "Un guide au persona défini qui répond de façon concise sur les monuments en gardant l'historique de la conversation (gpt-4o-mini, température 0).",
    },
    en: {
      lead: "A tour guide has to answer quickly, in a consistent voice.",
      from: "Questions with no guide",
      to: "A virtual guide to Paris",
      outcome: "A guide with a defined persona that answers concisely about landmarks while keeping the conversation history (gpt-4o-mini, temperature 0).",
    },
  },
  plant: {
    fr: {
      lead: "Prendre soin d'une plante demande de suivre ses paramètres et d'en comprendre les signaux.",
      from: "Plante sans suivi",
      to: "Diagnostic en temps réel, en 3D",
      outcome: "Les données sont collectées et visualisées en temps réel, un LLM aide au diagnostic et l'information est présentée dans un environnement 3D.",
    },
    en: {
      lead: "Caring for a plant means tracking its parameters and understanding what they signal.",
      from: "A plant with no monitoring",
      to: "Real-time diagnosis in 3D",
      outcome: "Data is collected and visualised in real time, an LLM assists the diagnosis and the information is presented in a 3D environment.",
    },
  },
  iiot: {
    fr: {
      lead: "Les données d'un poste de production restent isolées des systèmes MES et ERP.",
      from: "Données isolées sur le poste",
      to: "Une chaîne de données jusqu'au MES/ERP",
      outcome: "À ce jour : collecte OPC UA, stockage MongoDB et dashboard. Prochaines étapes : sécurité, machine learning, MES et ERP.",
    },
    en: {
      lead: "Data from a production station stays isolated from MES and ERP systems.",
      from: "Data locked at the station",
      to: "A data chain up to MES/ERP",
      outcome: "So far: OPC UA collection, MongoDB storage and a dashboard. Next steps: security, machine learning, MES and ERP.",
    },
  },
  farming: {
    fr: {
      lead: "Suivre des cultures demande des mesures fiables et une lecture claire.",
      from: "Mesures brutes de capteurs",
      to: "Cultures explorées en réalité virtuelle",
      outcome: "Des capteurs IoT réels alimentent le suivi des paramètres agricoles, visualisé puis exploré dans une expérience immersive.",
    },
    en: {
      lead: "Monitoring crops takes reliable measurements and a clear way to read them.",
      from: "Raw sensor readings",
      to: "Crops explored in virtual reality",
      outcome: "Real IoT sensors feed the tracking of agricultural parameters, which is visualised and then explored in an immersive experience.",
    },
  },
  pharaon: {
    fr: {
      lead: "Le patrimoine historique gagne à être vécu plutôt que lu.",
      from: "Histoire racontée en texte",
      to: "Civilisation explorée en 3D",
      outcome: "Un environnement 3D inspiré de l'Égypte ancienne que l'on parcourt, avec des lieux et des éléments historiques reconstitués.",
    },
    en: {
      lead: "Historical heritage is better experienced than read.",
      from: "History told in text",
      to: "A civilisation explored in 3D",
      outcome: "A 3D environment inspired by ancient Egypt that you walk through, with reconstructed places and historical elements.",
    },
  },
  arcade: {
    fr: {
      lead: "Concevoir un univers de jeu où l'utilisateur agit vraiment.",
      from: "Jeu sur écran",
      to: "Univers de jeu immersif",
      outcome: "Une expérience VR interactive : navigation, exploration et interaction dans un environnement d'arcade en 3D.",
    },
    en: {
      lead: "Designing a game world where the player truly acts.",
      from: "A game on a screen",
      to: "An immersive game world",
      outcome: "An interactive VR experience: navigation, exploration and interaction inside a 3D arcade environment.",
    },
  },
  training: {
    fr: {
      lead: "Apprendre à câbler un circuit électrique suppose d'ordinaire du matériel réel.",
      from: "Formation sur équipement réel",
      to: "Apprentissage sans risque en VR",
      outcome: "Concept : l'apprenant connecte les composants, vérifie le câblage, simule la mise sous tension et active un bras robotique virtuel.",
    },
    en: {
      lead: "Learning to wire an electrical circuit usually requires real equipment.",
      from: "Training on real equipment",
      to: "Risk-free learning in VR",
      outcome: "Concept: learners connect components, check the wiring, simulate power-up and activate a virtual robotic arm.",
    },
  },
  lunchtab: {
    fr: {
      lead: "Commander un repas doit être simple pour le client et maîtrisable pour l'équipe.",
      from: "Une idée de commande de repas",
      to: "Parcours client + back-office complet",
      outcome: "Le client parcourt les catégories, compose son panier et paie ; l'équipe suit et traite les commandes depuis un tableau de bord.",
    },
    en: {
      lead: "Ordering a meal should be simple for the customer and manageable for the team.",
      from: "An idea for meal ordering",
      to: "A full customer journey + back-office",
      outcome: "Customers browse categories, build a basket and pay; the team tracks and processes orders from a dashboard.",
    },
  },
  lane: {
    fr: {
      lead: "Un véhicule doit repérer les lignes de la voie pour se situer.",
      from: "Image brute de la route",
      to: "Lignes de voie détectées",
      outcome: "Détection de contours et de gradients, puis transformée de Hough pour retrouver les lignes de circulation avec OpenCV.",
    },
    en: {
      lead: "A vehicle has to spot lane lines to know where it is.",
      from: "A raw road image",
      to: "Lane lines detected",
      outcome: "Edge and gradient detection followed by a Hough transform to recover the lane lines with OpenCV.",
    },
  },
};
