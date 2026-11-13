import { Injectable } from '@nestjs/common';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import {
  HistoricoStatus,
  IncidentRepository,
} from '../../domain/repositories/incident.repository';

@Injectable()
export class GetIncidentHistoryUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(id: string): Promise<HistoricoStatus[]> {
    const incident = await this.repository.findById(id);
    if (!incident) throw new IncidentNotFoundError(id);
    return this.repository.findHistory(id);
  }
}
