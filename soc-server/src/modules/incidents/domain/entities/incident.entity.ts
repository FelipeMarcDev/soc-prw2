import { Usuario } from '../../../users/domain/entities/usuario.entity';
import {
  FonteAlerta,
  NIVEL_SEVERIDADE,
  Severidade,
  StatusIncidente,
} from '../enums/incident.enums';
import { InvalidTransitionError } from '../errors/invalid-transition.error';
import { ContencaoForaDaEtapaError } from '../errors/contencao-fora-da-etapa.error';
import { ContencaoObrigatoriaError } from '../errors/contencao-obrigatoria.error';
import { ReclassificacaoInvalidaError } from '../errors/reclassificacao-invalida.error';
import { PermissaoNegadaError } from '../errors/permissao-negada.error';
import { PostMortemForaDaEtapaError } from '../errors/post-mortem-fora-da-etapa.error';
import { PostMortemObrigatorioError } from '../errors/post-mortem-obrigatorio.error';
import {
  exigePostMortem,
  papelMinimo,
  podeExecutar,
  podeRegistrarContencao,
  podeRegistrarPostMortem,
} from '../state-machine/incident-permissions';
import { calcularSla, Sla } from '../sla/sla';
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
  closedAt: Date | null;
}

/** Dados de fora do incidente de que as guardas de transição precisam. */
export interface ContextoTransicao {
  postMortemRegistrado: boolean;
  acoesContencao: number;
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
  get closedAt() { return this.props.closedAt; }

  /** Incidente na fase final (Pós-Morte). */
  get isClosed(): boolean {
    return this.props.status === StatusIncidente.POS_MORTEM;
  }

  /**
   * Valida a ação, nesta ordem: permissão do usuário (papel x severidade),
   * máquina de estados e guardas (contenção ao erradicar; post-mortem ao encerrar P1/P2).
   * Devolve a transição a ser gravada.
   */
  aplicar(
    acao: AcaoIncidente,
    usuario: Usuario,
    justificativa: string,
    contexto: ContextoTransicao,
  ) {
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

    if (acao === 'erradicar' && contexto.acoesContencao === 0) {
      throw new ContencaoObrigatoriaError();
    }

    if (
      acao === 'encerrar' &&
      exigePostMortem(this.props.severidade) &&
      !contexto.postMortemRegistrado
    ) {
      throw new PostMortemObrigatorioError(NIVEL_SEVERIDADE[this.props.severidade]);
    }

    return {
      estadoAnterior: this.props.status,
      novoEstado: regra.para,
      autorId: usuario.id,
      justificativa,
    };
  }

  /** Quem pode registrar o post-mortem e em qual etapa. */
  validarRegistroPostMortem(usuario: Usuario) {
    if (!podeRegistrarPostMortem(usuario.papel)) {
      throw new PermissaoNegadaError(
        usuario.papel,
        'registrar post-mortem',
        NIVEL_SEVERIDADE[this.props.severidade],
        'ANALISTA_N2',
      );
    }
    if (this.props.status !== StatusIncidente.ERRADICACAO) {
      throw new PostMortemForaDaEtapaError(this.props.status);
    }
  }

  /** Quem pode registrar ações de contenção e em qual etapa. */
  validarRegistroContencao(usuario: Usuario) {
    if (!podeRegistrarContencao(usuario.papel)) {
      throw new PermissaoNegadaError(
        usuario.papel,
        'registrar contenção',
        NIVEL_SEVERIDADE[this.props.severidade],
        'ANALISTA_N2',
      );
    }
    if (this.props.status !== StatusIncidente.CONTENCAO) {
      throw new ContencaoForaDaEtapaError(this.props.status);
    }
  }

  /**
   * Troca a severidade (e, por consequência, o SLA). A permissão é medida pela
   * severidade ATUAL: rebaixar P1/P2 exige gestor.
   */
  reclassificar(nova: Severidade, usuario: Usuario, justificativa: string) {
    if (!podeExecutar(usuario.papel, 'reclassificar', this.props.severidade)) {
      throw new PermissaoNegadaError(
        usuario.papel,
        'reclassificar',
        NIVEL_SEVERIDADE[this.props.severidade],
        papelMinimo('reclassificar', this.props.severidade),
      );
    }
    if (this.props.status === StatusIncidente.POS_MORTEM) {
      throw new ReclassificacaoInvalidaError('incidente já encerrado');
    }
    if (nova === this.props.severidade) {
      throw new ReclassificacaoInvalidaError(
        `a severidade já é ${NIVEL_SEVERIDADE[nova]}`,
      );
    }
    return {
      severidadeAnterior: this.props.severidade,
      severidadeNova: nova,
      estado: this.props.status,
      autorId: usuario.id,
      justificativa,
    };
  }

  /** SLA calculado na hora da consulta (sem cron). */
  sla(agora: Date = new Date()): Sla {
    return calcularSla(
      this.props.severidade,
      this.props.createdAt,
      agora,
      this.props.closedAt,
    );
  }
}
