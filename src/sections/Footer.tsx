import { Container } from "@/components/base/Container";
import { clinica } from "@/data/clinica";

const textos = clinica.ui.footer;
const { endereco, contato, legal } = clinica;

const link =
  "underline decoration-agua/60 decoration-1 underline-offset-4 hover:decoration-agua hover:decoration-2 focus-visible:outline-inverse-ring";

export default function Footer() {
  return (
    <footer className="border-t border-inverse-muted/25 bg-inverse pt-12 pb-28 text-inverse-foreground sm:pb-12">
      <Container>
        <p className="font-display text-h3 font-semibold">{clinica.nome}</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div>
            <h2 className="font-sans text-base font-semibold">{textos.enderecoTitulo}</h2>
            <address className="mt-2 text-base text-inverse-muted not-italic">
              {endereco.logradouro}
              <br />
              {endereco.bairro} · {endereco.cidade}/{endereco.uf}
              <br />
              CEP {endereco.cep}
            </address>
          </div>
          <div>
            <h2 className="font-sans text-base font-semibold">{textos.contatoTitulo}</h2>
            <p className="mt-2 text-base text-inverse-muted">
              <a href={`tel:${contato.telefoneE164}`} className={link}>
                {contato.telefone}
              </a>
            </p>
          </div>
          <div>
            <h2 className="font-sans text-base font-semibold">{textos.redesTitulo}</h2>
            <ul className="mt-2 flex flex-col gap-1 text-base text-inverse-muted">
              <li>
                <a
                  href={contato.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  {textos.instagram}
                  <span className="sr-only"> {textos.novaAba}</span>
                </a>
              </li>
              <li>
                <a
                  href={contato.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  {textos.facebook}
                  <span className="sr-only"> {textos.novaAba}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-inverse-muted/25 pt-6 text-sm text-inverse-muted">
          <p>
            {legal.razaoSocial}
            {legal.cnpj ? ` · CNPJ ${legal.cnpj}` : null}
          </p>
          {legal.responsavelTecnico ? <p>{legal.responsavelTecnico}</p> : null}
          <p className="max-w-texto">{textos.privacidade}</p>
        </div>
      </Container>
    </footer>
  );
}
