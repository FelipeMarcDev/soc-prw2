# Decisões com IA --- Projeto 19 (Incidentes SOC)

**Ferramenta:** Claude (Anthropic), via chat.

Todas as consultas abaixo foram realizadas durante o desenvolvimento do
projeto, seguindo a ordem em que aconteceram. A IA foi utilizada como
ferramenta de orientação técnica, auxiliando na análise do código,
identificação de problemas, apresentação de alternativas e
esclarecimento de dúvidas. A implementação, os testes e as decisões
finais ficaram sob responsabilidade do aluno.

**Escopo:** máquina de estados, RBAC, audit log e post-mortem
obrigatório.

------------------------------------------------------------------------

## Consulta 1 --- Restringir transições de status

**O Desafio:**

Durante a análise do sistema, identifiquei que os incidentes podiam
receber qualquer status, sem respeitar uma sequência de etapas. Por
exemplo, era possível passar diretamente de `ALERTA` para `POS_MORTEM`,
utilizando o `PATCH /status` ou o `PUT`.

**O Prompt Utilizado:**

> esse é o projeto atual, analise e me guie para a parte 1

(Enviei o arquivo `soc-app-clean.zip` anexado, depois de compartilhar o
enunciado e perguntar o que deveria ser desenvolvido no Projeto 19.)

Prompts seguintes da mesma consulta:

> o passo 4, endpoint por ação, vai em qual arquivo

> manda o arquivo inteiro

**A Orientação da IA:** (trecho)

A IA sugeriu implementar uma máquina de estados, centralizando as
transições permitidas em uma estrutura e criando um endpoint específico
para cada ação.

Exemplo de estrutura sugerida:

``` ts
export const TRANSICOES = {
  triar:     { de: ['ALERTA'],        para: 'QUALIFICACAO' },
  confirmar: { de: ['QUALIFICACAO'], para: 'CONTENCAO' },
  conter:    { de: ['CONTENCAO'],     para: 'ERRADICACAO' },
  erradicar: { de: ['ERRADICACAO'],   para: 'POS_MORTEM' },
  encerrar:  { de: ['POS_MORTEM'],    para: 'POS_MORTEM' },
};

// entidade: aplicar(acao, justificativa) valida contra a tabela
// controller: um endpoint POST por ação; use case único ExecutarAcaoIncidenteUseCase
```

**A Implementação, as Dúvidas e as Decisões do Aluno:**

Após receber a orientação, comecei a adaptar a estrutura ao projeto
existente. Durante esse processo, identifiquei alguns pontos que
precisavam de ajustes:

-   A ação `confirmar` não tinha um endpoint correspondente no
    controller. Questionei a necessidade de mantê-la e optei por
    removê-la, pois o fluxo não estava preparado para executá-la.
-   A ação `encerrar` estava configurada de `POS_MORTEM` para
    `POS_MORTEM`, ou seja, não realizava uma mudança de estado. Ajustei
    a transição para `ERRADICACAO → POS_MORTEM`.
-   A primeira sugestão utilizava estados novos, como `ABERTO` e
    `EM_TRIAGEM`, que não existiam no schema do projeto. Decidi manter
    os cinco estados já existentes, evitando a necessidade de uma
    migration.
-   Ao adaptar o método `aplicar()`, encontrei uma referência ao tipo
    `Usuario`, que ainda não existia na implementação. Optei por deixar
    essa parte de fora até desenvolver o controle de permissões (RBAC),
    na Consulta 2.
-   Percebi que o `PUT` ainda permitia alterar diretamente o campo
    `status`, contornando a máquina de estados. Após revisar a
    implementação, removi esse campo do DTO e do tipo utilizado pelo
    repositório.
-   Como tive dúvidas sobre onde inserir os códigos sugeridos, pedi à IA
    que indicasse os arquivos e fornecesse exemplos completos. Mesmo
    assim, precisei integrar os trechos manualmente. Isso deixou
    temporariamente o projeto com 11 erros de TypeScript, envolvendo
    imports, injeção de dependências, métodos antigos, nomes divergentes
    de DTOs e exports ausentes. Fui corrigindo cada problema durante a
    compilação.
-   Em uma das tentativas de diagnóstico, a IA apontou que o problema do
    controller poderia ser uma chave de classe não fechada. Ao conferir
    o código, percebi que o problema real estava relacionado aos imports
    e à injeção de dependências. O trecho havia sido cortado durante a
    cópia.
-   O comando `nest start --watch` não apresentou problemas, mas o
    `nest build` identificou que `delete-incident.use-case.ts` ainda
    chamava um método `delete` que havia sido removido do repositório.
    Como não fazia mais sentido manter essa funcionalidade, excluí o
    arquivo e também o `confirm-dialog.tsx` do front-end, que havia
    ficado sem utilização.
-   Depois de remover o `PATCH /status`, percebi que o front-end ainda
    tentava utilizá-lo, causando um erro 404 ao clicar no botão
    "Avançar". Ajustei a interface para utilizar botões específicos para
    cada ação, exigindo uma justificativa, e removi a funcionalidade de
    exclusão (`DELETE`).

------------------------------------------------------------------------

## Consulta 2 --- Usuários, papéis e permissão por ação e severidade (RBAC)

**O Desafio:**

Após implementar a máquina de estados, identifiquei a necessidade de
controlar quem poderia executar cada ação. Também precisava considerar a
severidade dos incidentes, pois ocorrências P1 e P2 exigem maior nível
de responsabilidade, especialmente no encerramento.

Minha intenção era manter as regras de autorização na camada de domínio,
evitando concentrar essa lógica no controller.

**O Prompt Utilizado:**

> bora pra fase 2

(Essa consulta aconteceu após a IA apresentar o planejamento inicial
para a implementação do RBAC, durante a primeira consulta.)

**A Orientação da IA:** (trecho)

A IA sugeriu criar uma matriz de permissões por papel e severidade, além
de uma autenticação simplificada utilizando um Guard para identificar o
usuário por meio do cabeçalho `X-User-Id`.

Exemplo da estrutura sugerida:

``` ts
export const PAPEL_MINIMO = {
  triar:     { padrao: 'ANALISTA_N1', altaCriticidade: 'ANALISTA_N1' },
  conter:    { padrao: 'ANALISTA_N2', altaCriticidade: 'ANALISTA_N2' },
  erradicar: { padrao: 'ANALISTA_N2', altaCriticidade: 'ANALISTA_N2' },
  encerrar:  { padrao: 'ANALISTA_N2', altaCriticidade: 'GESTOR_SOC' },
};

aplicar(acao, usuario, justificativa) {
  if (!podeExecutar(usuario.papel, acao, severidade)) {
    throw new PermissaoNegadaError(...);
  }

  if (!regra.de.includes(status)) {
    throw new InvalidTransitionError(...);
  }
}
```

Também foi sugerida a criação de três usuários de demonstração por meio
de um seeder executado na inicialização da aplicação.

**A Implementação, as Dúvidas e as Decisões do Aluno:**

Com base nas orientações, implementei a estrutura de usuários e
permissões, mas precisei avaliar algumas premissas apresentadas pela IA:

-   A matriz de permissões foi uma sugestão da IA, não uma regra
    integralmente definida pelo enunciado. Mantive a exigência principal
    de que incidentes P1/P2 só podem ser encerrados pelo gestor,
    tratando as demais permissões como decisões de implementação e
    documentando-as no README.
-   A autenticação utiliza `X-User-Id`, portanto é apenas uma simulação.
    Percebi que qualquer cliente pode informar o identificador de outro
    usuário e assumir sua identidade. Considerei aceitável para o escopo
    acadêmico, mas deixei claro que não representa uma autenticação
    segura para produção.
-   A autorização foi implementada na camada de domínio, evitando que as
    regras dependam exclusivamente da identificação do usuário no
    controller.
-   Uma dúvida que surgiu foi a ordem das validações. A IA sugeriu
    verificar primeiro a permissão e depois o estado do incidente.
    Mantive essa ordem: um usuário N1 sem autorização recebe 403 antes
    mesmo de verificar se a transição é válida. Isso também evita
    revelar o estado do incidente a quem não tem permissão para agir.
-   Durante os testes, percebi que o navegador estava bloqueando as
    chamadas do front-end por causa do cabeçalho personalizado. Para
    resolver, precisei ajustar o CORS e liberar o `X-User-Id`.
-   A IA auxiliou na validação da lógica de domínio, com 11 casos de
    teste. Entretanto, não foram realizados testes equivalentes para
    banco de dados, migrations, seed e interface.
-   Também identifiquei algumas limitações que permaneceram: os botões
    continuam aparecendo para qualquer usuário, embora o back-end
    bloqueie ações não autorizadas com 403; além disso, criar e editar
    incidentes não exigem identificação de usuário.

------------------------------------------------------------------------

## Consulta 3 --- Audit log em transação

**O Desafio:**

Depois de implementar as permissões, comecei a trabalhar no registro do
histórico de alterações dos incidentes.

A necessidade era armazenar o estado anterior, o novo estado, o autor da
alteração, a justificativa e o horário da operação. O principal cuidado
era garantir que o histórico e a mudança de status fossem gravados
juntos, evitando inconsistências caso uma das operações falhasse.

**O Prompt Utilizado:**

> sim, vamos começar a fazer o audit log. faça ele o mais simples
> possivel

**A Orientação da IA:** (trecho)

A IA recomendou utilizar uma transação do Prisma para executar a
atualização do incidente e a criação do registro histórico como uma
única operação.

Exemplo apresentado:

``` ts
return this.prisma.$transaction(async (tx) => {
  const atualizados = await tx.incident.updateMany({
    where: { id, status: t.estadoAnterior },
    data: { status: t.novoEstado },
  });

  if (atualizados.count === 0) {
    throw new ConflitoConcorrenciaError(id);
  }

  await tx.historicoStatus.create({
    data: {
      incidentId: id,
      estadoAnterior: t.estadoAnterior,
      novoEstado: t.novoEstado,
      autorId: t.autorId,
      justificativa: t.justificativa,
    },
  });

  return toDomain(
    await tx.incident.findUniqueOrThrow({ where: { id } })
  );
});
```

A IA também explicou que essa abordagem evita que o status seja
atualizado sem que o respectivo registro histórico seja criado.

**A Implementação, as Dúvidas e as Decisões do Aluno:**

Seguindo a orientação, implementei a transação no repositório e comecei
a verificar se os dados estavam sendo persistidos corretamente.

Durante essa etapa, identifiquei e avaliei os seguintes pontos:

-   Antes da implementação, a justificativa era validada, mas acabava
    sendo descartada, enquanto o autor da ação nem sequer era persistido
    no banco. Com o audit log, passei a armazenar essas informações
    junto com a alteração de status.
-   Uma dúvida importante foi como garantir que duas requisições
    simultâneas não sobrescrevessem uma à outra. A IA explicou a
    possibilidade de utilizar bloqueio otimista, comparando o estado
    atual com o estado esperado antes de atualizar. Optei por essa
    abordagem, utilizando `UPDATE ... WHERE status = estado_anterior`,
    por ser mais simples para o projeto.
-   Com isso, se duas requisições tentarem realizar a mesma transição
    simultaneamente, apenas uma conseguirá atualizar o registro. A outra
    encontrará zero registros atualizados e receberá um erro de
    conflito.
-   Também removi o método `updateStatus` do repositório, pois ele
    permitia alterar o status sem gerar o respectivo histórico, criando
    uma possível brecha na implementação.
-   Ao revisar a solução, percebi que a imutabilidade do histórico
    depende apenas das regras estabelecidas no código. O banco de dados
    ainda permite alterações ou exclusões manuais dos registros.
-   Outro ponto identificado foi que o conflito de concorrência está
    sendo retornado como HTTP 422, embora o mais adequado para essa
    situação provavelmente fosse HTTP 409.
-   Por fim, o histórico ainda não é exibido na interface, e as
    operações de criação e edição de incidentes não geram registros no
    audit log.

------------------------------------------------------------------------

## Consulta 4 --- Post-mortem obrigatório para P1/P2

**O Desafio:**

A última etapa foi implementar a exigência de post-mortem para
incidentes de alta severidade.

O objetivo era impedir que incidentes P1 e P2 fossem encerrados sem que
um post-mortem tivesse sido registrado anteriormente.

Precisava garantir que essa validação acontecesse durante a transição de
encerramento, respeitando as regras da máquina de estados.

**O Prompt Utilizado:**

> pode seguir

(Resposta enviada após a IA perguntar se deveria continuar com a
implementação do post-mortem e da validação obrigatória na ação
`encerrar`.)

**A Orientação da IA:** (trecho)

A IA sugeriu adicionar uma validação na execução da ação de
encerramento, verificando a severidade do incidente e a existência de um
post-mortem.

Exemplo apresentado:

``` ts
if (
  acao === 'encerrar' &&
  exigePostMortem(severidade) &&
  !postMortemRegistrado
) {
  throw new PostMortemObrigatorioError(
    NIVEL_SEVERIDADE[severidade]
  );
}
```

Também foi sugerida a seguinte organização:

-   Verificar primeiro a permissão do usuário (403).
-   Validar se a transição de estado é permitida (422).
-   Verificar se o post-mortem obrigatório foi registrado (422).
-   Criar uma tabela própria para armazenar o post-mortem, permitindo um
    registro por incidente.
-   Restringir o registro do post-mortem a usuários N2 ou superiores e à
    etapa `ERRADICACAO`.

**A Implementação, as Dúvidas e as Decisões do Aluno:**

Com as orientações recebidas, implementei a validação obrigatória e a
estrutura de armazenamento do post-mortem. Durante a revisão, encontrei
algumas questões que exigiram atenção:

-   A restrição de que o post-mortem só poderia ser registrado durante a
    etapa `ERRADICACAO` e por usuários N2 ou superiores foi uma decisão
    sugerida pela IA, não uma exigência explícita do enunciado. Mantive
    essa regra como escolha de implementação.
-   Durante os testes de validação, percebi que uma justificativa
    contendo apenas espaços poderia ser aceita pelo `@IsNotEmpty`, pois
    a validação verifica se o valor está vazio, mas não necessariamente
    se contém caracteres úteis. Para resolver, acrescentei
    `@Matches(/\S/)` nos dois DTOs envolvidos.
-   Outra preocupação foi evitar consultas desnecessárias ao banco. Por
    isso, mantive a verificação da existência do post-mortem
    exclusivamente na ação `encerrar`, já que as demais transições não
    precisam dessa informação.
-   Identifiquei que o post-mortem pode ser sobrescrito enquanto o
    incidente permanece na etapa `ERRADICACAO`, pois não existe
    versionamento dos registros.
-   Também percebi que a validação considera um post-mortem preenchido
    apenas quando os campos não estão vazios. Ainda não existe uma
    exigência de tamanho mínimo ou de qualidade do conteúdo.
-   Por último, encontrei uma possível brecha na edição do incidente: o
    endpoint `PUT /incidents/:id` ainda permite modificar a severidade.
    Dessa forma, um usuário N2 poderia reduzir a classificação de um
    incidente P1 para P4 e, consequentemente, encerrá-lo sem registrar
    um post-mortem. Identifiquei que seria necessário tratar essa
    situação por meio de uma ação específica de `reclassificar`, mas
    essa implementação ficou pendente.

------------------------------------------------------------------------

## Considerações finais

Ao longo das quatro consultas, utilizei a IA principalmente como apoio
para compreender a arquitetura, identificar os arquivos envolvidos,
esclarecer dúvidas de implementação e conhecer alternativas técnicas.

A IA apresentou sugestões de código e explicou conceitos como máquina de
estados, autorização por papéis, transações e validações de domínio.
Entretanto, nem todas as sugestões foram aplicadas exatamente como
apresentadas.

Durante o desenvolvimento, precisei interpretar as orientações, adaptar
os exemplos à estrutura existente, corrigir erros de compilação, testar
os comportamentos e tomar decisões sobre quais soluções faziam sentido
para o projeto.

Dessa forma, a IA atuou como uma ferramenta de orientação e apoio ao
desenvolvimento, enquanto a implementação e as decisões finais
permaneceram sob responsabilidade do aluno.
