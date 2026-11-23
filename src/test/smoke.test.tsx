import { render, screen } from "@testing-library/react";
import App from "@/App";
import { clinica } from "@/data/clinica";

describe("App", () => {
  it("renderiza o nome da clínica", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: clinica.nome })).toBeInTheDocument();
  });
});
