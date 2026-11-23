import { useRef } from "react";
import { Menu, X } from "lucide-react";
import { CTAButton } from "@/components/base/CTAButton";
import { Container } from "@/components/base/Container";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { clinica } from "@/data/clinica";
import { gsap, MOTION_CONDITIONS, ScrollTrigger, useGSAP, type MotionConditions } from "@/lib/gsap";
import { hrefSecao, SECTION_IDS } from "@/lib/sections";

const { header } = clinica.ui;

const linkMenu =
  "rounded-md px-1 py-2 text-base font-medium text-foreground underline-offset-[0.3em] decoration-agua decoration-2 hover:underline";

export default function Header() {
  const scope = useRef<HTMLElement>(null);

  // Sólido ao rolar (ARCHITECTURE regra 5): troca de atributo + opacity da camada de fundo.
  // Sem JS ou com reduced motion, o header fica sempre sólido (estado padrão do CSS).
  useGSAP(
    () => {
      const header = scope.current;
      if (!header) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_CONDITIONS, (ctx) => {
        const { reduce } = ctx.conditions as MotionConditions;
        if (reduce) return;
        const marcar = (y: number) => {
          header.dataset.solid = String(y > 8);
        };
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => marcar(self.scroll()),
        });
        marcar(window.scrollY);
        return () => {
          delete header.dataset.solid;
        };
      });
    },
    { scope },
  );

  return (
    <header ref={scope} className="group/header sticky top-0 z-40">
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 border-b border-border bg-background/95 shadow-soft transition-opacity duration-300 group-data-[solid=false]/header:opacity-0 supports-backdrop-filter:bg-background/85 supports-backdrop-filter:backdrop-blur-sm motion-reduce:transition-none"
      />
      <Container className="flex h-header items-center justify-between gap-4">
        <a
          href={hrefSecao(SECTION_IDS.inicio)}
          aria-label={header.inicio}
          className="flex min-h-11 items-center rounded-md font-display text-xl leading-none font-semibold tracking-display text-primary"
        >
          {clinica.nome}
        </a>

        <nav aria-label={header.navegacao} className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {header.itens.map((item) => (
              <li key={item.alvo}>
                <a href={hrefSecao(item.alvo)} className={linkMenu}>
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <CTAButton contexto={{ tipo: "padrao" }} className="px-4">
            {header.agendar}
          </CTAButton>

          <Sheet>
            <SheetTrigger
              aria-label={header.abrirMenu}
              className="inline-flex size-11 items-center justify-center rounded-lg border border-input text-primary hover:bg-secondary lg:hidden"
            >
              <Menu aria-hidden="true" className="size-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-[min(20rem,85vw)] gap-0"
            >
              <div className="flex h-header items-center justify-between border-b border-border px-5">
                <SheetTitle className="font-display text-xl font-semibold text-primary">
                  {header.menuTitulo}
                </SheetTitle>
                <SheetClose
                  aria-label={header.fecharMenu}
                  className="inline-flex size-11 items-center justify-center rounded-lg text-primary hover:bg-secondary"
                >
                  <X aria-hidden="true" className="size-6" />
                </SheetClose>
              </div>
              <nav aria-label={header.navegacao} className="px-5 py-4">
                <ul className="flex flex-col">
                  {header.itens.map((item) => (
                    <li key={item.alvo} className="border-b border-border last:border-b-0">
                      <SheetClose
                        nativeButton={false}
                        render={<a href={hrefSecao(item.alvo)} />}
                        className="flex min-h-13 items-center text-lg font-medium text-foreground hover:text-primary"
                      >
                        {item.rotulo}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
