// Fonte única de conteúdo do site.
// Campos com `pendente: true` ou comentário `TODO: confirmar com a clínica`
// NÃO devem ser exibidos como fato até a confirmação.

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Horario {
  dias: DiaSemana[];
  abre: string; // "HH:MM", 24h
  fecha: string; // "HH:MM", 24h, exclusivo (fecha "20:00" ⇒ 19:59 aberto, 20:00 fechado)
  /** true enquanto a clínica não confirmar esta faixa. Selo de status fica oculto (ADR-004). */
  pendente?: boolean;
}

export interface MensagensWhatsApp {
  /** CTA genérico (Header, Hero, FAB, CTA final, Como agendar). */
  padrao: string;
  /** Card de especialidade. Placeholder obrigatório: {especialidade}. */
  especialidade: string;
  /** Seção Exames & Laboratório. */
  exames: string;
  /** FAQ, Convênios ("confirmar meu plano"), Localização. */
  duvidas: string;
}

export interface Medico {
  nome: string;
  crm?: string;
  pendente: boolean;
}

export interface Especialidade {
  id: string;
  nome: string;
  descricao: string;
  medicos: Medico[];
  pendente: boolean;
}

export interface FAQItem {
  pergunta: string;
  resposta: string;
  pendente: boolean;
}

export const clinica = {
  nome: "Clínica Monte Sinai",
  slogan: "Especialidades médicas e cuidado em um só lugar.",
  descricao:
    "Com uma equipe completa de profissionais e atendimento humanizado, a Clínica Monte Sinai é referência em saúde na região.",

  contato: {
    telefone: "(24) 3181-1019",
    telefoneE164: "+552431811019",
    whatsappE164: "552431811019", // TODO: confirmar com a clínica se é o número de agendamento
    instagram: "https://www.instagram.com/montesinairesende/",
    facebook: "https://www.facebook.com/montesinairesende",
  },

  // Textos aprovados pelo usuário (ADR-006). Neutros: sem promessa, preço ou urgência.
  whatsapp: {
    mensagens: {
      padrao: "Olá! Vim pelo site da Clínica Monte Sinai e gostaria de agendar uma consulta.",
      especialidade:
        "Olá! Vim pelo site da Clínica Monte Sinai e gostaria de agendar uma consulta de {especialidade}.",
      exames: "Olá! Vim pelo site da Clínica Monte Sinai e gostaria de agendar um exame.",
      duvidas: "Olá! Vim pelo site da Clínica Monte Sinai e gostaria de tirar uma dúvida.",
    } satisfies MensagensWhatsApp,
  },

  endereco: {
    logradouro: "R. Washington Luís, 120",
    bairro: "Vila Julieta",
    cidade: "Resende",
    uf: "RJ",
    cep: "27511-060",
    plusCode: "GGHP+6H Vila Julieta, Resende - RJ",
    geo: { lat: -22.4718898, lng: -44.4635763 },
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Monte+Sinai+R.+Washington+Lu%C3%ADs+120+Resende+RJ",
  },

  timezone: "America/Sao_Paulo",
  horarios: [
    { dias: [1, 2, 3, 4, 5], abre: "07:00", fecha: "20:00" },
    { dias: [6], abre: "07:00", fecha: "12:00", pendente: true }, // TODO: confirmar sábado
  ] satisfies Horario[],
  // Domingo (0) ausente = FECHADO (ADR-005). Não adicionar entrada para domingo.

  // Rótulos do selo de horário (ADR-004; textos da SPEC §4 Hero e RF03).
  ui: {
    selo: {
      aberto: "Aberto agora",
      abertoAte: "Aberto hoje até {hora}", // {hora} = formatHora(fecha) ⇒ "20h"
      fechado: "Fechado",
    },
  },

  especialidades: [
    {
      id: "ginecologia",
      nome: "Ginecologia e Obstetrícia",
      descricao: "Cuidado com a saúde da mulher em todas as fases.",
      medicos: [],
      pendente: false,
    },
    {
      id: "cardiologia",
      nome: "Cardiologia",
      descricao: "Prevenção, diagnóstico e acompanhamento do coração.",
      medicos: [{ nome: "Dr. Lucas Reis Ribeiro", pendente: true }],
      pendente: false,
    },
    {
      id: "clinica-medica",
      nome: "Clínica Médica",
      descricao: "Avaliação geral, check-up e acompanhamento.",
      medicos: [{ nome: "Dra. Lilian Pinto de Azevedo Oliveira", pendente: true }],
      pendente: false,
    },
    {
      id: "neurocirurgia",
      nome: "Neurocirurgia",
      descricao: "Avaliação de coluna e sistema nervoso.",
      medicos: [{ nome: "Dr. Valdemar Fernandes de Souza", pendente: true }],
      pendente: false,
    },
    {
      id: "oftalmologia",
      nome: "Oftalmologia",
      descricao: "Saúde dos olhos e da visão.",
      medicos: [],
      pendente: false,
    },
    // TODO: confirmar com a clínica — lista completa de especialidades
  ] satisfies Especialidade[],

  exames: {
    pendente: true, // TODO: confirmar com a clínica — lista de exames do laboratório
    itens: [] as string[],
  },

  convenios: {
    // Fontes públicas citam estes; TODO: confirmar com a clínica antes de publicar
    itens: [
      { nome: "Unimed", pendente: true },
      { nome: "SulAmérica", pendente: true },
      { nome: "Amil", pendente: true },
      { nome: "Mediservice", pendente: true },
      { nome: "Bradesco Saúde", pendente: true },
    ],
    particular: ["PIX", "Dinheiro", "Transferência"], // TODO: confirmar cartão
  },

  diferenciais: [
    { titulo: "Tudo em um só lugar", texto: "Consultas, exames e laboratório no mesmo endereço." },
    { titulo: "Equipe completa", texto: "Diversas especialidades médicas para toda a família." },
    { titulo: "Atendimento humanizado", texto: "Cuidado e atenção do agendamento à consulta." },
    { titulo: "Localização central", texto: "Na Vila Julieta, fácil de chegar em Resende." },
  ],

  comoAgendar: [
    {
      passo: 1,
      titulo: "Escolha a especialidade",
      texto: "Veja abaixo qual especialista você precisa.",
    },
    { passo: 2, titulo: "Chame no WhatsApp", texto: "A mensagem já vai pronta, é só enviar." },
    {
      passo: 3,
      titulo: "Confirme seu horário",
      texto: "Nossa equipe confirma o dia e a hora com você.",
    },
  ],

  faq: [
    {
      pergunta: "Vocês atendem convênio?",
      resposta:
        "Sim. Consulte a lista de convênios acima ou chame no WhatsApp para confirmar o seu plano.",
      pendente: false,
    },
    {
      pergunta: "Quais documentos levo na consulta?",
      resposta:
        "Documento com foto, carteirinha do convênio (se houver) e pedido médico, quando for exame.",
      pendente: true, // TODO: confirmar
    },
    {
      pergunta: "Preciso de preparo para exames de laboratório?",
      resposta: "Alguns exames pedem jejum ou preparo. Confirme pelo WhatsApp ao agendar.",
      pendente: true, // TODO: confirmar
    },
    {
      pergunta: "Posso levar acompanhante?",
      resposta: "Sim, especialmente para idosos e crianças.",
      pendente: true, // TODO: confirmar
    },
    {
      pergunta: "Tem estacionamento?",
      resposta: "",
      pendente: true, // TODO: confirmar
    },
  ] satisfies FAQItem[],

  legal: {
    razaoSocial: "Monte Sinai Serviços Médicos", // TODO: confirmar razão social exata
    cnpj: "", // TODO: confirmar
    responsavelTecnico: "", // TODO: confirmar (exigência de publicidade médica)
  },
} as const;

export type Clinica = typeof clinica;
