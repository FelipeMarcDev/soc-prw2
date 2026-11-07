import { FonteAlerta, Severidade, StatusIncidente } from '../enums/incident.enums';
import { InvalidTransitionError } from '../errors/invalid-transition.error';
import { AcaoIncidente, TRANSICOES } from '../state-machine/incident-transitions';

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

  /** Incidente na fase final (Pós-Morte). */
  get isClosed(): boolean {
    return this.props.status === StatusIncidente.POS_MORTEM;
  }

  /** Valida a ação contra a máquina de estados e devolve a transição. */
  aplicar(acao: AcaoIncidente, justificativa: string) {
    const regra = TRANSICOES[acao];

    if (!regra.de.includes(this.props.status)) {
      throw new InvalidTransitionError(acao, this.props.status);
    }

    return {
      estadoAnterior: this.props.status,
      novoEstado: regra.para,
      justificativa,
    };
  }
}