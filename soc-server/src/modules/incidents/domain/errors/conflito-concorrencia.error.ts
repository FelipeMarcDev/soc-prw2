import { DomainError } from '../../../../shared/domain/domain.error';

export class ConflitoConcorrenciaError extends DomainError {
  constructor(id: string) {
    super(`O incidente ${id} foi alterado por outra ação. Recarregue e tente novamente.`);
  }
}
