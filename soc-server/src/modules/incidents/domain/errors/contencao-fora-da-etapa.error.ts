import { DomainError } from '../../../../shared/domain/domain.error';

export class ContencaoForaDaEtapaError extends DomainError {
  constructor(statusAtual: string) {
    super(
      `Ações de contenção só podem ser registradas na etapa CONTENCAO (status atual: ${statusAtual})`,
    );
  }
}
