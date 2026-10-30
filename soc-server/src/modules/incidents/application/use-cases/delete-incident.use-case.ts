import { Injectable } from '@nestjs/common';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import { IncidentRepository } from '../../domain/repositories/incident.repository';

@Injectable()
export class DeleteIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) throw new IncidentNotFoundError(id);
    await this.repository.delete(id);
  }
}
