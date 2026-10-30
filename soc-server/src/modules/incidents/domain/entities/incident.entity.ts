import { FonteAlerta, Severidade, StatusIncidente } from '../enums/incident.enums';

export interface IncidentProps {
  id: string;
  title: string;
  description: string;
  fonteAlerta: FonteAlerta;
  ativoAfetado: string;
  analista: string;
  severidade: Severidade;
  status: StatusIncidente;
  createdAt: Date;
  updatedAt: Date | null;
}

export class Incident {
  constructor(private readonly props: IncidentProps) {}

  get id() { return this.props.id; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get fonteAlerta() { return this.props.fonteAlerta; }
  get ativoAfetado() { return this.props.ativoAfetado; }
  get analista() { return this.props.analista; }
  get severidade() { return this.props.severidade; }
  get status() { return this.props.status; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  /** Incidente encerrado após a fase de Pós-Morte. */
  get isClosed(): boolean {
    return this.props.status === StatusIncidente.POS_MORTEM;
  }
}
