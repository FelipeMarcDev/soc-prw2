import { Injectable } from '@nestjs/common';
import { Incident } from '../../domain/entities/incident.entity';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import {
  IncidentRepository,
  UpdateIncidentData,
} from '../../domain/repositories/incident.repository';

@Injectable()
export class UpdateIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(id: string, input: UpdateIncidentData): Promise<Incident> {
    const exists = await this.repository.findById(id);
    if (!exists) throw new IncidentNotFoundError(id);
    return this.repository.update(id, input);
  }
}
