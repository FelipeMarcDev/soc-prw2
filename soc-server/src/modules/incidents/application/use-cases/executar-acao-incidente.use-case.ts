import { Injectable } from '@nestjs/common';
import { Usuario } from '../../../users/domain/entities/usuario.entity';
import { Incident } from '../../domain/entities/incident.entity';
import { IncidentNotFoundError } from '../../domain/errors/incident-not-found.error';
import { IncidentRepository } from '../../domain/repositories/incident.repository';
import { AcaoIncidente } from '../../domain/state-machine/incident-transitions';

@Injectable()
export class ExecutarAcaoIncidenteUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  async execute(
    id: string,
    acao: AcaoIncidente,
    usuario: Usuario,
    justificativa: string,
  ): Promise<Incident> {
    const incident = await this.repository.findById(id);
    if (!incident) throw new IncidentNotFoundError(id);

    // A entidade valida (lança InvalidTransitionError se não pode)
    const transicao = incident.aplicar(acao, usuario, justificativa);

    return this.repository.updateStatus(id, transicao.novoEstado);
  }
}