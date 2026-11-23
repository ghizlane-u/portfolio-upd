"use client";
import { useState } from "react";
import { imageFor } from "@/lib/media";
import Cover from "./Cover";

/**
 * Visuel d'un projet.
 * 1) Si une image existe dans public/projects/ (<id-du-projet>.jpg, .png ou .webp), elle s'affiche en entier
 *    (sans recadrage) sur un fond flouté de la même image. La liste des images est connue à l'avance
 *    (media.generated.json) : aucun essai de fichier, aucune requête 404.
 * 2) Sinon, une illustration aux couleurs du portfolio est utilisée (Cover.tsx).
 */
export default function ProjectVisual({ id, cover, title }: { id: string; cover: string; title: string }) {
  const src = imageFor(id);
  const [ok, setOk] = useState(false);
  const [broken, setBroken] = useState(false);
  const showPhoto = !!src && !broken;
  return (
    <div className="pv" data-photo={ok ? "1" : "0"}>
      <div className="pv-art"><Cover kind={cover} /></div>
      {showPhoto && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pv-bg" src={src} alt="" aria-hidden draggable={false} decoding="async" style={{ opacity: ok ? 1 : 0 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            // Image déjà en cache : on l'affiche sans attendre l'événement load.
            ref={(el) => { if (el?.complete && el.naturalWidth > 0 && !ok) setOk(true); }}
            className="pv-img"
            src={src}
            alt={title}
            decoding="async"
            fetchPriority="high"
            onLoad={() => setOk(true)}
            onError={() => setBroken(true)}
            style={{ opacity: ok ? 1 : 0 }}
            draggable={false}
          />
        </>
      )}
    </div>
  );
}
