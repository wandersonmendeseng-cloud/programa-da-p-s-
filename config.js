/*
  CONFIGURAÇÃO DA REDE DE EGRESSOS
  Este é o único arquivo que você precisa editar para ligar o site aos seus dados.
  Enquanto os campos abaixo estiverem vazios, o site mostra dados de exemplo (fictícios).
  Passo a passo completo no README.md.
*/
window.REDE_CONFIG = {
  // Nome que aparece no topo e no rodapé
  PROGRAMA: "PPG-CTM · IPRJ-UERJ",
  PROGRAMA_LONGO: "Programa de Pós-Graduação em Ciência e Tecnologia de Materiais",

  // Link CSV da aba "publico" da planilha (Arquivo > Compartilhar > Publicar na Web > escolher a aba > CSV)
  EGRESSOS_CSV_URL: "",

  // Link CSV da aba "oportunidades" (opcional)
  OPORTUNIDADES_CSV_URL: "",

  // Link do Google Forms de cadastro dos egressos
  FORM_URL: "",

  // Link do Google Forms (ou e-mail) para divulgar uma oportunidade (opcional)
  FORM_OPORTUNIDADE_URL: "",

  // Link do grupo de conversa (convite do WhatsApp, Telegram ou Discord)
  CHAT_URL: "",
  CHAT_NOME: "grupo de egressos no WhatsApp",

  // Instagram e e-mail do programa
  INSTAGRAM_URL: "https://www.instagram.com/ppgctm.iprj/",
  CONTATO_EMAIL: "",

  // Fórum (Giscus usa as Discussions do repositório no GitHub).
  // Preencha com os valores gerados em https://giscus.app (instruções no README).
  GISCUS: {
    repo: "",          // ex.: "ppgctm-iprj/rede-egressos"
    repoId: "",
    category: "Fórum",
    categoryId: ""
  }
};
