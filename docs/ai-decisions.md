# Decisões com IA — Projeto 19 (Incidentes SOC)

Ferramenta: Claude (Anthropic). Escopo: Parte 1 — máquina de estados, transições restritas e RBAC.

---

## Consulta 1 — Restringir transições de status

**O Desafio:** o sistema aceitava qualquer status (ex.: `ALERTA → POS_MORTEM`), pelo `PATCH /status` e pelo `PUT`.

**O Prompt Utilizado:**
> esse é o projeto atual, analise e me guie para a parte 1

**A Resposta Bruta da IA:** (trecho)
```ts
export const TRANSICOES = {
  triar:     { de: ['ALERTA'],       para: 'QUALIFICACAO' },
  confirmar: { de: ['QUALIFICACAO'], para: 'CONTENCAO' },
  conter:    { de: ['CONTENCAO'],    para: 'ERRADICACAO' },
  erradicar: { de: ['ERRADICACAO'],  para: 'POS_MORTEM' },
  encerrar:  { de: ['POS_MORTEM'],   para: 'POS_MORTEM' },
};
// entidade: aplicar(acao, justificativa) valida contra a tabela
// controller: um endpoint POST por ação
```

**A Crítica e Refatoração do Aluno:**
- A IA propôs `confirmar` sem endpoint no controller: o fluxo travava em `QUALIFICACAO`. Removi a ação.
- `encerrar` ia de `POS_MORTEM` para `POS_MORTEM` (não muda nada). Corrigi para `ERRADICACAO → POS_MORTEM`.
- A IA sugeriu estados novos (`ABERTO`, `EM_TRIAGEM`) que não existem no meu schema. Mantive os 5 estados atuais, sem migration.
- O esboço usava o tipo `Usuario`, inexistente no projeto naquele momento (erro de compilação). Removi até existir RBAC (Consulta 2).
- Deixou o `PUT` aceitando `status`, contornando a máquina. Achei na revisão e removi `status` do DTO e do tipo do repositório.
- Dois arquivos da lista de remoção ficaram no projeto (`delete-incident.use-case.ts` e `confirm-dialog.tsx`). O `nest start --watch` não acusou, mas o `nest build` falhou, porque compila o projeto inteiro. Apaguei.
- Ajustes de integração: imports faltando no controller e nomes de arquivo divergentes.

---

## Consulta 2 — Usuários, papéis e permissão por ação e severidade (RBAC)

**O Desafio:** definir quem pode executar cada ação, considerando a severidade (P1/P2 exigem mais senioridade), sem hardcodar regra no controller.

**O Prompt Utilizado:**
> bora pra fase 2

(depois de o plano com RBAC ter sido proposto na Consulta 1)

**A Resposta Bruta da IA:** (trecho)
```ts
export const PAPEL_MINIMO: Record<AcaoIncidente, { padrao: Papel; altaCriticidade: Papel }> = {
  triar:     { padrao: 'ANALISTA_N1', altaCriticidade: 'ANALISTA_N1' },
  conter:    { padrao: 'ANALISTA_N2', altaCriticidade: 'ANALISTA_N2' },
  erradicar: { padrao: 'ANALISTA_N2', altaCriticidade: 'ANALISTA_N2' },
  encerrar:  { padrao: 'ANALISTA_N2', altaCriticidade: 'GESTOR_SOC' },
};

aplicar(acao, usuario, justificativa) {
  if (!podeExecutar(usuario.papel, acao, this.props.severidade)) throw new PermissaoNegadaError(...);
  if (!regra.de.includes(this.props.status)) throw new InvalidTransitionError(...);
  ...
}
```
Autenticação: guard que lê o header `X-User-Id` e carrega o usuário do banco; usuários de demonstração criados por um seeder na subida da aplicação.

**A Crítica e Refatoração do Aluno:**
- **A matriz é uma premissa, não uma verdade.** Os papéis mínimos de cada ação foram propostos pela IA. Não vêm do enunciado. Revisei e mantive: o que o enunciado exige (P1/P2 só encerrados por gestor) está atendido, o resto é uma escolha minha, documentada no README.
- **Autenticação simulada.** O header `X-User-Id` permite que qualquer cliente se passe por qualquer usuário. É aceitável para a disciplina, mas não é segurança de verdade. Deixei explícito no README. A regra de autorização está no domínio e não depende de como o usuário é identificado, então trocar por JWT depois não muda a matriz.
- **Ordem das verificações.** A IA checa a permissão antes da transição de estado: um N1 que tenta pular etapa recebe 403 e não 422. Aceitei porque a permissão depende só da ação e da severidade, e assim o erro não revela o estado do incidente a quem não tem direito de agir.
- **CORS.** Sem liberar `X-User-Id` em `allowedHeaders`, o navegador bloquearia as chamadas do front. Isso não estava no plano inicial e foi incluído durante a implementação.
- **O que a IA não validou.** Ela testou só a lógica de domínio (11 casos, incluindo a matriz). Não conseguiu rodar banco, migration, seed nem tela. A migration foi deixada para o `prisma migrate dev` gerar. Esses pontos eu testei na minha máquina.
- **Limitações que continuam:** os botões aparecem para qualquer usuário e o 403 do back é exibido na tela (o front não duplica a regra); criar e editar incidente ainda não exigem usuário e `analista` segue como texto livre; `justificativa` e `autorId` chegam ao domínio mas ainda não são gravados.

---

## Pendências

- [x] Tabela de transições, erro de domínio, use case único, endpoints `triar/conter/erradicar/encerrar`
- [x] Remover `status` do `PUT`
- [x] Remover código antigo e o `DELETE`
- [x] Atualizar o front (botão por ação, justificativa obrigatória)
- [x] Usuários, papéis e RBAC por ação e severidade
- [ ] Guarda: P1/P2 exigem post-mortem para encerrar
- [ ] SLA por severidade e escalonamento
- [ ] Audit log em transação (justificativa e autor gravados)
- [ ] Imutabilidade dos logs de contenção
