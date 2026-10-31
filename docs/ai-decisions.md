2. Metodologia: O Uso Pedagógico e Crítico da IA

O Desafio: Máquina de Estados Finita e Transições Restritas

O Prompt Utilizado: Como posso fazer a restrição de troca de estados do formulário como não permitir de ALERTA -> POS-MORTEM

A Resposta Bruta da IA: 
```bash
O que é “máquina de estados” aqui

São 3 coisas juntas:

1. Estados: em que fase o incidente está (ex.: EM_TRIAGEM).

2. Transições permitidas: uma tabela dizendo de onde dá pra ir para onde, e por qual ação. Exemplo:

3. Regras extras (guardas e permissões): mesmo que a transição seja válida, ela pode ser barrada. Exemplos:

Guarda: “não pode encerrar um P1(CRITICA) sem post-mortem preenchido”.
Permissão: “analista N1 não pode encerrar P1(CRITICA), só o gestor”.
```

A Crítica e Refatoração do Aluno: O que a IA errou  e o que o aluno precisou alterar para integrar de fato à arquitetura do projeto.
