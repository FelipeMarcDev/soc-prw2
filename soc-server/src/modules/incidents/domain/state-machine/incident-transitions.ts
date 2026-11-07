import { StatusIncidente } from '../enums/incident.enums';

export type AcaoIncidente = 'triar' | 'conter' | 'erradicar' | 'encerrar';

export const TRANSICOES: Record<
  AcaoIncidente,
  { de: StatusIncidente[]; para: StatusIncidente }
> = {
  triar:     { de: ['ALERTA'],       para: 'QUALIFICACAO' },
  conter:    { de: ['QUALIFICACAO'], para: 'CONTENCAO' },
  erradicar: { de: ['CONTENCAO'],    para: 'ERRADICACAO' },
  encerrar:  { de: ['ERRADICACAO'],  para: 'POS_MORTEM' },
};