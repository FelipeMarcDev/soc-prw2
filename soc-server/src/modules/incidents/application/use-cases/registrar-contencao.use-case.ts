import { Injectable } from '@nestjs/common';
import { Usuario } from '../../../users/domain/entities/usuario.entity';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import {
  AcaoContencao,
  IncidentRepository,
} from '../../domain/repositories/incident.repository';

@Injectable()
export class RegistrarContencaoUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(
    incidentId: string,
    usuario: Usuario,
    descricao: string,
  ): Promise<AcaoContencao> {
    const incident = await this.repository.findById(incidentId);
    if (!incident) throw new IncidentNotFoundError(incidentId);

    incident.validarRegistroContencao(usuario);

    return this.repository.addContencao(incidentId, descricao, usuario.id);
  }
}
