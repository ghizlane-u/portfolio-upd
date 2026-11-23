#!/usr/bin/env python3
"""Transforme la vidéo d'intro en clip « hero » qui boucle sans coupure.

Usage :
    python3 scripts/build-hero-assets.py intro.mp4
    python3 scripts/build-hero-assets.py intro.mp4 --crop 800:1000:560:40   # w:h:x:y manuel
    python3 scripts/build-hero-assets.py intro.mp4 --photo moi.jpg          # photo pour la carte

Sorties : public/hero/hero.mp4, public/hero/hero.webm, public/portrait-bust.webp, public/og.jpg
Prérequis : ffmpeg, ffprobe, numpy, Pillow.
"""
import argparse, json, subprocess, sys, tempfile, wave
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FADE = 0.5      # secondes de fondu
MAX_LEN = 10.0  # on garde environ les 10 premières secondes
SR = 48000


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def probe(src):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height:format=duration", "-of", "json", str(src)],
        check=True, capture_output=True, text=True).stdout
    j = json.loads(out)
    return j["streams"][0]["width"], j["streams"][0]["height"], float(j["format"]["duration"])


def grab_frame(src, t, dest):
    run(["ffmpeg", "-y", "-ss", str(t), "-i", str(src), "-frames:v", "1", str(dest)])
    return Image.open(dest).convert("RGB")


def detect_person(img):
    """Boîte englobante de la personne : pixels qui s'écartent du fond clair."""
    a = np.asarray(img).astype(np.int16)
    bg = np.median(a[: a.shape[0] // 10, :, :].reshape(-1, 3), axis=0)
    diff = np.abs(a - bg).sum(axis=2) > 60
    ys, xs = np.where(diff)
    if len(xs) == 0:
        return 0, 0, img.width, img.height
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def auto_crop(w, h, box):
    x0, y0, x1, y1 = box
    ph = (y1 - y0) * 1.12                      # marge autour de la personne
    ch = min(h, int(ph))
    cw = int(ch * 768 / 960)                   # ratio 4:5 -> 768x960
    cx = (x0 + x1) // 2
    x = max(0, min(w - cw, cx - cw // 2))
    y = max(0, min(h - ch, (y0 + y1) // 2 - ch // 2))
    return cw // 2 * 2, ch // 2 * 2, x, y


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--crop", help="w:h:x:y (sinon détection automatique)")
    ap.add_argument("--photo", help="photo de face pour portrait-bust.webp")
    ap.add_argument("--white", type=float, default=0.98,
                    help="seuil de blanchiment du fond (0.98 = fond presque blanc ; baisser, ex. 0.88, si le fond est gris clair)")
    ap.add_argument("--paper", default="f4f2ee",
                    help="couleur de fond de la page (hex) : le blanc de la vidéo est teinté pour se fondre dedans, sans mix-blend-mode")
    ap.add_argument("--no-portrait", action="store_true", help="ne pas régénérer portrait-bust.webp")
    args = ap.parse_args()

    src = Path(args.video).resolve()
    w, h, dur = probe(src)
    L = min(MAX_LEN, dur)
    tmp = Path(tempfile.mkdtemp())

    frame = grab_frame(src, min(1.0, dur / 2), tmp / "f.png")
    if args.crop:
        cw, ch, cx, cy = (int(v) for v in args.crop.split(":"))
    else:
        cw, ch, cx, cy = auto_crop(w, h, detect_person(frame))
    print(f"crop = {cw}:{ch}:{cx}:{cy}")
    pr, pg_, pb = (int(args.paper[i:i + 2], 16) / 255 for i in (0, 2, 4))

    # 1) Vidéo : recadrage, fond blanc pur, fondu enchaîné de la fin vers le début.
    vf = (
        f"[0:v]crop={cw}:{ch}:{cx}:{cy},scale=768:-2,"
        f"colorlevels=rimax={args.white}:gimax={args.white}:bimax={args.white},colorchannelmixer=rr={pr:.4f}:gg={pg_:.4f}:bb={pb:.4f},fps=30,setsar=1,split[a0][b0];"
        f"[a0]trim={FADE}:{L},setpts=PTS-STARTPTS[a];"
        f"[b0]trim=0:{FADE},setpts=PTS-STARTPTS[b];"
        f"[a][b]xfade=transition=fade:duration={FADE}:offset={L - 2 * FADE:.3f}[v]"
    )
    vid = tmp / "video.mp4"
    run(["ffmpeg", "-y", "-i", str(src), "-filter_complex", vf, "-map", "[v]",
         "-an", "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p", str(vid)])

    # 2) Audio : même fondu, mais calculé à l'échantillon près avec numpy.
    raw = tmp / "a.wav"
    run(["ffmpeg", "-y", "-i", str(src), "-vn", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", str(raw)])
    with wave.open(str(raw)) as wf:
        pcm = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    n = int(FADE * SR)
    seg = pcm[: int(L * SR)]
    a, b = seg[n:], seg[:n]
    ramp = np.linspace(0.0, 1.0, n, dtype=np.float32)
    out = np.concatenate([a[:-n], a[-n:] * (1 - ramp) + b * ramp])
    wav = tmp / "loop.wav"
    with wave.open(str(wav), "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())

    # 3) Exports.
    hero = ROOT / "public" / "hero"
    hero.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-y", "-i", str(vid), "-i", str(wav), "-c:v", "libx264", "-crf", "24", "-preset", "slow",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest",
         str(hero / "hero.mp4")])
    run(["ffmpeg", "-y", "-i", str(vid), "-i", str(wav), "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
         "-c:a", "libopus", "-b:a", "80k", "-shortest", str(hero / "hero.webm")])

    # 4) Portrait (carte d'identité) + image de partage.
    pimg = Image.open(args.photo).convert("RGB") if args.photo else grab_frame(src, L / 2, tmp / "p.png").crop((cx, cy, cx + cw, cy + ch))
    bx0, by0, bx1, by1 = detect_person(pimg)
    head_h = int((by1 - by0) * 0.55)
    pw = int(head_h * 4 / 5)
    px = max(0, min(pimg.width - pw, (bx0 + bx1) // 2 - pw // 2))
    if not args.no_portrait:
        pimg.crop((px, by0, px + pw, by0 + head_h)).resize((480, 600), Image.LANCZOS).save(
            ROOT / "public" / "portrait-bust.webp", quality=88)
    og = Image.new("RGB", (1200, 630), (244, 242, 238))
    person = pimg.resize((int(pimg.width * 630 / pimg.height), 630), Image.LANCZOS)
    og.paste(person, ((1200 - person.width) // 2, 0))
    og.save(ROOT / "public" / "og.jpg", quality=88)

    print("OK -> public/hero/hero.mp4, hero.webm, portrait-bust.webp, og.jpg")
    print('Dernière étape : mettre HERO_VIDEO = true dans src/lib/data.ts')


if __name__ == "__main__":
    sys.exit(main())
