#!/usr/bin/env python3
"""Génère le portfolio au format PDF (FR et EN) à partir des données du site.

Script de référence (non lancé par le site) : il lit /tmp/content-fr.json et /tmp/content-en.json,
c'est-à-dire le contenu de src/lib/content.ts exporté en JSON, et la photo /tmp/portrait.png.
Polices Poppins requises (adaptez FONT_DIR). Pour régénérer les PDF après une modification du contenu,
redemandez-les : ils sont aussi fournis tels quels dans public/.
"""
import json, sys
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, Color
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader

FONT_DIR = "/usr/share/fonts/truetype/google-fonts/"
for name, f in [("P", "Poppins-Regular.ttf"), ("PM", "Poppins-Medium.ttf"), ("PB", "Poppins-Bold.ttf"), ("PI", "Poppins-Italic.ttf"), ("PL", "Poppins-Light.ttf")]:
    pdfmetrics.registerFont(TTFont(name, FONT_DIR + f))

W, H = A4
M = 40
CW = W - 2 * M
INK, INK2, MUTE = HexColor("#1D1A3B"), HexColor("#433F6B"), HexColor("#7A76A3")
VIO, PINK, LAV, BLUSH, PINKL, PAPER = HexColor("#6C57D0"), HexColor("#BC5F97"), HexColor("#C3C6F1"), HexColor("#DCD8F6"), HexColor("#EDC2D3"), HexColor("#F4EFFA")
WHITE = HexColor("#FFFFFF")

TXT = {
    "fr": dict(portfolio="PORTFOLIO", about="01 — À propos", skills="02 — Compétences", work="03 — Projets", certs="04 — Certifications", journey="05 — Parcours", contact="06 — Contact",
               h_about=("Bonjour, je suis", "Ghizlane."), h_skills=("Le tableau de mes", "technologies."), h_work=("Ce que j'ai", "construit."), h_certs=("Toujours en", "apprentissage."),
               h_journey=("Études &", "expériences."), focus="Mon focus", focus_txt="transformer des données en agents intelligents et en expériences immersives.",
               lead="CONTEXTE", shift="TRANSFORMATION", outcome="RÉSULTAT", langs="Langues", soft="Savoir-être", email="E-mail", phone="Téléphone", location="Localisation",
               edu="FORMATION", exp="EXPÉRIENCE", l1="Construisons", l2="quelque chose ensemble.", page="Page", work_intro="{n} projets racontés comme des transformations : d'où l'on part, ce qui change, ce que ça produit.",
               certs_count="{n} certifications · 2025 – 2026", role2="IA & Data"),
    "en": dict(portfolio="PORTFOLIO", about="01 — About", skills="02 — Skills", work="03 — Projects", certs="04 — Certifications", journey="05 — Journey", contact="06 — Contact",
               h_about=("Hi, I'm", "Ghizlane."), h_skills=("The table of my", "technologies."), h_work=("What I've", "built."), h_certs=("Always", "learning."),
               h_journey=("Education &", "experience."), focus="My focus", focus_txt="turning data into intelligent agents and immersive experiences.",
               lead="LEAD", shift="TRANSFORMATION", outcome="OUTCOME", langs="Languages", soft="Soft skills", email="Email", phone="Phone", location="Location",
               edu="EDUCATION", exp="EXPERIENCE", l1="Let's build", l2="something together.", page="Page", work_intro="{n} projects told as transformations: where we start, what changes, what it delivers.",
               certs_count="{n} certifications · 2025 – 2026", role2="AI & Data"),
}


def sty(font="P", size=10, color=INK2, lead=None, align=0):
    return ParagraphStyle("s", fontName=font, fontSize=size, textColor=color, leading=lead or size * 1.5, alignment=align)


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class Doc:
    def __init__(self, path, data, lang):
        self.c = canvas.Canvas(path, pagesize=A4)
        self.d, self.t, self.lang = data, TXT[lang], lang
        self.P = data["PROFILE"]
        self.pageno = 0
        self.c.setTitle(f"{self.P['name']} — Portfolio")
        self.c.setAuthor(self.P["name"])
        self.new_page(first=True)

    # ---------- primitives ----------
    def bg(self):
        c = self.c
        c.setFillColor(PAPER)
        c.rect(0, 0, W, H, stroke=0, fill=1)
        for (x, y, r, col) in [(40, H - 30, 380, PINKL), (W - 20, H - 120, 360, LAV), (W - 60, 120, 380, LAV), (30, 200, 300, PINKL)]:
            c.radialGradient(x, y, r, [col, PAPER], [0, 1], extend=False)

    def new_page(self, first=False):
        if not first:
            self.footer()
            self.c.showPage()
        self.pageno += 1
        self.bg()
        self.y = H - M - 6

    def footer(self):
        c = self.c
        c.setFont("PL", 7.5)
        c.setFillColor(MUTE)
        c.drawString(M, 22, f"{self.P['name']} · {self.t['role2']}")
        c.drawRightString(W - M, 22, f"{self.t['page']} {self.pageno}")
        if self.P.get("linkedin"):
            label = "linkedin.com/in/ghizlane-benbella"
            w = pdfmetrics.stringWidth(label, "PL", 7.5)
            c.setFillColor(VIO)
            c.drawCentredString(W / 2, 22, label)
            c.linkURL(self.P["linkedin"], (W / 2 - w / 2, 18, W / 2 + w / 2, 32), relative=0)

    def need(self, h):
        if self.y - h < 46:
            self.new_page()

    def glass(self, x, y, w, h, r=16, alpha=0.72):
        c = self.c
        c.saveState()
        c.setFillColor(Color(0.42, 0.34, 0.82, alpha=0.10))
        c.roundRect(x + 1.5, y - 3, w, h, r, stroke=0, fill=1)
        c.setFillColor(Color(1, 1, 1, alpha=alpha))
        c.setStrokeColor(Color(1, 1, 1, alpha=0.95))
        c.setLineWidth(1)
        c.roundRect(x, y, w, h, r, stroke=1, fill=1)
        c.restoreState()

    def para(self, text, style, x, y_top, w, dry=False):
        p = Paragraph(text, style)
        _, h = p.wrapOn(self.c, w, 1000)
        if not dry:
            p.drawOn(self.c, x, y_top - h)
        return h

    def chip(self, x, y, text, font="PM", size=8, fg=VIO, bg=None, padx=9, h=17, dry=False):
        w = pdfmetrics.stringWidth(text, font, size) + 2 * padx
        if not dry:
            c = self.c
            c.saveState()
            c.setFillColor(bg or Color(1, 1, 1, alpha=0.78))
            c.setStrokeColor(Color(0.42, 0.34, 0.82, alpha=0.18))
            c.setLineWidth(0.6)
            c.roundRect(x, y, w, h, h / 2, stroke=1, fill=1)
            c.setFillColor(fg)
            c.setFont(font, size)
            c.drawString(x + padx, y + h / 2 - size * 0.34, text)
            c.restoreState()
        return w

    def chips(self, items, x, y_top, maxw, dry=False, size=8, gap=5, h=17, **kw):
        cx, cy = x, y_top - h
        for it in items:
            w = pdfmetrics.stringWidth(it, "PM", size) + 18
            if cx + w > x + maxw:
                cx = x
                cy -= h + gap
            self.chip(cx, cy, it, size=size, h=h, dry=dry, **kw)
            cx += w + gap
        return (y_top - cy)

    def arrow(self, x, y, color=VIO, w=14):
        c = self.c
        c.saveState()
        c.setStrokeColor(color)
        c.setLineWidth(1.4)
        c.setLineCap(1)
        c.line(x, y, x + w, y)
        c.line(x + w - 3.5, y + 3, x + w, y)
        c.line(x + w - 3.5, y - 3, x + w, y)
        c.restoreState()

    def heading(self, tag, parts, intro=None):
        self.need(120)
        c = self.c
        c.setFont("PM", 8)
        c.setFillColor(MUTE)
        c.drawString(M, self.y - 8, tag.upper())
        self.y -= 30
        c.setFont("PB", 27)
        c.setFillColor(INK)
        c.drawString(M, self.y - 20, parts[0])
        c.setFont("PI", 27)
        c.setFillColor(VIO)
        c.drawString(M + pdfmetrics.stringWidth(parts[0] + " ", "PB", 27), self.y - 20, parts[1])
        self.y -= 40
        if intro:
            h = self.para(esc(intro), sty("PL", 10, INK2, 15), M, self.y, CW * 0.78)
            self.y -= h + 8
        self.y -= 8

    # ---------- cover ----------
    def cover(self):
        c, t, P = self.c, self.t, self.P
        c.setFont("PM", 8.5)
        c.setFillColor(VIO)
        c.drawString(M, H - M - 8, t["portfolio"] + "  ·  2026")
        c.setStrokeColor(Color(0.42, 0.34, 0.82, alpha=0.3))
        c.setLineWidth(0.8)
        c.line(M, H - M - 18, M + 60, H - M - 18)

        # portrait
        px, py, pw, ph = W - M - 190, H - 360, 190, 238
        c.saveState()
        c.setFillColor(Color(0.42, 0.34, 0.82, alpha=0.16))
        c.roundRect(px + 4, py - 8, pw, ph, 28, stroke=0, fill=1)
        p = c.beginPath()
        p.roundRect(px, py, pw, ph, 28)
        c.clipPath(p, stroke=0, fill=0)
        c.setFillAlpha(1)
        c.drawImage(ImageReader("/tmp/portrait.png"), px, py, pw, ph, preserveAspectRatio=False)
        c.restoreState()
        c.setStrokeColor(WHITE)
        c.setLineWidth(3)
        c.roundRect(px, py, pw, ph, 28, stroke=1, fill=0)
        self.chip(px + 14, py - 14, "● " + t["role2"], font="PB", size=8.5, fg=VIO, h=24, padx=12, bg=WHITE)

        y = H - 170
        c.setFont("PB", 46)
        c.setFillColor(INK)
        first, rest = P["name"].split(" ", 1)[0], P["name"].split(" ", 1)[1] if " " in P["name"] else ""
        c.drawString(M, y, first)
        c.setFillColor(VIO)
        c.drawString(M, y - 54, rest)
        y -= 90
        role = P["role"]
        h = self.para(esc(role), sty("PM", 12, INK2, 18), M, y, CW - 215)
        y -= h + 16
        h = self.para(f"<font name='PB' color='#6C57D0'>{t['focus']}</font>  {esc(t['focus_txt'])}", sty("P", 11, INK2, 17), M, y, CW - 215)
        y -= h + 22
        # contact chips
        items = [("@  " + P["email"], "mailto:" + P["email"]), ("☎  " if False else "T  " + P["phone"], P["phoneHref"]), ("in  linkedin.com/in/ghizlane-benbella", P["linkedin"])]
        yy = y
        for label, url in items:
            w = self.chip(M, yy - 22, label, size=8.5, h=22, padx=12, fg=INK)
            c.linkURL(url, (M, yy - 22, M + w, yy), relative=0)
            yy -= 30
        c.setFont("PL", 9)
        c.setFillColor(MUTE)
        c.drawString(M, yy - 6, P["location"])

        # résumé
        sents = P["resumeSummary"].replace("..", ".").split(". ")
        summary = ". ".join(sents[:2]).strip()
        if not summary.endswith("."): summary += "."
        sh = self.para(esc(summary), sty("P", 10, INK2, 16), 0, 0, CW - 40, dry=True)
        sy = 268
        self.glass(M, sy, CW, sh + 36, 22)
        c.setFont("PM", 7.5); c.setFillColor(PINK); c.drawString(M + 20, sy + sh + 36 - 20, self.t["about"].split("— ")[1].upper())
        self.para(esc(summary), sty("P", 10, INK2, 16), M + 20, sy + sh + 36 - 28, CW - 40)
        # focus cards
        fy = 150
        cw = (CW - 24) / 3
        for i, f in enumerate(self.d["FOCUS"]):
            x = M + i * (cw + 12)
            self.glass(x, fy, cw, 112, 20)
            c.setFont("PM", 9)
            c.setFillColor(PINK)
            c.drawString(x + 16, fy + 112 - 26, f"0{i+1}")
            h = self.para(esc(f["t"]), sty("PB", 12.5, INK, 16), x + 16, fy + 112 - 36, cw - 30)
            self.para(esc(f["d"]), sty("PL", 9, MUTE, 13), x + 16, fy + 112 - 36 - h - 4, cw - 30)
        self.y = 120

    # ---------- sections ----------
    def about(self):
        t, P = self.t, self.P
        self.new_page()
        self.heading(t["about"], t["h_about"])
        h = self.para(esc(P["resumeSummary"]), sty("P", 10.5, INK2, 17), M, self.y, CW)
        self.y -= h + 10
        h = self.para(esc(P["extraLine"]), sty("PL", 9.5, MUTE, 14), M, self.y, CW)
        self.y -= h + 18
        # facts card
        facts = [(t["location"], P["location"]), (t["email"], P["email"]), (t["phone"], P["phone"])]
        edu = self.d["EDUCATION"][0]
        facts.insert(1, ("Master" if self.lang == "en" else "Formation", f"{edu['title']}, {edu['place']}"))
        rows = []
        tot = 18
        for k, v in facts:
            hh = self.para(esc(v), sty("PM", 9.5, INK, 14), 0, 0, CW - 150, dry=True)
            rows.append((k, v, hh)); tot += max(hh, 14) + 12
        self.need(tot + 10)
        self.glass(M, self.y - tot, CW, tot, 18)
        yy = self.y - 16
        for k, v, hh in rows:
            self.c.setFont("PM", 7.5); self.c.setFillColor(MUTE)
            self.c.drawString(M + 18, yy - 9, k.upper())
            self.para(esc(v), sty("PM", 9.5, INK, 14), M + 130, yy - 2, CW - 150)
            yy -= max(hh, 14) + 12
        self.y -= tot + 22
        # languages + soft skills
        self.need(110)
        self.c.setFont("PB", 11); self.c.setFillColor(INK); self.c.drawString(M, self.y - 10, t["langs"])
        self.y -= 22
        hh = self.chips([f"{l['name']} · {l['level']}" for l in P["languages"]], M, self.y, CW)
        self.y -= hh + 18
        self.c.setFont("PB", 11); self.c.setFillColor(INK); self.c.drawString(M, self.y - 10, t["soft"])
        self.y -= 22
        hh = self.chips(P["softSkills"], M, self.y, CW)
        self.y -= hh + 10

    def skills(self):
        t = self.t
        self.new_page()
        self.heading(t["skills"], t["h_skills"])
        for g in self.d["SKILL_GROUPS"]:
            hh = self.chips(g["skills"], 0, 0, CW - 36, dry=True)
            tot = 42 + hh
            self.need(tot + 12)
            self.glass(M, self.y - tot, CW, tot, 18)
            self.c.setFont("PB", 11); self.c.setFillColor(INK); self.c.drawString(M + 18, self.y - 24, g["label"])
            self.c.setFont("PM", 8); self.c.setFillColor(PINK)
            self.c.drawRightString(W - M - 18, self.y - 24, f"{len(g['skills']):02d}")
            self.chips(g["skills"], M + 18, self.y - 36, CW - 36)
            self.y -= tot + 12

    def project_card(self, p, dry=False):
        t = self.t
        pad = 18
        iw = CW - 2 * pad
        title_h = self.para(esc(p["title"]), sty("PB", 13.5, INK, 17), 0, 0, iw - 52, dry=True)
        meta = p["kicker"] + (f" · {p['year']}" if p.get("year") else "")
        lead_h = self.para(esc(p["lead"]), sty("P", 9.5, INK2, 14), 0, 0, iw, dry=True)
        out_h = self.para(esc(p["outcome"]), sty("PM", 9.5, INK, 14.5), 0, 0, iw - 24, dry=True)
        shift_w = pdfmetrics.stringWidth(p["from"], "PM", 8.5) + pdfmetrics.stringWidth(p["to"], "PB", 8.5) + 18 + 18 + 30
        shift_h = 22 if shift_w < iw else 48
        techs = p["tech"][:9]
        tech_h = self.chips(techs, 0, 0, iw, dry=True, size=7.5, h=15) if techs else 0
        total = pad + title_h + 14 + 12 + lead_h + 10 + 12 + shift_h + 10 + 12 + out_h + 20 + 10 + tech_h + pad
        if dry:
            return total
        x, ytop = M, self.y
        self.glass(x, ytop - total, CW, total, 22)
        # gradient bar
        c = self.c
        c.saveState()
        pth = c.beginPath(); pth.roundRect(x, ytop - total, CW, total, 22); c.clipPath(pth, stroke=0, fill=0)
        bar = c.beginPath(); bar.rect(x, ytop - 5, CW, 5); c.clipPath(bar, stroke=0, fill=0)
        c.linearGradient(x, ytop, x + CW, ytop, [VIO, HexColor("#8F7BE6"), PINK], [0, 0.55, 1])
        c.restoreState()
        # header
        yy = ytop - pad - 4
        c.setFont("PB", 22); c.setFillColor(BLUSH)
        c.drawRightString(x + CW - pad, yy - 14, p["index"])
        self.para(esc(p["title"]), sty("PB", 13.5, INK, 17), x + pad, yy, iw - 52)
        yy -= title_h + 4
        c.setFont("PM", 7.5); c.setFillColor(PINK); c.drawString(x + pad, yy - 8, meta.upper())
        yy -= 20
        # lead
        c.setFont("PM", 7); c.setFillColor(MUTE); c.drawString(x + pad, yy - 7, f"01 · {t['lead']}")
        yy -= 12
        self.para(esc(p["lead"]), sty("P", 9.5, INK2, 14), x + pad, yy, iw)
        yy -= lead_h + 10
        # shift
        c.setFont("PM", 7); c.setFillColor(MUTE); c.drawString(x + pad, yy - 7, f"02 · {t['shift']}")
        yy -= 12
        cx = x + pad
        w1 = self.chip(cx, yy - 20, p["from"], font="PM", size=8.5, fg=MUTE, h=20, padx=10)
        cx += w1 + 8
        self.arrow(cx, yy - 10, VIO, 14)
        cx += 22
        if cx + pdfmetrics.stringWidth(p["to"], "PB", 8.5) + 20 > x + CW - pad:
            cx = x + pad; yy -= 26
        self.chip(cx, yy - 20, p["to"], font="PB", size=8.5, fg=WHITE, bg=VIO, h=20, padx=10)
        yy -= (shift_h - 22) + 22 + 10
        # outcome
        c.setFont("PM", 7); c.setFillColor(MUTE); c.drawString(x + pad, yy - 7, f"03 · {t['outcome']}")
        yy -= 12
        oh = out_h + 20
        c.saveState(); c.setFillColor(Color(0.78, 0.78, 0.95, alpha=0.45)); c.roundRect(x + pad, yy - oh, iw, oh, 12, stroke=0, fill=1)
        c.setFillColor(VIO); c.roundRect(x + pad, yy - oh, 3.5, oh, 1.7, stroke=0, fill=1); c.restoreState()
        self.para(esc(p["outcome"]), sty("PM", 9.5, INK, 14.5), x + pad + 12, yy - 10, iw - 24)
        yy -= oh + 10
        if techs:
            self.chips(techs, x + pad, yy, iw, size=7.5, h=15)
        self.y = ytop - total - 14

    def work(self):
        t = self.t
        self.new_page()
        self.heading(t["work"], t["h_work"], t["work_intro"].format(n=len(self.d["PROJECTS"])))
        for p in self.d["PROJECTS"]:
            h = self.project_card(p, dry=True)
            if self.y - h < 46:
                self.new_page()
            self.project_card(p)

    def certs(self):
        t = self.t
        self.need(260)
        self.heading(t["certs"], t["h_certs"], t["certs_count"].format(n=len(self.d["CERTIFICATIONS"])))
        cw = (CW - 12) / 2
        items = self.d["CERTIFICATIONS"]
        for i in range(0, len(items), 2):
            row = items[i:i + 2]
            hs = [self.para(esc(c["title"]), sty("PM", 9.5, INK, 13.5), 0, 0, cw - 36, dry=True) for c in row]
            h = max(hs) + 38
            self.need(h + 10)
            for j, cert in enumerate(row):
                x = M + j * (cw + 12)
                self.glass(x, self.y - h, cw, h, 16)
                self.c.setFont("PM", 7.5); self.c.setFillColor(PINK)
                self.c.drawString(x + 16, self.y - 20, f"{(cert['issuer'] or '—').upper()}  ·  {cert['year']}")
                self.para(esc(cert["title"]), sty("PM", 9.5, INK, 13.5), x + 16, self.y - 28, cw - 36)
            self.y -= h + 10
        self.y -= 8

    def journey(self):
        t = self.t
        self.need(300)
        self.heading(t["journey"], t["h_journey"])
        entries = [(t["exp"], e["title"], e["place"], e["period"], e.get("bullets", [])) for e in self.d["EXPERIENCE"]]
        entries += [(t["edu"], e["title"], e["place"], e["period"], []) for e in self.d["EDUCATION"]]
        for kind, title, place, period, bullets in entries:
            th = self.para(esc(title), sty("PB", 11.5, INK, 15), 0, 0, CW - 130, dry=True)
            bh = [self.para("• " + esc(b), sty("P", 9, INK2, 13), 0, 0, CW - 150, dry=True) for b in bullets]
            tot = 20 + th + 16 + sum(h + 3 for h in bh) + 14
            self.need(tot + 10)
            self.glass(M, self.y - tot, CW, tot, 18)
            self.c.setFont("PM", 7.5); self.c.setFillColor(PINK); self.c.drawString(M + 18, self.y - 22, kind)
            self.c.setFont("PM", 8); self.c.setFillColor(MUTE); self.c.drawRightString(W - M - 18, self.y - 22, period)
            yy = self.y - 30
            self.para(esc(title), sty("PB", 11.5, INK, 15), M + 18, yy, CW - 130)
            yy -= th + 2
            self.c.setFont("PM", 9); self.c.setFillColor(VIO); self.c.drawString(M + 18, yy - 11, place)
            yy -= 20
            for b, h in zip(bullets, bh):
                self.para("• " + esc(b), sty("P", 9, INK2, 13), M + 22, yy, CW - 44)
                yy -= h + 3
            self.y -= tot + 10

    def contact(self):
        t, P = self.t, self.P
        self.new_page()
        self.heading(t["contact"], ("", ""))  # étiquette seule
        self.y += 38
        self.c.setFont("PB", 36); self.c.setFillColor(INK); self.c.drawString(M, self.y - 30, t["l1"])
        self.c.setFont("PI", 36); self.c.setFillColor(VIO); self.c.drawString(M, self.y - 74, t["l2"])
        self.y -= 110
        rows = [(t["email"], P["email"], "mailto:" + P["email"]), (t["phone"], P["phone"], P["phoneHref"]), ("LinkedIn", P["linkedin"].replace("https://www.", ""), P["linkedin"]), (t["location"], P["location"], None)]
        tot = 22 + 46 * len(rows)
        self.glass(M, self.y - tot, CW, tot, 24)
        yy = self.y - 18
        for k, v, url in rows:
            self.c.setFont("PM", 7.5); self.c.setFillColor(MUTE); self.c.drawString(M + 22, yy - 8, k.upper())
            self.c.setFont("PB", 13); self.c.setFillColor(VIO if url else INK); self.c.drawString(M + 22, yy - 26, v)
            if url:
                w = pdfmetrics.stringWidth(v, "PB", 13)
                self.c.linkURL(url, (M + 22, yy - 30, M + 22 + w, yy - 12), relative=0)
            yy -= 46
        self.y -= tot + 20

    def save(self):
        self.footer()
        self.c.save()


def build(lang, out):
    data = json.load(open(f"/tmp/content-{lang}.json"))
    d = Doc(out, data, lang)
    d.cover(); d.about(); d.skills(); d.work(); d.certs(); d.journey(); d.contact()
    d.save()
    print("OK", out, d.pageno, "pages")


if __name__ == "__main__":
    build("fr", sys.argv[1] if len(sys.argv) > 1 else "portfolio-ghizlane-fr.pdf")
    build("en", sys.argv[2] if len(sys.argv) > 2 else "portfolio-ghizlane-en.pdf")
