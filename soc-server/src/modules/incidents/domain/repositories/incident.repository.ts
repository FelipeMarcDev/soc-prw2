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

export interface UpdateIncidentData extends CreateIncidentData {
  status?: StatusIncidente;
}

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
  abstract delete(id: string): Promise<void>;
}
