import { DomainError } from '../../../../shared/domain/domain.error';

export class InvalidTransitionError extends DomainError {
  constructor(acao: string, statusAtual: string) {
    super(
      `Não é possível executar "${acao}" em um incidente com status ${statusAtual}`,
    );
  }
}