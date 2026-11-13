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
    // Só consulta o que a guarda da ação precisa.
    const contexto = {
      postMortemRegistrado:
        acao === 'encerrar'
          ? (await this.repository.findPostMortem(id)) !== null
          : false,
      acoesContencao:
        acao === 'erradicar' ? await this.repository.countContencoes(id) : 0,
    };
    const transicao = incident.aplicar(acao, usuario, justificativa, contexto);

    return this.repository.applyTransition(id, transicao);
  }
}