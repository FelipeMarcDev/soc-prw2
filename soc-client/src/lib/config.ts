export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type FonteAlerta = "FIREWALL" | "SIEM" | "IDS" | "EDR" | "OUTRO";
export type Severidade = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
export type StatusIncidente =
  | "ALERTA"
  | "QUALIFICACAO"
  | "CONTENCAO"
  | "ERRADICACAO"
  | "POS_MORTEM";

export interface Incident {
  id: string;
  title: string;
  description: string;
  fonteAlerta: FonteAlerta;
  ativoAfetado: string;
  analista: string;
  severidade: Severidade;
  status: StatusIncidente;
  createdAt: string;
}

export const STATUS_LABEL: Record<StatusIncidente, string> = {
  ALERTA: "Alerta Disparado",
  QUALIFICACAO: "Qualificação da Ameaça",
  CONTENCAO: "Contenção Temporária",
  ERRADICACAO: "Erradicação",
  POS_MORTEM: "Pós-Morte",
};

export const SEVERIDADE_LABEL: Record<Severidade, string> = {
  BAIXA: "P4 · Baixa",
  MEDIA: "P3 · Média",
  ALTA: "P2 · Alta",
  CRITICA: "P1 · Crítica",
};

export type AcaoIncidente = "triar" | "conter" | "erradicar" | "encerrar";

/** Única ação disponível em cada status (espelha a tabela de transições do back). */
export const ACAO_POR_STATUS: Record<
  StatusIncidente,
  { acao: AcaoIncidente; label: string } | null
> = {
  ALERTA: { acao: "triar", label: "Triar" },
  QUALIFICACAO: { acao: "conter", label: "Conter" },
  CONTENCAO: { acao: "erradicar", label: "Erradicar" },
  ERRADICACAO: { acao: "encerrar", label: "Encerrar" },
  POS_MORTEM: null,
};

export const FONTE_LABEL: Record<FonteAlerta, string> = {
  FIREWALL: "Firewall",
  SIEM: "SIEM",
  IDS: "IDS",
  EDR: "EDR",
  OUTRO: "Outro",
};

export interface IncidentInput {
  title: string;
  description: string;
  fonteAlerta: FonteAlerta;
  ativoAfetado: string;
  analista: string;
  severidade: Severidade;
}

export type Papel = "ANALISTA_N1" | "ANALISTA_N2" | "GESTOR_SOC";

export interface Usuario {
  id: string;
  nome: string;
  papel: Papel;
}
