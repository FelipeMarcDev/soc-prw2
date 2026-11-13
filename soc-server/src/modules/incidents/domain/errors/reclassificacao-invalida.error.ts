import { DomainError } from '../../../../shared/domain/domain.error';

export class ReclassificacaoInvalidaError extends DomainError {
  constructor(motivo: string) {
    super(`Reclassificação inválida: ${motivo}`);
  }
}
