// Moteur de l'assistant : répond uniquement à partir des données du portfolio (profil, projets,
// compétences, parcours, certifications). Aucune API externe : tout est calculé dans le navigateur.
import type { buildContent } from "./content";
import type { Lang } from "./i18n";

type C = ReturnType<typeof buildContent>;
export type Action = { label: string; project?: string; target?: string };
export type Reply = { text: string; actions?: Action[]; chips?: string[] };

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9+#.\s]/g, " ").replace(/\s+/g, " ").trim();
const toks = (s: string) => norm(s).split(" ").map((t) => t.replace(/^\.+|\.+$/g, "")).filter(Boolean);

const STOP = new Set(
  ("le la les un une des de du d l et ou en au aux a as est sont ce cet cette ces je tu il elle nous vous ils elles me te se que qui quoi quel quels quelle quelles dans sur avec pour par pas ne y son sa ses leur " +
    "the an of and or in on at to is are was be do does did you your her she he his it its this that these what which who how about with for from by as me my tell give show list " +
    "parle moi dis donne liste montre ses elle t il y a ai fait fais faire peux peut puis comment combien ou quand pourquoi est ce qu")
    .split(" "),
);

const short = (t: string) => t.split(/ — | – |:/)[0];

export function suggestions(lang: Lang): string[] {
  return lang === "fr"
    ? ["Quels sont ses projets ?", "Quelles compétences ?", "Parle-moi de son parcours", "Comment la contacter ?"]
    : ["What are her projects?", "What skills does she have?", "Tell me about her journey", "How can I contact her?"];
}

export function answer(question: string, c: C, lang: Lang): Reply {
  const fr = lang === "fr";
  const q = norm(question);
  const qt = toks(question).filter((t) => t.length >= 3 && !STOP.has(t));
  const { PROFILE, PROJECTS, SKILL_GROUPS, EXPERIENCE, EDUCATION, CERTIFICATIONS, FOCUS, CATEGORIES } = c;
  const has = (re: RegExp) => re.test(q);
  const chips = suggestions(lang);

  // ---------- score des projets ----------
  const scored = PROJECTS.map((p) => {
    const title = norm(p.title);
    const kicker = norm(p.kicker);
    const tech = norm(p.tech.join(" "));
    const rest = norm([p.description, p.features.join(" "), p.lead, p.outcome, p.from, p.to].join(" "));
    let s = 0;
    for (const t of qt) {
      if (title.includes(t)) s += 4;
      if (kicker.includes(t)) s += 2;
      if (tech.includes(t)) s += 2;
      if (rest.includes(t)) s += 1;
    }
    return { p, s };
  }).sort((a, b) => b.s - a.s);
  const top = scored[0];
  const strongProject = top && top.s >= 4;

  const projectReply = (p: (typeof PROJECTS)[number]): Reply => ({
    text:
      `${p.title}\n${p.lead}\n` +
      `${fr ? "Transformation" : "Transformation"} : ${p.from} → ${p.to}\n` +
      `${fr ? "Résultat" : "Outcome"} : ${p.outcome}\n` +
      `${fr ? "Technologies" : "Tech"} : ${p.tech.slice(0, 8).join(", ")}`,
    actions: [{ label: fr ? "Voir le projet" : "View the project", project: p.id }],
    chips,
  });

  // ---------- salutations / remerciements ----------
  if (has(/^(bonjour|bonsoir|salut|hello|hi|hey|coucou|salam)\b/) && qt.length === 0)
    return {
      text: fr
        ? `Bonjour ! Je suis l'assistant de ${PROFILE.firstName}. Posez-moi vos questions sur ses projets, ses compétences, son parcours ou ses certifications.`
        : `Hello! I'm ${PROFILE.firstName}'s assistant. Ask me about her projects, skills, journey or certifications.`,
      chips,
    };
  if (has(/\b(merci|thanks|thank you|thx)\b/))
    return { text: fr ? "Avec plaisir ! N'hésitez pas si vous avez d'autres questions." : "My pleasure! Feel free to ask anything else.", chips };
  if (has(/\b(au revoir|bye|a bientot|goodbye)\b/))
    return { text: fr ? "À bientôt ! Bonne visite du portfolio." : "See you soon! Enjoy the portfolio.", chips };

  // ---------- contact / opportunités ----------
  if (has(/(contact|e mail|email|mail|telephone|phone|numero|joindre|reach|linkedin|github|whatsapp|recrut|embauch|hire|hiring|opportun|disponib|available|collabor)/) && !strongProject)
    return {
      text:
        (fr ? `Vous pouvez contacter ${PROFILE.name} :` : `You can reach ${PROFILE.name}:`) +
        `\n• ${fr ? "E-mail" : "Email"} : ${PROFILE.email}\n• ${fr ? "Téléphone" : "Phone"} : ${PROFILE.phone}` +
        (PROFILE.linkedin ? `\n• LinkedIn : ${PROFILE.linkedin}` : "") +
        `\n• ${PROFILE.location}`,
      actions: [{ label: fr ? "Ouvrir la section contact" : "Open the contact section", target: "contact" }],
      chips,
    };

  // ---------- projet précis ----------
  if (strongProject) return projectReply(top.p);

  // ---------- technologie citée ----------
  const techNames = new Set<string>();
  PROJECTS.forEach((p) => p.tech.forEach((t) => techNames.add(t)));
  SKILL_GROUPS.forEach((g) => g.skills.forEach((t) => techNames.add(t)));
  const padded = ` ${q} `;
  const mentioned = [...techNames].filter((t) => {
    const n = norm(t);
    return n.length >= 3 && padded.includes(` ${n} `);
  });
  if (mentioned.length > 0 && !has(/(competence|skills?)\b.*(liste|toutes|all)/)) {
    const t = mentioned.sort((a, b) => b.length - a.length)[0];
    const using = PROJECTS.filter((p) => p.tech.some((x) => norm(x) === norm(t)));
    const fam = SKILL_GROUPS.find((g) => g.skills.some((x) => norm(x) === norm(t)));
    const parts: string[] = [];
    parts.push(
      fam
        ? fr ? `${t} fait partie de ses compétences (${fam.label}).` : `${t} is part of her skills (${fam.label}).`
        : fr ? `${t} est utilisé dans ses projets.` : `${t} is used in her projects.`,
    );
    if (using.length)
      parts.push((fr ? `Projets qui l'utilisent (${using.length}) :` : `Projects using it (${using.length}):`) + "\n" + using.map((p) => `• ${short(p.title)}`).join("\n"));
    return {
      text: parts.join("\n"),
      actions: using.length ? [{ label: fr ? "Voir le premier projet" : "View the first project", project: using[0].id }] : [{ label: fr ? "Voir les compétences" : "See the skills", target: "skills" }],
      chips,
    };
  }

  // ---------- expérience précise ----------
  const expHit = EXPERIENCE.find((e) => qt.some((t) => norm(`${e.title} ${e.place}`).split(" ").includes(t) && t.length >= 4 && !["stage", "internship", "developer", "developpeur", "software", "final", "logiciel"].includes(t)));
  const expReply = (list: typeof EXPERIENCE): Reply => ({
    text: list
      .map((e) => `${e.title}\n${e.place} · ${e.period}\n` + e.bullets.slice(0, 3).map((b) => `• ${b}`).join("\n"))
      .join("\n\n"),
    actions: [{ label: fr ? "Voir le parcours" : "See the journey", target: "experience" }],
    chips,
  });
  if (expHit) return expReply([expHit]);

  // ---------- grandes familles de questions ----------
  if (has(/(certif|datacamp|cisco|badge|ccna|coursera)/))
    return {
      text: (fr ? `${CERTIFICATIONS.length} certifications :` : `${CERTIFICATIONS.length} certifications:`) + "\n" +
        CERTIFICATIONS.map((x) => `• ${x.title}${x.issuer ? ` (${x.issuer}, ${x.year})` : ` (${x.year})`}`).join("\n"),
      actions: [{ label: fr ? "Voir les certifications" : "See the certifications", target: "certifications" }],
      chips,
    };
  if (has(/(experience|stage|stages|internship|travail|travaille|job|entreprise|employ|work experience|parcours professionnel|career)/))
    return expReply(EXPERIENCE);
  if (has(/(formation|etude|etudes|diplome|master|licence|bac\b|ecole|universite|education|degree|school|studies|ensam|fst|study|studied)/))
    return {
      text: EDUCATION.map((e) => `${e.title}\n${e.place} · ${e.period}`).join("\n\n"),
      actions: [{ label: fr ? "Voir le parcours" : "See the journey", target: "experience" }],
      chips,
    };
  if (has(/(parles|parle t|langues|langue|languages|language|speak|francais|anglais|arabe|english|french|arabic)/) && !has(/(programmation|programming|python|java)/))
    return { text: PROFILE.languages.map((l) => `• ${l.name} (${l.level})`).join("\n"), chips };
  if (has(/(soft skills|qualites|qualities|strengths|points forts|savoir etre)/))
    return { text: PROFILE.softSkills.map((s) => `• ${s}`).join("\n"), chips };
  if (has(/(competence|competences|skills?|techno|technologies|technology|stack|outils|tools|savoir faire|maitrise|programmation|programming)/))
  {
    const hit = SKILL_GROUPS.filter((g) => qt.some((t) => t.length >= 3 && norm(`${g.label} ${g.short}`).split(" ").includes(t)));
    const groups = hit.length ? hit : SKILL_GROUPS;
    return {
      text: groups.map((g) => `${g.label} : ${(hit.length ? g.skills : g.skills.slice(0, 6)).join(", ")}`).join("\n"),
      actions: [{ label: fr ? "Voir les compétences" : "See the skills", target: "skills" }],
      chips,
    };
  }
  if (has(/(specialit|focus|domaine|expertise|specialis|interet|interest|passion|speciali[sz]e)/))
    return { text: FOCUS.map((f) => `• ${f.t} : ${f.d}`).join("\n") + "\n\n" + PROFILE.extraLine, chips };
  if (has(/(ou habite|ou vit|ou est|ville|location|where|based|live|casablanca|maroc|morocco)/))
    return { text: fr ? `${PROFILE.firstName} est basée à ${PROFILE.location}.` : `${PROFILE.firstName} is based in ${PROFILE.location}.`, chips };
  if (has(/(qui es|qui est|presente|presentation|parle moi de|about|who is|who are|profil|profile|introduce|yourself|resume|resumer|summary|ghizlane)/) && !has(/(projet|project)/))
    return {
      text: `${PROFILE.name} — ${PROFILE.role}\n\n${PROFILE.resumeSummary}`,
      actions: [{ label: fr ? "Voir la section À propos" : "See the About section", target: "about" }],
      chips,
    };
  if (has(/(projet|projets|project|projects|realisation|realis|built|build|travaux|portfolio|made|created|cree)/)) {
    const byCat = CATEGORIES.filter((k) => k.id !== "all")
      .map((k) => {
        const ps = PROJECTS.filter((p) => p.category === k.id);
        return ps.length ? `${k.label} (${ps.length}) :\n${ps.map((p) => `• ${short(p.title)}`).join("\n")}` : "";
      })
      .filter(Boolean)
      .join("\n\n");
    return {
      text: (fr ? `${PROJECTS.length} projets, racontés comme des transformations :` : `${PROJECTS.length} projects, told as transformations:`) + "\n\n" + byCat,
      actions: [{ label: fr ? "Voir les projets" : "See the projects", target: "work" }],
      chips: [short(PROJECTS[0].title), short(PROJECTS[3].title), short(PROJECTS[1].title)],
    };
  }

  // ---------- recherche générale (dernier recours) ----------
  if (top && top.s >= 2) return projectReply(top.p);
  return {
    text: fr
      ? "Je n'ai pas trouvé cette information dans le portfolio. Essayez de me demander ses projets, compétences, stages, formation, certifications, ou comment la contacter."
      : "I couldn't find that in the portfolio. Try asking about her projects, skills, internships, education, certifications, or how to contact her.",
    chips,
  };
}
