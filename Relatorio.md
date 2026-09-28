# Relatório de decisão — EventosIF

## 1. Classificação final dos oito dados

| Dado | Categoria | Ferramenta | Justificativa |
|---|---|---|---|
| busca | Local | `useState` em `TelaEventos` | Só um componente usa; é texto sendo digitado. |
| eventos | De servidor | `useReducer` dentro de `EventosContexto` | É cópia do resultado de uma API; precisava ficar acessível fora de `TelaEventos` para `TelaDetalheEvento` e `TelaMinhasInscricoes` lerem a mesma fonte. |
| eventosFiltrados | *Não é estado* | Calculado no corpo de `TelaEventos` | Derivado de `eventos` + `busca`; guardá-lo em `useState` era um dos dois casos de estado derivado guardado do código original. |
| inscricoes | Global de cliente | `InscricoesContexto` (guarda só `ids`) | Duas telas distantes (`TelaEventos`, `TelaMinhasInscricoes`) precisam do mesmo dado ao mesmo tempo. |
| totalInscricoes | *Não é estado* | Calculado (`ids.length`) | Derivado de `inscricoes`; era o segundo caso de estado derivado guardado. |
| eventoSelecionado | Elevado, via navegação | `route.params` carrega só o `id`; o objeto é buscado com `eventos.find` | Uso transitório, só durante a navegação; guardar o objeto inteiro criava estado duplicado (causa do C3). |
| temaEscuro | Global de cliente (candidato à 5ª morada) | `TemaContexto` | Várias telas potencialmente dependem dele; ver item 6 sobre por que não foi persistido. |
| usuario | Global de cliente | `SessaoContexto` | Mesma razão do tema: dado do cliente, mas de escopo amplo. |

## 2. Estados impossíveis — antes e depois do R4

Antes, `TelaEventos` guardava `eventos`, `carregando`, `erro` e `enviado` como quatro `useState` independentes. Tratando cada um como "tem valor / não tem valor", existem **2⁴ = 16 combinações** possíveis no código, mas só cerca de **5 correspondem a uma situação real do app** (ocioso, carregando, sucesso, sucesso com inscrição, falha). A diferença — **11 combinações** — são estados que o React aceita representar mas que não significam nada para o usuário; é justamente uma delas (`carregando = true` e `erro` preenchido ao mesmo tempo) que produzia o C4, porque o `.catch` original setava o erro sem nunca desligar o carregamento.

Depois do R4, o `useReducer` dentro de `EventosContexto` reduz isso a um único campo `status`, com três valores possíveis (`'carregando'`, `'sucesso'`, `'falha'`) — **3 combinações, todas válidas**. As 11 combinações impossíveis deixam de existir no código, não apenas de acontecer na prática: não há mais nenhuma linha capaz de produzir `carregando` e `erro` juntos, porque o reducer sempre retorna um objeto novo e completo por ação.

## 3. Árvore de decisão aplicada a `inscricoes`

Seguindo o Anexo A, nó a nó:

1. **Precisa sobreviver ao fechar o aplicativo?** Não — nesta refatoração, `inscricoes` some ao fechar o app (ver item 6 sobre C7).
2. **Veio de uma API?** Não — é criado pela ação do usuário (toque em "Inscrever"), não por uma resposta de servidor.
3. **É do cliente. Quem usa?** Duas telas distantes na navegação por abas: `TelaEventos` (contador) e `TelaMinhasInscricoes` (lista e cancelamento) — não são pai/filho nem irmãos diretos.
4. **Conclusão da árvore:** telas distantes usando o mesmo dado do cliente → **Context** (a árvore também permitiria Zustand para "fatias"; a escolha entre os dois é discutida no item 4).

## 4. Context API em vez de Zustand ou Redux Toolkit

O custo que a Context API cobra é conhecido e foi observado diretamente no C6: **todo consumidor de um contexto re-renderiza quando o `value` desse contexto muda**, sem seleção parcial — diferente de Zustand, que permite um componente assinar só a fatia que usa. Pagamos esse custo de duas formas neste projeto: dividindo `AppContexto` em `TemaContexto`, `SessaoContexto`, `EventosContexto` e `InscricoesContexto` (R7), para que mudar o tema não force `TelaMinhasInscricoes` a re-renderizar; e memorizando cada `value` com `useMemo`, para não criar um objeto novo a cada renderização do provedor.

Esse custo é aceitável aqui porque cada contexto carrega poucos valores, muda com baixa frequência (o usuário não troca de tema ou se inscreve dezenas de vezes por segundo) e o número de telas é pequeno. **Isso deixaria de ser aceitável** se o app crescesse para ter atualizações de alta frequência num contexto amplo — por exemplo, se `inscricoes` passasse a ser atualizado em tempo real por um socket com múltiplos eventos por segundo, ou se o app ganhasse dezenas de telas consumindo o mesmo contexto de eventos, tornando o custo de re-renderização perceptível. Nesse cenário, migrar `InscricoesContexto` ou `EventosContexto` para Zustand (que permite seletores parciais sem re-renderizar tudo) passaria a valer a pena.

## 5. Por que `inscricoes` guarda ids, e a relação com o C3

`InscricoesContexto` guarda um vetor de identificadores (`ids`), não os objetos de evento inteiros. A lista exibida em `TelaMinhasInscricoes` é derivada cruzando esses ids com `eventos` (vindo de `EventosContexto`). Se guardássemos o objeto completo no momento da inscrição, criaríamos uma segunda cópia dos dados do evento — exatamente o erro de estado duplicado que causava o C3: a tela de detalhe mostrava vagas desatualizadas porque lia de uma cópia congelada em vez de voltar à fonte de verdade. Guardando só o id, qualquer atualização de `eventos` (uma nova busca à API, uma mudança de vagas) se reflete automaticamente em toda tela que deriva dados a partir dele — não existe cópia para envelhecer.

## 6. A quinta morada (persistido) e o C7

Os dados candidatos à persistência neste app são `temaEscuro`, `inscricoes` e `usuario` — todos hoje voltam ao valor inicial ao reabrir o aplicativo, que é exatamente o C7. Eles não foram tratados nesta refatoração porque o enunciado excluiu explicitamente `AsyncStorage` do escopo dos sete passos (R1–R7): a Etapa 3 resolve onde o dado mora *enquanto o app roda*, não entre uma execução e outra. Se `temaEscuro` e `inscricoes` fossem persistidos (por exemplo, lendo/escrevendo em `AsyncStorage` dentro de `TemaProvedor` e `InscricoesProvedor`, com um `useEffect` de leitura na montagem e de escrita a cada mudança), o C7 seria resolvido: o tema permaneceria escolhido e as inscrições sobreviveriam ao fechamento do aplicativo.

## 7. Estado de servidor, em uma frase

Ao guardar o resultado de um `fetch` em estado, o que se tem na mão não é "o dado", e sim **uma cópia dele em um instante específico** — o que obriga a responder perguntas que um estado puramente local não exige: quando essa cópia deve ser revalidada, o que fazer se ela ficar desatualizada em relação ao servidor, como tratar o tempo entre o pedido e a resposta (inclusive cancelamento, como no R5), e quem — cliente ou servidor — é a fonte de verdade em caso de conflito.

## Declaração de uso de IA

*[Preencher pela equipe antes da entrega — o parágrafo abaixo é um rascunho baseado na conversa real com a Claude; edite para refletir exatamente o que sua equipe fez e verificou.]*

A equipe usou o Claude como apoio na etapa de refatoração (R1–R7): para gerar o código de cada passo a partir dos critérios de aceite do enunciado, e para redigir este relatório. Cada passo foi conferido manualmente rodando o aplicativo e checando os critérios de aceite descritos na Etapa 3 antes do commit seguinte — por exemplo, confirmando no console que digitar uma letra na busca gera uma única renderização (R1), e que alternar o tema deixa de re-renderizar `TelaMinhasInscricoes` (R7). A equipe também revisou os nomes de erro do vocabulário do capítulo (Etapa 2) e a contagem de estados impossíveis (item 2 deste relatório) de forma independente, sem aceitar os números apenas porque a IA os apresentou.
