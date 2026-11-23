import { clinica } from "@/data/clinica";
import ComoAgendar from "@/sections/ComoAgendar";
import Convenios from "@/sections/Convenios";
import CTAFinal from "@/sections/CTAFinal";
import Diferenciais from "@/sections/Diferenciais";
import Especialidades from "@/sections/Especialidades";
import Exames from "@/sections/Exames";
import FAQ from "@/sections/FAQ";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import Localizacao from "@/sections/Localizacao";
import WhatsAppFab from "@/sections/WhatsAppFab";

function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {clinica.ui.pularConteudo}
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Especialidades />
        <Exames />
        <Convenios />
        <Diferenciais />
        <ComoAgendar />
        <Localizacao />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}

export default App;
