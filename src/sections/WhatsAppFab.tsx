import { useEffect, useState } from "react";
import { CTAButton } from "@/components/base/CTAButton";
import { clinica } from "@/data/clinica";
import { SECTION_IDS } from "@/lib/sections";
import { cn } from "@/lib/utils";

/** Botão flutuante (RF02): aparece só depois que o hero sai da tela. */
export default function WhatsAppFab() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(SECTION_IDS.inicio);
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entrada]) => {
      if (entrada) setVisivel(!entrada.isIntersecting);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-30 sm:right-6 sm:bottom-6",
        visivel ? "block" : "hidden",
      )}
    >
      <CTAButton
        contexto={{ tipo: "padrao" }}
        size="lg"
        aria-label={clinica.ui.fab}
        className="rounded-full px-5 shadow-raised"
      >
        <span className="sr-only sm:not-sr-only">{clinica.ui.fab}</span>
      </CTAButton>
    </div>
  );
}
