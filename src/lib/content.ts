"use client";
import { useMemo } from "react";
import * as FR from "./data";
import * as EN from "./data.en";
import { STORIES } from "./stories";
import { AI_DETAILS, type AiDetails } from "./ai-details";
import { UI } from "./ui";
import { useLang, type Lang } from "./i18n";

export type LocalProject = FR.Project & { lead: string; from: string; to: string; outcome: string; ai?: AiDetails };

/** Contenu complet (profil, projets, compétences…) dans la langue demandée. */
export function buildContent(lang: Lang) {
  const en = lang === "en";

  const PROFILE = en ? { ...FR.PROFILE, ...EN.PROFILE_EN } : FR.PROFILE;
  const FOCUS = en ? EN.FOCUS_EN : FR.FOCUS;
  const NAV = en ? EN.NAV_EN : FR.NAV;

  const SKILL_GROUPS = FR.SKILL_GROUPS.map((g) => {
    if (!en) return g;
    const t = EN.SKILL_GROUPS_EN[g.id];
    return { ...g, label: t.label, short: t.short, skills: g.skills.map((s) => t.rename?.[s] ?? s) };
  });

  const EXPERIENCE = FR.EXPERIENCE.map((e) => (en ? { ...e, ...EN.EXPERIENCE_EN[e.id] } : e));
  const EDUCATION = FR.EDUCATION.map((e) => {
    if (!en) return e;
    const t = EN.EDUCATION_EN[e.id];
    return { ...e, title: t.title, place: t.place, period: e.period };
  });
  const CATEGORIES = FR.CATEGORIES.map((c) => (en ? { ...c, label: EN.CATEGORIES_EN[c.id] } : c));
  const CERTIFICATIONS = FR.CERTIFICATIONS;

  const PROJECTS: LocalProject[] = FR.PROJECTS.map((p) => {
    const s = STORIES[p.id]?.[lang] ?? { lead: "", from: "", to: "", outcome: "" };
    const tr = en ? EN.PROJECTS_EN[p.id] : undefined;
    return { ...p, ...(tr ?? {}), ...s, ai: AI_DETAILS[p.id]?.[lang] };
  });

  return { PROFILE, FOCUS, NAV, SKILL_GROUPS, EXPERIENCE, EDUCATION, CATEGORIES, CERTIFICATIONS, PROJECTS, ui: UI[lang] };
}

export function useContent() {
  const { lang } = useLang();
  return useMemo(() => buildContent(lang), [lang]);
}
