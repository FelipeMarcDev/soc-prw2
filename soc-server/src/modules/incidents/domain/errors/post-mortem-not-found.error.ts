import { NotFoundError } from '../../../../shared/domain/domain.error';

export class PostMortemNotFoundError extends NotFoundError {
  constructor(incidentId: string) {
    super(`Post-mortem do incidente ${incidentId} não encontrado`);
  }
}
