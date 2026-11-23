// Partie « IA & automatisation » mise en avant sur certains projets (affichée sous le récit du projet).
// Contenu fondé sur les workflows n8n du projet (captures dans public/projects/redrambler/).

export type AiDetails = {
  title: string;
  intro: string;
  points: { t: string; d: string }[];
  figures: { src: string; alt: string; caption: string; w: number; h: number }[];
  zoom: string;
  close: string;
};

export const AI_DETAILS: Record<string, { fr: AiDetails; en: AiDetails }> = {
  redrambler: {
    fr: {
      title: "IA & automatisation",
      intro:
        "Red Rambler ne se limite pas au développement mobile : son cœur intelligent repose sur des workflows n8n et des modèles d'IA qui répondent à l'utilisateur en temps réel.",
      points: [
        {
          t: "Automatisation avec n8n",
          d: "Un webhook reçoit chaque action de l'utilisateur dans l'application et l'aiguille vers le bon workflow : restaurants, lieux similaires, ingrédients ou origine d'un plat.",
        },
        {
          t: "Reconnaissance d'images",
          d: "La photo envoyée est téléchargée, encodée, classée (plat, monument, artisanat, cosmétique), puis analysée par un modèle de vision OpenAI qui interroge la base Appwrite.",
        },
        {
          t: "Fine-tuning",
          d: "Fine-tuning du modèle de reconnaissance d'images pour mieux identifier les plats, monuments, produits d'artisanat et cosmétiques.",
        },
        {
          t: "Agents IA & APIs",
          d: "Des agents OpenAI couplés à Google Maps et SerpAPI proposent des restaurants et des alternatives similaires, dont les résultats sont validés et sélectionnés par l'IA.",
        },
      ],
      figures: [
        {
          src: "/projects/redrambler/n8n-actions.webp",
          alt: "Workflow n8n des actions de l'assistant : restaurants, similaires, ingrédients et origine",
          caption: "Workflow n8n · actions de l'assistant (restaurants, similaires, ingrédients, origine)",
          w: 1231,
          h: 703,
        },
        {
          src: "/projects/redrambler/n8n-vision.webp",
          alt: "Workflow n8n de reconnaissance d'image : plat, monument, artisanat, cosmétique",
          caption: "Workflow n8n · reconnaissance d'image (plat, monument, artisanat, cosmétique)",
          w: 1342,
          h: 866,
        },
      ],
      zoom: "Agrandir le workflow",
      close: "Fermer l'image",
    },
    en: {
      title: "AI & automation",
      intro:
        "Red Rambler is more than mobile development: its intelligent core is built on n8n workflows and AI models that answer the user in real time.",
      points: [
        {
          t: "Automation with n8n",
          d: "A webhook receives every user action from the app and routes it to the right workflow: restaurants, similar places, ingredients or a dish's origin.",
        },
        {
          t: "Image recognition",
          d: "The uploaded photo is downloaded, encoded, classified (dish, monument, craft, cosmetics), then analysed by an OpenAI vision model that queries the Appwrite database.",
        },
        {
          t: "Fine-tuning",
          d: "Fine-tuning of the image-recognition model to better identify dishes, monuments, crafts and cosmetics.",
        },
        {
          t: "AI agents & APIs",
          d: "OpenAI agents combined with Google Maps and SerpAPI suggest restaurants and similar alternatives, with results validated and selected by the AI.",
        },
      ],
      figures: [
        {
          src: "/projects/redrambler/n8n-actions.webp",
          alt: "n8n workflow for the assistant's actions: restaurants, similar, ingredients and origin",
          caption: "n8n workflow · assistant actions (restaurants, similar, ingredients, origin)",
          w: 1231,
          h: 703,
        },
        {
          src: "/projects/redrambler/n8n-vision.webp",
          alt: "n8n image-recognition workflow: dish, monument, craft, cosmetics",
          caption: "n8n workflow · image recognition (dish, monument, craft, cosmetics)",
          w: 1342,
          h: 866,
        },
      ],
      zoom: "Enlarge the workflow",
      close: "Close the image",
    },
  },
};
