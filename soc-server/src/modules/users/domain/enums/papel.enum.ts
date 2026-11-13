export const Papel = {
  ANALISTA_N1: 'ANALISTA_N1',
  ANALISTA_N2: 'ANALISTA_N2',
  GESTOR_SOC: 'GESTOR_SOC',
} as const;
export type Papel = (typeof Papel)[keyof typeof Papel];
