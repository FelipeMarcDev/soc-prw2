import { Severidade } from '../enums/incident.enums';

/** Prazo máximo para encerrar o incidente, contado a partir da abertura. */
export const PRAZO_SLA_MINUTOS: Record<Severidade, number> = {
  CRITICA: 4 * 60, // P1: 4 h
  ALTA: 8 * 60, // P2: 8 h
  MEDIA: 24 * 60, // P3: 24 h
  BAIXA: 72 * 60, // P4: 72 h
};

/** Quando resta 25% do prazo (ou menos), o SLA entra em risco e o gestor é avisado. */
export const LIMIAR_EM_RISCO = 0.25;

export type SituacaoSla = 'NO_PRAZO' | 'EM_RISCO' | 'ESTOURADO' | 'CUMPRIDO' | 'VIOLADO';
export type Escalonamento = 'NENHUM' | 'AVISO_GESTOR' | 'ESCALONADO';

export interface Sla {
  prazoMinutos: number;
  venceEm: Date;
  /** Minutos restantes (negativo = estourado). Nulo quando o incidente já foi encerrado. */
  restanteMinutos: number | null;
  situacao: SituacaoSla;
  escalonamento: Escalonamento;
}

/**
 * Calculado na leitura, sem cron: o vencimento é sempre `abertura + prazo da severidade ATUAL`.
 * Reclassificar a severidade recalcula o SLA, mas o relógio continua contando desde a abertura
 * (reclassificar não "zera" o prazo).
 */
export function calcularSla(
  severidade: Severidade,
  abertoEm: Date,
  agora: Date,
  encerradoEm: Date | null,
): Sla {
  const prazoMinutos = PRAZO_SLA_MINUTOS[severidade];
  const prazoMs = prazoMinutos * 60_000;
  const venceEm = new Date(abertoEm.getTime() + prazoMs);

  if (encerradoEm) {
    return {
      prazoMinutos,
      venceEm,
      restanteMinutos: null,
      situacao: encerradoEm.getTime() <= venceEm.getTime() ? 'CUMPRIDO' : 'VIOLADO',
      escalonamento: 'NENHUM',
    };
  }

  const restanteMs = venceEm.getTime() - agora.getTime();
  const restanteMinutos = Math.floor(restanteMs / 60_000);

  if (restanteMs <= 0) {
    return { prazoMinutos, venceEm, restanteMinutos, situacao: 'ESTOURADO', escalonamento: 'ESCALONADO' };
  }
  if (restanteMs <= prazoMs * LIMIAR_EM_RISCO) {
    return { prazoMinutos, venceEm, restanteMinutos, situacao: 'EM_RISCO', escalonamento: 'AVISO_GESTOR' };
  }
  return { prazoMinutos, venceEm, restanteMinutos, situacao: 'NO_PRAZO', escalonamento: 'NENHUM' };
}
