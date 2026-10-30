import { Injectable } from '@nestjs/common';
import { Incident } from '../../domain/entities/incident.entity';
import { IncidentRepository } from '../../domain/repositories/incident.repository';

@Injectable()
export class ListIncidentsUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  execute(): Promise<Incident[]> {
    return this.repository.findAll();
  }
}
