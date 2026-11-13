import { Injectable } from '@nestjs/common';
import { Usuario } from '../../../users/domain/entities/usuario.entity';
import { Incident } from '../../domain/entities/incident.entity';
import { Severidade } from '../../domain/enums/incident.enums';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import { IncidentRepository } from '../../domain/repositories/incident.repository';

@Injectable()
export class ReclassificarIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(
    id: string,
    nova: Severidade,
    usuario: Usuario,
    justificativa: string,
  ): Promise<Incident> {
    const incident = await this.repository.findById(id);
    if (!incident) throw new IncidentNotFoundError(id);

    const reclassificacao = incident.reclassificar(nova, usuario, justificativa);

    return this.repository.applyReclassificacao(id, reclassificacao);
  }
}
