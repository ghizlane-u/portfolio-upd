"use client";
import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang" role="group" aria-label={UI[lang].langLabel}>
      <button onClick={() => setLang("fr")} aria-pressed={lang === "fr"} lang="fr" aria-label="Français">FR</button>
      <button onClick={() => setLang("en")} aria-pressed={lang === "en"} lang="en" aria-label="English">EN</button>
    </div>
  );
}
