import { clinica } from "@/data/clinica";

function App() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <h1 className="text-center text-3xl font-semibold">{clinica.nome}</h1>
    </main>
  );
}

export default App;
