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

export const STATUS_FLOW: StatusIncidente[] = [
  "ALERTA",
  "QUALIFICACAO",
  "CONTENCAO",
  "ERRADICACAO",
  "POS_MORTEM",
];

export const STATUS_LABEL: Record<StatusIncidente, string> = {
  ALERTA: "Alerta Disparado",
  QUALIFICACAO: "Qualificação da Ameaça",
  CONTENCAO: "Contenção Temporária",
  ERRADICACAO: "Erradicação",
  POS_MORTEM: "Pós-Morte",
};

export const SEVERIDADE_LABEL: Record<Severidade, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

export function nextStatus(current: StatusIncidente): StatusIncidente | null {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

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
