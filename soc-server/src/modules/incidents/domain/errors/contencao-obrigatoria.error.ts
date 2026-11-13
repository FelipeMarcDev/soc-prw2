import { DomainError } from '../../../../shared/domain/domain.error';

export class ContencaoObrigatoriaError extends DomainError {
  constructor() {
    super('Registre ao menos uma ação de contenção antes de erradicar');
  }
}
