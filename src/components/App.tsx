"use client";
import Marquee from "./ui/Marquee";
import { useEffect } from "react";
import { SmoothScroll } from "@/lib/scroll";
import { LangProvider } from "@/lib/i18n";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import dynamic from "next/dynamic";

// Le chatbot se charge à part : il ne ralentit pas l'affichage de la page.
const Chatbot = dynamic(() => import("./chat/Chatbot"), { ssr: false });

/** Observateur global : ajoute .is-in aux éléments .rv et .rv-mask (une seule fois). */
function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv, .rv-mask");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

export default function App() {
  return (
    <LangProvider>
      <SmoothScroll />
      <RevealObserver />
      <Navigation />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Contact />
      </main>
      <Chatbot />
    </LangProvider>
  );
}
