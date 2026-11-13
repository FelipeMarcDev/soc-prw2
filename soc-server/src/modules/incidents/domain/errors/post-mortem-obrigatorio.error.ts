import { DomainError } from '../../../../shared/domain/domain.error';

export class PostMortemObrigatorioError extends DomainError {
  constructor(nivel: string) {
    super(`Incidente ${nivel} só pode ser encerrado com post-mortem preenchido`);
  }
}
