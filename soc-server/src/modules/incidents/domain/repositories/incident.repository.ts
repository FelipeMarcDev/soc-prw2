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

/** Uma mudança de status a ser aplicada e registrada no histórico. */
export interface Transicao {
  estadoAnterior: StatusIncidente;
  novoEstado: StatusIncidente;
  autorId: string;
  justificativa: string;
}

export interface PostMortemData {
  causaRaiz: string;
  linhaDoTempo: string;
  licoesAprendidas: string;
  acoesCorretivas: string;
}

export interface PostMortem extends PostMortemData {
  id: string;
  incidentId: string;
  autorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcaoContencao {
  id: string;
  incidentId: string;
  descricao: string;
  autorId: string;
  autorNome: string;
  createdAt: Date;
}

/** Troca de severidade a ser aplicada e registrada no histórico. */
export interface Reclassificacao {
  severidadeAnterior: Severidade;
  severidadeNova: Severidade;
  estado: StatusIncidente;
  autorId: string;
  justificativa: string;
}

/** Linha do audit log. */
export interface HistoricoStatus {
  id: string;
  acao: string;
  severidadeAnterior: Severidade | null;
  severidadeNova: Severidade | null;
  estadoAnterior: StatusIncidente;
  novoEstado: StatusIncidente;
  autorId: string;
  autorNome: string;
  justificativa: string;
  createdAt: Date;
}

/**
 * Só campos descritivos. Status muda só por ações da máquina de estados e
 * severidade só pela ação `reclassificar` (com permissão e auditoria).
 */
export type UpdateIncidentData = Omit<CreateIncidentData, 'severidade'>;

/**
 * Porta (contrato) do repositório. Classe abstrata para servir
 * também como token de injeção de dependência do Nest.
 */
export abstract class IncidentRepository {
  abstract findAll(): Promise<Incident[]>;
  abstract findById(id: string): Promise<Incident | null>;
  abstract create(data: CreateIncidentData): Promise<Incident>;
  abstract update(id: string, data: UpdateIncidentData): Promise<Incident>;
  /**
   * Atualiza o status e grava o histórico na MESMA transação (tudo ou nada).
   * Falha com ConflitoConcorrenciaError se o status mudou desde a leitura.
   */
  abstract applyTransition(id: string, transicao: Transicao): Promise<Incident>;
  abstract findHistory(incidentId: string): Promise<HistoricoStatus[]>;
  abstract applyReclassificacao(id: string, r: Reclassificacao): Promise<Incident>;
  /** Log imutável (trigger no banco): só existe inserir e ler. */
  abstract addContencao(
    incidentId: string,
    descricao: string,
    autorId: string,
  ): Promise<AcaoContencao>;
  abstract findContencoes(incidentId: string): Promise<AcaoContencao[]>;
  abstract countContencoes(incidentId: string): Promise<number>;
  abstract findPostMortem(incidentId: string): Promise<PostMortem | null>;
  abstract savePostMortem(
    incidentId: string,
    data: PostMortemData,
    autorId: string,
  ): Promise<PostMortem>;
}
