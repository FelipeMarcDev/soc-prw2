import { Injectable } from '@nestjs/common';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import {
  AcaoContencao,
  IncidentRepository,
} from '../../domain/repositories/incident.repository';

@Injectable()
export class ListarContencoesUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(incidentId: string): Promise<AcaoContencao[]> {
    const incident = await this.repository.findById(incidentId);
    if (!incident) throw new IncidentNotFoundError(incidentId);
    return this.repository.findContencoes(incidentId);
  }
}
