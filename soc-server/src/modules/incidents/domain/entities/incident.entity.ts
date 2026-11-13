import { Usuario } from '../../../users/domain/entities/usuario.entity';
import {
  FonteAlerta,
  NIVEL_SEVERIDADE,
  Severidade,
  StatusIncidente,
} from '../enums/incident.enums';
import { InvalidTransitionError } from '../errors/invalid-transition.error';
import { PermissaoNegadaError } from '../errors/permissao-negada.error';
import { papelMinimo, podeExecutar } from '../state-machine/incident-permissions';
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

  /**
   * Valida a ação: primeiro a permissão do usuário (papel x severidade),
   * depois a máquina de estados. Devolve a transição a ser gravada.
   */
  aplicar(acao: AcaoIncidente, usuario: Usuario, justificativa: string) {
    if (!podeExecutar(usuario.papel, acao, this.props.severidade)) {
      throw new PermissaoNegadaError(
        usuario.papel,
        acao,
        NIVEL_SEVERIDADE[this.props.severidade],
        papelMinimo(acao, this.props.severidade),
      );
    }

    const regra = TRANSICOES[acao];
    if (!regra.de.includes(this.props.status)) {
      throw new InvalidTransitionError(acao, this.props.status);
    }

    return {
      estadoAnterior: this.props.status,
      novoEstado: regra.para,
      autorId: usuario.id,
      justificativa,
    };
  }
}
