# Rede de Egressos PPG-CTM · IPRJ-UERJ

Site estático (HTML, CSS e JavaScript, sem servidor) com mapa, busca, filtros, painel, oportunidades, fórum e cadastro.
Hospedagem gratuita no GitHub Pages. Cadastro pelo Google Forms. Dados em uma planilha do Google.

Enquanto nada estiver configurado, o site mostra **dados de exemplo fictícios**.

## Como tudo se conecta

```
Egresso preenche o Google Forms
        ↓
Planilha (aba "Respostas")  ← coordenação marca "Sim" na coluna Aprovado
        ↓
Aba "publico" (só aprovados e autorizados, sem e-mail)  → publicada como CSV
        ↓
Site no GitHub Pages lê o CSV e desenha mapa, lista e painel
```

A coordenação revisa tudo antes de aparecer: nada vai para o site sem a marca "Sim" na coluna Aprovado.

---

## Passo 1: Google Forms (cadastro)

Crie um formulário com **estas perguntas, nesta ordem** (a ordem importa para a fórmula do passo 2):

| Coluna | Pergunta | Tipo |
|---|---|---|
| B | Nome completo | Resposta curta |
| C | Ano da defesa | Resposta curta |
| D | Cidade onde mora | Resposta curta |
| E | Estado (sigla) ou país | Resposta curta |
| F | Onde você atua hoje | Múltipla escolha: `Indústria`, `Universidade`, `Pesquisa e institutos`, `Outra área` |
| G | Empresa ou instituição | Resposta curta |
| H | Cargo ou função | Resposta curta (opcional) |
| I | Seguiu para o doutorado? | Múltipla escolha: `Não`, `Sim, na UERJ`, `Sim, em outra instituição` |
| J | Título da dissertação | Resposta curta |
| K | Linha de pesquisa | Múltipla escolha (as linhas do programa) |
| L | Orientador(a) | Resposta curta |
| M | Aceita conversar com quem está entrando (mentoria)? | Múltipla escolha: `Sim`, `Não` |
| N | Link do LinkedIn | Resposta curta (opcional) |
| O | Link do Lattes | Resposta curta (opcional) |
| P | Autorizo mostrar estes dados na página pública da rede | Múltipla escolha: `Sim`, `Não` (obrigatória) |

A coluna A é o carimbo de data e hora (o Forms cria sozinho). Se quiser o e-mail de contato, ative "Coletar endereços de e-mail" no Forms: ele **não vai para o site**.

No topo do formulário, escreva uma frase explicando o uso dos dados (LGPD): quem vê, para quê, e como pedir remoção.

Em **Respostas > Vincular ao Planilhas**, crie a planilha.

## Passo 2: Planilha (aba pública)

1. Na aba de respostas (ex.: `Respostas ao formulário 1`), crie a coluna **Q** com o título `Aprovado`. A coordenação digita `Sim` nas linhas que podem aparecer.
2. Crie uma nova aba chamada `publico`.
3. Na linha 1 da aba `publico`, digite estes títulos, um em cada coluna de A até N:
   `nome, ano, cidade, uf, setor, organizacao, cargo, doutorado, titulo, linha, orientador, mentoria, linkedin, lattes`
4. Na célula **A2**, cole a fórmula (ajuste o nome da aba de respostas se for diferente):

```
=QUERY('Respostas ao formulário 1'!B2:Q; "select Col1,Col2,Col3,Col4,Col5,Col6,Col7,Col8,Col9,Col10,Col11,Col12,Col13,Col14 where Col15='Sim' and Col16='Sim'"; 0)
```

   Se a planilha estiver em inglês ou configurada com vírgula, troque os `;` por `,`.
5. **Arquivo > Compartilhar > Publicar na Web**: escolha a aba `publico`, formato **Valores separados por vírgula (.csv)**, e clique em Publicar. Copie o link.
6. Cole o link em `js/config.js`, no campo `EGRESSOS_CSV_URL`.

Importante: publique **somente** a aba `publico`. A aba de respostas tem e-mails e dados não autorizados.

### Oportunidades (opcional)

Crie uma aba `oportunidades` com os títulos: `titulo, organizacao, tipo, local, data, link, descricao`. Publique como CSV e cole o link em `OPORTUNIDADES_CSV_URL`. Para receber indicações, crie outro Forms simples e coloque o link em `FORM_OPORTUNIDADE_URL`.

## Passo 3: Configurar o site

Abra `js/config.js` e preencha: `EGRESSOS_CSV_URL`, `FORM_URL` (link do Forms), `CHAT_URL`, `CONTATO_EMAIL` e, se quiser, `OPORTUNIDADES_CSV_URL` e `FORM_OPORTUNIDADE_URL`. Apague o que não for usar.

Cidades do RJ que não aparecerem no mapa vão para a lista "Outros estados e exterior". Para incluir uma cidade no mapa, acrescente uma linha em `COORD` no arquivo `js/app.js` (nome sem acento e em minúsculas, com latitude e longitude).

## Passo 4: Publicar no GitHub Pages

1. Crie uma conta no GitHub (use o e-mail que quiser; veja "Transferir para o programa" abaixo).
2. **New repository**, nome `rede-egressos`, visibilidade **Public**.
3. **Add file > Upload files**: envie todo o conteúdo desta pasta (o `index.html` fica na raiz do repositório) e clique em Commit.
4. **Settings > Pages**: em "Branch" escolha `main` e a pasta `/ (root)`, e salve.
5. Em 1 a 2 minutos o site abre em `https://SEU-USUARIO.github.io/rede-egressos/`.

Para atualizar o site depois, basta editar os arquivos no GitHub. Os dados novos aparecem sozinhos quando a planilha muda (o Google pode levar alguns minutos para atualizar o CSV publicado).

## Passo 5: Fórum (Giscus)

O fórum usa as **Discussions** do repositório. Quem participa entra com a conta do GitHub.

1. No repositório: **Settings > General > Features**, marque **Discussions**.
2. Crie uma categoria chamada `Fórum` (aba Discussions > ícone de lápis ao lado de Categories), tipo "Announcement" ou "Q&A".
3. Instale o app em https://github.com/apps/giscus e autorize o repositório.
4. Em https://giscus.app, informe `usuario/rede-egressos`, escolha a categoria `Fórum` e copie os valores `data-repo-id` e `data-category-id`.
5. Cole em `js/config.js`, em `GISCUS` (`repo`, `repoId`, `categoryId`).

## Chat

Um chat em tempo real exige servidor, que um site estático não tem. As opções:

- **Grupo de WhatsApp, Telegram ou Discord**: crie o grupo, copie o link de convite e cole em `CHAT_URL`. É o mais simples e onde os egressos já estão.
- **Fórum (Giscus)**: já incluído, bom para perguntas que ajudam quem chegar depois.
- **Assistente de IA que responde sobre a rede**: possível, mas precisa de um serviço próprio com chave de API e custo. Deixe para uma segunda fase, se houver interesse.

## Transferir para o programa

Você pode começar na sua conta e passar tudo para o programa depois, sem refazer nada:

- **GitHub**: o ideal é criar já uma *organização* gratuita (ex.: `ppgctm-iprj`) e colocar o repositório nela, com você como dono e a coordenação como membros. Se começar na sua conta pessoal, vá em **Settings > Danger Zone > Transfer ownership** e transfira para a organização ou para outro usuário. O endereço do site muda (de `usuario.github.io` para `organizacao.github.io`); avise os egressos ou, melhor, use um domínio próprio do programa (Settings > Pages > Custom domain), que continua o mesmo para sempre.
- **Google Forms e Planilha**: em **Compartilhar**, adicione a coordenação como editora e depois use "Transferir propriedade". Contas institucionais às vezes bloqueiam essa transferência; nesse caso, crie o formulário e a planilha já numa conta do programa e compartilhe com você.
- **Fórum**: as discussões ficam no repositório e acompanham a transferência (reinstale o Giscus no novo local e atualize os IDs em `js/config.js`).

Recomendação: já na criação, deixe **pelo menos duas pessoas** (você e a coordenação) com acesso de dono ao repositório, ao Forms e à planilha.

## Privacidade (LGPD)

- Publique só o que a pessoa autorizou (coluna P) e a coordenação aprovou (coluna Q).
- Nunca publique e-mail ou telefone.
- Informe como pedir correção ou remoção: basta apagar a linha na aba de respostas ou trocar `Aprovado` para vazio.
- Avise no formulário que os dados ficam visíveis publicamente na internet.

## Testar no computador antes de publicar

Abra um terminal na pasta e rode `python3 -m http.server 8000`, depois acesse http://localhost:8000.

## Estrutura da pasta

```
index.html        página única com todas as seções
css/style.css     visual (claro e escuro automáticos)
js/config.js      links e configurações (único arquivo que você edita)
js/app.js         lógica: lê a planilha, mapa, filtros, painel
data/exemplo.js   dados fictícios usados enquanto nada está configurado
```
