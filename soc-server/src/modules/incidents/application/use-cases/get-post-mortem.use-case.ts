import { Injectable } from '@nestjs/common';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import { PostMortemNotFoundError } from '../../domain/errors/post-mortem-not-found.error';
import {
  IncidentRepository,
  PostMortem,
} from '../../domain/repositories/incident.repository';

@Injectable()
export class GetPostMortemUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(incidentId: string): Promise<PostMortem> {
    const incident = await this.repository.findById(incidentId);
    if (!incident) throw new IncidentNotFoundError(incidentId);
    const postMortem = await this.repository.findPostMortem(incidentId);
    if (!postMortem) throw new PostMortemNotFoundError(incidentId);
    return postMortem;
  }
}
