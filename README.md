# Portfolio — Benbella Ghizlane

Portfolio « vidéo parlante » : Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 et Lenis
(défilement fluide). Aucune autre dépendance d'animation : uniquement CSS, IntersectionObserver et de
petites boucles `requestAnimationFrame`. Polices auto-hébergées, aucun script externe.

## Lancer le site

```bash
npm install          # sous PowerShell : npm.cmd install
npm run dev          # npm.cmd run dev   -> http://localhost:3000
npm run build        # build de production
npm start            # sert le build
```

## Sections

| # | Section | Id | Composant |
|---|---------|----|-----------|
| – | Accueil (avatar vidéo affiché directement + bouton son + LinkedIn) | `hero` | `components/hero/Hero.tsx` |
| 01 | À propos : badge suspendu, scan animé puis infos | `about` | `sections/About.tsx` |
| 02 | Compétences : tableau périodique | `skills` | `sections/Skills.tsx` |
| 03 | Projets : carrousel horizontal, chaque projet raconté en lead → transformation → outcome | `work` | `sections/Work.tsx` |
| 04 | Certifications | `certifications` | `sections/Certifications.tsx` |
| 05 | Parcours : études + stages | `experience` | `sections/Experience.tsx` |
| 06 | Contact + pied de page | `contact` | `sections/Contact.tsx` |

## Langues (français / anglais)

Le bouton **FR | EN** de la barre de navigation change la langue de tout le site ; le choix est mémorisé
(sinon la langue du navigateur est utilisée). Où modifier les textes :

- Français : `src/lib/data.ts` (profil, compétences, parcours, projets) et `src/lib/ui.ts` (textes d'interface).
- Anglais : `src/lib/data.en.ts` (même structure, mêmes identifiants) et `src/lib/ui.ts`.
- Histoire de chaque projet (lead, transformation de → vers, outcome) : `src/lib/stories.ts`, en `fr` et `en`.

## Modifier le contenu

- **Projets** : tableau `PROJECTS` de `data.ts` (catégorie, statut, description, fonctionnalités, technologies).
  Le texte anglais correspondant est dans `PROJECTS_EN` de `data.en.ts` (même `id`).
- **LinkedIn / GitHub** : `PROFILE.linkedin` et `PROFILE.github` dans `data.ts`. L'icône LinkedIn s'affiche
  dans la navigation, l'accueil, la section À propos et le contact.
- **Couleurs** : variables en haut de `src/app/globals.css` (`--wine` = bleu pervenche, `--rose` = rose, `--blush` / `--lav` = lavande, `--pink` = rose poudré, `--grad` = dégradé des boutons, `--ink` = texte). Style « verre dépoli » inspiré de l'image Lumis.

## Images des projets

Déposez une image par projet dans `public/projects/`, nommée d'après l'identifiant du projet
(`coach.jpg`, `visionguard.jpg`, `farming.png`… voir `public/projects/LISEZ-MOI.txt`). Elle s'affiche
automatiquement ; sans image, l'illustration vectorielle de `src/components/ui/Cover.tsx` est utilisée.

## Vidéos des projets

Déposez la vidéo d'origine (n'importe quel format) dans `videos-source/` ou `public/videos/`, nommée d'après
l'identifiant du projet (`redrambler.mov`…). `npm run dev` / `npm run build` / `npm run videos` la convertissent
automatiquement en MP4 H.264 + AAC (le format que tous les navigateurs lisent ; les vidéos H.265/HEVC provoquent
« codec non pris en charge »), créent une image d'aperçu et gardent l'original dans `videos-source/`.
Le bouton « Voir la vidéo » apparaît tout seul. La liste des médias est écrite dans `src/lib/media.generated.json`
(le site n'a plus à tester les fichiers un par un, ce qui accélère l'affichage). Les images trop lourdes de
`public/projects/` sont aussi réduites en WebP.

## Vidéo d'intro de l'accueil

La vidéo de l'avatar (fond recoloré pour la palette bordeaux/rose) est déjà traitée (`public/hero/hero.mp4` et `hero.webm`). Pour la remplacer :

```bash
python3 scripts/build-hero-assets.py intro.mp4 --crop largeur:hauteur:x:y --white 0.86 --no-portrait
```

Le script (prérequis : `ffmpeg`, `ffprobe`, `numpy`, `Pillow`) recadre la personne, blanchit le fond,
teinte le blanc à la couleur de la page (`--paper`), crée une boucle sans coupure (fondu image et son de 0,5 s)
et exporte les deux fichiers. `--white` règle le blanchiment : baissez-le si le fond est gris.
Le portrait de la carte d'identité (`public/portrait-bust.webp`) vient de la photo du CV.
La voix s'arrête quand l'accueil quitte l'écran ; le bouton rond ▶ / ❚❚ active ou coupe le son.

## Crédits et licences

- Logos de technologies : [devicon](https://devicon.dev) (variantes « original »), licence MIT,
  copiée dans `public/logos/LICENSE-devicon.txt`. Les marques restent la propriété de leurs détenteurs.
- Polices (OFL) : Inter Tight, Instrument Serif, JetBrains Mono, via Fontsource.
- Icônes de compétences conceptuelles et couvertures de projets : dessinées à la main (SVG).

## Notes techniques

- JS au premier chargement : environ 133 kB.
- Responsive de 360 à 1920 px, sans défilement horizontal.
- `prefers-reduced-motion` désactive le défilement fluide et les animations décoratives.
- Alias `@/` configuré dans `next.config.mjs` (webpack) et `tsconfig.json`.

## Assistant (chatbot)

Un robot flottant en bas à droite ouvre un assistant qui répond aux questions sur les données du portfolio
(projets, compétences, parcours, certifications, contact), en français ou en anglais selon la langue choisie.
Il fonctionne entièrement dans le navigateur, sans clé ni API : le moteur est dans `src/lib/chatbot.ts`, l'interface
dans `src/components/chat/`. Il lit les mêmes données que le site : modifiez `data.ts` / `data.en.ts` et ses réponses suivent.

## Police

Les titres et le nom utilisent **Outfit** (paquet `@fontsource-variable/outfit`, installé par `npm install`).
