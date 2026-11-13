import { Papel } from '../../../users/domain/enums/papel.enum';
import { Severidade } from '../enums/incident.enums';
import { AcaoIncidente } from './incident-transitions';

/** Ações sujeitas à matriz: as transições de estado e a reclassificação de severidade. */
export type AcaoControlada = AcaoIncidente | 'reclassificar';

/** Hierarquia: um papel maior pode tudo que os menores podem. */
const NIVEL_PAPEL: Record<Papel, number> = {
  ANALISTA_N1: 1,
  ANALISTA_N2: 2,
  GESTOR_SOC: 3,
};

/** P1 e P2 exigem mais senioridade. */
const ALTA_CRITICIDADE: Severidade[] = ['CRITICA', 'ALTA'];

/**
 * Matriz de permissões: papel mínimo exigido por ação e por criticidade.
 * `padrao` vale para P3/P4; `altaCriticidade` vale para P1/P2 (severidade ATUAL do incidente).
 */
export const PAPEL_MINIMO: Record<
  AcaoControlada,
  { padrao: Papel; altaCriticidade: Papel }
> = {
  triar:         { padrao: 'ANALISTA_N1', altaCriticidade: 'ANALISTA_N1' },
  conter:        { padrao: 'ANALISTA_N2', altaCriticidade: 'ANALISTA_N2' },
  erradicar:     { padrao: 'ANALISTA_N2', altaCriticidade: 'ANALISTA_N2' },
  encerrar:      { padrao: 'ANALISTA_N2', altaCriticidade: 'GESTOR_SOC' },
  // Rebaixar um P1/P2 (e assim escapar do post-mortem) é decisão do gestor.
  reclassificar: { padrao: 'ANALISTA_N2', altaCriticidade: 'GESTOR_SOC' },
};

export function papelMinimo(acao: AcaoControlada, severidade: Severidade): Papel {
  const regra = PAPEL_MINIMO[acao];
  return ALTA_CRITICIDADE.includes(severidade) ? regra.altaCriticidade : regra.padrao;
}

export function podeExecutar(
  papel: Papel,
  acao: AcaoControlada,
  severidade: Severidade,
): boolean {
  return NIVEL_PAPEL[papel] >= NIVEL_PAPEL[papelMinimo(acao, severidade)];
}

/** P1 e P2 só podem ser encerrados com post-mortem preenchido. */
export function exigePostMortem(severidade: Severidade): boolean {
  return ALTA_CRITICIDADE.includes(severidade);
}

/** Registrar o post-mortem exige Analista N2 ou superior. */
export function podeRegistrarPostMortem(papel: Papel): boolean {
  return NIVEL_PAPEL[papel] >= NIVEL_PAPEL.ANALISTA_N2;
}

/** Registrar ação de contenção exige Analista N2 ou superior (mesmo nível de `conter`). */
export function podeRegistrarContencao(papel: Papel): boolean {
  return NIVEL_PAPEL[papel] >= NIVEL_PAPEL.ANALISTA_N2;
}
