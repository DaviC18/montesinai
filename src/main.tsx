import { lazy, StrictMode, Suspense, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App";

// ADR-003: página de referência só em DEV (?kitchen-sink). No build, o ramo é eliminado.
// main.tsx é o ponto de entrada (nada para Fast Refresh preservar aqui).
// eslint-disable-next-line react-refresh/only-export-components
const Root: ComponentType =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has("kitchen-sink")
    ? lazy(() => import("@/dev/KitchenSink"))
    : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Root />
    </Suspense>
  </StrictMode>,
);
