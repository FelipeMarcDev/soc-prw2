import { Incident } from '../../domain/entities/incident.entity';

export class IncidentResponseDto {
  id: string;
  title: string;
  description: string;
  fonteAlerta: string;
  ativoAfetado: string;
  analista: string;
  severidade: string;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;

  static fromDomain(incident: Incident): IncidentResponseDto {
    return {
      id: incident.id,
      title: incident.title,
      description: incident.description,
      fonteAlerta: incident.fonteAlerta,
      ativoAfetado: incident.ativoAfetado,
      analista: incident.analista,
      severidade: incident.severidade,
      status: incident.status,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
    };
  }
}
