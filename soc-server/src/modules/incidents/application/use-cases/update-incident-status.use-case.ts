import { Injectable } from '@nestjs/common';
import { Incident } from '../../domain/entities/incident.entity';
import { StatusIncidente } from '../../domain/enums/incident.enums';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import { IncidentRepository } from '../../domain/repositories/incident.repository';

@Injectable()
export class UpdateIncidentStatusUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(id: string, status: StatusIncidente): Promise<Incident> {
    const exists = await this.repository.findById(id);
    if (!exists) throw new IncidentNotFoundError(id);
    return this.repository.updateStatus(id, status);
  }
}
