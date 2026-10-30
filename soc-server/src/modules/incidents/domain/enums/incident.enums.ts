export const FonteAlerta = {
  FIREWALL: 'FIREWALL',
  SIEM: 'SIEM',
  IDS: 'IDS',
  EDR: 'EDR',
  OUTRO: 'OUTRO',
} as const;
export type FonteAlerta = (typeof FonteAlerta)[keyof typeof FonteAlerta];

export const Severidade = {
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA',
} as const;
export type Severidade = (typeof Severidade)[keyof typeof Severidade];

export const StatusIncidente = {
  ALERTA: 'ALERTA',
  QUALIFICACAO: 'QUALIFICACAO',
  CONTENCAO: 'CONTENCAO',
  ERRADICACAO: 'ERRADICACAO',
  POS_MORTEM: 'POS_MORTEM',
} as const;
export type StatusIncidente =
  (typeof StatusIncidente)[keyof typeof StatusIncidente];
