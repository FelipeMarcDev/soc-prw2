import { Injectable } from '@nestjs/common';
import { Incident } from '../../domain/entities/incident.entity';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import { IncidentRepository } from '../../domain/repositories/incident.repository';

@Injectable()
export class GetIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(id: string): Promise<Incident> {
    const incident = await this.repository.findById(id);
    if (!incident) throw new IncidentNotFoundError(id);
    return incident;
  }
}
