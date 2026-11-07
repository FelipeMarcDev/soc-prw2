# Decisões com IA — Projeto 19 (Incidentes SOC)

Ferramenta: Claude (Anthropic). Escopo: Parte 1 — máquina de estados.

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
- `encerrar` ia de `POS_MORTEM` para `POS_MORTEM` (não muda nada). Corrigi para `ERRADICACAO → POS_MORTEM`
- A IA explicou como seguir com a mudança nas transições, que deveriam seguir um ciclo de vida e não somente uma troca de status.
- Foram criados diferentes endpoints no controller para mudança desse status.
---

## Próximas consultas
RBAC por estado/severidade · guarda de post-mortem P1/P2 · SLA · audit log ACID · imutabilidade dos logs de contenção.