/*
  DADOS DE EXEMPLO (FICTÍCIOS)
  Usados apenas enquanto EGRESSOS_CSV_URL / OPORTUNIDADES_CSV_URL estiverem vazios em config.js.
  Todos os nomes, empresas, títulos e orientadores abaixo são inventados.
*/
(function () {
  var LINHAS = ["Modelagem computacional", "Simulação numérica", "Materiais e processos", "Caracterização de materiais"];
  var ORIENT = ["Prof.ª Helena Duarte", "Prof. Marcos Veloso", "Prof.ª Sônia Brito"];

  // [nome, ano, cidade, uf, setor, organização, doutorado, título, linha, mentoria]
  var linhas = [
    ["Camila Reis Tavares", 2021, "Nova Friburgo", "RJ", "Indústria", "Serra Ligas (empresa fictícia)", "", "Simulação da solidificação de ligas de alumínio em moldes metálicos", 0, true],
    ["Rafael Moura Andrade", 2020, "Rio de Janeiro", "RJ", "Pesquisa e institutos", "Instituto Atlântico de Pesquisa", "UERJ", "Modelo de elementos finitos para trincas em tubulações de aço", 1, true],
    ["Beatriz Lemos Cardoso", 2022, "Niterói", "RJ", "Universidade", "Universidade Federal Exemplo", "outra", "Redes neurais para prever a dureza de aços temperados", 0, false],
    ["Thiago Nascimento Paiva", 2019, "Macaé", "RJ", "Indústria", "Bacia Energia (empresa fictícia)", "", "Corrosão em dutos submarinos: modelagem do transporte de íons", 2, true],
    ["Larissa Fontes Duarte", 2023, "Nova Friburgo", "RJ", "Outra área", "Prefeitura de Nova Friburgo", "", "Compósitos de fibra de bananeira: ensaios e simulação", 3, false],
    ["Diego Albuquerque Sá", 2018, "Petrópolis", "RJ", "Indústria", "Cerâmica Vale Verde (empresa fictícia)", "", "Otimização do ciclo de queima de porcelanato por simulação térmica", 2, true],
    ["Marina Quintela Rocha", 2021, "Campos dos Goytacazes", "RJ", "Universidade", "Instituto Federal Exemplo", "UERJ", "Método de Monte Carlo aplicado ao crescimento de grãos", 0, true],
    ["Gustavo Peixoto Lima", 2020, "Volta Redonda", "RJ", "Indústria", "Siderúrgica Paraíba (empresa fictícia)", "", "Previsão de falhas em laminação a quente com aprendizado de máquina", 1, false],
    ["Patrícia Salgado Brandão", 2022, "São Paulo", "SP", "Indústria", "Polímeros do Sudeste (empresa fictícia)", "", "Modelagem reológica de blendas poliméricas", 2, true],
    ["Eduardo Vasconcellos Neto", 2017, "Campinas", "SP", "Pesquisa e institutos", "Centro de Tecnologia Exemplo", "outra", "Difusão de hidrogênio em aços de alta resistência", 0, true],
    ["Júlia Marques Teixeira", 2024, "Rio de Janeiro", "RJ", "Indústria", "Bacia Energia (empresa fictícia)", "", "Análise térmica de revestimentos cerâmicos por volumes finitos", 1, false],
    ["Henrique Bastos Coelho", 2019, "Belo Horizonte", "MG", "Universidade", "Universidade Federal Exemplo de Minas", "outra", "Microestruturas de ferro fundido: caracterização e modelo", 3, true],
    ["Natália Ferraz Oliveira", 2023, "Teresópolis", "RJ", "Outra área", "Escola Técnica Estadual Exemplo", "", "Ensino de ciência dos materiais com simulações abertas", 0, true],
    ["Vinícius Carvalho Dutra", 2018, "Lisboa", "Portugal", "Pesquisa e institutos", "Laboratório Atlântico de Materiais", "outra", "Nanocompósitos de grafeno: dinâmica molecular", 0, true],
    ["Aline Pinheiro Costa", 2021, "Nova Friburgo", "RJ", "Universidade", "Instituto Politécnico (UERJ)", "UERJ", "Espumas metálicas: simulação da compressão e absorção de energia", 1, true],
    ["Bruno Esteves Garcia", 2022, "Cabo Frio", "RJ", "Indústria", "Salinas do Leste (empresa fictícia)", "", "Desgaste de bombas em salmoura: análise numérica", 2, false],
    ["Fernanda Ribeiro Matos", 2020, "Curitiba", "PR", "Indústria", "Autopeças do Sul (empresa fictícia)", "", "Fadiga em eixos forjados: método dos elementos finitos", 1, true],
    ["Lucas Viana Siqueira", 2019, "Resende", "RJ", "Indústria", "Montadora Vale do Paraíba (empresa fictícia)", "", "Soldagem por atrito: campo de temperaturas e tensões residuais", 2, false],
    ["Isabela Prado Monteiro", 2023, "Niterói", "RJ", "Pesquisa e institutos", "Instituto Atlântico de Pesquisa", "UERJ", "Aprendizado de máquina para microscopia de materiais", 3, true],
    ["Rodrigo Azevedo Pinto", 2017, "Porto Alegre", "RS", "Outra área", "Consultoria de dados Exemplo", "", "Otimização topológica de peças estruturais", 0, false],
    ["Tatiane Mendonça Leal", 2021, "Angra dos Reis", "RJ", "Indústria", "Estaleiro Baía Azul (empresa fictícia)", "", "Soldagem de aços navais: modelo térmico", 2, true],
    ["Felipe Cordeiro Barros", 2024, "Nova Friburgo", "RJ", "Outra área", "Autônomo", "", "Filmes finos de óxido de zinco: simulação de deposição", 3, false],
    ["Priscila Vidal Nogueira", 2020, "Nova Iguaçu", "RJ", "Universidade", "Universidade Estadual Exemplo", "outra", "Escoamento em meios porosos pelo método de Lattice-Boltzmann", 1, true],
    ["Matheus Ramos Figueira", 2018, "Montreal", "Canadá", "Pesquisa e institutos", "Centro de Materiais Exemplo", "outra", "Plasticidade cristalina: um modelo multiescala", 0, true]
  ];

  window.EXEMPLO_EGRESSOS = linhas.map(function (r, i) {
    return {
      nome: r[0], ano: r[1], cidade: r[2], uf: r[3], setor: r[4], org: r[5], cargo: "",
      phd: r[6], titulo: r[7], linha: LINHAS[r[8]], orientador: ORIENT[i % 3] + " (fictício)",
      mentor: r[9], linkedin: "", lattes: ""
    };
  });

  window.EXEMPLO_OPORTUNIDADES = [
    { titulo: "Analista de simulação numérica (pleno)", org: "Bacia Energia (empresa fictícia)", tipo: "Vaga", local: "Macaé, RJ", data: "2026-10-20", link: "", descricao: "Modelagem de escoamento e corrosão em dutos. Egressos do programa têm preferência na triagem." },
    { titulo: "Doutorado em modelagem de materiais", org: "Instituto Atlântico de Pesquisa", tipo: "Doutorado", local: "Rio de Janeiro, RJ", data: "2026-10-12", link: "", descricao: "Duas bolsas abertas para 2027/1. Inscrições até o fim de novembro." },
    { titulo: "Estágio em ciência de dados para materiais", org: "Polímeros do Sudeste (empresa fictícia)", tipo: "Estágio", local: "Remoto", data: "2026-10-05", link: "", descricao: "Para alunos em fase de dissertação." },
    { titulo: "Chamada para workshop de modelagem computacional", org: "Rede de pesquisa fictícia", tipo: "Evento", local: "Nova Friburgo, RJ", data: "2026-09-28", link: "", descricao: "Resumos de 1 página, apresentações de 15 minutos." }
  ];
})();
