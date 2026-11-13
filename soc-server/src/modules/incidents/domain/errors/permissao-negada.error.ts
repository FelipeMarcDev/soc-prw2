import { ForbiddenError } from '../../../../shared/domain/domain.error';

export class PermissaoNegadaError extends ForbiddenError {
  constructor(
    papel: string,
    acao: string,
    nivel: string,
    papelExigido: string,
  ) {
    super(
      `${papel} não pode executar "${acao}" em incidente ${nivel} (exige ${papelExigido} ou superior)`,
    );
  }
}
