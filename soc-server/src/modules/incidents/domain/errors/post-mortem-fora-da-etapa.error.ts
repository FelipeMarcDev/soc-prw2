import { DomainError } from '../../../../shared/domain/domain.error';

export class PostMortemForaDaEtapaError extends DomainError {
  constructor(statusAtual: string) {
    super(
      `O post-mortem só pode ser registrado na etapa ERRADICACAO (status atual: ${statusAtual})`,
    );
  }
}
