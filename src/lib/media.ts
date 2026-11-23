// Médias réellement présents (liste générée par scripts/convert-videos.mjs à chaque `npm run dev` / `build`).
// Le site n'a donc plus à tester les fichiers un par un : pas de requêtes 404, affichage immédiat.
import manifest from "./media.generated.json";

type VideoEntry = { src: string; poster?: string };
const M = manifest as { videos: Record<string, VideoEntry>; images: Record<string, string> };

export const videoFor = (id: string): VideoEntry | undefined => M.videos[id];
export const imageFor = (id: string): string | undefined => M.images[id];
