import { NotFoundError } from '../../../../shared/domain/domain.error';

export class IncidentNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Incidente ${id} não encontrado`);
  }
}
