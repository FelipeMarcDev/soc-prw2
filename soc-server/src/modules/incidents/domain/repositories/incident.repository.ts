import { Incident } from '../entities/incident.entity';
import { FonteAlerta, Severidade, StatusIncidente } from '../enums/incident.enums';

export interface CreateIncidentData {
  title: string;
  description: string;
  fonteAlerta: FonteAlerta;
  ativoAfetado: string;
  analista: string;
  severidade: Severidade;
}

/** Só campos descritivos: o status muda apenas por ações da máquina de estados. */
export type UpdateIncidentData = CreateIncidentData;

/**
 * Porta (contrato) do repositório. Classe abstrata para servir
 * também como token de injeção de dependência do Nest.
 */
export abstract class IncidentRepository {
  abstract findAll(): Promise<Incident[]>;
  abstract findById(id: string): Promise<Incident | null>;
  abstract create(data: CreateIncidentData): Promise<Incident>;
  abstract update(id: string, data: UpdateIncidentData): Promise<Incident>;
  abstract updateStatus(id: string, status: StatusIncidente): Promise<Incident>;
}
