import { Injectable } from '@nestjs/common';
import { Usuario } from '../../../users/domain/entities/usuario.entity';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import {
  IncidentRepository,
  PostMortem,
  PostMortemData,
} from '../../domain/repositories/incident.repository';

@Injectable()
export class RegistrarPostMortemUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(
    incidentId: string,
    usuario: Usuario,
    data: PostMortemData,
  ): Promise<PostMortem> {
    const incident = await this.repository.findById(incidentId);
    if (!incident) throw new IncidentNotFoundError(incidentId);

    incident.validarRegistroPostMortem(usuario);

    return this.repository.savePostMortem(incidentId, data, usuario.id);
  }
}
