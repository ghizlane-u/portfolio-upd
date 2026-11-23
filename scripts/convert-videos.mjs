// Prépare automatiquement les médias du portfolio (lancé par `npm run dev`, `npm run build` ou `npm run videos`).
//
// VIDÉOS
//  - Déposez vos vidéos d'origine dans videos-source/  OU directement dans public/videos/ (nom = id du projet).
//  - Toute vidéo qui n'est pas en MP4 H.264 (8 bits) + AAC — typiquement H.265/HEVC d'un téléphone ou d'un
//    enregistreur d'écran — est convertie, puis remplacée dans public/videos/<id>.mp4. L'original est
//    conservé dans videos-source/.
//  - Une image d'aperçu (poster) est créée pour chaque vidéo : le lecteur s'affiche instantanément.
// IMAGES
//  - Les images trop lourdes de public/projects/ sont réduites en WebP (1600 px max). L'original va dans images-source/.
// MANIFESTE
//  - src/lib/media.generated.json liste les médias présents : le site n'a plus à « deviner » les fichiers
//    (plus de requêtes 404 successives), ce qui accélère l'affichage.
import { spawnSync } from "node:child_process";
import {
  copyFileSync, utimesSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "videos-source");
const imgSrcDir = path.join(root, "images-source");
const vidDir = path.join(root, "public", "videos");
const posterDir = path.join(vidDir, "posters");
const imgDir = path.join(root, "public", "projects");
const manifestPath = path.join(root, "src", "lib", "media.generated.json");
const statePath = path.join(root, "node_modules", ".cache", "portfolio-media.json");

const FORCE = process.argv.includes("--force"); // npm run videos -- --force : reconvertit tout
const VIDEO_EXT = new Set([".mp4", ".mov", ".mkv", ".avi", ".webm", ".m4v", ".wmv", ".3gp"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_VIDEO_MB = 25; // au-delà, la vidéo est recompressée pour un chargement rapide
const MAX_IMAGE_KB = 350;

const ls = (d) => (existsSync(d) ? readdirSync(d) : []);
const ext = (f) => path.extname(f).toLowerCase();
const base = (f) => path.basename(f, path.extname(f));

// --- ffmpeg : ffmpeg-static, sinon ffmpeg installé sur la machine ---------------------------------
let ffmpeg = null;
try {
  const p = (await import("ffmpeg-static")).default;
  if (p && existsSync(p)) ffmpeg = p;
} catch {}
if (!ffmpeg && spawnSync("ffmpeg", ["-version"]).status === 0) ffmpeg = "ffmpeg";

let state = {};
try { state = JSON.parse(readFileSync(statePath, "utf8")); } catch {}
const saveState = () => {
  try {
    mkdirSync(path.dirname(statePath), { recursive: true });
    writeFileSync(statePath, JSON.stringify(state));
  } catch {}
};
/** Copie une sauvegarde en gardant la date d'origine (sinon elle paraîtrait « plus récente » que la version convertie). */
const backup = (from, to) => {
  if (existsSync(to)) return;
  copyFileSync(from, to);
  const s = statSync(from);
  utimesSync(to, s.atime, s.mtime);
};
const sig = (f) => { const s = statSync(f); return `${s.size}:${Math.round(s.mtimeMs)}`; };

/** Lit les codecs d'un fichier grâce à la sortie de `ffmpeg -i`. */
function probe(file) {
  const r = spawnSync(ffmpeg, ["-hide_banner", "-i", file], { encoding: "utf8" });
  const out = `${r.stderr ?? ""}`;
  const line = out.match(/Video: [^\n]*/)?.[0] ?? "";
  const video = line.match(/Video: (\w+)/)?.[1] ?? null;
  const profile = line.match(/\(([^)]*)\)/)?.[1] ?? "";
  const pix = line.match(/, (yuv\w+|gray\w*|rgb\w*|gbr\w*|nv\d+|p\d+\w*)[(,\s]/)?.[1] ?? null;
  const a = out.match(/Audio: (\w+)/);
  return { video, profile, pix, audio: a?.[1] ?? null };
}

function encode(input, target) {
  const r = spawnSync(
    ffmpeg,
    ["-y", "-loglevel", "error", "-i", input, "-map", "0:v:0", "-map", "0:a:0?",
     "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1",
     "-vf", "scale='min(1280,iw)':-2", "-r", "30", "-c:a", "aac", "-b:a", "128k", "-ac", "2",
     "-movflags", "+faststart", target],
    { stdio: "inherit" },
  );
  return r.status === 0 && existsSync(target);
}

function poster(video, id) {
  mkdirSync(posterDir, { recursive: true });
  const out = path.join(posterDir, `${id}.jpg`);
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(video).mtimeMs) return;
  for (const t of ["1", "0"]) {
    spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-ss", t, "-i", video, "-frames:v", "1", "-vf", "scale='min(960,iw)':-2", "-q:v", "5", out]);
    if (existsSync(out)) return;
  }
}

function processVideos() {
  mkdirSync(vidDir, { recursive: true });
  // 1) Vidéos d'origine déposées dans videos-source/ → public/videos/<id>.mp4
  for (const f of ls(srcDir).filter((f) => VIDEO_EXT.has(ext(f)))) {
    const input = path.join(srcDir, f);
    const target = path.join(vidDir, `${base(f)}.mp4`);
    if (existsSync(target) && statSync(target).mtimeMs >= statSync(input).mtimeMs) continue;
    console.log(`[médias] conversion de videos-source/${f} …`);
    console.log(encode(input, target) ? `[médias] OK → public/videos/${base(f)}.mp4` : `[médias] ÉCHEC pour ${f}`);
  }
  // 2) Vidéos déposées directement dans public/videos/ : vérifiées, converties si nécessaire.
  for (const f of ls(vidDir).filter((f) => VIDEO_EXT.has(ext(f)))) {
    const file = path.join(vidDir, f);
    const key = `v:${f}`;
    if (!FORCE && state[key] === sig(file)) continue;
    const info = probe(file);
    const sizeMb = statSync(file).size / 1048576;
    const compatible =
      ext(f) === ".mp4" && info.video === "h264" && info.pix === "yuv420p" && /^(Baseline|Constrained Baseline|Main|High)$/.test(info.profile) && (!info.audio || info.audio === "aac");
    if (!FORCE && compatible && sizeMb <= MAX_VIDEO_MB) {
      console.log(`[médias] ${f} : déjà compatible (${info.video}, ${info.pix}, ${info.audio ?? "pas de son"}).`); state[key] = sig(file); continue; }

    console.log(`[médias] ${f} : ${info.video ?? "?"} ${info.pix ?? ""} ${info.profile}/${info.audio ?? "pas de son"}, ${sizeMb.toFixed(1)} Mo → conversion en H.264 + AAC …`);
    const tmp = path.join(vidDir, `.tmp-${base(f)}.mp4`);
    if (!encode(file, tmp)) { rmSync(tmp, { force: true }); console.warn(`[médias] ÉCHEC pour ${f}`); continue; }
    mkdirSync(srcDir, { recursive: true });
    backup(file, path.join(srcDir, f)); // l'original est conservé
    const final = path.join(vidDir, `${base(f)}.mp4`);
    if (file !== final) rmSync(file, { force: true });
    renameSync(tmp, final);
    state[`v:${base(f)}.mp4`] = sig(final);
    console.log(`[médias] OK → public/videos/${base(f)}.mp4 (${(statSync(final).size / 1048576).toFixed(1)} Mo, original gardé dans videos-source/)`);
  }
  for (const f of ls(vidDir).filter((f) => ext(f) === ".mp4" && !f.startsWith("."))) poster(path.join(vidDir, f), base(f));
}

function processImages() {
  for (const f of ls(imgDir).filter((f) => IMAGE_EXT.has(ext(f)))) {
    const file = path.join(imgDir, f);
    const key = `i:${f}`;
    if (state[key] === sig(file)) continue;
    const kb = statSync(file).size / 1024;
    if (kb <= MAX_IMAGE_KB) { state[key] = sig(file); continue; }
    const target = path.join(imgDir, `${base(f)}.webp`);
    const tmp = path.join(imgDir, `.tmp-${base(f)}.webp`);
    const r = spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-i", file, "-vf", "scale='min(1600,iw)':-2", "-quality", "80", tmp]);
    if (r.status !== 0 || !existsSync(tmp)) { rmSync(tmp, { force: true }); continue; }
    if (statSync(tmp).size >= statSync(file).size) { rmSync(tmp, { force: true }); state[key] = sig(file); continue; }
    mkdirSync(imgSrcDir, { recursive: true });
    backup(file, path.join(imgSrcDir, f));
    if (file !== target) rmSync(file, { force: true });
    renameSync(tmp, target);
    state[`i:${base(f)}.webp`] = sig(target);
    console.log(`[médias] image ${f} : ${kb.toFixed(0)} Ko → ${(statSync(target).size / 1024).toFixed(0)} Ko (webp)`);
  }
}

function writeManifest() {
  const videos = {};
  for (const f of ls(vidDir)) {
    if (f.startsWith(".") || !VIDEO_EXT.has(ext(f))) continue;
    const id = base(f);
    const hasPoster = existsSync(path.join(posterDir, `${id}.jpg`));
    videos[id] = { src: `/videos/${f}`, ...(hasPoster ? { poster: `/videos/posters/${id}.jpg` } : {}) };
  }
  const images = {};
  const order = [".webp", ".jpg", ".jpeg", ".png"];
  for (const f of ls(imgDir)) {
    if (f.startsWith(".") || !IMAGE_EXT.has(ext(f))) continue;
    const id = base(f);
    if (images[id] && order.indexOf(ext(images[id])) <= order.indexOf(ext(f))) continue;
    images[id] = `/projects/${f}`;
  }
  const next = JSON.stringify({ videos, images }, null, 2) + "\n";
  let prev = "";
  try { prev = readFileSync(manifestPath, "utf8"); } catch {}
  if (prev !== next) writeFileSync(manifestPath, next);
  console.log(`[médias] ${Object.keys(videos).length} vidéo(s), ${Object.keys(images).length} image(s) de projet détectée(s).`);
}

if (!ffmpeg) {
  console.error("\n[médias] ⚠ ffmpeg INTROUVABLE : les vidéos NE PEUVENT PAS être converties (d'où « codec non pris en charge »).\n" +
    "         Solution : relancez `npm install` (ffmpeg-static doit se télécharger) ou installez ffmpeg\n" +
    "         (Windows : winget install Gyan.FFmpeg, puis rouvrez le terminal), puis `npm run videos`.\n");
} else {
  processVideos();
  processImages();
  saveState();
}
writeManifest();
