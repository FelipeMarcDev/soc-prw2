import { Injectable } from '@nestjs/common';
import { Incident } from '../../domain/entities/incident.entity';
import {
  CreateIncidentData,
  IncidentRepository,
} from '../../domain/repositories/incident.repository';

@Injectable()
export class CreateIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  execute(input: CreateIncidentData): Promise<Incident> {
    return this.repository.create(input);
  }
}
